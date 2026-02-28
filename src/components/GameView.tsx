import { useState, useEffect } from 'react';
import type { GameState, Player, Tile } from '../types/game';
import type { HistoryEntry } from '../types/history';
import { TileSelector } from './TileSelector';
import { InfoModal } from './InfoModal';
import { RoundSummary } from './RoundSummary';
import { HistoryModal } from './HistoryModal';
import { saveGameState } from '../utils/gameStorage';

interface GameViewProps {
  initialState: GameState;
  onBack: () => void;
  onNewGame: () => void;
}

export function GameView({ initialState, onBack, onNewGame }: GameViewProps) {
  const [gameState, setGameState] = useState<GameState>(initialState);
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    const saved = localStorage.getItem('triominos-history');
    return saved ? JSON.parse(saved) : [];
  });
  const [showInfo, setShowInfo] = useState(false);
  const [showTileSelector, setShowTileSelector] = useState(false);
  const [showVictoryInputs, setShowVictoryInputs] = useState(false);
  const [victoryInputs, setVictoryInputs] = useState<Record<string, number>>({});
  const [showRoundEndInputs, setShowRoundEndInputs] = useState(false);
  const [roundEndInputs, setRoundEndInputs] = useState<Record<string, number>>({});
  const [manualPointsInput, setManualPointsInput] = useState<string>('');
  const [bonusType, setBonusType] = useState<
    'bridge' | 'hexagon' | 'doubleHexagon' | 'tripleHexagon' | null
  >(null);
  const [showHistory, setShowHistory] = useState<string | null>(null);
  
  useEffect(() => {
    saveGameState(gameState);
  }, [gameState]);

  useEffect(() => {
    localStorage.setItem('triominos-history', JSON.stringify(history));
  }, [history]);

  const addHistoryEntry = (
    playerId: string,
    type: HistoryEntry['type'],
    points: number,
    description: string,
    previousTotal: number,
    newTotal: number
  ) => {
    const entry: HistoryEntry = {
      id: `${Date.now()}-${Math.random()}`,
      playerId,
      roundNumber: gameState.roundNumber,
      timestamp: Date.now(),
      type,
      points: Math.abs(points),
      description,
      previousTotal,
      newTotal,
    };
    setHistory((prev) => [...prev, entry]);
  };

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const allPassed = gameState.players.every((p) => p.hasPassed);

  const updatePlayer = (playerId: string, updates: Partial<Player>) => {
    setGameState((prev) => ({
      ...prev,
      players: prev.players.map((p) =>
        p.id === playerId ? { ...p, ...updates } : p
      ),
    }));
  };

  const nextPlayer = () => {
    setGameState((prev) => {
      const nextIndex = (prev.currentPlayerIndex + 1) % prev.players.length;
      return {
        ...prev,
        currentPlayerIndex: nextIndex,
        drawCount: 0,
        players: prev.players.map((p, i) => ({
          ...p,
          isActive: i === nextIndex && !p.hasPassed,
        })),
      };
    });
  };

  const addPoints = (points: number, bonus: number = 0, description?: string) => {
    const total = points + bonus;
    const previousTotal = currentPlayer.totalPoints;
    const newTotal = previousTotal + total;
    updatePlayer(currentPlayer.id, {
      currentPoints: currentPlayer.currentPoints + total,
      totalPoints: newTotal,
      isActive: false,
    });
    const desc = description || (bonus > 0 
      ? `Punkty: ${points} pkt + bonus: ${bonus} pkt`
      : `Punkty: ${points} pkt`);
    addHistoryEntry(currentPlayer.id, 'add', total, desc, previousTotal, newTotal);
    setManualPointsInput('');
    setBonusType(null);
    nextPlayer();
  };

  const handleTileSelect = (tile: Tile) => {
    const sum = tile[0] + tile[1] + tile[2];
    const isTriple = tile[0] === tile[1] && tile[1] === tile[2];
    const isZeroTriple = isTriple && tile[0] === 0;
    const isFirstMove = currentPlayer.currentPoints === 0;
    
    let startBonus = 0;
    let startBonusDesc = '';
    
    if (isFirstMove && isTriple) {
      if (isZeroTriple && gameState.rules.zeroStartBonus) {
        startBonus = 30;
        startBonusDesc = ' + bonus za 0-0-0 na start (+30 pkt)';
      } else if (gameState.rules.tripleStartBonus) {
        startBonus = 10;
        startBonusDesc = ' + bonus za potrójne na start (+10 pkt)';
      }
    }
    
    if (bonusType) {
      const bonusMap = {
        bridge: gameState.rules.bridgeBonus,
        hexagon: gameState.rules.hexagonBonus,
        doubleHexagon: gameState.rules.doubleHexagonBonus,
        tripleHexagon: gameState.rules.tripleHexagonBonus,
      };
      const bonusNames = {
        bridge: 'Most',
        hexagon: 'Heksagon',
        doubleHexagon: 'Podwójny Heksagon',
        tripleHexagon: 'Potrójny Heksagon',
      };
      const totalBonus = bonusMap[bonusType] + startBonus;
      const bonusDesc = startBonus > 0 
        ? ` + ${bonusNames[bonusType]} (+${bonusMap[bonusType]} pkt)${startBonusDesc}`
        : ` + ${bonusNames[bonusType]} (+${bonusMap[bonusType]} pkt)`;
      addPoints(sum, totalBonus, `Klocek [${tile[0]},${tile[1]},${tile[2]}] (${sum} pkt)${bonusDesc}`);
    } else {
      const desc = startBonus > 0
        ? `Klocek [${tile[0]},${tile[1]},${tile[2]}] (${sum} pkt)${startBonusDesc}`
        : `Klocek [${tile[0]},${tile[1]},${tile[2]}] (${sum} pkt)`;
      addPoints(sum, startBonus, desc);
    }
  };

  const handleManualPoints = () => {
    const points = parseInt(manualPointsInput);
    if (isNaN(points)) return;
    if (bonusType) {
      const bonusMap = {
        bridge: gameState.rules.bridgeBonus,
        hexagon: gameState.rules.hexagonBonus,
        doubleHexagon: gameState.rules.doubleHexagonBonus,
        tripleHexagon: gameState.rules.tripleHexagonBonus,
      };
      const bonusNames = {
        bridge: 'Most',
        hexagon: 'Heksagon',
        doubleHexagon: 'Podwójny Heksagon',
        tripleHexagon: 'Potrójny Heksagon',
      };
      addPoints(points, bonusMap[bonusType], `Punkty ręczne (${points} pkt) + ${bonusNames[bonusType]} (+${bonusMap[bonusType]} pkt)`);
    } else {
      addPoints(points, 0, `Punkty ręczne (${points} pkt)`);
    }
  };

  const handleMinus = () => {
    const previousTotal = currentPlayer.totalPoints;
    setGameState((prev) => {
      const newDrawCount = prev.drawCount + 1;
      let penalty = 0;
      if (newDrawCount <= prev.rules.maxDraws) {
        penalty = prev.rules.drawPenalty;
      } else {
        penalty = prev.rules.finalDrawPenalty;
      }
      
      const updatedPlayers = prev.players.map((p) =>
        p.id === currentPlayer.id
          ? {
              ...p,
              currentPoints: p.currentPoints - penalty,
              totalPoints: p.totalPoints - penalty,
              isActive: newDrawCount <= prev.rules.maxDraws,
            }
          : p
      );
      
      const shouldEndTurn = newDrawCount > prev.rules.maxDraws;
      const nextIndex = shouldEndTurn
        ? (prev.currentPlayerIndex + 1) % prev.players.length
        : prev.currentPlayerIndex;
      
      const newTotal = previousTotal - penalty;
      const description = newDrawCount > prev.rules.maxDraws
        ? `Kara za przekroczenie limitu dobierań: -${penalty} pkt`
        : `Kara za dobranie (${newDrawCount}/${prev.rules.maxDraws}): -${penalty} pkt`;
      
      addHistoryEntry(currentPlayer.id, 'penalty', penalty, description, previousTotal, newTotal);
      
      return {
        ...prev,
        drawCount: shouldEndTurn ? 0 : newDrawCount,
        currentPlayerIndex: nextIndex,
        players: shouldEndTurn
          ? updatedPlayers.map((p, i) => ({
              ...p,
              isActive: i === nextIndex && !p.hasPassed,
            }))
          : updatedPlayers,
      };
    });
  };

  const handlePass = () => {
    updatePlayer(currentPlayer.id, { hasPassed: true, isActive: false });
    setGameState((prev) => {
      const updatedPlayers = prev.players.map((p) =>
        p.id === currentPlayer.id ? { ...p, hasPassed: true, isActive: false } : p
      );
      const allPassedNow = updatedPlayers.every((p) => p.hasPassed);
      if (allPassedNow) {
        const inputs: Record<string, number> = {};
        updatedPlayers.forEach((player) => {
          inputs[player.id] = 0;
        });
        setRoundEndInputs(inputs);
        setShowRoundEndInputs(true);
        return { ...prev, players: updatedPlayers };
      } else {
        const nextIndex = (prev.currentPlayerIndex + 1) % prev.players.length;
        return {
          ...prev,
          players: updatedPlayers.map((p, i) => ({
            ...p,
            isActive: i === nextIndex && !p.hasPassed,
          })),
          currentPlayerIndex: nextIndex,
          drawCount: 0,
        };
      }
    });
  };

  const handleVictory = () => {
    setShowVictoryInputs(true);
    const inputs: Record<string, number> = {};
    gameState.players.forEach((p) => {
      if (p.id !== currentPlayer.id) {
        inputs[p.id] = 0;
      }
    });
    setVictoryInputs(inputs);
  };

  const confirmVictory = () => {
    const otherPlayersPoints = Object.values(victoryInputs).reduce(
      (sum, val) => sum + val,
      0
    );
    const victoryPoints =
      gameState.rules.winBonus + otherPlayersPoints;
    const previousTotal = currentPlayer.totalPoints;
    const newTotal = previousTotal + victoryPoints;
    updatePlayer(currentPlayer.id, {
      currentPoints: currentPlayer.currentPoints + victoryPoints,
      totalPoints: newTotal,
    });
    addHistoryEntry(
      currentPlayer.id,
      'victory',
      victoryPoints,
      `Zwycięstwo: +${gameState.rules.winBonus} pkt + ${otherPlayersPoints} pkt od przeciwników`,
      previousTotal,
      newTotal
    );
    setShowVictoryInputs(false);
    setVictoryInputs({});
    setGameState((prev) => ({
      ...prev,
      isRoundActive: false,
      showRoundSummary: true,
    }));
  };


  const confirmRoundEnd = () => {
    Object.entries(roundEndInputs).forEach(([playerId, points]) => {
      if (points > 0) {
        const player = gameState.players.find((p) => p.id === playerId)!;
        const previousTotal = player.totalPoints;
        const newTotal = previousTotal - points;
        updatePlayer(playerId, {
          currentPoints: player.currentPoints - points,
          totalPoints: newTotal,
        });
        addHistoryEntry(
          playerId,
          'round_end',
          points,
          `Zakończenie rundy - punkty z kamieni: -${points} pkt`,
          previousTotal,
          newTotal
        );
      }
    });
    setShowRoundEndInputs(false);
    setRoundEndInputs({});
    setGameState((prev) => ({
      ...prev,
      showRoundSummary: true,
      isRoundActive: false,
    }));
  };

  const startNewRound = () => {
    setGameState((prev) => ({
      ...prev,
      roundNumber: prev.roundNumber + 1,
      currentPlayerIndex: 0,
      drawCount: 0,
      isRoundActive: true,
      showRoundSummary: false,
      players: prev.players.map((p) => ({
        ...p,
        currentPoints: 0,
        hasPassed: false,
        isActive: p.id === prev.players[0].id,
      })),
    }));
  };

  const editPlayerPoints = (playerId: string) => {
    const player = gameState.players.find((p) => p.id === playerId);
    if (!player) return;
    const newPoints = prompt(
      `Edytuj punkty dla ${player.name} (obecne: ${player.totalPoints}):`
    );
    if (newPoints !== null) {
      const points = parseInt(newPoints);
      if (!isNaN(points)) {
        const previousTotal = player.totalPoints;
        const difference = points - previousTotal;
        updatePlayer(playerId, { totalPoints: points });
        addHistoryEntry(
          playerId,
          'manual_edit',
          Math.abs(difference),
          `Edycja manualna: ${previousTotal} → ${points} pkt`,
          previousTotal,
          points
        );
      }
    }
  };

  const switchToPlayer = (playerId: string) => {
    const playerIndex = gameState.players.findIndex((p) => p.id === playerId);
    if (playerIndex === -1) return;
    setGameState((prev) => ({
      ...prev,
      currentPlayerIndex: playerIndex,
      drawCount: 0,
      players: prev.players.map((p, i) => ({
        ...p,
        isActive: i === playerIndex && !p.hasPassed,
      })),
    }));
  };

  const endPlayerTurn = (playerId: string) => {
    const playerIndex = gameState.players.findIndex((p) => p.id === playerId);
    if (playerIndex === -1) return;
    const nextIndex = (playerIndex + 1) % gameState.players.length;
    setGameState((prev) => ({
      ...prev,
      currentPlayerIndex: nextIndex,
      drawCount: 0,
      players: prev.players.map((p, i) => ({
        ...p,
        isActive: i === nextIndex && !p.hasPassed,
      })),
    }));
  };

  const updateWinLimit = () => {
    const newLimit = prompt(
      `Nowy limit zwycięstwa (obecny: ${gameState.rules.winLimit}):`
    );
    if (newLimit !== null) {
      const limit = parseInt(newLimit);
      if (!isNaN(limit) && limit >= 100) {
        setGameState((prev) => ({
          ...prev,
          rules: { ...prev.rules, winLimit: limit },
        }));
      }
    }
  };

  if (gameState.showRoundSummary) {
    return <RoundSummary players={gameState.players} onNextRound={startNewRound} />;
  }

  if (showVictoryInputs) {
    return (
      <div className="modal-overlay">
        <div className="modal-content victory-inputs">
          <h2>Zwycięstwo - {currentPlayer.name}</h2>
          <div className="victory-inputs-list">
            {gameState.players
              .filter((p) => p.id !== currentPlayer.id)
              .map((player) => (
                <div key={player.id} className="victory-input-item">
                  <label>{player.name}:</label>
                  <input
                    type="number"
                    value={victoryInputs[player.id] || 0}
                    onChange={(e) =>
                      setVictoryInputs({
                        ...victoryInputs,
                        [player.id]: parseInt(e.target.value) || 0,
                      })
                    }
                    min="0"
                  />
                </div>
              ))}
          </div>
          <div className="victory-actions">
            <button className="btn-secondary" onClick={() => setShowVictoryInputs(false)}>
              Anuluj
            </button>
            <button className="btn-primary" onClick={confirmVictory}>
              Potwierdź Zwycięstwo
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showRoundEndInputs) {
    return (
      <div className="modal-overlay">
        <div className="modal-content victory-inputs">
          <h2>Wszyscy Gracze Spasowali - Punkty do Odjęcia</h2>
          <div className="victory-inputs-list">
            {gameState.players.map((player) => (
              <div key={player.id} className="victory-input-item">
                <label>{player.name}:</label>
                <input
                  type="number"
                  value={roundEndInputs[player.id] || 0}
                  onChange={(e) =>
                    setRoundEndInputs({
                      ...roundEndInputs,
                      [player.id]: parseInt(e.target.value) || 0,
                    })
                  }
                  min="0"
                />
              </div>
            ))}
          </div>
          <div className="victory-actions">
            <button
              className="btn-secondary"
              onClick={() => {
                setGameState((prev) => {
                  const nextIndex = (prev.currentPlayerIndex + 1) % prev.players.length;
                  return {
                    ...prev,
                    players: prev.players.map((p, i) => ({
                      ...p,
                      hasPassed: false,
                      isActive: i === nextIndex,
                    })),
                    currentPlayerIndex: nextIndex,
                    drawCount: 0,
                  };
                });
                setShowRoundEndInputs(false);
                setRoundEndInputs({});
              }}
            >
              Okrążenie Pass
            </button>
            <button className="btn-primary" onClick={confirmRoundEnd}>
              Zatwierdź
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-view">
      <div className="game-header">
        <h1>Triominos - Runda {gameState.roundNumber}</h1>
        <div className="game-header-actions">
          <button className="btn-icon btn-new-game" onClick={onNewGame}>
            Nowa Gra
          </button>
          <button className="btn-icon" onClick={() => setShowInfo(true)}>
            (i)
          </button>
        </div>
      </div>

      {gameState.players.some((p) => p.totalPoints >= gameState.rules.winLimit) && (
        <div className="win-limit-warning">
          Ktoś osiągnął {gameState.rules.winLimit} punktów!
          <button className="btn-small" onClick={updateWinLimit}>
            Zmień Limit
          </button>
        </div>
      )}

      <div className="players-row">
        {gameState.players.map((player) => (
          <div
            key={player.id}
            className={`player-column ${player.isActive ? 'active' : ''} ${
              player.hasPassed ? 'passed' : ''
            }`}
          >
            <div className="player-header">
              <div className="player-name">{player.name}</div>
              <div className="player-actions">
                <button
                  className="btn-history"
                  onClick={() => setShowHistory(player.id)}
                  title="Historia"
                >
                  📜
                </button>
                <button
                  className="btn-switch"
                  onClick={() => switchToPlayer(player.id)}
                  title="Przejdź na gracza"
                >
                  👆
                </button>
                <button
                  className="btn-end-turn"
                  onClick={() => endPlayerTurn(player.id)}
                  title="Pełna tura"
                >
                  ⏭️
                </button>
                <button
                  className="btn-edit"
                  onClick={() => editPlayerPoints(player.id)}
                  title="Edytuj punkty"
                >
                  ✎
                </button>
              </div>
            </div>
            <div className="player-points">
              <div className="points-current">{player.currentPoints}</div>
              <div className="points-total">{player.totalPoints}</div>
            </div>
            {player.isActive && <div className="player-turn-indicator">TURA</div>}
            {player.hasPassed && <div className="player-pass-indicator">PASS</div>}
          </div>
        ))}
      </div>

      <div className="quick-actions">
        <button
          className="btn-action"
          onClick={() => {
            setShowTileSelector(true);
          }}
        >
          Wybór Klocka
        </button>
        <button
          className="btn-action"
          onClick={() => {
            setBonusType('bridge');
          }}
        >
          Most (+{gameState.rules.bridgeBonus})
        </button>
        <button
          className="btn-action"
          onClick={() => {
            setBonusType('hexagon');
          }}
        >
          Heksagon (+{gameState.rules.hexagonBonus})
        </button>
        <button
          className="btn-action"
          onClick={() => {
            setBonusType('doubleHexagon');
          }}
        >
          Podwójny (+{gameState.rules.doubleHexagonBonus})
        </button>
        <button
          className="btn-action"
          onClick={() => {
            setBonusType('tripleHexagon');
          }}
        >
          Potrójny (+{gameState.rules.tripleHexagonBonus})
        </button>
        <button className="btn-action" onClick={handleMinus}>
          Minus ({gameState.drawCount}/{gameState.rules.maxDraws})
        </button>
        <button
          className="btn-action"
          onClick={handlePass}
          disabled={currentPlayer.hasPassed}
        >
          Pass
        </button>
        <button
          className="btn-action btn-victory"
          onClick={handleVictory}
          disabled={!currentPlayer.isActive}
        >
          Zwycięstwo
        </button>
      </div>

      <div className="manual-input-section">
        <input
          type="number"
          placeholder="Wpisz punkty ręcznie"
          value={manualPointsInput}
          onChange={(e) => setManualPointsInput(e.target.value)}
          className="manual-input"
        />
        {bonusType && (
          <div className="bonus-indicator">
            Bonus: {bonusType === 'bridge' && `Most (+${gameState.rules.bridgeBonus})`}
            {bonusType === 'hexagon' && `Heksagon (+${gameState.rules.hexagonBonus})`}
            {bonusType === 'doubleHexagon' && `Podwójny (+${gameState.rules.doubleHexagonBonus})`}
            {bonusType === 'tripleHexagon' && `Potrójny (+${gameState.rules.tripleHexagonBonus})`}
            <button
              className="btn-clear-bonus"
              onClick={() => setBonusType(null)}
            >
              ×
            </button>
          </div>
        )}
        <button
          className="btn-action"
          onClick={() => {
            if (manualPointsInput) {
              handleManualPoints();
            }
          }}
          disabled={!manualPointsInput}
        >
          {bonusType && manualPointsInput
            ? 'Dodaj Punkty z Bonusem'
            : 'Dodaj Punkty'}
        </button>
      </div>


      {showTileSelector && (
        <TileSelector
          onSelect={handleTileSelect}
          onClose={() => {
            setShowTileSelector(false);
          }}
        />
      )}

      {showInfo && (
        <InfoModal
          rules={gameState.rules}
          onClose={() => setShowInfo(false)}
        />
      )}

      {showHistory && (
        <HistoryModal
          player={gameState.players.find((p) => p.id === showHistory)!}
          history={history}
          onClose={() => setShowHistory(null)}
        />
      )}
    </div>
  );
}

