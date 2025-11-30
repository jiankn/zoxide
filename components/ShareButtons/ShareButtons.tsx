'use client';

import { Twitter, Facebook, Link as LinkIcon, Check } from 'lucide-react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface ShareButtonsProps {
  title: string;
  url: string;
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const t = useTranslations('common');

  const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${url}` : url;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(t('copyFailed'), err);
    }
  };

  const shareToTwitter = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const text = encodeURIComponent(title);
    const shareUrl = encodeURIComponent(fullUrl);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${shareUrl}`, '_blank', 'noopener,noreferrer');
  };

  const shareToFacebook = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const shareUrl = encodeURIComponent(fullUrl);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank', 'noopener,noreferrer');
  };

  const handleCopyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleCopy();
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('shareLabel')}</span>
      
      {/* Twitter */}
      <button
        type="button"
        onClick={shareToTwitter}
        className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        aria-label={t('shareToTwitter')}
      >
        <Twitter className="h-4 w-4" />
        Twitter
      </button>

      {/* Facebook */}
      <button
        type="button"
        onClick={shareToFacebook}
        className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        aria-label={t('shareToFacebook')}
      >
        <Facebook className="h-4 w-4" />
        Facebook
      </button>

      {/* 复制链接 */}
      <button
        type="button"
        onClick={handleCopyClick}
        className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        aria-label={t('copyLink')}
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 text-green-600" />
            {t('linkCopied')}
          </>
        ) : (
          <>
            <LinkIcon className="h-4 w-4" />
            {t('copyLink')}
          </>
        )}
      </button>
    </div>
  );
}

