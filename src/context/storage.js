// Small localStorage helpers. Storage can be unavailable (private mode, blocked
// site data), so every access is guarded and the app keeps working in memory.

export function readJson(key, fallback) {
  try {
    const value = JSON.parse(window.localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

export function writeJson(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export function readText(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeText(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // ignore
  }
}

/** Calls `onChange` when another tab changes `key`. Returns an unsubscribe function. */
export function onStorageChange(key, onChange) {
  const listener = (e) => e.key === key && onChange();
  window.addEventListener('storage', listener);
  return () => window.removeEventListener('storage', listener);
}
