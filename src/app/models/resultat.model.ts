import { Carte } from './carte.model';

export interface Resultat {
  joueur: Carte;
  bot: Carte;
  gagnant: 'joueur' | 'bot' | 'egalite';
}
