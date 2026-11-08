'use client';

import { useState } from 'react';
import { words } from '@/data/task-guides';

export default function CommandBlock({ code, locale }: { code: string; locale: string }) {
  const [copied, setCopied] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  return <div className="min-w-0 overflow-hidden rounded-lg bg-gray-950">
    <div className="flex justify-end bg-gray-100 px-3 py-2">
      <button type="button" className="rounded px-2 py-1 text-sm text-blue-800 underline focus-visible:outline-2 focus-visible:outline-blue-700" onClick={async () => {
        try { await navigator.clipboard.writeText(code); setCopied(code); setFailed(false); }
        catch { setFailed(true); setCopied(null); }
      }}>{copied === code ? words(locale, 'Copied', '已复制', 'コピー済み') : words(locale, 'Copy command', '复制命令', 'コマンドをコピー')}</button>
    </div>
    <pre tabIndex={0} className="max-w-full overflow-x-auto p-4 text-sm text-white"><code>{code}</code></pre>
    {failed && <p role="status" className="px-4 pb-3 text-sm text-white">{words(locale, 'Copy was blocked. Select the command text and copy it manually.', '复制被阻止，请选择命令文本手动复制。', 'コピーできません。テキストを選択して手動でコピーしてください。')}</p>}
  </div>;
}
