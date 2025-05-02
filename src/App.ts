import { Client } from 'boardgame.io/client';
import { DuneUprising } from './game';

class DuneUprisingClient {
  private client: any; // TODO: Replace with proper type when available

  constructor() {
    this.client = Client({
      game: DuneUprising,
    });
    this.client.start();
  }

}

const app = new DuneUprisingClient();
