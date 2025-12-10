import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, 
  IonButtons, IonButton, IonIcon, IonCard, IonCardHeader, 
  IonCardTitle, IonCardSubtitle, IonCardContent, IonAvatar,
  IonMenuButton, IonList, IonItem, IonLabel, IonBadge, IonChip, 
  AlertController, ToastController 
} from '@ionic/angular/standalone';
import { ProfileService, UserProfile } from '../services/profile.service';
import { AuthService } from '../services/auth.service';
import { TreinoService, Exercicio, Ficha, Cardio } from '../services/treino.service';
import { Router, RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { addCircleOutline, barbellOutline, listOutline, timerOutline, flameOutline, trophyOutline, chevronForwardOutline, addOutline } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    IonHeader, IonToolbar, IonTitle, IonContent, 
    IonButtons, IonButton, IonIcon, IonCard, IonCardHeader, 
    IonCardTitle, IonCardSubtitle, IonCardContent, IonAvatar,
    IonMenuButton, IonList, IonItem, IonLabel, IonBadge, IonChip 
  ]
})
export class HomePage implements OnInit {

  perfil: UserProfile | null = null;
  exercicios: Exercicio[] = [];
  fichas: Ficha[] = [];
  cardios: Cardio[] = [];
  
  imc: string = '--';
  imcStatus: string = '';
  imcColor: string = 'medium';
  
  recordes: any[] = [];

  constructor(
    private profileService: ProfileService,
    private treinoService: TreinoService,
    private authService: AuthService,
    private router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {
    addIcons({ addCircleOutline, barbellOutline, listOutline, timerOutline, flameOutline, trophyOutline, chevronForwardOutline, addOutline });
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.carregarDados();
  }

  carregarDados() {
    // 1. Perfil e IMC
    this.profileService.getMeuPerfil().subscribe({
      next: (data: UserProfile) => {
        this.perfil = data;
        this.calcularIMC();
      },
      error: (err: any) => { if (err.status === 401) this.logout(); }
    });

    // 2. Exercícios
    this.treinoService.getExercicios().subscribe({
      next: (data: Exercicio[]) => this.exercicios = data.slice(0, 5)
    });

    // 3. Fichas e Cálculo de PRs
    this.treinoService.getFichas().subscribe({
      next: (data: Ficha[]) => {
        this.fichas = data;
        this.calcularPRs(data);
      }
    });

    // 4. Cardio
    this.treinoService.getCardios().subscribe({
      next: (data: Cardio[]) => this.cardios = data
    });
  }

  calcularIMC() {
    if (this.perfil?.altura && this.perfil?.peso) {
      const alturaM = this.perfil.altura / 100;
      const valor = this.perfil.peso / (alturaM * alturaM);
      this.imc = valor.toFixed(1);

      if (valor < 18.5) { this.imcStatus = 'Abaixo do peso'; this.imcColor = 'warning'; }
      else if (valor < 24.9) { this.imcStatus = 'Peso ideal'; this.imcColor = 'success'; }
      else if (valor < 29.9) { this.imcStatus = 'Sobrepeso'; this.imcColor = 'warning'; }
      else { this.imcStatus = 'Obesidade'; this.imcColor = 'danger'; }
    } else {
      this.imc = '--';
      this.imcStatus = 'Configure seu perfil';
      this.imcColor = 'medium';
    }
  }

  calcularPRs(fichas: Ficha[]) {
    const mapPRs = new Map<string, number>();
    const mapGrupos = new Map<string, string>();

    fichas.forEach(ficha => {
      // Verifica se a lista de itens existe
      if(ficha.items) {
        ficha.items.forEach(item => {
          
          // --- CORREÇÃO DE SEGURANÇA ---
          // Verifica se 'exercicio_detalhes' existe antes de ler
          if (item.exercicio_detalhes) {
            
            const nome = item.exercicio_detalhes.name;
            const grupo = item.exercicio_detalhes.grupo_muscular;
            const peso = Number(item.peso_adicional_kg); 
  
            if (peso > 0) {
              // Se o exercício não tá no mapa OU se o peso atual é maior que o recorde antigo
              if (!mapPRs.has(nome) || peso > mapPRs.get(nome)!) {
                mapPRs.set(nome, peso);
                mapGrupos.set(nome, grupo);
              }
            }
          }
        });
      }
    });

    // Converte o Mapa em Array, ordena e pega o Top 5
    this.recordes = Array.from(mapPRs, ([name, value]) => ({ 
      nome: name, 
      peso: value,
      grupo: mapGrupos.get(name) || 'Geral'
    })).sort((a, b) => b.peso - a.peso).slice(0, 5);
  }

  async abrirCriarExercicio() {
    const alert = await this.alertCtrl.create({
      header: 'Novo Exercício',
      inputs: [
        { name: 'name', type: 'text', placeholder: 'Nome (ex: Supino Reto)' },
        { name: 'grupo', type: 'text', placeholder: 'Grupo (ex: Peito)' }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Salvar',
          handler: (data) => {
            if (data.name && data.grupo) {
              this.salvarExercicio(data.name, data.grupo);
            } else {
              this.mostrarToast('Preencha os campos, monstro!', 'warning');
            }
          }
        }
      ]
    });
    await alert.present();
  }

  salvarExercicio(nome: string, grupo: string) {
    const novo: Exercicio = { name: nome, grupo_muscular: grupo };
    this.treinoService.criarExercicio(novo).subscribe({
      next: (res) => {
        this.mostrarToast('Exercício criado com sucesso!', 'success');
        this.carregarDados();
      },
      error: () => this.mostrarToast('Erro ao criar exercício.', 'danger')
    });
  }

  async mostrarToast(msg: string, color: string) {
    const toast = await this.toastCtrl.create({ message: msg, duration: 2000, color: color });
    toast.present();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}