# Assembly: Endgame

A word-guessing game built with React and plain CSS. Find the word before eight wrong guesses remove the programming languages and leave Assembly in charge.

## Play

- Choose letters using the on-screen buttons, or type A–Z. Tab, Enter and Space also work.
- A correct guess reveals every matching letter. A wrong guess removes one language, starting with HTML.
- Repeated guesses do not cost another chance. Eight distinct wrong guesses end the round.
- Correct and incorrect keys have separate colors, symbols and accessible labels. Finished rounds reveal the answer and lock the keyboard.
- **New game** selects a different word and returns focus to the letter buttons.

Rounds are held in memory. Refreshing starts a new game; there are no saved scores, accounts, API calls or analytics. Words come from a small local list. This is a browser game, not a multiplayer service.

## Run locally

Use Node.js 24 and npm. No environment variables are required.

```bash
npm ci --ignore-scripts
npm run dev
```

Open the loopback URL printed by Vite. To check and preview a production build:

```bash
npm run lint
npm test
npm run build
npm run preview
```

`dist/` is the static build output. A public demo has not yet been verified; no placeholder deployment link is included.

## Structure

```text
src/
  App.jsx                 Round state, keyboard shortcuts and focus management
  App.css                 Game layout and component styles
  index.css               Shared reset, typography and focus utilities
  components/
    GameStatus.jsx        Persistent live feedback
    Keyboard.jsx          Letter buttons and outcome states
    Letter.jsx            Visible, hidden and missed word cells
    ProgrammingLanguage.jsx
  game/
    data.js               Languages, alphabet and word list
    rules.js              Pure guesses, outcomes and feedback
    rules.test.js         State transition regressions
```

The only round state is its word and guesses. Lives, eliminated languages, letter visibility and the result are derived from it. Rules are independent of React and tested with Node's built-in test runner; no mutable counters, DOM styling changes or duplicated outcome state are needed. StrictMode is enabled in development.

## Accessibility and verification

Native buttons support keyboard navigation, disabled guesses and explicit outcome labels. A persistent polite live region announces guesses and outcomes; the masked word has a text description. Eight-letter words stay on one row, keys have at least 44px targets, and reduced-motion preferences disable game animations.

The 14 automated tests cover input validation, repeated letters, duplicate guesses, each lost-language message, the eight-miss boundary, winning on the last chance, terminal guards, updater replay and restart. GitHub Actions runs clean installation, lint, tests and build with read-only permissions. Browser verification is documented in the associated pull request; automated rule tests do not certify full screen-reader support, physical devices, contrast or performance.

## License

MIT — see [LICENSE](LICENSE). Original copyright attribution is retained.
