import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserProfile {
  id?: number;
  user?: number;
  nome_completo?: string;
  email?: string;
  telefone?: string;
  cpf?: string;        
  endereco?: string;   
  cidade?: string;     
  estado?: string;     
  altura?: number;
  peso?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  
  private apiUrl = 'http://127.0.0.1:8000/api'; 

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getMeuPerfil(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/profiles/me/`, { 
      headers: this.getHeaders() 
    });
  }

  salvarPerfil(dados: UserProfile): Observable<UserProfile> {
    if (dados.id) {
        return this.http.patch<UserProfile>(`${this.apiUrl}/profiles/${dados.id}/`, dados, {
            headers: this.getHeaders()
        });
    }
    return new Observable();
  }
}