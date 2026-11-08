'use client';

import { useEffect, useId, useState, type CSSProperties } from 'react';
import { Link } from '@/i18n/routing';
import CommandBlock from '@/components/TaskGuides/CommandBlock';
import { words } from '@/data/task-guides';
import { getPrimaryPaths } from '@/data/search-intents';
import {
  buildStops, choiceQuery, defaultChoice, osList, parseChoice, receiptFor, shellNames,
  type SetupChoice, type ShellId,
} from '@/data/setup-matrix';
import TestReceipt from './TestReceipt';

// 测试矩阵等其他组件通过这个事件切换生成器
export const SETUP_CHOICE_EVENT = 'zoxide:setup-choice';

interface Props {
  locale: string;
  initial?: SetupChoice;
  // full：首页（右栏症状列表 + 回执，同步网址参数）；compact：教程页顶部的预选版
  variant?: 'full' | 'compact';
}

export default function SetupBuilder({ locale, initial = defaultChoice, variant = 'full' }: Props) {
  const id = useId();
  const [choice, setChoice] = useState<SetupChoice>(initial);
  const t = (en: string, zh: string, ja: string) => words(locale, en, zh, ja);
  const full = variant === 'full';

  // 首页读取网址参数（?os=ubuntu&shell=zsh），静态页面先渲染默认组合，再在浏览器里切换
  useEffect(() => {
    if (!full) return;
    const params = Object.fromEntries(new URLSearchParams(window.location.search));
    // 只能在挂载后读网址，否则服务端和浏览器渲染结果不一致
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (params.os) setChoice(parseChoice(params));
    const onPick = (e: Event) => setChoice((e as CustomEvent<SetupChoice>).detail);
    window.addEventListener(SETUP_CHOICE_EVENT, onPick);
    return () => window.removeEventListener(SETUP_CHOICE_EVENT, onPick);
  }, [full]);

  const update = (next: SetupChoice) => {
    setChoice(next);
    if (full) window.history.replaceState(null, '', `?${choiceQuery(next)}${window.location.hash}`);
  };

  const platform = osList.find(o => o.id === choice.os)!;
  const stops = buildStops(choice, locale);
  const receipt = receiptFor(choice);
  const primary = getPrimaryPaths(locale);
  const lineStyle = { '--line': `var(--line-${choice.shell})` } as CSSProperties;

  const segButton = (pressed: boolean) =>
    `rounded-lg border-[1.5px] px-3.5 py-1.5 text-[15px] font-semibold transition-colors ${pressed
      ? 'border-ink bg-ink text-white'
      : 'border-rule bg-paper text-ink hover:border-gray-400'}`;

  const controls = (
    <div className="grid gap-x-4 gap-y-3 sm:grid-cols-[auto_1fr] sm:items-center">
      <span id={`${id}-os`} className="text-[13px] font-bold uppercase tracking-[0.08em] text-ink-soft">{t('System', '系统', 'OS')}</span>
      <div role="group" aria-labelledby={`${id}-os`} className="flex flex-wrap gap-1.5">
        {osList.map(o => (
          <button key={o.id} type="button" aria-pressed={choice.os === o.id} className={segButton(choice.os === o.id)}
            onClick={() => update({ ...choice, os: o.id, shell: o.shells.includes(choice.shell) ? choice.shell : o.shells[0] })}>
            {o.name}
          </button>
        ))}
      </div>
      <span id={`${id}-sh`} className="text-[13px] font-bold uppercase tracking-[0.08em] text-ink-soft">Shell</span>
      <div role="group" aria-labelledby={`${id}-sh`} className="flex flex-wrap gap-1.5">
        {platform.shells.map((s: ShellId) => (
          <button key={s} type="button" aria-pressed={choice.shell === s} className={segButton(choice.shell === s)}
            onClick={() => update({ ...choice, shell: s })}>
            {shellNames[s]}
          </button>
        ))}
      </div>
      <span className="text-[13px] font-bold uppercase tracking-[0.08em] text-ink-soft">{t('Options', '选项', 'オプション')}</span>
      <div className="flex flex-wrap gap-x-5 gap-y-2 text-[15px] font-semibold text-ink">
        <label className="flex cursor-pointer items-center gap-2">
          <input type="checkbox" className="h-[17px] w-[17px] accent-[var(--line)]" checked={choice.replaceCd}
            onChange={e => update({ ...choice, replaceCd: e.target.checked })} />
          {t('Replace', '替换', '置き換え：')} <code className="font-mono text-[14px]">cd</code>
        </label>
        <label className="flex cursor-pointer items-center gap-2">
          <input type="checkbox" className="h-[17px] w-[17px] accent-[var(--line)]" checked={choice.fzf}
            onChange={e => update({ ...choice, fzf: e.target.checked })} />
          {t('Interactive picker (fzf)', '交互选择界面（fzf）', '対話選択（fzf）')}
        </label>
      </div>
    </div>
  );

  const route = (
    <ol className="relative m-0 list-none p-0 before:absolute before:bottom-5 before:left-[15px] before:top-3.5 before:w-2 before:rounded before:bg-[var(--line)] before:transition-colors before:duration-300 before:content-['']" aria-label={t('Setup steps', '配置步骤', '設定手順')}>
      {stops.map((stop, index) => (
        <li key={stop.id} className="relative pb-6 pl-14 last:pb-0">
          <span className="absolute left-[5px] top-0.5 h-7 w-7 rounded-full border-[6px] border-ink bg-paper" aria-hidden="true" />
          <h3 className="text-[19px] font-extrabold leading-snug text-ink">
            <span className="sr-only">{t('Step', '第', 'ステップ')} {index + 1}{t(': ', ' 步：', '：')}</span>{stop.title}
          </h3>
          <p className="mb-2 mt-0.5 max-w-[68ch] text-[15px] leading-6 text-ink-soft">{stop.lead}</p>
          <CommandBlock code={stop.code} locale={locale} />
          {stop.note && <p className="mt-2 max-w-[68ch] rounded-lg border border-[#ecd28a] bg-[#fff4d6] px-3 py-2 text-sm leading-6 text-[#5b4710]">{stop.note}</p>}
        </li>
      ))}
    </ol>
  );

  if (!full) {
    return (
      <section style={lineStyle} className="my-8 rounded-[14px] border-[1.5px] border-rule bg-[var(--background)] p-5 md:p-6" aria-label={t('Commands for your setup', '按你的环境生成命令', '環境別のコマンド')}>
        <h2 className="text-2xl font-extrabold tracking-[-0.01em] text-ink">{t('Commands for your setup', '按你的环境生成命令', '環境別のコマンド')}</h2>
        <p className="mb-4 mt-1 text-[15px] text-ink-soft">{t('Change the system or shell to update every step below.', '切换系统或 Shell，下面每一步都会跟着变。', 'OS やシェルを切り替えると、下の手順がすべて更新されます。')}</p>
        {controls}
        <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          {route}
          <div className="lg:sticky lg:top-24 lg:self-start"><TestReceipt receipt={receipt} locale={locale} /></div>
        </div>
      </section>
    );
  }

  const symptoms = [
    { href: primary.commandNotFound, title: <code className="font-mono text-[14px]">z: command not found</code>, text: t('The init line did not run in this shell', '这个 Shell 没有执行初始化那一行', 'このシェルで初期化行が実行されていません') },
    { href: primary.noMatch, title: <code className="font-mono text-[14px]">no match found</code>, text: t('The database has not seen that folder yet', '数据库还没记住那个目录', 'まだそのディレクトリを記録していません') },
    { href: '/tools/ranking-simulator', title: t('z opens the wrong folder', 'z 跳到了别的目录', 'z が別の場所へ移動する'), text: t('See how the ranking picked it', '看看排名是怎么选的', '順位の決まり方を見る') },
    { href: primary.doctor, title: <>{t('Run', '运行', '実行：')} <code className="font-mono text-[14px]">npx zoxide-doctor</code></>, text: t('Checks PATH, hook and profile in one go', '一次检查 PATH、hook 和配置文件', 'PATH・hook・設定ファイルをまとめて確認') },
  ];

  return (
    <div style={lineStyle} className="grid gap-x-9 gap-y-8 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="min-w-0">
        {controls}
        <div className="mt-7">{route}</div>
        <p className="mt-6 text-[15px] text-ink-soft">
          {t('Full write-up for this system: ', '这个系统的完整教程：', 'この OS の詳しい手順：')}
          <Link href={platform.guide} className="font-semibold text-ink underline decoration-[var(--line)] decoration-2">{platform.name}</Link>
        </p>
      </div>
      <aside className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
        <TestReceipt receipt={receipt} locale={locale} />
        <div className="border-t-[1.5px] border-rule pt-4 lg:border-l-[1.5px] lg:border-t-0 lg:pl-5 lg:pt-0">
          <p className="mb-2 text-[13px] font-bold uppercase tracking-[0.08em] text-ink-soft">{t('Already installed?', '已经装过了？', 'すでに導入済み？')}</p>
          <ul className="m-0 list-none p-0">
            {symptoms.map(s => (
              <li key={s.href} className="border-b border-rule last:border-b-0">
                <Link href={s.href} className="block py-2.5 text-[15px] font-semibold text-ink hover:text-blue-700">
                  {s.title}
                  <span className="block text-[13.5px] font-normal text-ink-soft">{s.text}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
