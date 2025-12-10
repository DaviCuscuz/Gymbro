import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Exercicio {
  id?: number;
  name: string;
  grupo_muscular: string;
  description?: string;
  created_by?: number;
}

export interface ItemFicha {
  id?: number;
  exercicio_id: number;
  exercicio_detalhes?: Exercicio;
  sets: number;
  repetitions: string;
  peso_adicional_kg: number;
}

export interface Ficha {
  id?: number;
  name: string;
  is_active: boolean;
  items?: ItemFicha[];
}

export interface Cardio {
  id?: number;
  tipo: string;
  distancia_km: number;
  tempo_minutos: number;
  data_treino: string;
}

@Injectable({
  providedIn: 'root'
})
export class TreinoService {
  
  private apiUrl = 'http://127.0.0.1:8000/api'; 

  constructor(private http: HttpClient) { }

  // Pega o token salvo para autorizar as requisições
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // --- EXERCÍCIOS ---
  
  getExercicios(): Observable<Exercicio[]> {
    return this.http.get<Exercicio[]>(`${this.apiUrl}/exercicios/`, { headers: this.getHeaders() });
  }

  criarExercicio(exercicio: Exercicio): Observable<Exercicio> {
    return this.http.post<Exercicio>(`${this.apiUrl}/exercicios/`, exercicio, { headers: this.getHeaders() });
  }

  // Atualiza nome ou grupo de um exercício existente
  editarExercicio(id: number, dados: Exercicio): Observable<Exercicio> {
    return this.http.patch<Exercicio>(`${this.apiUrl}/exercicios/${id}/`, dados, { headers: this.getHeaders() });
  }

  // Apaga um exercício do banco de dados
  deletarExercicio(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/exercicios/${id}/`, { headers: this.getHeaders() });
  }

  // --- FICHAS ---

  getFichas(): Observable<Ficha[]> {
    return this.http.get<Ficha[]>(`${this.apiUrl}/fichas/`, { headers: this.getHeaders() });
  }

  criarFicha(nome: string): Observable<Ficha> {
    return this.http.post<Ficha>(`${this.apiUrl}/fichas/`, { name: nome }, { headers: this.getHeaders() });
  }

  // Apaga a ficha inteira
  deletarFicha(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/fichas/${id}/`, { headers: this.getHeaders() });
  }

  // --- ITENS DA FICHA ---

  adicionarItemFicha(fichaId: number, item: ItemFicha): Observable<any> {
    const payload = {
      ficha_id: fichaId,
      exercicio_id: item.exercicio_id,
      sets: item.sets,
      repetitions: item.repetitions,
      peso_adicional_kg: item.peso_adicional_kg
    };
    return this.http.post(`${this.apiUrl}/itens_ficha/`, payload, { headers: this.getHeaders() });
  }

  // Remove apenas um exercício de dentro da ficha
  deletarItemFicha(itemId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/itens_ficha/${itemId}/`, { headers: this.getHeaders() });
  }

  // --- CARDIO ---
  getCardios(): Observable<Cardio[]> {
    return this.http.get<Cardio[]>(`${this.apiUrl}/cardio/`, { headers: this.getHeaders() });
  }
}