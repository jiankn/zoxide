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
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {t('shareLabel')}
      </span>

      {/* 桌面端：文字按钮，移动端：彩色图标圆按钮 */}
      <div className="flex items-center gap-2">
        {/* Twitter */}
        <button
          type="button"
          onClick={shareToTwitter}
          className="hidden md:inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          aria-label={t('shareToTwitter')}
        >
          <Twitter className="h-4 w-4" />
          Twitter
        </button>
        <button
          type="button"
          onClick={shareToTwitter}
          className="inline-flex md:hidden items-center justify-center h-9 w-9 rounded-full bg-[#1DA1F2] text-white shadow-sm hover:opacity-90 transition-opacity"
          aria-label={t('shareToTwitter')}
        >
          <Twitter className="h-4 w-4" />
        </button>

        {/* Facebook */}
        <button
          type="button"
          onClick={shareToFacebook}
          className="hidden md:inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          aria-label={t('shareToFacebook')}
        >
          <Facebook className="h-4 w-4" />
          Facebook
        </button>
        <button
          type="button"
          onClick={shareToFacebook}
          className="inline-flex md:hidden items-center justify-center h-9 w-9 rounded-full bg-[#1877F2] text-white shadow-sm hover:opacity-90 transition-opacity"
          aria-label={t('shareToFacebook')}
        >
          <Facebook className="h-4 w-4" />
        </button>

        {/* 复制链接 */}
        <button
          type="button"
          onClick={handleCopyClick}
          className="hidden md:inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
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
        <button
          type="button"
          onClick={handleCopyClick}
          className="inline-flex md:hidden items-center justify-center h-9 w-9 rounded-full bg-gray-900 text-white shadow-sm hover:opacity-90 transition-opacity dark:bg-gray-100 dark:text-gray-900"
          aria-label={t('copyLink')}
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-300" />
          ) : (
            <LinkIcon className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}

