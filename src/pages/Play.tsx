
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, useGame } from '@/contexts/GameContext';
import { useWallet } from '@/contexts/WalletContext';
import GameCard from '@/components/GameCard';

const Play = () => {
  const navigate = useNavigate();
  const { connected, connect } = useWallet();
  const { 
    gameState, 
    currentPlayer, 
    startGame, 
    playCard, 
    resetGame 
  } = useGame();
  
  const [playersCount, setPlayersCount] = useState(2);
  
  // Handle starting a new game
  const handleStartGame = () => {
    startGame(playersCount);
  };
  
  // Handle playing a card
  const handlePlayCard = (cardId: string) => {
    if (currentPlayer) {
      playCard(currentPlayer.id, cardId);
    }
  };
  
  if (!connected) {
    return (
      <Layout>
        <div className="container py-24 flex flex-col items-center justify-center min-h-[80vh]">
          <div className="text-center max-w-md mx-auto">
            <h1 className="text-4xl font-bold mb-6 animate-fade-in">Connect Wallet to Play</h1>
            <p className="text-lg text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              You need to connect your Solana wallet to play Crypto Creature.
            </p>
            <Button 
              onClick={() => connect()} 
              size="lg" 
              className="animate-scale-in btn-hover-effect bg-gradient-to-r from-game-blue to-game-purple"
              style={{ animationDelay: '0.4s' }}
            >
              Connect Wallet
            </Button>
          </div>
        </div>
      </Layout>
    );
  }
  
  // If game hasn't started, show game setup
  if (!gameState.gameStarted) {
    return (
      <Layout>
        <div className="container py-12">
          <div className="max-w-2xl mx-auto bg-card rounded-xl shadow-lg border border-border p-8 animate-scale-in">
            <h1 className="text-3xl font-bold mb-8 text-center">New Game</h1>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Select Number of Players</h2>
              <div className="flex justify-between items-center gap-4">
                {[1, 2, 3, 4].map((count) => (
                  <Button
                    key={count}
                    variant={playersCount === count ? "default" : "outline"}
                    className={`flex-1 h-16 text-xl ${
                      playersCount === count ? "bg-gradient-to-r from-game-blue to-game-purple" : ""
                    }`}
                    onClick={() => setPlayersCount(count)}
                  >
                    {count}
                  </Button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {playersCount === 1 
                  ? "Play against the computer." 
                  : `Play with ${playersCount - 1} AI opponent${playersCount > 2 ? 's' : ''}.`}
              </p>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Game Rules</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Each player receives 10 cards</li>
                <li>The game consists of 6 rounds</li>
                <li>Each round, players take turns playing one card</li>
                <li>The player with the highest total card value at the end wins</li>
                <li>Winners earn 10 XP, while other players earn 2 XP</li>
              </ul>
            </div>
            
            <div className="flex justify-center">
              <Button 
                onClick={handleStartGame}
                size="lg"
                className="btn-hover-effect bg-gradient-to-r from-game-blue to-game-purple"
              >
                Start Game
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  // If game has ended, show results
  if (gameState.gameEnded) {
    return (
      <Layout>
        <div className="container py-12">
          <div className="max-w-3xl mx-auto bg-card rounded-xl shadow-lg border border-border p-8 animate-scale-in">
            <h1 className="text-3xl font-bold mb-8 text-center">Game Over</h1>
            
            {gameState.winner && (
              <div className="text-center mb-8">
                <h2 className="text-xl font-semibold mb-2">Winner</h2>
                <div className="bg-gradient-to-r from-game-blue to-game-purple text-white rounded-xl p-6 inline-block">
                  <span className="text-2xl font-bold">{gameState.winner.name}</span>
                </div>
                <p className="mt-4 text-muted-foreground">
                  Total Score: {gameState.winner.playedCards.reduce((sum, card) => sum + card.value, 0)}
                </p>
              </div>
            )}
            
            <h2 className="text-xl font-semibold mb-4">Final Scores</h2>
            <div className="space-y-4 mb-8">
              {gameState.players.map((player) => {
                const score = player.playedCards.reduce((sum, card) => sum + card.value, 0);
                return (
                  <div 
                    key={player.id} 
                    className={`flex justify-between items-center p-4 rounded-lg border ${
                      gameState.winner && gameState.winner.id === player.id 
                        ? 'border-game-blue bg-gradient-to-r from-game-blue/10 to-game-purple/10' 
                        : 'border-border'
                    }`}
                  >
                    <span className="font-medium">{player.name}</span>
                    <div className="flex gap-4 items-center">
                      <span className="text-muted-foreground">Score: {score}</span>
                      <span className="bg-accent px-2 py-1 rounded text-xs">
                        +{player.id === gameState.winner?.id ? '10' : '2'} XP
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="flex justify-center gap-4">
              <Button 
                onClick={resetGame}
                variant="outline"
                className="btn-hover-effect"
              >
                New Game
              </Button>
              <Button 
                onClick={() => navigate('/dashboard')}
                className="btn-hover-effect bg-gradient-to-r from-game-blue to-game-purple"
              >
                Go to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  // Active game view
  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Round {gameState.currentRound} of {gameState.maxRounds}</h1>
            <p className="text-muted-foreground">
              {currentPlayer?.id === 'player-1' ? "Your turn" : `${currentPlayer?.name}'s turn`}
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={resetGame}
            className="btn-hover-effect"
          >
            Quit Game
          </Button>
        </div>
        
        {/* Game board - where played cards are shown */}
        <div className="mb-12 bg-accent/30 rounded-xl p-8">
          <h2 className="text-xl font-semibold mb-4">Game Board</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {gameState.players.map((player) => (
              <div key={player.id} className="bg-card rounded-lg shadow p-4 border border-border">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-medium">{player.name}</span>
                  <span className="text-sm text-muted-foreground">
                    Cards: {player.cards.length}
                  </span>
                </div>
                
                <div className="flex flex-wrap justify-center gap-2">
                  {player.playedCards.length > 0 ? (
                    <div className="relative w-32 h-48">
                      <GameCard 
                        card={player.playedCards[player.playedCards.length - 1]}
                        disabled={true}
                        isPlayed={true}
                      />
                      <div className="absolute top-0 right-0 bg-game-blue text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                        {player.playedCards.length}
                      </div>
                    </div>
                  ) : (
                    <div className="w-32 h-48 border border-dashed border-border rounded-xl flex items-center justify-center text-muted-foreground">
                      No cards played
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Player's hand */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Hand</h2>
          <div className="overflow-x-auto py-4">
            <div className="flex gap-4 min-w-max">
              {gameState.players[0]?.cards.map((card: Card) => (
                <GameCard 
                  key={card.id} 
                  card={card}
                  onClick={() => handlePlayCard(card.id)}
                  disabled={currentPlayer?.id !== 'player-1'}
                />
              ))}
              
              {gameState.players[0]?.cards.length === 0 && (
                <div className="w-48 h-64 border border-dashed border-border rounded-xl flex items-center justify-center text-muted-foreground">
                  No cards left
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Play;
