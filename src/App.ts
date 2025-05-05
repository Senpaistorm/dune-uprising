import { Client } from 'boardgame.io/client';
import { SocketIO } from 'boardgame.io/multiplayer';
import { DuneUprising } from './game';
import { createMatch, joinMatch, listMatches } from './lobby';

// Helper function to get parameters from URL
function getUrlParams(): { playerId?: string; matchID?: string } {
  const params = new URLSearchParams(window.location.search);
  return {
    playerId: params.get('playerId') || undefined,
    matchID: params.get('matchID') || undefined,
  };
}

class DuneUprisingClient {
  private client: any;
  private rootElement: HTMLElement;
  private drawCardButton!: HTMLButtonElement;
  private endTurnButton!: HTMLButtonElement;
  private handContainer!: HTMLDivElement;
  private resourceContainer!: HTMLDivElement;
  private boardContainer!: HTMLDivElement;
  private selectedCardId: string | null = null;
  private matchID?: string;

  constructor(rootElement: HTMLElement) {
    const { playerId, matchID } = getUrlParams();
    this.matchID = matchID;
    
    this.client = Client({
      game: DuneUprising,
      multiplayer: SocketIO({server: 'http://localhost:8000'}),
      playerID: playerId,
      matchID,
    });
    this.rootElement = rootElement;
    
    // Create lobby container if no match ID
    if (!matchID) {
      this.createLobbyInterface();
      return;
    }
    
    // Create game interface
    this.createGameInterface();
    
    // Subscribe to state changes to update button state
    this.client.subscribe((state: any) => {
      if (state === null) return;
      this.updateUI(state);
    });
    
    this.client.start();
  }

  private createLobbyInterface() {
    this.rootElement.innerHTML = `
      <div class="lobby">
        <h2>Dune Uprising Lobby</h2>
        <button id="createMatch">Create New Match</button>
        <div id="matchesList">
          <h3>Available Matches</h3>
          <div class="matches"></div>
        </div>
      </div>
    `;

    // Add create match button handler
    const createButton = this.rootElement.querySelector('#createMatch');
    if (createButton) {
      createButton.addEventListener('click', () => {
        createMatch();
      });
    }

    // List and update available matches
    this.updateMatchesList();
  }

  private async updateMatchesList() {
    const matches = await listMatches();
    const matchesDiv = this.rootElement.querySelector('.matches');
    if (matchesDiv) {
      matchesDiv.innerHTML = matches.map(match => `
        <div class="match">
          <span>Match ID: ${match.matchID}</span>
          <span>Players: ${match.players.length}/${match.setupData.numPlayers}</span>
          ${match.players.length < match.setupData.numPlayers ? `
            <button class="join-match" data-match-id="${match.matchID}" data-player-id="${match.players.length}">
              Join as Player ${match.players.length}
            </button>
          ` : ''}
        </div>
      `).join('');

      // Add click handlers for join buttons
      matchesDiv.querySelectorAll('.join-match').forEach(button => {
        button.addEventListener('click', (e) => {
          const target = e.target as HTMLElement;
          const matchID = target.getAttribute('data-match-id');
          const playerID = target.getAttribute('data-player-id');
          if (matchID && playerID) {
            joinMatch(matchID, playerID);
          }
        });
      });
    }
  }

  private createGameInterface() {
    // Create board container
    this.boardContainer = document.createElement('div');
    this.boardContainer.className = 'board-container';
    this.rootElement.appendChild(this.boardContainer);
    
    // Create resource container
    this.resourceContainer = document.createElement('div');
    this.resourceContainer.className = 'resource-container';
    this.rootElement.appendChild(this.resourceContainer);
    
    // Create hand container
    this.handContainer = document.createElement('div');
    this.handContainer.className = 'hand-container';
    this.rootElement.appendChild(this.handContainer);
    
    // Create the buttons
    this.drawCardButton = document.createElement('button');
    this.drawCardButton.textContent = 'Draw Card';
    this.drawCardButton.addEventListener('click', () => {
      this.client.moves.drawCard();
    });
    this.rootElement.appendChild(this.drawCardButton);

    this.endTurnButton = document.createElement('button');
    this.endTurnButton.textContent = 'End Turn';
    this.endTurnButton.addEventListener('click', () => {
      this.client.moves.endTurn();
    });
    this.rootElement.appendChild(this.endTurnButton);
  }

  updateUI(state: any) {
    // Update button state based on game state
    this.drawCardButton.disabled = state.ctx.currentPlayer !== this.client.playerID;
    this.endTurnButton.disabled = state.ctx.currentPlayer !== this.client.playerID;

    // Update board display
    this.boardContainer.innerHTML = '<h3>Board</h3>';
    const boardDiv = document.createElement('div');
    boardDiv.className = 'board';
    
    Object.entries(state.G.board).forEach(([locationId, locationState]: [string, any]) => {
      const locationDiv = document.createElement('div');
      locationDiv.className = 'location';
      locationDiv.innerHTML = `
        <div class="location-header">
          <h4>${locationId}</h4>
          <span class="agent-icon">${locationState.agentIcon}</span>
        </div>
        <div class="location-details">
          ${locationState.options ? `
            <div class="location-options">
              ${locationState.options.map((option: any, index: number) => `
                <div class="location-option">
                  ${option.cost ? `
                    <div class="option-cost">
                      Cost: ${Object.entries(option.cost as Record<string, number>)
                        .map(([resource, amount]) => amount > 0 ? `${amount} ${resource}` : '')
                        .filter(Boolean)
                        .join(', ')}
                    </div>
                  ` : ''}
                  <div class="option-rewards">
                    ${option.rewards.map((reward: any) => {
                      if (reward.type === 'gain') {
                        return `Gain ${reward.amount} ${reward.resource}`;
                      } else if (reward.type === 'chooseOne') {
                        return `Choose one: ${reward.options.map((opt: any) => 
                          opt.type === 'gain' ? `Gain ${opt.amount} ${opt.resource}` :
                          opt.type === 'if' ? `If ${opt.condition.check}: ${opt.then.map((t: any) => 
                            t.type === 'gain' ? `Gain ${t.amount} ${t.resource}` : ''
                          ).join(', ')}` : ''
                        ).join(' or ')}`;
                      } else if (reward.type === 'if') {
                        return `If ${reward.condition.check}: ${reward.then.map((t: any) => 
                          t.type === 'gain' ? `Gain ${t.amount} ${t.resource}` : ''
                        ).join(', ')}`;
                      }
                      return '';
                    }).join(', ')}
                  </div>
                </div>
              `).join('')}
            </div>
          ` : ''}
          <div class="player-agents">
            ${locationState.playerAgents.length > 0 ? 
              `Agents: ${locationState.playerAgents.join(', ')}` : 
              'No agents'}
          </div>
        </div>
      `;

      // Add click handler if it's the player's turn
      if (state.ctx.currentPlayer === this.client.playerID) {
        locationDiv.classList.add('clickable');
        locationDiv.addEventListener('click', () => {
          // TODO: Show options modal or handle selection
          console.log('Selected location:', locationId);
        });
      }
      
      boardDiv.appendChild(locationDiv);
    });
    
    this.boardContainer.appendChild(boardDiv);

    // Update resource display
    this.resourceContainer.innerHTML = '<h3>Resources</h3>';
    
    // Create a container for all players' resources
    const allResourcesDiv = document.createElement('div');
    allResourcesDiv.className = 'all-resources';
    
    // Display resources for each player
    Object.entries(state.G.players).forEach(([playerId, playerState]: [string, any]) => {
      const playerResourcesDiv = document.createElement('div');
      playerResourcesDiv.className = 'player-resources';
      playerResourcesDiv.innerHTML = `
        <h4>Player ${playerId}</h4>
        <div class="resources">
          <div class="resource">
            <span class="resource-label">Water:</span>
            <span class="resource-value">${playerState.water}</span>
          </div>
          <div class="resource">
            <span class="resource-label">Spice:</span>
            <span class="resource-value">${playerState.spice}</span>
          </div>
          <div class="resource">
            <span class="resource-label">Solari:</span>
            <span class="resource-value">${playerState.solari}</span>
          </div>
          <div class="resource">
            <span class="resource-label">Spies:</span>
            <span class="resource-value">${playerState.spies}</span>
          </div>
          <div class="resource">
            <span class="resource-label">Troops:</span>
            <span class="resource-value">${playerState.garrisonedTroops}/${playerState.troopSupply}</span>
          </div>
        </div>
      `;
      allResourcesDiv.appendChild(playerResourcesDiv);
    });
    
    this.resourceContainer.appendChild(allResourcesDiv);

    // Update hand display
    const playerHand = state.G.players[this.client.playerID]?.hand || [];
    
    // Clear previous hand display
    this.handContainer.innerHTML = '<h3>Your Hand</h3>';
    
    // Create card elements
    const cardsDiv = document.createElement('div');
    cardsDiv.className = 'cards';
    
    playerHand.forEach((card: any) => {
      const cardElement = document.createElement('div');
      cardElement.className = `card ${card.id === this.selectedCardId ? 'selected' : ''}`;
      
      // Get accessible locations for this card
      const accessibleLocations = Object.entries(state.G.board)
        .filter(([_, locationState]: [string, any]) => {
          return card.agentIcons.includes(locationState.agentIcon);

        })
        .map(([locationId]) => locationId);

      cardElement.innerHTML = `
        <div class="card-content">
          <h4>${card.name || 'Card'}</h4>
          <p>${card.description || ''}</p>
          <div class="card-actions">
            ${accessibleLocations.map((locationId, index) => `
              <button class="location-button" data-location="${locationId}">
                ${locationId}
              </button>
            `).join('')}
          </div>
        </div>
      `;
      
      // Add click handler if it's the player's turn
      if (state.ctx.currentPlayer === this.client.playerID) {
        cardElement.classList.add('clickable');
        
        // Add click handlers for location buttons
        cardElement.querySelectorAll('.location-button').forEach(button => {
          button.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent card selection when clicking button
            const locationId = button.getAttribute('data-location');
            console.log('Playing card', card.id, 'at location', locationId);
            this.client.moves.placeAgent(card.id, locationId);
          });
        });

        // Card selection handler
        cardElement.addEventListener('click', () => {
          // Deselect if clicking the same card
          if (this.selectedCardId === card.id) {
            this.selectedCardId = null;
            cardElement.classList.remove('selected');
          } else {
            // Deselect previously selected card
            const prevSelected = this.handContainer.querySelector('.card.selected');
            if (prevSelected) {
              prevSelected.classList.remove('selected');
            }
            // Select new card
            this.selectedCardId = card.id;
            cardElement.classList.add('selected');
          }
        });
      }
      
      cardsDiv.appendChild(cardElement);
    });
    
    this.handContainer.appendChild(cardsDiv);
  }

  createBoard() {
    const state = this.client.getState();
    if (!state) return;
    this.updateUI(state);
  }

  update(state: any) {
    if (state === null) return;
    // ...
  }
}

// Initialize the app
const app = new DuneUprisingClient(document.getElementById('app') as HTMLElement);
