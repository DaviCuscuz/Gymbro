import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// --- INTERFACES ---

export interface Exercicio {
  id?: number;
  name: string;
  grupo_muscular: string; // O serializer agora manda isso
  description?: string;
  created_by?: number;
}

export interface ItemFicha {
  id?: number;
  exercicio_id: number;          // Usado para ENVIAR (Write)
  exercicio_detalhes?: Exercicio;// Usado para LER (Read)
  sets: number;
  repetitions: string;
  peso_adicional_kg: number;
}

export interface Ficha {
  id?: number;
  name: string;
  is_active: boolean;
  items?: ItemFicha[]; // Pode vir nulo, por isso o '?'
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
  
  // Ajuste o IP se necessário
  private apiUrl = 'http://127.0.0.1:8000/api'; 

  constructor(private http: HttpClient) { }

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

  // --- FICHAS ---
  getFichas(): Observable<Ficha[]> {
    return this.http.get<Ficha[]>(`${this.apiUrl}/fichas/`, { headers: this.getHeaders() });
  }

  criarFicha(nome: string): Observable<Ficha> {
    return this.http.post<Ficha>(`${this.apiUrl}/fichas/`, { name: nome }, { headers: this.getHeaders() });
  }

  // --- ADICIONAR ITEM NA FICHA (O PULO DO GATO) ---
  adicionarItemFicha(fichaId: number, item: ItemFicha): Observable<any> {
    // Montamos o payload manualmente para garantir que o Django entenda
    const payload = {
      ficha_id: fichaId,              // Snake_case (como o Python gosta)
      exercicio_id: item.exercicio_id,// ID do exercício selecionado
      sets: item.sets,
      repetitions: item.repetitions,
      peso_adicional_kg: item.peso_adicional_kg
    };

    // Certifique-se que criou a rota 'itens_ficha' no Django conforme instruído antes
    return this.http.post(`${this.apiUrl}/itens_ficha/`, payload, { headers: this.getHeaders() });
  }

  // --- CARDIO ---
  getCardios(): Observable<Cardio[]> {
    return this.http.get<Cardio[]>(`${this.apiUrl}/cardio/`, { headers: this.getHeaders() });
  }
}