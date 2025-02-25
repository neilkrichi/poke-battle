import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PokemonCard } from '../../components/PokemonCard';

describe('PokemonCard', () => {
  const mockPokemon = {
    name: 'pikachu',
    sprites: {
      front_default: 'front.png',
      back_default: 'back.png'
    },
    moves: []
  };

  const mockMove = {
    name: 'thunderbolt',
    power: 90
  };

  it('renders pokemon name and move', () => {
    render(<PokemonCard pokemon={mockPokemon} move={mockMove} />);
    
    expect(screen.getByText('pikachu')).toBeInTheDocument();
    expect(screen.getByText('thunderbolt: 90')).toBeInTheDocument();
  });

  it('renders opponent pokemon correctly', () => {
    render(<PokemonCard pokemon={mockPokemon} move={mockMove} isOpponent />);
    
    const image = screen.getByAltText('pikachu');
    expect(image).toHaveAttribute('src', 'front.png');
  });

  it('renders player pokemon correctly', () => {
    render(<PokemonCard pokemon={mockPokemon} move={mockMove} />);
    
    const image = screen.getByAltText('pikachu');
    expect(image).toHaveAttribute('src', 'back.png');
  });
}); 