'use client';

import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface CodeBlockProps {
  code: string;
  language?: string;
  showPrompt?: boolean;
  prompt?: string;
  className?: string;
  showOutput?: boolean;
  output?: string[];
  copyLabel?: string;
}

// 文章里的代码块：和配置生成器同一套深色命令块，复制按钮常驻（触屏没有悬停）
export default function CodeBlock({
  code,
  language = 'bash',
  showPrompt = true,
  prompt,
  className = '',
  showOutput = false,
  output = [],
  copyLabel = 'Copy',
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      // 只复制命令本身，不带提示符
      const textToCopy = showOutput && output.length > 0 ? `${code}\n${output.join('\n')}` : code;
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const codeLines = code.replace(/\n$/, '').split('\n');
  const promptMark = prompt ?? (language === 'powershell' ? 'PS>' : '$');

  return (
    <div className={`my-6 overflow-hidden rounded-lg bg-[var(--code-bg)] ${className}`}>
      <div className="flex items-center justify-between border-b border-white/10 py-1.5 pl-4 pr-1.5">
        <span className="font-mono text-xs uppercase tracking-wide text-[#8e9ab3]">{language}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex min-h-9 items-center gap-1.5 rounded px-2.5 text-xs font-semibold text-[#c9d2e3] transition-colors hover:bg-white/10 hover:text-white"
          aria-label={copyLabel}
        >
          {copied ? <Check className="h-4 w-4 text-[#4fd1a0]" /> : <Copy className="h-4 w-4" />}
          <span>{copyLabel}</span>
        </button>
      </div>
      <pre className="m-0 overflow-x-auto px-4 py-3.5 font-mono text-[13.5px] leading-relaxed text-[var(--code-fg)]">
        <code>
          {codeLines.map((line, index) => (
            <span key={index}>
              {showPrompt && (
                <span className="select-none text-[#6b7894]">{index === 0 ? `${promptMark} ` : ' '.repeat(promptMark.length + 1)}</span>
              )}
              {line}
              {index < codeLines.length - 1 && '\n'}
            </span>
          ))}
          {showOutput && output.length > 0 && (
            <>
              {'\n'}
              {output.map((line, index) => (
                <span key={`output-${index}`} className="text-[#9aa6bf]">
                  {line}
                  {index < output.length - 1 && '\n'}
                </span>
              ))}
            </>
          )}
        </code>
      </pre>
    </div>
  );
}
