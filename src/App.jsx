// App.jsx
import "./App.css";
import GameStatus from "./components/GameStatus";
import ProgrammingLanguage from "./components/ProgrammingLanguage";
import Letter from "./components/Letter";
import Keyboard from "./components/Keyboard";
import { useState, useEffect, useRef } from "react";

/* --- Local random word generator (no external dependency) --- */
const WORDS = [
  "banana",
  "react",
  "angular",
  "python",
  "node",
  "frontend",
  "backend",
  "compile",
  "binary",
  "signal",
  "memory",
  "runtime",
  "object",
  "module",
  "service",
  "thread",
  "socket",
  "promise",
  "fetch",
  "array",
  "stack",
];

function getRandomWord(maxLength = 8) {
  const filtered = WORDS.filter((w) => w.length <= maxLength);
  if (filtered.length > 0) {
    const choice = filtered[Math.floor(Math.random() * filtered.length)];
    return choice.toUpperCase();
  }
  // Fallback: generate random uppercase word of random length 3..maxLength
  const len = Math.max(3, Math.floor(Math.random() * (maxLength - 2)) + 3);
  const letters = Array.from({ length: len }, () =>
    String.fromCharCode(65 + Math.floor(Math.random() * 26))
  );
  return letters.join("");
}

/* --- App --- */
function App() {
  function generateKeyboardLetters() {
    const keys = [];
    for (let i = 65; i <= 90; i++) {
      keys.push({
        value: String.fromCharCode(i),
        isWrong: false,
        isCorrect: false,
        isHeld: false,
      });
    }
    return keys;
  }

  function generateRandomWordObject() {
    const word = getRandomWord(8);
    console.log("random word:", word);
    return word.split("").map((char, i) => ({
      character: char,
      isVisible: false,
      id: `${char}-${i}-${Math.random().toString(36).slice(2, 7)}`,
    }));
  }

  const [wordToGuess, setWordToGuess] = useState(() =>
    generateRandomWordObject()
  );

  let nbOfChances = useRef(0);
  let [keys, setKeys] = useState(() => generateKeyboardLetters());
  let keyRefs = useRef([]);

  const keysElements = keys.map((eachKey, index) => (
    <Keyboard
      key={eachKey.value}
      {...eachKey}
      onKeyClick={handleKeyClick}
      ref={(el) => (keyRefs.current[index] = el)}
    />
  ));

  function handleKeyClick(triggeredKey) {
    if (gameResult.isWon || gameResult.isLost) {
      return;
    }
    setKeys((prevKeys) => {
      const newKeys = prevKeys.map((key) => {
        if (key.value !== triggeredKey.value) return key;

        if (triggeredKey.isHeld) return key;

        const isIncluded = wordToGuess.some(
          (letter) => letter.character === triggeredKey.value
        );
        if (isIncluded) {
          setWordToGuess((prevLetters) =>
            prevLetters.map((letter) =>
              letter.character === triggeredKey.value
                ? { ...letter, isVisible: true }
                : letter
            )
          );

          return { ...key, isCorrect: true, isHeld: true };
        } else {
          nbOfChances.current += 1;

          setMessage({
            context: `You Lost ${
              languages[nbOfChances.current]?.language || "game"
            }`,
            bkg: "#a855f7",
          });

          setLanguages((prevLanguages) =>
            prevLanguages.map((lan, index) =>
              index === nbOfChances.current - 1
                ? { ...lan, isEliminated: true }
                : lan
            )
          );

          return { ...key, isWrong: true, isHeld: true };
        }
      });

      return newKeys;
    });
  }

  const [languages, setLanguages] = useState([
    {
      language: "HTML",
      fillColor: "hsla(25, 88%, 47%, 1.00)",
      isEliminated: false,
      textColor: "#fff",
    },
    {
      language: "CSS",
      fillColor: "#328AF1",
      isEliminated: false,
      textColor: "#fff",
    },
    {
      language: "Javascript",
      fillColor: "#F4EB13",
      isEliminated: false,
      textColor: "#000000",
    },
    {
      language: "React",
      fillColor: "#2ED3E9",
      isEliminated: false,
      textColor: "#000000",
    },
    {
      language: "Typescript",
      fillColor: "#298EC6",
      isEliminated: false,
      textColor: "#fff",
    },
    {
      language: "Node.js",
      fillColor: "#599137",
      isEliminated: false,
      textColor: "#fff",
    },
    {
      language: "Python",
      fillColor: "#FFD742",
      isEliminated: false,
      textColor: "#000000",
    },
    {
      language: "Ruby",
      fillColor: "#D02B2B",
      isEliminated: false,
      textColor: "#fff",
    },
    {
      language: "Assembly",
      fillColor: "#2D519F",
      isEliminated: false,
      textColor: "#fff",
    },
  ]);

  const [message, setMessage] = useState({ context: "", bkg: "#fff" });

  const LettersElements = wordToGuess.map((letterToGuess) => {
    return <Letter key={letterToGuess.id} {...letterToGuess} />;
  });

  const [gameResult, setGameResult] = useState({ isLost: false, isWon: false });

  function disableKeyboard() {
    keyRefs.current.forEach((el) => {
      if (el) el.style && (el.style.pointerEvents = "none");
    });
  }

  function startNewGame() {
    setGameResult({ isLost: false, isWon: false });
    setLanguages((oldLanguages) =>
      oldLanguages.map((lan) => ({
        ...lan,
        isEliminated: false,
      }))
    );

    setKeys(() => generateKeyboardLetters());
    setWordToGuess(generateRandomWordObject());
    keyRefs.current.forEach((el) => {
      if (el && el.style) el.style.pointerEvents = "auto";
    });
    setMessage({ context: "", bkg: "#fff" });
    nbOfChances.current = 0;
  }

  const languageElements = languages.map((lanObj, i) => (
    <ProgrammingLanguage key={`${lanObj.language}-${i}`} {...lanObj} />
  ));

  useEffect(() => {
    const isAllLanguagesEliminated = languages.every(
      (lan) => lan.isEliminated === true
    );
    const isWordGuessed = wordToGuess.every((lan) => lan.isVisible === true);
    if (isAllLanguagesEliminated) {
      setGameResult({ isLost: true, isWon: false });
      disableKeyboard();
    }

    if (isWordGuessed && !isAllLanguagesEliminated) {
      setGameResult({ isWon: true, isLost: false });
      setMessage({
        context: "🎉 Congratulations! You Won The Game! 🎉",
        bkg: "#10b981",
      });
      disableKeyboard();
    }
  }, [wordToGuess, languages]);

  return (
    <>
      <div className="card-game">
        <div className="header">
          <h1>Assembly: Endgame</h1>
          <p>
            Guess the word in under 8 attempts to keep the programming world
            safe from Assembly!
          </p>
        </div>
        <GameStatus {...message} />
        <div className="languages-wrapper">{languageElements}</div>
        <div className="guess-word-wrapper">{LettersElements}</div>
        <div className="keyboard-wrapper">{keysElements}</div>
        {(gameResult.isLost || gameResult.isWon) && (
          <button onClick={startNewGame}>New Game</button>
        )}
      </div>
    </>
  );
}

export default App;