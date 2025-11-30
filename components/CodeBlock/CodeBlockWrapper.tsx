'use client';

import dynamic from 'next/dynamic';
import { ReactNode, useMemo } from 'react';
import { useTranslations } from 'next-intl';

// 动态导入 CodeBlock 以避免 SSR 问题
const CodeBlock = dynamic(() => import('./CodeBlock'), { ssr: false });

interface CodeBlockWrapperProps {
  children: ReactNode;
  className?: string;
  language?: string;
}

// 递归提取文本内容 - 处理 ReactMarkdown 传递的各种情况
function extractText(node: ReactNode): string {
  if (node === null || node === undefined) {
    return '';
  }
  
  // 处理基本类型
  if (typeof node === 'string') {
    return node;
  }
  if (typeof node === 'number') {
    return String(node);
  }
  if (typeof node === 'boolean') {
    return '';
  }
  
  // 处理数组
  if (Array.isArray(node)) {
    return node.map(extractText).join('');
  }
  
  // 处理对象和 React 元素
  if (node && typeof node === 'object') {
    // 处理 React 元素（有 type 和 props）
    if ('type' in node && 'props' in node) {
      const reactNode = node as any;
      if (reactNode.props && reactNode.props.children !== undefined) {
        return extractText(reactNode.props.children);
      }
    }
    // 处理只有 props 的对象
    else if ('props' in node) {
      const propsNode = node as any;
      if (propsNode.props && propsNode.props.children !== undefined) {
        return extractText(propsNode.props.children);
      }
    }
    // 处理有 children 属性的对象
    else if ('children' in node) {
      return extractText((node as any).children);
    }
    // 处理 Fragment 类型
    else if (node.toString && node.toString() === '[object Object]') {
      // 尝试获取任何可能的文本内容
      const keys = Object.keys(node);
      for (const key of keys) {
        const value = (node as any)[key];
        if (typeof value === 'string') {
          return value;
        }
      }
    }
  }
  
  return '';
}

export default function CodeBlockWrapper({ 
  children, 
  className = '',
  language = 'bash'
}: CodeBlockWrapperProps) {
  // 获取国际化翻译
  const t = useTranslations('common');
  const copyLabel = t('copy') || 'Copy';

  // 提取代码内容
  const code = useMemo(() => {
    const text = extractText(children);
    // 清理代码，移除末尾的换行符
    return text.replace(/\n$/, '');
  }, [children]);

  // 从 className 中提取语言（如果存在）
  const detectedLanguage = useMemo(() => {
    const langMatch = className?.match(/language-(\w+)/);
    return langMatch ? langMatch[1] : language;
  }, [className, language]);

  // 判断是否显示提示符（bash, sh, zsh, fish 等显示，其他不显示）
  const showPrompt = ['bash', 'sh', 'zsh', 'fish', 'powershell', 'cmd'].includes(detectedLanguage);

  return (
    <CodeBlock 
      code={code}
      language={detectedLanguage}
      showPrompt={showPrompt}
      copyLabel={copyLabel}
    />
  );
}

