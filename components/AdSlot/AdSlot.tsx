'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { getAdConfig, ENABLE_ADS } from '@/lib/ads/config';
import { AdManager } from '@/lib/ads/manager';

interface AdSlotProps {
  slotId: string;
  lazy?: boolean; // 是否延迟加载
  className?: string;
}

export default function AdSlot({ slotId, lazy = false, className = '' }: AdSlotProps) {
  const [isVisible, setIsVisible] = useState(!lazy);
  const adRef = useRef<HTMLDivElement>(null);
  const config = getAdConfig(slotId);
  const t = useTranslations('ads');

  useEffect(() => {
    if (!config) {
      console.warn(`广告位配置不存在: ${slotId}`);
      return;
    }

    // 延迟加载处理
    if (lazy && !isVisible) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsVisible(true);
              observer.disconnect();
            }
          });
        },
        { rootMargin: '50px' }
      );

      if (adRef.current) {
        observer.observe(adRef.current);
      }

      return () => observer.disconnect();
    }
  }, [lazy, isVisible, slotId, config]);

  useEffect(() => {
    if (!isVisible || !config) return;

    const manager = AdManager.getInstance();
    const timeoutId = setTimeout(() => {
      if (ENABLE_ADS) {
        // 使用桌面端尺寸（移动端通过 CSS 响应式处理）
        const isMobile = window.innerWidth < 768;
        const dimensions = isMobile ? config.mobile : config.desktop;
        manager.renderAdSense(slotId, dimensions);
      } else {
        // 使用翻译的占位符文本
        // 移除 'ads.' 前缀，因为 t 函数已经在 'ads' 命名空间下
        const key = config.placeholderKey?.replace(/^ads\./, '') || 'default';
        const placeholder = t(key);
        manager.renderPlaceholder(slotId, placeholder);
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [isVisible, slotId, config, t]);

  if (!config) {
    return null;
  }

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const dimensions = isMobile ? config.mobile : config.desktop;

  return (
    <div
      ref={adRef}
      id={`ad-${slotId}`}
      className={`ad-slot ${className}`}
      style={{
        minWidth: `${dimensions.width}px`,
        minHeight: `${dimensions.height}px`,
        width: '100%',
        maxWidth: `${dimensions.width}px`,
      }}
    />
  );
}
