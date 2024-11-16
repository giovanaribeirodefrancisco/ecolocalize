/// <reference types="google.maps" />

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { PontoDeColeta } from './pontos-de-coleta';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { Router, RouterLinkActive, RouterOutlet } from '@angular/router';

export interface PontodeColeta {
  nome: string;
  cep: string;
  latitude: number;
  longitude: number;
  endereco: string;
  tiposLixoAceitos: string[];
}

@Component({
  selector: 'app-localizar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterOutlet, RouterLinkActive],
  templateUrl: './localizar.component.html',
  styleUrls: ['./localizar.component.scss']
})
export class LocalizarComponent implements OnInit{

  cepForm: FormGroup;

  private map!: google.maps.Map;
  private readonly markers: google.maps.Marker[] = [];
  private readonly geocoder: google.maps.Geocoder;
  private googleMapsApiKey: string = 'AIzaSyCHtA9WaFtXgOHWuFMgXr337FjO4slTCUc';

  addressInput = new FormControl('');
  pontosProximos: (PontoDeColeta & { distance: number })[] = [];

  pontosDeColeta: PontoDeColeta[] = [
    {
      nome: "Parque Ibirapuera",
      cep: "04094-000",
      latitude:  -23.588333,
      longitude: -46.658890,
      endereco: "Av. Paulista, 1000, São Paulo - SP",
      tiposLixoAceitos: ["Computadores, Smartphones, Tablets, Baterias e Carregadores"]
    },
    {
      nome: "Parque Buenos Aires",
      cep: "01227-000",
      latitude:  -23.5489,
      longitude: -46.6544,
      endereco: "Av. Angélica, 1.500, São Paulo - SP",
      tiposLixoAceitos: ["Eletrônicos e Acessórios"]
    },
    {
      nome: "Instituto GEA Ética e Meio Ambiente",
      cep: "04004-000",
      latitude:  -23.5746,
      longitude: -46.6444,
      endereco: "Rua Sampaio Viana, 190 - Paraíso, São Paulo - SP",
      tiposLixoAceitos: ["Aparelhos Eletrônicos, Pilhas e Baterias"]
    },
    {
      nome: "Supermercado Pão de Açúcar",
      cep: "05401-000",
      latitude:  -23.5615,
      longitude: -46.6745,
      endereco: "Rua Alves Guimarães, 50 - Pinheiros, São Paulo - SP",
      tiposLixoAceitos: ["Pilhas, Baterias e Pequenos Eletrônicos"]
    },
    {
      nome: "Ecoponto Vila Mariana",
      cep: "04119-002",
      latitude:  -23.5964,
      longitude: -46.6378,
      endereco: "Rua Afonso Celso, 147 - Vila Mariana, São Paulo - SP",
      tiposLixoAceitos: ["Resíduos Eletrônicos"]
    },
    {
      nome: "Parque Anhanguera",
      cep: "03081-003",
      latitude:  -23.5410,
      longitude: -46.5700,
      endereco: "Rua Tuiuti, 515 - Tatuapé, São Paulo - SP",
      tiposLixoAceitos: ["Baterias de Celular, Baterias de Eletrônicos e Pilhas Portáteis"]
    },
    {
      nome: "Recifran",
      cep: "01507-020",
      latitude:  -23.5735,
      longitude: -46.6329,
      endereco: "Rua Junqueira Freire, 176 - Liberdade, São Paulo - SP",
      tiposLixoAceitos: ["Qualquer tipo de lixo eletrônico"]
    },
    {
      nome: "Ecoponto Sé",
      cep: "01020-001",
      latitude:  -23.5534,
      longitude: -46.6325,
      endereco: "Rua Tabatinguera, 192 - Sé, São Paulo - SP",
      tiposLixoAceitos: ["Celulares, Computadores e Periféricos"]
    },
    {
      nome: "Parque Trianon",
      cep: "01008-906",
      latitude:  -23.5615,
      longitude: -46.6647,
      endereco: "Rua Peixoto Gomide, 949 - Cerqueira César, São Paulo - SP",
      tiposLixoAceitos: ["Pequenos aparelhos eletrônicos"]
    },
    {
      nome: "Shopping Anália Franco",
      cep: "03342-000",
      latitude:  -23.5595,
      longitude: -46.5528,
      endereco: "Av. Regente Feijó, 1.739 - Tatuapé, São Paulo - SP",
      tiposLixoAceitos: ["Pilhas, Baterias e Pequenos Eletrônicos"]
    },

  ];

  constructor(private readonly fb: FormBuilder, private readonly http: HttpClient, private router: Router) {
    this.cepForm = this.fb.group({
      cep: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{5}-?\d{3}$/), // Validação para CEP no formato 00000-000 ou 00000000
          this.saoPauloCepValidator
        ]
      ]
    });

    this.geocoder = new google.maps.Geocoder();

  }

  async ngOnInit() {
    this.waitForGoogleMaps()
    .then(() => {
      this.initializeMap();
      setTimeout(() => {
        this.initializeAutocomplete(); // Aguarda o DOM renderizar
      });
      this.addCollectionPointMarkers();
    })
    .catch((error) => {
      console.error("Erro ao carregar Google Maps API:", error.message);
    });
  }

  private initializeMap(): void {
    // Lógica de inicialização do Google Maps aqui
    console.log('Google Maps carregado com sucesso!');
  }


  private loadMap() {
    const mapOptions: google.maps.MapOptions = {
      center: { lat: -23.550520, lng: -46.633308 }, // São Paulo
      zoom: 12
    };

    this.map = new google.maps.Map(
      document.getElementById('map') as HTMLElement,
      mapOptions
    );
  }

  private initializeAutocomplete() {
    const input = document.getElementById('addressSearch') as HTMLInputElement | null;
    if (!input){
      console.error('Elemento addressSerach não encontrado ou não é um HTMLInputElement');
      return;
    }

    const autocomplete = new google.maps.places.Autocomplete(input);

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();

      if (place.geometry && place.geometry.location) {
        const location = place.geometry.location;
        if (location) {
          this.map.setCenter(location);
          this.map.setZoom(15);
          this.addUserMarker(location);
          this.findNearestPoints(location);
        } else {
          alert('Localização não encontrada. Tente novamente.');
        }
      }
    });
  }

  private addUserMarker(location: google.maps.LatLng) {
    // Remove marcador anterior do usuário se existir
    if (this.markers.length > this.pontosDeColeta.length) {
      this.markers[this.markers.length - 1].setMap(null);
      this.markers.pop();
    }

    // Adiciona novo marcador
    const marker = new google.maps.Marker({
      position: location,
      map: this.map,
      icon: {
        url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
      }
    });

    this.markers.push(marker);
  }

  private addCollectionPointMarkers() {
    this.pontosDeColeta.forEach(point => {
      const marker = new google.maps.Marker({
        position: { lat: point.latitude, lng: point.longitude },
        map: this.map,
        title: point.nome
      });

      this.markers.push(marker);

      // Adiciona janela de informação ao clicar no marcador
      const infoWindow = new google.maps.InfoWindow({
        content: `<h3>${point.nome}</h3><p>${point.endereco}</p>`
      });

      marker.addListener('click', () => {
        infoWindow.open(this.map, marker);
      });
    });
  }

  private findNearestPoints(userLocation: google.maps.LatLng) {
    const points = this.pontosDeColeta.map(point => ({
      ...point,
      distance: this.calculateDistance(
        userLocation.lat(),
        userLocation.lng(),
        point.latitude,
        point.longitude
      )
    }));

    // Ordena por distância e pega os 5 mais próximos
    this.pontosProximos = points
      .toSorted((a: { distance: number; }, b: { distance: number; }) => a.distance - b.distance)
      .slice(0, 5);
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Raio da Terra em km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);

    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distância em km
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }


  saoPauloCepValidator(control: any){
    const cep = control.value.replace('-', ''); // Remover o hífen para comparar
    const validCepRanges = ['01000', '05999']; // Exemplo de intervalos fictícios
    if (cep >= validCepRanges[0] && cep <= validCepRanges[1]){
      return null; // CEP válido para SP
    }
    return { saoPauloCep: true }; // CEP inválido para SP
  }

  buscarPontos() {
    if (this.cepForm.valid) {
      const cep = this.cepForm.value.cep;
      //const userCoordinates = this.getCoordinatesFromCep(cep);

      this.getCoordinatesFromCep(cep).subscribe((userCoordinates: { latitude: number; longitude: number; }) => {
        this.pontosProximos = this.pontosDeColeta
          .map((ponto: PontoDeColeta) => ({
            ...ponto,
            distance: this.calculateDistance(
              userCoordinates.latitude,
              userCoordinates.longitude,
              ponto.latitude,
              ponto.longitude)
          }))
          .sort((a, b) => a.distance - b.distance); // Ordena por proximidade

        console.log("Pontos mais próximos:", this.pontosProximos);
      });
    }
  }

  getCoordinatesFromCep(cep: string) {
    console.log('Consultando coordenadas para o CEP:', cep);

    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${cep}&key=${this.googleMapsApiKey}`;

    return this.http.get<any>(apiUrl).pipe(
      map((response: { results: string | any[]; }) => {
        if (response.results && response.results.length > 0) {
          const location = response.results[0].geometry.location;
          return { latitude: location.lat, longitude: location.lng };
        } else {
          alert('CEP não encontrado. Verifique se o CEP está correto ou tente novamente mais tarde.');
          throw new Error('CEP não encontrado');
        }
      })
    );
  }

  private waitForGoogleMaps(): Promise<void> {
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        if (typeof google !== 'undefined' && google.maps) {
          clearInterval(interval);
          resolve();
        }
      }, 100);

      setTimeout(() => {
        clearInterval(interval);
        reject(new Error('Google Maps API não carregada.'));
      }, 5000); // Timeout após 5 segundos
    });
  }

  navigateToNotebooks() {
    this.router.navigate(['/localizar/notebooks']);
  }
  navigateToPilhas() {
    this.router.navigate(['/localizar/pilhas']);
  }
  navigateToImpressoras() {
    this.router.navigate(['/localizar/impressoras']);
  }
  navigateToBaterias() {
    this.router.navigate(['/localizar/baterias']);
  }
  navigateToLampadas() {
    this.router.navigate(['/localizar/lampadas']);
  }
  navigateToCelulares() {
    this.router.navigate(['/localizar/celulares']);
  }
}
