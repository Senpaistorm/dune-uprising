import { Game } from 'boardgame.io';
import { GameState, Card, BoardState } from '@shared/types';

const allStartingCards: Card[] = [
  { id: 'c_recon', name: 'Reconnaissance', type: 'main' },
  { id: 'c_dagger', name: 'Dagger', type: 'main' },
  { id: 'c_dagger', name: 'Dagger', type: 'main' },
  { id: 'c_seek', name: 'Seek Allies', type: 'main' },
  { id: 'c_signet', name: 'Signet Ring', type: 'main' },
  { id: 'c_dune', name: 'Dune, The Desert Planet', type: 'main' },
  { id: 'c_dune', name: 'Dune, The Desert Planet', type: 'main' },
  { id: 'c_diplomacy', name: 'Diplomacy', type: 'main' },
  { id: 'c_convincing', name: 'Convincing Argument', type: 'main' },
  { id: 'c_convincing', name: 'Convincing Argument', type: 'main' },
];

const imperiumCards: Card[] = [
  { id: 'i_ambush', name: 'Ambush', type: 'intrigue' },
  { id: 'i_secret', name: 'Secret Deal', type: 'intrigue' },
];

const prepareTheWay : Card = { id: 'r_prepare_the_way', name: 'Prepare the Way', type: 'main' };
const spiceMustFlow : Card = { id: 'r_spice_must_flow', name: 'Spice Must Flow', type: 'main' };


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

    drawIntrigueCard: ({ G, ctx }) => {
      const playerId = ctx.currentPlayer;
      const card = G.intrigueDeck.pop();

      if (!card) return;

      G.players[playerId].intrigue.push(card);
    },
    drawLeaderCard: ({ G, ctx }) => {
      const playerId = ctx.currentPlayer;
      const card = G.players[playerId].deck.pop();

      if (!card) return;
      
    }
  },

  phases: {
    plot: {
      moves: {
        drawCard: ({ G, ctx }) => {
          const playerId = ctx.currentPlayer;
          const card = G.players[playerId].deck.pop();

          if (!card) return;
        },
        placeAgent: ({ G, ctx, cardId, location }) => {
          const playerId = ctx.currentPlayer;
          const card = G.players[playerId].hand.find(card => card.id === cardId);

          if (!card) return;

          G.players[playerId].hand = G.players[playerId].hand.filter(card => card.id !== cardId);
          G.players[playerId].availableAgents--;
          G.board[location as string].playerAgents.push(playerId);
        },
        reveal: ({ G, ctx }) => {
          const playerId = ctx.currentPlayer;
          G.players[playerId].revealed = true;
        }
      },
      endIf: ({ G, ctx, random, ...plugins }) => {
        return Object.values(G.players).every(player => player.revealed);
      }
    },
    Combat: {
      moves: {
        drawCard: ({ G, ctx }) => {
          const playerId = ctx.currentPlayer;
          const card = G.players[playerId].deck.pop();

          if (!card) return;
        }
      }
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