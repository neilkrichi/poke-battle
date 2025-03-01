import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BattleLog } from '../../components/BattleLog';

describe('BattleLog', () => {
  const mockMessages = [
    'Pikachu used Thunderbolt!',
    "It's super effective!",
    'Dealt 50 damage!'
  ];

  it('renders all messages', () => {
    render(<BattleLog messages={mockMessages} />);
    
    mockMessages.forEach(message => {
      expect(screen.getByText(message)).toBeInTheDocument();
    });
  });

  it('renders empty log correctly', () => {
    render(<BattleLog messages={[]} />);
    expect(screen.getByText('Battle Log')).toBeInTheDocument();
  });

  it('maintains message order', () => {
    render(<BattleLog messages={mockMessages} />);
    const messages = screen.getAllByText(/./i);
    expect(messages[1].textContent).toBe(mockMessages[0]);
    expect(messages[2].textContent).toBe(mockMessages[1]);
    expect(messages[3].textContent).toBe(mockMessages[2]);
  });
}); 