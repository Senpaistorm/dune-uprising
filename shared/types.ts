export interface GameState {
  intrigueDeck: Card[];
  players: {
    [playerId: string]: PlayerState;
  };
  garrisonedTroops: {
    [playerId: string]: number;
  }
  conflictDeck: Card[];
  currentRound: number;
  shieldWallUp: boolean;
  board: BoardState;
}

export interface Card {
  id: string;
  name: string;
  type: 'main' | 'intrigue' | 'conflict';
}

export interface AgentCard extends Card {
  agentIcons: AgentIcon[];
}

export interface PlayerState {
  hand: AgentCard[];
  deck: AgentCard[];
  intrigue: Card[];
  leader: Card;
  water: number;
  spice: number;
  solari: number;
  spies: number;
  availableAgents: number;
  revealed: boolean;
}

export type AgentIcon = 'emperor' | 'spacing_guild' | 'bene_gesserit' | 'spy' | 'fremen' | 'landsraad' | 'city' | 'spice_trade';

export interface BoardState {
  [location: string]: {
    playerAgents: string[];
    agentIcon: AgentIcon;
    cost: {
      water: number;
      spice: number;
      solari: number;
    },
    rewards: {
      water: number;
      spice: number;
      solari: number;
    }
  }
}