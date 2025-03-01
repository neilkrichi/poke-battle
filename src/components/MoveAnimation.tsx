import React, { useEffect, useState } from 'react';

interface MoveAnimationProps {
  isActive: boolean;
  moveType: string;
  isPlayerMove: boolean;
  onComplete: () => void;
}

export const MoveAnimation: React.FC<MoveAnimationProps> = ({ 
  isActive, 
  moveType, 
  isPlayerMove,
  onComplete 
}) => {
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    if (isActive) {
      setAnimationClass('animate');
      const timer = setTimeout(() => {
        setAnimationClass('');
        onComplete();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  const getTypeColor = () => {
    const colors: Record<string, string> = {
      normal: '#A8A878',
      fire: '#F08030',
      water: '#6890F0',
      electric: '#F8D030',
      grass: '#78C850',
      ice: '#98D8D8',
      fighting: '#C03028',
      poison: '#A040A0',
      ground: '#E0C068',
      flying: '#A890F0',
      psychic: '#F85888',
      bug: '#A8B820',
      rock: '#B8A038',
      ghost: '#705898',
      dragon: '#7038F8',
      dark: '#705848',
      steel: '#B8B8D0',
      fairy: '#EE99AC'
    };
    return colors[moveType] || colors.normal;
  };

  if (!isActive) return null;

  return (
    <div className={`fixed inset-0 pointer-events-none z-50 ${isPlayerMove ? 'player-move' : 'opponent-move'}`}>
      <div 
        className={`move-effect ${animationClass}`}
        data-testid="move-effect"
        style={{ 
          backgroundColor: getTypeColor(),
          opacity: 0.5
        }}
      />
    </div>
  );
}; 