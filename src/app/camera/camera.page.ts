import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonImg,
  IonText,
  IonButtons,
  IonBackButton,
  IonIcon,
  AlertController // <-- Já estava importado
} from '@ionic/angular/standalone';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.page.html',
  styleUrls: ['./camera.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonImg,
    IonText,
    IonButtons,
    IonBackButton,
    IonIcon
  ],
})
export class CameraPage {
  
  photoUrl: string | null = null; 
  errorMessage: string | null = null;
  isSaving = false;

  constructor(private alertCtrl: AlertController) {}

  // --- Funções de Tirar Foto (Sem Mudanças) ---
  async takePicture() {
    this.errorMessage = null;
    this.photoUrl = null;
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera 
      });

      if (image.webPath) {
        this.photoUrl = image.webPath;
      } else {
        throw new Error('Não foi possível obter a URL da imagem.');
      }
    } catch (error: any) {
      this.errorMessage = `Erro: ${error.message}`;
    }
  }

  async pickFromGallery() {
    this.errorMessage = null;
    this.photoUrl = null;
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos 
      });

      if (image.webPath) {
        this.photoUrl = image.webPath;
      } else {
        throw new Error('Não foi possível obter a URL da imagem.');
      }
    } catch (error: any) {
      this.errorMessage = `Erro: ${error.message}`;
    }
  }

  // --- LÓGICA DE SALVAR ATUALIZADA ---

  // 1. Botão "Salvar Foto" agora chama esta função:
  async savePicture() {
    if (!this.photoUrl || this.isSaving) return;

    // Pergunta ao usuário em qual categoria salvar
    await this.askForCategory();
  }

  // 2. Nova função que mostra o pop-up com as categorias
  async askForCategory() {
    const alert = await this.alertCtrl.create({
      header: 'Salvar Progresso',
      message: 'Em qual categoria esta foto se encaixa?',
      // Define os inputs de rádio
      inputs: [
        { type: 'radio', label: 'Corpo Todo', value: 'corpo-todo' },
        { type: 'radio', label: 'Pernas', value: 'pernas' },
        { type: 'radio', label: 'Braços', value: 'bracos' },
        { type: 'radio', label: 'Superiores', value: 'superiores' },
        { type: 'radio', label: 'Outros', value: 'outros' } // Categoria "coringa"
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { 
          text: 'Salvar',
          handler: (category: string) => {
            // Se o usuário não escolheu (improvável) ou clicou "Salvar" sem nada
            if (!category) {
              this.showSaveAlert(false, 'Você precisa escolher uma categoria.');
              return false; // Impede o fechamento do alerta
            }
            // Chama a função de salvar passando a categoria
            this.saveFileWithCategory(category);
            return true;
          }
        }
      ]
    });

    await alert.present();
  }

  // 3. Função que realmente salva o arquivo (a lógica que tínhamos antes)
  async saveFileWithCategory(category: string) {
    if (!this.photoUrl || this.isSaving) return;

    this.isSaving = true;
    try {
      const response = await fetch(this.photoUrl);
      const blob = await response.blob();
      const base64Data = await this.blobToBase64(blob) as string;

      // MUDANÇA NO NOME DO ARQUIVO:
      const fileName = `${category}_${new Date().getTime()}.jpeg`;

      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Data 
      });

      console.log('Foto salva em:', savedFile.uri);
      await this.showSaveAlert(true, 'Sua foto de progresso foi salva!');
      this.photoUrl = null; // Limpa o preview

    } catch (e) {
      console.error('Erro ao salvar foto', e);
      await this.showSaveAlert(false, 'Não foi possível salvar a foto.');
    } finally {
      this.isSaving = false;
    }
  }

  // 4. Pop-up de feedback (agora com mensagem customizada)
  async showSaveAlert(success: boolean, message: string) {
    const alert = await this.alertCtrl.create({
      header: success ? 'Sucesso!' : 'Opa!',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  // 5. Função "Helper" (sem mudanças)
  private blobToBase64(blob: Blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
  }
}