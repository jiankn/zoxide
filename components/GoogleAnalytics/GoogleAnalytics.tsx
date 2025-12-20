'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

const GA_MEASUREMENT_ID = 'G-417HF3TV3L';

export default function GoogleAnalytics() {
  const [hasConsent, setHasConsent] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // 检查 cookie 同意状态
    const checkConsent = () => {
      try {
        const consent = window.localStorage.getItem('cookie-consent');
        if (!consent) {
          // 如果没有同意记录，不加载
          setHasConsent(false);
          return;
        }

        const preferences = window.localStorage.getItem('cookie-preferences');
        if (preferences) {
          const parsed = JSON.parse(preferences);
          // 检查用户是否同意了 analytics cookies
          if (parsed.analytics === true) {
            setHasConsent(true);
            return;
          }
        }
        
        setHasConsent(false);
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

  // 在客户端挂载前不渲染
  if (!isMounted || !hasConsent) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}

