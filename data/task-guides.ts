import { getPrimaryPaths } from './search-intents';

export function words(locale: string, en: string, zh: string, ja: string) {
  return locale === 'zh' ? zh : locale === 'ja' ? ja : en;
}

export function taskGroups(locale: string) {
  const t = (en: string, zh: string, ja: string) => words(locale, en, zh, ja);
  const p = getPrimaryPaths(locale);
  return [
    { title: t('Install and set up', '安装与设置', '導入と設定'), description: t('Get the binary, load your shell, and make a first jump.', '安装程序、初始化 Shell，并完成首次跳转。', '導入からシェル初期化、最初のジャンプまで。'), links: [
      { href: '/download', title: t('Choose your system and shell', '选择系统与 Shell', 'OS とシェルを選ぶ') },
      { href: '/tutorials/install-windows', title: 'Windows · PowerShell' },
      { href: '/tutorials/install-macos', title: 'macOS · Zsh' },
      { href: '/tutorials/install-ubuntu', title: 'Ubuntu · Bash' },
      { href: '/tutorials/install-arch-nixos', title: 'Arch Linux · NixOS' },
      { href: p.init, title: t('Shell profiles and initialization', 'Shell 配置文件与初始化', '設定ファイルと初期化') },
    ] },
    { title: t('Fix a problem', '故障排查', '問題を解決'), description: t('Start with the message you see, then verify one layer at a time.', '从实际报错开始，逐层验证原因。', '実際の症状から、一段ずつ確認します。'), links: [
      { href: p.troubleshooting, title: t('Choose a symptom', '按症状开始排查', '症状から調べる') },
      { href: p.commandNotFound, title: 'zoxide / z: command not found' },
      { href: p.noMatch, title: 'No match found' },
      { href: p.doctor, title: t('Guided checks and zoxide-doctor', '分步自查与 zoxide-doctor', '手動チェックと zoxide-doctor') },
    ] },
    { title: t('Commands and configuration', '命令与配置', 'コマンドと設定'), description: t('Look up an action or understand why a match wins.', '按目标查命令，理解匹配与记录行为。', '操作別のコマンドとマッチの仕組みを確認。'), links: [
      { href: p.commands, title: t('Command reference', '命令参考', 'コマンド一覧') },
      { href: p.quickStart, title: t('Verify your first jump', '验证首次跳转', '最初のジャンプを確認') },
      { href: p.fzf, title: 'fzf · zi' },
      { href: p.advanced, title: t('Exclusions, database and hooks', '排除目录、数据库与 hook', '除外設定・データベース・hook') },
      { href: '/blog/zoxide-alias-autocomplete', title: t('Command names and completion', '命令名称与补全', 'コマンド名と補完') },
      { href: p.definition, title: t('How zoxide learns and matches', 'zoxide 如何学习与匹配', '学習とマッチの仕組み') },
    ] },
    { title: t('Compare and migrate', '比较与迁移', '比較と移行'), description: t('Choose based on tested behavior and your existing workflow.', '结合实测行为与当前工作流选择工具。', '実測した動作と現在の環境から選びます。'), links: [
      { href: p.alternatives, title: t('Tested alternatives', '替代工具实测', '代替ツールの実測') },
      { href: p.autojump, title: 'zoxide / autojump' },
    ] },
  ];
}

export const setupPlatforms = [
  { id: 'windows', name: 'Windows', shells: ['powershell'], install: 'winget install ajeetdsouza.zoxide', guide: '/tutorials/install-windows' },
  { id: 'macos', name: 'macOS', shells: ['zsh', 'bash'], install: 'brew install zoxide', guide: '/tutorials/install-macos' },
  { id: 'linux', name: 'Ubuntu / Debian / WSL', shells: ['bash', 'zsh', 'fish'], install: 'curl -sSfL https://raw.githubusercontent.com/ajeetdsouza/zoxide/main/install.sh | sh', guide: '/tutorials/install-ubuntu' },
];

export const shellSetup: Record<string, { profile: string; init: string; check: string }> = {
  powershell: { profile: '$PROFILE', init: 'Invoke-Expression (& { (zoxide init powershell | Out-String) })', check: 'Get-Command z' },
  zsh: { profile: '~/.zshrc', init: 'eval "$(zoxide init zsh)"', check: 'type z' },
  bash: { profile: '~/.bashrc', init: 'eval "$(zoxide init bash)"', check: 'type z' },
  fish: { profile: '~/.config/fish/config.fish', init: 'zoxide init fish | source', check: 'functions z' },
};

export function profileFor(platform: string, shell: string) {
  return platform === 'macos' && shell === 'bash'
    ? '~/.bash_profile (login) / ~/.bashrc (non-login)'
    : shellSetup[shell].profile;
}

export function firstJump(shell: string) {
  return shell === 'powershell'
    ? 'New-Item -ItemType Directory -Force "$HOME/zoxide-demo" | Out-Null\nzoxide add "$HOME/zoxide-demo"\nSet-Location $HOME\nz zoxide-demo\nGet-Location'
    : 'mkdir -p "$HOME/zoxide-demo"\nzoxide add "$HOME/zoxide-demo"\ncd "$HOME"\nz zoxide-demo\npwd';
}

export function symptoms(locale: string, shell: string, platform = 'linux') {
  const t = (en: string, zh: string, ja: string) => words(locale, en, zh, ja);
  const p = getPrimaryPaths(locale);
  return [
    { id: 'binary', title: 'zoxide: command not found', check: 'zoxide --version', result: t('A version number means the binary is reachable. If this fails, check its location next.', '能输出版本号，说明程序可访问；失败时先查程序路径。', '版番号が出れば実行ファイルは見つかっています。失敗した場合は場所を確認。'), command: shell === 'powershell' ? 'Get-Command zoxide' : 'command -v zoxide', fix: t('If no executable is found, install it or fix PATH before editing shell initialization. Reopen the terminal after installing.', '找不到程序时，先安装或修复 PATH，再处理 Shell 初始化。安装后重新打开终端。', '見つからない場合は導入か PATH を修正してから初期化へ。導入後はターミナルを開き直します。'), href: p.commandNotFound },
    { id: 'init', title: t('z is missing, but zoxide works', 'zoxide 可用，但 z 不存在', 'zoxide は動くが z がない'), check: shellSetup[shell].check, result: t('Expect a shell function. An executable version alone does not create z.', '预期能找到 Shell 函数。仅有程序版本号并不会创建 z。', 'シェル関数が見つかることを確認。実行ファイルの導入だけでは z は作られません。'), command: shellSetup[shell].init, fix: t(`Add this line to ${profileFor(platform, shell)}, then start a new shell. Zsh: load after compinit. PowerShell: place after prompt themes.`, `将此行加到 ${profileFor(platform, shell)}，再启动新 Shell。Zsh 放在 compinit 后，PowerShell 放在提示符主题后。`, `${profileFor(platform, shell)} に追記して新しいシェルを開きます。Zsh は compinit の後、PowerShell はテーマの後に配置。`), href: p.init },
    { id: 'no-match', title: 'No match found', check: 'zoxide query --list', result: t('An empty result means no directories are available to match. If paths are listed, inspect the last directory name and whether you are already there.', '空列表说明还没有可匹配的目录。有记录时，检查最后一级目录名，以及自己是否已在目标目录。', '空なら一致する履歴がありません。履歴がある場合は末尾の名前と現在地を確認。'), command: firstJump(shell), fix: t('This isolated example adds a real directory and should end in zoxide-demo. If it works, keep your database: check keyword order, excluded paths and the current directory in the detailed guide.', '这个独立示例会创建并加入真实目录，最后应位于 zoxide-demo。成功后无需清空数据库；按详细指南检查关键词顺序、排除路径和当前目录。', 'この例は実際のディレクトリを追加し、最後に zoxide-demo に移動します。成功したら履歴を消さず、語順・除外・現在地を詳しいガイドで確認。'), href: p.noMatch },
    { id: 'wrong', title: t('z opens the wrong directory', 'z 跳到了错误目录', '別のディレクトリへ移動する'), check: 'zoxide query --list --score', result: t('Several matches can have different scores. A short query may select a different path as your history changes.', '多个匹配的分数可能不同，短查询会随使用历史改变结果。', '複数の候補はスコアが異なり、短い検索語の結果は履歴で変わります。'), command: 'zoxide query --list client portal', fix: t('Replace client and portal with fragments from your own path. Use more specific terms or zi with fzf; remove only a confirmed stale full path, not the entire database.', '把 client、portal 换成自己路径中的片段。增加关键词或用 zi 选择；只删除确认过的过期完整路径，不清空整个数据库。', 'client と portal を自分のパスの語に置き換えます。語を増やすか fzf の zi で選択。古い完全パスだけを削除します。'), href: p.commands },
    { id: 'learning', title: t('New directories are not learned', '新目录没有被记录', '新しいディレクトリを学習しない'), check: 'zoxide query --list', result: t('Visit a new directory and return to a prompt, then compare the list. A diagnostic can report healthy even when another theme replaced the recording hook.', '访问新目录并回到提示符后再比较列表。其他主题覆盖记录 hook 时，诊断工具仍可能显示 healthy。', '新しい場所へ移動しプロンプトを表示してから一覧を比較。テーマが hook を上書きしていても診断が healthy になることがあります。'), command: shellSetup[shell].init, fix: t('Check your real profile and hook settings. In PowerShell, load zoxide after the prompt theme. Check _ZO_EXCLUDE_DIRS before resetting history.', '检查实际配置文件和 hook。PowerShell 应在提示符主题后初始化 zoxide；重置历史前先检查 _ZO_EXCLUDE_DIRS。', '実際の設定と hook を確認。PowerShell はテーマの後で初期化し、履歴を消す前に _ZO_EXCLUDE_DIRS を確認。'), href: p.troubleshooting },
    { id: 'fzf', title: t('zi fails or has no selector', 'zi 失败或没有选择界面', 'zi が動かず選択画面がない'), check: 'fzf --version', result: t('zi needs a separately installed, compatible fzf. Plain z does not need it.', 'zi 需要单独安装兼容的 fzf，普通 z 不需要。', 'zi は別途導入した互換 fzf が必要です。通常の z には不要。'), command: 'zoxide query --list', fix: t('If fzf is missing or incompatible, follow the fzf installation guide. If the directory list is empty, first add a known directory using the No match found check.', 'fzf 缺失或不兼容时按 fzf 指南安装；目录列表为空时，先按 No match found 路径加入已知目录。', 'fzf がないか非互換なら連携ガイドへ。履歴が空なら No match found の手順で既知の場所を追加。'), href: p.fzf },
  ];
}
