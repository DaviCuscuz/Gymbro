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
import { addOutline, barbellOutline, trashOutline } from 'ionicons/icons';

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
  exercicios: Exercicio[] = []; // A lista que vai popular o Select
  
  isModalOpen = false;
  fichaSelecionadaId: number | null = null;
  
  // Objeto temporário para o formulário
  novoItem = {
    exercicio_id: 0, // Começa zerado
    sets: 3,
    repetitions: '10-12',
    peso_adicional_kg: 0
  };

  constructor(
    private treinoService: TreinoService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {
    addIcons({ addOutline, barbellOutline, trashOutline });
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.carregarDados();
  }

  carregarDados() {
    // Carrega as Fichas
    this.treinoService.getFichas().subscribe({
      next: (res) => this.fichas = res,
      error: (err) => console.error(err)
    });

    // Carrega a Lista de Exercícios (pra aparecer no Modal)
    this.treinoService.getExercicios().subscribe({
      next: (res) => this.exercicios = res,
      error: (err) => console.error(err)
    });
  }

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

  abrirAdicionarExercicio(fichaId: number) {
    this.fichaSelecionadaId = fichaId;
    this.novoItem.exercicio_id = 0; // Reseta a seleção
    this.isModalOpen = true;
  }

  fecharModal() {
    this.isModalOpen = false;
  }

  salvarItem() {
    // Validação básica
    if (!this.fichaSelecionadaId || !this.novoItem.exercicio_id) {
      this.mostrarToast('Selecione um exercício!', 'warning');
      return;
    }

    // Chama o serviço passando os dados
    this.treinoService.adicionarItemFicha(this.fichaSelecionadaId, this.novoItem).subscribe({
      next: () => {
        this.mostrarToast('Exercício adicionado!');
        this.fecharModal();
        this.carregarDados(); // Atualiza a tela pra mostrar o novo item
      },
      error: (err) => {
        console.error(err);
        this.mostrarToast('Erro ao adicionar. Verifique a conexão.', 'danger');
      }
    });
  }

  async mostrarToast(msg: string, color: string = 'success') {
    const toast = await this.toastCtrl.create({ message: msg, duration: 2000, color: color });
    toast.present();
  }
}