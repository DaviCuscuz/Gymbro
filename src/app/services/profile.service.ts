import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'; // Importa o BehaviorSubject

// Define a "cara" do nosso objeto de usuário
export interface UserProfile {
  nome: string;
  altura: number; // em cm
  peso: number;   // em kg
  imc: number;
  statusImc: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  
  // 1. Criamos um "contêiner" de dados em memória
  // Ele começa nulo.
  private profileSubject = new BehaviorSubject<UserProfile | null>(null);

  // 2. Criamos um "Observable" que as páginas podem "ouvir"
  public profile$ = this.profileSubject.asObservable();

  constructor() { }

  // Carrega o perfil da memória
  // (Nesta versão, ele só retorna o valor atual)
  async loadProfile(): Promise<UserProfile | null> {
    return this.profileSubject.getValue();
  }

  // Salva o perfil e calcula o IMC
  async saveProfile(nome: string, alturaCm: number, pesoKg: number): Promise<UserProfile> {
    let imc = 0;
    let statusImc = 'Informações incompletas';
    
    // Converte altura de CM para Metros para o cálculo
    if (alturaCm > 0 && pesoKg > 0) {
      const alturaM = alturaCm / 100;
      imc = parseFloat((pesoKg / (alturaM * alturaM)).toFixed(1));

      // Define o status
      if (imc < 18.5) statusImc = 'Abaixo do peso';
      else if (imc < 24.9) statusImc = 'Peso saudável';
      else if (imc < 29.9) statusImc = 'Sobrepeso';
      else statusImc = 'Obesidade';
    }

    const profile: UserProfile = {
      nome: nome,
      altura: alturaCm,
      peso: pesoKg,
      imc: imc,
      statusImc: statusImc
    };
    
    // 3. Em vez de salvar no Storage, nós "avisamos" 
    // a todos os ouvintes (a Home Page) sobre o novo perfil.
    this.profileSubject.next(profile);

    return profile;
  }
}