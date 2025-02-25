export interface Pokemon {
    name: string;
    sprites: {
      front_default: string;
      back_default: string;
    };
    moves: Array<{
      move: {
        name: string;
        url: string;
      };
    }>;
  }
  
export interface Move {
    name: string;
    power: number;
}