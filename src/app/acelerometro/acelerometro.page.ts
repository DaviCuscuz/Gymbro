import { Component, OnDestroy, NgZone } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonCard,
  IonCardContent,
  IonText,
  IonIcon,
  IonButton,
  AlertController 
} from '@ionic/angular/standalone';
import { Motion, AccelListenerEvent } from '@capacitor/motion';
import { PluginListenerHandle } from '@capacitor/core';

@Component({
  selector: 'app-acelerometro',
  templateUrl: './acelerometro.page.html',
  styleUrls: ['./acelerometro.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonCard,
    IonCardContent,
    IonText,
    IonIcon,
    IonButton
  ],
})
export class AcelerometroPage implements OnDestroy {
  
  passos: number = 0;
  accelListener: PluginListenerHandle | null = null;
  errorMessage: string | null = null;
  
  
  private lastStepTimestamp = 0;
  public stepThreshold = 11.5; 
  private debounceTime = 350; 

  constructor(
    private zone: NgZone, 
    private alertCtrl: AlertController 
  ) {}

  async ngOnDestroy() {
    await this.stopAccelerometer(false); 
  }

  async startAccelerometer() {
    try {
      this.passos = 0;
      this.lastStepTimestamp = 0;
      this.errorMessage = null;

      this.accelListener = await Motion.addListener('accel', (event: AccelListenerEvent) => {
        const { x, y, z } = event.acceleration;
        const magnitude = Math.sqrt(x*x + y*y + z*z);
        
        const now = Date.now();

        if (magnitude > this.stepThreshold && (now - this.lastStepTimestamp > this.debounceTime)) {
          this.zone.run(() => {
            this.passos++;
            this.lastStepTimestamp = now;
          });
        }
      });
      console.log('Acelerômetro iniciado.');
    } catch (error: any) {
      console.error('Erro ao iniciar o acelerômetro:', error);
      this.errorMessage = `Erro: ${error.message}`;
    }
  }

  async stopAccelerometer(mostrarAlerta = true) {
    if (this.accelListener) {
      await this.accelListener.remove();
      this.accelListener = null;
      console.log('Acelerômetro parado.');
      
      if (mostrarAlerta && this.passos > 0) {
        await this.mostrarAlertaDeParabens(); 
      }
    }
  }

async mostrarAlertaDeParabens() {
    const alert = await this.alertCtrl.create({
      header: 'Parabéns pela caminhada!',
      subHeader: `${this.passos} Passos`,
      message: 'Bom trabalho, Gym Bro!', 
      buttons: ['OK']
    });

    await alert.present();
  }
}