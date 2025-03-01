export interface Pokemon {
    name: string;
    sprites: {
      front_default: string;
      back_default: string;
    };
    moves: Array<{
      move: {
        name: string;
        url: string;
      };
    }>;
    types: Array<{
      type: {
        name: string;
      };
    }>;
    stats: Array<{
      base_stat: number;
      stat: {
        name: string;
      };
    }>;
  }
  
export interface Move {
    name: string;
    power: number;
    type: string;
    accuracy: number;
    pp: number;
    effect_chance: number | null;
    effect_entries: Array<{
      effect: string;
      short_effect: string;
    }>;
}

export interface BattlePokemon {
  pokemon: Pokemon;
  moves: Move[];
  currentHp: number;
  maxHp: number;
  status: string | null;
}

export interface PokemonType {
  name: string;
  weaknesses: string[];
  resistances: string[];
  immunities: string[];
}

export const TYPE_CHART: Record<string, PokemonType> = {
  normal: {
    name: 'normal',
    weaknesses: ['fighting'],
    resistances: [],
    immunities: ['ghost']
  },
  fire: {
    name: 'fire',
    weaknesses: ['water', 'ground', 'rock'],
    resistances: ['fire', 'grass', 'ice', 'bug', 'steel', 'fairy'],
    immunities: []
  },
  water: {
    name: 'water',
    weaknesses: ['electric', 'grass'],
    resistances: ['fire', 'water', 'ice', 'steel'],
    immunities: []
  },
  grass: {
    name: 'grass',
    weaknesses: ['fire', 'ice', 'poison', 'flying', 'bug'],
    resistances: ['water', 'ground', 'rock', 'electric'],
    immunities: []
  },
  electric: {
    name: 'electric',
    weaknesses: ['ground'],
    resistances: ['electric', 'flying', 'steel'],
    immunities: ['ground']
  },
  ice: {
    name: 'ice',
    weaknesses: ['fire', 'fighting', 'rock', 'steel'],
    resistances: ['ice'],
    immunities: []
  },
  fighting: {
    name: 'fighting',
    weaknesses: ['flying', 'psychic', 'fairy'],
    resistances: ['bug', 'rock', 'dark'],
    immunities: []
  },
  poison: {
    name: 'poison',
    weaknesses: ['ground', 'psychic'],
    resistances: ['poison', 'fighting', 'bug', 'grass', 'fairy'],
    immunities: ['steel']
  },
  ground: {
    name: 'ground',
    weaknesses: ['water', 'grass', 'ice'],
    resistances: ['poison', 'rock', 'electric'],
    immunities: ['flying']
  },
  flying: {
    name: 'flying',
    weaknesses: ['electric', 'ice', 'rock'],
    resistances: ['bug', 'fighting', 'grass'],
    immunities: ['ground']
  },
  psychic: {
    name: 'psychic',
    weaknesses: ['bug', 'ghost', 'dark'],
    resistances: ['psychic', 'fighting'],
    immunities: ['steel']
  },
  bug: {
    name: 'bug',
    weaknesses: ['fire', 'flying', 'rock'],
    resistances: ['grass', 'fighting', 'ground'],
    immunities: []
  },
  rock: {
    name: 'rock',
    weaknesses: ['water', 'grass', 'fighting', 'ground', 'steel'],
    resistances: ['normal', 'fire', 'poison', 'flying'],
    immunities: []
  },
  ghost: {
    name: 'ghost',
    weaknesses: ['ghost', 'dark'],
    resistances: ['poison', 'bug'],
    immunities: ['normal', 'fighting']
  },
  dragon: {
    name: 'dragon',
    weaknesses: ['ice', 'dragon', 'fairy'],
    resistances: ['fire', 'water', 'electric', 'grass'],
    immunities: ['fairy']
  },
  // Add other types as needed...
};

export interface PokemonListItem {
  id: number;
  name: string;
  types: string[];
  sprite: string;
}