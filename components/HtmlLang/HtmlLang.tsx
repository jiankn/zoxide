'use client';

import { useEffect } from 'react';

interface HtmlLangProps {
  locale: string;
}

export default function HtmlLang({ locale }: HtmlLangProps) {
  useEffect(() => {
    // 动态设置 html lang 属性
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  return null;
}

