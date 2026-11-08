// 配置生成器的数据：系统 × Shell × 选项 → 四步命令 + 测试回执。
// 回执只引用站内已有实测（各安装教程与 /evidence/ 归档），没测过的组合不写回执。

import { words } from './task-guides';

export type OsId = 'macos' | 'ubuntu' | 'windows' | 'arch' | 'nixos';
export type ShellId = 'zsh' | 'bash' | 'fish' | 'powershell';

export interface SetupChoice {
  os: OsId;
  shell: ShellId;
  replaceCd: boolean;
  fzf: boolean;
}

export const osList: { id: OsId; name: string; shells: ShellId[]; guide: string }[] = [
  { id: 'macos', name: 'macOS', shells: ['zsh', 'bash', 'fish'], guide: '/tutorials/install-macos' },
  { id: 'ubuntu', name: 'Ubuntu / WSL', shells: ['bash', 'zsh', 'fish'], guide: '/tutorials/install-ubuntu' },
  { id: 'windows', name: 'Windows', shells: ['powershell'], guide: '/tutorials/install-windows' },
  { id: 'arch', name: 'Arch Linux', shells: ['bash', 'zsh', 'fish'], guide: '/tutorials/install-arch-nixos' },
  { id: 'nixos', name: 'NixOS', shells: ['bash', 'zsh'], guide: '/tutorials/install-arch-nixos' },
];

export const shellNames: Record<ShellId, string> = { zsh: 'zsh', bash: 'bash', fish: 'fish', powershell: 'PowerShell' };

export const defaultChoice: SetupChoice = { os: 'macos', shell: 'zsh', replaceCd: false, fzf: false };

// URL 参数 → 合法的选择；不认识的值回落到默认
export function parseChoice(params: Record<string, string | string[] | undefined>): SetupChoice {
  const one = (k: string) => (Array.isArray(params[k]) ? params[k]![0] : params[k]) as string | undefined;
  const os = osList.find(o => o.id === one('os'));
  const platform = os ?? osList[0];
  const shell = platform.shells.find(s => s === one('shell')) ?? platform.shells[0];
  return { os: platform.id, shell, replaceCd: one('cd') === '1', fzf: one('fzf') === '1' };
}

export function choiceQuery(c: SetupChoice) {
  const q = new URLSearchParams({ os: c.os, shell: c.shell });
  if (c.replaceCd) q.set('cd', '1');
  if (c.fzf) q.set('fzf', '1');
  return q.toString();
}

const installCommands: Record<OsId, string> = {
  macos: 'brew install zoxide',
  ubuntu: 'curl -sSfL https://raw.githubusercontent.com/ajeetdsouza/zoxide/main/install.sh | sh',
  windows: 'winget install ajeetdsouza.zoxide',
  arch: 'sudo pacman -Syu\nsudo pacman -S zoxide',
  nixos: '',
};

const fzfCommands: Record<OsId, string> = {
  macos: 'brew install fzf',
  ubuntu: 'sudo apt install fzf',
  windows: 'winget install junegunn.fzf',
  arch: 'sudo pacman -S fzf',
  nixos: '',
};

export function profileFile(os: OsId, shell: ShellId) {
  if (shell === 'powershell') return '$PROFILE';
  if (shell === 'fish') return '~/.config/fish/config.fish';
  if (shell === 'zsh') return '~/.zshrc';
  return os === 'macos' ? '~/.bash_profile' : '~/.bashrc';
}

export function initLine(shell: ShellId, replaceCd: boolean) {
  const flag = replaceCd ? ' --cmd cd' : '';
  if (shell === 'fish') return `zoxide init${flag} fish | source`;
  if (shell === 'powershell') return `Invoke-Expression (& { (zoxide init${flag} powershell | Out-String) })`;
  return `eval "$(zoxide init${flag} ${shell})"`;
}

function nixosConfig(c: SetupChoice) {
  const lines = ['programs.zoxide.enable = true;'];
  if (c.replaceCd) lines.push('programs.zoxide.flags = [ "--cmd" "cd" ];');
  if (c.shell === 'zsh') lines.push('programs.zsh.enable = true;');
  if (c.fzf) lines.push('environment.systemPackages = [ pkgs.fzf ];');
  return lines.join('\n');
}

export interface Stop {
  id: 'install' | 'hook' | 'check' | 'jump';
  title: string;
  lead: string;
  code: string;
  note?: string;
}

export function buildStops(c: SetupChoice, locale: string): Stop[] {
  const t = (en: string, zh: string, ja: string) => words(locale, en, zh, ja);
  const z = c.replaceCd ? 'cd' : 'z';
  const zi = c.replaceCd ? 'cdi' : 'zi';
  const pwsh = c.shell === 'powershell';
  const fzfNote = c.fzf && c.os === 'ubuntu'
    ? t('Ubuntu 24.04 apt installs fzf 0.44.1, older than the 0.51.0 zoxide asks for. In our test the zi picker still opened; if yours does not, install fzf from its GitHub releases.',
      'Ubuntu 24.04 的 apt 装的是 fzf 0.44.1，低于 zoxide 要求的 0.51.0。我们实测 zi 仍能打开选择界面；如果你的打不开，请从 fzf 的 GitHub Releases 安装。',
      'Ubuntu 24.04 の apt で入る fzf は 0.44.1 で、zoxide が求める 0.51.0 より古い版です。実測では zi の選択画面は開きました。開かない場合は fzf の GitHub Releases から導入してください。')
    : undefined;

  if (c.os === 'nixos') {
    return [
      { id: 'install', title: t('Add zoxide to your configuration', '在系统配置里启用 zoxide', '設定に zoxide を追加'),
        lead: t('Put these lines in /etc/nixos/configuration.nix. The module installs zoxide and loads it in your shell.', '把下面几行加入 /etc/nixos/configuration.nix。这个模块会安装 zoxide，并在 Shell 里加载它。', '/etc/nixos/configuration.nix に追加します。モジュールが zoxide を導入し、シェルで読み込みます。'),
        code: nixosConfig(c) },
      { id: 'hook', title: t('Apply the configuration', '应用配置', '設定を適用'),
        lead: t('No profile line is needed on NixOS. Rebuild, then log in again or open a new terminal.', 'NixOS 不用手动改 profile。重建系统后重新登录或打开新终端。', 'NixOS では profile への追記は不要です。再構築後、ログインし直すか新しいターミナルを開きます。'),
        code: 'sudo nixos-rebuild switch' },
      { id: 'check', title: t('Check it loaded', '确认已经加载', '読み込みを確認'),
        lead: t(`You should see that ${z} is a function.`, `应该看到 ${z} 是一个 Shell 函数。`, `${z} がシェル関数として表示されれば成功です。`),
        code: `zoxide --version\ntype ${z}` },
      { id: 'jump', title: t('Make your first jump', '完成第一次跳转', '最初のジャンプ'),
        lead: t('Teach it one folder, then jump there by keyword. The last line should end in zoxide-demo.', '先让它记住一个目录，再用关键词跳过去。最后一行应以 zoxide-demo 结尾。', 'ディレクトリを一つ覚えさせ、キーワードで移動します。最後の行が zoxide-demo で終われば成功です。'),
        code: `mkdir -p "$HOME/zoxide-demo"\nzoxide add "$HOME/zoxide-demo"\ncd "$HOME"\n${z} zoxide-demo\npwd${c.fzf ? `\n${zi}   # pick from a list` : ''}` },
    ];
  }

  const install = installCommands[c.os] + (c.fzf ? `\n${fzfCommands[c.os]}` : '');
  const profile = profileFile(c.os, c.shell);
  const hookLead = pwsh
    ? t('Open your profile, add this line at the end, and save. The first command creates the profile if it does not exist yet.', '打开 profile，在末尾加上这一行并保存。第一条命令会在 profile 不存在时先创建它。', 'profile を開き、末尾にこの行を追加して保存します。最初のコマンドは profile がない場合に作成します。')
    : t(`Add this line to the end of ${profile}.`, `把这一行加到 ${profile} 的末尾。`, `${profile} の末尾にこの行を追加します。`)
      + (c.shell === 'zsh' ? t(' If you use completions, put it after compinit.', ' 如果开启了补全，放在 compinit 之后。', ' 補完を使う場合は compinit の後に置きます。') : '')
      + (c.os === 'macos' && c.shell === 'bash' ? t(' macOS opens login shells, which read ~/.bash_profile; if yours sources ~/.bashrc, the line can go there instead.', ' macOS 的终端默认开登录 Shell，读的是 ~/.bash_profile；如果它会加载 ~/.bashrc，也可以写在 ~/.bashrc。', ' macOS のターミナルはログインシェルで ~/.bash_profile を読みます。そこから ~/.bashrc を読み込むなら ~/.bashrc でも構いません。') : '');
  const hookCode = pwsh
    ? `if (!(Test-Path $PROFILE)) { New-Item -ItemType File -Path $PROFILE -Force | Out-Null }\nnotepad $PROFILE\n\n# ${t('line to add', '要添加的一行', '追加する行')}:\n${initLine(c.shell, c.replaceCd)}`
    : initLine(c.shell, c.replaceCd);
  const check = pwsh ? `zoxide --version\nGet-Command ${z}` : c.shell === 'fish' ? `zoxide --version\nfunctions ${z}` : `zoxide --version\ntype ${z}`;
  const jump = pwsh
    ? `New-Item -ItemType Directory -Force "$HOME/zoxide-demo" | Out-Null\nzoxide add "$HOME/zoxide-demo"\nSet-Location $HOME\n${z} zoxide-demo\nGet-Location${c.fzf ? `\n${zi}   # pick from a list` : ''}`
    : `mkdir -p "$HOME/zoxide-demo"\nzoxide add "$HOME/zoxide-demo"\ncd "$HOME"\n${z} zoxide-demo\npwd${c.fzf ? `\n${zi}   # pick from a list` : ''}`;

  return [
    { id: 'install', title: t('Install the binary', '安装程序', '本体を導入'),
      lead: c.os === 'ubuntu'
        ? t('The upstream install script. Debian and Ubuntu repositories may ship an older zoxide; review the script first if your policy requires it.', '官方安装脚本。Debian、Ubuntu 软件源里的 zoxide 可能较旧；如有安全要求，先阅读脚本再运行。', '公式のインストールスクリプトです。Debian/Ubuntu のリポジトリ版は古いことがあります。必要なら実行前に内容を確認してください。')
        : t('Puts the zoxide program on your PATH. Reopen the terminal afterwards.', '把 zoxide 程序装到 PATH 里。装完重新打开终端。', 'zoxide を PATH 上に導入します。終わったらターミナルを開き直します。'),
      code: install, note: fzfNote },
    { id: 'hook', title: t(`Hook it into ${shellNames[c.shell]}`, `接入 ${shellNames[c.shell]}`, `${shellNames[c.shell]} に組み込む`), lead: hookLead, code: hookCode },
    { id: 'check', title: t('Check it loaded', '确认已经加载', '読み込みを確認'),
      lead: t(`Open a new terminal first. A version number means the program works; ${z} should be reported as a shell function.`, `先打开一个新终端。能显示版本号说明程序没问题；${z} 应显示为 Shell 函数。`, `新しいターミナルで実行します。版番号が出れば本体は動いています。${z} はシェル関数と表示されるはずです。`),
      code: check },
    { id: 'jump', title: t('Make your first jump', '完成第一次跳转', '最初のジャンプ'),
      lead: c.replaceCd
        ? t('With --cmd cd, cd keeps working on paths and also jumps by keyword. The last line should end in zoxide-demo.', '加了 --cmd cd 之后，cd 照常接受路径，也能用关键词跳转。最后一行应以 zoxide-demo 结尾。', '--cmd cd を付けると、cd はパスもキーワードも受け付けます。最後の行が zoxide-demo で終われば成功です。')
        : t('Teach it one folder, then jump there by keyword. The last line should end in zoxide-demo.', '先让它记住一个目录，再用关键词跳过去。最后一行应以 zoxide-demo 结尾。', 'ディレクトリを一つ覚えさせ、キーワードで移動します。最後の行が zoxide-demo で終われば成功です。'),
      code: jump },
  ];
}

export interface Receipt {
  where: string;
  zoxide: string;
  shell: string;
  date: string;
  record: string;
  recordLabel: 'guide' | 'evidence';
  caveat?: { en: string; zh: string; ja: string };
}

// 键：系统/Shell。数据与对应教程的“测试环境”表一致。
const receipts: Record<string, Receipt> = {
  'macos/zsh': { where: 'macOS 26.7.2 arm64 · Homebrew 7.0.11', zoxide: '0.10.0', shell: 'zsh 5.9', date: '2026-11-08', record: '/evidence/2026-11-08/macos.json', recordLabel: 'evidence' },
  'macos/bash': { where: 'macOS 26.7.2 arm64 · Homebrew 7.0.11', zoxide: '0.10.0', shell: 'bash 3.2.57', date: '2026-11-08', record: '/evidence/2026-11-08/macos.json', recordLabel: 'evidence' },
  'windows/powershell': { where: 'Windows 11 Pro 23H2 (22631) · winget', zoxide: '0.10.0', shell: 'PowerShell 7.6.9', date: '2026-11-08', record: '/evidence/2026-11-08/windows.json', recordLabel: 'evidence' },
  'ubuntu/bash': { where: 'ubuntu:24.04 container · install script', zoxide: '0.10.0', shell: 'bash 5.2.21', date: '2026-11-08', record: '/evidence/2026-11-08/ubuntu.json', recordLabel: 'evidence' },
  'ubuntu/zsh': { where: 'ubuntu:24.04 container · install script', zoxide: '0.10.0', shell: 'zsh 5.9', date: '2026-11-08', record: '/evidence/2026-11-08/ubuntu.json', recordLabel: 'evidence' },
  'ubuntu/fish': { where: 'ubuntu:24.04 container', zoxide: '0.10.0', shell: 'fish 3.7.0', date: '2026-10-08', record: '/evidence/2026-10-08/command-init.json', recordLabel: 'evidence' },
  'arch/bash': { where: 'archlinux:base container · pacman', zoxide: '0.10.0', shell: 'bash 5.3.20', date: '2026-10-09', record: '/evidence/2026-10-09/arch-nixos.json', recordLabel: 'evidence' },
  'arch/zsh': { where: 'archlinux:base container · pacman', zoxide: '0.10.0', shell: 'zsh 5.9.2', date: '2026-10-09', record: '/evidence/2026-10-09/arch-nixos.json', recordLabel: 'evidence' },
  'nixos/bash': { where: 'NixOS 26.05 VM · system module', zoxide: '0.9.9', shell: 'bash 5.3.9', date: '2026-10-09', record: '/evidence/2026-10-09/arch-nixos.json', recordLabel: 'evidence' },
  'nixos/zsh': { where: 'NixOS 26.05 VM · system module', zoxide: '0.9.9', shell: 'zsh 5.9.1', date: '2026-10-09', record: '/evidence/2026-10-09/arch-nixos.json', recordLabel: 'evidence' },
};

const ubuntuFzfCaveat = {
  en: 'apt fzf 0.44.1 is below the 0.51.0 minimum; zi still opened in our test.',
  zh: 'apt 的 fzf 0.44.1 低于最低要求 0.51.0；实测 zi 仍能打开。',
  ja: 'apt の fzf 0.44.1 は最低要件 0.51.0 未満ですが、実測では zi が開きました。',
};

export function receiptFor(c: SetupChoice): Receipt | null {
  const r = receipts[`${c.os}/${c.shell}`];
  if (!r) return null;
  if (c.fzf && c.os === 'ubuntu') return { ...r, caveat: ubuntuFzfCaveat };
  return r;
}

// 测试矩阵：所有组合的状态
export function matrixRows() {
  return osList.map(o => ({
    os: o,
    cells: (['zsh', 'bash', 'fish', 'powershell'] as ShellId[]).map(s => ({
      shell: s,
      available: o.shells.includes(s),
      receipt: receipts[`${o.id}/${s}`] ?? null,
    })),
  }));
}
