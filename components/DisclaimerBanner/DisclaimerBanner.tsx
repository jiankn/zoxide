'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';

const shouldDisplayDisclaimer = () => {
  if (typeof window === 'undefined') return false;
  return !window.localStorage.getItem('disclaimer-dismissed');
};

export default function DisclaimerBanner() {
  const t = useTranslations('disclaimer');
  const [isVisible, setIsVisible] = useState(shouldDisplayDisclaimer);

  const handleClose = () => {
    setIsVisible(false);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('disclaimer-dismissed', 'true');
    }
  };

  if (!isVisible) return null;

  return (
    <div className="bg-yellow-50 border-b border-yellow-200">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-yellow-800 flex-1">
            <strong>{t('label')}</strong> {t('message')}
          </p>
          <button
            onClick={handleClose}
            className="flex-shrink-0 p-1 text-yellow-800 hover:text-yellow-900 transition-colors"
            aria-label={t('closeLabel')}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
