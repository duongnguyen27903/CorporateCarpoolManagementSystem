import { Injectable } from '@angular/core';
import { LatLngTuple } from 'leaflet';

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

interface DecodeResult {
  value: number;
  nextIndex: number;
}

@Injectable({
  providedIn: 'root',
})
export class PolylineUtilsService {

  /**
   * Encodes an array of geographic points into a single Polyline string.
   */
  encodePolyline(points: GeoPoint[]): string {
    if (!points || !points.length) return '';

    let str = '';
    let lastLat = 0;
    let lastLng = 0;

    for (const point of points) {
      // Scale values to 5 decimal places and round to nearest integer
      const lat = Math.round(point.latitude * 1e5);
      const lng = Math.round(point.longitude * 1e5);

      // Encode relative differences (deltas)
      str += this.encodeValue(lat - lastLat);
      str += this.encodeValue(lng - lastLng);

      lastLat = lat;
      lastLng = lng;
    }

    return str;
  }

  /**
   * Decodes an encoded Polyline string into an array of geographic points.
   * Returns array of [lat, lng] pairs (Leaflet-ready).
   */
  decodePolyline(encodedPolyline: string): LatLngTuple[] {
    if (!encodedPolyline) return [];

    const points: LatLngTuple[] = [];
    let index = 0;
    const len = encodedPolyline.length;
    let lat = 0;
    let lng = 0;

    while (index < len) {
      const resLat = this.decodeValue(encodedPolyline, index);
      lat += resLat.value;
      index = resLat.nextIndex;

      const resLng = this.decodeValue(encodedPolyline, index);
      lng += resLng.value;
      index = resLng.nextIndex;

      // Convert back to double and truncate to 5 decimal places
      let latVal = lat * 1e-5;
      let lngVal = lng * 1e-5;
      latVal = Math.trunc(latVal * 1e5) / 1e5;
      lngVal = Math.trunc(lngVal * 1e5) / 1e5;

      // Output directly as [lat, lng] coordinate arrays for Leaflet compatibility
      points.push([latVal, lngVal]);
    }

    return points;
  }

  // --- Helper Functions ---

  private encodeValue(value: number): string {
    let str = '';
    let zigzagValue = (value << 1) ^ (value >> 31);

    while (zigzagValue >= 0x20) {
      str += String.fromCharCode(((zigzagValue & 0x1f) | 0x20) + 63);
      zigzagValue >>>= 5; // Unsigned right shift for JS numbers
    }

    str += String.fromCharCode(zigzagValue + 63);
    return str;
  }

  private decodeValue(encoded: string, index: number): DecodeResult {
    let result = 0;
    let shift = 0;
    let b: number;

    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    const value = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    return { value, nextIndex: index };
  }
}