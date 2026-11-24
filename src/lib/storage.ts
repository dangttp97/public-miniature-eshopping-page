const memoryFallback = new Map<string, string>();
const cache = new Map<string, unknown>();
const listeners = new Set<() => void>();

export const readStorage = <T>(key: string, defaultValue: T): T => {
  if (cache.has(key)) return cache.get(key) as T;

  let value = defaultValue;
  try {
    const saved = localStorage.getItem(key) ?? memoryFallback.get(key);
    if (saved) value = JSON.parse(saved) as T;
  } catch {}
  cache.set(key, value);
  return value;
};

export const writeStorage = (key: string, value: unknown) => {
  const json = JSON.stringify(value);
  cache.set(key, value);
  memoryFallback.set(key, json);
  try {
    localStorage.setItem(key, json);
  } catch {}
  listeners.forEach((listener) => listener());
};

export const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
