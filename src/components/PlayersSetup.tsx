import { useState } from 'react';
import type { Player } from '../types/game';

interface PlayersSetupProps {
  playerCount: number;
  onConfirm: (players: Player[]) => void;
}

export function PlayersSetup({ playerCount, onConfirm }: PlayersSetupProps) {
  const [players, setPlayers] = useState<Player[]>(
    Array.from({ length: playerCount }, (_, i) => ({
      id: `player-${i}`,
      name: `Gracz ${i + 1}`,
      currentPoints: 0,
      totalPoints: 0,
      hasPassed: false,
      isActive: false,
    }))
  );

  const handleNameChange = (id: string, name: string) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, name } : p))
    );
  };

  const movePlayer = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === players.length - 1)
    ) {
      return;
    }
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newPlayers = [...players];
    [newPlayers[index], newPlayers[newIndex]] = [
      newPlayers[newIndex],
      newPlayers[index],
    ];
    setPlayers(newPlayers);
  };

  const handleSubmit = () => {
    if (players.some((p) => !p.name.trim())) {
      alert('Wszyscy gracze muszą mieć imiona!');
      return;
    }
    onConfirm(players);
  };

  return (
    <div className="players-setup">
      <h1>Ustawienie Graczy</h1>
      <div className="players-list">
        {players.map((player, index) => (
          <div key={player.id} className="player-item">
            <div className="player-controls">
              <button
                className="btn-icon"
                onClick={() => movePlayer(index, 'up')}
                disabled={index === 0}
              >
                ↑
              </button>
              <button
                className="btn-icon"
                onClick={() => movePlayer(index, 'down')}
                disabled={index === players.length - 1}
              >
                ↓
              </button>
            </div>
            <input
              type="text"
              value={player.name}
              onChange={(e) => handleNameChange(player.id, e.target.value)}
              placeholder={`Gracz ${index + 1}`}
              className="player-name-input"
            />
          </div>
        ))}
      </div>
      <button className="btn-primary" onClick={handleSubmit}>
        Rozpocznij Grę
      </button>
    </div>
  );
}

