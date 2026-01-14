---
title: "Macにzoxideをインストール：導入手順、対応シェル、タブ補完までまとめて解説"
description: "「zoxide mac インストール」「Macにzoxideをインストール」「zoxide 対応シェル」「zoxide タブ補完」などを一気に解決するmacOS向けセットアップ記事。"
keywords: ["zoxide mac インストール", "Macにzoxideをインストール", "zoxide init", "zoxide 対応シェル", "zoxide タブ補完", "zoxide オートコンプリート"]
slug: "mac-ni-zoxide-install-init-completion"
---

# Macにzoxideをインストール：導入手順、対応シェル、タブ補完までまとめて解説

「**zoxide mac インストール**」で検索して導入したのに、`z` を打っても動かない——このパターンはかなり多いです。原因はたいてい一つ。

> zoxide は“バイナリを入れただけ”では使えません。**`zoxide init` でシェルに統合（初期化）**して初めて `z` が有効になります。

macOS では Zsh が標準なので、まずは Zsh を前提にしつつ、Bash/Fish でも使えるように整理します。この記事では **インストール、初期化、対応シェル、タブ補完（オートコンプリート）、fzf連携、よくある詰まりどころ** をまとめて解説します。

---

## 1) zoxideをMacにインストールする方法

### Homebrew（定番）

```bash
brew install zoxide
```

### Cargo（最新版を追いたい場合）

```bash
cargo install zoxide --locked
```

インストール後は必ず確認：

```bash
zoxide --version
which zoxide
```

`which zoxide` が空なら PATH の問題なので、先にそこを直してください。

---

## 2) zoxideはどのシェルで使える？（zoxide 対応シェル）

macOS でよく使われるのは：

- **Zsh**（デフォルト）
- **Bash**（古い環境・好みで使う人も）
- **Fish**（インタラクティブ派に人気）

zoxide は主要シェルに対応しており、必要なのは“そのシェル向けの init 行”だけです。

---

## 3) いちばん重要：`zoxide init`（シェル統合）

`zoxide init <shell>` は設定ファイルを勝手に書き換えるのではなく、**シェル用スクリプトを出力**します。そのスクリプトを `.zshrc` などに入れて起動時に評価することで、

- `z` / `zi` 関数の定義
- ディレクトリ移動の履歴記録（hook）
- 補完や対話選択に関するロジック

が有効になります。

---

## 4) macOSのシェル別：設定の“正解”

### Zsh（標準）

`~/.zshrc` に追記：

```zsh
eval "$(zoxide init zsh)"
```

反映：

```zsh
source ~/.zshrc
```

**プラグイン順の注意**：oh-my-zsh などを使っているなら、プラグイン読み込み後に init を置くと衝突しにくいです（`z` の再定義や補完の上書き回避）。

### Bash

`~/.bashrc`（またはログイン設定によっては `~/.bash_profile`）に追記：

```bash
eval "$(zoxide init bash)"
```

### Fish

`~/.config/fish/config.fish` に追記：

```fish
zoxide init fish | source
```

---

## 5) タブ補完はある？（zoxide タブ補完 / オートコンプリート）

「**zoxide タブ補完**」で探す人は多いですが、結論としては **補完は用意されていて、体験はシェル設定に依存**します。

タブ補完が効かないときの典型原因：

1. init 行が読み込まれていない（編集したファイルが違う、再読み込みしていない）
2. プラグインやテーマが `z` を上書きしている
3. そもそも補完システムが有効になっていない（ミニマル設定）

まずは `type z` で `z` が関数として定義されているか確認し、次にプラグイン衝突を疑うのが最短です。

---

## 6) `zi` + fzf で“ディレクトリ検索”を快適に

zoxide は `zi` で候補から選ぶ対話モードが使えます。macOS では fzf を入れるだけで体験がかなり上がります。

```bash
brew install fzf
```

あとは：

```bash
zi
```

で検索・選択のUIが出ればOKです。

---

## 7) さらに進める：`cd` を賢くする（--cmd cd）

「`cd` と `z` を使い分けたくない」なら、`--cmd cd` で `cd` にzoxideの挙動を持たせられます：

```zsh
eval "$(zoxide init zsh --cmd cd)"
```

ただし、Zsh の元々の `cd` 体験やプラグイン挙動と差が出るケースもあります。まずは通常の `z` を安定させてから切り替えるのが安全です。

---

## まとめ

macOS で zoxide を快適に使うポイントはシンプルです。

1) zoxide をインストール  
2) **`zoxide init` をシェル設定に追加して有効化**  
3) 必要なら fzf を入れて `zi` を強化

これだけで、深いパス移動のストレスが一気に減ります。
