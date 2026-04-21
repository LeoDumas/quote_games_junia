import { useMemo, useState } from "react";
import Button from "../ButtonAssets/Button";
import "./HistoryBoard.css";

function toScoreText(score) {
  if (typeof score === "number" && Number.isFinite(score)) {
    return score.toLocaleString("fr-FR").replace(/\s/g, "");
  }
  return String(score ?? "-");
}

function HistoryBoard({
  title = "Leaderboard",
  entries = [],
  defaultExpanded = false,
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const normalizedEntries = useMemo(
    () =>
      entries.map((entry, index) => ({
        rank: index + 1,
        name: entry?.name ?? "Unknown",
        score: toScoreText(entry?.score),
      })),
    [entries],
  );

  return (
    <section className={`history ${isExpanded ? "is-open" : "is-closed"}`}>
      <div className="history__body" aria-hidden={!isExpanded}>
        <header className="history__columns">
          <h3>Nom :</h3>
          <h3>Score :</h3>
        </header>

        {normalizedEntries.length > 0 ? (
          <ol className="history__list">
            {normalizedEntries.map((entry) => (
              <li key={`${entry.rank}-${entry.name}-${entry.score}`}>
                <span className="history__name">
                  {entry.rank}. {entry.name}
                </span>
                <span className="history__score">{entry.score}</span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="history__empty">Aucune partie enregistree.</p>
        )}
      </div>

      <Button
        className="btn--panel history__trigger"
        onClick={() => setIsExpanded((previous) => !previous)}
        aria-expanded={isExpanded}
        ariaLabel={isExpanded ? "Replier le leaderboard" : "Ouvrir le leaderboard"}
      >
        <span className="history__inner">
          <span className="btn btn--icon history__arrow" aria-hidden="true">
            {isExpanded ? "v" : "^"}
          </span>
          <span className="history__title">{title}</span>
          <span className="btn btn--icon history__arrow" aria-hidden="true">
            {isExpanded ? "v" : "^"}
          </span>
        </span>
      </Button>
    </section>
  );
}

export default HistoryBoard;
