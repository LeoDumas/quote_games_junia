import people from "../resources/data/people.json";

const TIMEOUT_MS = 5000;
const seen = new Set();

const QUOTE_SOURCES = {
  en: [
    {
      name: "dummyjson",
      url: "https://dummyjson.com/quotes/random",
      parse: (payload) => ({
        quote: String(payload?.quote || "No quote available"),
        author: String(payload?.author || "Unknown"),
      }),
    },
    {
      name: "quotable",
      url: "https://api.quotable.io/random",
      parse: (payload) => ({
        quote: String(payload?.content || "No quote available"),
        author: String(payload?.author || "Unknown"),
      }),
    },
    {
      name: "forismatic-en",
      url: "https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json&key=1",
      parse: (payload) => ({
        quote: String(payload?.quoteText || "No quote available"),
        author: String(payload?.quoteAuthor || "Unknown"),
      }),
    },
  ],
  fr: [
    {
      name: "forismatic-fr",
      url: "https://api.forismatic.com/api/1.0/?method=getQuote&lang=fr&format=json&key=1",
      parse: (payload) => ({
        quote: String(payload?.quoteText || "Aucune citation disponible"),
        author: String(payload?.quoteAuthor || "Inconnu"),
      }),
    },
    {
      name: "dummyjson-fr-fallback",
      url: "https://dummyjson.com/quotes/random",
      parse: (payload) => ({
        quote: String(payload?.quote || "Aucune citation disponible"),
        author: String(payload?.author || "Inconnu"),
      }),
    },
  ],
};

export function detectLanguage() {
  const lang = (navigator.language ?? "en").toLowerCase();
  return lang.startsWith("fr") ? "fr" : "en";
}

function getQuoteSources(language = "en") {
  return QUOTE_SOURCES[language] ?? QUOTE_SOURCES.en;
}

async function fetchFromSource(source) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(source.url, { signal: controller.signal });
    if (!response.ok) throw new Error(`${source.name} returned ${response.status}`);
    const payload = await response.json();
    return source.parse(payload);
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchRandomQuote(language = "en") {
  const sources = getQuoteSources(language);
  const order = [...sources].sort(() => Math.random() - 0.5);
  let lastError = null;

  for (const source of order) {
    try {
      const result = await fetchFromSource(source);
      const key = result.quote.trim().toLowerCase();

      if (seen.has(key)) continue;
      if (seen.size >= 60) seen.clear();
      seen.add(key);

      return result;
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError ?? new Error("Failed to load a quote");
}

export function getRandomAuthorChoices(correctAuthor, count = 3) {
  const correctValue = String(correctAuthor || "Unknown");
  const pool = Array.isArray(people?.names) ? people.names : [];
  const available = pool.filter((name) => name !== correctValue);
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
