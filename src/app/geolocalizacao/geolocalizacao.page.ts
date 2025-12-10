import { Component, AfterViewInit } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonBackButton, IonSpinner
} from '@ionic/angular/standalone';
import { Geolocation } from '@capacitor/geolocation';
import * as L from 'leaflet';

@Component({
  selector: 'app-geolocalizacao',
  templateUrl: './geolocalizacao.page.html',
  styleUrls: ['./geolocalizacao.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle,
    IonContent, IonButtons, IonBackButton, IonSpinner
  ]
})
export class GeolocalizacaoPage implements AfterViewInit { 
  
  private map!: L.Map; 
  private marker!: L.Marker;
  private polyline!: L.Polyline;
  private watchId: string | null = null;
  public loading = false;
  
  constructor() {
    // CONSTRUTOR LIMPO (sem hacks de ícone)
  }

  ngAfterViewInit() {
    // Vamos dar um pequeno delay (100ms) ANTES de tentar criar o mapa
    // Isso dá ao Ionic/Angular tempo para desenhar o <div id="map">
    setTimeout(() => {
      this.initMap();
    }, 100); 
  }

  // Removemos o ionViewDidEnter, vamos focar no ngAfterViewInit

  ionViewWillLeave() {
    this.stopTracking();
  }

  private async initMap() {
    this.loading = true;
    try {
      const position = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
      const coords = [position.coords.latitude, position.coords.longitude] as L.LatLngExpression;

      this.map = L.map('map').setView(coords, 16); 

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(this.map);

      // O pino vai ser criado (mas o ícone pode aparecer quebrado)
      this.marker = L.marker(coords).addTo(this.map)
        .bindPopup('Você está aqui!')
        .openPopup();
      
      // A linha azul vai ser criada
      this.polyline = L.polyline([], { color: 'blue' }).addTo(this.map);
      
      this.startTracking();

    } catch (e) {
      console.error('Erro ao iniciar o mapa', e);
    } finally {
      this.loading = false;
    }
  }

  async startTracking() {
    await Geolocation.requestPermissions();
    
    this.watchId = await Geolocation.watchPosition({ enableHighAccuracy: true }, (position, err) => {
      if (err || !position) {
        return;
      }
      const newCoords = [position.coords.latitude, position.coords.longitude] as L.LatLngExpression;
      this.marker.setLatLng(newCoords);
      this.polyline.addLatLng(newCoords); // Adiciona o ponto na linha azul
    });
  }

  stopTracking() {
    if (this.watchId) {
      Geolocation.clearWatch({ id: this.watchId });
      this.watchId = null;
    }
  }
}