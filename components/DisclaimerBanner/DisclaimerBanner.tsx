'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';

export default function DisclaimerBanner() {
  const t = useTranslations('disclaimer');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 只在客户端检查localStorage，避免hydration错误
    if (typeof window !== 'undefined') {
      const dismissed = window.localStorage.getItem('disclaimer-dismissed');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsVisible(!dismissed);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('disclaimer-dismissed', 'true');
    }
  };

  if (!isVisible) return null;

  return (
    <div className="bg-yellow-50 border-b border-yellow-200">
      <div className="container mx-auto max-w-7xl px-4 py-3">
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
