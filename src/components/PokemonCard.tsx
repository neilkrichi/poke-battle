import React from 'react';
import { BattlePokemon, Move } from '../types/pokemon';

interface PokemonCardProps {
  battlePokemon: BattlePokemon;
  isOpponent: boolean;
  onMoveSelect?: (move: Move) => void;
  disabled?: boolean;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({ 
  battlePokemon, 
  isOpponent, 
  onMoveSelect,
  disabled = false 
}) => {
  const { pokemon, moves, currentHp, maxHp } = battlePokemon;
  const hpPercentage = (currentHp / maxHp) * 100;
  const hpColor = hpPercentage > 50 ? 'bg-green-500' : hpPercentage > 20 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="flex items-center p-4 bg-transparent mb-4">
      <div className={`flex ${isOpponent ? 'flex-row' : 'flex-row-reverse'} items-center space-between w-full gap-8`}>
        <div className="flex-1">
          <div className={`relative bg-gray-500/20 backdrop-blur-sm rounded-xl p-4 ${
            isOpponent ? 'mr-4' : 'ml-4'
          }`}>
            {/* Name and Types Row */}
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-bold capitalize">{pokemon.name}</h2>
              <div className="flex gap-1">
                {pokemon.types.map(({ type }) => {
                  const typeColors: Record<string, string> = {
                    normal: 'bg-gray-400',
                    fire: 'bg-orange-500',
                    water: 'bg-blue-500',
                    grass: 'bg-green-500',
                    electric: 'bg-yellow-400',
                    ice: 'bg-cyan-300',
                    fighting: 'bg-red-700',
                    poison: 'bg-purple-500',
                    ground: 'bg-yellow-600',
                    flying: 'bg-indigo-400',
                    psychic: 'bg-pink-500',
                    bug: 'bg-lime-500',
                    rock: 'bg-yellow-800',
                    ghost: 'bg-purple-700',
                    dragon: 'bg-indigo-600',
                    dark: 'bg-gray-700',
                    steel: 'bg-gray-500',
                    fairy: 'bg-pink-300',
                  };

                  return (
                    <span 
                      key={type.name}
                      className={`px-2 py-0.5 rounded text-xs text-white ${typeColors[type.name] || 'bg-gray-600'} capitalize`}
                    >
                      {type.name}
                    </span>
                  );
                })}
              </div>
            </div>
            
            {/* HP Bar */}
            <div className="mt-2">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-semibold">HP</span>
                <span className="text-sm">{currentHp}/{maxHp}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`${hpColor} h-2.5 rounded-full transition-all duration-500`}
                  style={{ width: `${hpPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Moves */}
            {!isOpponent && (
              <div className="grid grid-cols-2 gap-2 mt-4">
                {moves.map((move) => (
                  <button
                    key={move.name}
                    onClick={() => onMoveSelect?.(move)}
                    disabled={disabled}
                    className={`p-2 rounded-lg text-sm ${
                      disabled 
                        ? 'bg-gray-200 cursor-not-allowed' 
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    <div className="font-bold capitalize">{move.name}</div>
                    <div className="text-xs">
                      Power: {move.power || '-'} | PP: {move.pp}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <img 
          src={isOpponent ? pokemon.sprites.front_default : pokemon.sprites.back_default}
          alt={pokemon.name}
          className={`${isOpponent ? 'w-40 h-40' : 'w-60 h-60'}`}
        />
      </div>
    </div>
  );
};