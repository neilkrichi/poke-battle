import { describe, it, expect, vi } from 'vitest';
import { fetchRandomPokemon, fetchMoves } from '../../api/pokemonApi';
import { calculateDamage, calculateTypeEffectiveness } from '../../api/pokemonApi';
import { BattlePokemon } from '../../types/pokemon';

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

  it('fetchMoves returns move data', async () => {
    const mockMove = {
      name: 'thunderbolt',
      power: 90,
      type: { name: 'electric' },
      accuracy: 100,
      pp: 15,
      effect_chance: null,
      effect_entries: []
    };

    (fetch as any).mockResolvedValueOnce({
      json: () => Promise.resolve(mockMove)
    });

    const mockPokemon = {
      moves: [{
        move: {
          name: 'thunderbolt',
          url: 'move-url'
        }
      }]
    };

    const result = await fetchMoves(mockPokemon as any);
    expect(result).toEqual([{
      name: 'thunderbolt',
      power: 90,
      type: 'electric',
      accuracy: 100,
      pp: 15,
      effect_chance: null,
      effect_entries: []
    }]);
  });

  describe('calculateTypeEffectiveness', () => {
    it('calculates super effective moves correctly', () => {
      const effectiveness = calculateTypeEffectiveness('water', ['fire']);
      expect(effectiveness).toBe(2);
    });

    it('calculates not very effective moves correctly', () => {
      const effectiveness = calculateTypeEffectiveness('fire', ['water']);
      expect(effectiveness).toBe(0.5);
    });

    it('calculates immunities correctly', () => {
      const effectiveness = calculateTypeEffectiveness('normal', ['ghost']);
      expect(effectiveness).toBe(0);
    });

    it('calculates dual-type effectiveness correctly', () => {
      const effectiveness = calculateTypeEffectiveness('water', ['ground', 'rock']);
      expect(effectiveness).toBe(4); // Both types are weak to water
    });
  });

  describe('calculateDamage', () => {
    const mockAttacker = {
      pokemon: {
        stats: [{ stat: { name: 'attack' }, base_stat: 50 }],
        types: [{ type: { name: 'fire' } }]
      }
    } as BattlePokemon;

    const mockDefender = {
      pokemon: {
        stats: [{ stat: { name: 'defense' }, base_stat: 50 }],
        types: [{ type: { name: 'grass' } }]
      }
    } as BattlePokemon;

    const mockMove = {
      name: 'flamethrower',
      power: 90,
      type: 'fire',
      accuracy: 100,
      pp: 15,
      effect_chance: null,
      effect_entries: []
    };

    it('calculates damage with type effectiveness', () => {
      const result = calculateDamage(mockAttacker, mockDefender, mockMove);
      expect(result.damage).toBeGreaterThan(0);
      expect(result.effectiveness).toBe(2); // Fire is super effective against Grass
    });

    it('returns zero damage for zero power moves', () => {
      const result = calculateDamage(mockAttacker, mockDefender, { ...mockMove, power: 0 });
      expect(result.damage).toBe(0);
    });
  });
}); 