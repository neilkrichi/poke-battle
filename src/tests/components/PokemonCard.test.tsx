import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PokemonCard } from '../../components/PokemonCard';

describe('PokemonCard', () => {
  const mockBattlePokemon = {
    pokemon: {
      name: 'pikachu',
      sprites: {
        front_default: 'front.png',
        back_default: 'back.png'
      },
      types: [{ type: { name: 'electric' } }],
      stats: [],
      moves: []
    },
    moves: [{
      name: 'thunderbolt',
      power: 90,
      type: 'electric',
      accuracy: 100,
      pp: 15,
      effect_chance: null,
      effect_entries: []
    }],
    currentHp: 100,
    maxHp: 100,
    status: null
  };

  it('renders pokemon name and move', () => {
    render(<PokemonCard battlePokemon={mockBattlePokemon} isOpponent={false} />);
    
    expect(screen.getByText('pikachu')).toBeInTheDocument();
    expect(screen.getByText(/thunderbolt/)).toBeInTheDocument();
  });

  it('renders opponent pokemon correctly', () => {
    render(<PokemonCard battlePokemon={mockBattlePokemon} isOpponent={true} />);
    
    const image = screen.getByAltText('pikachu');
    expect(image).toHaveAttribute('src', 'front.png');
  });

  it('renders player pokemon correctly', () => {
    render(<PokemonCard battlePokemon={mockBattlePokemon} isOpponent={false} />);
    
    const image = screen.getByAltText('pikachu');
    expect(image).toHaveAttribute('src', 'back.png');
  });
}); 