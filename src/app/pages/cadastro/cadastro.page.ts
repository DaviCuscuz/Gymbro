import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonItem, 
  IonInput, IonButton, IonToast, IonButtons, IonBackButton, IonList,
  LoadingController
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
    private loadingCtrl: LoadingController 
  ) { }

  async cadastrar() {
    if (!this.user.username || !this.user.password) {
      this.mostrarMensagem('Preencha usuário e senha!', 'warning');
      return;
    }
    const loading = await this.loadingCtrl.create({ message: 'Criando conta...' });
    await loading.present();

    this.authService.register(this.user).subscribe({
      next: async () => {
        loading.message = 'Entrando...'; 
        
        this.authService.login(this.user.username, this.user.password).subscribe({
          next: () => {
            loading.dismiss();
            this.mostrarMensagem('Bem-vindo ao time! 💪', 'success');
            this.router.navigate(['/home']);
          },
          error: () => {
            loading.dismiss();
            this.router.navigate(['/login']);
          }
        });
      },
      error: (err: any) => {
        loading.dismiss();
        this.tratarErroBackend(err);
      }
    });
  }

  tratarErroBackend(err: any) {
    console.error(err); 

    if (err.status === 0) {
      this.mostrarMensagem('Sem conexão com o servidor. O Django tá rodando?', 'danger');
      return;
    }

    const erroDados = err.error; 

    if (erroDados) {
      if (erroDados.username) {
        this.mostrarMensagem('Esse usuário já existe! Escolha outro.', 'warning');
      } else if (erroDados.email) {
        this.mostrarMensagem('E-mail inválido ou já cadastrado.', 'warning');
      } else if (erroDados.password) {
        this.mostrarMensagem('Senha muito fraca. Use letras e números.', 'warning');
      } else {
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