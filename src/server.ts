import { Server } from 'boardgame.io/server';
import { DuneUprising } from './game';

const server = Server({ games: [DuneUprising] });

const PORT = Number(process.env.PORT) || 8000;

server.run(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
