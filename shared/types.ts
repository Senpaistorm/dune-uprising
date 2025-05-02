export interface Card {
    id: string;
    name: string;
    type: 'main' | 'intrigue';
  }
  
  export interface PlayerState {
    hand: Card[];
    deck: Card[];
    intrigue: Card[];
  }
  
  export interface GameState {
    intrigueDeck: Card[];
    players: {
      [playerId: string]: PlayerState;
    };
  }
  