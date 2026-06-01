import { useEffect, useState } from 'react';

async function checkEngineHealth(signal) {
  try {
    const response = await fetch('/api/health', {
      cache: 'no-store',
      signal
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return Boolean(data?.model_ready);
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return false;
    }
    return false;
  }
}

export function useEngineStatus(pollIntervalMs = 15000) {
  const [isOnline, setIsOnline] = useState(() => (typeof navigator === 'undefined' ? true : navigator.onLine));
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let pollId;

    const refresh = async () => {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        if (!cancelled) {
          setIsOnline(false);
          setIsChecking(false);
        }
        return;
      }

      if (!cancelled) {
        setIsChecking(true);
      }

      const controller = new AbortController();
      const healthy = await checkEngineHealth(controller.signal);

      if (cancelled) {
        return;
      }

      setIsOnline(healthy);
      setIsChecking(false);
    };

    const handleOnline = () => {
      refresh();
    };

    const handleOffline = () => {
      setIsOnline(false);
      setIsChecking(false);
    };

    refresh();
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (pollIntervalMs > 0) {
      pollId = window.setInterval(() => {
        if (typeof navigator !== 'undefined' && navigator.onLine) {
          refresh();
        }
      }, pollIntervalMs);
    }

    return () => {
      cancelled = true;
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (pollId) {
        window.clearInterval(pollId);
      }
    };
  }, [pollIntervalMs]);

  return {
    isOnline,
    isChecking,
    statusLabel: isOnline ? 'AI ENGINE ONLINE' : 'AI ENGINE OFFLINE',
    statusDotClassName: isOnline ? 'bg-secondary-container' : 'bg-error',
    statusPillClassName: isOnline
      ? 'bg-surface-container-high text-on-surface-variant border border-outline-variant/20'
      : 'bg-error-container text-error border border-error/20'
  };
}
