"use client";
import { useEffect } from 'react';
import { initWebVitalsTracking } from '@/lib/analytics';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    __ANALYTICS_READY__?: boolean;
  }
}

interface AnalyticsProviderProps {
  enable?: boolean;
}

export default function AnalyticsProvider({ enable = true }: AnalyticsProviderProps) {
  const gaId = process.env.NEXT_PUBLIC_GA4_ID;

  useEffect(() => {
    if (!enable) return;
    if (gaId && !window.__ANALYTICS_READY__) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag(){
        // @ts-ignore
        window.dataLayer.push(arguments);
      };
      window.gtag('js', new Date());
      window.gtag('config', gaId, { anonymize_ip: true, send_page_view: true });
      window.__ANALYTICS_READY__ = true;
    }
    initWebVitalsTracking();
  }, [gaId, enable]);

  if (!enable) return null;

  return (
    <>
      {gaId && (
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}></script>
      )}
      {gaId && (
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}',{anonymize_ip:true,send_page_view:true});`
          }}
        />
      )}
    </>
  );
}
