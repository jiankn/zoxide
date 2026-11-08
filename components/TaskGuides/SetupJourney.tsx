'use client';

import CommandBlock from './CommandBlock';

import { useId, useState } from 'react';
import { Link } from '@/i18n/routing';
import { firstJump, setupPlatforms, shellSetup, profileFor, words } from '@/data/task-guides';

export default function SetupJourney({ locale }: { locale: string }) {
  const id = useId();
  const [platform, setPlatform] = useState('windows');
  const [shell, setShell] = useState('powershell');
  const current = setupPlatforms.find(p => p.id === platform)!;
  const t = (en: string, zh: string, ja: string) => words(locale, en, zh, ja);
  return <section id="setup" className="space-y-6 scroll-mt-24">
    <h2 className="text-3xl font-serif font-bold">{t('Set up your first working jump', '完成第一次可用的目录跳转', '最初のジャンプを成功させる')}</h2>
    <p className="max-w-3xl leading-7 text-gray-700">{t('Choose the system and shell you actually use. Run these commands yourself in your terminal; this page does not change your computer.', '选择实际使用的系统与 Shell，在自己的终端执行步骤；本页不会更改你的电脑。', '実際の OS とシェルを選び、ターミナルで操作してください。このページは PC を変更しません。')}</p>
    <div className="flex flex-wrap gap-6 rounded-xl bg-[#F7F6F3] p-5">
      <label htmlFor={`${id}-os`} className="grid gap-2 font-medium">{t('Operating system', '操作系统', 'OS')}
        <select id={`${id}-os`} value={platform} onChange={e => { setPlatform(e.target.value); setShell(setupPlatforms.find(p => p.id === e.target.value)!.shells[0]); }} className="rounded-md border border-gray-300 bg-white p-3">
          {setupPlatforms.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </label>
      <label htmlFor={`${id}-shell`} className="grid gap-2 font-medium">Shell
        <select id={`${id}-shell`} value={shell} onChange={e => setShell(e.target.value)} className="rounded-md border border-gray-300 bg-white p-3">
          {current.shells.map(s => <option key={s} value={s}>{s === 'powershell' ? 'PowerShell' : s}</option>)}
        </select>
      </label>
    </div>
    <p className="text-sm leading-6 text-gray-600">{t('These paths reuse our October 2026 guides. Other systems and shells are covered in the full guides; they are not automatically validated by this selector.', '这些路径复用 2026 年 10 月的教程。其他系统与 Shell 请查完整指南；选择器不会自动验证你的环境。', '2026年10月のガイドに基づく手順です。他の環境は詳細ガイドへ。この選択画面は環境を自動検証しません。')}</p>
    <noscript><style>{`.setup-platform[hidden], .setup-shell[hidden] { display:block !important; }`}</style><p>{t('JavaScript is off. All setup paths are shown below.', 'JavaScript 已关闭，下方显示所有配置路径。', 'JavaScript は無効です。すべての手順を以下に表示します。')}</p></noscript>
    {setupPlatforms.map(p => <div key={p.id} className="setup-platform space-y-6" hidden={platform !== p.id}>
      <h3 className="text-xl font-semibold">{p.name}</h3>
      <div className="space-y-3"><h4 className="font-semibold">{t('1. Install and check the binary', '1. 安装并验证程序', '1. 導入と実行ファイルの確認')}</h4>
        <CommandBlock code={p.install} locale={locale} />
        <p className="leading-7">{t('Reopen the terminal after installation. If the version check fails, fix installation or PATH before proceeding.', '安装后重新打开终端。版本检查失败时先修复安装或 PATH，再继续。', '導入後にターミナルを開き直します。版の確認に失敗したら導入か PATH を先に修正。')}</p>
        {p.id === 'linux' && <p className="text-sm leading-6">{t('The command downloads and runs the upstream installer. Review the script first if required. Arch/NixOS users should use their dedicated guide below.', '命令会下载并运行上游安装脚本，按需先审阅脚本。Arch/NixOS 用户请使用下方专门教程。', '上流インストーラーを取得して実行します。必要なら事前に内容を確認。Arch/NixOS は下の専用ガイドへ。')}</p>}
        <CommandBlock code="zoxide --version" locale={locale} />
      </div>
      {p.shells.map(s => <div key={s} hidden={shell !== s} className="setup-shell space-y-6">
        <div className="space-y-3"><h4 className="font-semibold">{t('2. Load z in your shell', '2. 在 Shell 中加载 z', '2. シェルで z を読み込む')} · {s}</h4>
          <p className="leading-7">{t('Add the following line to', '把下面一行添加到', '次の行を追記する設定ファイル：')} <code>{profileFor(p.id, s)}</code>.</p>
          {s === 'powershell' && <CommandBlock code={'if (!(Test-Path $PROFILE)) { New-Item -ItemType File -Path $PROFILE -Force | Out-Null }\nnotepad $PROFILE'} locale={locale} />}
          <CommandBlock code={shellSetup[s].init} locale={locale} />
          <p className="leading-7">{t('Save, start a new shell, then check below. Place zoxide after prompt themes; in Zsh load after compinit for completion.', '保存并打开新 Shell，再执行下面的检查。zoxide 放在提示符主题之后；Zsh 补全应在 compinit 之后加载。', '保存して新しいシェルを開き、以下で確認。テーマの後、Zsh の補完では compinit の後に配置。')}</p>
          <CommandBlock code={shellSetup[s].check} locale={locale} />
          <p>{t('Expect a shell function named z.', '预期能找到名为 z 的 Shell 函数。', 'z というシェル関数が見つかることを確認。')}</p>
        </div>
        <div className="space-y-3"><h4 className="font-semibold">{t('3. Add a directory and jump', '3. 添加目录并完成跳转', '3. ディレクトリを追加して移動')}</h4>
          <CommandBlock code={firstJump(s)} locale={locale} />
          <p className="leading-7">{t('The final path should end in zoxide-demo. This explicitly tests add and jump; to check automatic learning, visit another directory normally and inspect zoxide query --list after a prompt appears.', '最终路径应以 zoxide-demo 结尾。此处明确验证 add 与跳转；自动学习需正常访问另一个目录，显示提示符后用 zoxide query --list 检查。', '最後のパスが zoxide-demo で終われば成功。add と移動の確認です。自動学習は別の場所へ通常移動し、プロンプト表示後に zoxide query --list で確認。')}</p>
        </div>
      </div>)}
      <Link href={p.guide} className="inline-block text-blue-700 underline">{t('Full platform guide and tested exceptions', '完整平台教程与实测例外', '環境別の詳しい手順と検証した例外')}</Link>
    </div>)}
    <div className="flex flex-wrap gap-5 border-t border-gray-200 pt-5 text-blue-700 underline">
      <Link href="/blog/zoxide-not-working">{t('A check failed? Diagnose the symptom', '检查失败？按症状排查', '失敗したら症状から調べる')}</Link>
      <Link href="/tutorials/install-arch-nixos">Arch Linux / NixOS</Link>
      <Link href="/blog/zoxide-init-guide">{t('Other shells and profiles', '其他 Shell 与配置文件', '他のシェルと設定ファイル')}</Link>
    </div>
  </section>;
}
