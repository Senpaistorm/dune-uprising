import { Game } from 'boardgame.io';
import { GameState, Card } from '@shared/types';

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

const allIntrigueCards: Card[] = [
  { id: 'i_ambush', name: 'Ambush', type: 'intrigue' },
  { id: 'i_secret', name: 'Secret Deal', type: 'intrigue' },
];

const allLeaderCards: Card[] = [
  { id: 'l_muaddib', name: 'Muad\'Dib', type: 'main' },
  { id: 'l_jessica', name: 'Lady Jessica', type: 'main' },
  { id: 'l_paul', name: 'Paul Atreides', type: 'main' },
  { id: 'l_duncan', name: 'Duncan Idaho', type: 'main' },
];

export const DuneUprising: Game<GameState> = {
  name: 'dune-uprising',
  setup: ({ ctx }) => {
    const deck = [...allStartingCards].sort(() => Math.random() - 0.5);
    const intrigueDeck = [...allIntrigueCards].sort(() => Math.random() - 0.5);
    const leaderDeck = [...allLeaderCards].sort(() => Math.random() - 0.5);
    const players: GameState['players'] = {};
    for (let i = 0; i < ctx.numPlayers; i++) {
      // Give each player 5 cards from the deck
      const playerDeck = deck.splice(0, 5);
      players[i.toString()] = {
        hand: [],
        intrigue: [],
        deck: playerDeck,
      };
    }

    return { deck, intrigueDeck, leaderDeck, players };
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
    Agent: {
      moves: {
        drawCard: ({ G, ctx }) => {
          const playerId = ctx.currentPlayer;
          const card = G.players[playerId].deck.pop();

          if (!card) return;
        }
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
  endIf: ({ G, ctx, random, ...plugins }) => null,

  // Called at the end of the game.
  // `ctx.gameover` is available at this point.
  onEnd: ({ G, ctx, events, random, ...plugins }) => G,

  // Disable undo feature for all the moves in the game
  disableUndo: true,

  // Transfer delta state with JSON Patch in multiplayer
  deltaState: true,
}; 