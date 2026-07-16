'use client';

import { ReactNode, useMemo, isValidElement } from 'react';
import { useTranslations } from 'next-intl';
import CodeBlock from './CodeBlock';

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
  
  if (isValidElement(node)) {
    const element = node as React.ReactElement<{ children?: ReactNode }>;
    return extractText(element.props.children);
  }

  if (node && typeof node === 'object') {
    type WithProps = { props?: { children?: ReactNode } };
    type WithChildren = { children?: ReactNode };

    const withProps = node as WithProps;
    if (withProps.props?.children !== undefined) {
      return extractText(withProps.props.children);
    }

    const withChildren = node as WithChildren;
    if (withChildren.children !== undefined) {
      return extractText(withChildren.children);
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

