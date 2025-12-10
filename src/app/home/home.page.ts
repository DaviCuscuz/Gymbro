import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router'; 
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent,
  IonButton, IonProgressBar, IonImg, IonIcon, ActionSheetController,
  IonButtons, IonMenuButton, AlertController
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { ProfileService, UserProfile } from '../services/profile.service';
import { Subscription } from 'rxjs'; 

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonCard,
    IonCardContent, IonButton, IonProgressBar, IonImg, IonIcon,
    IonButtons, IonMenuButton,
    RouterLink 
  ]
})
export class HomePage implements OnInit, OnDestroy { 
  
  usuario: UserProfile | null = null;
  private profileSubscription: Subscription | null = null; 

  exercicios = [
    { nome: 'Treino de corpo completo', calorias: 580, tempo: 30, progresso: 0.8 },
    { nome: 'Treino de inferiores', calorias: 320, tempo: 45, progresso: 0.6 },
    { nome: 'Treino de abdômen', calorias: 180, tempo: 20, progresso: 0.3 }
  ];

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private router: Router,
    private alertCtrl: AlertController,
    private profileService: ProfileService 
  ) {}

  ngOnInit() {
    this.profileSubscription = this.profileService.profile$.subscribe(profile => {
      this.usuario = profile; 
    });
  }

  ngOnDestroy() {
    this.profileSubscription?.unsubscribe();
  }

  // --- FUNÇÕES CORRIGIDAS ABAIXO ---

  async mostrarPopUpEmDesenvolvimento() { // <-- () E {} ADICIONADOS
    const alert = await this.alertCtrl.create({
      header: 'Em Breve!',
      message: 'Desculpe, "Gym Bro", esta função ainda está em desenvolvimento.',
      buttons: ['OK']
    });
    await alert.present();
  }
  
  async mostrarOpcoesExercicio() { // <-- () E {} ADICIONADOS
    const actionSheet = await this.actionSheetCtrl.create({ // <-- Corrigido para actionSheetCtrl
      header: 'Criar Exercício',
      buttons: [
        {
          text: 'Iniciar Corrida (GPS)',
          icon: 'walk',
          handler: () => { this.router.navigate(['/geolocalizacao']); }
        },
        {
          text: 'Registrar Treino Manual',
          icon: 'create',
          handler: () => { this.mostrarPopUpEmDesenvolvimento(); }
        },
        { text: 'Cancelar', role: 'cancel', icon: 'close' }
      ]
    });
    await actionSheet.present();
  }
}