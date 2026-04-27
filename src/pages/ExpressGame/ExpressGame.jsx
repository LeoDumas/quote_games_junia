import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Button from "../../components/ButtonAssets/Button";
import GameHud from "../../components/GameUI/GameHud";
import GameTimerBar from "../../components/GameUI/GameTimerBar";
import HistoryBoard from "../../components/HistoryBoard/HistoryBoard";
import QuoteBox from "../../components/QuoteBox/QuoteBox";
import useSyncedRef from "../../hooks/useSyncedRef";
import {
    loadLeaderboard,
    pushLeaderboardScore,
} from "../../resources/leaderboard/leaderboard";
import {
    detectLanguage,
    fetchRandomQuote,
    getRandomAuthorChoices,
} from "../../utils/quoteApi";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import "./ExpressGame.css";

const ROUND_TIME = 15;

function shuffle(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function buildRound(quote, author) {
    const realAuthor = author || "Unknown";
    const fakeChoices = getRandomAuthorChoices(realAuthor, 1);
    const fakeAuthor = (shuffle(fakeChoices)[0]) || realAuthor;
    const isReal = Math.random() < 0.5;
    const shownAuthor = isReal ? realAuthor : fakeAuthor;
    const options = ["Yes", "No"];
    const correctAnswer = isReal ? "Yes" : "No";
    return { quote, shownAuthor, options, correctAnswer, realAuthor };
}

function ExpressGame() {
    const language = useMemo(() => detectLanguage(), []);
    const { user } = useAuth();

    const [round, setRound] = useState(() => buildRound("Loading quote...", "Unknown"));
    const [historyEntries, setHistoryEntries] = useState([]);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [roundFeedback, setRoundFeedback] = useState("idle");
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [bestStreak, setBestStreak] = useState(0);
    const [lastGain, setLastGain] = useState(0);
    const [isLoadingRound, setIsLoadingRound] = useState(true);
    const [roundError, setRoundError] = useState("");
    const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
    const answerLockedRef = useRef(false);

    const scoreRef = useSyncedRef(score);
    const streakRef = useSyncedRef(streak);

    const loadRound = useCallback(async () => {
        answerLockedRef.current = false;
        setIsLoadingRound(true);
        setRoundError("");
        try {
            const { quote, author } = await fetchRandomQuote(language);
            setRound(buildRound(quote, author));
        } catch {
            setRound(buildRound("No quote available", "Unknown"));
            setRoundError("Could not load quote. Please try again.");
        } finally {
            setIsLoadingRound(false);
        }
    }, [language]);

    useEffect(() => {
        void loadRound();
    }, [loadRound]);

    useEffect(() => {
        loadLeaderboard().then(setHistoryEntries);
    }, []);

    useEffect(() => {
        if (isLoadingRound || selectedAnswer !== null) return;

        setTimeLeft(ROUND_TIME);
        const id = setInterval(() => {
            setTimeLeft((prev) => Math.max(0, prev - 1));
        }, 1000);

        return () => clearInterval(id);
    }, [isLoadingRound, round, selectedAnswer]);

    const userRef = useSyncedRef(user);

    const saveScore = useCallback(() => {
        if (scoreRef.current <= 0) return;
        if (userRef.current) {
            const displayName = userRef.current.user_metadata?.username ?? "Player";
            pushLeaderboardScore({ name: displayName, score: scoreRef.current, userId: userRef.current.id, gameType: 'express' })
                .then(setHistoryEntries);
        }
    }, []);

    const handleAnswerClick = useCallback(
        (answer) => {
            if (answerLockedRef.current || selectedAnswer !== null || isLoadingRound) return;

            answerLockedRef.current = true;

            setSelectedAnswer(answer);

            if (answer === round.correctAnswer) {
                setRoundFeedback("correct");
                const currentStreak = streakRef.current;
                const newStreak = currentStreak + 1;
                const gained =  currentStreak === 0 ? 1 : 2 * currentStreak;
                setLastGain(gained);
                setScore((s) => s + gained);
                setStreak(newStreak);
                setBestStreak((b) => Math.max(b, newStreak));
                return;
            }

            setRoundFeedback("wrong");
            setLastGain(0);
            setStreak(0);
            saveScore();
        },
        [selectedAnswer, isLoadingRound, round.correctAnswer, saveScore],
    );

    useEffect(() => {
        if (timeLeft === 0 && selectedAnswer === null && !isLoadingRound) {
            if (answerLockedRef.current) return;
            answerLockedRef.current = true;
            setSelectedAnswer("__timeout__");
            setRoundFeedback("wrong");
            setLastGain(0);
            setStreak(0);
            saveScore();
        }
    }, [timeLeft, selectedAnswer, isLoadingRound, saveScore]);

    const handleNextRound = useCallback(async () => {
        if (selectedAnswer !== round.correctAnswer) {
            setScore(0);
            setStreak(0);
        }
        answerLockedRef.current = false;
        setSelectedAnswer(null);
        setRoundFeedback("idle");
        setLastGain(0);
        setTimeLeft(ROUND_TIME);
        await loadRound();
    }, [selectedAnswer, round.correctAnswer, loadRound]);

    useEffect(() => {
        const onKey = (e) => {
            if (e.target instanceof HTMLButtonElement) return;

            const idx = parseInt(e.key, 10) - 1;
            if (idx >= 0 && idx < round.options.length) {
                handleAnswerClick(round.options[idx]);
                return;
            }

            if ((e.key === "Enter" || e.key === " ") && selectedAnswer !== null) {
                e.preventDefault();
                void handleNextRound();
            }
        };

        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [round.options, selectedAnswer, handleAnswerClick, handleNextRound]);

    const getVariant = (option) => {
        if (selectedAnswer === null) return "blue";
        if (option === round.correctAnswer) return "green";
        if (option === selectedAnswer) return "red";
        return "blue";
    };

    const isTimeout = selectedAnswer === "__timeout__";
    const isCorrect = selectedAnswer === round.correctAnswer;
    const isWrong = selectedAnswer !== null && !isCorrect && !isTimeout;

    return (
        <main className="game_container">
            <section className="game_content">
                <GameHud
                    className="game_hud"
                    score={score}
                    streak={streak}
                    thirdLabel={`Best: ${bestStreak}`}
                />

                <GameTimerBar
                    baseClassName="game_timer_bar"
                    timeLeft={timeLeft}
                    roundTime={ROUND_TIME}
                    isHidden={selectedAnswer !== null || isLoadingRound}
                />

                <div className={`game_quote_wrap game_quote_wrap--${roundFeedback}`}>
                    <QuoteBox text={round.quote} />
                    <h1 className="game_shown_author">Is it from <strong>{round.shownAuthor}</strong>?</h1>
                </div>

                {roundError && (
                    <p className="game_feedback game_feedback--bad">{roundError}</p>
                )}

                <section className="game_answers" aria-label="Answer options">
                    {round.options.map((option, index) => (
                        <Button
                            key={option}
                            className="game_answer_button"
                            variant={getVariant(option)}
                            disabled={isLoadingRound}
                            onClick={() => handleAnswerClick(option)}
                        >
              <span className="game_answer_key" aria-hidden="true">
                {index + 1}
              </span>
                            <span>{option}</span>
                        </Button>
                    ))}
                </section>

                {isCorrect && (
                    <p className="game_feedback game_feedback--good">Correct ! +{lastGain}</p>
                )}
                {isTimeout && (
                    <p className="game_feedback game_feedback--bad">
                        Temps écoulé !{user ? " Score ajouté au classement." : <> <Link to="/login" className="game_login_hint">Connectez-vous</Link> pour sauvegarder.</>}
                    </p>
                )}
                {isWrong && (
                    <p className="game_feedback game_feedback--bad">
                        Mauvaise réponse !{user ? " Score ajouté au classement." : <> <Link to="/login" className="game_login_hint">Connectez-vous</Link> pour sauvegarder.</>}
                    </p>
                )}

                {selectedAnswer !== null && (
                    <Button
                        className="game_next_button"
                        variant="blue"
                        onClick={handleNextRound}
                    >
                        Citation suivante
                        <span className="game_next_enter" aria-hidden="true">↵</span>
                    </Button>
                )}
            </section>

            <HistoryBoard entries={historyEntries} />
        </main>
    );
}

export default ExpressGame;
