import { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { RulesSelection } from './components/RulesSelection';
import { PlayersSetup } from './components/PlayersSetup';
import { GameView } from './components/GameView';
import type { GameState, GameRules, Player } from './types/game';
import { loadGameState, saveGameState } from './utils/gameStorage';
import './App.css';

function App() {
  const loadedState = loadGameState();
  const [gameState, setGameState] = useState<GameState | null>(loadedState);
  const [playerCount, setPlayerCount] = useState<number>(
    loadedState?.players.length || 2
  );

  useEffect(() => {
    if (gameState) {
      saveGameState(gameState);
    }
  }, [gameState]);

  const handleRulesConfirm = (rules: GameRules, playerCount: number) => {
    setPlayerCount(playerCount);
    const newState: GameState = {
      rules,
      players: [],
      currentPlayerIndex: 0,
      roundNumber: 1,
      drawCount: 0,
      isRoundActive: true,
      showTileSelector: false,
      showVictoryInputs: false,
      showRoundSummary: false,
    };
    setGameState(newState);
    saveGameState(newState);
  };

  const handlePlayersConfirm = (players: Player[]) => {
    if (gameState) {
      const playersWithActive = players.map((p, i) => ({
        ...p,
        isActive: i === 0,
      }));
      const newState: GameState = {
        ...gameState,
        players: playersWithActive,
      };
      setGameState(newState);
      saveGameState(newState);
    }
  };

  const handleNewGame = () => {
    if (window.confirm('Czy na pewno chcesz rozpocząć nową grę? Obecna gra zostanie utracona.')) {
      saveGameState(null);
      localStorage.removeItem('triominos-history');
      setGameState(null);
    }
  };

  return (
    <HashRouter>
      <div className="app">
        <Routes>
          <Route
            path="/"
            element={
              !gameState ? (
                <RulesSelection onConfirm={handleRulesConfirm} />
              ) : gameState.players.length === 0 ? (
                <PlayersSetup
                  playerCount={playerCount}
                  onConfirm={handlePlayersConfirm}
                />
              ) : (
                <GameView
                  initialState={gameState}
                  onBack={() => setGameState(null)}
                  onNewGame={handleNewGame}
                />
              )
            }
          />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
