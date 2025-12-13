import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs/operators';

export interface LoginResponse {
  token: string;
  message: string;
}

export interface RegisterResponse {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private tokenKey = 'gymbro_token'; // Nome da chave no LocalStorage

  constructor(private http: HttpClient) { }

  // 1. LOGIN: Envia user/pass, recebe token e salva
  login(credentials: any) {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login/`, credentials)
      .pipe(
        tap(response => {
          if (response.token) {
            localStorage.setItem(this.tokenKey, response.token);
            console.log('Token salvo:', response.token);
          }
        })
      );
  }

  // 2. REGISTER: Cria conta
  register(userData: any) {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register/`, userData);
  }

  // 3. LOGOUT: Limpa o token
  logout() {
    localStorage.removeItem(this.tokenKey);
  }

  // 4. GET TOKEN: Para usar no interceptor
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // 5. Verifica se está logado
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}