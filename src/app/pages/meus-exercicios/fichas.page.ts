import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, 
  IonList, IonItem, IonLabel, IonButton, IonIcon, IonModal, 
  IonSelect, IonSelectOption, IonInput, AlertController, ToastController 
} from '@ionic/angular/standalone';
import { TreinoService, Ficha, Exercicio } from '../../services/treino.service';
import { addIcons } from 'ionicons';
import { 
  addOutline, barbellOutline, trashOutline, closeCircleOutline // Novos ícones
} from 'ionicons/icons';

@Component({
  selector: 'app-fichas',
  templateUrl: './fichas.page.html',
  styleUrls: ['./fichas.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
    IonList, IonItem, IonLabel, IonButton, IonIcon, IonModal,
    IonSelect, IonSelectOption, IonInput
  ]
})
export class FichasPage implements OnInit {

  fichas: Ficha[] = [];
  exercicios: Exercicio[] = [];
  
  isModalOpen = false;
  fichaSelecionadaId: number | null = null;
  
  novoItem = {
    exercicio_id: 0,
    sets: 3,
    repetitions: '10-12',
    peso_adicional_kg: 0
  };

  constructor(
    private treinoService: TreinoService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {
    addIcons({ addOutline, barbellOutline, trashOutline, closeCircleOutline });
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.carregarDados();
  }

  carregarDados() {
    this.treinoService.getFichas().subscribe(res => this.fichas = res);
    this.treinoService.getExercicios().subscribe(res => this.exercicios = res);
  }

  // Cria ficha
  async criarFicha() {
    const alert = await this.alertCtrl.create({
      header: 'Nova Ficha',
      inputs: [{ name: 'nome', placeholder: 'Nome (ex: Treino A - Peito)' }],
      buttons: [
        'Cancelar',
        {
          text: 'Criar',
          handler: (data) => {
            if(!data.nome) return;
            this.treinoService.criarFicha(data.nome).subscribe(() => {
              this.mostrarToast('Ficha criada!');
              this.carregarDados();
            });
          }
        }
      ]
    });
    await alert.present();
  }

  // Apaga a ficha inteira
  async apagarFicha(ficha: Ficha) {
    const alert = await this.alertCtrl.create({
      header: 'Apagar Treino?',
      message: `Isso vai excluir a ficha <strong>${ficha.name}</strong> e todos os exercícios dela.`,
      buttons: [
        'Cancelar',
        {
          text: 'Apagar',
          role: 'destructive',
          handler: () => {
            this.treinoService.deletarFicha(ficha.id!).subscribe(() => {
              this.mostrarToast('Ficha apagada.');
              this.carregarDados();
            });
          }
        }
      ]
    });
    await alert.present();
  }

  // Remove um exercício de dentro da ficha
  async removerItem(item: any) {
    const alert = await this.alertCtrl.create({
      header: 'Remover Exercício',
      message: 'Tirar este exercício dessa ficha?',
      buttons: [
        'Manter',
        {
          text: 'Remover',
          role: 'destructive',
          handler: () => {
            this.treinoService.deletarItemFicha(item.id).subscribe(() => {
              this.mostrarToast('Exercício removido da ficha.');
              this.carregarDados();
            });
          }
        }
      ]
    });
    await alert.present();
  }

  // Métodos do Modal
  abrirAdicionarExercicio(fichaId: number) {
    this.fichaSelecionadaId = fichaId;
    this.novoItem.exercicio_id = 0;
    this.isModalOpen = true;
  }

  fecharModal() {
    this.isModalOpen = false;
  }

  salvarItem() {
    if (!this.fichaSelecionadaId || !this.novoItem.exercicio_id) {
      this.mostrarToast('Selecione um exercício!', 'warning');
      return;
    }
    this.treinoService.adicionarItemFicha(this.fichaSelecionadaId, this.novoItem).subscribe({
      next: () => {
        this.mostrarToast('Exercício adicionado!');
        this.fecharModal();
        this.carregarDados();
      },
      error: (err) => {
        console.error(err);
        this.mostrarToast('Erro ao adicionar.', 'danger');
      }
    });
  }

  async mostrarToast(msg: string, color: string = 'success') {
    const toast = await this.toastCtrl.create({ message: msg, duration: 2000, color: color });
    toast.present();
  }
}