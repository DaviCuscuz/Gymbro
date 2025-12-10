import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, 
  IonList, IonItem, IonLabel, IonButton, IonIcon, IonFab, IonFabButton,
  AlertController, ToastController 
} from '@ionic/angular/standalone';
import { TreinoService, Exercicio } from '../../services/treino.service';
import { addIcons } from 'ionicons';
import { addOutline, createOutline, trashOutline, barbellOutline } from 'ionicons/icons';

@Component({
  selector: 'app-meus-exercicios',
  templateUrl: './meus-exercicios.html',
  styleUrls: ['./meus-exercicios.scss'], 
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
    IonList, IonItem, IonLabel, IonButton, IonIcon, IonFab, IonFabButton
  ]
})
export class MeusExerciciosPage implements OnInit {

  meusExercicios: Exercicio[] = [];

  constructor(
    private treinoService: TreinoService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {
    // Registrando os ícones usados nesta página
    addIcons({ addOutline, createOutline, trashOutline, barbellOutline });
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.carregarDados();
  }

  carregarDados() {
    this.treinoService.getExercicios().subscribe({
      next: (todos) => {
        // FILTRO: Só mostra os exercícios criados pelo usuário (onde created_by existe)
        this.meusExercicios = todos.filter(ex => ex.created_by !== null);
      },
      error: (err) => {
        console.error(err);
        this.mostrarToast('Erro ao carregar exercícios.', 'danger');
      }
    });
  }

  // 1. CRIAR
  async criarExercicio() {
    const alert = await this.alertCtrl.create({
      header: 'Novo Exercício',
      inputs: [
        { name: 'name', type: 'text', placeholder: 'Nome (ex: Rosca 21)' },
        { name: 'grupo', type: 'text', placeholder: 'Grupo (ex: Bíceps)' }
      ],
      buttons: [
        'Cancelar',
        {
          text: 'Salvar',
          handler: (data) => {
            if (data.name && data.grupo) {
              const novo = { name: data.name, grupo_muscular: data.grupo };
              this.treinoService.criarExercicio(novo).subscribe({
                next: () => {
                  this.mostrarToast('Exercício criado!', 'success');
                  this.carregarDados();
                },
                error: () => this.mostrarToast('Erro ao criar.', 'danger')
              });
            }
          }
        }
      ]
    });
    await alert.present();
  }

  // 2. EDITAR
  async editarExercicio(ex: Exercicio) {
    const alert = await this.alertCtrl.create({
      header: 'Editar',
      inputs: [
        { name: 'name', value: ex.name, placeholder: 'Nome' },
        { name: 'grupo', value: ex.grupo_muscular, placeholder: 'Grupo' }
      ],
      buttons: [
        'Cancelar',
        {
          text: 'Salvar',
          handler: (data) => {
            const atualizado = { ...ex, name: data.name, grupo_muscular: data.grupo };
            this.treinoService.editarExercicio(ex.id!, atualizado).subscribe({
              next: () => {
                this.mostrarToast('Atualizado com sucesso!', 'success');
                this.carregarDados();
              },
              error: () => this.mostrarToast('Erro ao atualizar.', 'danger')
            });
          }
        }
      ]
    });
    await alert.present();
  }

  // 3. EXCLUIR
  async excluirExercicio(ex: Exercicio) {
    const alert = await this.alertCtrl.create({
      header: 'Excluir?',
      message: `Tem certeza que quer apagar <strong>${ex.name}</strong> para sempre?`,
      buttons: [
        'Cancelar',
        {
          text: 'Apagar',
          role: 'destructive',
          handler: () => {
            this.treinoService.deletarExercicio(ex.id!).subscribe({
              next: () => {
                this.mostrarToast('Exercício apagado.', 'success');
                this.carregarDados();
              },
              error: () => this.mostrarToast('Erro ao apagar.', 'danger')
            });
          }
        }
      ]
    });
    await alert.present();
  }

  async mostrarToast(msg: string, color: string) {
    const toast = await this.toastCtrl.create({ message: msg, duration: 2000, color: color });
    toast.present();
  }
}