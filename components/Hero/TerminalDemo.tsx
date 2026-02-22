'use client';

import { useState, useEffect } from 'react';

// 终端动画步骤定义
const STEPS = [
  // 1. 传统 cd 方式（慢）
  { type: 'prompt', path: '~' },
  { type: 'typing', text: 'cd projects/web/zoxide-site', delay: 60 },
  { type: 'enter', pause: 300 },
  { type: 'prompt', path: '~/projects/web/zoxide-site' },
  { type: 'typing', text: 'cd ../../../documents/notes', delay: 60 },
  { type: 'enter', pause: 300 },
  { type: 'prompt', path: '~/documents/notes' },
  { type: 'typing', text: 'cd ../../projects/web/zoxide-site/src', delay: 60 },
  { type: 'enter', pause: 600 },

  // 2. 清屏，展示 zoxide 方式（快）
  { type: 'clear', pause: 400 },
  { type: 'prompt', path: '~' },
  { type: 'typing', text: 'z zoxide', delay: 80 },
  { type: 'enter', pause: 200 },
  { type: 'prompt', path: '~/projects/web/zoxide-site' },
  { type: 'typing', text: 'z notes', delay: 80 },
  { type: 'enter', pause: 200 },
  { type: 'prompt', path: '~/documents/notes' },
  { type: 'typing', text: 'z src', delay: 80 },
  { type: 'enter', pause: 200 },
  { type: 'prompt', path: '~/projects/web/zoxide-site/src' },
  { type: 'pause', pause: 2000 },
] as const;

type Line = {
  prompt: string;
  text: string;
  done: boolean;
};

export default function TerminalDemo() {
  const [lines, setLines] = useState<Line[]>([]);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [phase, setPhase] = useState<'cd' | 'zoxide'>('cd');

  useEffect(() => {
    // 光标闪烁
    const blink = setInterval(() => setCursorVisible(v => !v), 530);
    return () => clearInterval(blink);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let currentLines: Line[] = [];
    let currentPhase: 'cd' | 'zoxide' = 'cd';

    const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

    const run = async () => {
      while (!cancelled) {
        currentLines = [];
        currentPhase = 'cd';
        if (!cancelled) { setLines([]); setPhase('cd'); }

        for (const step of STEPS) {
          if (cancelled) return;

          if (step.type === 'clear') {
            await sleep(step.pause);
            currentLines = [];
            currentPhase = 'zoxide';
            if (!cancelled) { setLines([]); setPhase('zoxide'); }
            continue;
          }

          if (step.type === 'prompt') {
            currentLines = [...currentLines, { prompt: step.path, text: '', done: false }];
            if (!cancelled) setLines([...currentLines]);
            await sleep(100);
            continue;
          }

          if (step.type === 'typing') {
            const lineIdx = currentLines.length - 1;
            for (let i = 0; i < step.text.length; i++) {
              if (cancelled) return;
              currentLines = currentLines.map((l, idx) =>
                idx === lineIdx ? { ...l, text: step.text.slice(0, i + 1) } : l
              );
              if (!cancelled) setLines([...currentLines]);
              await sleep(step.delay);
            }
            continue;
          }

          if (step.type === 'enter') {
            const lineIdx = currentLines.length - 1;
            currentLines = currentLines.map((l, idx) =>
              idx === lineIdx ? { ...l, done: true } : l
            );
            if (!cancelled) setLines([...currentLines]);
            await sleep(step.pause);
            continue;
          }

          if (step.type === 'pause') {
            await sleep(step.pause);
            continue;
          }
        }
      }
    };

    run();
    return () => { cancelled = true; };
  }, []);

  const lastLine = lines.length > 0 ? lines[lines.length - 1] : null;
  const showCursor = lastLine && !lastLine.done;

  return (
    <div className="w-full max-w-lg mx-auto lg:mx-0">
      <div className="bg-[#1E1E1E] rounded-2xl overflow-hidden shadow-lg ring-1 ring-gray-200/50">
        {/* 终端头部 */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#2D2D2D] border-b border-[#3F3F3F]">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
            </div>
            <span className="text-xs text-gray-400 ml-2 font-mono">
              {phase === 'cd' ? 'bash — cd' : 'bash — zoxide ⚡'}
            </span>
          </div>
        </div>

        {/* 终端内容 */}
        <div className="p-4 min-h-[180px] lg:min-h-[270px] font-mono text-sm leading-relaxed">
          {lines.map((line, i) => (
            <div key={`${phase}-${i}`} className="whitespace-nowrap">
              {/* 提示符 */}
              <span className="text-[#A78BFA]">user</span>
              <span className="text-gray-500">@</span>
              <span className="text-[#60A5FA]">dev</span>
              <span className="text-gray-500">:</span>
              <span className="text-[#34D399]">{line.prompt}</span>
              <span className="text-gray-400">$ </span>
              {/* 命令文字 */}
              <span className={phase === 'zoxide' && line.text.startsWith('z ') ? 'text-[#FBBF24]' : 'text-gray-200'}>
                {line.text}
              </span>
              {/* 光标 */}
              {i === lines.length - 1 && showCursor && (
                <span
                  className={`inline-block w-2 h-4 ml-px -mb-0.5 align-middle ${cursorVisible ? 'bg-gray-300' : 'bg-transparent'}`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
