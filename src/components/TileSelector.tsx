import { useState, useMemo } from 'react';
import type { Tile } from '../types/game';
import tilesData from '../data/tiles.json';

interface TileSelectorProps {
  onSelect: (tile: Tile) => void;
  onClose: () => void;
}

export function TileSelector({ onSelect, onClose }: TileSelectorProps) {
  const [filter, setFilter] = useState<string>('');
  const tiles = tilesData as Tile[];

  const filteredTiles = useMemo(() => {
    if (!filter.trim()) return tiles;
    const filterStr = filter.trim();
    let numbers: number[] = [];
    if (filterStr.includes(' ') || filterStr.length > 3) {
      numbers = filterStr
        .split(/\s+/)
        .map((n) => parseInt(n))
        .filter((n) => !isNaN(n));
    } else {
      numbers = filterStr
        .split('')
        .map((n) => parseInt(n))
        .filter((n) => !isNaN(n));
    }
    if (numbers.length === 0) return tiles;
    return tiles.filter((tile) => {
      const tileNumbers = [...tile];
      return numbers.every((num) => tileNumbers.includes(num));
    });
  }, [filter, tiles]);

  const getTileSum = (tile: Tile) => tile[0] + tile[1] + tile[2];

  return (
    <div className="tile-selector-overlay">
      <div className="tile-selector">
        <div className="tile-selector-header">
          <h2>Wybór Klocka</h2>
          <button className="btn-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="tile-filter">
          <input
            type="text"
            placeholder="Wpisz cyfry (np. 000, 123, 0 0 0 lub 1 2)"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="tile-filter-input"
          />
        </div>
        <div className="tiles-grid">
          {filteredTiles.map((tile, index) => (
            <div
              key={index}
              className="tile-item"
              onClick={() => {
                onSelect(tile);
                onClose();
              }}
            >
              <div className="tile-triangle">
                <span className="tile-number tile-top">{tile[0]}</span>
                <span className="tile-number tile-left">{tile[1]}</span>
                <span className="tile-number tile-right">{tile[2]}</span>
              </div>
              <div className="tile-sum">{getTileSum(tile)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

