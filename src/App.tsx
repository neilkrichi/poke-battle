import React, { useState } from 'react';
import { PokemonCard } from './components/PokemonCard';
import { BattleLog } from './components/BattleLog';
import { POKEMON_API_BASE, fetchRandomPokemon, fetchMoves, calculateDamage } from './api/pokemonApi';
import { Move, BattlePokemon } from './types/pokemon';
import { PokemonSelect } from './components/PokemonSelect';
import { MoveAnimation } from './components/MoveAnimation';

const App: React.FC = () => {
  const [playerPokemon, setPlayerPokemon] = useState<BattlePokemon | null>(null);
  const [opponentPokemon, setOpponentPokemon] = useState<BattlePokemon | null>(null);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [showSelection, setShowSelection] = useState(true);
  const [selectedPokemonId, setSelectedPokemonId] = useState<number | null>(null);
  const [moveAnimation, setMoveAnimation] = useState({
    isActive: false,
    moveType: '',
    isPlayerMove: true
  });

  const handlePokemonSelect = async (pokemonId: number) => {
    setSelectedPokemonId(pokemonId);
    const response = await fetch(`${POKEMON_API_BASE}/pokemon/${pokemonId}`);
    const pokemon = await response.json();
    const moves = await fetchMoves(pokemon);
    const maxHp = pokemon.stats.find((s: any) => s.stat.name === 'hp')?.base_stat || 100;

    setPlayerPokemon({
      pokemon,
      moves,
      currentHp: maxHp,
      maxHp,
      status: null
    });
  };

  const startBattle = async () => {
    if (!playerPokemon) return;
    
    // Reset player Pokemon HP
    const playerMaxHp = playerPokemon.pokemon.stats.find(s => s.stat.name === 'hp')?.base_stat || 100;
    setPlayerPokemon(prev => prev ? {
      ...prev,
      currentHp: playerMaxHp,
      maxHp: playerMaxHp
    } : null);
    
    // Initialize opponent Pokemon
    const newOpponentPokemon = await fetchRandomPokemon();
    const opponentMoves = await fetchMoves(newOpponentPokemon);
    const opponentMaxHp = newOpponentPokemon.stats.find(s => s.stat.name === 'hp')?.base_stat || 100;

    setOpponentPokemon({
      pokemon: newOpponentPokemon,
      moves: opponentMoves,
      currentHp: opponentMaxHp,
      maxHp: opponentMaxHp,
      status: null
    });

    setBattleLog([`A wild ${newOpponentPokemon.name} appeared!`]);
    setShowSelection(false);
    setGameOver(false);
    setIsPlayerTurn(true);
  };

  const handleMoveSelect = async (move: Move) => {
    if (!playerPokemon || !opponentPokemon || !isPlayerTurn || gameOver) return;

    // Start animation
    setMoveAnimation({
      isActive: true,
      moveType: move.type,
      isPlayerMove: true
    });

    // Wait for animation
    await new Promise(resolve => setTimeout(resolve, 500));

    const { damage, effectiveness } = calculateDamage(playerPokemon, opponentPokemon, move);
    const newOpponentHp = Math.max(0, opponentPokemon.currentHp - damage);

    setOpponentPokemon(prev => prev ? {
      ...prev,
      currentHp: newOpponentHp
    } : null);

    const effectivenessMessage = effectiveness > 1 
      ? "It's super effective!"
      : effectiveness < 1 && effectiveness > 0
      ? "It's not very effective..."
      : effectiveness === 0
      ? "It had no effect..."
      : "";

    setBattleLog(prev => [...prev, 
      `${playerPokemon.pokemon.name} used ${move.name}!`,
      effectivenessMessage,
      `Dealt ${damage} damage!`
    ].filter(Boolean));

    // Check if opponent fainted
    if (newOpponentHp <= 0) {
      setBattleLog(prev => [...prev, `${opponentPokemon.pokemon.name} fainted!`]);
      setGameOver(true);
      return;
    }

    // Opponent's turn
    setIsPlayerTurn(false);
    await executeOpponentTurn();
  };

  const executeOpponentTurn = async () => {
    if (!playerPokemon || !opponentPokemon) return;

    const randomMove = opponentPokemon.moves[Math.floor(Math.random() * opponentPokemon.moves.length)];
    
    // Start animation
    setMoveAnimation({
      isActive: true,
      moveType: randomMove.type,
      isPlayerMove: false
    });

    // Wait for animation
    await new Promise(resolve => setTimeout(resolve, 500));

    const { damage, effectiveness } = calculateDamage(opponentPokemon, playerPokemon, randomMove);
    const newPlayerHp = Math.max(0, playerPokemon.currentHp - damage);

    setTimeout(() => {
      setPlayerPokemon(prev => prev ? {
        ...prev,
        currentHp: newPlayerHp
      } : null);

      const effectivenessMessage = effectiveness > 1 
        ? "It's super effective!"
        : effectiveness < 1 && effectiveness > 0
        ? "It's not very effective..."
        : effectiveness === 0
        ? "It had no effect..."
        : "";

      setBattleLog(prev => [...prev,
        `${opponentPokemon.pokemon.name} used ${randomMove.name}!`,
        effectivenessMessage,
        `Dealt ${damage} damage!`
      ].filter(Boolean));

      if (newPlayerHp <= 0) {
        setBattleLog(prev => [...prev, `${playerPokemon.pokemon.name} fainted!`]);
        setGameOver(true);
      } else {
        setIsPlayerTurn(true);
      }
    }, 1000);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">Pokémon Battle</h1>
      
      {showSelection ? (
        <div className="max-w-2xl mx-auto">
          <PokemonSelect 
            onSelect={handlePokemonSelect}
            selectedPokemonId={selectedPokemonId || undefined}
          />
          <button
            onClick={startBattle}
            disabled={!selectedPokemonId}
            className={`mt-4 w-full py-2 rounded ${
              selectedPokemonId
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Start Battle!
          </button>
        </div>
      ) : (
        <div className="flex gap-8">
          <div className="flex-1">
            <MoveAnimation 
              isActive={moveAnimation.isActive}
              moveType={moveAnimation.moveType}
              isPlayerMove={moveAnimation.isPlayerMove}
              onComplete={() => setMoveAnimation(prev => ({ ...prev, isActive: false }))}
            />
            {opponentPokemon && (
              <PokemonCard 
                battlePokemon={opponentPokemon}
                isOpponent={true}
                disabled={true}
              />
            )}

            {playerPokemon && (
              <PokemonCard 
                battlePokemon={playerPokemon}
                isOpponent={false}
                onMoveSelect={handleMoveSelect}
                disabled={!isPlayerTurn || gameOver}
              />
            )}
          </div>

          <div className="w-80 flex flex-col gap-4">
            <BattleLog messages={battleLog} />
            
            <div className="flex flex-col gap-2">
              {gameOver && (
                <button 
                  onClick={startBattle}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  New Battle
                </button>
              )}
              <button 
                onClick={() => setShowSelection(true)}
                className="w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Change Pokémon
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;