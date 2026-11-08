'use client';

import { words } from '@/data/task-guides';
import { matrixRows, shellNames, type OsId, type ShellId } from '@/data/setup-matrix';
import { SETUP_CHOICE_EVENT } from './SetupBuilder';

// 所有“系统 × Shell”组合的实测状态；点一格就把上面的生成器切到这个组合
export default function TestMatrix({ locale, builderId }: { locale: string; builderId: string }) {
  const t = (en: string, zh: string, ja: string) => words(locale, en, zh, ja);
  const shells: ShellId[] = ['zsh', 'bash', 'fish', 'powershell'];

  const pick = (os: OsId, shell: ShellId) => {
    window.dispatchEvent(new CustomEvent(SETUP_CHOICE_EVENT, { detail: { os, shell, replaceCd: false, fzf: false } }));
    window.history.replaceState(null, '', `?os=${os}&shell=${shell}#${builderId}`);
    document.getElementById(builderId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="overflow-x-auto rounded-[14px] border-[1.5px] border-rule bg-paper">
      <table className="w-full min-w-[560px] border-collapse text-left text-[15px]">
        <caption className="sr-only">{t('Which setups we have tested', '哪些组合实测过', '検証済みの組み合わせ')}</caption>
        <thead>
          <tr className="border-b-[1.5px] border-rule">
            <th scope="col" className="px-4 py-3 text-[13px] font-bold uppercase tracking-[0.08em] text-ink-soft">{t('System', '系统', 'OS')}</th>
            {shells.map(s => (
              <th key={s} scope="col" className="px-4 py-3 text-[13px] font-bold uppercase tracking-[0.08em] text-ink-soft">
                <span className="mr-2 inline-block h-2 w-5 rounded-sm align-middle" style={{ background: `var(--line-${s})` }} aria-hidden="true" />
                {shellNames[s]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrixRows().map(row => (
            <tr key={row.os.id} className="border-b border-rule last:border-b-0">
              <th scope="row" className="px-4 py-3 font-bold text-ink">{row.os.name}</th>
              {row.cells.map(cell => (
                <td key={cell.shell} className="px-2 py-1.5">
                  {cell.available ? (
                    <button type="button" onClick={() => pick(row.os.id, cell.shell)}
                      className="flex w-full flex-col items-start rounded-lg px-2 py-1.5 text-left hover:bg-gray-100">
                      <span className="flex items-center gap-2 font-semibold text-ink">
                        <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: cell.receipt ? `var(--line-${cell.shell})` : 'var(--state-untested)' }} aria-hidden="true" />
                        {cell.receipt ? t('Tested', '已测', '検証済み') : t('Not tested', '未测', '未検証')}
                      </span>
                      {cell.receipt && <span className="font-mono text-[12.5px] tabular-nums text-ink-soft">{cell.receipt.shell} · {cell.receipt.date}</span>}
                    </button>
                  ) : (
                    <span className="block px-2 py-1.5 text-ink-soft">—</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
