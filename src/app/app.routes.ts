import { Routes } from '@angular/router';

export const routes: Routes = [
 {
  path: '',
  redirectTo: 'home',
  pathMatch: 'full',
},
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then( m => m.HomePage)
  },
  {
    path: 'camera',
    loadComponent: () => import('./camera/camera.page').then( m => m.CameraPage)
  },
  {
    path: 'configuracoes',
    loadComponent: () => import('./pages/configuracoes/configuracoes.page').then( m => m.ConfiguracoesPage)
  },
  {
    path: 'sobre',
    loadComponent: () => import('./pages/sobre/sobre.page').then( m => m.SobrePage)
  },
  {
    path: 'geolocalizacao',
    loadComponent: () => import('./geolocalizacao/geolocalizacao.page').then( m => m.GeolocalizacaoPage)
  },
  {
    path: 'acelerometro',
    loadComponent: () => import('./acelerometro/acelerometro.page').then( m => m.AcelerometroPage)
  },
  {
    path: 'galeria',
    loadComponent: () => import('./galeria/galeria.page').then( m => m.GaleriaPage)
  },
];
