const STORAGE_KEY = "quote-game-leaderboard-v1";

export const DEFAULT_LEADERBOARD_ENTRIES = [
  { name: "XXXGamerXXX", score: 50129837 },
  { name: "XXXGamerXXX", score: 41209483 },
  { name: "XXXGamerXXX", score: 3586598 },
  { name: "XXXGamerXXX", score: 3419090 },
  { name: "XXXGamerXXX", score: 3157609 },
  { name: "XXXGamerXXX", score: 2997910 },
  { name: "XXXGamerXXX", score: 2272983 },
];

function sanitizeEntries(entries) {
  if (!Array.isArray(entries)) {
    return [];
  }

  return entries
    .map((entry) => {
      const rawScore = Number(entry?.score);
      if (!Number.isFinite(rawScore) || rawScore < 0) {
        return null;
      }

      return {
        name: String(entry?.name ?? "Player").trim() || "Player",
        score: Math.round(rawScore),
      };
    })
    .filter(Boolean);
}

function sortEntries(entries) {
  return [...entries].sort((a, b) => b.score - a.score).slice(0, 10);
}

export function loadLeaderboard() {
  if (typeof window === "undefined") {
    return sortEntries(DEFAULT_LEADERBOARD_ENTRIES);
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      const initialEntries = sortEntries(DEFAULT_LEADERBOARD_ENTRIES);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialEntries));
      return initialEntries;
    }

    const parsed = JSON.parse(stored);
    const sanitized = sanitizeEntries(parsed);

    if (sanitized.length === 0) {
      return sortEntries(DEFAULT_LEADERBOARD_ENTRIES);
    }

    return sortEntries(sanitized);
  } catch {
    return sortEntries(DEFAULT_LEADERBOARD_ENTRIES);
  }
}

export function pushLeaderboardScore({ name = "Player", score }) {
  const numericScore = Number(score);
  if (!Number.isFinite(numericScore) || numericScore <= 0) {
    return loadLeaderboard();
  }

  const current = loadLeaderboard();
  const next = sortEntries([
    ...current,
    {
      name: String(name).trim() || "Player",
      score: Math.round(numericScore),
    },
  ]);

  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  return next;
}
