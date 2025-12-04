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

export default function CodeBlock({ 
  code, 
  language = 'bash',
  showPrompt = true,
  prompt = 'user@dev:~$',
  className = '',
  showOutput = false,
  output = [],
  copyLabel = 'Copy'
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      // 复制时包含命令，如果有输出也包含输出
      const textToCopy = showOutput && output.length > 0
        ? `${code}\n${output.join('\n')}`
        : code;
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // 清理代码，移除末尾的换行符
  const cleanCode = code.replace(/\n$/, '');
  const codeLines = cleanCode.split('\n');

  // 解析提示符颜色
  const parsePrompt = (promptStr: string) => {
    if (promptStr.includes('@') && promptStr.includes(':')) {
      const [user, rest] = promptStr.split('@');
      const [host, path] = rest.split(':');
      return { user, host, path: path || '' };
    }
    return { user: '', host: '', path: promptStr };
  };

  const promptParts = parsePrompt(prompt);

  return (
    <div className={`relative group my-6 ${className}`}>
      <div className="bg-[#1E1E1E] rounded-lg overflow-hidden border border-[#2F2F2F] shadow-lg">
        {/* 终端头部 */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#2D2D2D] border-b border-[#3F3F3F]">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
              <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
            </div>
            <span className="text-xs text-gray-400 ml-2 font-mono">
              {language}
            </span>
          </div>
          <button
            onClick={handleCopy}
            className="opacity-0 group-hover:opacity-100 transition-opacity rounded p-1.5 text-gray-400 hover:text-gray-200 hover:bg-[#3F3F3F]"
            aria-label={copyLabel}
            title={copyLabel}
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* 代码内容 */}
        <div className="p-4 overflow-x-auto bg-[#1E1E1E]">
          <pre className="text-sm font-mono leading-relaxed whitespace-pre m-0">
            <code className="text-gray-200">
              {/* 命令部分 */}
              {codeLines.map((line, index) => (
                <span key={index}>
                  {showPrompt && index === 0 && (
                    <>
                      <span className="text-[#A78BFA]">
                        {promptParts.user}@
                      </span>
                      <span className="text-[#60A5FA]">
                        {promptParts.host}:
                      </span>
                      <span className="text-[#34D399]">
                        {promptParts.path}$
                      </span>
                      <span className="text-gray-400"> </span>
                    </>
                  )}
                  {showPrompt && index > 0 && (
                    <span className="text-gray-500"> </span>
                  )}
                  {!showPrompt && index > 0 && <span className="text-gray-500"> </span>}
                  <span className="text-[#10B981]">
                    {line}
                  </span>
                  {index < codeLines.length - 1 && '\n'}
                </span>
              ))}
              
              {/* 输出部分 */}
              {showOutput && output.length > 0 && (
                <>
                  {'\n'}
                  {output.map((line, index) => (
                    <span key={`output-${index}`}>
                      <span className="text-gray-500"> </span>
                      <span className="text-gray-400">&gt; </span>
                      <span className="text-gray-300">
                        {line}
                      </span>
                      {index < output.length - 1 && '\n'}
                    </span>
                  ))}
                </>
              )}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}

