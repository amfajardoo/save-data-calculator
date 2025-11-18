import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('@presentation/pages/home/home').then((m) => m.Home),
  },
  {
    path: 'save-data',
    loadComponent: () => import('@presentation/pages').then((m) => m.SaveData),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
