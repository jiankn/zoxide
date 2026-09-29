'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

type GoogleFundingChoices = {
  callbackQueue: { push(callback: Record<string, () => void>): unknown };
  showRevocationMessage?: () => void;
};

declare global {
  interface Window {
    googlefc?: GoogleFundingChoices;
  }
}

export default function GoogleConsentSettings() {
  const t = useTranslations('common');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    window.googlefc = window.googlefc || { callbackQueue: [] };
    window.googlefc.callbackQueue = window.googlefc.callbackQueue || [];
    window.googlefc.callbackQueue.push({
      CONSENT_API_READY: () => {
        if (active && window.googlefc?.showRevocationMessage) setReady(true);
      },
    });
    return () => { active = false; };
  }, []);

  if (!ready) return null;

  return (
    <button
      type="button"
      onClick={() => window.googlefc?.callbackQueue.push({
        CONSENT_API_READY: () => window.googlefc?.showRevocationMessage?.(),
      })}
      className="text-white/80 hover:text-white"
    >
      {t('cookieSettings')}
    </button>
  );
}
