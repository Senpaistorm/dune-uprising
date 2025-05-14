export interface GameState {
    intrigueDeck: Card[];
    players: {
        [playerId: string]: PlayerState;
    };
    conflictDeck: Card[];
    currentRound: number;
    shieldWallUp: boolean;
    board: BoardState;
    spyBoard: SpyBoard;
    imperialRow: AgentCard[];
}

export interface Card {
    id: string;
    name: string;
    type: 'main' | 'intrigue' | 'conflict';
}

export interface AgentCard extends Card {
    agentIcons: AgentIcon[];
    persuasion: number;
    persuasionCost?: number;
    abilities?: CardAbility[];
}

export interface CardAbility {
    type: 'agent' | 'reveal' | 'trash' | 'discard';
    effect: CostRewardOption;
}


export interface PlayerState {
    hand: AgentCard[];
    deck: AgentCard[];
    intrigue: Card[];
    leader: Card;  
    discard: AgentCard[];
    trash: AgentCard[];
    cardsInPlay: AgentCard[];

    water: number;
    spice: number;
    solari: number;
    spies: number;

    totalAgents: number;
    agentsOnBoard: number;

    revealed: boolean;
    sentAgent: boolean;
    currentPersuasion: number;
    garrisonedTroops: number;
    troopSupply: number;
    hasHook: boolean;

    influence: {
        fremen: number;
        emperor: number;
        spacing_guild: number;
        bene_gesserit: number;
    }
}

export type AgentIcon = 'emperor' | 'spacing_guild' | 'bene_gesserit' | 'spy' | 'fremen' | 'landsraad' | 'city' | 'spice_trade';

export interface BoardState {
    [location: string]: BoardLocation;
}

export interface CostRewardOption {
    cost?: Partial<ResourceMap>; // e.g. { spice: 1 }
    rewards: RewardInstruction[];
}

export interface BoardLocation {
    playerAgents: string[]; // player IDs
    agentIcon: AgentIcon;
    options: CostRewardOption[];
}

export type RewardInstruction =
    | GainReward
    | ConditionalReward
    | ChoiceReward;

export interface GainReward {
    type: 'gain' | 'trash';
    resource: 'solari' | 'water' | 'spice' | 'card' | 'troop' | 'influence' | 'sandworm' | 'intrigue' | 'persuasion' | 'hook' | 'spy' | 'swordmaster' | 'recall' | 'breakWall';
    amount: number;
    faction?: keyof PlayerState['influence']; // for influence gains
}

export interface ConditionalReward {
    type: 'if';
    condition: Condition;
    then: RewardInstruction[];
    else?: RewardInstruction[];
}

export interface Condition {
    check: 'influenceAtLeast' | 'hasResource' | 'hasCard' | 'factionAccess' | 'hasHook';
    faction?: keyof PlayerState['influence'];
    value?: number;
    resource?: keyof ResourceMap;
}

export interface ChoiceReward {
    type: 'chooseOne';
    options: RewardInstruction[]; // mutually exclusive
}

export interface ResourceMap {
    solari: number;
    water: number;
    spice: number;
}

export interface SpyBoard {
    [location: string]: SpyState;
}

export interface SpyState {
    occupiedPlayers: string[];
    connectedLocations: string[];
}
