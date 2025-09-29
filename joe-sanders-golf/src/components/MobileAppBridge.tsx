'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';

interface MobileAppBridgeProps {
  enabled?: boolean;
}

// Type definitions for mobile app integration
interface WindowWithMobileApp extends Window {
  ReactNativeWebView?: {
    postMessage: (message: string) => void;
  };
  webkit?: {
    messageHandlers?: {
      iosApp?: {
        postMessage: (message: unknown) => void;
      };
    };
  };
  Android?: {
    receiveMessage: (message: string) => void;
  };
  postMessageToApp?: (message: unknown) => void;
  handleMobileAppMessage?: (message: string) => void;
}

interface MobileAppMessage {
  type: string;
  event_name?: string;
  properties?: Record<string, unknown>;
  path?: string;
  payload?: Record<string, unknown>;
}

/**
 * Mobile App Bridge Component
 * 
 * Provides a bridge between the web app and potential mobile applications
 * for shared analytics, data synchronization, and cross-platform features.
 * 
 * This is a placeholder/stub for future mobile app integration.
 */
export function MobileAppBridge({ enabled = true }: MobileAppBridgeProps) {
  useEffect(() => {
    if (!enabled) return;

    // Check if running in a mobile app context (WebView)
    const win = window as WindowWithMobileApp;
    const isMobileApp = typeof window !== 'undefined' && (
      // React Native WebView
      win.ReactNativeWebView ||
      // iOS WKWebView
      win.webkit?.messageHandlers ||
      // Android WebView
      win.Android
    );

    if (isMobileApp) {
      // Track mobile app usage
      trackEvent({
        name: 'mobile_app_detected',
        category: 'mobile',
        meta: {
          platform: getMobilePlatform(),
          user_agent: navigator.userAgent,
          timestamp: new Date().toISOString()
        }
      });

      // Set up mobile app communication
      setupMobileAppCommunication();
    }
  }, [enabled]);

  return null; // This is a headless component
}

/**
 * Detect mobile platform
 */
function getMobilePlatform(): string {
  if (typeof window === 'undefined') return 'unknown';

  const userAgent = navigator.userAgent.toLowerCase();
  const win = window as WindowWithMobileApp;
  
  if (userAgent.includes('android')) return 'android';
  if (userAgent.includes('iphone') || userAgent.includes('ipad')) return 'ios';
  if (win.ReactNativeWebView) return 'react-native';
  
  return 'web';
}

/**
 * Set up communication channels with mobile app
 */
function setupMobileAppCommunication() {
  if (typeof window === 'undefined') return;

  const win = window as WindowWithMobileApp;

  // React Native WebView communication
  if (win.ReactNativeWebView) {
    win.postMessageToApp = (message: unknown) => {
      win.ReactNativeWebView?.postMessage(JSON.stringify(message));
    };
  }

  // iOS WKWebView communication
  if (win.webkit?.messageHandlers) {
    win.postMessageToApp = (message: unknown) => {
      win.webkit?.messageHandlers?.iosApp?.postMessage(message);
    };
  }

  // Android WebView communication
  if (win.Android) {
    win.postMessageToApp = (message: unknown) => {
      win.Android?.receiveMessage(JSON.stringify(message));
    };
  }

  // Set up global message handler for mobile app
  win.handleMobileAppMessage = (message: string) => {
    try {
      const data: MobileAppMessage = JSON.parse(message);
      
      // Handle different message types from mobile app
      switch (data.type) {
        case 'analytics_event':
          if (data.event_name && data.properties) {
            trackEvent({
              name: data.event_name,
              category: 'mobile_app',
              meta: data.properties
            });
          }
          break;
        case 'navigation':
          // Handle mobile app navigation requests
          if (data.path && typeof window !== 'undefined') {
            window.location.href = data.path;
          }
          break;
        case 'share_data':
          // Handle data sharing from mobile app
          if (data.payload) {
            handleSharedData(data.payload);
          }
          break;
        default:
          console.log('Unknown mobile app message type:', data.type);
      }
    } catch (error) {
      console.error('Error handling mobile app message:', error);
    }
  };
}

/**
 * Handle shared data from mobile app
 */
function handleSharedData(payload: Record<string, unknown>) {
  // Track shared data event
  trackEvent({
    name: 'mobile_app_data_shared',
    category: 'mobile_app',
    meta: {
      data_type: payload.type,
      data_size: JSON.stringify(payload).length,
      timestamp: new Date().toISOString()
    }
  });

  // Store shared data for web app to use
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('mobile_app_shared_data', JSON.stringify(payload));
    
    // Dispatch custom event for other components to listen
    window.dispatchEvent(new CustomEvent('mobileAppDataShared', { 
      detail: payload 
    }));
  }
}

/**
 * Utility function to send data to mobile app
 */
export function sendToMobileApp(data: unknown) {
  const win = window as WindowWithMobileApp;
  if (typeof window !== 'undefined' && win.postMessageToApp) {
    win.postMessageToApp(data);
  }
}

/**
 * Utility function to check if running in mobile app
 */
export function isMobileAppContext(): boolean {
  if (typeof window === 'undefined') return false;
  
  const win = window as WindowWithMobileApp;
  return !!(
    win.ReactNativeWebView ||
    win.webkit?.messageHandlers ||
    win.Android
  );
}

/**
 * Hook to listen for mobile app data
 */
export function useMobileAppData() {
  useEffect(() => {
    const handleMobileData = (event: CustomEvent) => {
      // Handle mobile app data in your components
      console.log('Mobile app data received:', event.detail);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('mobileAppDataShared', handleMobileData as EventListener);
      
      return () => {
        window.removeEventListener('mobileAppDataShared', handleMobileData as EventListener);
      };
    }
  }, []);
}