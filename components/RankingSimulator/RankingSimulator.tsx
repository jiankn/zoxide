'use client';

import { useId, useState, type CSSProperties } from 'react';
import { words } from '@/data/task-guides';
import { addVisit, DAY, HOUR, matchesKeywords, recencyFactor, score, splitQuery, WEEK, type DirEntry } from '@/lib/zoxide-rank';

// 模拟器里的目录：DirEntry 之外再保留每次访问的时间，用来画“日期章”
interface SimDir extends DirEntry {
  visits: number[];
}

type ScenarioId = 'similar' | 'fresh' | 'segment';

const START = 100 * WEEK;

function seed(entries: { path: string; ago: number[] }[]): SimDir[] {
  return entries.map(e => {
    const visits = e.ago.map(a => START - a).sort((x, y) => x - y);
    return { path: e.path, rank: visits.length, lastAccessed: visits[visits.length - 1], visits };
  });
}

// 演示数据：路径是虚构的示例，打分规则来自 zoxide 0.10.0
const scenarios: Record<ScenarioId, { dirs: () => SimDir[]; query: string; extra: string[] }> = {
  similar: {
    dirs: () => seed([
      { path: '~/work/api', ago: [2 * HOUR] },
      { path: '~/work/api-docs', ago: [17 * DAY, 16 * DAY, 15 * DAY, 9 * DAY, 9 * DAY, 8 * DAY] },
      { path: '~/work/client-portal', ago: [20 * HOUR, DAY + 2 * HOUR] },
      { path: '~/notes/api-design', ago: [3 * DAY] },
      { path: '~/dotfiles', ago: [38 * DAY] },
    ]),
    query: 'api',
    extra: [],
  },
  fresh: { dirs: () => [], query: 'api', extra: ['~/work/api', '~/work/api-docs', '~/dotfiles'] },
  segment: {
    dirs: () => seed([
      { path: '~/work/web-app/src', ago: [HOUR + 5, 3 * HOUR, 5 * HOUR] },
      { path: '~/work/web-app', ago: [2 * DAY] },
      { path: '~/sites/web', ago: [9 * DAY] },
    ]),
    query: 'web',
    extra: [],
  },
};

function ago(seconds: number, locale: string) {
  const t = (en: string, zh: string, ja: string) => words(locale, en, zh, ja);
  if (seconds < 60) return t('now', '刚刚', '今');
  if (seconds < HOUR) { const m = Math.round(seconds / 60); return t(`${m}m`, `${m} 分钟`, `${m} 分`); }
  if (seconds < DAY) { const h = Math.round(seconds / HOUR); return t(`${h}h`, `${h} 小时`, `${h} 時間`); }
  const d = Math.round(seconds / DAY);
  return t(`${d}d`, `${d} 天`, `${d} 日`);
}

export default function RankingSimulator({ locale }: { locale: string }) {
  const id = useId();
  const t = (en: string, zh: string, ja: string) => words(locale, en, zh, ja);
  const [scenario, setScenario] = useState<ScenarioId>('similar');
  const [dirs, setDirs] = useState<SimDir[]>(scenarios.similar.dirs);
  const [now, setNow] = useState(START);
  const [here, setHere] = useState('~');
  const [text, setText] = useState(scenarios.similar.query);
  const [newPath, setNewPath] = useState('');

  const load = (next: ScenarioId) => {
    setScenario(next);
    setDirs(scenarios[next].dirs());
    setNow(START);
    setHere('~');
    setText(scenarios[next].query);
  };

  // cd 进入目录：hook 记录一次访问，你也就“站在”了这个目录里
  const visit = (path: string) => {
    setDirs(prev => {
      const updated = addVisit(prev, path, now);
      return updated.map(d => {
        const old = prev.find(p => p.path === d.path) as SimDir | undefined;
        return { ...d, visits: d.path === path ? [...(old?.visits ?? []), now] : (old?.visits ?? []) } as SimDir;
      });
    });
    setHere(path);
  };

  const keywords = splitQuery(text);
  // 同分时后加入数据库的目录排前面，和真实 zoxide 一致（见 lib/zoxide-rank.ts query）
  const rows = dirs.map((d, i) => {
    const matched = matchesKeywords(d.path, keywords);
    const isHere = d.path === here;
    return { d, i, matched, isHere, eligible: matched && !isHere, s: score(d, now), factor: recencyFactor(now - d.lastAccessed) };
  }).sort((a, b) => Number(b.eligible) - Number(a.eligible) || b.s - a.s || b.i - a.i);

  const winner = keywords.length ? rows.find(r => r.eligible) : undefined;
  const lastWord = keywords[keywords.length - 1] ?? '';
  const visitable = Array.from(new Set([...dirs.map(d => d.path), ...scenarios[scenario].extra]));

  const why = (r: (typeof rows)[number]) => {
    if (r.isHere && r.matched) return t('Skipped: you are already in this folder', '跳过：你现在就在这个目录里', '除外：今いるディレクトリです');
    if (!r.matched) {
      const lower = r.d.path.toLowerCase();
      if (lastWord && lower.includes(lastWord.toLowerCase())) return t(`No match: "${lastWord}" is not in the last folder name`, `不匹配：“${lastWord}”不在最后一级目录名里`, `不一致：「${lastWord}」が末尾のフォルダ名にありません`);
      return t('No match', '不匹配', '不一致');
    }
    return null;
  };

  const btn = 'rounded-lg border-[1.5px] border-rule bg-paper px-3 py-1.5 text-[14px] font-semibold text-ink transition-colors hover:border-gray-400';

  return (
    <div className="grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)]" style={{ '--line': 'var(--line-zsh)' } as CSSProperties}>
      <div className="space-y-6">
        <div>
          <label htmlFor={`${id}-scenario`} className="mb-2 block text-[13px] font-bold uppercase tracking-[0.08em] text-ink-soft">{t('Start from', '从这个场景开始', 'シナリオ')}</label>
          <select id={`${id}-scenario`} value={scenario} onChange={e => load(e.target.value as ScenarioId)} className="w-full rounded-lg border-[1.5px] border-rule bg-paper px-3 py-2 text-[15px] font-semibold text-ink">
            <option value="similar">{t('Two folders with similar names', '两个名字相近的目录', '名前が似た 2 つのフォルダ')}</option>
            <option value="fresh">{t('A fresh install (empty database)', '刚装好（空数据库）', 'インストール直後（空のデータベース）')}</option>
            <option value="segment">{t('The last-folder-name rule', '“最后一级目录名”规则', '「末尾のフォルダ名」ルール')}</option>
          </select>
        </div>
        <div>
          <p className="mb-2 text-[13px] font-bold uppercase tracking-[0.08em] text-ink-soft">{t('1 · Visit folders', '1 · 进入目录', '1 · フォルダへ移動')}</p>
          <div className="grid gap-2">
            {visitable.map(p => (
              <button key={p} type="button" onClick={() => visit(p)} className={`${btn} text-left font-mono text-[13.5px]`}>cd {p}</button>
            ))}
            <button type="button" onClick={() => setHere('~')} className={`${btn} text-left font-mono text-[13.5px]`}>cd ~ <span className="font-sans text-[12.5px] font-normal text-ink-soft">{t('(home is excluded by default)', '（主目录默认不记录）', '（ホームは既定で記録しない）')}</span></button>
          </div>
          <form className="mt-2 flex gap-2" onSubmit={e => { e.preventDefault(); const p = newPath.trim(); if (p) { visit(p); setNewPath(''); } }}>
            <label htmlFor={`${id}-new`} className="sr-only">{t('Another folder', '其他目录', '別のフォルダ')}</label>
            <input id={`${id}-new`} value={newPath} onChange={e => setNewPath(e.target.value)} placeholder="~/projects/blog" className="min-w-0 flex-1 rounded-lg border-[1.5px] border-rule bg-paper px-3 py-1.5 font-mono text-[13.5px] text-ink" />
            <button type="submit" className={btn}>cd</button>
          </form>
          <p className="mt-2 text-[14px] text-ink-soft">{t('You are in', '当前位置', '現在地')}: <code className="font-mono text-ink">{here}</code></p>
        </div>
        <div>
          <p className="mb-2 text-[13px] font-bold uppercase tracking-[0.08em] text-ink-soft">{t('2 · Move the clock', '2 · 拨动时间', '2 · 時間を進める')}</p>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={btn} onClick={() => setNow(n => n + HOUR)}>+1 {t('hour', '小时', '時間')}</button>
            <button type="button" className={btn} onClick={() => setNow(n => n + DAY)}>+1 {t('day', '天', '日')}</button>
            <button type="button" className={btn} onClick={() => setNow(n => n + WEEK)}>+1 {t('week', '周', '週')}</button>
            <button type="button" className={btn} onClick={() => load(scenario)}>{t('Reset', '重置', 'リセット')}</button>
          </div>
          <p className="mt-2 font-mono text-[13.5px] text-ink-soft">{now === START ? t('Clock: start', '时间：起点', '時刻：開始時点') : `${t('Clock', '时间', '時刻')}: +${ago(now - START, locale)}`}</p>
        </div>
      </div>

      <div className="min-w-0">
        <label htmlFor={`${id}-q`} className="mb-2 block text-[13px] font-bold uppercase tracking-[0.08em] text-ink-soft">{t('3 · Type a query', '3 · 输入关键词', '3 · キーワードを入力')}</label>
        <div className="flex max-w-[520px] overflow-hidden rounded-[10px] border-2 border-ink bg-paper">
          <span className="bg-ink px-3 py-2.5 font-mono text-lg font-semibold text-white">z</span>
          <input id={`${id}-q`} value={text} onChange={e => setText(e.target.value)} autoComplete="off" spellCheck={false} className="min-w-0 flex-1 px-3 py-2.5 font-mono text-lg font-semibold text-ink outline-none" />
        </div>
        <p className="mb-4 mt-3 min-h-7 text-base text-ink" aria-live="polite">
          {!keywords.length ? t('Type a keyword.', '输入一个关键词。', 'キーワードを入力してください。')
            : winner ? <><code className="rounded bg-[#e3f3ec] px-1.5 py-0.5 font-mono font-bold text-[#00704a]">z {text.trim()}</code> → <b>{winner.d.path}</b> <span className="text-ink-soft">({t('score', '得分', 'スコア')} {winner.s.toFixed(2)})</span></>
            : <><code className="rounded bg-[#fbe7e3] px-1.5 py-0.5 font-mono font-bold text-[#a63320]">z {text.trim()}</code> → <b className="text-[#a63320]">zoxide: no match found</b></>}
        </p>
        {rows.length === 0 && (
          <p className="rounded-[14px] border-[1.5px] border-dashed border-gray-300 bg-paper p-5 text-[15px] text-ink-soft">
            {t('The database is empty. zoxide only knows folders your shell has visited since the hook was set up, so a new install has nothing to match. Visit a folder on the left.', '数据库是空的。zoxide 只认识配置 hook 之后 Shell 进过的目录，所以刚装好时什么都匹配不到。点左边任意目录试试。', 'データベースは空です。zoxide は hook を設定した後にシェルで移動したフォルダしか知らないため、導入直後は何も一致しません。左のフォルダへ移動してみてください。')}
          </p>
        )}
        <ul className="grid list-none gap-3.5 p-0 sm:grid-cols-2">
          {rows.map(r => {
            const isWinner = winner?.d.path === r.d.path;
            const reason = why(r);
            return (
              <li key={r.d.path} className={`relative rounded-[12px] border-[1.5px] bg-paper p-3.5 transition-[transform,box-shadow,opacity] duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${isWinner ? '-translate-y-1 border-[var(--line)] shadow-[0_14px_28px_-16px_rgba(20,33,61,.55)]' : 'border-rule'} ${r.eligible ? '' : 'opacity-60'}`}>
                {isWinner && <span className="absolute -top-2.5 right-3 rounded-full bg-[var(--line)] px-2 py-0.5 text-xs font-bold text-white">{t('z goes here', 'z 跳到这里', 'z の移動先')}</span>}
                <p className="break-all border-b border-rule pb-1.5 font-mono text-[14px] font-semibold text-ink">{r.d.path}</p>
                <div className="mt-2 flex min-h-12 flex-wrap content-start gap-1.5" aria-label={t('Recorded visits', '访问记录', '訪問記録')}>
                  {r.d.visits.slice(-8).map((v, i) => (
                    <span key={`${v}-${i}`} className="animate-[stamp_.35s_cubic-bezier(.16,1,.3,1)] rounded-[3px] border-[1.5px] border-[#5a3fa6] px-1.5 font-mono text-[12px] font-semibold text-[#5a3fa6]" style={{ rotate: `${((i * 37) % 7) - 3}deg` }}>
                      {ago(now - v, locale)}
                    </span>
                  ))}
                </div>
                <p className="mt-2 flex justify-between font-mono text-[13.5px] tabular-nums text-ink-soft">
                  <span>{t('rank', 'rank', 'rank')} {Number.isInteger(r.d.rank) ? r.d.rank : r.d.rank.toFixed(2)} × {r.factor}</span>
                  <b className="text-ink">{r.s.toFixed(2)}</b>
                </p>
                {reason && <p className="mt-1 text-[13px] text-ink-soft">{reason}</p>}
              </li>
            );
          })}
        </ul>
        <p className="mt-4 text-[14px] text-ink-soft">
          {t('Score = rank × recency (within an hour ×4, a day ×2, a week ×0.5, older ×0.25). Each visit adds 1 to rank. Demo folders; rules from zoxide 0.10.0.',
            '得分 = rank × 时间系数（1 小时内 ×4，1 天内 ×2，1 周内 ×0.5，更早 ×0.25）。每访问一次 rank 加 1。目录是示例，规则来自 zoxide 0.10.0。',
            'スコア = rank × 経過時間の係数（1 時間以内 ×4、1 日以内 ×2、1 週間以内 ×0.5、それ以前 ×0.25）。訪問ごとに rank が 1 増えます。フォルダは例で、規則は zoxide 0.10.0 に基づきます。')}
        </p>
      </div>
    </div>
  );
}
