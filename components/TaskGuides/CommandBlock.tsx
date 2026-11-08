'use client';

import { useState } from 'react';
import { words } from '@/data/task-guides';

export default function CommandBlock({ code, locale }: { code: string; locale: string }) {
  const [copied, setCopied] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  return <div className="relative min-w-0 overflow-hidden rounded-[10px] bg-[var(--code-bg)]">
    <pre tabIndex={0} className="max-w-full overflow-x-auto py-3 pl-4 pr-24 font-mono text-[14px] leading-6 text-[var(--code-fg)]"><code>{code}</code></pre>
    <button type="button" aria-label={copied === code ? words(locale, 'Copied', '已复制', 'コピー済み') : words(locale, 'Copy command', '复制命令', 'コマンドをコピー')} className="absolute right-2 top-2 rounded-md bg-[#26314a] px-2.5 py-1 font-mono text-xs font-semibold text-[#cfd8ea] transition-colors hover:bg-[#34405c]" onClick={async () => {
      try { await navigator.clipboard.writeText(code); setCopied(code); setFailed(false); }
      catch { setFailed(true); setCopied(null); }
    }}>{copied === code ? words(locale, 'Copied', '已复制', 'コピー済み') : words(locale, 'Copy', '复制', 'コピー')}</button>
    {failed && <p role="status" className="px-4 pb-3 text-sm text-[var(--code-fg)]">{words(locale, 'Copy was blocked. Select the command text and copy it manually.', '复制被阻止，请选择命令文本手动复制。', 'コピーできません。テキストを選択して手動でコピーしてください。')}</p>}
  </div>;
}
