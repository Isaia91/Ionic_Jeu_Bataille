import { Injectable } from '@angular/core';
import { Carte } from '../models/carte.model';
import { Resultat } from '../models/resultat.model';


@Injectable({
  providedIn: 'root'
})
export class JeuBatailleService {

  private compteurPlis = 0;
  private couleurs: Carte['couleur'][] = ['♠', '♥', '♦', '♣'];
  private deck: Carte[] = [];

  joueurDeck: Carte[] = [];
  botDeck: Carte[] = [];
  pileMilieu: Carte[] = [];

  dernierTirage: { joueur: Carte, bot: Carte, gagnant: 'joueur' | 'bot' | 'egalite' } | null = null;

  constructor() {
    this.initialiserJeu();
  }

  private initialiserJeu() {
    this.deck = this.genererDeckMelange();
    this.joueurDeck = this.deck.slice(0, 26);
    this.botDeck = this.deck.slice(26);
    this.pileMilieu = [];
  }

  private genererDeckMelange(): Carte[] {
    const deck: Carte[] = [];

    for (let valeur = 2; valeur <= 14; valeur++) {
      for (let couleur of this.couleurs) {
        deck.push({ valeur, couleur });
      }
    }

    return deck.sort(() => Math.random() - 0.5); // Shuffle
  }

  tirerCartes(mode: 'classique' | 'rapide'): Resultat | null {
    if (this.joueurDeck.length === 0 || this.botDeck.length === 0) {
      return null; // FIN
    }

    this.compteurPlis++;

    const joueurCarte = this.joueurDeck.shift();
    const botCarte = this.botDeck.shift();

    if (!joueurCarte || !botCarte) return null;

    this.pileMilieu.push(joueurCarte, botCarte);

    const gagnant = this.comparerCartes(joueurCarte, botCarte);

    if (gagnant === 'joueur') {
      //si le mode est rapide on ne prend qu'une carte ; sinon il prend toutes les cartes du pli.
      if (mode === 'classique') this.joueurDeck.push(...this.pileMilieu);
      else this.joueurDeck.push(...this.pileMilieu.slice(0, 1));
    } else if (gagnant === 'bot') {
      if (mode === 'classique') this.botDeck.push(...this.pileMilieu);
      else this.botDeck.push(...this.pileMilieu.slice(0, 1));
    }


    this.dernierTirage = { joueur: joueurCarte, bot: botCarte, gagnant };
    this.pileMilieu = [];

    return this.dernierTirage;

  }

  getCompteurPlis() {
    return this.compteurPlis;
  }

  resetCompteur() {
    this.compteurPlis = 0;
  }


  private comparerCartes(c1: Carte, c2: Carte): 'joueur' | 'bot' | 'egalite' {
    if (c1.valeur > c2.valeur) return 'joueur';
    if (c1.valeur < c2.valeur) return 'bot';
    return 'egalite';
  }

  getScores(): { joueur: number; bot: number } {
    return {
      joueur: this.joueurDeck.length,
      bot: this.botDeck.length,
    };
  }

  nouvellePartie() {
    this.initialiserJeu();
  }
}
