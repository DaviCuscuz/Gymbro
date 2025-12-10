import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { 
  IonApp, IonSplitPane, IonMenu, IonContent, IonList, 
  IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, 
  IonLabel, IonRouterOutlet, IonFooter, IonButton, IonItemDivider 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  homeOutline, homeSharp, 
  barbellOutline, barbellSharp, 
  mapOutline, mapSharp, 
  personOutline, personSharp,
  informationCircleOutline, informationCircleSharp,
  logOutOutline, logOutSharp,
  cameraOutline, cameraSharp,
  imagesOutline, imagesSharp,
  navigateOutline, navigateSharp,
  fitnessOutline, fitnessSharp 
} from 'ionicons/icons';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    RouterLink, RouterLinkActive, CommonModule, 
    IonApp, IonSplitPane, IonMenu, IonContent, IonList, 
    IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, 
    IonLabel, IonRouterOutlet, IonFooter, IonButton, IonItemDivider
  ],
})
export class AppComponent {
  
  // MENU PRINCIPAL
  public appPages = [
    { title: 'Dashboard', url: '/home', icon: 'home' },
    { title: 'Meus Treinos', url: '/fichas', icon: 'barbell' },
    { title: 'Meus Exercícios', url: '/meus-exercicios', icon: 'fitness' },
    { title: 'Meu Perfil', url: '/configuracoes', icon: 'person' },
    { title: 'Sobre o App', url: '/sobre', icon: 'information-circle' },
  ];

  // MENU NATIVO (Ferramentas)
  public nativePages = [
    { title: 'Câmera & Galeria', url: '/camera', icon: 'camera' },
    { title: 'GPS (Mapa)', url: '/geolocalizacao', icon: 'navigate' },
  ];

  constructor(private authService: AuthService, private router: Router) {
    // REGISTRANDO TODOS OS ÍCONES
    addIcons({ 
      homeOutline, homeSharp, 
      barbellOutline, barbellSharp, 
      mapOutline, mapSharp, 
      personOutline, personSharp,
      informationCircleOutline, informationCircleSharp,
      logOutOutline, logOutSharp,
      cameraOutline, cameraSharp,
      imagesOutline, imagesSharp,
      navigateOutline, navigateSharp,
      fitnessOutline, fitnessSharp 
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}