
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { useWallet } from '@/contexts/WalletContext';

const Index = () => {
  const { connect, connected } = useWallet();
  const heroRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const scrollY = window.scrollY;
      const opacity = 1 - Math.min(scrollY / 500, 1);
      const translateY = scrollY * 0.5;
      
      heroRef.current.style.opacity = `${opacity}`;
      heroRef.current.style.transform = `translateY(${translateY}px)`;
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <Layout>
      <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-game-purple/10 via-transparent to-game-blue/10 z-0"></div>
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-game-purple/10 rounded-full filter blur-3xl animate-float z-0"></div>
        <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-game-blue/10 rounded-full filter blur-3xl animate-float z-0" style={{ animationDelay: '1s' }}></div>
        
        {/* Hero content */}
        <div className="container relative pt-20 z-10">
          <div ref={heroRef} className="max-w-3xl mx-auto text-center space-y-6 transition-all duration-300">
            <div className="inline-block rounded-full bg-accent px-4 py-1.5 text-sm font-medium mb-6 animate-fade-in">
              The Ultimate Crypto Card Game
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight animate-slide-down" style={{ animationDelay: '0.3s' }}>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-game-blue via-game-purple to-game-pink">
                Crypto Creature
              </span>
            </h1>
            
            <p className="mt-6 text-xl text-muted-foreground max-w-prose mx-auto animate-slide-up" style={{ animationDelay: '0.5s' }}>
              Collect, battle, and earn with digital creature cards on the blockchain. 
              Experience the future of gaming with our seamless integration of crypto technology.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 animate-fade-in" style={{ animationDelay: '0.7s' }}>
              {connected ? (
                <Button asChild size="lg" className="btn-hover-effect bg-gradient-to-r from-game-blue to-game-purple">
                  <Link to="/play">Start Playing</Link>
                </Button>
              ) : (
                <Button onClick={() => connect()} size="lg" className="btn-hover-effect bg-gradient-to-r from-game-blue to-game-purple">
                  Connect Wallet to Play
                </Button>
              )}
              <Button asChild variant="outline" size="lg" className="btn-hover-effect">
                <Link to="/dashboard">View Dashboard</Link>
              </Button>
            </div>
          </div>
          
          {/* Cards animation */}
          <div className="mt-24 relative h-96 overflow-hidden animate-fade-in" style={{ animationDelay: '1s' }}>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-96 bg-gradient-to-br from-game-blue to-game-purple rounded-xl shadow-xl transform rotate-6 animate-float" style={{ animationDelay: '0.5s' }}>
              <div className="absolute inset-0.5 bg-white rounded-xl flex flex-col p-4">
                <div className="flex justify-between">
                  <span className="font-bold text-xl">8</span>
                  <span className="text-xs uppercase font-semibold">Rare</span>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-accent"></div>
                  <h3 className="mt-2 text-lg font-semibold">Dragon</h3>
                </div>
                <p className="text-xs mt-2 text-center">A powerful creature with amazing abilities.</p>
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-96 bg-gradient-to-br from-game-green to-game-teal rounded-xl shadow-xl transform -rotate-6 translate-x-16 animate-float" style={{ animationDelay: '0.8s' }}>
              <div className="absolute inset-0.5 bg-white rounded-xl flex flex-col p-4">
                <div className="flex justify-between">
                  <span className="font-bold text-xl">5</span>
                  <span className="text-xs uppercase font-semibold">Uncommon</span>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-accent"></div>
                  <h3 className="mt-2 text-lg font-semibold">Phoenix</h3>
                </div>
                <p className="text-xs mt-2 text-center">A fiery creature with resurrection abilities.</p>
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-96 bg-gradient-to-br from-game-orange to-game-red rounded-xl shadow-xl transform rotate-12 -translate-x-16 animate-float" style={{ animationDelay: '1.1s' }}>
              <div className="absolute inset-0.5 bg-white rounded-xl flex flex-col p-4">
                <div className="flex justify-between">
                  <span className="font-bold text-xl">10</span>
                  <span className="text-xs uppercase font-semibold">Legendary</span>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-accent"></div>
                  <h3 className="mt-2 text-lg font-semibold">Kraken</h3>
                </div>
                <p className="text-xs mt-2 text-center">An ancient sea monster with devastating power.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </section>
      
      <section className="py-24 bg-white relative z-10">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">How To Play</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card rounded-xl p-6 shadow-sm border border-border flex flex-col items-center text-center animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-4">
                <span className="font-bold text-2xl">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
              <p className="text-muted-foreground">Link your Solana wallet to start collecting and trading cards.</p>
            </div>
            <div className="bg-card rounded-xl p-6 shadow-sm border border-border flex flex-col items-center text-center animate-scale-in" style={{ animationDelay: '0.4s' }}>
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-4">
                <span className="font-bold text-2xl">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Build Your Deck</h3>
              <p className="text-muted-foreground">Choose your creatures wisely to create a powerful deck of cards.</p>
            </div>
            <div className="bg-card rounded-xl p-6 shadow-sm border border-border flex flex-col items-center text-center animate-scale-in" style={{ animationDelay: '0.6s' }}>
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-4">
                <span className="font-bold text-2xl">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Battle & Earn</h3>
              <p className="text-muted-foreground">Challenge other players to battles and earn XP and rewards.</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-game-purple/5 via-transparent to-game-blue/5 z-0"></div>
        <div className="container relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 animate-slide-up">
              <h2 className="text-3xl font-bold mb-6">Powered by Blockchain</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Crypto Creature is built on Solana, providing fast transactions and secure ownership of your digital assets.
                All your cards and achievements are stored on the blockchain, ensuring true ownership.
              </p>
              <Button asChild variant="outline" className="btn-hover-effect">
                <Link to="/learn">Learn More</Link>
              </Button>
            </div>
            <div className="flex-1 glass rounded-xl p-6 animate-slide-down">
              <div className="aspect-video rounded-lg bg-accent/50 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-game-purple/30 to-game-blue/30 flex items-center justify-center">
                  <span className="text-2xl font-bold text-foreground/80">Gameplay Preview</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-24 bg-gradient-to-r from-game-blue/10 to-game-purple/10">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Play?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of players already enjoying Crypto Creature. Connect your wallet and start your journey today.
          </p>
          {connected ? (
            <Button asChild size="lg" className="btn-hover-effect bg-gradient-to-r from-game-blue to-game-purple">
              <Link to="/play">Start Playing Now</Link>
            </Button>
          ) : (
            <Button onClick={() => connect()} size="lg" className="btn-hover-effect bg-gradient-to-r from-game-blue to-game-purple">
              Connect Wallet to Play
            </Button>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Index;
