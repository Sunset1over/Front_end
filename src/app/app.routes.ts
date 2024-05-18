import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'registration',
    loadChildren: () => import('./authentication/registration/registration.module').then(m => m.RegistrationModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./authentication/login/login.module').then(m => m.LoginModule)
  },
  {
    path: '',
    loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfileModule)
  },
  {
    path: '',
    loadChildren: () => import('./pages/admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: '',
    loadChildren: () => import('./pages/music-recommendation/music-recommendation.module').then(m => m.MusicRecommendationModule)
  },
  {
    path: '',
    loadChildren: () => import('./pages/statistic/statistic.module').then(m => m.StatisticModule)
  }
];

