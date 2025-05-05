import { Server, Origins } from 'boardgame.io/server';
import { DuneUprising } from './game';

const server = Server({ 
  games: [DuneUprising], 
  origins: ['http://localhost:1234', 'http://localhost:8000', 'http://127.0.0.1:1234', 'http://127.0.0.1:8000']
});

const PORT = Number(process.env.PORT) || 8000;

server.run(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
