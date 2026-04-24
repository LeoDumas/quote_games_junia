import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Button from "../ButtonAssets/Button";
import HistoryBoard from "../HistoryBoard/HistoryBoard";
import QuoteBox from "../QuoteBox/QuoteBox";
import {
  loadLeaderboard,
  pushLeaderboardScore,
} from "../../resources/leaderboard/leaderboard";
import { detectLanguage, fetchRandomQuote } from "../../utils/quoteApi";
import people from "../../resources/data/people.json";
import "./TypeGame.css";

const ROUND_TIME = 20;
const ALL_NAMES = Array.isArray(people?.names) ? people.names : [];
const MAX_SUGGESTIONS = 8;

function normalizeStr(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function highlightMatch(name, query) {
  const trimmed = query.trim();
  if (!trimmed) return name;
  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = name.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? <mark key={i}>{part}</mark> : part
      )}
    </>
  );
}

function TypeGame() {
  const language = useMemo(() => detectLanguage(), []);
  const leaderboardEntries = useMemo(() => loadLeaderboard(), []);

  const [quote, setQuote] = useState("Loading quote...");
  const [correctAnswer, setCorrectAnswer] = useState("Unknown");
  const [historyEntries, setHistoryEntries] = useState(leaderboardEntries);
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [submittedAnswer, setSubmittedAnswer] = useState(null);
  const [roundFeedback, setRoundFeedback] = useState("idle");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [lastGain, setLastGain] = useState(0);
  const [isLoadingRound, setIsLoadingRound] = useState(true);
  const [roundError, setRoundError] = useState("");
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);

  const answerLockedRef = useRef(false);
  const inputRef = useRef(null);

  const scoreRef = useRef(score);
  useEffect(() => { scoreRef.current = score; }, [score]);

  const streakRef = useRef(streak);
  useEffect(() => { streakRef.current = streak; }, [streak]);

  const loadRound = useCallback(async () => {
    answerLockedRef.current = false;
    setIsLoadingRound(true);
    setRoundError("");
    setInputValue("");
    setSuggestions([]);
    setActiveSuggestion(-1);
    setSubmittedAnswer(null);
    setRoundFeedback("idle");
    setLastGain(0);
    try {
      const { quote: q, author } = await fetchRandomQuote(language);
      setQuote(q);
      setCorrectAnswer(author || "Unknown");
    } catch {
      setQuote("No quote available");
      setCorrectAnswer("Unknown");
      setRoundError("Could not load quote. Please try again.");
    } finally {
      setIsLoadingRound(false);
    }
  }, [language]);

  useEffect(() => {
    void loadRound();
  }, [loadRound]);

  // Countdown timer resets on each new round
  useEffect(() => {
    if (isLoadingRound || submittedAnswer !== null) return;
    setTimeLeft(ROUND_TIME);
    const id = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [isLoadingRound, quote, submittedAnswer]);

  // Auto-focus input on each new round
  useEffect(() => {
    if (!isLoadingRound && submittedAnswer === null) {
      inputRef.current?.focus();
    }
  }, [isLoadingRound, submittedAnswer]);

  const saveScore = useCallback(() => {
    if (scoreRef.current > 0) {
      setHistoryEntries(
        pushLeaderboardScore({ name: "Player", score: scoreRef.current })
      );
    }
  }, []);

  const handleSubmitAnswer = useCallback(
    (answer) => {
      if (answerLockedRef.current || submittedAnswer !== null || isLoadingRound) return;
      answerLockedRef.current = true;
      setSuggestions([]);
      setInputValue(answer);
      setSubmittedAnswer(answer);

      if (normalizeStr(answer.trim()) === normalizeStr(correctAnswer.trim())) {
        setRoundFeedback("correct");
        const currentStreak = streakRef.current;
        const newStreak = currentStreak + 1;
        const gained = 100 + currentStreak * 25;
        setLastGain(gained);
        setScore((s) => s + gained);
        setStreak(newStreak);
        setBestStreak((b) => Math.max(b, newStreak));
      } else {
        setRoundFeedback("wrong");
        setLastGain(0);
        setStreak(0);
        saveScore();
      }
    },
    [submittedAnswer, isLoadingRound, correctAnswer, saveScore]
  );

  // Auto-wrong when timer hits 0
  useEffect(() => {
    if (timeLeft === 0 && submittedAnswer === null && !isLoadingRound) {
      if (answerLockedRef.current) return;
      answerLockedRef.current = true;
      setSubmittedAnswer("__timeout__");
      setRoundFeedback("wrong");
      setLastGain(0);
      setStreak(0);
      saveScore();
    }
  }, [timeLeft, submittedAnswer, isLoadingRound, saveScore]);

  const handleNextRound = useCallback(async () => {
    if (roundFeedback === "wrong") {
      setScore(0);
      setStreak(0);
    }
    setTimeLeft(ROUND_TIME);
    await loadRound();
  }, [roundFeedback, loadRound]);

  // Enter/Space to advance after answer (when focus is outside the input)
  useEffect(() => {
    const onKey = (e) => {
      if (e.target instanceof HTMLInputElement) return;
      if ((e.key === "Enter" || e.key === " ") && submittedAnswer !== null) {
        e.preventDefault();
        void handleNextRound();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [submittedAnswer, handleNextRound]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    setActiveSuggestion(-1);
    if (val.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    const normalized = normalizeStr(val.trim());
    const filtered = ALL_NAMES.filter((name) =>
      normalizeStr(name).includes(normalized)
    ).slice(0, MAX_SUGGESTIONS);
    setSuggestions(filtered);
  };

  const handleKeyDown = (e) => {
    if (suggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveSuggestion((i) => Math.min(i + 1, suggestions.length - 1));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveSuggestion((i) => Math.max(i - 1, -1));
        return;
      }
      if (e.key === "Escape") {
        setSuggestions([]);
        setActiveSuggestion(-1);
        return;
      }
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (activeSuggestion >= 0 && activeSuggestion < suggestions.length) {
        handleSubmitAnswer(suggestions[activeSuggestion]);
      } else if (inputValue.trim()) {
        handleSubmitAnswer(inputValue.trim());
      }
    }
  };

  const timerPct = (timeLeft / ROUND_TIME) * 100;
  const isTimeout = submittedAnswer === "__timeout__";
  const isCorrect = roundFeedback === "correct";
  const isWrong = roundFeedback === "wrong";

  const inputStateClass = isCorrect
    ? "tg_input--correct"
    : isWrong
    ? "tg_input--wrong"
    : "";

  return (
    <main className="tg_container">
      <section className="tg_content">
        <section className="tg_hud" aria-label="Current score and streak">
          <p>Score: {score}</p>
          <p>Streak: {streak}</p>
          <p>Best: {bestStreak}</p>
        </section>

        <div
          className={`tg_timer_bar${timeLeft <= 5 ? " tg_timer_bar--urgent" : ""}${
            submittedAnswer !== null || isLoadingRound ? " tg_timer_bar--hidden" : ""
          }`}
          style={{ "--pct": `${timerPct}%` }}
          role="progressbar"
          aria-valuenow={timeLeft}
          aria-valuemin={0}
          aria-valuemax={ROUND_TIME}
          aria-label={`${timeLeft} seconds remaining`}
        />

        <div className={`tg_quote_wrap tg_quote_wrap--${roundFeedback}`}>
          <QuoteBox text={quote} />
        </div>

        {roundError && (
          <p className="tg_feedback tg_feedback--bad">{roundError}</p>
        )}

        <section className="tg_input_section" aria-label="Type the author's name">
          <div className="tg_input_wrap">
            <input
              ref={inputRef}
              type="text"
              className={`tg_input ${inputStateClass}`.trim()}
              placeholder={isLoadingRound ? "Loading…" : "Type the author's name…"}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onBlur={() => setTimeout(() => setSuggestions([]), 120)}
              disabled={submittedAnswer !== null || isLoadingRound}
              aria-label="Author name"
              aria-autocomplete="list"
              aria-expanded={suggestions.length > 0}
              autoComplete="off"
              spellCheck="false"
            />
            {suggestions.length > 0 && submittedAnswer === null && (
              <ul
                className="tg_suggestions"
                role="listbox"
                aria-label="Author suggestions"
              >
                {suggestions.map((name, i) => (
                  <li
                    key={name}
                    role="option"
                    aria-selected={i === activeSuggestion}
                    className={`tg_suggestion_item${
                      i === activeSuggestion ? " tg_suggestion_item--active" : ""
                    }`}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSubmitAnswer(name);
                    }}
                    onMouseEnter={() => setActiveSuggestion(i)}
                  >
                    {highlightMatch(name, inputValue)}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {submittedAnswer === null && !isLoadingRound && (
            <Button
              className="tg_submit_button"
              variant="blue"
              disabled={!inputValue.trim()}
              onClick={() => handleSubmitAnswer(inputValue.trim())}
            >
              Submit
            </Button>
          )}
        </section>

        {isCorrect && (
          <p className="tg_feedback tg_feedback--good">
            Correct! +{lastGain}
          </p>
        )}
        {isTimeout && (
          <p className="tg_feedback tg_feedback--bad">
            Time&apos;s up! It was <strong>{correctAnswer}</strong>. Score saved.
          </p>
        )}
        {isWrong && !isTimeout && (
          <p className="tg_feedback tg_feedback--bad">
            Wrong! It was <strong>{correctAnswer}</strong>. Score saved.
          </p>
        )}

        {submittedAnswer !== null && (
          <Button
            className="tg_next_button"
            variant="blue"
            onClick={handleNextRound}
          >
            Next quote
            <span className="tg_next_enter" aria-hidden="true">&#8629;</span>
          </Button>
        )}
      </section>

      <HistoryBoard entries={historyEntries} />
    </main>
  );
}

export default TypeGame;
