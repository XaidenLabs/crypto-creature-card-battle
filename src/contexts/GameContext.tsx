
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Card type definition
export interface Card {
  id: string;
  value: number;
  name: string;
  image: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
}

// Player type definition
export interface Player {
  id: string;
  name: string;
  avatar: string;
  xp: number;
  cards: Card[];
  playedCards: Card[];
  wins: number;
  totalGames: number;
}

// Game state type definition
export interface GameState {
  players: Player[];
  currentRound: number;
  maxRounds: number;
  gameStarted: boolean;
  gameEnded: boolean;
  winner: Player | null;
  currentTurn: number;
}

// Game context type definition
interface GameContextType {
  gameState: GameState;
  currentPlayer: Player | null;
  players: Player[];
  availableCards: Card[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  startGame: (numberOfPlayers: number) => void;
  playCard: (playerId: string, cardId: string) => void;
  endRound: () => void;
  resetGame: () => void;
  addXP: (playerId: string, amount: number) => void;
}

const GameContext = createContext<GameContextType>({
  gameState: {
    players: [],
    currentRound: 0,
    maxRounds: 6,
    gameStarted: false,
    gameEnded: false,
    winner: null,
    currentTurn: 0,
  },
  currentPlayer: null,
  players: [],
  availableCards: [],
  setPlayers: () => {},
  startGame: () => {},
  playCard: () => {},
  endRound: () => {},
  resetGame: () => {},
  addXP: () => {},
});

export const useGame = () => useContext(GameContext);

// Generate a deck of cards
const generateCards = (): Card[] => {
  const cards: Card[] = [];
  const rarities: Array<'common' | 'uncommon' | 'rare' | 'legendary'> = ['common', 'common', 'common', 'uncommon', 'uncommon', 'rare', 'legendary'];
  const creatures = [
    'Dragon', 'Phoenix', 'Griffin', 'Unicorn', 'Basilisk', 'Chimera', 'Kraken', 
    'Pegasus', 'Minotaur', 'Hydra', 'Cerberus', 'Sphinx', 'Cyclops', 'Leviathan',
    'Mermaid', 'Centaur', 'Werewolf', 'Vampire', 'Goblin', 'Troll', 'Ogre', 'Elf',
    'Dwarf', 'Fairy', 'Gnome', 'Orc', 'Titan', 'Golem', 'Banshee', 'Ghost'
  ];

  for (let i = 0; i < 30; i++) {
    const rarity = rarities[Math.floor(Math.random() * rarities.length)];
    let value: number;
    
    // Assign value based on rarity
    switch (rarity) {
      case 'common':
        value = Math.floor(Math.random() * 3) + 1; // 1-3
        break;
      case 'uncommon':
        value = Math.floor(Math.random() * 3) + 4; // 4-6
        break;
      case 'rare':
        value = Math.floor(Math.random() * 3) + 7; // 7-9
        break;
      case 'legendary':
        value = 10; // Always 10
        break;
    }

    const creatureName = creatures[Math.floor(Math.random() * creatures.length)];
    
    cards.push({
      id: `card-${i}`,
      value,
      name: `${creatureName} ${i + 1}`,
      image: `/placeholder.svg`, // Placeholder image
      description: `A powerful ${rarity} creature with ${value} power.`,
      rarity,
    });
  }

  return cards;
};

// Provider component
interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [availableCards, setAvailableCards] = useState<Card[]>(generateCards());
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    currentRound: 0,
    maxRounds: 6,
    gameStarted: false,
    gameEnded: false,
    winner: null,
    currentTurn: 0,
  });

  // Get the current player based on the turn
  const currentPlayer = gameState.players[gameState.currentTurn] || null;

  // Load players from local storage when component mounts
  useEffect(() => {
    const savedPlayers = localStorage.getItem('cryptoCreaturePlayers');
    if (savedPlayers) {
      setPlayers(JSON.parse(savedPlayers));
    }
  }, []);

  // Save players to local storage whenever they change
  useEffect(() => {
    if (players.length > 0) {
      localStorage.setItem('cryptoCreaturePlayers', JSON.stringify(players));
    }
  }, [players]);

  // Initialize game with a specified number of players
  const startGame = (numberOfPlayers: number) => {
    if (numberOfPlayers < 1 || numberOfPlayers > 4) {
      console.error('Number of players must be between 1 and 4');
      return;
    }

    // Shuffle the available cards
    const shuffledCards = [...availableCards].sort(() => Math.random() - 0.5);
    
    // Create AI players if needed
    const gamePlayers: Player[] = [];
    
    // Check if we have a saved human player
    const savedHumanPlayer = players.find(p => p.id === 'player-1');
    
    // Add the human player (either existing or new one)
    gamePlayers.push({
      id: 'player-1',
      name: 'You',
      avatar: '/placeholder.svg',
      xp: savedHumanPlayer ? savedHumanPlayer.xp : 0,
      cards: shuffledCards.splice(0, 10), // Give 10 cards to the player
      playedCards: [],
      wins: savedHumanPlayer ? savedHumanPlayer.wins : 0,
      totalGames: savedHumanPlayer ? savedHumanPlayer.totalGames : 0,
    });
    
    // Add AI players
    for (let i = 1; i < numberOfPlayers; i++) {
      const savedAIPlayer = players.find(p => p.id === `player-${i + 1}`);
      
      gamePlayers.push({
        id: `player-${i + 1}`,
        name: `AI Player ${i}`,
        avatar: '/placeholder.svg',
        xp: savedAIPlayer ? savedAIPlayer.xp : 0,
        cards: shuffledCards.splice(0, 10), // Give 10 cards to each AI player
        playedCards: [],
        wins: savedAIPlayer ? savedAIPlayer.wins : 0,
        totalGames: savedAIPlayer ? savedAIPlayer.totalGames : 0,
      });
    }
    
    setGameState({
      players: gamePlayers,
      currentRound: 1,
      maxRounds: 6,
      gameStarted: true,
      gameEnded: false,
      winner: null,
      currentTurn: 0,
    });
  };

  // Play a card from a player's hand
  const playCard = (playerId: string, cardId: string) => {
    if (!gameState.gameStarted || gameState.gameEnded) return;
    
    setGameState(prevState => {
      // Find the player
      const playerIndex = prevState.players.findIndex(p => p.id === playerId);
      if (playerIndex === -1 || playerIndex !== prevState.currentTurn) return prevState;
      
      const player = prevState.players[playerIndex];
      
      // Find the card
      const cardIndex = player.cards.findIndex(c => c.id === cardId);
      if (cardIndex === -1) return prevState;
      
      // Create a deep copy of the players array
      const updatedPlayers = [...prevState.players];
      
      // Move the card from player's hand to played cards
      const card = { ...player.cards[cardIndex] };
      updatedPlayers[playerIndex] = {
        ...player,
        cards: player.cards.filter(c => c.id !== cardId),
        playedCards: [...player.playedCards, card],
      };
      
      // Check if we're at the last player in this round
      const isLastPlayerInRound = playerIndex === updatedPlayers.length - 1;
      let nextTurn = (playerIndex + 1) % updatedPlayers.length;
      let currentRound = prevState.currentRound;
      
      // If this is the last player in the round, increment the round counter
      if (isLastPlayerInRound) {
        currentRound += 1;
      }
      
      // Check if the game has ended
      let gameEnded = currentRound > prevState.maxRounds;
      let winner = null;
      
      if (gameEnded) {
        // Determine the winner based on the sum of played card values
        let highestScore = -1;
        
        for (const player of updatedPlayers) {
          const score = player.playedCards.reduce((sum, card) => sum + card.value, 0);
          if (score > highestScore) {
            highestScore = score;
            winner = { ...player };
          }
        }
        
        // Save updated player stats including XP in both gameState and global players state
        for (let i = 0; i < updatedPlayers.length; i++) {
          const isWinner = winner && winner.id === updatedPlayers[i].id;
          const xpGain = isWinner ? 10 : 2;
          
          updatedPlayers[i] = {
            ...updatedPlayers[i],
            totalGames: updatedPlayers[i].totalGames + 1,
            wins: isWinner ? updatedPlayers[i].wins + 1 : updatedPlayers[i].wins,
            xp: updatedPlayers[i].xp + xpGain,
          };
        }
        
        // Update the global players state with the new stats
        setPlayers(prevPlayers => {
          const newPlayers = [...prevPlayers];
          
          for (const updatedPlayer of updatedPlayers) {
            const existingPlayerIndex = newPlayers.findIndex(p => p.id === updatedPlayer.id);
            if (existingPlayerIndex !== -1) {
              // Update existing player
              newPlayers[existingPlayerIndex] = {
                ...newPlayers[existingPlayerIndex],
                xp: updatedPlayer.xp,
                wins: updatedPlayer.wins,
                totalGames: updatedPlayer.totalGames,
              };
            } else {
              // Add new player to the list
              newPlayers.push({
                id: updatedPlayer.id,
                name: updatedPlayer.name,
                avatar: updatedPlayer.avatar,
                xp: updatedPlayer.xp,
                cards: [],
                playedCards: [],
                wins: updatedPlayer.wins,
                totalGames: updatedPlayer.totalGames,
              });
            }
          }
          
          return newPlayers;
        });
        
        return {
          ...prevState,
          players: updatedPlayers,
          currentRound,
          gameEnded,
          winner,
          currentTurn: 0, // Reset turn to first player for next game
        };
      }
      
      // If the next player is an AI, we need to make them play automatically after a short delay
      if (nextTurn !== 0) { // Player 0 is the human
        // We'll return the state with the next turn set
        return {
          ...prevState,
          players: updatedPlayers,
          currentRound,
          currentTurn: nextTurn,
        };
      }
      
      // If we're going back to the human player (first player), just update state normally
      return {
        ...prevState,
        players: updatedPlayers,
        currentRound,
        currentTurn: nextTurn,
      };
    });
    
    // Handle AI turns after the state update
    setTimeout(() => {
      handleAITurns();
    }, 500); // Short delay for visual effect
  };
  
  // Handle AI player turns
  const handleAITurns = () => {
    setGameState(prevState => {
      if (prevState.gameEnded || prevState.currentTurn === 0) {
        // If game ended or it's the human player's turn, do nothing
        return prevState;
      }
      
      const aiPlayer = prevState.players[prevState.currentTurn];
      
      // If AI has no cards, skip their turn
      if (aiPlayer.cards.length === 0) {
        let nextTurn = (prevState.currentTurn + 1) % prevState.players.length;
        return {
          ...prevState,
          currentTurn: nextTurn,
        };
      }
      
      // AI plays their first card
      const aiCard = aiPlayer.cards[0];
      const updatedPlayers = [...prevState.players];
      
      // Update the AI player's cards
      updatedPlayers[prevState.currentTurn] = {
        ...aiPlayer,
        cards: aiPlayer.cards.filter(c => c.id !== aiCard.id),
        playedCards: [...aiPlayer.playedCards, aiCard],
      };
      
      // Check if we're at the last player in this round
      const isLastPlayerInRound = prevState.currentTurn === updatedPlayers.length - 1;
      let nextTurn = (prevState.currentTurn + 1) % updatedPlayers.length;
      let currentRound = prevState.currentRound;
      
      // If this is the last player in the round, increment the round counter
      if (isLastPlayerInRound) {
        currentRound += 1;
      }
      
      // Check if the game has ended
      let gameEnded = currentRound > prevState.maxRounds;
      let winner = null;
      
      if (gameEnded) {
        // Determine the winner based on the sum of played card values
        let highestScore = -1;
        
        for (const player of updatedPlayers) {
          const score = player.playedCards.reduce((sum, card) => sum + card.value, 0);
          if (score > highestScore) {
            highestScore = score;
            winner = { ...player };
          }
        }
        
        // Save updated player stats including XP in both gameState and global players state
        for (let i = 0; i < updatedPlayers.length; i++) {
          const isWinner = winner && winner.id === updatedPlayers[i].id;
          const xpGain = isWinner ? 10 : 2;
          
          updatedPlayers[i] = {
            ...updatedPlayers[i],
            totalGames: updatedPlayers[i].totalGames + 1,
            wins: isWinner ? updatedPlayers[i].wins + 1 : updatedPlayers[i].wins,
            xp: updatedPlayers[i].xp + xpGain,
          };
        }
        
        // Update the global players state with the new stats
        setPlayers(prevPlayers => {
          const newPlayers = [...prevPlayers];
          
          for (const updatedPlayer of updatedPlayers) {
            const existingPlayerIndex = newPlayers.findIndex(p => p.id === updatedPlayer.id);
            if (existingPlayerIndex !== -1) {
              // Update existing player
              newPlayers[existingPlayerIndex] = {
                ...newPlayers[existingPlayerIndex],
                xp: updatedPlayer.xp,
                wins: updatedPlayer.wins,
                totalGames: updatedPlayer.totalGames,
              };
            } else {
              // Add new player to the list
              newPlayers.push({
                id: updatedPlayer.id,
                name: updatedPlayer.name,
                avatar: updatedPlayer.avatar,
                xp: updatedPlayer.xp,
                cards: [],
                playedCards: [],
                wins: updatedPlayer.wins,
                totalGames: updatedPlayer.totalGames,
              });
            }
          }
          
          return newPlayers;
        });
        
        return {
          ...prevState,
          players: updatedPlayers,
          currentRound,
          gameEnded,
          winner,
          currentTurn: 0, // Reset turn to first player for next game
        };
      }
      
      // Return the updated state
      return {
        ...prevState,
        players: updatedPlayers,
        currentRound,
        currentTurn: nextTurn,
      };
    });
    
    // If the next player is also an AI, handle their turn after a delay
    setTimeout(() => {
      setGameState(prevState => {
        if (prevState.gameEnded || prevState.currentTurn === 0) {
          // If game ended or it's the human player's turn, stop the recursion
          return prevState;
        }
        // Continue with the next AI player
        handleAITurns();
        return prevState;
      });
    }, 1000); // Delay between AI turns
  };

  // End the current round
  const endRound = () => {
    if (!gameState.gameStarted || gameState.gameEnded) return;
    
    setGameState(prevState => {
      return {
        ...prevState,
        currentRound: prevState.currentRound + 1,
        currentTurn: 0,
      };
    });
  };

  // Reset the game
  const resetGame = () => {
    setGameState({
      players: [],
      currentRound: 0,
      maxRounds: 6,
      gameStarted: false,
      gameEnded: false,
      winner: null,
      currentTurn: 0,
    });
    
    // Regenerate cards
    setAvailableCards(generateCards());
  };

  // Add XP to a player (admin function)
  const addXP = (playerId: string, amount: number) => {
    setPlayers(prevPlayers => {
      const updatedPlayers = prevPlayers.map(player => {
        if (player.id === playerId) {
          return {
            ...player,
            xp: player.xp + amount,
          };
        }
        return player;
      });
      
      // Save to local storage
      localStorage.setItem('cryptoCreaturePlayers', JSON.stringify(updatedPlayers));
      
      return updatedPlayers;
    });
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        currentPlayer,
        players,
        availableCards,
        setPlayers,
        startGame,
        playCard,
        endRound,
        resetGame,
        addXP,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
