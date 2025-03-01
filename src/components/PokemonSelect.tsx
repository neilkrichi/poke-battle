import React, { useState, useEffect } from 'react';
import { PokemonListItem, TYPE_CHART } from '../types/pokemon';
import { fetchPokemonList } from '../api/pokemonApi';

interface PokemonSelectProps {
  onSelect: (pokemonId: number) => void;
  selectedPokemonId?: number;
}

export const PokemonSelect: React.FC<PokemonSelectProps> = ({ onSelect, selectedPokemonId }) => {
  const [pokemonList, setPokemonList] = useState<PokemonListItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  
  useEffect(() => {
    const loadPokemon = async () => {
      const list = await fetchPokemonList();
      setPokemonList(list);
    };
    loadPokemon();
  }, []);

  const filteredPokemon = pokemonList.filter(pokemon => {
    const matchesSearch = pokemon.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedType || pokemon.types.includes(selectedType);
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <div className="mb-4 space-y-2">
        <input
          type="text"
          placeholder="Search Pokémon..."
          className="w-full p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="w-full p-2 border rounded"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="">All Types</option>
          {Object.keys(TYPE_CHART).map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
      
      <div className="grid grid-cols-3 gap-2 max-h-96 overflow-y-auto">
        {filteredPokemon.map(pokemon => (
          <button
            key={pokemon.id}
            onClick={() => onSelect(pokemon.id)}
            className={`p-2 rounded-lg transition-colors ${
              selectedPokemonId === pokemon.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <img 
              src={pokemon.sprite} 
              alt={pokemon.name}
              className="w-20 h-20 mx-auto"
            />
            <div className="text-sm font-semibold capitalize">{pokemon.name}</div>
            <div className="flex gap-1 justify-center">
              {pokemon.types.map(type => (
                <span
                  key={type}
                  className="px-1 py-0.5 text-xs rounded bg-gray-600 text-white capitalize"
                >
                  {type}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}; 