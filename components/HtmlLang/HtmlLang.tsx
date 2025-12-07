'use client';

import { useEffect } from 'react';

interface HtmlLangProps {
  locale: string;
}

export default function HtmlLang({ locale }: HtmlLangProps) {
  useEffect(() => {
    // 在客户端设置 html lang 属性
    // 这个组件在服务端渲染时不会执行，所以不会导致水合错误
    // 服务端的 lang 通过 [locale]/layout.tsx 中的 script 标签设置
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  return null;
}

