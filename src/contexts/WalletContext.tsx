
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PublicKey } from '@solana/web3.js';

type WalletContextType = {
  connected: boolean;
  publicKey: PublicKey | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
};

const WalletContext = createContext<WalletContextType>({
  connected: false,
  publicKey: null,
  connect: async () => {},
  disconnect: async () => {},
});

export const useWallet = () => useContext(WalletContext);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);

  // Mock wallet connection
  const connect = async () => {
    try {
      // In a real implementation, this would use the Solana wallet adapter
      const mockPublicKey = new PublicKey('11111111111111111111111111111111');
      setPublicKey(mockPublicKey);
      setConnected(true);
      localStorage.setItem('walletConnected', 'true');
      console.log('Wallet connected:', mockPublicKey.toString());
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const disconnect = async () => {
    setPublicKey(null);
    setConnected(false);
    localStorage.removeItem('walletConnected');
    console.log('Wallet disconnected');
  };

  // Check for existing connection on initial render
  useEffect(() => {
    const checkConnection = async () => {
      const isConnected = localStorage.getItem('walletConnected') === 'true';
      if (isConnected) {
        await connect();
      }
    };
    
    checkConnection();
  }, []);

  return (
    <WalletContext.Provider value={{ connected, publicKey, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
};
