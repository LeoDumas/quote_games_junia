import { useMemo, useState } from "react";
import Button from "../../components/ButtonAssets/Button";
import HistoryBoard from "../../components/HistoryBoard/HistoryBoard";
import QuoteBox from "../../components/QuoteBox/QuoteBox";
import {
  loadLeaderboard,
  pushLeaderboardScore,
} from "../../resources/leaderboard/leaderboard";
import data from "../../resources/data/data.json";
import "./Game.css";

const CORRECT_ANSWER = "Donald Trump";
const DISTRACTOR_NAMES = [
  "JFK",
  "Leon Marchand",
  "P.Diddy",
  "Taylor Swift",
  "Elon Musk",
  "Barack Obama",
  "Napoleon",
  "Albert Einstein",
  "Winston Churchill",
  "Marie Curie",
];

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildRound() {
  const quotes = Array.isArray(data?.quotes) ? data.quotes : [];
  const quote = quotes.length > 0 ? String(quotes[getRandomInt(quotes.length)]) : "No quote available";

  const distractors = shuffle(DISTRACTOR_NAMES).slice(0, 3);
  const options = shuffle([CORRECT_ANSWER, ...distractors]);

  return { quote, options };
}

function Game() {
  const leaderboardEntries = useMemo(() => loadLeaderboard(), []);

  const [round, setRound] = useState(() => buildRound());
  const [historyEntries, setHistoryEntries] = useState(leaderboardEntries);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [roundFeedback, setRoundFeedback] = useState("idle");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [lastGain, setLastGain] = useState(0);

  const handleAnswerClick = (answer) => {
    if (selectedAnswer !== null) {
      return;
    }

    setSelectedAnswer(answer);

    if (answer === CORRECT_ANSWER) {
      setRoundFeedback("correct");

      setStreak((previousStreak) => {
        const nextStreak = previousStreak + 1;
        const gainedPoints = 100 + previousStreak * 25;

        setLastGain(gainedPoints);
        setScore((previousScore) => previousScore + gainedPoints);
        setBestStreak((previousBest) => Math.max(previousBest, nextStreak));

        return nextStreak;
      });

      return;
    }

    setRoundFeedback("wrong");
    setLastGain(0);
    setStreak(0);

    if (score > 0) {
      setHistoryEntries(pushLeaderboardScore({ name: "Player", score }));
    }
  };

  const handleNextRound = () => {
    if (selectedAnswer !== CORRECT_ANSWER) {
      setScore(0);
      setStreak(0);
    }

    setRound(buildRound());
    setSelectedAnswer(null);
    setRoundFeedback("idle");
    setLastGain(0);
  };

  const getVariant = (option) => {
    if (selectedAnswer === null) {
      return "blue";
    }

    if (option === CORRECT_ANSWER) {
      return "green";
    }

    if (option === selectedAnswer) {
      return "red";
    }

    return "blue";
  };

  return (
    <main className="game_container">
      <section className="game_content">
        <section className="game_hud" aria-label="Current score and streak">
          <p>Score: {score}</p>
          <p>Streak: {streak}</p>
          <p>Best: {bestStreak}</p>
        </section>

        <div className={`game_quote_wrap game_quote_wrap--${roundFeedback}`}>
          <QuoteBox text={round.quote} />
        </div>

        <section className="game_answers" aria-label="Answer options">
          {round.options.map((option) => (
            <Button
              key={option}
              className="game_answer_button"
              variant={getVariant(option)}
              txt={option}
              onClick={() => handleAnswerClick(option)}
            />
          ))}
        </section>

        {selectedAnswer === CORRECT_ANSWER && (
          <p className="game_feedback game_feedback--good">Correct! +{lastGain}</p>
        )}

        {selectedAnswer !== null && selectedAnswer !== CORRECT_ANSWER && (
          <p className="game_feedback game_feedback--bad">
            Wrong answer. Score saved to leaderboard.
          </p>
        )}

        {selectedAnswer !== null && (
          <Button
            className="game_next_button"
            variant="blue"
            txt="Next quote"
            onClick={handleNextRound}
          />
        )}
      </section>

      <HistoryBoard entries={historyEntries} />
    </main>
  );
}

export default Game;
