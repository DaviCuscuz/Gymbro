import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonItem, 
  IonInput, IonButton, IonToast, IonButtons, IonBackButton, IonList,
  LoadingController // <--- 1. Importe o LoadingController pra dar um feedback visual
} from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, 
    IonContent, IonHeader, IonTitle, IonToolbar, IonItem, 
    IonInput, IonButton, IonToast, IonButtons, IonBackButton, IonList
  ]
})
export class CadastroPage {
  
  user = { username: '', email: '', password: '' };
  
  isToastOpen = false;
  toastMessage = '';
  toastColor = 'success';

  constructor(
    private authService: AuthService, 
    private router: Router,
    private loadingCtrl: LoadingController // <--- Injete aqui
  ) { }

  async cadastrar() {
    if (!this.user.username || !this.user.password) {
      this.mostrarMensagem('Preencha usuário e senha!', 'warning');
      return;
    }

    // Mostra um "Carregando..." enquanto processa
    const loading = await this.loadingCtrl.create({ message: 'Criando conta...' });
    await loading.present();

    this.authService.register(this.user).subscribe({
      next: async () => {
        // 1. SUCESSO NO CADASTRO? JÁ FAZ O LOGIN DIRETO!
        loading.message = 'Entrando...'; // Atualiza msg
        
        this.authService.login(this.user.username, this.user.password).subscribe({
          next: () => {
            loading.dismiss();
            this.mostrarMensagem('Bem-vindo ao time! 💪', 'success');
            this.router.navigate(['/home']); // Vai direto pra Home
          },
          error: () => {
            loading.dismiss();
            // Se cadastrou mas falhou o login automático, manda pra tela de login
            this.router.navigate(['/login']);
          }
        });
      },
      error: (err: any) => {
        loading.dismiss();
        this.tratarErroBackend(err); // <--- Chama nossa função inteligente de erro
      }
    });
  }

  // Função que traduz o erro do Django para Português
  tratarErroBackend(err: any) {
    console.error(err); // Pra você ver no console o que veio

    if (err.status === 0) {
      this.mostrarMensagem('Sem conexão com o servidor. O Django tá rodando?', 'danger');
      return;
    }

    // O Django geralmente manda algo assim: { "username": ["A user with that username already exists."] }
    const erroDados = err.error; 

    if (erroDados) {
      if (erroDados.username) {
        this.mostrarMensagem('Esse usuário já existe! Escolha outro.', 'warning');
      } else if (erroDados.email) {
        this.mostrarMensagem('E-mail inválido ou já cadastrado.', 'warning');
      } else if (erroDados.password) {
        this.mostrarMensagem('Senha muito fraca. Use letras e números.', 'warning');
      } else {
        // Erro genérico se não for nenhum dos acima
        this.mostrarMensagem('Erro no cadastro. Verifique seus dados.', 'danger');
      }
    } else {
      this.mostrarMensagem('Erro desconhecido. Tente novamente.', 'danger');
    }
  }

  mostrarMensagem(msg: string, color: string) {
    this.toastMessage = msg;
    this.toastColor = color;
    this.isToastOpen = true;
  }
}