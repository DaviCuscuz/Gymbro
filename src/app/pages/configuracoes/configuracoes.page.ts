import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton,
  IonList, IonItem, IonInput, IonButton, 
  IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent,
  AlertController, ToastController
} from '@ionic/angular/standalone';
import { ProfileService, UserProfile } from '../../services/profile.service';

@Component({
  selector: 'app-configuracoes',
  templateUrl: './configuracoes.page.html',
  styleUrls: ['./configuracoes.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton,
    IonList, IonItem, IonInput, IonButton,
    IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent
  ]
})
export class ConfiguracoesPage implements OnInit {
  
  perfil: UserProfile = {};

  constructor(
    private profileService: ProfileService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    this.profileService.getMeuPerfil().subscribe({
      next: (data) => { this.perfil = data; },
      error: (err) => {
        console.error(err);
        this.mostrarToast('Erro ao carregar perfil.', 'danger');
      }
    });
  }

  salvarPerfil() {
    if (!this.perfil.id) {
      this.mostrarToast('Erro: Perfil não carregado.', 'warning');
      return;
    }

    this.profileService.salvarPerfil(this.perfil).subscribe({
      next: () => { this.mostrarToast('Perfil atualizado com sucesso!', 'success'); },
      error: (err) => {
        console.error(err);
        this.mostrarToast('Erro ao atualizar.', 'danger');
      }
    });
  }

  // Input Masks

  formatarCPF(event: any) {
    let valor = event.target.value.replace(/\D/g, ''); // Remove letras
    
    if (valor.length > 11) valor = valor.substring(0, 11); // Limita tamanho

    // Adiciona pontos e traço
    if (valor.length > 9) {
      valor = valor.replace(/(\d{3})(\d{3})(\d{3})(\d+)/, '$1.$2.$3-$4');
    } else if (valor.length > 6) {
      valor = valor.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
    } else if (valor.length > 3) {
      valor = valor.replace(/(\d{3})(\d+)/, '$1.$2');
    }

    event.target.value = valor; 
    this.perfil.cpf = valor;    
  }

  formatarTelefone(event: any) {
    let valor = event.target.value.replace(/\D/g, '');
    
    if (valor.length > 11) valor = valor.substring(0, 11);

    // Adiciona parênteses e traço
    if (valor.length > 10) {
      // Celular (11 dígitos): (11) 91234-5678
      valor = valor.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (valor.length > 5) {
      // Fixo ou digitando: (11) 1234-5678
      valor = valor.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else if (valor.length > 2) {
      // Só DDD: (11) 123...
      valor = valor.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
    }

    event.target.value = valor;
    this.perfil.telefone = valor;
  }

  async mostrarToast(msg: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      color: color
    });
    toast.present();
  }
}