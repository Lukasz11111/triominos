import type { HistoryEntry } from '../types/history';
import type { Player } from '../types/game';

interface HistoryModalProps {
  player: Player;
  history: HistoryEntry[];
  onClose: () => void;
}

export function HistoryModal({ player, history, onClose }: HistoryModalProps) {
  const playerHistory = history.filter((entry) => entry.playerId === player.id);
  const sortedHistory = [...playerHistory].sort((a, b) => b.timestamp - a.timestamp);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('pl-PL', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getTypeColor = (type: HistoryEntry['type']) => {
    switch (type) {
      case 'add':
      case 'victory':
        return 'var(--color-success)';
      case 'subtract':
      case 'penalty':
      case 'round_end':
        return 'var(--color-danger)';
      case 'manual_edit':
        return 'var(--color-orange)';
      default:
        return 'var(--color-gray)';
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content history-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Historia - {player.name}</h2>
          <button className="btn-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="history-list">
          {sortedHistory.length === 0 ? (
            <p className="history-empty">Brak historii</p>
          ) : (
            sortedHistory.map((entry) => (
              <div key={entry.id} className="history-entry">
                <div className="history-entry-header">
                  <span className="history-type" style={{ color: getTypeColor(entry.type) }}>
                    {entry.type === 'add' && '➕'}
                    {entry.type === 'subtract' && '➖'}
                    {entry.type === 'manual_edit' && '✎'}
                    {entry.type === 'victory' && '🏆'}
                    {entry.type === 'round_end' && '📋'}
                    {entry.type === 'penalty' && '⚠️'}
                  </span>
                  <span className="history-description">{entry.description}</span>
                  <span className="history-time">{formatDate(entry.timestamp)}</span>
                </div>
                <div className="history-entry-details">
                  <span className="history-round">Runda {entry.roundNumber}</span>
                  <span className="history-points">
                    {entry.type === 'add' || entry.type === 'victory' ? '+' : ''}
                    {entry.points} pkt
                  </span>
                  <span className="history-total">
                    {entry.previousTotal} → {entry.newTotal} pkt
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

