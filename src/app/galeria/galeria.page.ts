import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonText,
  IonSpinner
} from '@ionic/angular/standalone';
// Importa o Filesystem para LER os ficheiros
import { Filesystem, Directory, ReadFileResult } from '@capacitor/filesystem';

// Interface para organizar os dados da foto
interface Photo {
  path: string;       // O caminho da foto (ex: "data:image/jpeg;base64,...")
  category: string;   // A categoria (ex: "pernas")
  fileName: string;   // O nome do ficheiro (ex: "pernas_1234.jpeg")
}

@Component({
  selector: 'app-galeria',
  templateUrl: './galeria.page.html',
  styleUrls: ['./galeria.page.scss'],
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
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonGrid,
    IonRow,
    IonCol,
    IonImg,
    IonText,
    IonSpinner
  ],
})
export class GaleriaPage implements OnInit {

  public allPhotos: Photo[] = [];        // Lista mestre com todas as fotos
  public filteredPhotos: Photo[] = [];   // Lista filtrada para mostrar
  public currentCategory: string = 'todas'; // Categoria selecionada
  public isLoading = false;
  public errorMessage: string | null = null;

  constructor() {}

  ionViewDidEnter() {
    this.loadPhotos();
  }

  ngOnInit() { } 

  async loadPhotos() {
    this.isLoading = true;
    this.errorMessage = null;
    this.allPhotos = []; 

    try {
      const result = await Filesystem.readdir({
        directory: Directory.Data,
        path: ''
      });

      for (const file of result.files) {
        if (file.name.endsWith('.jpeg')) {
          const category = file.name.split('_')[0];

          const photoFile: ReadFileResult = await Filesystem.readFile({
            directory: Directory.Data,
            path: file.name
          });

          this.allPhotos.push({
            path: `data:image/jpeg;base64,${photoFile.data}`,
            category: category,
            fileName: file.name
          });
        }
      }

      this.allPhotos.reverse();
      
      this.filterPhotos();

    } catch (e: any) {
      console.error('Erro ao carregar fotos', e);
      this.errorMessage = 'Não foi possível carregar a galeria.';
    } finally {
      this.isLoading = false;
    }
  }

  segmentChanged(event: any) {
    this.currentCategory = event.detail.value;
    this.filterPhotos();
  }

  filterPhotos() {
    if (this.currentCategory === 'todas') {
      this.filteredPhotos = this.allPhotos; 
    } else {
      this.filteredPhotos = this.allPhotos.filter(p => p.category === this.currentCategory);
    }
  }

}