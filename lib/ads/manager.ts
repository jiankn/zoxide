'use client';

import { ENABLE_ADS, AD_PROVIDER } from './config';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
    ezstandalone?: {
      cmd?: Array<() => void>;
      define?: (...args: number[]) => void;
      enable?: () => void;
      display?: () => void;
      refresh?: () => void;
    };
  }
}

// AdSense Publisher ID（从环境变量读取）
const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID || '';

// 广告管理器
export class AdManager {
  private static instance: AdManager;
  private adsenseLoaded = false;
  private ezoicLoaded = false;
  private ezoicPlaceholders: number[] = [];

  private constructor() {
    if (typeof window !== 'undefined' && ENABLE_ADS) {
      if (AD_PROVIDER === 'adsense') {
        this.loadAdSense();
      } else if (AD_PROVIDER === 'ezoic') {
        this.loadEzoic();
      }
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

  // 加载 Ezoic 脚本（按照官方文档顺序，全部异步加载防止渲染屏蔽）
  private loadEzoic(): void {
    if (this.ezoicLoaded) return;

    // 1. 加载 Privacy Scripts（隐私脚本）- 必须先加载，但使用 async 防止阻塞
    const privacyScript1 = document.createElement('script');
    privacyScript1.src = 'https://cmp.gatekeeperconsent.com/min.js';
    privacyScript1.async = true;
    privacyScript1.setAttribute('data-cfasync', 'false');
    document.head.appendChild(privacyScript1);

    const privacyScript2 = document.createElement('script');
    privacyScript2.src = 'https://the.gatekeeperconsent.com/cmp.min.js';
    privacyScript2.async = true;
    privacyScript2.setAttribute('data-cfasync', 'false');
    document.head.appendChild(privacyScript2);

    // 2. 加载 Header Script（头部脚本）
    const headerScript = document.createElement('script');
    headerScript.src = '//www.ezojs.com/ezoic/sa.min.js';
    headerScript.async = true;
    document.head.appendChild(headerScript);

    // 3. 初始化 ezstandalone 对象
    window.ezstandalone = window.ezstandalone || {};
    window.ezstandalone.cmd = window.ezstandalone.cmd || [];

    this.ezoicLoaded = true;
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
      const adsbygoogle = window.adsbygoogle;
      if (adsbygoogle && Array.isArray(adsbygoogle)) {
        adsbygoogle.push({});
      }
    } catch (error) {
      console.error('AdSense 渲染错误:', error);
    }
  }

  // 渲染 Ezoic 广告
  public renderEzoic(slotId: string, placeholderId: number): void {
    if (!ENABLE_ADS || !placeholderId) {
      return;
    }

    try {
      const adContainer = document.getElementById(`ad-${slotId}`);
      if (!adContainer) return;

      // 检查是否已经渲染过
      if (adContainer.querySelector(`#ezoic-pub-ad-placeholder-${placeholderId}`)) {
        return;
      }

      // 创建 Ezoic 广告占位符（按照官方文档格式）
      const ezoicDiv = document.createElement('div');
      ezoicDiv.id = `ezoic-pub-ad-placeholder-${placeholderId}`;
      adContainer.appendChild(ezoicDiv);

      // 记录占位符 ID
      if (!this.ezoicPlaceholders.includes(placeholderId)) {
        this.ezoicPlaceholders.push(placeholderId);
      }

      // 使用 Ezoic 命令队列调用 showAds（按照官方文档）
      if (window.ezstandalone?.cmd) {
        window.ezstandalone.cmd.push(() => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const ez = window.ezstandalone as any;
          if (ez?.showAds) {
            ez.showAds(placeholderId);
          }
        });
      }
    } catch (error) {
      console.error('Ezoic 渲染错误:', error);
    }
  }

  // 渲染占位符
  public renderPlaceholder(slotId: string, placeholder: string): void {
    const adContainer = document.getElementById(`ad-${slotId}`);
    if (!adContainer) return;

    adContainer.innerHTML = `
      <div class="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 p-4 text-center">
        <p class="text-sm text-gray-600 ">${placeholder}</p>
      </div>
    `;
  }
}

