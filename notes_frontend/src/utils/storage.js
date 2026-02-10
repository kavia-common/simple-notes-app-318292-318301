const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

// PUBLIC_INTERFACE
export function loadJson(key, fallbackValue) {
  /** Load and parse JSON from localStorage; returns fallbackValue on any error. */
  if (!isBrowser) return fallbackValue;

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallbackValue;
    return JSON.parse(raw);
  } catch {
    return fallbackValue;
  }
}

// PUBLIC_INTERFACE
export function saveJson(key, value) {
  /** Save JSON to localStorage; no-op if unavailable or if serialization fails. */
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore quota/serialization errors for a best-effort UX.
  }
}
