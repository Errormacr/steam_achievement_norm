import React from 'react';
import { GameDataRow } from '../interfaces';
import GameCard from './GameCard';

interface GameListProps {
  games: GameDataRow[];
  isLoading: boolean;
  lastElementRef: (node: Element) => void;
}

export function GameList ({ games, isLoading, lastElementRef }: GameListProps) {
  return (
    <div className="games-container">
      {games.map((game, index) => (
        <div
          key={game.appid}
          ref={index === games.length - 1 ? lastElementRef : null}
          style={{ width: 'fit-content' }}
        >
          <GameCard appid={game.appid} backWindow={'Games'} />
        </div>
      ))}
      {isLoading && <div className="loading">Loading...</div>}
    </div>
  );
}
