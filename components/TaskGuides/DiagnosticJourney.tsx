'use client';

import CommandBlock from './CommandBlock';

import { useId, useState } from 'react';
import { Link } from '@/i18n/routing';
import { firstJump, setupPlatforms, symptoms, words } from '@/data/task-guides';

export default function DiagnosticJourney({ locale }: { locale: string }) {
  const id = useId();
  const [platform, setPlatform] = useState('windows');
  const [shell, setShell] = useState('powershell');
  const [symptom, setSymptom] = useState('binary');
  const [cause, setCause] = useState('empty');
  const t = (en: string, zh: string, ja: string) => words(locale, en, zh, ja);
  const choices = symptoms(locale, shell, platform);
  const current = setupPlatforms.find(p => p.id === platform)!;
  const causes = [
    { id: 'empty', label: t('No directories are listed', '列表为空', '履歴が空'), command: firstJump(shell), note: t('Create and add one known directory, then confirm the final path ends in zoxide-demo.', '创建并添加一个已知目录，最后应位于 zoxide-demo。', '既知のディレクトリを作成・追加し、最後に zoxide-demo へ移動します。') },
    { id: 'listed', label: t('Paths exist, but my query fails', '有记录，但查询失败', '履歴はあるが一致しない'), command: 'zoxide query --list --score', note: t('Use fragments in their path order. The last keyword must match the last directory component: web does not match web-app/src as its final component. Try src, or use zi to inspect candidates.', '按路径顺序输入片段；最后一个关键词必须匹配末级目录：web 不能匹配 web-app/src 的末级 src。可试 src，或用 zi 查看候选。', '語はパスの順に指定。最後の語は末尾のディレクトリ名に一致する必要があります。web は web-app/src の末尾 src には一致しません。src または zi で確認。') },
    { id: 'current', label: t('I may already be in the target', '可能已在目标目录', 'すでに目的地にいるかもしれない'), command: shell === 'powershell' ? 'Get-Location' : 'pwd', note: t('The current directory can be excluded from a jump query. Move elsewhere and retry the same fragment before modifying history.', '跳转查询可能排除当前目录。先换到其他目录再试同一片段，无需修改历史。', '現在地はジャンプ検索から除外される場合があります。別の場所へ移動してから同じ語で再試行。') },
    { id: 'excluded', label: t('A directory is deleted or excluded', '目录已删除或被排除', '削除・除外されたディレクトリ'), command: shell === 'powershell' ? '$env:_ZO_EXCLUDE_DIRS' : 'echo "$_ZO_EXCLUDE_DIRS"', note: t('Confirm that the real directory still exists and inspect exclusion patterns. Repair the path or configuration first, then add the existing directory again. Do not delete the entire database.', '先确认实际目录仍存在并检查排除规则，修复路径或配置后再添加真实目录，不要清空数据库。', '実際の場所が存在するか、除外パターンを確認。パスや設定を修正してから再追加し、履歴全体は削除しません。') },
  ];
  return <section id="diagnosis" className="space-y-6 scroll-mt-24 rounded-xl bg-[#F7F6F3] p-5 md:p-8">
    <h2 className="text-3xl font-serif font-bold">{t('Find the next check for your symptom', '按症状找到下一步检查', '症状から次の確認手順へ')}</h2>
    <p className="max-w-3xl leading-7">{t('A guided manual check, with no Node.js required. Choose what you see and run the commands yourself. This page does not scan your computer or collect terminal output.', '无需 Node.js 的人工自查。选择实际症状并自行执行命令；本页不会扫描电脑或收集终端输出。', 'Node.js 不要の手動チェックです。症状を選び、自分でコマンドを実行。PC のスキャンや端末出力の収集は行いません。')}</p>
    <div className="flex flex-wrap gap-4">
      <label htmlFor={`${id}-os`} className="grid gap-2">{t('Operating system', '操作系统', 'OS')}
        <select id={`${id}-os`} value={platform} onChange={e => { setPlatform(e.target.value); setShell(setupPlatforms.find(p => p.id === e.target.value)!.shells[0]); }} className="max-w-full rounded-md border border-gray-300 bg-white p-3">{setupPlatforms.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
      </label>
      <label htmlFor={`${id}-shell`} className="grid gap-2">Shell
        <select id={`${id}-shell`} value={shell} onChange={e => setShell(e.target.value)} className="rounded-md border border-gray-300 bg-white p-3">{current.shells.map(s => <option key={s} value={s}>{s === 'powershell' ? 'PowerShell' : s}</option>)}</select>
      </label>
      <label htmlFor={`${id}-symptom`} className="grid min-w-0 gap-2">{t('What do you see?', '实际症状', 'どの症状ですか？')}
        <select id={`${id}-symptom`} value={symptom} onChange={e => setSymptom(e.target.value)} className="w-full max-w-full rounded-md border border-gray-300 bg-white p-3">{choices.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}</select>
      </label>
    </div>
    <noscript><style>{`.diagnostic-result[hidden] { display:block !important; margin-top:2rem; }`}</style><p>{t('Without JavaScript, all checks below use PowerShell. Other shell commands are available in the linked full guides.', '关闭 JavaScript 时，下方所有检查使用 PowerShell；其他 Shell 请使用所链接的完整教程。', 'JavaScript 無効時は PowerShell の全手順を表示。他のシェルはリンク先の詳細ガイドへ。')}</p></noscript>
    {choices.map(s => <div key={s.id} hidden={symptom !== s.id} className="diagnostic-result min-w-0 space-y-4" aria-live={symptom === s.id ? 'polite' : undefined}>
      <h3 className="text-xl font-semibold">{s.title}</h3>
      <p className="font-medium">{t('Check first', '先检查', '最初の確認')}</p>
      <CommandBlock code={s.check} locale={locale} />
      <p className="max-w-3xl leading-7">{s.result}</p>
      {s.id === 'no-match' ? <div className="space-y-4">
        <label htmlFor={`${id}-cause`} className="grid gap-2">{t('What did the check show?', '检查结果是什么？', '確認した結果は？')}
          <select id={`${id}-cause`} value={cause} onChange={e => setCause(e.target.value)} className="w-full max-w-xl rounded-md border border-gray-300 bg-white p-3">{causes.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}</select>
        </label>
        <CommandBlock code={causes.find(c => c.id === cause)!.command} locale={locale} />
        <p className="max-w-3xl leading-7">{causes.find(c => c.id === cause)!.note}</p>
      </div> : <>
        <p className="font-medium">{t('Then check or repair this layer', '再检查或修复这一层', '次にこの段階を確認・修正')}</p>
        <CommandBlock code={s.command} locale={locale} />
        <p className="max-w-3xl leading-7">{s.fix}</p>
      </>}
      <Link href={s.href} className="inline-block text-blue-700 underline">{t('Full explanation, examples and limitations', '完整解释、示例与适用边界', '詳しい説明・例・制限を読む')}</Link>
    </div>)}
    <p className="border-t border-gray-300 pt-4 text-sm leading-6">{t('Based on our October 2026 guides, not a live diagnosis. A successful manual add does not prove automatic learning works. For other shells, use the initialization guide.', '依据 2026 年 10 月教程整理，不是实时诊断。手动 add 成功不代表自动学习正常，其他 Shell 请查初始化指南。', '2026年10月のガイドに基づく手順で、リアルタイム診断ではありません。手動 add の成功は自動学習の証明にはなりません。他のシェルは初期化ガイドへ。')} <Link href="/blog/zoxide-init-guide" className="text-blue-700 underline">{t('Shell guide', 'Shell 指南', 'シェルガイド')}</Link></p>
  </section>;
}
