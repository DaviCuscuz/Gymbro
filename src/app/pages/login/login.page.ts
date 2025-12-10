import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, 
  IonItem, IonInput, IonButton, IonToast, IonList,
  MenuController // <--- 1. Importe o MenuController
} from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule, 
    IonContent, IonHeader, IonTitle, IonToolbar, 
    IonItem, IonInput, IonButton, IonToast, IonList 
    // Não precisa importar MenuController aqui nos imports visuais
  ]
})
export class LoginPage {
  
  credentials = { username: '', password: '' };
  isToastOpen = false;
  toastMessage = '';

  // 2. Injete o MenuController no construtor
  constructor(
    private authService: AuthService, 
    private router: Router,
    private menuCtrl: MenuController 
  ) { }

  // 3. Quando entrar na página: TRAVA O MENU (Desabilita)
  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  // 4. Quando sair da página: DESTRAVA O MENU (Habilita)
  ionViewDidLeave() {
    this.menuCtrl.enable(true);
  }

  async fazerLogin() {
    // ... seu código de login continua igual ...
    this.authService.login(this.credentials.username, this.credentials.password).subscribe({
      next: () => {
        // Ao ir para a Home, o ionViewDidLeave vai reativar o menu automaticamente
        this.router.navigate(['/home']);
      },
      error: (err: any) => {
        console.error(err);
        this.mostrarMensagem('Falha no login. Verifique usuário e senha.');
      }
    });
  }

  mostrarMensagem(msg: string) {
    this.toastMessage = msg;
    this.isToastOpen = true;
  }
}