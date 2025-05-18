// Importation des modules Angular et Ionic nécessaires
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JeuBatailleService } from 'src/app/services/jeu-bataille.service'; // Service contenant la logique du jeu
import { Carte } from 'src/app/models/carte.model'; // Modèle de carte
import { Partie } from 'src/app/models/partie.model'; // Modèle de partie pour l'historique
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';

// Déclaration du composant Ionic Angular de la page de jeu
@Component({
  selector: 'app-game',
  standalone: true, // Composant autonome
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    RouterLink
  ],
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage {
  // Déclaration des variables d'état du jeu
  mode: 'classique' | 'rapide' = 'classique'; // Mode de jeu sélectionné
  joueurCarte: Carte | null = null;           // Carte du joueur
  botCarte: Carte | null = null;              // Carte du bot
  gagnantTour: 'joueur' | 'bot' | 'egalite' | null = null; // Gagnant du tour
  score = { joueur: 0, bot: 0 };              // Score actuel
  partieTerminee = false;                     // Indique si la partie est finie
  cartesImages: any[] = [];                   // Images des cartes chargées depuis JSON

  // Constructeur injectant les dépendances
  constructor(
    private route: ActivatedRoute,
    private jeuService: JeuBatailleService,
    private http: HttpClient
  ) {
    // Récupération du mode de jeu depuis les paramètres de l'URL
    this.route.queryParams.subscribe(params => {
      this.mode = params['mode'] || 'classique';
    });

    // Chargement des métadonnées des cartes depuis un fichier JSON
    this.chargerCartesJSON();
  }

  // Charge les informations des cartes (nom de fichier, couleur, valeur) à partir d’un fichier JSON local
  private chargerCartesJSON() {
    this.http.get<any[]>('assets/cartes.json').subscribe(data => {
      this.cartesImages = data;
    });
  }

  // Renvoie le chemin de l'image correspondant à une carte donnée
  getImageCarte(carte: Carte | null): string {
    if (!carte) return '';
    const match = this.cartesImages.find(
      c => c.valeur === carte.valeur && c.couleur === carte.couleur
    );
    return match ? `assets/img/cards/${match.fichier}` : '';
  }

  // Gère le tirage des cartes et la logique de chaque tour de jeu
  tirer() {
    if (this.partieTerminee) return;

    const tirage = this.jeuService.tirerCartes(this.mode);

    // Si le jeu est terminé (plus de cartes à tirer)
    if (!tirage) {
      this.partieTerminee = true;
      this.gagnantTour = this.score.joueur > this.score.bot ? 'joueur' : 'bot';

      // Création de l’objet partie pour l’historique
      const partie: Partie = {
        date: new Date().toLocaleString(),
        mode: this.mode,
        gagnant: this.gagnantTour,
        plis: this.jeuService.getCompteurPlis(),
      };

      // Ajout de la partie à l'historique stocké dans le localStorage
      const historique = JSON.parse(localStorage.getItem('scoreboard') || '[]');
      historique.push(partie);
      localStorage.setItem('scoreboard', JSON.stringify(historique));

      return;
    }

    // Mise à jour des cartes tirées et du gagnant
    this.joueurCarte = tirage.joueur;
    this.botCarte = tirage.bot;
    this.gagnantTour = tirage.gagnant;

    // Mise à jour des scores
    this.updateScores();
  }

  // Réinitialise les variables pour démarrer une nouvelle partie
  nouvellePartie() {
    this.jeuService.nouvellePartie(); // Réinitialisation du service
    this.joueurCarte = null;
    this.botCarte = null;
    this.gagnantTour = null;
    this.partieTerminee = false;
    this.updateScores(); // Réinitialise les scores
    this.jeuService.resetCompteur(); // Réinitialise le compteur de plis
  }

  // Met à jour les scores depuis le service et termine la partie si un des scores est à 0
  private updateScores() {
    this.score = this.jeuService.getScores();

    if (this.score.joueur === 0 || this.score.bot === 0) {
      this.partieTerminee = true;
      this.gagnantTour = this.score.joueur > this.score.bot ? 'joueur' : 'bot';
    }
  }
}
