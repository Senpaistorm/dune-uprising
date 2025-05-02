import { LobbyClient } from 'boardgame.io/client';

const lobbyClient = new LobbyClient({ server: 'http://localhost:8000' });

lobbyClient.listGames()
  .then(console.log) // => ['chess', 'tic-tac-toe']
  .catch(console.error);