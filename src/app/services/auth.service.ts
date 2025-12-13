import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Ajuste o IP se necessário (10.0.2.2 para emulador Android, 127.0.0.1 para Web)
  private apiUrl = 'http://127.0.0.1:8000/api'; 

  constructor(private http: HttpClient) { }

  // 1. Função de Login
  login(username: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/token/`, { username, password }).pipe(
      tap(response => {
        if (response.access) {
          localStorage.setItem('access_token', response.access);
          localStorage.setItem('refresh_token', response.refresh);
        }
      })
    );
  }

  // 2. Função de Cadastro 
  register(userData: any): Observable<any> {
    // Envia os dados para o Django criar o usuário
    return this.http.post(`${this.apiUrl}/registrar/`, userData);
  }

  // 3. Verifica se está logado
  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }

  // 4. Logout
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
}