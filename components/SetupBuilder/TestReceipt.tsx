import { Link } from '@/i18n/routing';
import { words } from '@/data/task-guides';
import type { Receipt } from '@/data/setup-matrix';

// 测试回执：已测 / 已测但有注意事项 / 未测。只陈述站内已有实测，不推断。
export default function TestReceipt({ receipt, locale, compact = false }: { receipt: Receipt | null; locale: string; compact?: boolean }) {
  const t = (en: string, zh: string, ja: string) => words(locale, en, zh, ja);
  const lang = locale === 'zh' || locale === 'ja' ? locale : 'en';

  if (!receipt) {
    return (
      <div className="rounded-[14px] border-[1.5px] border-rule bg-paper p-[18px]" aria-live="polite">
        <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-ink-soft">{t('Test receipt', '测试回执', 'テスト記録')}</p>
        <p className="mt-2 flex items-center gap-2.5 text-xl font-extrabold text-ink">
          <span className="inline-block h-3.5 w-3.5 rounded-full bg-[var(--state-untested)]" aria-hidden="true" />
          {t('Not tested yet', '还没测过', '未検証')}
        </p>
        <p className="mt-2 text-[15px] leading-6 text-ink-soft">
          {t('These commands follow the upstream README. We have not run this exact combination, so we do not claim it works.',
            '这组命令按官方 README 写成。我们没有在这个组合上实际跑过，所以不保证可用。',
            'このコマンドは公式 README に基づきます。この組み合わせは実際に試していないため、動作を保証しません。')}
        </p>
      </div>
    );
  }

  const caution = Boolean(receipt.caveat);
  const recordLink = receipt.recordLabel === 'guide'
    ? <Link href={receipt.record} className="font-bold text-ink underline decoration-[var(--line)] decoration-2">{t('Read the test write-up', '查看测试记录', 'テストの記録を読む')} →</Link>
    : <a href={receipt.record} className="font-bold text-ink underline decoration-[var(--line)] decoration-2">{t('Open the archived output', '打开归档的原始输出', '保存した出力を開く')} →</a>;

  return (
    <div className="rounded-[14px] border-[1.5px] border-rule bg-paper p-[18px]" aria-live="polite">
      <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-ink-soft">{t('Test receipt', '测试回执', 'テスト記録')}</p>
      <p className="mt-2 flex items-center gap-2.5 text-xl font-extrabold text-ink">
        <span className={`inline-block h-3.5 w-3.5 rounded-full ${caution ? 'bg-[var(--state-caution)]' : 'bg-[var(--line)]'}`} aria-hidden="true" />
        {caution ? t('Tested, with a caveat', '已测，有注意事项', '検証済み（注意あり）') : t('Tested on this setup', '这个组合实测过', 'この組み合わせで検証済み')}
      </p>
      {receipt.caveat && <p className="mt-2 text-[15px] leading-6 text-ink-soft">{receipt.caveat[lang]}</p>}
      <dl className={`mt-3 grid grid-cols-[auto_1fr] gap-x-3.5 gap-y-1.5 text-[15px] ${compact ? 'sm:grid-cols-[auto_1fr_auto_1fr]' : ''}`}>
        <dt className="text-ink-soft">{t('Where', '环境', '環境')}</dt>
        <dd className="m-0 font-mono text-[13.5px] tabular-nums text-ink">{receipt.where}</dd>
        <dt className="text-ink-soft">zoxide</dt>
        <dd className="m-0 font-mono text-[13.5px] tabular-nums text-ink">{receipt.zoxide}</dd>
        <dt className="text-ink-soft">Shell</dt>
        <dd className="m-0 font-mono text-[13.5px] tabular-nums text-ink">{receipt.shell}</dd>
        <dt className="text-ink-soft">{t('Run on', '测试日期', '実施日')}</dt>
        <dd className="m-0 font-mono text-[13.5px] tabular-nums text-ink">{receipt.date}</dd>
      </dl>
      <p className="mt-3.5 text-[15px]">{recordLink}</p>
    </div>
  );
}
