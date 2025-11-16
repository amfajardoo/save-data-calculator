import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'save-data',
    loadComponent: () => import('@presentation/pages').then((m) => m.SaveData),
  },
  {
    path: '',
    redirectTo: 'save-data',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'save-data',
  },
];
