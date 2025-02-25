import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BattleLog } from '../../components/BattleLog';

describe('BattleLog', () => {
  it('renders battle log message', () => {
    const testMessage = 'Pikachu wins!';
    render(<BattleLog message={testMessage} />);
    
    expect(screen.getByText('Battle Log')).toBeInTheDocument();
    expect(screen.getByText(testMessage)).toBeInTheDocument();
  });

  it('renders empty battle log', () => {
    render(<BattleLog message="" />);
    
    expect(screen.getByText('Battle Log')).toBeInTheDocument();
  });
}); 