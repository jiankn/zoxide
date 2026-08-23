const englishTutorialContent: Record<string, string> = {
  'install-ubuntu': String.raw`# How to install zoxide on Ubuntu 26.04 or 24.04

On Ubuntu 26.04 or 24.04, there are two sensible installation paths. Use Ubuntu's apt package when you value distribution-managed updates and a minimal setup. Use the upstream install script when you want the current zoxide release. Either path still requires shell initialization before the z command exists.

By the end of this guide, zoxide --version will find the binary, type z will find the shell function, and z zoxide-demo will reach a test directory. The most common failed setup completes only the first of those checks, so this tutorial tests them separately.

This page was verified on August 23, 2026. Ubuntu's package catalog listed zoxide 0.9.8 for Ubuntu 26.04 LTS and 0.9.3 for Ubuntu 24.04 LTS, while the current upstream release was 0.10.0. Always use apt-cache policy zoxide and the [upstream releases page](https://github.com/ajeetdsouza/zoxide/releases) to see what is available when you install.

## Choose the installation method first

| Method | Best for | Trade-off |
| --- | --- | --- |
| Ubuntu apt | Managed workstations, servers, and predictable OS updates | The packaged version follows the Ubuntu release |
| Official install script | Current zoxide features on a personal Linux or WSL account | You manage upgrades outside apt |
| Cargo | Developers who already maintain a Rust toolchain | More build time and another PATH location |

The [zoxide installation documentation](https://github.com/ajeetdsouza/zoxide#installation) currently recommends its install script for Linux and WSL. It also marks the Ubuntu package entry as slow-moving. That does not make apt unsafe or unusable. It means you should choose it knowingly rather than assume it matches the latest GitHub release.

## Ubuntu version matrix

| Ubuntu release | apt package checked | fzf package checked | Practical choice |
| --- | --- | --- | --- |
| 26.04 LTS | zoxide 0.9.8 | fzf 0.67.0 | apt is sufficient for z, zi, and current fzf integration |
| 24.04 LTS | zoxide 0.9.3 | fzf 0.44.1 | apt is fine for zoxide, but install a newer fzf before relying on zi |

Package updates can change these exact versions. Treat this table as a verified baseline and confirm the candidate shown by apt on your machine.

## Prerequisites

You need an Ubuntu 26.04 or 24.04 terminal, internet access, and permission to install packages or write to your own home directory. Check the system and current shell before changing anything.

~~~bash
lsb_release -ds
ps -p $$ -o comm=
~~~

The second command usually prints bash on a default Ubuntu installation. If it prints zsh or fish, use the matching configuration section below. WSL users run the same Linux commands inside the Ubuntu shell and edit files in the Linux home directory.

## Method A: install the Ubuntu package with apt

First ask apt which version and repository it will use.

~~~bash
sudo apt update
apt-cache policy zoxide
~~~

On both supported LTS releases, zoxide is published in the universe component. If apt reports a candidate, install it and check the binary.

~~~bash
sudo apt install zoxide
command -v zoxide
zoxide --version
~~~

The expected command path is normally /usr/bin/zoxide. The exact version shown by your machine may be newer than the original 0.9.3 package if Ubuntu has published an update or you enabled another repository.

If apt says Unable to locate package or shows Candidate: (none), enable universe and refresh the package index.

~~~bash
sudo add-apt-repository universe
sudo apt update
apt-cache policy zoxide
sudo apt install zoxide
~~~

Stop here if zoxide --version still fails. Shell initialization cannot fix a missing binary.

## Method B: install the current upstream release

The upstream one-line installer downloads the matching release for the detected Linux architecture and installs the binary under ~/.local/bin by default.

~~~bash
curl -sSfL https://raw.githubusercontent.com/ajeetdsouza/zoxide/main/install.sh | sh
~~~

Do not add sudo to this command for a normal per-user installation. If your environment requires reviewing scripts before execution, download and inspect the same official file first.

~~~bash
curl -sSfL https://raw.githubusercontent.com/ajeetdsouza/zoxide/main/install.sh -o /tmp/zoxide-install.sh
less /tmp/zoxide-install.sh
sh /tmp/zoxide-install.sh
~~~

The [installer source](https://github.com/ajeetdsouza/zoxide/blob/main/install.sh) defines ~/.local/bin as its default binary directory and warns when that directory is absent from PATH. Check both conditions after it finishes.

~~~bash
ls -l "$HOME/.local/bin/zoxide"
command -v zoxide
zoxide --version
~~~

If the file exists but command -v returns nothing, add ~/.local/bin before the zoxide initialization line in your shell profile.

~~~bash
export PATH="$HOME/.local/bin:$PATH"
~~~

For Bash, save that line in ~/.bashrc. For Zsh, save it in ~/.zshrc. Then reload the file or open a new terminal.

## Method C: use Cargo when Rust is already installed

Cargo is a good alternative when the machine already has a maintained Rust toolchain. There is little reason to install the whole toolchain solely for zoxide when the upstream script provides a prebuilt binary.

~~~bash
cargo install zoxide --locked
export PATH="$HOME/.cargo/bin:$PATH"
zoxide --version
~~~

Persist the PATH line in the relevant shell profile. The --locked flag uses the dependency versions recorded by the project for a reproducible build.

## Initialize zoxide in the active shell

Installing the binary does not create z. The z command is a shell function generated by zoxide init, and the initialization line belongs at the end of the shell configuration file so that later aliases or plugins do not overwrite it.

### Bash on the default Ubuntu terminal

Add this to the end of ~/.bashrc.

~~~bash
eval "$(zoxide init bash)"
~~~

Reload Bash and verify the generated function.

~~~bash
source ~/.bashrc
type z
~~~

### Zsh

Add the following line to the end of ~/.zshrc.

~~~bash
eval "$(zoxide init zsh)"
~~~

Then reload and verify.

~~~bash
source ~/.zshrc
type z
~~~

### Fish

Add this line to ~/.config/fish/config.fish.

~~~fish
zoxide init fish | source
~~~

Open a new Fish session and run type z. If zoxide --version works but type z does not, the problem is this initialization step, not the installation method.

## Run an end-to-end test

Create a harmless test directory, add it to the local zoxide database, and jump to it. Run these commands in the interactive shell you just configured.

~~~bash
mkdir -p "$HOME/projects/zoxide-demo"
zoxide add "$HOME/projects/zoxide-demo"
cd "$HOME"
z zoxide-demo
pwd
~~~

The final output should end in /projects/zoxide-demo. You can inspect what zoxide learned without changing directories.

~~~bash
zoxide query zoxide-demo
zoxide query --list
~~~

From here, visit real project directories normally. The ranking becomes useful as zoxide observes repeated and recent visits. The [basic commands guide](/tutorials/basic-commands) covers querying, manual additions, and removing stale entries.

## Check fzf before using zi

fzf is optional. Plain z works without it, while zi uses fzf for interactive selection. The current zoxide documentation requires fzf 0.51.0 or newer. Ubuntu 26.04 currently provides fzf 0.67.0, so its apt package meets that requirement. Ubuntu 24.04 currently provides fzf 0.44.1, so its apt package does not.

Check before installing another copy.

~~~bash
fzf --version
~~~

On Ubuntu 26.04, install the packaged selector with sudo apt install fzf. If the version is below 0.51.0—normally the Ubuntu 24.04 case—and you want zi, use a current method from the [fzf upstream installation guide](https://github.com/junegunn/fzf#installation). Its documented Git installation is:

~~~bash
git clone --depth 1 https://github.com/junegunn/fzf.git ~/.fzf
~/.fzf/install
~~~

Open a new terminal, confirm fzf --version, then try zi. The separate [zoxide and fzf guide](/tutorials/fzf-integration) explains the interactive workflow and version checks in more detail.

## Troubleshooting by symptom

### zoxide: command not found

Run command -v zoxide. For the official installer, check ~/.local/bin; for Cargo, check ~/.cargo/bin. Make sure the corresponding export PATH line appears before zoxide init in the shell profile. type -a zoxide can also reveal an older binary that appears earlier in PATH.

### z: command not found

The binary is installed but the generated shell function was not loaded. Confirm the active shell, check the matching profile, move the init line to the end, and open a new terminal. Our [command-not-found diagnostic guide](/blog/zoxide-command-not-found) separates these cases step by step.

### zoxide: no match found

The database has not learned that destination. Visit it once with cd or add the full path with zoxide add. Use zoxide query --list to confirm that it is recorded.

### zi opens an error or no selector

Run fzf --version and compare it with the upstream minimum. Ubuntu 26.04's current package meets the requirement; Ubuntu 24.04's current package is too old even though apt installs it successfully.

### apt and the official installer both appear in PATH

Run type -a zoxide to see every matching binary. Keep one update path, remove the unwanted installation with the same method that created it, and start a fresh shell. Mixing apt and a per-user binary makes version checks confusing.

## Updating and choosing the next step

For an apt installation, use normal Ubuntu updates and review apt-cache policy zoxide. For the official script, rerun the upstream installer to fetch the current release. For Cargo, rerun cargo install zoxide --locked after updating the Rust toolchain.

Once the installation is stable, compare [zoxide with autojump](/blog/zoxide-vs-autojump) before migrating an existing history, or continue with the basic command and fzf guides above.

## Sources checked

- [zoxide upstream installation and shell setup](https://github.com/ajeetdsouza/zoxide#installation)
- [zoxide official installer source](https://github.com/ajeetdsouza/zoxide/blob/main/install.sh)
- [zoxide upstream releases](https://github.com/ajeetdsouza/zoxide/releases)
- [Ubuntu 26.04 zoxide package](https://packages.ubuntu.com/resolute/zoxide)
- [Ubuntu fzf package search](https://packages.ubuntu.com/search?keywords=fzf&searchon=names)
- [Ubuntu 24.04 zoxide package](https://packages.ubuntu.com/noble/zoxide)
- [Ubuntu 24.04 fzf package](https://packages.ubuntu.com/noble/fzf)
- [fzf upstream installation guide](https://github.com/junegunn/fzf#installation)`,

  'install-macos': String.raw`# Install zoxide on macOS with Homebrew

Homebrew is the shortest supported path on both Apple Silicon and Intel Macs. Installing the binary is only the first half of the setup: the z command appears after you add zoxide init to the shell profile and open a new terminal.

This page was verified on August 23, 2026. Homebrew listed zoxide 0.10.0 as its stable formula and provided bottles for current Apple Silicon macOS releases and Intel Sonoma. Check brew info zoxide on your Mac because available bottles and versions change over time.

## Confirm the Mac and active shell

~~~bash
uname -m
echo "$SHELL"
command -v brew || true
~~~

uname -m prints arm64 on Apple Silicon and x86_64 on Intel. Current macOS accounts normally use Zsh, but configure the shell printed on your machine rather than assuming.

## Method A: install with Homebrew

~~~bash
brew update
brew install zoxide
brew info zoxide
command -v zoxide
zoxide --version
~~~

The normal Homebrew prefix is /opt/homebrew on Apple Silicon and /usr/local on Intel. brew --prefix reports the actual location. Do not hard-code the other architecture's path.

If brew itself is missing after installing Homebrew, load the environment for the current terminal:

~~~bash
eval "$(/opt/homebrew/bin/brew shellenv)"   # Apple Silicon
eval "$(/usr/local/bin/brew shellenv)"      # Intel
~~~

Use only the line whose brew executable exists, then persist the shellenv line using the instructions printed by the Homebrew installer.

## Method B: use Cargo only when Rust is already maintained

~~~bash
cargo install zoxide --locked
export PATH="$HOME/.cargo/bin:$PATH"
command -v zoxide
zoxide --version
~~~

Persist the PATH export in the active shell profile. Installing a Rust toolchain only for zoxide is unnecessary when Homebrew or the official prebuilt installer is available.

## Method C: official prebuilt installer

The upstream installer detects the macOS architecture and installs the matching release. Review the script first when that is required by your environment.

~~~bash
curl -sSfL https://raw.githubusercontent.com/ajeetdsouza/zoxide/main/install.sh -o /tmp/zoxide-install.sh
less /tmp/zoxide-install.sh
sh /tmp/zoxide-install.sh
~~~

Its normal per-user binary directory is ~/.local/bin. If the file exists but command -v zoxide returns nothing, place this before the zoxide init line in ~/.zshrc:

~~~bash
export PATH="$HOME/.local/bin:$PATH"
~~~

## Initialize Zsh

Add this line to the end of ~/.zshrc:

~~~zsh
eval "$(zoxide init zsh)"
~~~

Reload the file or open a new terminal, then verify both the binary and generated shell function:

~~~zsh
source ~/.zshrc
zoxide --version
type z
type zi
~~~

If you use compinit or a Zsh plugin manager, keep zoxide init near the end of the file so an earlier plugin does not overwrite its functions or completion setup.

## Bash and Fish

For Bash, add this to ~/.bashrc:

~~~bash
eval "$(zoxide init bash)"
~~~

For Fish, add this to ~/.config/fish/config.fish:

~~~fish
zoxide init fish | source
~~~

Open a fresh shell after saving the file. The [zoxide init guide](/blog/zoxide-init-guide/) covers other shells and profile-loading problems.

## Run an end-to-end test

~~~bash
mkdir -p "$HOME/Projects/zoxide-demo"
zoxide add "$HOME/Projects/zoxide-demo"
cd "$HOME"
z zoxide-demo
pwd
~~~

The final path should end in /Projects/zoxide-demo. A new zoxide database cannot match directories it has never learned, so this explicit addition makes the first test deterministic.

## Add fzf for interactive selection

Plain z does not require fzf. Install it only when you want zi to show an interactive list.

~~~bash
brew install fzf
fzf --version
zi zoxide-demo
~~~

For selector behavior and customization, continue with the [zoxide and fzf guide](/tutorials/fzf-integration/).

## Troubleshooting by symptom

### zoxide: command not found

Run brew --prefix, brew list zoxide, and command -v zoxide. On Apple Silicon, verify /opt/homebrew/bin is loaded; on Intel, verify /usr/local/bin. For Cargo or the upstream installer, check ~/.cargo/bin or ~/.local/bin instead.

### z: command not found

The binary works but the active shell has not loaded zoxide init. Confirm echo $SHELL, edit the matching profile, put the init line near the end, and open a new terminal. Do not alias z directly to the zoxide binary.

### An old zoxide version runs

~~~bash
type -a zoxide
brew info zoxide
~~~

Multiple package managers can leave several binaries in PATH. Keep one update path and remove the unwanted installation with the package manager that created it.

### zi cannot find fzf

Run command -v fzf and fzf --version. If both work in the terminal but zi still fails, start a fresh shell and inspect whether a plugin redefines zi.

## Sources checked

- [zoxide upstream installation and shell setup](https://github.com/ajeetdsouza/zoxide#installation)
- [zoxide upstream releases](https://github.com/ajeetdsouza/zoxide/releases)
- [zoxide official installer source](https://github.com/ajeetdsouza/zoxide/blob/main/install.sh)
- [Homebrew zoxide formula](https://formulae.brew.sh/formula/zoxide)`,

  'quick-start': String.raw`# Verify zoxide in five minutes

This quick start assumes the zoxide binary is already installed. Its job is deliberately narrow: confirm the binary, shell initialization, learned database, and first smart jump. If you still need an installer, begin on the [download page](/download/). For a complete walkthrough of concepts and workflows, use the [full zoxide guide](/blog/mastering-terminal-navigation-zoxide-guide/).

## 1. Confirm the binary

~~~bash
zoxide --version
~~~

If this fails, fix the installation or PATH before editing shell initialization. The [command-not-found guide](/blog/zoxide-command-not-found/) separates those cases.

## 2. Confirm the z shell command

~~~bash
type z
~~~

The result should describe a function or command generated by zoxide. If zoxide --version works but type z fails, add the correct zoxide init line to your active shell profile and open a new terminal. Follow the [shell initialization guide](/blog/zoxide-init-guide/) for Bash, Zsh, Fish, PowerShell, and Nushell.

## 3. Add and jump to a test directory

~~~bash
mkdir -p "$HOME/projects/zoxide-demo"
zoxide add "$HOME/projects/zoxide-demo"
cd "$HOME"
z zoxide-demo
pwd
~~~

The final path should end in projects/zoxide-demo. Then inspect the learned entry without moving:

~~~bash
zoxide query zoxide-demo
zoxide query --list
~~~

## 4. Check interactive selection if you use fzf

~~~bash
fzf --version
zi zoxide-demo
~~~

Plain z does not require fzf. The zi command does. If zi cannot find fzf or the selector does not open, continue with the [zoxide and fzf guide](/tutorials/fzf-integration/).

## What to read next

- Use the [command reference](/blog/zoxide-commands/) when you need query, add, remove, import, or scoring flags.
- Use the [complete how-to guide](/blog/mastering-terminal-navigation-zoxide-guide/) for a full daily workflow.
- Use [general troubleshooting](/blog/zoxide-not-working/) if the checks fail in more than one layer.`,

  'basic-commands': String.raw`# Practice the basic zoxide commands

This lesson is a short practice sequence for new users. It does not duplicate the full CLI reference. When you need every option, database command, or scripting example, use the [zoxide command reference](/blog/zoxide-commands/).

## Jump with z

Visit a real directory once, return home, and jump back with a memorable fragment.

~~~bash
cd "$HOME/projects/example-api"
cd "$HOME"
z example-api
~~~

Use more than one keyword when names overlap:

~~~bash
z projects api
~~~

## Choose interactively with zi

~~~bash
zi api
~~~

zi requires a compatible fzf installation. If it does not open, follow the [fzf integration guide](/tutorials/fzf-integration/).

## Inspect without jumping

~~~bash
zoxide query api
zoxide query --list api
zoxide query --list --score api
~~~

query prints the directory zoxide would choose. The list and score forms help explain a surprising result.

## Teach or remove an entry

~~~bash
zoxide add "$HOME/projects/example-api"
zoxide remove "$HOME/projects/old-api"
~~~

Use full paths for maintenance commands so you change the intended entry. For flags, imports, scripting, and database diagnosis, continue with the [main command reference](/blog/zoxide-commands/).`,

  'fzf-integration': String.raw`# Use zoxide with fzf and zi

zoxide already provides the zi interactive command. You normally do not need to create a custom zi shell function. Install a compatible fzf release, initialize zoxide in the active shell, and zi will present matching directories for selection.

## Check both prerequisites

~~~bash
zoxide --version
fzf --version
~~~

The current zoxide documentation requires fzf 0.51.0 or newer for interactive selection. Package repositories can lag behind that minimum, so check the printed version rather than assuming that a successful package installation is sufficient.

## Install fzf

~~~bash
# macOS
brew install fzf

# Arch Linux
sudo pacman -S fzf
~~~

On Ubuntu 24.04, the distribution fzf package is older than the current zoxide requirement. Use a current method from the [fzf installation documentation](https://github.com/junegunn/fzf#installation), then open a new terminal and check fzf --version again.

## Initialize zoxide

~~~bash
# Bash: ~/.bashrc
eval "$(zoxide init bash)"

# Zsh: ~/.zshrc
eval "$(zoxide init zsh)"
~~~

~~~fish
# Fish: ~/.config/fish/config.fish
zoxide init fish | source
~~~

For PowerShell and Nushell, use the exact placement shown in the [shell initialization guide](/blog/zoxide-init-guide/).

## Use the built-in selector

~~~bash
zi
zi api
zi projects backend
~~~

Type to narrow the list, move to the desired directory, and press Enter. zoxide supplies candidates in ranking order while fzf handles the interactive interface.

## Customize the selector safely

Use _ZO_FZF_OPTS for zoxide's selector instead of changing FZF_DEFAULT_OPTS for every fzf workflow.

~~~bash
export _ZO_FZF_OPTS="--height=60% --layout=reverse --border"
~~~

Save the variable before the zoxide init line, open a new terminal, and run zi again.

## Troubleshoot by symptom

- zoxide: command not found: fix the binary or PATH on the [installation page](/download/).
- z: command not found: fix shell initialization with the [init guide](/blog/zoxide-init-guide/).
- could not find fzf: check command -v fzf and fzf --version.
- no useful candidates: visit directories normally or add one with zoxide add, then inspect zoxide query --list.
- the wrong directory wins: use the [no-match and ranking guide](/blog/troubleshooting-zoxide-no-match-found/).

The old standalone fzf articles have been consolidated into this page so installation, zi behavior, customization, and errors have one canonical answer.`,
};

const japaneseTutorialContent: Record<string, string> = {
  'quick-start': String.raw`# zoxide クイックスタート

zoxide は、訪問したディレクトリを frecency（頻度と最近の利用）で学習し、短いキーワードから目的の場所へ移動できるツールです。このページでは、インストールから最初のジャンプまでを確認します。

## 1. インストール

macOS:

~~~bash
brew install zoxide
~~~

Windows:

~~~powershell
scoop install zoxide
~~~

Linux では公式インストールスクリプトを利用できます。

~~~bash
curl -sSfL https://raw.githubusercontent.com/ajeetdsouza/zoxide/main/install.sh | sh
~~~

Rust 環境がある場合は Cargo も利用できます。

~~~bash
cargo install zoxide --locked
~~~

## 2. シェルを初期化

インストールしただけでは z コマンドは定義されません。使用中のシェル設定に次の一行を追加します。

~~~bash
# zsh: ~/.zshrc
eval "$(zoxide init zsh)"

# bash: ~/.bashrc
eval "$(zoxide init bash)"
~~~

~~~fish
# fish: ~/.config/fish/config.fish
zoxide init fish | source
~~~

~~~powershell
# PowerShell: $PROFILE
Invoke-Expression (& { (zoxide init powershell | Out-String) })
~~~

設定後に新しいターミナルを開き、type z と zoxide --version で確認します。

## 3. 基本操作

~~~bash
# 一度通常の方法で訪問して学習させる
cd ~/work/client/project

# 次回から短いキーワードで移動
z project

# 候補を対話的に選択（fzf が必要）
zi project

# 候補を一覧表示
z -l project
~~~

最初は履歴が少ないため、普段使うディレクトリを何度か訪問してから試すと結果が安定します。最新仕様は [zoxide 公式 GitHub](https://github.com/ajeetdsouza/zoxide) でも確認してください。`,

  'basic-commands': String.raw`# zoxide 基本コマンド

日常的に使う操作は、ジャンプ、候補確認、手動追加、不要なパスの削除に分けると理解しやすくなります。

## z: 学習済みディレクトリへ移動

~~~bash
z project
z client api
z docs
~~~

複数の単語を渡すと、そのすべてに一致するパスの中から frecency スコアが高い候補を選びます。結果が意図と違う場合は、より具体的な語を追加します。

## zi: 対話的に候補を選択

~~~bash
zi project
~~~

fzf がインストールされていれば候補一覧を絞り込み、Enter で移動できます。同名ディレクトリが多い環境で便利です。

## 候補を確認する

~~~bash
z -l project
zoxide query --list
zoxide query --score project
~~~

スクリプト内でパスだけが必要な場合は zoxide query を使います。

~~~bash
target=$(zoxide query project)
printf '%s\n' "$target"
~~~

## データベースを管理する

~~~bash
zoxide add /full/path/to/project
zoxide remove /full/path/to/old-project
~~~

削除時は省略名ではなく完全なパスを指定すると安全です。通常は存在しないパスが自動的に整理されるため、データベースファイルを直接編集する必要はありません。

## うまく移動できないとき

1. type z でシェル関数が定義されているか確認する。
2. zoxide query --list で対象が学習されているか確認する。
3. 一度 cd で対象ディレクトリへ移動してから、再度 z を試す。
4. 同名候補が多い場合は zi または複数キーワードを使う。`,

  'shell-setup': String.raw`# zoxide のシェル設定

zoxide のバイナリと z コマンドは別物です。zoxide init が出力するシェル関数を起動時に読み込むことで、ディレクトリ移動の記録とスマートジャンプが有効になります。

## Zsh

~/.zshrc の末尾付近に追加します。

~~~bash
eval "$(zoxide init zsh)"
~~~

反映:

~~~bash
source ~/.zshrc
~~~

## Bash

~/.bashrc に追加します。

~~~bash
eval "$(zoxide init bash)"
~~~

macOS などでログインシェルが ~/.bash_profile だけを読む場合は、そこから ~/.bashrc を読み込む設定も確認してください。

## Fish

~~~fish
zoxide init fish | source
~~~

この行を ~/.config/fish/config.fish に保存します。

## PowerShell

$PROFILE でプロファイルの場所を確認し、次を追加します。

~~~powershell
Invoke-Expression (& { (zoxide init powershell | Out-String) })
~~~

プロファイルが存在しない場合:

~~~powershell
New-Item -ItemType File -Path $PROFILE -Force
~~~

## 設定確認

~~~bash
zoxide --version
type z
zoxide query --list
~~~

zoxide --version は動くのに z が見つからない場合、原因はほぼシェル初期化です。設定ファイルの場所、記述順、再読み込みの有無を確認してください。`,

  'advanced-config': String.raw`# zoxide 高度な設定

環境変数は zoxide init より前に定義すると、生成されるシェル関数へ確実に反映できます。変更後は新しいシェルを開いて確認してください。

## 不要なディレクトリを除外

ビルド出力や一時ディレクトリを学習対象から外すと、候補一覧のノイズを減らせます。

~~~bash
export _ZO_EXCLUDE_DIRS="/tmp:/var:/node_modules:/dist:/build"
eval "$(zoxide init zsh)"
~~~

区切り方はプラットフォームに依存するため、利用中のバージョンの公式ドキュメントも確認してください。

## データ保存先

_ZO_DATA_DIR はデータディレクトリを変更します。

~~~bash
export _ZO_DATA_DIR="$HOME/.local/share/zoxide"
~~~

zoxide のデータベースはユーザーごとに管理してください。複数ユーザーや複数プロセスで同じデータベースへ同時に書き込む運用は避け、移行時は停止中にバックアップします。

## データベースの老化しきい値

_ZO_MAXAGE は「保存日数」ではなく、老化アルゴリズムが使う合計 frecency スコアの上限です。

~~~bash
export _ZO_MAXAGE=5000
~~~

値を下げると古く低スコアの項目が整理されやすくなります。変更前後で zoxide query --list と実際の検索結果を比較してください。

## コマンド名を変更

標準の z 以外を使いたい場合:

~~~bash
eval "$(zoxide init zsh --cmd j)"
~~~

既存のエイリアスと衝突しないか type z や type j で確認します。

## 設定を検証する手順

~~~bash
zoxide --version
type z
zoxide query --list
zoxide query --score project
~~~

設定を一度に増やさず、除外設定、保存先、コマンド名の順に一つずつ変更すると問題を切り分けやすくなります。`,

  'fzf-integration': String.raw`# zoxide と fzf の連携

fzf をインストールすると、zoxide init が用意する zi コマンドで候補を対話的に絞り込めます。まずは独自関数を作らず、標準の zi が動くことを確認するのが安全です。

## fzf をインストール

~~~bash
# macOS
brew install fzf

# Ubuntu / Debian
sudo apt install fzf

# Arch Linux
sudo pacman -S fzf
~~~

確認:

~~~bash
fzf --version
type zi
~~~

## 基本操作

~~~bash
zi
zi project
~~~

入力文字で候補を絞り込み、矢印キーまたはショートカットで選択し、Enter で移動します。候補が出ない場合は zoxide query --list で学習データを確認してください。

## fzf の表示を調整

~~~bash
export _ZO_FZF_OPTS="--height 45% --layout=reverse --border"
~~~

この変数は zoxide init より前に設定します。一般的な FZF_DEFAULT_OPTS と競合する場合は、一時的に片方を外して動作を比較します。

## スクリプトで候補を使う

移動せずに選択したパスを別コマンドへ渡す例です。

~~~bash
project_dir=$(zoxide query --list | fzf --prompt="project> ")
[ -n "$project_dir" ] && code "$project_dir"
~~~

プレビューを追加する場合:

~~~bash
project_dir=$(zoxide query --list | fzf --preview 'ls -la {}')
[ -n "$project_dir" ] && cd "$project_dir"
~~~

パスに空白が含まれる可能性があるため、変数は常に引用符で囲みます。eval で任意入力を実行する関数は、意図しないコマンド実行につながるため避けてください。

## トラブルシューティング

- zi が見つからない: シェル初期化を再読み込みする。
- fzf が見つからない: PATH とインストール先を確認する。
- 候補が空: 何度か対象ディレクトリへ移動し、zoxide query --list を確認する。
- 表示が崩れる: _ZO_FZF_OPTS を一度外し、最小構成で再確認する。`,

  'performance': String.raw`# zoxide のパフォーマンス最適化

zoxide の体感速度は、データベースの大きさだけでなく、シェル設定、補完プラグイン、端末、ストレージによって変わります。固定の「何倍」という数字ではなく、自分の環境で同じ条件を測定してください。

## まず計測する

~~~bash
time zoxide query project
time zoxide init zsh >/dev/null
~~~

シェル全体の起動時間は、Zsh なら zprof、一般的な比較なら hyperfine などを使うと再現しやすくなります。

## ノイズの多いパスを除外

~~~bash
export _ZO_EXCLUDE_DIRS="/tmp:/var:/node_modules:/dist:/build"
~~~

除外しすぎると必要な候補まで学習されません。zoxide query --list を確認しながら段階的に追加します。

## _ZO_MAXAGE を理解する

_ZO_MAXAGE は履歴を保持する日数ではありません。データベースの老化アルゴリズムが使う合計 frecency スコアの上限です。

~~~bash
export _ZO_MAXAGE=5000
~~~

値を小さくすると、古く低スコアの項目が早く整理されやすくなります。変更前に現在の候補を記録し、結果を比較してください。

## シェル起動を軽くする

zoxide init 自体だけでなく、テーマ、補完、プラグイン全体を計測します。遅延読み込みを使うと、初回 z 実行前のディレクトリ移動が学習されない場合があるため、単純な常時初期化をまず推奨します。

~~~bash
# ~/.zshrc の他の環境変数設定後に配置
eval "$(zoxide init zsh)"
~~~

## データベースを直接削除しない

通常は存在しないパスが利用時に整理されます。特定の項目だけ消す場合は、ファイルを直接編集せず次を使います。

~~~bash
zoxide remove /full/path/to/old-directory
~~~

データ移行やバックアップが必要な場合は、利用中のプラットフォームのデータディレクトリを確認し、zoxide を使用していない状態でコピーします。`,

  'troubleshooting': String.raw`# zoxide トラブルシューティング

問題は「バイナリがない」「シェル初期化がない」「学習データがない」「候補が競合する」の順に確認すると切り分けやすくなります。

## zoxide command not found

~~~bash
command -v zoxide
zoxide --version
printf '%s\n' "$PATH"
~~~

公式スクリプトでインストールした場合は ~/.local/bin、Cargo の場合は ~/.cargo/bin が PATH に含まれているか確認します。

## z が見つからない

~~~bash
type z
~~~

zoxide はあるのに z がない場合、シェル設定へ zoxide init を追加して再読み込みします。

~~~bash
# zsh
eval "$(zoxide init zsh)"

# bash
eval "$(zoxide init bash)"
~~~

## no match found

~~~bash
zoxide query --list
zoxide add /full/path/to/project
zoxide query project
~~~

新しい環境では学習データがないため、まず通常の cd で対象へ移動するか、zoxide add で完全なパスを追加します。

## 間違った候補へ移動する

~~~bash
z -l project
zi project
zoxide query --score project
~~~

より具体的な複数キーワードを使うか、不要な完全パスを削除します。

~~~bash
zoxide remove /full/path/to/old-project
~~~

## 設定変更が反映されない

設定ファイルを編集した後は、新しいターミナルを開くか source で読み直します。_ZO_EXCLUDE_DIRS や _ZO_MAXAGE は zoxide init より前に設定してください。

問題が続く場合は、zoxide --version、使用シェル、初期化行、再現コマンドを添えて [公式 GitHub Issues](https://github.com/ajeetdsouza/zoxide/issues) を確認します。`,

  'install-ubuntu': String.raw`# Ubuntu 24.04 に zoxide をインストールする方法

Ubuntu 24.04 では、apt と上流の公式インストールスクリプトのどちらでも zoxide を導入できます。OS の更新にまとめて管理したいなら apt、現在の上流版を使いたいなら公式スクリプトが向いています。どちらを選んでも、インストール後にシェル初期化を行わない限り z コマンドは作られません。

このガイドでは zoxide --version、type z、テスト用ディレクトリへのジャンプを順番に確認します。よくある失敗は、バイナリだけが入り、z を生成する初期化行が読み込まれていない状態です。二つを分けて調べると、原因を短時間で絞れます。

内容は 2026 年 8 月 6 日に確認しました。この時点で Ubuntu 24.04 LTS のパッケージは zoxide 0.9.3、上流の最新安定版は 0.10.0 です。実際に導入するときは apt-cache policy zoxide と [上流のリリース一覧](https://github.com/ajeetdsouza/zoxide/releases) を確認してください。

## 最初に導入方法を選ぶ

| 方法 | 向いている環境 | 注意点 |
| --- | --- | --- |
| Ubuntu の apt | 管理端末、サーバー、OS 更新に統一したい環境 | Ubuntu 24.04 の版は上流より古い |
| 公式インストールスクリプト | 個人用 Linux、WSL、現在の機能が必要な環境 | apt の外で更新を管理する |
| Cargo | すでに Rust ツールチェーンを管理している開発環境 | ビルド時間と別の PATH 設定が必要 |

[zoxide のインストール文書](https://github.com/ajeetdsouza/zoxide#installation) は、Linux と WSL では公式スクリプトを推奨しています。Ubuntu のパッケージ行は、更新が遅いという注記付きです。apt が使えないという意味ではありません。必要な版と管理方針を見て選びます。

## 事前確認

Ubuntu 24.04 のターミナル、ネット接続、パッケージを入れる権限または自分のホームへ書き込む権限が必要です。変更前に OS と現在のシェルを確認します。

~~~bash
lsb_release -ds
ps -p $$ -o comm=
~~~

通常の Ubuntu ターミナルでは二つ目が bash と表示されます。zsh や fish が出た場合は、後の対応セクションを使ってください。WSL でも Linux 側の Ubuntu シェルで同じコマンドを実行し、Linux ホームにある設定ファイルを編集します。

## 方法 A　apt で Ubuntu パッケージを入れる

まず、apt が選ぶ版と配布元を確認します。

~~~bash
sudo apt update
apt-cache policy zoxide
~~~

Ubuntu 24.04 の zoxide は universe にあります。Candidate が表示されたらインストールし、バイナリを確認します。

~~~bash
sudo apt install zoxide
command -v zoxide
zoxide --version
~~~

通常は /usr/bin/zoxide が表示されます。Ubuntu の更新や追加リポジトリによって、実際の版は当初の 0.9.3 より新しい場合があります。手元の apt-cache policy の結果を優先してください。

Unable to locate package または Candidate: (none) が出る場合は universe を有効にし、索引を更新します。

~~~bash
sudo add-apt-repository universe
sudo apt update
apt-cache policy zoxide
sudo apt install zoxide
~~~

zoxide --version が動かないままなら、ここで止めてパッケージの問題を解決します。シェル初期化は、存在しないバイナリを直せません。

## 方法 B　現在の上流版を入れる

公式の一行インストーラーは Linux のアーキテクチャを判定し、対応するリリースを取得します。既定のインストール先は ~/.local/bin です。

~~~bash
curl -sSfL https://raw.githubusercontent.com/ajeetdsouza/zoxide/main/install.sh | sh
~~~

通常のユーザー単位の導入では、このコマンドに sudo を付けません。実行前にスクリプトを読む運用なら、同じ公式ファイルを一度保存して確認できます。

~~~bash
curl -sSfL https://raw.githubusercontent.com/ajeetdsouza/zoxide/main/install.sh -o /tmp/zoxide-install.sh
less /tmp/zoxide-install.sh
sh /tmp/zoxide-install.sh
~~~

[公式インストーラーのソース](https://github.com/ajeetdsouza/zoxide/blob/main/install.sh) では、バイナリの既定先が ~/.local/bin と定義されています。この場所が PATH にない場合は、終了時にも警告が出ます。

~~~bash
ls -l "$HOME/.local/bin/zoxide"
command -v zoxide
zoxide --version
~~~

ファイルはあるのに command -v で見つからない場合、zoxide init より前に次の行をシェル設定へ保存します。Bash は ~/.bashrc、Zsh は ~/.zshrc を使います。

~~~bash
export PATH="$HOME/.local/bin:$PATH"
~~~

設定を読み直すか、新しいターミナルを開いて再確認します。

## 方法 C　Rust 環境がある場合は Cargo を使う

すでに Rust ツールチェーンを保守している端末なら Cargo も選べます。zoxide だけのために Rust 全体を入れるより、上流スクリプトのビルド済みバイナリを使う方が簡単です。

~~~bash
cargo install zoxide --locked
export PATH="$HOME/.cargo/bin:$PATH"
zoxide --version
~~~

PATH の行は利用中のシェル設定へ保存します。--locked は、プロジェクトが記録した依存関係の版でビルドするための指定です。

## 利用中のシェルを初期化する

バイナリを入れただけでは z は定義されません。z は zoxide init が生成するシェル関数です。後続のエイリアスやプラグインに上書きされにくいよう、上流文書どおり設定ファイルの末尾へ追加します。

### Ubuntu 標準の Bash

~/.bashrc の末尾へ追加します。

~~~bash
eval "$(zoxide init bash)"
~~~

読み直して関数を確認します。

~~~bash
source ~/.bashrc
type z
~~~

### Zsh

~/.zshrc の末尾へ追加します。

~~~bash
eval "$(zoxide init zsh)"
~~~

~~~bash
source ~/.zshrc
type z
~~~

### Fish

~/.config/fish/config.fish へ追加します。

~~~fish
zoxide init fish | source
~~~

新しい Fish を開いて type z を実行します。zoxide --version は動くのに type z が失敗する場合、インストール方法ではなく、この初期化を確認してください。

## 最初のジャンプまで確認する

テスト用ディレクトリを作り、ローカルデータベースへ明示的に追加してからジャンプします。設定した対話シェルで一行ずつ実行してください。

~~~bash
mkdir -p "$HOME/projects/zoxide-demo"
zoxide add "$HOME/projects/zoxide-demo"
cd "$HOME"
z zoxide-demo
pwd
~~~

最後の表示が /projects/zoxide-demo で終われば、バイナリ、シェル関数、データベース検索が一通り動いています。移動せずに登録内容を見ることもできます。

~~~bash
zoxide query zoxide-demo
zoxide query --list
~~~

以後は普段どおり実際のプロジェクトへ移動します。訪問回数と最近の利用が蓄積されるにつれて順位が役立つようになります。query、add、remove の使い分けは [基本コマンドガイド](/tutorials/basic-commands) で確認できます。

## Ubuntu 24.04 の fzf は版に注意する

fzf は任意です。通常の z は fzf なしで動き、zi が対話選択に fzf を使います。現在の zoxide 文書が求める最小版は fzf 0.51.0 です。一方、Ubuntu 24.04 のカタログは fzf 0.44.1 を提供しているため、sudo apt install fzf だけでは現在の上流要件を満たしません。

すでに入っている版を先に調べます。

~~~bash
fzf --version
~~~

0.51.0 未満で zi を使いたい場合は、[fzf 上流のインストールガイド](https://github.com/junegunn/fzf#installation) にある現在の方法を選びます。文書化されている Git 導入は次のとおりです。

~~~bash
git clone --depth 1 https://github.com/junegunn/fzf.git ~/.fzf
~/.fzf/install
~~~

新しいターミナルで fzf --version を再確認し、zi を試します。詳しい切り分けは [zoxide と fzf の連携ガイド](/tutorials/fzf-integration) にまとめています。

## 症状ごとのトラブルシューティング

### zoxide: command not found

command -v zoxide を実行します。公式スクリプトなら ~/.local/bin、Cargo なら ~/.cargo/bin を調べ、対応する PATH 行が zoxide init より前にあるか確認します。type -a zoxide を使うと、PATH の手前に残った旧版も見つけられます。

### z: command not found

バイナリはありますが、生成されたシェル関数が読み込まれていません。現在のシェル、対応する設定ファイル、末尾の init 行を確認し、新しいターミナルを開きます。[command not found の診断ガイド](/blog/zoxide-command-not-found) でも順番に切り分けられます。

### zoxide: no match found

対象がまだデータベースにありません。一度 cd で訪れるか、完全パスを zoxide add で追加します。zoxide query --list で記録を確認してください。

### zi で選択画面が出ない

fzf --version を上流の最小要件と比較します。Ubuntu 24.04 の既定パッケージはインストール自体に成功しても、現在の要件より古い点に注意が必要です。

### apt 版とユーザー版が両方見つかる

type -a zoxide で全候補を表示します。更新経路を一つに決め、不要な方を導入時と同じ方法で削除してから、新しいシェルを開きます。二つを混在させると、表示版と更新元が分かりにくくなります。

## 更新後の進み方

apt 版は通常の Ubuntu 更新で管理し、apt-cache policy zoxide で候補を確認します。公式スクリプト版は同じ上流インストーラーを再実行します。Cargo 版は Rust 環境を更新したうえで cargo install zoxide --locked を再実行します。

安定して動いたら、既存履歴を移す前に [zoxide と autojump の比較](/blog/zoxide-vs-autojump) を読み、上の基本コマンドまたは fzf ガイドへ進んでください。

## 確認した資料

- [zoxide 上流のインストールとシェル設定](https://github.com/ajeetdsouza/zoxide#installation)
- [zoxide 公式インストーラーのソース](https://github.com/ajeetdsouza/zoxide/blob/main/install.sh)
- [zoxide 上流リリース](https://github.com/ajeetdsouza/zoxide/releases)
- [Ubuntu 24.04 の zoxide パッケージ](https://packages.ubuntu.com/noble/zoxide)
- [Ubuntu 24.04 の fzf パッケージ](https://packages.ubuntu.com/noble/fzf)
- [fzf 上流のインストールガイド](https://github.com/junegunn/fzf#installation)`,

  'install-macos': String.raw`# macOS に zoxide をインストール

macOS では Homebrew が最も簡単です。Apple Silicon と Intel で Homebrew のパスが異なるため、インストール後に command -v で確認します。

## Homebrew

~~~bash
brew update
brew install zoxide
zoxide --version
~~~

Apple Silicon で brew が見つからない場合:

~~~bash
eval "$(/opt/homebrew/bin/brew shellenv)"
~~~

Intel Mac では通常 /usr/local/bin/brew を利用します。

## Cargo

Rust 環境がある場合:

~~~bash
cargo install zoxide --locked
export PATH="$HOME/.cargo/bin:$PATH"
~~~

## Zsh の設定

現在の macOS の標準シェルは通常 Zsh です。~/.zshrc に追加します。

~~~bash
eval "$(zoxide init zsh)"
~~~

反映:

~~~bash
source ~/.zshrc
type z
~~~

## Bash または Fish

~~~bash
# Bash: ~/.bashrc
eval "$(zoxide init bash)"
~~~

~~~fish
# Fish: ~/.config/fish/config.fish
zoxide init fish | source
~~~

## 動作確認

~~~bash
command -v zoxide
zoxide --version
cd ~/Documents
z Documents
~~~

zoxide は起動後に訪問履歴を学習します。導入直後に候補がない場合は、普段使うディレクトリへ一度移動してから zoxide query --list を確認してください。

## よくある問題

- zoxide はあるが z がない: ~/.zshrc の初期化行と source を確認。
- brew がない: Homebrew の shellenv を設定。
- 古いバイナリが使われる: type -a zoxide で複数のインストール先を確認。
- 補完や既存の z と競合する: type z で実際に呼ばれる関数を確認。`,
};

const chineseTutorialContent: Record<string, string> = {
  'install-ubuntu': String.raw`# 在 Ubuntu 24.04 安装 zoxide

Ubuntu 24.04 可以通过 apt 或 zoxide 上游安装脚本完成安装。希望由系统统一更新时选 apt，希望使用当前上游版本时选官方脚本。无论走哪条路径，安装结束后都要配置 Shell，否则系统能找到 zoxide 二进制文件，终端里却没有 z 命令。

这篇教程会依次验证 zoxide --version、type z 和一次真实目录跳转。最常见的失败正好发生在前两项之间。二进制已经安装，生成 z 函数的初始化行却没有加载。把两项分开检查，排查会清楚很多。

文中版本信息核对于 2026 年 8 月 6 日。当时 Ubuntu 24.04 LTS 软件包提供 zoxide 0.9.3，上游最新稳定版为 0.10.0。你实际安装时，应以本机 apt-cache policy zoxide 和 [上游发行页面](https://github.com/ajeetdsouza/zoxide/releases) 为准。

## 先选安装方式

| 方式 | 适合的环境 | 需要接受的取舍 |
| --- | --- | --- |
| Ubuntu apt | 受管理的工作站、服务器、希望跟随系统更新的环境 | Ubuntu 24.04 提供的版本落后于上游 |
| 官方安装脚本 | 个人 Linux、WSL、需要当前功能的环境 | 更新不归 apt 管理 |
| Cargo | 已经维护 Rust 工具链的开发环境 | 需要编译时间和另一处 PATH 配置 |

[zoxide 上游安装说明](https://github.com/ajeetdsouza/zoxide#installation) 目前把官方脚本列为 Linux 和 WSL 的推荐方式，并在 Ubuntu 软件包旁标注发行版更新较慢。apt 仍然可以正常使用，只是选择前要先确认版本是否满足需求。

## 开始前的检查

你需要一台 Ubuntu 24.04 设备、可用网络，以及安装系统软件包或写入个人主目录的权限。修改配置前先确认系统和当前 Shell。

~~~bash
lsb_release -ds
ps -p $$ -o comm=
~~~

Ubuntu 默认终端通常会在第二条命令输出 bash。如果看到 zsh 或 fish，请使用后文对应的配置。WSL 用户也在 Ubuntu Shell 中运行这些 Linux 命令，并修改 Linux 主目录下的配置文件。

## 方式一　使用 apt 安装

先让 apt 显示候选版本和软件源。

~~~bash
sudo apt update
apt-cache policy zoxide
~~~

Ubuntu 24.04 的 zoxide 位于 universe 软件源。看到 Candidate 后即可安装，再检查二进制文件。

~~~bash
sudo apt install zoxide
command -v zoxide
zoxide --version
~~~

command -v 通常会输出 /usr/bin/zoxide。如果 Ubuntu 已发布更新，或设备启用了其他软件源，本机版本可能高于最初的 0.9.3。这里应信任本机 apt-cache policy 的结果。

如果 apt 提示 Unable to locate package，或 Candidate 显示为空，先启用 universe 并刷新索引。

~~~bash
sudo add-apt-repository universe
sudo apt update
apt-cache policy zoxide
sudo apt install zoxide
~~~

若 zoxide --version 仍然失败，先停在这一步解决软件包问题。Shell 初始化无法修复一个不存在的二进制文件。

## 方式二　安装当前上游版本

官方脚本会识别 Linux 架构，下载匹配的发行文件，并默认把二进制文件放到 ~/.local/bin。

~~~bash
curl -sSfL https://raw.githubusercontent.com/ajeetdsouza/zoxide/main/install.sh | sh
~~~

普通的个人安装不要在前面添加 sudo。如果工作环境要求执行前先审查脚本，可以下载同一份官方文件，阅读后再运行。

~~~bash
curl -sSfL https://raw.githubusercontent.com/ajeetdsouza/zoxide/main/install.sh -o /tmp/zoxide-install.sh
less /tmp/zoxide-install.sh
sh /tmp/zoxide-install.sh
~~~

[官方安装脚本源码](https://github.com/ajeetdsouza/zoxide/blob/main/install.sh) 把 ~/.local/bin 定义为默认二进制目录。如果这个目录不在 PATH 中，脚本结束时也会给出提醒。

~~~bash
ls -l "$HOME/.local/bin/zoxide"
command -v zoxide
zoxide --version
~~~

文件存在而 command -v 没有输出时，把下面一行写入 Shell 配置，并放在 zoxide init 之前。Bash 使用 ~/.bashrc，Zsh 使用 ~/.zshrc。

~~~bash
export PATH="$HOME/.local/bin:$PATH"
~~~

保存后重新加载配置，或打开一个新终端再检查。

## 方式三　已有 Rust 时使用 Cargo

设备本来就在维护 Rust 工具链时，Cargo 是合理选择。如果只是为了安装 zoxide，引入整套 Rust 工具链会增加维护成本，上游脚本提供的预编译文件更省事。

~~~bash
cargo install zoxide --locked
export PATH="$HOME/.cargo/bin:$PATH"
zoxide --version
~~~

PATH 这一行也要保存到当前 Shell 的配置文件。--locked 会按项目锁定的依赖版本编译，结果更容易复现。

## 初始化当前 Shell

安装二进制文件不会自动创建 z。z 是 zoxide init 生成的 Shell 函数。按照上游说明，把初始化行放在配置文件末尾，可以减少后续别名或插件覆盖它的机会。

### Ubuntu 默认 Bash

在 ~/.bashrc 末尾加入下面一行。

~~~bash
eval "$(zoxide init bash)"
~~~

重新加载后检查生成的函数。

~~~bash
source ~/.bashrc
type z
~~~

### Zsh

在 ~/.zshrc 末尾加入初始化行。

~~~bash
eval "$(zoxide init zsh)"
~~~

~~~bash
source ~/.zshrc
type z
~~~

### Fish

把下面一行写入 ~/.config/fish/config.fish。

~~~fish
zoxide init fish | source
~~~

打开新的 Fish 会话并运行 type z。如果 zoxide --version 正常，type z 却失败，问题落在初始化环节，可以暂时排除安装方式。

## 完成一次端到端验证

创建一个无害的测试目录，手动加入本地数据库，再使用 z 跳转。请在刚刚配置好的交互式 Shell 中逐行执行。

~~~bash
mkdir -p "$HOME/projects/zoxide-demo"
zoxide add "$HOME/projects/zoxide-demo"
cd "$HOME"
z zoxide-demo
pwd
~~~

最后一行应以 /projects/zoxide-demo 结尾。到这里，二进制文件、Shell 函数和数据库查询都已经通过。还可以在不改变目录的情况下查看结果。

~~~bash
zoxide query zoxide-demo
zoxide query --list
~~~

之后照常访问真实项目。访问次数和最近使用记录逐渐积累，排名才会越来越贴合习惯。[基础命令教程](/tutorials/basic-commands) 继续讲解 query、add 和 remove 的使用边界。

## Ubuntu 24.04 的 fzf 版本问题

fzf 不是普通 z 命令的依赖，只有 zi 的交互选择需要它。zoxide 当前文档要求 fzf 0.51.0 或更高版本，而 Ubuntu 24.04 软件包目前提供 fzf 0.44.1。因此，sudo apt install fzf 虽然能安装成功，却没有达到当前上游要求。

安装另一份之前先看本机版本。

~~~bash
fzf --version
~~~

版本低于 0.51.0 且确实需要 zi 时，按 [fzf 上游安装说明](https://github.com/junegunn/fzf#installation) 选择当前版本。上游文档给出的 Git 安装方式如下。

~~~bash
git clone --depth 1 https://github.com/junegunn/fzf.git ~/.fzf
~/.fzf/install
~~~

打开新终端，确认 fzf --version 后再运行 zi。有关交互选择和版本检查的细节，可以继续看 [zoxide 与 fzf 配置教程](/tutorials/fzf-integration)。

## 按症状排查

### 出现 zoxide command not found

先运行 command -v zoxide。官方脚本对应 ~/.local/bin，Cargo 对应 ~/.cargo/bin。确认相应 PATH 配置位于 zoxide init 之前。type -a zoxide 还能找出 PATH 前部残留的旧版本。

### 出现 z command not found

二进制文件已经存在，生成的 Shell 函数没有加载。核对当前 Shell、对应配置文件和末尾的 init 行，再打开新终端。[command not found 排查教程](/blog/zoxide-command-not-found) 对这些情况做了逐步拆分。

### 出现 zoxide no match found

数据库还没有目标记录。先用 cd 访问一次，或用 zoxide add 加入完整路径，再通过 zoxide query --list 确认。

### zi 没有出现选择界面

运行 fzf --version 并对照上游最低要求。Ubuntu 24.04 默认 fzf 软件包版本偏低，安装成功也可能无法满足当前 zoxide 的要求。

### apt 版本和个人版本同时出现

运行 type -a zoxide 查看所有候选。保留一条更新路径，用原来的安装方式移除另一份，然后重新打开 Shell。两种版本混用，会让版本显示和升级来源变得难以判断。

## 后续更新与阅读

apt 版本跟随 Ubuntu 常规更新，并用 apt-cache policy zoxide 查看候选。官方脚本版本可以重新运行同一个上游安装器。Cargo 版本则在更新 Rust 工具链后，再运行 cargo install zoxide --locked。

安装稳定后，如果你准备迁移旧目录历史，可以先读 [zoxide 与 autojump 的实际对比](/blog/zoxide-vs-autojump)。只想继续学习日常操作，则进入前面的基础命令或 fzf 教程。

## 核对资料

- [zoxide 上游安装与 Shell 配置](https://github.com/ajeetdsouza/zoxide#installation)
- [zoxide 官方安装脚本源码](https://github.com/ajeetdsouza/zoxide/blob/main/install.sh)
- [zoxide 上游发行页面](https://github.com/ajeetdsouza/zoxide/releases)
- [Ubuntu 24.04 zoxide 软件包](https://packages.ubuntu.com/noble/zoxide)
- [Ubuntu 24.04 fzf 软件包](https://packages.ubuntu.com/noble/fzf)
- [fzf 上游安装说明](https://github.com/junegunn/fzf#installation)`,

  'install-macos': String.raw`# 在 macOS 上安装 zoxide

macOS 上推荐使用 Homebrew。Apple Silicon 与 Intel Mac 的 Homebrew 路径不同，安装后应使用 command -v 检查实际调用的二进制文件。

## Homebrew 安装

~~~bash
brew update
brew install zoxide
zoxide --version
~~~

Apple Silicon 如果找不到 brew：

~~~bash
eval "$(/opt/homebrew/bin/brew shellenv)"
~~~

## Cargo 安装

已有 Rust 环境时：

~~~bash
cargo install zoxide --locked
export PATH="$HOME/.cargo/bin:$PATH"
~~~

## 配置 Zsh

macOS 默认通常使用 Zsh。在 ~/.zshrc 中添加：

~~~bash
eval "$(zoxide init zsh)"
~~~

然后重新加载：

~~~bash
source ~/.zshrc
type z
~~~

## Bash 与 Fish

~~~bash
# Bash: ~/.bashrc
eval "$(zoxide init bash)"
~~~

~~~fish
# Fish: ~/.config/fish/config.fish
zoxide init fish | source
~~~

## 验证使用

~~~bash
command -v zoxide
zoxide --version
cd ~/Documents
z Documents
zoxide query --list
~~~

刚安装时 zoxide 还没有足够的访问记录。先进入几个常用目录，再使用 z 或 zi 测试。若系统存在多个 zoxide，可运行 type -a zoxide 检查旧版本是否抢占 PATH。`,
};

const localizedTutorialContent: Record<string, Record<string, string>> = {
  en: englishTutorialContent,
  ja: japaneseTutorialContent,
  zh: chineseTutorialContent,
};

export function getTutorialContentOverride(locale: string, slug: string): string | undefined {
  return localizedTutorialContent[locale]?.[slug];
}
