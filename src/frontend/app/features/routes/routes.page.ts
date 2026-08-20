import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  ProfileService,
  Route,
  RouteInput,
  Zone
} from '../../../src/app/services/profile.service';

@Component({
  selector: 'app-routes-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="mx-auto max-w-6xl space-y-6 pb-12">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">My Routes</h1>
          <p class="mt-1 text-sm text-gray-600">Manage the frequent routes you use for your commute.</p>
        </div>
        <button
          type="button"
          (click)="startCreating()"
          class="rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          Add Route
        </button>
      </div>

      @if (errorMessage) {
        <div class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {{ errorMessage }}
        </div>
      }

      @if (showForm) {
        <section class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h2 class="text-lg font-bold text-gray-900">{{ editingRoute ? 'Edit Route' : 'Add Frequent Route' }}</h2>
              <p class="mt-1 text-sm text-gray-600">Enter the route details used by the Route API.</p>
            </div>
            <button type="button" (click)="cancelForm()" class="text-sm font-semibold text-gray-500 hover:text-gray-900">Cancel</button>
          </div>

          <form class="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2" (ngSubmit)="saveRoute()">
            <label class="block">
              <span class="text-xs font-bold uppercase tracking-wide text-gray-700">Leaving from</span>
              <select name="startZoneId" required [(ngModel)]="form.startZoneId" class="mt-2 h-10 w-full rounded-lg border border-gray-400 bg-white px-3 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200">
                <option [ngValue]="null" disabled>Select a pickup area</option>
                @for (zone of zoneOptions; track zone.zoneId) {
                  <option [ngValue]="zone.zoneId">{{ zone.zoneName }}</option>
                }
              </select>
            </label>
            <label class="block">
              <span class="text-xs font-bold uppercase tracking-wide text-gray-700">Going to</span>
              <select name="endZoneId" required [(ngModel)]="form.endZoneId" class="mt-2 h-10 w-full rounded-lg border border-gray-400 bg-white px-3 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200">
                <option [ngValue]="null" disabled>Select a destination area</option>
                @for (zone of zoneOptions; track zone.zoneId) {
                  <option [ngValue]="zone.zoneId">{{ zone.zoneName }}</option>
                }
              </select>
            </label>
            <label class="block">
              <span class="text-xs font-bold uppercase tracking-wide text-gray-700">Start time</span>
              <input type="time" name="startTime" required [(ngModel)]="form.startTime" class="mt-2 h-10 w-full rounded-lg border border-gray-400 px-3 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200">
            </label>
            <label class="block">
              <span class="text-xs font-bold uppercase tracking-wide text-gray-700">Days of week</span>
              <div class="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
                @for (day of dayOptions; track day) {
                  <label class="flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-semibold transition-colors" [class.border-blue-600]="isDaySelected(day)" [class.bg-blue-50]="isDaySelected(day)" [class.text-blue-700]="isDaySelected(day)" [class.border-gray-300]="!isDaySelected(day)" [class.bg-white]="!isDaySelected(day)" [class.text-gray-700]="!isDaySelected(day)">
                    <input type="checkbox" [name]="'day-' + day" [checked]="isDaySelected(day)" (change)="toggleDay(day, $event)" class="h-4 w-4 accent-blue-600">
                    {{ day.slice(0, 3) }}
                  </label>
                }
              </div>
            </label>
            <div class="flex justify-end gap-3 border-t border-gray-100 pt-5 md:col-span-2">
              <button type="button" (click)="cancelForm()" class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
              <button type="submit" [disabled]="saving" class="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">{{ saving ? 'Saving...' : 'Save Route' }}</button>
            </div>
          </form>
        </section>
      }

      <section class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        @if (loading) {
            <p class="px-6 py-10 text-center text-sm font-medium text-gray-600">Loading your routes...</p>
        } @else if (routes.length === 0) {
          <div class="px-6 py-12 text-center">
            <h2 class="text-lg font-bold text-gray-900">No frequent routes yet</h2>
            <p class="mt-1 text-sm text-gray-600">Add a route to reuse it when publishing a trip.</p>
          </div>
        } @else {
          <div class="divide-y divide-gray-200">
            @for (route of routes; track route.routeId) {
              <div class="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div class="min-w-0">
                  <div class="flex flex-wrap items-center gap-2">
                    <h2 class="text-base font-bold text-gray-950">{{ zoneName(route.startZoneId) }} <span class="px-1 font-bold text-blue-600">→</span> {{ zoneName(route.endZoneId) }}</h2>
                    <span class="rounded-full px-2.5 py-1 text-xs font-bold" [class.bg-emerald-50]="route.isActive" [class.text-emerald-700]="route.isActive" [class.bg-gray-100]="!route.isActive" [class.text-gray-600]="!route.isActive">{{ route.isActive ? 'Active' : 'Inactive' }}</span>
                  </div>
                  <div class="mt-2 flex flex-wrap gap-4 text-sm font-medium text-gray-700">
                    <span>Departure {{ route.startTime }}</span>
                    <span>{{ route.daysOfWeek }}</span>
                  </div>
                </div>
                <div class="flex shrink-0 gap-2">
                  <button type="button" (click)="startEditing(route)" class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Edit</button>
                  <button type="button" (click)="removeRoute(route)" class="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">Delete</button>
                </div>
              </div>
            }
          </div>
        }
      </section>
    </div>
  `
})
export class RoutesPage implements OnInit {
  private readonly profileService = inject(ProfileService);
  private readonly cdr = inject(ChangeDetectorRef);

  routes: Route[] = [];
  zones = new Map<number, Zone>();
  zoneOptions: Zone[] = [];
  loading = true;
  saving = false;
  showForm = false;
  errorMessage = '';
  editingRoute: Route | null = null;
  form: RouteInput = this.emptyForm();
  readonly dayOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  selectedDays = new Set<string>();

  ngOnInit(): void {
    this.loadRoutes();
  }

  loadRoutes(): void {
    this.loading = true;
    forkJoin({
      routes: this.profileService.getMyRoutes(),
      zones: this.profileService.getZones().pipe(catchError(() => of([] as Zone[])))
    }).subscribe({
      next: ({ routes, zones }) => {
        this.routes = Array.isArray(routes) ? routes : [];
        if (Array.isArray(zones)) {
          zones.forEach(zone => this.zones.set(zone.zoneId, zone));
        }
        this.zoneOptions = [...this.zones.values()].sort((a, b) => a.zoneName.localeCompare(b.zoneName));
        this.cdr.detectChanges();
        this.loadZoneNames();
      },
      error: error => {
        console.error('Unable to load routes:', error);
        this.errorMessage = 'Unable to load your routes.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  startCreating(): void {
    this.editingRoute = null;
    this.form = this.emptyForm();
    this.selectedDays = new Set(['Monday', 'Wednesday', 'Friday']);
    this.errorMessage = '';
    this.showForm = true;
  }

  startEditing(route: Route): void {
    this.editingRoute = route;
    this.form = {
      startZoneId: route.startZoneId,
      endZoneId: route.endZoneId,
      startTime: route.startTime,
      daysOfWeek: route.daysOfWeek
    };
    this.selectedDays = new Set(
      route.daysOfWeek
        .split(',')
        .map(day => day.trim().toLowerCase())
        .map(day => this.dayOptions.find(option =>
          option.toLowerCase() === day ||
          option.slice(0, 3).toLowerCase() === day ||
          this.dayCode(option) === day
        ))
        .filter((day): day is string => Boolean(day))
    );
    this.errorMessage = '';
    this.showForm = true;
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingRoute = null;
  }

  saveRoute(): void {
    if (this.selectedDays.size === 0) {
      this.errorMessage = 'Select at least one day of the week.';
      this.cdr.detectChanges();
      return;
    }

    const payload = {
      startZoneId: Number(this.form.startZoneId),
      endZoneId: Number(this.form.endZoneId),
      startTime: this.form.startTime.length === 5 ? `${this.form.startTime}:00` : this.form.startTime,
      daysOfWeek: this.dayOptions
        .filter(day => this.selectedDays.has(day))
        .map(day => this.dayCode(day))
        .join(',')
    };

    if (!payload.startZoneId || !payload.endZoneId || payload.startZoneId === payload.endZoneId) {
      this.errorMessage = 'Choose two different areas for this route.';
      this.cdr.detectChanges();
      return;
    }

    const duplicateRoute = this.routes.some(route =>
      route.routeId !== this.editingRoute?.routeId &&
      route.startZoneId === payload.startZoneId &&
      route.endZoneId === payload.endZoneId &&
      this.normalizeTime(route.startTime) === this.normalizeTime(payload.startTime)
    );

    if (duplicateRoute) {
      this.errorMessage = 'This route already exists. Choose a different area or start time.';
      this.cdr.detectChanges();
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    console.debug('Creating/updating route with payload:', payload);
    const request = this.editingRoute
      ? this.profileService.updateRoute(this.editingRoute.routeId, payload)
      : this.profileService.createRoute(payload);

    request.subscribe({
      next: () => {
        this.cancelForm();
        this.saving = false;
        this.cdr.detectChanges();
        this.loadRoutes();
      },
      error: error => {
        console.error('Unable to save route:', error);
        this.errorMessage = this.getApiErrorMessage(error);
        this.saving = false;
        this.cdr.detectChanges();
      }
    });
  }

  removeRoute(route: Route): void {
    if (!window.confirm('Delete this frequent route?')) {
      return;
    }

    this.profileService.deleteRoute(route.routeId).subscribe({
      next: () => {
        this.loadRoutes();
        this.cdr.detectChanges();
      },
      error: error => {
        console.error('Unable to delete route:', error);
        this.errorMessage = 'Unable to delete this route.';
        this.cdr.detectChanges();
      }
    });
  }

  zoneName(zoneId: number): string {
    return this.zones.get(zoneId)?.zoneName || 'Unknown zone';
  }

  isDaySelected(day: string): boolean {
    return this.selectedDays.has(day);
  }

  toggleDay(day: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedDays.add(day);
    } else {
      this.selectedDays.delete(day);
    }
    this.selectedDays = new Set(this.selectedDays);
  }

  private getApiErrorMessage(error: { error?: unknown }): string {
    const response = error?.error;

    if (typeof response === 'string' && response.trim()) {
      return this.mapRouteApiError(response);
    }

    if (response && typeof response === 'object' && 'errors' in response) {
      const problem = response as {
        title?: string;
        detail?: string;
        errors?: Record<string, string[]>;
      };
      const errors = problem.errors;
      const messages = errors
        ? Object.values(errors).flat().filter(Boolean)
        : [];

      if (messages.length > 0) {
        return this.mapRouteApiError(messages.join(' '));
      }

      if (problem.detail || problem.title) {
        return this.mapRouteApiError(problem.detail || problem.title || 'Unable to save this route.');
      }
    }

    return 'Unable to save this route. Check the selected areas, time, and days.';
  }

  private normalizeTime(value: string): string {
    return value.length >= 5 ? value.slice(0, 5) : value;
  }

  private dayCode(day: string): string {
    const dayIndex = this.dayOptions.indexOf(day);
    return day === 'Sunday' ? '1' : String(dayIndex + 2);
  }

  private mapRouteApiError(message: string): string {
    if (message.toLowerCase().includes('route duplicate')) {
      return 'This route already exists. Choose a different area or start time.';
    }

    if (message.toLowerCase().includes('employee not found')) {
      return 'Your employee account could not be found. Please sign in again.';
    }

    return message;
  }

  private loadZoneNames(): void {
    const routeZoneIds = this.routes.flatMap(route => [route.startZoneId, route.endZoneId]);
    const zoneIds = [...new Set(routeZoneIds.length > 0 ? routeZoneIds : [1, 2, 3])];

    forkJoin(zoneIds.map(zoneId => this.profileService.getZone(zoneId).pipe(catchError(() => of(null)))))
      .subscribe(results => {
        results.forEach(zone => {
          if (zone) {
            this.zones.set(zone.zoneId, zone);
          }
        });
        this.zoneOptions = [...this.zones.values()].sort((a, b) => a.zoneName.localeCompare(b.zoneName));
        this.loading = false;
        this.cdr.detectChanges();
      });
  }

  private emptyForm(): RouteInput {
    return {
      startZoneId: 1,
      endZoneId: 2,
      startTime: '08:00',
      daysOfWeek: 'Monday, Wednesday, Friday'
    };
  }
}