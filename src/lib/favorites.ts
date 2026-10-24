import { useSyncExternalStore } from 'react';
import * as store from './store';

// Favourite species ids. Kept in localStorage for instant reads and mirrored to IndexedDB for the service worker.
const KEY = 'favorites';
const listeners = new Set<() => void>();

function read(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]');
  } catch {
    return [];
  }
}

let current = read();
store.set(KEY, current).catch(() => {});

function write(next: string[]) {
  current = next;
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  store.set(KEY, next).catch(() => {});
  listeners.forEach((l) => l());
}

export function toggleFavorite(id: string) {
  write(current.includes(id) ? current.filter((x) => x !== id) : [...current, id]);
}

export function useFavorites(): string[] {
  return useSyncExternalStore(
    (l) => { listeners.add(l); return () => listeners.delete(l); },
    () => current,
  );
}

/** For the service worker / alert checks, which cannot read localStorage. */
export const getFavorites = async () => (await store.get<string[]>(KEY)) ?? [];
