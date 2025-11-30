'use client';

import { ENABLE_ADS } from './config';

// AdSense Publisher ID（从环境变量读取）
const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID || '';

// 广告管理器
export class AdManager {
  private static instance: AdManager;
  private adsenseLoaded = false;

  private constructor() {
    if (typeof window !== 'undefined' && ENABLE_ADS) {
      this.loadAdSense();
    }
  }

  public static getInstance(): AdManager {
    if (!AdManager.instance) {
      AdManager.instance = new AdManager();
    }
    return AdManager.instance;
  }

  // 加载 AdSense 脚本
  private loadAdSense(): void {
    if (this.adsenseLoaded || !ADSENSE_ID) return;

    const script = document.createElement('script');
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`;
    script.async = true;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);
    this.adsenseLoaded = true;
  }

  // 渲染 AdSense 广告
  public renderAdSense(slotId: string, config: { width: number; height: number }): void {
    if (!ENABLE_ADS || !this.adsenseLoaded || !ADSENSE_ID) {
      return;
    }

    try {
      const adContainer = document.getElementById(`ad-${slotId}`);
      if (!adContainer) return;

      // 创建 AdSense 广告单元
      const adScript = document.createElement('script');
      adScript.innerHTML = `
        (adsbygoogle = window.adsbygoogle || []).push({
          google_ad_client: "${ADSENSE_ID}",
          enable_page_level_ads: false
        });
      `;
      adContainer.appendChild(adScript);

      // 创建广告展示区域
      const ins = document.createElement('ins');
      ins.className = 'adsbygoogle';
      ins.style.display = 'block';
      ins.style.width = `${config.width}px`;
      ins.style.height = `${config.height}px`;
      ins.setAttribute('data-ad-client', ADSENSE_ID);
      ins.setAttribute('data-ad-slot', slotId);
      ins.setAttribute('data-ad-format', 'auto');
      adContainer.appendChild(ins);

      // 触发广告加载
      const adsbygoogle = (window as any).adsbygoogle;
      if (adsbygoogle && Array.isArray(adsbygoogle)) {
        adsbygoogle.push({});
      }
    } catch (error) {
      console.error('AdSense 渲染错误:', error);
    }
  }

  // 渲染占位符
  public renderPlaceholder(slotId: string, placeholder: string): void {
    const adContainer = document.getElementById(`ad-${slotId}`);
    if (!adContainer) return;

    adContainer.innerHTML = `
      <div class="flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 p-4 text-center">
        <p class="text-sm text-gray-600 dark:text-gray-400">${placeholder}</p>
      </div>
    `;
  }
}

