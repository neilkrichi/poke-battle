import { describe, it, expect, vi } from 'vitest';
import { fetchRandomPokemon, fetchMove } from '../../api/pokemonApi';

const global = globalThis as any;
global.fetch = vi.fn();

describe('pokemonApi', () => {
  it('fetchRandomPokemon returns Pokemon data', async () => {
    const mockPokemon = {
      name: 'pikachu',
      sprites: {
        front_default: 'front.png',
        back_default: 'back.png'
      },
      moves: [{
        move: {
          name: 'thunderbolt',
          url: 'move-url'
        }
      }]
    };

    (fetch as any).mockResolvedValueOnce({
      json: () => Promise.resolve(mockPokemon)
    });

    const result = await fetchRandomPokemon();
    expect(result).toEqual(mockPokemon);
  });

  it('fetchMove returns move data', async () => {
    const mockMove = {
      name: 'thunderbolt',
      power: 90
    };

    (fetch as any).mockResolvedValueOnce({
      json: () => Promise.resolve(mockMove)
    });

    const result = await fetchMove('move-url');
    expect(result).toEqual({
      name: 'thunderbolt',
      power: 90
    });
  });
}); 