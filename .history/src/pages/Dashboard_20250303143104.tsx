import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useWallet } from '@/contexts/WalletContext';
import { useGame, Player } from '@/contexts/GameContext';
import GameCard from '@/components/GameCard';

const Dashboard = () => {
  const { connected, connect } = useWallet();
  const { players } = useGame();
  const [showCollection, setShowCollection] = useState(false);
  
  // Get the first player as the current user
  const player = players.find(p => p.id === 'player-1') || {
    id: 'player-1',
    name: 'You',
    avatar: '/placeholder.svg',
    xp: 0,
    cards: [],
    playedCards: [],
    wins: 0,
    totalGames: 0,
  };
  
  if (!connected) {
    return (
      <Layout>
        <div className="container py-24 flex flex-col items-center justify-center min-h-[80vh]">
          <div className="text-center max-w-md mx-auto">
            <h1 className="text-4xl font-bold mb-6 animate-fade-in">Connect Wallet to View Dashboard</h1>
            <p className="text-lg text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              You need to connect your Solana wallet to access your dashboard.
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
  
  // Calculate user stats
  const winRate = player.totalGames > 0 
    ? Math.round((player.wins / player.totalGames) * 100) 
    : 0;
  
  // Mock collection of NFT cards for the player
  const mockCollection = player.cards.length > 0 ? player.cards : [
    {
      id: 'card-1',
      name: 'Crypto Dragon',
      description: 'A legendary creature that breathes digital fire',
      image: '/placeholder.svg',
      value: 8,
      rarity: 'rare'
    },
    {
      id: 'card-2',
      name: 'Blockchain Fox',
      description: 'Quick and nimble, it navigates the chain with ease',
      image: '/placeholder.svg',
      value: 5,
      rarity: 'uncommon'
    },
    {
      id: 'card-3',
      name: 'Token Turtle',
      description: 'Slow but steady, it stores value securely in its shell',
      image: '/placeholder.svg',
      value: 3,
      rarity: 'common'
    },
    {
      id: 'card-4',
      name: 'NFT Unicorn',
      description: 'A rare and magical being, it creates value wherever it goes',
      image: '/placeholder.svg',
      value: 10,
      rarity: 'legendary'
    }
  ];
  
  return (
    <Layout>
      <div className="container py-12">
        <h1 className="text-3xl font-bold mb-8">Your Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">XP</h2>
              <div className="bg-game-blue/10 text-game-blue px-3 py-1 rounded-full text-sm">
                Level {Math.floor(player.xp / 10) + 1}
              </div>
            </div>
            <div className="text-4xl font-bold">{player.xp}</div>
            <div className="mt-2 text-sm text-muted-foreground">
              Next level: {(Math.floor(player.xp / 10) + 1) * 10} XP
            </div>
            <div className="mt-4 bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-game-blue to-game-purple h-full"
                style={{ width: `${(player.xp % 10) * 10}%` }}
              ></div>
            </div>
          </Card>
          
          <Card className="p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-xl font-semibold mb-4">Games</h2>
            <div className="text-4xl font-bold">{player.totalGames}</div>
            <div className="mt-2 text-sm text-muted-foreground">
              Victories: {player.wins}
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div className="bg-gray-200 rounded-full h-2 flex-1 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-game-green to-game-teal h-full"
                  style={{ width: `${winRate}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium">{winRate}%</span>
            </div>
            <div className="mt-1 text-xs text-muted-foreground">Win rate</div>
          </Card>
          
          <Card className="p-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <h2 className="text-xl font-semibold mb-4">Collection</h2>
            <div className="text-4xl font-bold">{mockCollection.length}</div>
            <div className="mt-2 text-sm text-muted-foreground">
              Cards collected
            </div>
            <div className="mt-4">
              <Button 
                onClick={() => setShowCollection(!showCollection)} 
                variant="outline" 
                className="w-full btn-hover-effect"
              >
                {showCollection ? 'Hide Collection' : 'View Collection'}
              </Button>
            </div>
          </Card>
        </div>
        
        {showCollection && (
          <div className="mb-12 animate-fade-in">
            <h2 className="text-2xl font-semibold mb-6">Your NFT Collection</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {mockCollection.map((card) => (
                <div key={card.id} className="flex justify-center">
                  <GameCard card={card} />
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Recent Activity</h2>
          
          {player.totalGames > 0 ? (
            <div className="space-y-4">
              {Array.from({ length: Math.min(player.totalGames, 3) }).map((_, index) => (
                <Card key={index} className="p-4 animate-fade-in" style={{ animationDelay: `${0.1 * index}s` }}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Game #{player.totalGames - index}</h3>
                      <p className="text-sm text-muted-foreground">
                        {index === 0 && player.wins > 0 ? 'Victory' : index === 1 && player.wins > 1 ? 'Victory' : 'Defeat'}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm ${
                      index === 0 && player.wins > 0 ? 'bg-game-green/10 text-game-green' : 
                      index === 1 && player.wins > 1 ? 'bg-game-green/10 text-game-green' : 
                      'bg-game-red/10 text-game-red'
                    }`}>
                      {index === 0 && player.wins > 0 ? '+10 XP' : 
                      index === 1 && player.wins > 1 ? '+10 XP' : 
                      '+2 XP'}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center text-muted-foreground">
              <p className="mb-4">You haven't played any games yet.</p>
              <Button asChild className="btn-hover-effect bg-gradient-to-r from-game-blue to-game-purple">
                <Link to="/play">Play Now</Link>
              </Button>
            </Card>
          )}
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Leaderboard</h2>
            <Button asChild variant="outline" className="btn-hover-effect">
              <Link to="/leaderboard">View Full Leaderboard</Link>
            </Button>
          </div>
          
          <Card>
            <div className="p-4 border-b">
              <div className="grid grid-cols-4 font-medium">
                <div>Rank</div>
                <div>Player</div>
                <div>XP</div>
                <div>Win Rate</div>
              </div>
            </div>
            <div className="divide-y">
              {[...players].sort((a, b) => b.xp - a.xp).map((player, index) => (
                <div key={player.id} className="p-4 grid grid-cols-4 items-center animate-fade-in" style={{ animationDelay: `${0.1 * index}s` }}>
                  <div className="font-medium">{index + 1}</div>
                  <div>{player.name}</div>
                  <div>{player.xp}</div>
                  <div>
                    {player.totalGames > 0 
                      ? `${Math.round((player.wins / player.totalGames) * 100)}%`
                      : '0%'
                    }
                  </div>
                </div>
              ))}
              
              {players.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                  No players found. Be the first to join!
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
