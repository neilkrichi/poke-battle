import React from 'react';

interface BattleLogProps {
  message: string;
}

export const BattleLog: React.FC<BattleLogProps> = ({ message }) => {
  return (
    <div className="mt-4 p-4 bg-gray-100 rounded-lg">
      <h3 className="font-bold mb-2">Battle Log</h3>
      <p>{message}</p>
    </div>
  );
};