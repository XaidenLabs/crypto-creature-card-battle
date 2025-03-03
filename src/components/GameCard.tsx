
import React, { useState } from 'react';
import { Card } from '@/contexts/GameContext';
import { cn } from '@/lib/utils';

interface GameCardProps {
  card: Card;
  onClick?: () => void;
  disabled?: boolean;
  isPlayed?: boolean;
}

const GameCard: React.FC<GameCardProps> = ({ 
  card, 
  onClick, 
  disabled = false,
  isPlayed = false
}) => {
  const [flipped, setFlipped] = useState(false);

  const handleClick = () => {
    if (disabled) return;
    
    setFlipped(!flipped);
    if (onClick) onClick();
  };

  const getBackgroundColor = () => {
    switch (card.rarity) {
      case 'common':
        return 'bg-gradient-to-br from-game-gray6 to-game-gray5';
      case 'uncommon':
        return 'bg-gradient-to-br from-game-green to-game-teal';
      case 'rare':
        return 'bg-gradient-to-br from-game-blue to-game-purple';
      case 'legendary':
        return 'bg-gradient-to-br from-game-orange to-game-red';
      default:
        return 'bg-gradient-to-br from-game-gray6 to-game-gray5';
    }
  };

  return (
    <div 
      className={cn(
        "game-card relative w-48 h-64 cursor-pointer",
        { "opacity-50": disabled },
        { "flipped": flipped || isPlayed }
      )}
      onClick={handleClick}
    >
      <div className="card-inner absolute w-full h-full">
        <div className="card-front rounded-xl shadow-lg border border-border flex flex-col items-center justify-center p-4 bg-card">
          <div className="w-16 h-16 rounded-full bg-accent mb-4 animate-pulse-soft flex items-center justify-center">
            <span className="text-2xl font-bold">CC</span>
          </div>
          <h3 className="text-lg font-semibold text-center">Crypto Creature</h3>
          <p className="text-sm text-muted-foreground text-center mt-2">
            Tap to reveal
          </p>
        </div>

        <div className={cn(
          "card-back rounded-xl shadow-lg border border-border flex flex-col justify-between p-4",
          getBackgroundColor()
        )}>
          <div className="flex justify-between items-start">
            <span className="font-bold text-xl">{card.value}</span>
            <span className="text-xs uppercase font-semibold">{card.rarity}</span>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center my-4">
            <div className="w-20 h-20 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
              <img src={card.image} alt={card.name} className="w-16 h-16" />
            </div>
            <h3 className="mt-2 text-lg font-semibold">{card.name}</h3>
          </div>
          
          <p className="text-xs mt-2 text-center">
            {card.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
