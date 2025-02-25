import { Move, Pokemon } from "../types/pokemon";

const POKEMON_API_BASE = 'https://pokeapi.co/api/v2';

export const fetchRandomPokemon = async (): Promise<Pokemon> => {
  const randomId = Math.floor(Math.random() * 151) + 1;
  const response = await fetch(`${POKEMON_API_BASE}/pokemon/${randomId}`);
  return response.json();
};

export const fetchMove = async (moveUrl: string): Promise<Move> => {
  const response = await fetch(moveUrl);
  const data = await response.json();
  return {
    name: data.name,
    power: data.power || 0
  };
};