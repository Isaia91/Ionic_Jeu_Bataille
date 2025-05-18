export interface Partie {
  date: string;
  mode: 'classique' | 'rapide';
  gagnant: 'joueur' | 'bot';
  plis: number;
}
