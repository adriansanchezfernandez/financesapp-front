import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./core/layout/main-layout/main-layout').then((m) => m.MainLayout),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        title: 'Dashboard | FinancesApp',
        loadComponent: () =>
          import('./features/dashboard/pages/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'movements',
        title: 'Movimientos | FinancesApp',
        loadComponent: () =>
          import('./features/movements/pages/movements/movements').then((m) => m.Movements),
      },
      {
        path: 'movements/new',
        loadComponent: () =>
          import('./features/movements/pages/movement-form/movement-form').then(
            (m) => m.MovementForm,
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
