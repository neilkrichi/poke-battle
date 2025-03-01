import { BattlePokemon, Move, Pokemon, PokemonListItem, TYPE_CHART } from "../types/pokemon";

export const POKEMON_API_BASE = 'https://pokeapi.co/api/v2';

export const fetchRandomPokemon = async (): Promise<Pokemon> => {
  const randomId = Math.floor(Math.random() * 151) + 1;
  const response = await fetch(`${POKEMON_API_BASE}/pokemon/${randomId}`);
  return response.json();
};

export const fetchMoves = async (pokemon: Pokemon): Promise<Move[]> => {
  // Get 4 random moves from the Pokemon's move list
  const moveUrls = pokemon.moves
    .sort(() => Math.random() - 0.5)
    .slice(0, 4)
    .map(m => m.move.url);

  const moves = await Promise.all(
    moveUrls.map(async (url) => {
      const response = await fetch(url);
      const data = await response.json();
      return {
        name: data.name,
        power: data.power || 0,
        type: data.type.name,
        accuracy: data.accuracy,
        pp: data.pp,
        effect_chance: data.effect_chance,
        effect_entries: data.effect_entries
      };
    })
  );

  return moves;
};

export const fetchPokemonList = async (): Promise<PokemonListItem[]> => {
  const response = await fetch(`${POKEMON_API_BASE}/pokemon?limit=151`);
  const data = await response.json();
  
  const pokemonList = await Promise.all(
    data.results.map(async (result: { name: string, url: string }, index: number) => {
      const pokemonResponse = await fetch(result.url);
      const pokemonData = await pokemonResponse.json();
      
      return {
        id: index + 1,
        name: pokemonData.name,
        types: pokemonData.types.map((t: any) => t.type.name),
        sprite: pokemonData.sprites.front_default
      };
    })
  );
  
  return pokemonList;
};

export const calculateTypeEffectiveness = (
  moveType: string,
  defenderTypes: string[]
): number => {
  let effectiveness = 1;

  defenderTypes.forEach(defenderType => {
    const defender = TYPE_CHART[defenderType];
    if (!defender) return;

    if (defender.weaknesses.includes(moveType)) {
      effectiveness *= 2;
    }
    if (defender.resistances.includes(moveType)) {
      effectiveness *= 0.5;
    }
    if (defender.immunities.includes(moveType)) {
      effectiveness = 0;
    }
  });

  return effectiveness;
};

export const calculateDamage = (
  attacker: BattlePokemon,
  defender: BattlePokemon,
  move: Move
): { damage: number; effectiveness: number } => {
  const power = move.power;
  if (power === 0) {
    return { damage: 0, effectiveness: 0 };
  }

  const attack = attacker.pokemon.stats.find(s => s.stat.name === 'attack')?.base_stat || 0;
  const defense = defender.pokemon.stats.find(s => s.stat.name === 'defense')?.base_stat || 0;
  
  const effectiveness = calculateTypeEffectiveness(
    move.type,
    defender.pokemon.types.map(t => t.type.name)
  );
  
  const damage = Math.floor(
    (((2 * 50 / 5 + 2) * power * attack / defense) / 50 + 2) * 
    effectiveness *
    (Math.random() * (1 - 0.85) + 0.85)
  );
  
  return { damage, effectiveness };
};