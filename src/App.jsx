import { useEffect, useRef, useState } from "react";
import GameStatus from "./components/GameStatus.jsx";
import Keyboard from "./components/Keyboard.jsx";
import Letter from "./components/Letter.jsx";
import ProgrammingLanguage from "./components/ProgrammingLanguage.jsx";
import { LANGUAGES } from "./game/data.js";
import {
  chooseWord,
  createRound,
  getRoundStatus,
  getWordDescription,
  guessLetter,
} from "./game/rules.js";
import "./App.css";

export default function App() {
  const [round, setRound] = useState(() => createRound(chooseWord()));
  const keyboardRef = useRef(null);
  const newGameRef = useRef(null);
  const restartFocus = useRef(false);
  const { wrongGuesses, remainingGuesses, result } = getRoundStatus(round);
  const isOver = result !== "playing";

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.ctrlKey || event.metaKey || event.altKey || event.repeat)
        return;
      if (
        event.target.closest(
          "input, textarea, select, [contenteditable='true']",
        )
      )
        return;
      if (!/^[a-z]$/i.test(event.key)) return;
      event.preventDefault();
      setRound((current) => guessLetter(current, event.key));
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOver) {
      newGameRef.current?.focus();
    } else if (
      restartFocus.current ||
      keyboardRef.current?.contains(document.activeElement)
    ) {
      keyboardRef.current?.querySelector("button:not(:disabled)")?.focus();
    }
    restartFocus.current = false;
  }, [round, isOver]);

  function startNewGame() {
    restartFocus.current = true;
    setRound(createRound(chooseWord(round.word)));
  }

  return (
    <main className="card-game" aria-labelledby="game-title">
      <header className="game-header">
        <h1 id="game-title">Assembly: Endgame</h1>
        <p>Guess the word before eight wrong guesses let Assembly take over.</p>
      </header>

      <GameStatus round={round} />

      <section className="languages-section" aria-label="Programming languages">
        <p className="lives-count">
          {remainingGuesses} wrong{" "}
          {remainingGuesses === 1 ? "guess" : "guesses"} remaining
        </p>
        <ul className="languages-wrapper">
          {LANGUAGES.map((language, index) => (
            <ProgrammingLanguage
              key={language.name}
              {...language}
              eliminated={index < wrongGuesses.length}
              assemblyWins={language.name === "Assembly" && result === "lost"}
            />
          ))}
        </ul>
      </section>

      <section aria-label="Word to guess" className="word-section">
        <p className="sr-only">{getWordDescription(round)}</p>
        <div
          className="guess-word-wrapper"
          style={{ "--word-length": round.word.length }}
          aria-hidden="true"
        >
          {[...round.word].map((letter, index) => (
            <Letter
              key={`${round.word}-${index}`}
              letter={letter}
              visible={round.guesses.includes(letter) || result === "lost"}
              missed={result === "lost" && !round.guesses.includes(letter)}
            />
          ))}
        </div>
      </section>

      <div ref={keyboardRef}>
        <Keyboard
          word={round.word}
          guesses={round.guesses}
          disabled={isOver}
          onGuess={(letter) =>
            setRound((current) => guessLetter(current, letter))
          }
        />
      </div>

      <footer className="game-footer">
        {isOver ? (
          <button
            type="button"
            className="new-game"
            ref={newGameRef}
            onClick={startNewGame}
          >
            New game
          </button>
        ) : (
          <p>Type a letter, or use the buttons above.</p>
        )}
      </footer>
    </main>
  );
}
