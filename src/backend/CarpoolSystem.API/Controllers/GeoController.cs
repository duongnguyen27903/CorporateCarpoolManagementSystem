using System;
using System.Collections.Concurrent;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CarpoolSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [AllowAnonymous]
    public class GeoController : ControllerBase
    {
        private static readonly SemaphoreSlim RateLimiter = new(1, 1);
        private static readonly ConcurrentDictionary<string, (DateTimeOffset CreatedAt, string Payload)> Cache = new(StringComparer.OrdinalIgnoreCase);
        private static readonly TimeSpan CacheDuration = TimeSpan.FromMinutes(30);
        private static DateTimeOffset _lastRequestAt = DateTimeOffset.MinValue;

        private readonly HttpClient _httpClient;

        public GeoController(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string q)
        {
            if (string.IsNullOrWhiteSpace(q))
            {
                return BadRequest("Query parameter 'q' is required.");
            }

            var normalizedQuery = q.Trim();
            var cacheKey = $"search:{normalizedQuery}";

            if (Cache.TryGetValue(cacheKey, out var cached) && DateTimeOffset.UtcNow - cached.CreatedAt < CacheDuration)
            {
                return Content(cached.Payload, "application/json");
            }

            await EnforceRateLimitAsync();
            // Prepare the request to Open Street Map Nominatim API
            // https://nominatim.org/release-docs/develop/api/Search/
            // Use Uri.EscapeDataString to ensure the query is properly encoded
            // Set the User-Agent header as required by the Nominatim usage policy
            // Set the Accept header to application/json to receive JSON responses
            // Limit the results to 1 for efficiency
            var request = new HttpRequestMessage(
                HttpMethod.Get,
                $"https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q={Uri.EscapeDataString(normalizedQuery)}");

            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            request.Headers.UserAgent.ParseAdd("CarpoolSystem/1.0 (+https://localhost:4200)");

            var response = await _httpClient.SendAsync(request);
            var payload = await response.Content.ReadAsStringAsync();

            if (response.IsSuccessStatusCode)
            {
                Cache[cacheKey] = (DateTimeOffset.UtcNow, payload);
            }

            if (!response.IsSuccessStatusCode)
            {
                return StatusCode((int)response.StatusCode, payload);
            }

            return Content(payload, "application/json");
        }

        [HttpGet("lookup")]
        public async Task<IActionResult> Lookup([FromQuery] string osm_ids)
        {
            if (string.IsNullOrWhiteSpace(osm_ids))
            {
                return BadRequest("Query parameter 'osm_ids' is required.");
            }

            var request = new HttpRequestMessage(
                HttpMethod.Get,
                $"https://nominatim.openstreetmap.org/lookup?format=jsonv2&osm_ids={Uri.EscapeDataString(osm_ids)}");

            await EnforceRateLimitAsync();
            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            request.Headers.UserAgent.ParseAdd("CarpoolSystem/1.0 (+https://localhost:4200)");

            var response = await _httpClient.SendAsync(request);
            var payload = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                return StatusCode((int)response.StatusCode, payload);
            }

            return Content(payload, "application/json");
        }

        private static async Task EnforceRateLimitAsync()
        {
            await RateLimiter.WaitAsync();
            try
            {
                var elapsed = DateTimeOffset.UtcNow - _lastRequestAt;
                if (elapsed < TimeSpan.FromSeconds(1.2))
                {
                    var delay = TimeSpan.FromSeconds(1.2) - elapsed;
                    await Task.Delay(delay);
                }

                _lastRequestAt = DateTimeOffset.UtcNow;
            }
            finally
            {
                RateLimiter.Release();
            }
        }
    }
}