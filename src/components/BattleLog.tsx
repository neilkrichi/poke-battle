import React from 'react';

interface BattleLogProps {
  messages: string[];
}

export const BattleLog: React.FC<BattleLogProps> = ({ messages }) => {
  return (
    <div className="mt-4 p-4 bg-gray-100 rounded-lg max-h-48 overflow-y-auto">
      <h3 className="font-bold mb-2">Battle Log</h3>
      {messages.map((message, index) => (
        <p key={index} className="mb-1">{message}</p>
      ))}
    </div>
  );
};