import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PokemonSelect } from '../../components/PokemonSelect';

const global = globalThis as any;
global.fetch = vi.fn();

describe('PokemonSelect', () => {
  const mockPokemonList = [
    { id: 1, name: 'bulbasaur', types: ['grass', 'poison'], sprite: 'bulbasaur.png' },
    { id: 4, name: 'charmander', types: ['fire'], sprite: 'charmander.png' },
    { id: 7, name: 'squirtle', types: ['water'], sprite: 'squirtle.png' }
  ];

  beforeEach(() => {
    // First fetch for the list
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        results: mockPokemonList.map(pokemon => ({
          name: pokemon.name,
          url: `https://pokeapi.co/api/v2/pokemon/${pokemon.id}`
        }))
      })
    } as Response);

    // Subsequent fetches for individual Pokemon
    mockPokemonList.forEach(pokemon => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          id: pokemon.id,
          name: pokemon.name,
          types: pokemon.types.map(type => ({ type: { name: type } })),
          sprites: { front_default: pokemon.sprite }
        })
      } as Response);
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders search input', () => {
    render(<PokemonSelect onSelect={() => {}} />);
    expect(screen.getByPlaceholderText('Search Pokémon...')).toBeInTheDocument();
  });

  it('filters pokemon by search term', async () => {
    render(<PokemonSelect onSelect={() => {}} />);
    const searchInput = screen.getByPlaceholderText('Search Pokémon...');
    
    fireEvent.change(searchInput, { target: { value: 'char' } });
    
    const pokemonElement = await screen.findByText(/charmander/i);
    expect(pokemonElement).toBeInTheDocument();
    expect(screen.queryByText(/bulbasaur/i)).not.toBeInTheDocument();
  });

  it('filters pokemon by type', async () => {
    render(<PokemonSelect onSelect={() => {}} />);
    const typeSelect = screen.getByRole('combobox');
    
    fireEvent.change(typeSelect, { target: { value: 'fire' } });
    
    expect(await screen.findByText('charmander')).toBeInTheDocument();
    expect(screen.queryByText('squirtle')).not.toBeInTheDocument();
  });

  it('calls onSelect when pokemon is clicked', async () => {
    const handleSelect = vi.fn();
    render(<PokemonSelect onSelect={handleSelect} />);
    
    const pokemonButton = await screen.findByText('bulbasaur');
    fireEvent.click(pokemonButton);
    
    expect(handleSelect).toHaveBeenCalledWith(1);
  });
}); 