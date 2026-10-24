import { checkAlerts, getPlaces, savePlaces, type WatchedPlace } from './alerts';
import * as store from './store';

export const notifSupported = () => typeof window !== 'undefined' && 'Notification' in window;

async function show(title: string, opts: NotificationOptions) {
  if (!notifSupported() || Notification.permission !== 'granted') return;
  const reg = await navigator.serviceWorker?.getRegistration();
  if (reg) await reg.showNotification(title, opts);
  else new Notification(title, opts);
}

/** Asks for permission and registers the background check where the browser supports it. */
export async function enableNotifications(): Promise<NotificationPermission> {
  if (!notifSupported()) return 'denied';
  const perm = await Notification.requestPermission();
  if (perm === 'granted') {
    try {
      const reg: any = await navigator.serviceWorker?.ready;
      if (reg?.periodicSync) await reg.periodicSync.register('mushroom-check', { minInterval: 6 * 3600e3 });
    } catch {
      // Periodic sync needs an installed PWA in Chromium; the app still checks on every open.
    }
  }
  return perm;
}

/** Runs the alert check in the page, at most every `minHours` unless forced. */
export async function runPageCheck(force: boolean, minHours = 0) {
  const last = await store.get<number>('lastPageCheck');
  if (!force && last && Date.now() - last < minHours * 3600e3) return [];
  await store.set('lastPageCheck', Date.now());
  return checkAlerts(show, force);
}

export async function watchPlace(p: Omit<WatchedPlace, 'id' | 'threshold' | 'species'>) {
  const places = await getPlaces();
  const id = `${p.lat.toFixed(3)},${p.lon.toFixed(3)}`;
  if (!places.some((x) => x.id === id)) places.push({ ...p, id, threshold: 0.5, species: [] });
  await savePlaces(places);
  return id;
}
