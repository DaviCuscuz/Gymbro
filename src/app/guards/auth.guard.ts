import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Se estiver logado (tem token no localStorage), libera a catraca
  if (authService.isLoggedIn()) {
    return true;
  }

  // Se não, manda pro Login
  router.navigate(['/login']);
  return false;
};