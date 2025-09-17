import { WebView } from 'react-native-webview';

export class AnalyticsBridge {
  private webViewRef: React.RefObject<WebView> | null = null;

  setWebViewRef(ref: React.RefObject<WebView>) {
    this.webViewRef = ref;
  }

  trackEvent(eventName: string, properties?: Record<string, any>) {
    if (this.webViewRef?.current) {
      const message = {
        type: 'ANALYTICS_EVENT',
        eventName,
        properties: properties || {},
        timestamp: Date.now(),
      };
      this.webViewRef.current.postMessage(JSON.stringify(message));
    }
  }

  trackPageView(pageName: string) {
    this.trackEvent('page_view', { page: pageName });
  }

  trackUserAction(action: string, details?: Record<string, any>) {
    this.trackEvent('user_action', { action, ...details });
  }
}

export const analyticsBridge = new AnalyticsBridge();