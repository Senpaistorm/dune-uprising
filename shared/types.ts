export interface Card {
    id: string;
    name: string;
    type: 'main' | 'intrigue';
  }
  
  export interface PlayerState {
    hand: Card[];
    deck: Card[];
    intrigue: Card[];
    leader: Card;
    water: number;
    spice: number;
    solari: number;
    spies: number;
  }
  
  export interface GameState {
    intrigueDeck: Card[];
    players: {
      [playerId: string]: PlayerState;
    };
    garrisonedTroops: {
      [playerId: string]: number;
    }
  }
  