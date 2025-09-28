"use client";
import { useEffect, useState } from 'react';
import { initWebVitalsTracking } from '@/lib/analytics';

interface AnalyticsWindow extends Window {
  dataLayer: any[];
  gtag: (...args: any[]) => void;
  __ANALYTICS_READY__?: boolean;
  __ENABLE_ANALYTICS__?: boolean;
}

interface AnalyticsProviderProps {
  enable?: boolean;
}

export default function AnalyticsProvider({ enable = true }: AnalyticsProviderProps) {
  const gaId = process.env.NEXT_PUBLIC_GA4_ID;
  const [analyticsConsent, setAnalyticsConsent] = useState<boolean | null>(null);

  useEffect(() => {
    // Check cookie consent preferences
    const checkConsent = () => {
      try {
        const win = window as AnalyticsWindow
        const consent = localStorage.getItem('cookie-consent');
        if (consent) {
          const preferences = JSON.parse(consent);
          setAnalyticsConsent(preferences.analytics);
          win.__ENABLE_ANALYTICS__ = preferences.analytics;
        } else {
          // No consent given yet, default to false
          setAnalyticsConsent(false);
          win.__ENABLE_ANALYTICS__ = false;
        }
      } catch (error) {
        console.error('Error checking cookie consent:', error);
        setAnalyticsConsent(false);
        (window as AnalyticsWindow).__ENABLE_ANALYTICS__ = false;
      }
    };

    checkConsent();

    // Listen for consent changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cookie-consent') {
        checkConsent();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    if (!enable || analyticsConsent === null) return;

    const win = window as AnalyticsWindow
    if (analyticsConsent && gaId && !win.__ANALYTICS_READY__) {
      // Initialize GA4 with consent
      win.dataLayer = win.dataLayer || [];
      win.gtag = function gtag(...args: unknown[]){
        win.dataLayer.push(args as unknown as never);
      };
      
      // Set initial consent state
      win.gtag('consent', 'default', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        wait_for_update: 500,
      });

      win.gtag('js', new Date());
      win.gtag('config', gaId, { 
        anonymize_ip: true, 
        send_page_view: true,
        cookie_flags: 'SameSite=Strict;Secure'
      });

      // Grant consent for analytics
      win.gtag('consent', 'update', {
        analytics_storage: 'granted'
      });

      win.__ANALYTICS_READY__ = true;
    }

    // Initialize web vitals tracking only if analytics consent is given
    if (analyticsConsent) {
      initWebVitalsTracking();
    }
  }, [gaId, enable, analyticsConsent]);

  // Only render scripts if analytics consent is given
  if (!enable || !analyticsConsent || analyticsConsent === null) return null;

  return (
    <>
      {gaId && (
        <script 
          async 
          src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        />
      )}
      {gaId && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                analytics_storage: 'denied',
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                wait_for_update: 500,
              });
              gtag('js', new Date());
              gtag('config', '${gaId}', {
                anonymize_ip: true,
                send_page_view: true,
                cookie_flags: 'SameSite=Strict;Secure'
              });
              gtag('consent', 'update', {
                analytics_storage: 'granted'
              });
            `
          }}
        />
      )}
    </>
  );
}
