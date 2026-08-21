import { ChangeDetectorRef, Component, OnInit, ElementRef, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap, takeUntil } from 'rxjs/operators';
import * as L from 'leaflet';
import { PolylineUtilsService } from '../../../src/app/services/polyline-utils.service';
import { NominatimService, NominatimPlace, SuggestionOption } from '../../../src/app/services/nominatim.service';
import { EmployeeSummary, MatchingService, VehicleSummary } from '../../../src/app/services/matching.service';

export interface RouteItem {
  id: string;
  routeDetailId: number;
  routeId: number;
  name: string;
  encodedPolyline: string;
}

export interface MapSearchOptions {
  fly?: boolean;
  createMarker?: (latlng: L.LatLngExpression) => L.Marker;
}

interface MarkerLocation {
  latitude: number;
  longitude: number;
}

@Component({
  selector: 'app-map-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapContainer') mapContainer!: ElementRef;

  private map!: L.Map;
  private pickupMarker: L.Marker | null = null;
  private dropoffMarker: L.Marker | null = null;
  private activeRouteLine: L.Polyline | null = null;
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();
  private marker?: L.Marker;

  departureTime = '08:00:00';
  pickupLocation: MarkerLocation | null = null;
  dropoffLocation: MarkerLocation | null = null;
  routes: RouteItem[] = [];
  selectedRoute: RouteItem | null = null;
  selectedDriver: EmployeeSummary | null = null;
  selectedVehicles: VehicleSummary[] = [];
  routeDetailsLoading = false;
  routeDetailsError = '';
  private routeDetailsCache = new Map<string, {
    driver: EmployeeSummary;
    vehicles: VehicleSummary[];
  }>();

  // routes: RouteItem[] = [
  //   {
  //     id: 'route-A',
  //     name: 'Route A',
  //     encodedPolyline: 'e}h_Ci~beSbWxAyK~LkGpRkEzS}CnPgE~TlI|X~WfTm@dWcCvh@_Q``@gE``@mTnm@yEtSuC~LcOrXgOlSoXrTySl^M`ZhH~PdPdc@tHxYzGdZjKpD'
  //   },
  //   {
  //     id: 'route-B',
  //     name: 'Route B',
  //     encodedPolyline: 'y|j_CeipdSqI}CoIc\\wH{S~EoWcY{P_F}MZi_@~RoXhc@cd@nWi^hEy_@dV}k@nR_Lc]gZoNoQeDm\\rCkOfTJz\\`MpCkQfA}^aKaZkNgFwC}WxKwi@oHcKvEkZ'
  //   }
  // ];

  searchQuery = '';
  suggestions: SuggestionOption[] = [];
  isOpen = false;
  options: MapSearchOptions = { fly: false };

  constructor(
    private polylineUtils: PolylineUtilsService,
    private geocoder: NominatimService,
    private matchingService: MatchingService,
    private changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.setupSearchSubscription();
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.refreshMapSize();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.map) {
      this.map.remove();
    }
  }

  // Equivalent to Ionic Page Lifecycle
  ionViewDidEnter(): void {
    this.refreshMapSize();
  }

  private refreshMapSize(): void {
    if (!this.map) {
      return;
    }

    requestAnimationFrame(() => {
      this.map.invalidateSize();
      setTimeout(() => this.map.invalidateSize(), 100);
    });
  }

  private initMap(): void {
    if (!this.mapContainer?.nativeElement) {
      return;
    }

    // Center map around Hanoi coordinates [21.0285, 105.8542]
    this.map = L.map(this.mapContainer.nativeElement).setView([21.0285, 105.8542], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    //this.geocoder.initialize(this.map);
    this.map.on('click', (e: L.LeafletMouseEvent) => this.handleMapClick(e));
  }

  private setupSearchSubscription(): void {
    this.searchSubject.pipe(
      filter((query) => query.length >= 2),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((query) => this.geocoder.suggest(query)),
      takeUntil(this.destroy$),
    ).subscribe({
      next: (results) => (this.suggestions = results),
      error: () => (this.suggestions = []),
    });
  }

  onInput(event: Event): void {
    const inputVal = (event.target as HTMLInputElement).value;
    this.searchSubject.next(inputVal);
  }

  onSelectOption(val: string): void {
    const selectedOption = this.suggestions.find((opt) => val.startsWith(opt.displayName));
    this.searchQuery = '';
    this.isOpen = false;

    if (selectedOption) {
      this.geocoder.lookup(selectedOption.id).subscribe((place) => {
        if (place) this.placeMarker(L.latLng(parseFloat(place.lat), parseFloat(place.lon)), null, place);
      });
    } else if (val) {
      this.geocode(val);
    }
  }

  geocode(address: string): void {
    this.geocoder.geocode(address).subscribe((place) => {
      if (place) this.placeMarker(L.latLng(parseFloat(place.lat), parseFloat(place.lon)), null, place);
    });
  }

  toggleSearch(): void {
    this.isOpen = !this.isOpen;
  }

  placeMarker(latlng: L.LatLngExpression, bbox: L.LatLngBoundsExpression | null, place: NominatimPlace): void {
    this.map.fire('geofound', { latlng, bbox, place });
    this.refreshMapSize();

    if (this.marker) {
      this.marker.setLatLng(latlng);
    } else {
      const createFn = this.options.createMarker || L.marker;
      this.marker = createFn(latlng).addTo(this.map);
    }

    if (this.options.fly) {
      bbox ? this.map.flyToBounds(bbox) : this.map.flyTo(latlng);
    } else {
      bbox ? this.map.fitBounds(bbox) : this.map.panTo(latlng);
    }
  }

  private handleMapClick(e: L.LeafletMouseEvent): void {
    const { lat, lng } = e.latlng;

    // Reset markers if both are already placed
    if (this.pickupMarker && this.dropoffMarker) {
      this.map.removeLayer(this.pickupMarker);
      this.map.removeLayer(this.dropoffMarker);
      this.pickupMarker = null;
      this.dropoffMarker = null;
      this.pickupLocation = null;
      this.dropoffLocation = null;
    }

    // Set Pickup
    if (!this.pickupMarker) {
      this.pickupMarker = L.marker([lat, lng], { title: 'Pickup' })
        .addTo(this.map)
        .bindPopup('<b>Pickup Location</b>')
        .openPopup();
      this.pickupLocation = { latitude: lat, longitude: lng };
    }
    // Set Dropoff
    else if (!this.dropoffMarker) {
      this.dropoffMarker = L.marker([lat, lng], { title: 'Dropoff' })
        .addTo(this.map)
        .bindPopup('<b>Dropoff Location</b>')
        .openPopup();
      this.dropoffLocation = { latitude: lat, longitude: lng };
    }
  }
  private normalizeDepartureTime(value: string): string {
    if (!value) {
      return '';
    }

    const trimmedValue = value.trim();

    if (/^\d{1,2}:\d{2}:\d{2}$/.test(trimmedValue)) {
      const [hours, minutes, seconds] = trimmedValue.split(':');
      return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
    }

    if (/^\d{1,2}:\d{2}$/.test(trimmedValue)) {
      const [hours, minutes] = trimmedValue.split(':');
      return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;
    }

    return '';
  }

  // function to call the matching service and handle the response
  findMatches(): void {
    //this.routeDetailsCancel$.next();
    this.routes = [];
    this.selectedRoute = null;
    this.selectedDriver = null;
    this.selectedVehicles = [];
    this.routeDetailsLoading = false;
    this.routeDetailsError = '';
    //this.routeDetailsCache.clear();
    this.changeDetector.detectChanges();

    const normalizedDepartureTime = this.normalizeDepartureTime(this.departureTime);

    if (!normalizedDepartureTime || !this.pickupLocation || !this.dropoffLocation) {
      return;
    }

    const body = {
      pickup: {
        latitude: this.pickupLocation.latitude,
        longitude: this.pickupLocation.longitude,
      },
      dropoff: {
        latitude: this.dropoffLocation.latitude,
        longitude: this.dropoffLocation.longitude,
      },
      desiredDepartureTime: normalizedDepartureTime,
      toleranceMinutes: 15,
    };

    this.matchingService.find(body).subscribe({
      next: (response) => {
        const matches = Array.isArray(response) ? response : response?.items ?? response?.data ?? [];

        this.routes = matches.map((route: any, index: number) => ({
          id: String(route.routeDetailId ?? route.id ?? route.routeId ?? index + 1),
          routeDetailId: Number(route.routeDetailId ?? route.id ?? index + 1),
          routeId: Number(route.routeId),
          name: route.routeDetailName ?? route.name ?? `Route ${index + 1}`,
          encodedPolyline: route.encodedPolyline ?? '',
        }));
        this.changeDetector.detectChanges();
      },
      error: (error) => {
        console.error('Matching request failed', error);
        this.routes = [];
        this.changeDetector.detectChanges();
      },
    });
  }

  selectRoute(route: RouteItem): void {
    if (this.selectedRoute?.id === route.id) {
      return;
    }

    this.selectedRoute = route;
    this.selectedDriver = null;
    this.selectedVehicles = [];
    this.routeDetailsLoading = true;
    this.routeDetailsError = '';

    const routeCoordinates = this.polylineUtils.decodePolyline(route.encodedPolyline);
    this.displayRoute(routeCoordinates);

    const cachedDetails = this.routeDetailsCache.get(route.id);
    if (cachedDetails) {
      this.selectedDriver = cachedDetails.driver;
      this.selectedVehicles = cachedDetails.vehicles;
      this.routeDetailsLoading = false;
      this.changeDetector.detectChanges();
      return;
    }

    this.matchingService.getRouteDetail(route.routeDetailId).pipe(
      switchMap(routeDetail => this.matchingService.getRoute(routeDetail.routeId)),
      switchMap(routeInfo => forkJoin({
        driver: this.matchingService.getEmployee(routeInfo.employeeId),
        vehicles: this.matchingService.getEmployeeVehicles(routeInfo.employeeId),
      })),
      takeUntil(this.destroy$),
    ).subscribe({
      next: ({ driver, vehicles }) => {
        this.selectedDriver = driver;
        this.selectedVehicles = Array.isArray(vehicles) ? vehicles : [];
        this.routeDetailsCache.set(route.id, {
          driver,
          vehicles: this.selectedVehicles,
        });
        this.routeDetailsLoading = false;
        this.changeDetector.detectChanges();
      },
      error: (error) => {
        console.error('Route details request failed', error);
        this.routeDetailsLoading = false;
        this.routeDetailsError = 'Unable to load driver and vehicle information.';
        this.changeDetector.detectChanges();
      },
    });
  }

  private displayRoute(points: L.LatLngTuple[]): void {
    if (this.activeRouteLine) {
      this.map.removeLayer(this.activeRouteLine);
    }

    this.activeRouteLine = L.polyline(points, {
      color: 'blue',
      weight: 5,
      opacity: 0.7,
      lineJoin: 'round'
    }).addTo(this.map);

    this.map.fitBounds(this.activeRouteLine.getBounds());
  }
}