import { ALPHABET } from "../game/data.js";

export default function Keyboard({ word, guesses, disabled, onGuess }) {
  return (
    <fieldset className="keyboard">
      <legend>Choose a letter</legend>
      <div className="keyboard-wrapper">
        {ALPHABET.map((letter) => {
          const guessed = guesses.includes(letter);
          const outcome = guessed
            ? word.includes(letter)
              ? "correct"
              : "incorrect"
            : "unused";
          return (
            <button
              key={letter}
              type="button"
              className={`input-key key-${outcome}`}
              disabled={disabled || guessed}
              aria-label={guessed ? `${letter}, ${outcome}` : letter}
              onClick={() => onGuess(letter)}
            >
              {letter}
              {guessed ? (
                <span className="key-outcome" aria-hidden="true">
                  {outcome === "correct" ? "✓" : "×"}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
