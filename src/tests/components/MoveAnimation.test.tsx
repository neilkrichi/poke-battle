import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MoveAnimation } from '../../components/MoveAnimation';

describe('MoveAnimation', () => {
  it('renders nothing when inactive', () => {
    const { container } = render(
      <MoveAnimation 
        isActive={false}
        moveType="fire"
        isPlayerMove={true}
        onComplete={() => {}}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders with correct type color', () => {
    render(
      <MoveAnimation 
        isActive={true}
        moveType="fire"
        isPlayerMove={true}
        onComplete={() => {}}
      />
    );
    const effect = screen.getByTestId('move-effect');
    expect(effect).toHaveStyle({ backgroundColor: '#F08030' });
  });

  it('calls onComplete after animation', () => {
    vi.useFakeTimers();
    const onComplete = vi.fn();
    
    render(
      <MoveAnimation 
        isActive={true}
        moveType="water"
        isPlayerMove={true}
        onComplete={onComplete}
      />
    );

    vi.advanceTimersByTime(1000);
    expect(onComplete).toHaveBeenCalled();
    vi.useRealTimers();
  });
}); 