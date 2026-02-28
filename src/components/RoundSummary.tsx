import type { Player } from '../types/game';

interface RoundSummaryProps {
  players: Player[];
  onNextRound: () => void;
}

export function RoundSummary({ players, onNextRound }: RoundSummaryProps) {
  const sortedPlayers = [...players].sort(
    (a, b) => b.totalPoints - a.totalPoints
  );

  return (
    <div className="modal-overlay">
      <div className="modal-content round-summary">
        <h2>Podsumowanie Rundy</h2>
        <div className="summary-players">
          {sortedPlayers.map((player) => (
            <div key={player.id} className="summary-player">
              <div className="summary-player-name">{player.name}</div>
              <div className="summary-player-points">
                {player.totalPoints} pkt
              </div>
            </div>
          ))}
        </div>
        <button className="btn-primary" onClick={onNextRound}>
          Następna Runda
        </button>
      </div>
    </div>
  );
}

