'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

const GA_MEASUREMENT_ID = 'G-417HF3TV3L';

export default function GoogleAnalytics() {
  // 未取得明确同意前不加载分析脚本。
  const [hasConsent, setHasConsent] = useState<boolean | null>(null);

  useEffect(() => {
    const checkConsent = () => {
      try {
        const consentSaved = window.localStorage.getItem('cookie-consent');
        const preferences = window.localStorage.getItem('cookie-preferences');
        const parsed = preferences ? JSON.parse(preferences) : {};
        const analyticsGranted = Boolean(consentSaved && parsed.analytics === true);

        setHasConsent(analyticsGranted);

        if (!analyticsGranted) {
          const consentWindow = window as Window & {
            gtag?: (...args: unknown[]) => void;
          };
          consentWindow.gtag?.('consent', 'update', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
          });
        }
      } catch (error) {
        console.error('Error checking cookie consent:', error);
        setHasConsent(false);
      }
    };

    // 初始检查
    checkConsent();

    // 监听 localStorage 变化（跨标签页）
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cookie-preferences' || e.key === 'cookie-consent') {
        checkConsent();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // 监听自定义事件（同一窗口内的变化）
    const handleCustomEvent = () => {
      checkConsent();
    };

    window.addEventListener('cookieConsentChanged', handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cookieConsentChanged', handleCustomEvent);
    };
  }, []);

  if (hasConsent !== true) {
    return null;
  }

  return (
    <>
      <Script id="google-consent" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = window.gtag || gtag;
          gtag('consent', 'update', {
            analytics_storage: 'granted',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied'
          });
        `}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = window.gtag || gtag;
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}

