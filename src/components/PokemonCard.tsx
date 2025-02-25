import React from 'react';
import { Pokemon, Move } from '../types/pokemon';

interface PokemonCardProps {
  pokemon: Pokemon;
  move: Move;
  isOpponent?: boolean;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, move, isOpponent }) => {
  return (
    <div className="flex items-center p-4 bg-white">
      <div className={`flex ${isOpponent ? 'flex-row' : 'flex-row-reverse'} items-center w-full`}>
        <div className="flex-1">
          <div className={`relative bg-white border-2 border-gray-200 rounded-xl p-4 ${
            isOpponent ? 'mr-4' : 'ml-4'
          }`}>
            <div className={`absolute top-1/2 transform -translate-y-1/2 ${
              isOpponent ? '-right-2 rotate-[135deg]' : '-left-2 -rotate-45'
            } w-4 h-4 bg-white border-2 border-gray-200 border-b-0 border-r-0`}></div>
            <div className="flex flex-row justify-between">
              <h2 className="text-2xl font-bold capitalize">{pokemon.name}</h2>
              <div className="flex justify-end">
                <div className={`inline-block px-3 py-1 rounded-full ${
                  move.power > 50 ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  {move.name}: {move.power}
                </div>
              </div>
            </div>
          </div>
        </div>
        <img 
          src={isOpponent ? pokemon.sprites.front_default : pokemon.sprites.back_default}
          alt={pokemon.name}
          className={`${isOpponent ? 'w-32 h-32' : 'w-60 h-60'}`}
        />
      </div>
    </div>
  );
};