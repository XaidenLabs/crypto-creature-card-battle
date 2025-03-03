
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useWallet } from '@/contexts/WalletContext';
import { useGame, Player } from '@/contexts/GameContext';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const { connected, connect } = useWallet();
  const { players, setPlayers, addXP } = useGame();
  const { toast } = useToast();
  
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>('');
  const [xpAmount, setXpAmount] = useState<number>(1);
  
  if (!connected) {
    return (
      <Layout>
        <div className="container py-24 flex flex-col items-center justify-center min-h-[80vh]">
          <div className="text-center max-w-md mx-auto">
            <h1 className="text-4xl font-bold mb-6 animate-fade-in">Connect Wallet to Access Admin</h1>
            <p className="text-lg text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              You need to connect your Solana wallet to access the admin dashboard.
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
  
  const handleAddXP = () => {
    if (!selectedPlayerId) {
      toast({
        title: "Error",
        description: "Please select a player",
        variant: "destructive",
      });
      return;
    }
    
    if (xpAmount <= 0) {
      toast({
        title: "Error",
        description: "XP amount must be positive",
        variant: "destructive",
      });
      return;
    }
    
    addXP(selectedPlayerId, xpAmount);
    
    toast({
      title: "Success",
      description: `Added ${xpAmount} XP to player`,
      variant: "default",
    });
  };
  
  // Initialize players if there are none
  if (players.length === 0) {
    const defaultPlayers: Player[] = [
      {
        id: 'player-1',
        name: 'You',
        avatar: '/placeholder.svg',
        xp: 0,
        cards: [],
        playedCards: [],
        wins: 0,
        totalGames: 0,
      },
      {
        id: 'player-2',
        name: 'AI Player 1',
        avatar: '/placeholder.svg',
        xp: 0,
        cards: [],
        playedCards: [],
        wins: 0,
        totalGames: 0,
      },
    ];
    
    setPlayers(defaultPlayers);
  }
  
  return (
    <Layout>
      <div className="container py-12">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-xl font-semibold mb-4">Total Players</h2>
            <div className="text-4xl font-bold">{players.length}</div>
          </Card>
          
          <Card className="p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-xl font-semibold mb-4">Total Games</h2>
            <div className="text-4xl font-bold">
              {players.reduce((sum, player) => sum + player.totalGames, 0)}
            </div>
          </Card>
          
          <Card className="p-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <h2 className="text-xl font-semibold mb-4">Total XP</h2>
            <div className="text-4xl font-bold">
              {players.reduce((sum, player) => sum + player.xp, 0)}
            </div>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-6">Player Management</h2>
            <Card className="p-6">
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Select Player</label>
                  <select 
                    className="w-full px-3 py-2 border rounded-md bg-background"
                    value={selectedPlayerId}
                    onChange={(e) => setSelectedPlayerId(e.target.value)}
                  >
                    <option value="">Select a player</option>
                    {players.map((player) => (
                      <option key={player.id} value={player.id}>
                        {player.name} (ID: {player.id})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">XP Amount</label>
                  <Input 
                    type="number" 
                    value={xpAmount}
                    onChange={(e) => setXpAmount(parseInt(e.target.value))}
                    min={1}
                  />
                </div>
              </div>
              
              <Button 
                onClick={handleAddXP}
                className="w-full btn-hover-effect bg-gradient-to-r from-game-blue to-game-purple"
              >
                Add XP
              </Button>
            </Card>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-6">Player List</h2>
            <Card>
              <div className="p-4 border-b">
                <div className="grid grid-cols-4 font-medium">
                  <div>ID</div>
                  <div>Name</div>
                  <div>XP</div>
                  <div>Games</div>
                </div>
              </div>
              <div className="divide-y">
                {players.map((player) => (
                  <div key={player.id} className="p-4 grid grid-cols-4 items-center">
                    <div className="truncate">{player.id}</div>
                    <div>{player.name}</div>
                    <div>{player.xp}</div>
                    <div>{player.totalGames}</div>
                  </div>
                ))}
                
                {players.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground">
                    No players found.
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Admin;
