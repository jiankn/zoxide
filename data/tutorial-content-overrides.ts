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

  'install-ubuntu': String.raw`# Ubuntu に zoxide をインストール

Ubuntu や Debian 系では、ディストリビューションのパッケージが最新リリースより遅れる場合があります。最新版が必要なら公式インストールスクリプトを優先し、組織の運用方針で apt が必要な場合は利用可能なバージョンを確認してください。

## 公式インストールスクリプト

~~~bash
curl -sSfL https://raw.githubusercontent.com/ajeetdsouza/zoxide/main/install.sh | sh
~~~

インストール後:

~~~bash
command -v zoxide
zoxide --version
~~~

見つからない場合は ~/.local/bin を PATH に追加します。

~~~bash
export PATH="$HOME/.local/bin:$PATH"
~~~

この行は ~/.bashrc または ~/.zshrc に保存します。

## apt を使う場合

~~~bash
sudo apt update
apt policy zoxide
sudo apt install zoxide
~~~

apt policy で候補バージョンを確認し、必要な機能が含まれるか公式リリースと比較してください。

## Cargo を使う場合

~~~bash
cargo install zoxide --locked
~~~

Cargo の実行ファイルは通常 ~/.cargo/bin に入ります。

## シェル初期化

~~~bash
# Bash: ~/.bashrc
eval "$(zoxide init bash)"

# Zsh: ~/.zshrc
eval "$(zoxide init zsh)"
~~~

Fish:

~~~fish
zoxide init fish | source
~~~

## 動作確認

~~~bash
type z
cd ~/projects/example
z example
zoxide query --list
~~~

zoxide --version は動くのに z が見つからない場合、インストールではなくシェル初期化を確認します。ダウンロード元と最新手順は [zoxide 公式 GitHub](https://github.com/ajeetdsouza/zoxide) を参照してください。`,

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
  'install-ubuntu': String.raw`# 在 Ubuntu 上安装 zoxide

Ubuntu 和 Debian 软件源中的 zoxide 版本可能落后于官方最新版本。如果希望跟随最新功能，优先使用官方安装脚本；如果组织环境要求使用 apt，请先查看候选版本。

## 方法一：官方安装脚本

~~~bash
curl -sSfL https://raw.githubusercontent.com/ajeetdsouza/zoxide/main/install.sh | sh
~~~

安装后验证：

~~~bash
command -v zoxide
zoxide --version
~~~

如果命令未找到，确认 ~/.local/bin 已加入 PATH：

~~~bash
export PATH="$HOME/.local/bin:$PATH"
~~~

## 方法二：apt

~~~bash
sudo apt update
apt policy zoxide
sudo apt install zoxide
~~~

使用 apt policy 对照仓库版本与 [zoxide 官方 Releases](https://github.com/ajeetdsouza/zoxide/releases)，确认所需参数和 Shell 支持已经包含。

## 方法三：Cargo

~~~bash
cargo install zoxide --locked
export PATH="$HOME/.cargo/bin:$PATH"
~~~

## 配置 Shell

~~~bash
# Bash: ~/.bashrc
eval "$(zoxide init bash)"

# Zsh: ~/.zshrc
eval "$(zoxide init zsh)"
~~~

Fish:

~~~fish
zoxide init fish | source
~~~

## 验证

~~~bash
type z
cd ~/projects/example
z example
zoxide query --list
~~~

如果 zoxide --version 正常而 z 不存在，问题通常是 Shell 初始化尚未加载，而不是安装失败。`,

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
  ja: japaneseTutorialContent,
  zh: chineseTutorialContent,
};

export function getTutorialContentOverride(locale: string, slug: string): string | undefined {
  return localizedTutorialContent[locale]?.[slug];
}
