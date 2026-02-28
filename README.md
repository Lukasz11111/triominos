# Triominos - Kalkulator Punktów

Aplikacja React do liczenia punktów w grze Triominos. Gotowa do hostowania na GitHub Pages.

## Funkcjonalności

- Wybór zasad gry (checkboxy)
- Konfiguracja liczby graczy (2-6)
- Ustawienie kolejności graczy
- System wyboru klocków z filtrowaniem
- Szybkie przyciski dla bonusów (Most, Heksagon, itp.)
- Śledzenie punktów graczy
- Podsumowanie rund
- Responsywny design (telefony, tablety, komputery)

## Instalacja

```bash
npm install
```

## Uruchomienie lokalne

```bash
npm run dev
```

## Build dla produkcji

```bash
npm run build
```

## Deploy na GitHub Pages

### Krok 1: Przygotowanie repozytorium

1. Utwórz nowe repozytorium na GitHub (np. `Triominos`)

2. Zaktualizuj `base` w `vite.config.ts` na nazwę Twojego repozytorium:
   ```typescript
   base: '/nazwa-twojego-repo/',
   ```
   Jeśli repozytorium nazywa się `Triominos`, zostaw jak jest (`/Triominos/`)

3. Zainicjalizuj git i dodaj pliki:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/TWOJA-NAZWA/Triominos.git
   git push -u origin main
   ```

### Krok 2: Włącz GitHub Pages

1. Przejdź do repozytorium na GitHub
2. Kliknij **Settings** → **Pages**
3. W sekcji **Source** wybierz:
   - **Source**: `GitHub Actions`
4. Zapisz zmiany

### Krok 3: Automatyczny deploy

Po każdym pushu do brancha `main`, GitHub Actions automatycznie:
- Zbuduje aplikację
- Wdroży ją na GitHub Pages

Aplikacja będzie dostępna pod adresem:
`https://TWOJA-NAZWA.github.io/Triominos/`

### Ręczny deploy (opcjonalnie)

Jeśli chcesz zbudować ręcznie:
```bash
npm run build
```
Następnie skopiuj zawartość folderu `dist` do brancha `gh-pages`.

## Technologie

- React 19
- TypeScript
- Vite
- React Router (HashRouter dla GitHub Pages)

## Licencja

MIT
