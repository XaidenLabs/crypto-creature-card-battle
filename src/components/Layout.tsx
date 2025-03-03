
import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/contexts/WalletContext';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { connected, connect, disconnect } = useWallet();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-game-blue to-game-purple">
                Crypto Creature
              </span>
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link 
                to="/" 
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === '/' ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Home
              </Link>
              <Link 
                to="/play" 
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === '/play' ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Play
              </Link>
              <Link 
                to="/dashboard" 
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === '/dashboard' ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Dashboard
              </Link>
              <Link 
                to="/admin" 
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === '/admin' ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Admin
              </Link>
            </nav>
          </div>
          <div>
            {connected ? (
              <Button 
                variant="outline" 
                className="btn-hover-effect"
                onClick={() => disconnect()}
              >
                Disconnect Wallet
              </Button>
            ) : (
              <Button 
                className="bg-gradient-to-r from-game-blue to-game-purple btn-hover-effect"
                onClick={() => connect()}
              >
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t bg-background/80 backdrop-blur-sm py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Crypto Creature. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link 
              to="/privacy" 
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              Privacy Policy
            </Link>
            <Link 
              to="/terms" 
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
