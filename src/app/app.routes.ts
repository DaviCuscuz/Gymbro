import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard'; // <--- Importe o Guard aqui

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
 {
    path: 'cadastro',
    loadComponent: () => import('./pages/cadastro/cadastro.page').then( m => m.CadastroPage)
  },
  // --- ROTAS PROTEGIDAS (Só entra com Token) 🔒 ---
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then( m => m.HomePage),
    canActivate: [authGuard]
  },
  {
    path: 'camera',
    loadComponent: () => import('./camera/camera.page').then( m => m.CameraPage),
    canActivate: [authGuard]
  },
  {
    path: 'configuracoes',
    loadComponent: () => import('./pages/configuracoes/configuracoes.page').then( m => m.ConfiguracoesPage),
    canActivate: [authGuard]
  },
  {
    path: 'sobre',
    loadComponent: () => import('./pages/sobre/sobre.page').then( m => m.SobrePage),
    canActivate: [authGuard]
  },
  {
    path: 'geolocalizacao',
    loadComponent: () => import('./geolocalizacao/geolocalizacao.page').then( m => m.GeolocalizacaoPage),
    canActivate: [authGuard]
  },
  {
    path: 'acelerometro',
    loadComponent: () => import('./acelerometro/acelerometro.page').then( m => m.AcelerometroPage),
    canActivate: [authGuard]
  },
  {
    path: 'galeria',
    loadComponent: () => import('./galeria/galeria.page').then( m => m.GaleriaPage),
    canActivate: [authGuard]
  },
  {
    path: 'fichas',
    loadComponent: () => import('./pages/fichas/fichas.page').then( m => m.FichasPage)
  },
  {
    path: 'fichas',
    loadComponent: () => import('./pages/fichas/fichas.page').then( m => m.FichasPage),
    canActivate: [authGuard]
  },
  {
    path: 'meus-exercicios',
    loadComponent: () => import('./pages/meus-exercicios/meus-exercicios').then( m => m.MeusExerciciosPage),
    canActivate: [authGuard]
  },
];