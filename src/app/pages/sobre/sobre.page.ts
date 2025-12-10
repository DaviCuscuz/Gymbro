import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, 
  IonButtons, IonMenuButton, // Importante para o Menu
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonList, IonItem, IonLabel, IonIcon, IonChip
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { codeSlashOutline, serverOutline, phonePortraitOutline, personOutline, logoGithub } from 'ionicons/icons';

@Component({
  selector: 'app-sobre',
  templateUrl: './sobre.page.html',
  styleUrls: ['./sobre.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, 
    IonButtons, IonMenuButton, 
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonList, IonItem, IonLabel, IonIcon, IonChip
  ]
})
export class SobrePage implements OnInit {

  versaoApp = '1.0.0 (Beta)';

  constructor() { 
    addIcons({ codeSlashOutline, serverOutline, phonePortraitOutline, personOutline, logoGithub });
  }

  ngOnInit() {
  }

}