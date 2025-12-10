import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- Importar FormsModule
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton,
  IonList, IonItem, IonLabel, IonInput, IonButton, AlertController
} from '@ionic/angular/standalone';
// Importa nosso serviço
import { ProfileService } from '../../services/profile.service'; // Ajuste o caminho se necessário

@Component({
  selector: 'app-configuracoes',
  templateUrl: './configuracoes.page.html',
  styleUrls: ['./configuracoes.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, // <-- Adicionar FormsModule aqui
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton,
    IonList, IonItem, IonLabel, IonInput, IonButton // <-- Componentes corretos
  ]
})
export class ConfiguracoesPage implements OnInit {
  
  nome: string = '';
  altura: number | null = null;
  peso: number | null = null;

  constructor(
    private profileService: ProfileService,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.loadData();
  }

  // Carrega os dados salvos quando a página abre
  async loadData() {
    const profile = await this.profileService.loadProfile();
    if (profile) {
      this.nome = profile.nome;
      this.altura = profile.altura;
      this.peso = profile.peso;
    }
  }

  // Salva os dados do formulário
  async salvarPerfil() {
    if (!this.nome || !this.altura || !this.peso) {
      this.showAlert('Erro', 'Preencha todos os campos.');
      return;
    }

    try {
      await this.profileService.saveProfile(this.nome, this.altura, this.peso);
      this.showAlert('Sucesso!', 'Seu perfil foi atualizado.');
    } catch (e) {
      this.showAlert('Erro', 'Não foi possível salvar seu perfil.');
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header, message, buttons: ['OK']
    });
    await alert.present();
  }
}