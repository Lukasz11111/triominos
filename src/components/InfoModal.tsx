import type { GameRules } from '../types/game';

interface InfoModalProps {
  rules: GameRules;
  onClose: () => void;
}

export function InfoModal({ rules, onClose }: InfoModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Aktualne Zasady</h2>
          <button className="btn-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <div className="rules-info">
            <h3>Bonusy Startowe</h3>
            <ul>
              {rules.tripleStartBonus && (
                <li>Bonus za potrójne na start: +10 pkt</li>
              )}
              {rules.zeroStartBonus && (
                <li>Bonus za 0-0-0 na start: +30 pkt</li>
              )}
            </ul>

            <h3>Bonusy za Układy</h3>
            <ul>
              <li>Most: +{rules.bridgeBonus} pkt</li>
              <li>Heksagon: +{rules.hexagonBonus} pkt</li>
              <li>Podwójny Heksagon: +{rules.doubleHexagonBonus} pkt</li>
              <li>Potrójny Heksagon: +{rules.tripleHexagonBonus} pkt</li>
            </ul>

            <h3>Kary za Dobieranie</h3>
            <ul>
              <li>Kara za dobranie: -{rules.drawPenalty} pkt</li>
              <li>Maksymalna liczba dobierań: {rules.maxDraws}</li>
              <li>Kara po przekroczeniu: -{rules.finalDrawPenalty} pkt</li>
            </ul>

            <h3>Inne</h3>
            <ul>
              <li>Bonus za zwycięstwo: +{rules.winBonus} pkt</li>
              <li>Limit zwycięstwa: {rules.winLimit} pkt</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

