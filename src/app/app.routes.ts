import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'save-data',
    loadComponent: () => import('./save-data/save-data'),
  },
  {
    path: '',
    redirectTo: 'save-data',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'save-data',
  }
];
