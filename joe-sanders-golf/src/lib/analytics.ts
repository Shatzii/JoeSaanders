import { onCLS, onFID, onLCP, onINP, onTTFB } from 'web-vitals';

type AnalyticsEvent = {
  name: string;
  category?: string;
  label?: string;
  value?: number;
  meta?: Record<string, any>;
};

const queue: AnalyticsEvent[] = [];
let flushScheduled = false;

function scheduleFlush() {
  if (flushScheduled) return;
  flushScheduled = true;
  setTimeout(() => {
    flushScheduled = false;
    flushQueue();
  }, 3000);
}

async function flushQueue() {
  if (queue.length === 0) return;
  const batch = queue.splice(0, queue.length);
  try {
    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ events: batch, ts: Date.now() })
    });
  } catch (e) {
    // requeue on failure
    queue.unshift(...batch);
  }
}

export function trackEvent(event: AnalyticsEvent) {
  try {
    queue.push({ ...event, value: event.value ?? 1 });
    scheduleFlush();
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event.name, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.meta
      });
    }
  } catch {
    // swallow
  }
}

export function pageView(path: string) {
  trackEvent({ name: 'page_view_custom', category: 'navigation', label: path });
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'page_view', { page_path: path });
  }
}

export function initWebVitalsTracking() {
  if (typeof window === 'undefined') return;
  onCLS(reportVital('CLS'));
  onFID(reportVital('FID'));
  onLCP(reportVital('LCP'));
  onINP?.(reportVital('INP'));
  onTTFB(reportVital('TTFB'));
}

function reportVital(name: string) {
  return (metric: any) => {
    trackEvent({
      name: 'web_vital',
      category: 'performance',
      label: name,
      value: metric.value,
      meta: { id: metric.id }
    });
  };
}

// expose manual flush for debugging
export async function flushAnalytics() {
  await flushQueue();
}
