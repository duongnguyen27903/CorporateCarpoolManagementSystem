import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import * as L from 'leaflet';
import { GeoService } from './geo.service';

// open street map nominatim API documentation: https://nominatim.org/release-docs/develop/api/Search/
export interface NominatimPlace {
  lat: string;
  lon: string;
  boundingbox: [string, string, string, string];
  display_name: string;
  osm_type: string;
  osm_id: number;
  [key: string]: any;
}

export interface SuggestionOption {
  id: string;
  displayName: string;
}

@Injectable({
  providedIn: 'root',
})
export class NominatimService extends GeoService {
  //src/backend/CarpoolSystem.API/Controllers/GeoController.cs
  private readonly baseUrl = 'http://localhost:5147/api/geo/'; 

  constructor(http: HttpClient) {
    super(http);
  }
  // Marks a place on the map using its latitude and longitude, and sets the bounding box for the marker.
  mark(place: NominatimPlace): void {
    const latlng = L.latLng(parseFloat(place.lat), parseFloat(place.lon));
    const bb = place.boundingbox.map(Number);
    const bbox = L.latLngBounds(
      [bb[0], bb[2]],
      [bb[1], bb[3]]
    );

    this.placeMarker(latlng, bbox, place);
  }
  // Searches for places using the Nominatim API based on the provided address and returns an observable of NominatimPlace array.
  search(address: string): Observable<NominatimPlace[]> {
    const url = this.constructUrl(`${this.baseUrl}search`, {
      format: 'json',
      q: address,
    });
    return this.fetchJson<NominatimPlace[]>(url);
  }
  // Suggests places based on the provided address and returns an observable of SuggestionOption array.
  override suggest(address: string): Observable<SuggestionOption[]> {
    return this.search(address).pipe(
      map((places) =>
        places.map((v) => ({
          id: `${v.osm_type.charAt(0).toUpperCase()}${v.osm_id}`,
          displayName: v.display_name,
        }))
      ),
      catchError((error) => {
        this.fire('error', { source: 'nominatim.suggest', error });
        return throwError(() => error);
      })
    );
  }
  // Looks up a place by its Open Street Map ID using the Nominatim API and returns an observable of NominatimPlace.
  override lookup(id: string | number): Observable<NominatimPlace> {
    const url = this.constructUrl(`${this.baseUrl}lookup`, {
      format: 'json',
      osm_ids: id,
    });

    return this.fetchJson<NominatimPlace[]>(url).pipe(
      map((places) => {
        if (places && places.length > 0) {
          this.mark(places[0]);
          return places[0];
        }
        throw new Error('Place not found');
      }),
      catchError((error) => {
        this.fire('error', { source: 'nominatim.lookup', error });
        return throwError(() => error);
      })
    );
  }
  // Geocodes an address using the Nominatim API and returns an observable of NominatimPlace. If no places are found, it throws an error.
  geocode(address: string): Observable<NominatimPlace> {
    return this.search(address).pipe(
      map((places) => {
        if (!places || places.length < 1) {
          throw new Error('notfound');
        }
        this.mark(places[0]);
        return places[0];
      }),
      catchError((error) => {
        this.fire('error', { source: 'nominatim.geocode', error });
        return throwError(() => error);
      })
    );
  }
}