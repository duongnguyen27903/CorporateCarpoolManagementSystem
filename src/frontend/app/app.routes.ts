import { Routes } from '@angular/router'
import { authGuard, guestGuard } from './core/auth/auth.guard'
import { AppLayoutComponent } from './shared/layout/app-layout'

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login.page').then((m) => m.LoginPage),
  },
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./features/users/users-list.page').then((m) => m.UsersListPage),
      },
      {
        path: 'rides',
        loadComponent: () => import('./features/rides/find-rides.page').then(m => m.FindRidesPage)
      },
      {
        path: 'routes',
        loadComponent: () => import('./features/routes/routes.page').then(m => m.RoutesPage)
      },
      {
        path: 'trips/create',
        loadComponent: () => import('./features/trips/create-trip.page').then(m => m.CreateTripPage)
      },
      {
        path: 'trip-detail',
        loadComponent: () => import('./features/rides/trip-detail.page').then(m => m.TripDetailPage)
      },
      {
        path: 'notifications',
        loadComponent: () => import('./features/home/notifications.page').then(m => m.NotificationsPage)
      },
      {
        path: 'bookings',
        loadComponent: () => import('./features/rides/bookings.page').then(m => m.BookingsPage)
      },
      {
        path: 'costs',
        loadComponent: () => import('./features/costs/cost-sharing.page').then(m => m.CostSharingPage)
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile.page').then(m => m.ProfilePage)
      },
      {
        path: 'admin',
        children: [
          {
            path: 'dashboard',
            loadComponent: () => import('./features/admin/admin-dashboard.page').then(m => m.AdminDashboardPage)
          },
          {
            path: 'employees',
            loadComponent: () => import('./features/admin/employee-directory.page').then(m => m.EmployeeDirectoryPage)
          }
        ]
      }
    ],
  },
]
