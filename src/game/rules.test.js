import assert from "node:assert/strict";
import test from "node:test";
import { LANGUAGES, WORDS } from "./data.js";
import {
  chooseWord,
  createRound,
  getFeedback,
  getRoundStatus,
  getWordDescription,
  guessLetter,
  MAX_WRONG_GUESSES,
} from "./rules.js";

function guessAll(round, letters) {
  return [...letters].reduce(
    (current, letter) => guessLetter(current, letter),
    round,
  );
}

test("new round normalizes the word and starts with eight chances", () => {
  const round = createRound("banana");
  assert.deepEqual(round, { word: "BANANA", guesses: [] });
  assert.deepEqual(getRoundStatus(round), {
    wrongGuesses: [],
    remainingGuesses: 8,
    result: "playing",
  });
  assert.equal(getFeedback(round), "Choose a letter to begin.");
});

test("invalid words are rejected instead of producing unplayable rounds", () => {
  for (const word of [
    null,
    42,
    "",
    "ab",
    "longwordhere",
    "ice cream",
    "node!",
  ]) {
    assert.throws(() => createRound(word), TypeError);
  }
});

test("every word can be played and word selection avoids immediate repeats", () => {
  for (const previous of WORDS) {
    assert.doesNotThrow(() => createRound(previous));
    for (const sample of [0, 0.5, 0.99999]) {
      const next = chooseWord(previous, () => sample);
      assert.ok(WORDS.includes(next));
      assert.notEqual(next, previous);
    }
  }
});

test("a correct letter reveals all matching positions without costing a life", () => {
  const round = guessLetter(createRound("BANANA"), "a");
  assert.deepEqual(round.guesses, ["A"]);
  assert.equal(
    getWordDescription(round),
    "Word: blank, A, blank, A, blank, A.",
  );
  assert.equal(getRoundStatus(round).remainingGuesses, MAX_WRONG_GUESSES);
});

test("wrong-guess feedback names the language that was actually eliminated", () => {
  let round = createRound("REACT");
  for (const [index, letter] of [..."BDFGHIJ"].entries()) {
    round = guessLetter(round, letter);
    assert.equal(getFeedback(round), `${LANGUAGES[index].name} was lost.`);
    assert.equal(getRoundStatus(round).remainingGuesses, 7 - index);
    assert.equal(getRoundStatus(round).result, "playing");
  }
});

test("only distinct misses count; a duplicate is the same state object", () => {
  const round = guessLetter(createRound("REACT"), "B");
  assert.strictEqual(guessLetter(round, "b"), round);
  assert.equal(getRoundStatus(round).wrongGuesses.length, 1);
});

test("non-letter input never changes a round", () => {
  const round = createRound("REACT");
  for (const value of ["Enter", " ", "1", "é", "AB", null, undefined, 1]) {
    assert.strictEqual(guessLetter(round, value), round);
  }
});

test("eight misses lose the round and reveal the complete answer", () => {
  const round = guessAll(createRound("REACT"), "BDFGHIJK");
  assert.equal(getRoundStatus(round).result, "lost");
  assert.equal(getRoundStatus(round).remainingGuesses, 0);
  assert.equal(getFeedback(round), "Assembly wins. The word was REACT.");
  assert.equal(getWordDescription(round), "Word: R, E, A, C, T.");
});

test("a lost round cannot accept either a correct or incorrect guess", () => {
  const round = guessAll(createRound("REACT"), "BDFGHIJK");
  assert.strictEqual(guessLetter(round, "R"), round);
  assert.strictEqual(guessLetter(round, "Z"), round);
});

test("guessing all unique letters wins, even when the word repeats letters", () => {
  const round = guessAll(createRound("BANANA"), "BAN");
  assert.equal(getRoundStatus(round).result, "won");
  assert.equal(getFeedback(round), "You saved the programming world!");
  assert.equal(getWordDescription(round), "Word: B, A, N, A, N, A.");
});

test("a win on the last remaining chance is preserved", () => {
  const round = guessAll(createRound("REACT"), "BDFGHIJREACT");
  assert.equal(getRoundStatus(round).result, "won");
  assert.equal(getRoundStatus(round).remainingGuesses, 1);
});

test("winning locks further guesses and cannot become a loss", () => {
  const round = guessAll(createRound("REACT"), "REACT");
  assert.strictEqual(guessLetter(round, "Z"), round);
  assert.strictEqual(guessLetter(round, "R"), round);
});

test("replaying an updater does not mutate its input or double-count a miss", () => {
  const round = Object.freeze({ word: "REACT", guesses: Object.freeze([]) });
  const first = guessLetter(round, "B");
  const replay = guessLetter(round, "B");
  assert.deepEqual(first, replay);
  assert.equal(first.guesses.length, 1);
  assert.deepEqual(round.guesses, []);
  assert.doesNotThrow(() => getRoundStatus(Object.freeze(first)));
});

test("a new round has no guesses inherited from an ended round", () => {
  const ended = guessAll(createRound("REACT"), "BDFGHIJK");
  const next = createRound(chooseWord(ended.word, () => 0));
  assert.deepEqual(next.guesses, []);
  assert.equal(getRoundStatus(next).result, "playing");
  assert.equal(getRoundStatus(next).remainingGuesses, 8);
});
