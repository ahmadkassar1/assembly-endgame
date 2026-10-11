import { LANGUAGES, WORDS } from "./data.js";

export const MAX_WRONG_GUESSES = LANGUAGES.length - 1;

export function chooseWord(previousWord, random = Math.random) {
  const candidates = WORDS.filter((word) => word !== previousWord);
  return candidates[Math.floor(random() * candidates.length)];
}

export function createRound(word) {
  if (typeof word !== "string" || !/^[a-z]{3,8}$/i.test(word)) {
    throw new TypeError("A round needs a word of three to eight letters.");
  }
  return { word: word.toUpperCase(), guesses: [] };
}

export function getRoundStatus(round) {
  const wrongGuesses = round.guesses.filter(
    (letter) => !round.word.includes(letter),
  );
  const remainingGuesses = MAX_WRONG_GUESSES - wrongGuesses.length;
  const solved = [...round.word].every((letter) =>
    round.guesses.includes(letter),
  );
  const result = remainingGuesses === 0 ? "lost" : solved ? "won" : "playing";
  return { wrongGuesses, remainingGuesses, result };
}

export function guessLetter(round, value) {
  if (typeof value !== "string" || !/^[a-z]$/i.test(value)) return round;
  const letter = value.toUpperCase();
  if (
    getRoundStatus(round).result !== "playing" ||
    round.guesses.includes(letter)
  ) {
    return round;
  }
  return { ...round, guesses: [...round.guesses, letter] };
}

export function getFeedback(round) {
  const { wrongGuesses, result } = getRoundStatus(round);
  if (result === "won") return "You saved the programming world!";
  if (result === "lost") return `Assembly wins. The word was ${round.word}.`;
  const lastGuess = round.guesses.at(-1);
  if (!lastGuess) return "Choose a letter to begin.";
  if (round.word.includes(lastGuess)) return `${lastGuess} is in the word.`;
  return `${LANGUAGES[wrongGuesses.length - 1].name} was lost.`;
}

export function getWordDescription(round) {
  const revealAll = getRoundStatus(round).result === "lost";
  const letters = [...round.word].map((letter) =>
    revealAll || round.guesses.includes(letter) ? letter : "blank",
  );
  return `Word: ${letters.join(", ")}.`;
}
