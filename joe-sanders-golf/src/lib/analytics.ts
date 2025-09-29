import { onCLS, onFID, onLCP, onINP, onTTFB } from 'web-vitals';

interface WindowWithAnalytics extends Window {
  gtag?: (...args: unknown[]) => void;
  __ENABLE_ANALYTICS__?: boolean;
}

type AnalyticsEvent = {
  name: string;
  category?: string;
  label?: string;
  value?: number;
  meta?: Record<string, unknown>;
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
  } catch {
    // requeue on failure
    queue.unshift(...batch);
  }
}

export function trackEvent(event: AnalyticsEvent) {
  try {
    // Check if analytics is enabled via cookie consent
    const win = window as WindowWithAnalytics;
    if (typeof window !== 'undefined' && !win.__ENABLE_ANALYTICS__) {
      return; // Don't track if analytics not consented to
    }
    
    queue.push({ ...event, value: event.value ?? 1 });
    scheduleFlush();
    if (typeof window !== 'undefined' && win.gtag) {
      win.gtag('event', event.name, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.meta
      });
    }
  } catch {
    // Silent fail for analytics
  }
}

export function pageView(path: string) {
  // Check analytics consent before tracking page views
  const win = window as WindowWithAnalytics;
  if (typeof window !== 'undefined' && !win.__ENABLE_ANALYTICS__) {
    return;
  }
  
  trackEvent({ name: 'page_view_custom', category: 'navigation', label: path });
  if (typeof window !== 'undefined' && win.gtag) {
    win.gtag('event', 'page_view', { page_path: path });
  }
}

export function initWebVitalsTracking() {
  if (typeof window === 'undefined') return;
  
  // Check if analytics is enabled before tracking web vitals
  const win = window as WindowWithAnalytics;
  if (!win.__ENABLE_ANALYTICS__) {
    return;
  }
  
  onCLS(reportVital('CLS'));
  onFID(reportVital('FID'));
  onLCP(reportVital('LCP'));
  onINP?.(reportVital('INP'));
  onTTFB(reportVital('TTFB'));
}

function reportVital(name: string) {
  return (metric: { value: number; id: string }) => {
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
