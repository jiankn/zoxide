'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

const GA_MEASUREMENT_ID = 'G-417HF3TV3L';

export default function GoogleAnalytics() {
  // 默认加载 GA，只有用户明确拒绝 analytics 时才不追踪
  const [hasConsent, setHasConsent] = useState(true);


  useEffect(() => {

    // 检查用户是否明确拒绝了 analytics cookies
    const checkConsent = () => {
      try {
        const preferences = window.localStorage.getItem('cookie-preferences');
        if (preferences) {
          const parsed = JSON.parse(preferences);
          // 只有明确设置 analytics 为 false 时才不加载
          if (parsed.analytics === false) {
            setHasConsent(false);
            return;
          }
        }

        // 没有偏好记录或未明确拒绝，默认加载
        setHasConsent(true);
      } catch (error) {
        console.error('Error checking cookie consent:', error);
        // 出错时默认加载
        setHasConsent(true);
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
  if (!hasConsent) {
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

