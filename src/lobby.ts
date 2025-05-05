import { LobbyClient } from 'boardgame.io/client';

const lobbyClient = new LobbyClient({
  server: 'http://localhost:8000',
});

export async function createMatch() {
  try {
    const { matchID } = await lobbyClient.createMatch('dune-uprising', {
      numPlayers: 2,
      setupData: {
        // Any additional setup data can go here
      },
    });
    console.log('Match created:', matchID);
    
    // Redirect to the game with the new match ID
    window.location.href = `/?matchID=${matchID}`;
  } catch (error) {
    console.error('Failed to create match:', error);
  }
}

export async function joinMatch(matchID: string, playerID: string) {
  try {
    await lobbyClient.joinMatch('dune-uprising', matchID, {
      playerID,
      playerName: `Player ${playerID}`,
    });
    
    // Redirect to the game with the match ID and player ID
    window.location.href = `/?matchID=${matchID}&playerId=${playerID}`;
  } catch (error) {
    console.error('Failed to join match:', error);
  }
}

export async function listMatches() {
  try {
    const { matches } = await lobbyClient.listMatches('dune-uprising');
    return matches;
  } catch (error) {
    console.error('Failed to list matches:', error);
    return [];
  }
} 