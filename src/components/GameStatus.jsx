import {
  getFeedback,
  getRoundStatus,
  getWordDescription,
} from "../game/rules.js";

export default function GameStatus({ round }) {
  const { result, remainingGuesses } = getRoundStatus(round);
  return (
    <div
      className={`status-message status-${result}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <p>{getFeedback(round)}</p>
      <span className="sr-only">
        {result === "playing"
          ? `${remainingGuesses} wrong ${remainingGuesses === 1 ? "guess" : "guesses"} remaining. `
          : ""}
        {getWordDescription(round)}
      </span>
    </div>
  );
}
