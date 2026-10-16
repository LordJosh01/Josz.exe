import { useEffect, useState } from 'react';
import { Bell, Clock, X } from 'lucide-react';

const STORAGE_KEY = 'belsh-active-countdown';

type ActiveCountdown = {
  name: string;
  target: number;
};

function readActiveCountdown(): ActiveCountdown | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;

  try {
    const parsed = JSON.parse(stored) as Partial<ActiveCountdown>;
    if (typeof parsed.name === 'string' && typeof parsed.target === 'number') return parsed as ActiveCountdown;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }

  return null;
}

function formatRemaining(target: number) {
  const diff = Math.max(0, target - Date.now());
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
    complete: diff === 0,
  };
}

export default function CountdownBanner() {
  const [active, setActive] = useState<ActiveCountdown | null>(null);
  const [remaining, setRemaining] = useState(() => formatRemaining(Date.now()));
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    setActive(readActiveCountdown());
    if ('Notification' in window) setPermission(Notification.permission);

    const sync = () => setActive(readActiveCountdown());
    window.addEventListener('belsh-countdown-updated', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('belsh-countdown-updated', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  useEffect(() => {
    if (!active) return;

    const update = () => {
      const next = formatRemaining(active.target);
      setRemaining(next);

      if (next.complete && 'Notification' in window && Notification.permission === 'granted') {
        const notificationKey = `belsh-notified-${active.target}`;
        if (!localStorage.getItem(notificationKey)) {
          new Notification('Your event has arrived', {
            body: `${active.name || 'Your event'} is happening now.`,
            icon: '/EVENT_BY_BELSH.jpg',
            badge: '/EVENT_BY_BELSH.jpg',
          });
          localStorage.setItem(notificationKey, 'sent');
        }
      }
    };

    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, [active]);

  if (!active) return null;

  const requestPermission = async () => {
    if (!('Notification' in window)) return;
    const next = await Notification.requestPermission();
    setPermission(next);
  };

  const dismiss = () => {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event('belsh-countdown-updated'));
    setActive(null);
  };

  return (
    <aside className="fixed bottom-5 right-5 z-[60] w-[min(340px,calc(100vw-2rem))] rounded-2xl border border-gold-500/40 bg-dark/95 p-4 shadow-2xl shadow-black/50 backdrop-blur-xl animate-countdown-slide-in">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold-500/40 bg-gold-500/10">
          <Clock size={17} className="text-gold-300" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-gold-400">Countdown running</p>
              <p className="truncate font-serif text-lg text-white">{active.name || 'Your event'}</p>
            </div>
            <button onClick={dismiss} aria-label="Dismiss countdown" className="text-white/50 transition-colors hover:text-gold-300">
              <X size={16} />
            </button>
          </div>
          <p className="mt-1 text-sm text-white/80">
            {remaining.complete
              ? 'The day has arrived.'
              : `${remaining.days}d ${String(remaining.hours).padStart(2, '0')}h ${String(remaining.minutes).padStart(2, '0')}m ${String(remaining.seconds).padStart(2, '0')}s`}
          </p>
          {permission !== 'granted' && !remaining.complete && 'Notification' in window && (
            <button onClick={requestPermission} className="mt-3 inline-flex items-center gap-2 text-xs text-gold-300 transition-colors hover:text-gold-200">
              <Bell size={13} /> Enable completion notification
            </button>
          )}
          {remaining.complete && permission !== 'granted' && 'Notification' in window && (
            <button onClick={requestPermission} className="mt-3 inline-flex items-center gap-2 text-xs text-gold-300 transition-colors hover:text-gold-200">
              <Bell size={13} /> Allow device notifications
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
