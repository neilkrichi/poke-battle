import React, { useState, useEffect, useRef } from 'react';
import { PokemonCard } from './components/PokemonCard';
import { BattleLog } from './components/BattleLog';
import { fetchRandomPokemon, fetchMove } from './api/pokemonApi';
import { Pokemon, Move } from './types/pokemon';

interface BattleState {
  pokemon: Pokemon;
  move: Move;
}

const App: React.FC = () => {
  const [battleState, setBattleState] = useState<{
    player: BattleState | null;
    opponent: BattleState | null;
  }>({
    player: null,
    opponent: null
  });
  const [battleLog, setBattleLog] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  // Workaround for React Strict Mode that mounts the component twice on initial load 
  const initialized = useRef(false);

  const initializeBattle = async () => {
    setIsLoading(true);
    console.log('Initializing battle...');

    try {
      const [poke1, poke2] = await Promise.all([
        fetchRandomPokemon(),
        fetchRandomPokemon()
      ]);

      const [moveData1, moveData2] = await Promise.all([
        fetchMove(poke1.moves[Math.floor(Math.random() * poke1.moves.length)].move.url),
        fetchMove(poke2.moves[Math.floor(Math.random() * poke2.moves.length)].move.url)
      ]);

      setBattleState({
        opponent: { pokemon: poke1, move: moveData1 },
        player: { pokemon: poke2, move: moveData2 }
      });
      setBattleLog('');
    } catch (error) {
      console.error('Error initializing battle:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // if the battle has not been initialized, initialize it
    if (!initialized.current) {
      initialized.current = true;
      initializeBattle();
    }
  }, []);

  const handleBattle = () => {
    if (!battleState.player || !battleState.opponent) return;

    const { player, opponent } = battleState;
    if (player.move.power === opponent.move.power) {
      setBattleLog('Draw!');
    } else if (player.move.power > opponent.move.power) {
      setBattleLog(`${player.pokemon.name} lands a decisive blow with ${player.move.name} knocking out ${opponent.pokemon.name}!`);
    } else {
      setBattleLog(`${opponent.pokemon.name} lands a decisive blow with ${opponent.move.name} knocking out ${player.pokemon.name}!`);
    }
  };

  if (isLoading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold text-center mb-8">Pokémon Battle</h1>
      
      {battleState.opponent && battleState.player && (
        <>
          <div className="space-y-4 border-2 border-gray-200 rounded-lg p-4">
            <PokemonCard 
              pokemon={battleState.opponent.pokemon} 
              move={battleState.opponent.move} 
              isOpponent 
            />
            <PokemonCard 
              pokemon={battleState.player.pokemon} 
              move={battleState.player.move} 
            />
          </div>

          <BattleLog message={battleLog} />
          
          <div className="mt-4 flex justify-center space-x-4">
            <button
              onClick={handleBattle}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Start Battle!
            </button>
            <button
              onClick={initializeBattle}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              New Battle
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default App;