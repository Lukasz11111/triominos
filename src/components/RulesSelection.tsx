import { useState } from 'react';
import type { GameRules } from '../types/game';
import { defaultRules } from '../utils/defaultRules';

interface RulesSelectionProps {
  onConfirm: (rules: GameRules, playerCount: number) => void;
}

export function RulesSelection({ onConfirm }: RulesSelectionProps) {
  const [rules, setRules] = useState<GameRules>(defaultRules);
  const [playerCount, setPlayerCount] = useState<number>(2);

  const handleChange = (key: keyof GameRules, value: boolean | number) => {
    setRules((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (playerCount < 2 || playerCount > 6) {
      alert('Liczba graczy musi być między 2 a 6');
      return;
    }
    onConfirm(rules, playerCount);
  };

  return (
    <div className="rules-selection">
      <h1>Wybór Zasad Gry</h1>
      <div className="rules-form">
        <div className="rule-group">
          <h3>Bonusy Startowe</h3>
          <label>
            <input
              type="checkbox"
              checked={rules.tripleStartBonus}
              onChange={(e) => handleChange('tripleStartBonus', e.target.checked)}
            />
            Bonus za potrójne na start (+10 pkt)
          </label>
          <label>
            <input
              type="checkbox"
              checked={rules.zeroStartBonus}
              onChange={(e) => handleChange('zeroStartBonus', e.target.checked)}
            />
            Bonus za 0-0-0 na start (+30 pkt zamiast +10)
          </label>
        </div>

        <div className="rule-group">
          <h3>Bonusy za Układy</h3>
          <label>
            Most:
            <input
              type="number"
              value={rules.bridgeBonus}
              onChange={(e) => handleChange('bridgeBonus', parseInt(e.target.value) || 0)}
              min="0"
            />
            pkt
          </label>
          <label>
            Heksagon:
            <input
              type="number"
              value={rules.hexagonBonus}
              onChange={(e) => handleChange('hexagonBonus', parseInt(e.target.value) || 0)}
              min="0"
            />
            pkt
          </label>
          <label>
            Podwójny Heksagon:
            <input
              type="number"
              value={rules.doubleHexagonBonus}
              onChange={(e) => handleChange('doubleHexagonBonus', parseInt(e.target.value) || 0)}
              min="0"
            />
            pkt
          </label>
          <label>
            Potrójny Heksagon:
            <input
              type="number"
              value={rules.tripleHexagonBonus}
              onChange={(e) => handleChange('tripleHexagonBonus', parseInt(e.target.value) || 0)}
              min="0"
            />
            pkt
          </label>
        </div>

        <div className="rule-group">
          <h3>Kary za Dobieranie</h3>
          <label>
            Kara za dobranie:
            <input
              type="number"
              value={rules.drawPenalty}
              onChange={(e) => handleChange('drawPenalty', parseInt(e.target.value) || 0)}
              min="0"
            />
            pkt
          </label>
          <label>
            Maksymalna liczba dobierań:
            <input
              type="number"
              value={rules.maxDraws}
              onChange={(e) => handleChange('maxDraws', parseInt(e.target.value) || 0)}
              min="1"
            />
          </label>
          <label>
            Kara po przekroczeniu limitu:
            <input
              type="number"
              value={rules.finalDrawPenalty}
              onChange={(e) => handleChange('finalDrawPenalty', parseInt(e.target.value) || 0)}
              min="0"
            />
            pkt
          </label>
        </div>

        <div className="rule-group">
          <h3>Inne</h3>
          <label>
            Liczba graczy:
            <input
              type="number"
              value={playerCount}
              onChange={(e) => setPlayerCount(parseInt(e.target.value) || 2)}
              min="2"
              max="6"
            />
          </label>
          <label>
            Bonus za zwycięstwo:
            <input
              type="number"
              value={rules.winBonus}
              onChange={(e) => handleChange('winBonus', parseInt(e.target.value) || 0)}
              min="0"
            />
            pkt
          </label>
          <label>
            Limit zwycięstwa:
            <input
              type="number"
              value={rules.winLimit}
              onChange={(e) => handleChange('winLimit', parseInt(e.target.value) || 0)}
              min="100"
            />
            pkt
          </label>
        </div>

        <button className="btn-primary" onClick={handleSubmit}>
          Potwierdź Zasady
        </button>
      </div>
    </div>
  );
}

