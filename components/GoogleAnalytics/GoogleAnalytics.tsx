'use client';

import Script from 'next/script';

const GA_MEASUREMENT_ID = 'G-417HF3TV3L';

export default function GoogleAnalytics() {
  // Defaults are set in the document head; Google CMP owns consent updates.
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
