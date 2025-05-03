import { Client } from 'boardgame.io/client';
import { SocketIO } from 'boardgame.io/multiplayer';
import { DuneUprising } from './game';

class DuneUprisingClient {
  private client: any; // TODO: Replace with proper type when available
  private rootElement: HTMLElement;
  private drawCardButton: HTMLButtonElement;
  private endTurnButton: HTMLButtonElement;
  private updatePlayerID1: HTMLButtonElement;
  private handContainer: HTMLDivElement;

  constructor(rootElement: HTMLElement, {playerID}: {playerID?: string} = {}) {
    this.client = Client({
      game: DuneUprising,
      multiplayer: SocketIO({server: 'localhost:8000'}),
      playerID,
    });
    this.rootElement = rootElement;
    
    // Create hand container
    this.handContainer = document.createElement('div');
    this.handContainer.className = 'hand-container';
    this.rootElement.appendChild(this.handContainer);
    
    // Create the button once
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

    this.updatePlayerID1 = document.createElement('button');
    this.updatePlayerID1.textContent = 'Update Player ID 1';
    this.updatePlayerID1.addEventListener('click', () => {
      this.client.updatePlayerID('1');
    });
    this.rootElement.appendChild(this.updatePlayerID1);
    
    // Subscribe to state changes to update button state
    this.client.subscribe((state: any) => {
      if (state === null) return;
      this.updateUI(state);
    });
    
    this.client.start();
  }

  updateUI(state: any) {
    // Update button state based on game state
    this.drawCardButton.disabled = state.ctx.currentPlayer !== this.client.playerID;
    this.endTurnButton.disabled = state.ctx.currentPlayer !== this.client.playerID;

    // Update hand display
    const currentPlayer = this.client.playerID;
    const playerHand = state.G.players[currentPlayer]?.hand || [];
    
    // Clear previous hand display
    this.handContainer.innerHTML = '<h3>Your Hand</h3>';
    
    // Create card elements
    const cardsDiv = document.createElement('div');
    cardsDiv.className = 'cards';
    
    playerHand.forEach((card: any, index: number) => {
      const cardElement = document.createElement('div');
      cardElement.className = 'card';
      cardElement.innerHTML = `
        <div class="card-content">
          <h4>${card.name || 'Card'}</h4>
          <p>${card.description || ''}</p>
        </div>
      `;
      
      // Add play button if it's the player's turn
      if (state.ctx.currentPlayer === currentPlayer) {
        const playButton = document.createElement('button');
        playButton.textContent = 'Play';
        playButton.addEventListener('click', () => {
          console.log('playCard', card.id, 'ImperialBasin');
          this.client.moves.placeAgent(card.id, 'ImperialBasin');
        });
        cardElement.appendChild(playButton);
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

const app = new DuneUprisingClient(document.getElementById('app') as HTMLElement, {playerID: '0'});
