import { Game } from 'boardgame.io';
import { GameState, Card, BoardState, AgentCard } from '@shared/types';
import { INVALID_MOVE } from 'boardgame.io/core';

const allStartingCards: AgentCard[] = [
  { id: 'c_recon', name: 'Reconnaissance', type: 'main', agentIcons: ['city'] },
  { id: 'c_dagger', name: 'Dagger', type: 'main', agentIcons: ['landsraad'] },
  { id: 'c_dagger', name: 'Dagger', type: 'main', agentIcons: ['landsraad'] },
  { id: 'c_seek', name: 'Seek Allies', type: 'main', agentIcons: ['bene_gesserit', 'emperor', 'fremen', 'spacing_guild'] },
  { id: 'c_signet', name: 'Signet Ring', type: 'main', agentIcons: ['spice_trade', 'landsraad', 'city'] },
  { id: 'c_dune', name: 'Dune, The Desert Planet', type: 'main', agentIcons: ['spice_trade'] },
  { id: 'c_dune', name: 'Dune, The Desert Planet', type: 'main', agentIcons: ['spice_trade'] },
  { id: 'c_diplomacy', name: 'Diplomacy', type: 'main', agentIcons: ['bene_gesserit', 'emperor', 'fremen', 'spacing_guild'] },
  { id: 'c_convincing', name: 'Convincing Argument', type: 'main', agentIcons: [] },
  { id: 'c_convincing', name: 'Convincing Argument', type: 'main', agentIcons: [] },
];

const imperiumCards: Card[] = [
  { id: 'i_ambush', name: 'Ambush', type: 'intrigue' },
  { id: 'i_secret', name: 'Secret Deal', type: 'intrigue' },
];

const prepareTheWay : AgentCard = { id: 'r_prepare_the_way', name: 'Prepare the Way', type: 'main', agentIcons: ['landsraad', 'city'] };
const spiceMustFlow : AgentCard = { id: 'r_spice_must_flow', name: 'Spice Must Flow', type: 'main', agentIcons: [] };


const allIntrigueCards: Card[] = [
  { id: 'i_ambush', name: 'Ambush', type: 'intrigue' },
  { id: 'i_secret', name: 'Secret Deal', type: 'intrigue' },
];

const allLeaderCards: Card[] = [
  { id: 'l_muaddib', name: 'Muad\'Dib', type: 'main' },
  { id: 'l_margot_fenry', name: 'Margot Fenry', type: 'main' },
  { id: 'l_gurney_halleck', name: 'Gurney Halleck', type: 'main' },
  { id: 'l_duncan', name: 'Duncan Idaho', type: 'main' },
];

// fill this with all the conflict cards
const allConflictCards: Card[] = [
  { id: 'cf_1', name: 'Skirmish', type: 'conflict' },
  
];

export const DuneUprising: Game<GameState> = {
  name: 'dune-uprising',
  setup: ({ ctx }) => {
    const intrigueDeck = [...allIntrigueCards].sort(() => Math.random() - 0.5);
    const leaderDeck = [...allLeaderCards].sort(() => Math.random() - 0.5);
    // TODO: one lv 1, five lv 2, all lv 3
    const conflictDeck = [...allConflictCards].sort(() => Math.random() - 0.5);
    const reserveDeck = [
      ...Array.from({ length: 8 }, () => ({ ...prepareTheWay })),
      ...Array.from({ length: 10 }, () => ({ ...spiceMustFlow }))
    ];

    const board: BoardState = {
      'ImperialBasin': {
        agentIcon: 'spice_trade',
        playerAgents: [],
        cost: {
          water: 0,
          spice: 0,
          solari: 0,
        },
        rewards: {
          water: 0,
          spice: 1,
          solari: 0,
        }
      }
    };
    const players: GameState['players'] = {};
    const garrisonedTroops: GameState['garrisonedTroops'] = {};
    const currentRound = 1;
    const shieldWallUp = true;
    for (let i = 0; i < ctx.numPlayers; i++) {
      const deck = [...allStartingCards].sort(() => Math.random() - 0.5);
      // randomize leader for now
      const playerLeader = leaderDeck.pop()!;
      players[i.toString()] = {
        hand: [],
        intrigue: [],
        deck: deck,
        leader: playerLeader,
        water: 1,
        spice: 0,
        solari: 0,
        spies: 3,
        availableAgents: 2,
        revealed: false,
      };
      garrisonedTroops[i.toString()] = 3;
    }

    return { intrigueDeck, players, garrisonedTroops, conflictDeck, currentRound, shieldWallUp, board };
  },

  moves: {
    drawCard: ({ G, ctx }) => {
      const playerId = ctx.currentPlayer;
      const card = G.players[playerId].deck.pop();

      if (!card) return;

      G.players[playerId].hand.push(card);
    },
    placeAgent: ({ G, playerID }, cardId: string, location: string) => {
      // Validation phase
      const playerState = G.players[playerID];

      const card = playerState.hand.find(card => card.id === cardId);
      if (!card) {
        console.log('Invalid move: Card not found in hand');
        return INVALID_MOVE;
      }

      const locationState = G.board[location];
      if (!locationState) {
        console.log('Invalid move: Location does not exist');
        return INVALID_MOVE;
      }

      if (!card.agentIcons.includes(locationState.agentIcon)) {
        console.log('Invalid move: Card does not have required agent icon');
        return INVALID_MOVE;
      }

      if (playerState.availableAgents <= 0) {
        console.log('Invalid move: No available agents');
        return INVALID_MOVE;
      }
      const { cost, rewards } = locationState;

      if (playerState.water < cost.water || 
          playerState.spice < cost.spice || 
          playerState.solari < cost.solari) {
        console.log('Invalid move: Insufficient resources');
        return INVALID_MOVE;
      }
      // TODO: Check Spy
      if (locationState.playerAgents.length > 0) {
        console.log('Invalid move: Location already has an agent');
        return INVALID_MOVE;
      }
      // All validation passed, now apply changes
      playerState.hand = playerState.hand.filter(card => card.id !== cardId);
      playerState.availableAgents--;
      locationState.playerAgents.push(playerID);
      playerState.water += (rewards.water - cost.water);
      playerState.spice += (rewards.spice - cost.spice); 
      playerState.solari += (rewards.solari - cost.solari);
      // TODO: Card effects
      // TODO: Garrisoned troops
    },
    reveal: ({ G, ctx }) => {
      const playerId = ctx.currentPlayer;
      G.players[playerId].revealed = true;
    },
    endTurn: ({ G, ctx }) => {
      const playerId = ctx.currentPlayer;
      ctx.currentPlayer = ((parseInt(playerId) + 1) % ctx.numPlayers).toString();
    }
  },

  minPlayers: 2,
  maxPlayers: 4,


  // Ends the game if this returns anything.
  // The return value is available in `ctx.gameover`.
  endIf: ({ G, ctx, random, ...plugins }) => {
    return G.currentRound > 10;
  },

  // Called at the end of the game.
  // `ctx.gameover` is available at this point.
  onEnd: ({ G, ctx, events, random, ...plugins }) => G,

  // Disable undo feature for all the moves in the game
  disableUndo: true,

  // Transfer delta state with JSON Patch in multiplayer
  deltaState: true,
}; 