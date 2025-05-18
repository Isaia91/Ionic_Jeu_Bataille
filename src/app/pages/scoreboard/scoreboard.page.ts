import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Partie } from 'src/app/models/partie.model';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonButton
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-scoreboard',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonButton
  ],
  templateUrl: './scoreboard.page.html',
  styleUrls: ['./scoreboard.page.scss'],
})
export class ScoreboardPage implements OnInit {
  historique: Partie[] = [];

  ngOnInit() {
    this.chargerHistorique();
  }

  chargerHistorique() {
    const data = localStorage.getItem('scoreboard');
    this.historique = data ? JSON.parse(data) : [];
  }

  resetHistorique() {
    localStorage.removeItem('scoreboard');
    this.historique = [];
  }
}
