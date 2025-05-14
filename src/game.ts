import { Game } from 'boardgame.io';
import { GameState, Card, BoardState, AgentCard, PlayerState, CostRewardOption } from '@shared/types';
import { INVALID_MOVE } from 'boardgame.io/core';
import { board as initialBoard } from './board';
import { spyBoard as initialSpyBoard } from './spyBoard';

const allStartingCards: AgentCard[] = [
    { id: 'c_recon', name: 'Reconnaissance', type: 'main', agentIcons: ['city'], persuasion: 1 },
    { id: 'c_dagger', name: 'Dagger', type: 'main', agentIcons: ['landsraad'], persuasion: 0 },
    { id: 'c_dagger', name: 'Dagger', type: 'main', agentIcons: ['landsraad'], persuasion: 0 },
    { id: 'c_seek', name: 'Seek Allies', type: 'main', agentIcons: ['bene_gesserit', 'emperor', 'fremen', 'spacing_guild'], persuasion: 0 },
    { id: 'c_signet', name: 'Signet Ring', type: 'main', agentIcons: ['spice_trade', 'landsraad', 'city'], persuasion: 1 },
    { id: 'c_dune', name: 'Dune, The Desert Planet', type: 'main', agentIcons: ['spice_trade'], persuasion: 1 },
    { id: 'c_dune', name: 'Dune, The Desert Planet', type: 'main', agentIcons: ['spice_trade'], persuasion: 1 },
    { id: 'c_diplomacy', name: 'Diplomacy', type: 'main', agentIcons: ['bene_gesserit', 'emperor', 'fremen', 'spacing_guild'], persuasion: 1 },
    { id: 'c_convincing', name: 'Convincing Argument', type: 'main', agentIcons: [], persuasion: 2 },
    { id: 'c_convincing', name: 'Convincing Argument', type: 'main', agentIcons: [], persuasion: 2 },
];

const imperiumCards: AgentCard[] = [
    { id: 'i_dangeorous_rhetoric', name: 'Dangeorous Rhetoric', type: 'main', agentIcons: ['landsraad'], persuasion: 1, persuasionCost: 3 },
    { id: 'i_guild_envoy', name: 'Guild Envoy', type: 'main', agentIcons: ['spacing_guild'], persuasion: 1, persuasionCost: 3 },
];

const prepareTheWay: AgentCard = { 
    id: 'r_prepare_the_way', name: 'Prepare the Way', type: 'main', agentIcons: ['landsraad', 'city'], persuasion: 2, persuasionCost: 2 };
const spiceMustFlow: AgentCard = { 
    id: 'r_spice_must_flow', name: 'Spice Must Flow', type: 'main', agentIcons: [], persuasion: 0, persuasionCost: 9 };

const allIntrigueCards: Card[] = [
    { id: 'i_ambush', name: 'Ambush', type: 'intrigue' },
    { id: 'i_secret', name: 'Secret Deal', type: 'intrigue' },
];

const allLeaderCards: Card[] = [
    { id: 'l_muaddib', name: 'Muad\'Dib', type: 'main' },
    { id: 'l_margot_fenry', name: 'Margot Fenry', type: 'main' },
    { id: 'l_gurney_halleck', name: 'Gurney Halleck', type: 'main' },
    { id: 'l_feyd_rautha', name: 'Feyd Rautha', type: 'main' },
];

// fill this with all the conflict cards
const allConflictCards: Card[] = [
    { id: 'cf_1', name: 'Skirmish', type: 'conflict' },
];

function resolvePlayerState(playerState: PlayerState, locationOption: CostRewardOption) {
    if (locationOption.cost) {
        playerState.water -= locationOption.cost.water || 0;
        playerState.spice -= locationOption.cost.spice || 0;
        playerState.solari -= locationOption.cost.solari || 0;
    }
    for (const reward of locationOption.rewards) {
        if (reward.type === 'gain') {
            if (reward.resource === 'water') {
                playerState.water += reward.amount;
            } else if (reward.resource === 'spice') {
                playerState.spice += reward.amount;
            } else if (reward.resource === 'solari') {
                playerState.solari += reward.amount;
            } else if (reward.resource === 'card') {
                // Draw cards directly since we're in a move
                for (let i = 0; i < reward.amount; i++) {
                    if (playerState.deck.length === 0) {
                        if (playerState.discard.length === 0) {
                            break;
                        }
                        playerState.deck = [...playerState.discard].sort(() => Math.random() - 0.5);
                        playerState.discard = [];
                    }
                    const card = playerState.deck.pop();
                    if (card) {
                        playerState.hand.push(card);
                    }
                }
            } else if (reward.resource === 'troop') {
                playerState.troopSupply -= reward.amount;
                playerState.garrisonedTroops += reward.amount;
            } else if (reward.resource === 'influence') {
                playerState.influence[reward.faction as keyof PlayerState['influence']] += reward.amount;
            }
        }
    }
}

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
        const imperialRow = [
            ...Array.from({ length: 8 }, () => ({ ...imperiumCards[0]}))
        ];

        let board = { ...initialBoard };
        let spyBoard = { ...initialSpyBoard };
        let players: GameState['players'] = {};
        let currentRound = 1;
        let shieldWallUp = true;
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
                totalAgents: 2,
                agentsOnBoard: 0,
                revealed: false,
                troopSupply: 9,
                garrisonedTroops: 3,
                sentAgent: false,
                hasHook: false,
                discard: [],
                trash: [],
                cardsInPlay: [],
                influence: {
                    fremen: 0,
                    emperor: 0,
                    spacing_guild: 0,
                    bene_gesserit: 0,
                },
                currentPersuasion: 0,
            };
        }
        // each player draws 5 cards
        for (const playerId in players) {
            for (let i = 0; i < 5; i++) {
                const card = players[playerId].deck.pop();
                if (card) {
                    players[playerId].hand.push(card);
                }
            }
        }

        return { intrigueDeck, players, conflictDeck, currentRound, shieldWallUp, board, spyBoard, imperialRow };
    },

    moves: {
        drawCard: ({ G, playerID }, count = 1) => {
            const playerState = G.players[playerID];
            for (let i = 0; i < count; i++) {
                if (playerState.deck.length === 0) {
                    if (playerState.discard.length === 0) {
                        return;
                    }
                    playerState.deck = [...playerState.discard].sort(() => Math.random() - 0.5);
                    playerState.discard = [];
                }
                const card = playerState.deck.pop();
                if (card) {
                    playerState.hand.push(card);
                }
            }
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

            if (playerState.agentsOnBoard >= playerState.totalAgents) {
                console.log('Invalid move: No available agents');
                return INVALID_MOVE;
            }

            // TODO: Check Spy
            if (locationState.playerAgents.length > 0) {
                console.log('Invalid move: Location already has an agent');
                return INVALID_MOVE;
            }
            // All validation passed, now apply changes to player state
            playerState.sentAgent = true;
            // Find and remove only one copy of the card
            const cardIndex = playerState.hand.findIndex(card => card.id === cardId);
            if (cardIndex !== -1) {
                playerState.hand.splice(cardIndex, 1);
            }
            playerState.agentsOnBoard++;
            playerState.cardsInPlay.push(card);
            locationState.playerAgents.push(playerID);
            // TODO: Card effects and location effects
            const locationOption = locationState.options[0];
            resolvePlayerState(playerState, locationOption);
            for (const ability of card.abilities || []) {
                if (ability.type === 'agent') {
                    resolvePlayerState(playerState, ability.effect);
                }
            }
        },
        reveal: ({ G, playerID }) => {
            const playerState = G.players[playerID];
            if (playerState.revealed || playerState.sentAgent) {
                return INVALID_MOVE;
            }
            playerState.revealed = true;
            let persuasion = 0;
            for (const card of playerState.hand) {
                persuasion += card.persuasion;
            }
            playerState.currentPersuasion = persuasion;
            // resolve reveal effects
        },
        acquireCard: ({ G, playerID }, cardId: string) => {
            const playerState = G.players[playerID];
            const card = G.imperialRow.find(card => card.id === cardId);
            if (!card) {
                return INVALID_MOVE;
            }
            if (card.persuasionCost && playerState.currentPersuasion < card.persuasionCost) {
                return INVALID_MOVE;
            }
            playerState.discard.push(card);
            playerState.currentPersuasion -= card.persuasionCost || 0;
        },
        endTurn: ({ G, ctx }) => {
            const playerId = ctx.currentPlayer;
            ctx.currentPlayer = ((parseInt(playerId) + 1) % ctx.numPlayers).toString();
            G.players[playerId].sentAgent = false;
        }
    },

    turn: {
        stages: {
            'playSpy': {
                moves: {
                    playSpy: ({ G, playerID }, spyLocationId: string) => {
                        const playerState = G.players[playerID];
                        playerState.spies--;
                        const locationState = G.board[spyLocationId];
                        if (!locationState) {
                            console.log('Invalid move: Location does not exist');
                            return INVALID_MOVE;
                        }
                        
                    }
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