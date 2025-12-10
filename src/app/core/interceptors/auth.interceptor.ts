import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  
  // Tenta pegar o token do LocalStorage
  const token = localStorage.getItem('gymbro_token');

  // Se o token existir, injeta no cabeçalho da requisição
  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Token ${token}`
      }
    });
    return next(clonedReq);
  }

  // Se não tiver token, segue a vida (ex: tela de login)
  return next(req);
};