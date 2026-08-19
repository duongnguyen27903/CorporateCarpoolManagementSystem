import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as L from 'leaflet';

export interface GeocoderOptions {
  [key: string]: any;
}

@Injectable({
  providedIn: 'root',
})
export class GeoService {
  private options: GeocoderOptions = {};
  private map?: L.Map;

  constructor(private http: HttpClient) {}

  initialize(map: L.Map, options: GeocoderOptions = {}): void {
    this.map = map;
    this.options = options;
  }
  // Constructs a URL with query parameters based on the provided base URL and options.
  constructUrl(baseUrl: string, options: GeocoderOptions = {}): string {
    const mergedOpts = { ...this.options, ...options };
    let params = new HttpParams();

    for (const key in mergedOpts) {
      if (mergedOpts.hasOwnProperty(key)) {
        params = params.set(key, mergedOpts[key]);
      }
    }

    const url = new URL(baseUrl);
    url.search = params.toString();
    return url.toString();
  }
  // Fetches JSON data from the specified URL and returns an observable of the specified type.
  fetchJson<T = any>(url: string): Observable<T> {
    return this.http.get<T>(url);
  }
  // Places a marker on the map at the specified latitude and longitude, with an optional bounding box and place information.
  placeMarker(latlng: L.LatLngExpression, bbox: any, place: any): void {
    if (this.map && typeof (this.map as any).placeMarker === 'function') {
      (this.map as any).placeMarker(latlng, bbox, place);
    }
  }
  // Fires a Leaflet map event with the specified event name and payload.
  fire(type: string, data?: any): void {
    if (this.map) {
      this.map.fire(type, data);
    }
  }
  // Suggests places based on the provided address and returns an observable of SuggestionOption array.
  suggest(address: string, datalist: HTMLDataListElement): void {
    // Implement suggestion logic
  }
  // Looks up a place by its Open Street Map ID using the Nominatim API and returns an observable of NominatimPlace.
  lookup(id: string | number): void {
    // Implement lookup logic
  }
}