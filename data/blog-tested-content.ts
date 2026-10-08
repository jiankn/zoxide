// 实测改写的博客正文（2026-10-08，全新 ubuntu:24.04 容器 + tmux 真实终端）。
// 优先级高于 messages 中的旧正文，由 getBlogContentOverride 读取。
export const testedBlogContent: Record<string, Record<string, string>> = {
  'zoxide-command-not-found': {
    en: String.raw`# zoxide command not found: how to fix it

"command not found" can mean two different problems, and the fix depends on which word the shell could not find. If it says zoxide, the binary is missing or not on PATH. If it says z, the binary is fine and the shell was never told about zoxide. Every message on this page comes from a real run.

## Test environment

| Item | Value |
| --- | --- |
| Tested on | October 8, 2026 |
| Linux | Fresh official ubuntu:24.04 container; bash 5.2.21, zsh 5.9, fish 3.7.0, driven through tmux |
| zoxide | 0.10.0 from the official install script |
| Also used | Our earlier [Windows](/tutorials/install-windows/) (PowerShell 7.6.6) and [macOS](/tutorials/install-macos/) (zsh 5.9) tests |

## Which message do you see?

| Message | Shell | Meaning |
| --- | --- | --- |
| bash: zoxide: command not found | bash | The zoxide binary is not on PATH |
| zsh:1: command not found: zoxide | zsh (macOS test) | The zoxide binary is not on PATH |
| bash: z: command not found | bash | zoxide is installed, but the init line has not run |
| zsh: command not found: z | zsh | zoxide is installed, but the init line has not run |
| fish: Unknown command: z | fish | zoxide is installed, but the init line has not run |
| The term 'z' is not recognized as a name of a cmdlet... | PowerShell | zoxide is installed, but the profile has no init line |

Run this first. It tells you which half is broken:

~~~bash
command -v zoxide && zoxide --version
type z
~~~

In our test, a machine with zoxide installed but not initialized printed zoxide 0.10.0 for the first line and bash: type: z: not found for the second.

## Case 1: zoxide itself is not found

On a fresh system both commands fail:

~~~text
~$ zoxide --version
bash: zoxide: command not found
~$ z api
bash: z: command not found
~~~

Install zoxide first; the [download page](/download/) lists every method. Then check where it went:

- The official install script puts it in ~/.local/bin. On Ubuntu, the default ~/.profile adds that folder to PATH at the next login, so a new login fixes it; until then, add export PATH="$HOME/.local/bin:$PATH" to ~/.bashrc. Details are in the [Ubuntu guide](/tutorials/install-ubuntu/).
- Homebrew on Apple Silicon installs to /opt/homebrew/bin. If brew shellenv is missing from ~/.zprofile, every Homebrew tool is missing; our macOS test reproduced zsh:1: command not found: zoxide this way.
- winget on Windows adds a link folder to the user PATH, but terminals that were already open do not see it. Open a new window.

## Case 2: z is not found

When zoxide --version works but z does not, add the init line for your shell at the end of its configuration file and open a new terminal:

~~~bash
# ~/.bashrc
eval "$(zoxide init bash)"

# ~/.zshrc
eval "$(zoxide init zsh)"
~~~

~~~fish
# ~/.config/fish/config.fish
zoxide init fish | source
~~~

PowerShell and Nushell use different lines; see the [init guide](/blog/zoxide-init-guide/).

## Case 3: the init line runs before PATH is set

This one is easy to miss. We put the init line above the PATH line in ~/.bashrc:

~~~bash
eval "$(zoxide init bash)"
export PATH="$HOME/.local/bin:$PATH"
~~~

Every new terminal then started with this error, and z did not exist:

~~~text
bash: zoxide: command not found
~$ type z
bash: type: z: not found
~~~

The init line calls zoxide, so PATH must already contain it. Move the PATH line above the init line.

## Case 4: the init line is in the wrong file

We put the init line only in ~/.bash_profile. A normal interactive bash, which is what most Linux terminal windows start, printed bash: type: z: not found. A login shell (bash -l) printed z is a function. Non-login interactive bash reads ~/.bashrc, so put the line there.

## Check everything at once

[zoxide-doctor](/tools/zoxide-doctor/) checks PATH, the binary, the init output and your profile files in one command and prints the line to add:

~~~bash
npx zoxide-doctor
~~~

## Related problems

- z exists but says zoxide: no match found: see [fixing no match found](/blog/troubleshooting-zoxide-no-match-found/).
- z worked yesterday and now behaves oddly: see [zoxide not working](/blog/zoxide-not-working/).`,
    zh: String.raw`# zoxide 命令未找到（command not found）怎么解决

“command not found”其实对应两种不同的问题，修法取决于 Shell 找不到的是哪个词。如果是 zoxide，说明程序没装或不在 PATH 里；如果是 z，说明程序没问题，只是 Shell 还没加载 zoxide。本页所有报错都来自真实运行。

## 测试环境

| 项目 | 值 |
| --- | --- |
| 测试日期 | 2026 年 10 月 8 日 |
| Linux | 全新的官方 ubuntu:24.04 容器；bash 5.2.21、zsh 5.9、fish 3.7.0，通过 tmux 驱动 |
| zoxide | 0.10.0，官方安装脚本安装 |
| 另外参考 | 我们之前的 [Windows](/zh/tutorials/install-windows/)（PowerShell 7.6.6）和 [macOS](/zh/tutorials/install-macos/)（zsh 5.9）实测 |

## 你看到的是哪条报错？

| 报错 | Shell | 含义 |
| --- | --- | --- |
| bash: zoxide: command not found | bash | PATH 里找不到 zoxide 程序 |
| zsh:1: command not found: zoxide | zsh（macOS 实测） | PATH 里找不到 zoxide 程序 |
| bash: z: command not found | bash | zoxide 已安装，但初始化行没有运行 |
| zsh: command not found: z | zsh | zoxide 已安装，但初始化行没有运行 |
| fish: Unknown command: z | fish | zoxide 已安装，但初始化行没有运行 |
| 无法将“z”项识别为 cmdlet…（英文为 The term 'z' is not recognized…） | PowerShell | zoxide 已安装，但配置文件里没有初始化行 |

先运行下面两行，就能知道是哪一半出了问题：

~~~bash
command -v zoxide && zoxide --version
type z
~~~

实测中，已安装但没初始化的机器，第一行输出 zoxide 0.10.0，第二行输出 bash: type: z: not found。

## 情况一：找不到 zoxide 本身

在全新系统上，两条命令都会失败：

~~~text
~$ zoxide --version
bash: zoxide: command not found
~$ z api
bash: z: command not found
~~~

先安装 zoxide，各种安装方式见[下载页](/zh/download/)。然后确认它装到了哪里：

- 官方安装脚本会装到 ~/.local/bin。Ubuntu 默认的 ~/.profile 会在下次登录时把这个目录加进 PATH，所以重新登录一次就好；在那之前，可以把 export PATH="$HOME/.local/bin:$PATH" 加进 ~/.bashrc。详见 [Ubuntu 教程](/zh/tutorials/install-ubuntu/)。
- Apple Silicon 上的 Homebrew 装在 /opt/homebrew/bin。如果 ~/.zprofile 里少了 brew shellenv 那一行，所有 Homebrew 工具都会找不到，我们在 macOS 实测中就是这样复现出 zsh:1: command not found: zoxide 的。
- Windows 上的 winget 会把一个链接目录加进用户 PATH，但已经打开的终端看不到，新开一个窗口即可。

## 情况二：找不到 z

如果 zoxide --version 正常但 z 不行，就在对应 Shell 配置文件的末尾加上初始化行，然后新开终端：

~~~bash
# ~/.bashrc
eval "$(zoxide init bash)"

# ~/.zshrc
eval "$(zoxide init zsh)"
~~~

~~~fish
# ~/.config/fish/config.fish
zoxide init fish | source
~~~

PowerShell 和 Nushell 的写法不同，见[初始化指南](/zh/blog/zoxide-init-guide/)。

## 情况三：初始化行在 PATH 设置之前运行

这种情况很容易被忽略。我们把初始化行放在了 ~/.bashrc 里 PATH 那一行的上面：

~~~bash
eval "$(zoxide init bash)"
export PATH="$HOME/.local/bin:$PATH"
~~~

结果每个新终端一打开就报这个错，而且 z 不存在：

~~~text
bash: zoxide: command not found
~$ type z
bash: type: z: not found
~~~

初始化行要调用 zoxide，所以运行它时 PATH 里必须已经有 zoxide。把 PATH 那一行移到初始化行上面即可。

## 情况四：初始化行写错了文件

我们只把初始化行写进 ~/.bash_profile。普通的交互式 bash（大多数 Linux 终端窗口启动的就是它）输出 bash: type: z: not found，而登录 Shell（bash -l）输出 z is a function。非登录交互式 bash 读的是 ~/.bashrc，所以请把这一行放在那里。

## 一条命令全部检查

[zoxide-doctor](/zh/tools/zoxide-doctor/) 会一次性检查 PATH、程序、初始化输出和配置文件，并告诉你该加哪一行：

~~~bash
npx zoxide-doctor
~~~

## 相关问题

- z 存在，但提示 zoxide: no match found：见[修复 no match found](/zh/blog/troubleshooting-zoxide-no-match-found/)。
- z 昨天还好好的，今天表现异常：见 [zoxide 无法正常工作](/zh/blog/zoxide-not-working/)。`,
    ja: String.raw`# zoxide command not found の修正方法

「command not found」には 2 種類の問題があり、シェルが見つけられなかった単語によって直し方が変わります。zoxide と表示されるならバイナリが未導入か PATH にありません。z と表示されるならバイナリは問題なく、シェルに zoxide を読み込ませていないだけです。このページのメッセージはすべて実際の実行結果です。

## テスト環境

| 項目 | 値 |
| --- | --- |
| 検証日 | 2026 年 10 月 8 日 |
| Linux | 新規の公式 ubuntu:24.04 コンテナ。bash 5.2.21、zsh 5.9、fish 3.7.0 を tmux で操作 |
| zoxide | 0.10.0（公式インストールスクリプト） |
| 参考 | 以前の [Windows](/ja/tutorials/install-windows/)（PowerShell 7.6.6）と [macOS](/ja/tutorials/install-macos/)（zsh 5.9）の検証 |

## どのメッセージが出ていますか？

| メッセージ | シェル | 意味 |
| --- | --- | --- |
| bash: zoxide: command not found | bash | zoxide バイナリが PATH にない |
| zsh:1: command not found: zoxide | zsh（macOS で検証） | zoxide バイナリが PATH にない |
| bash: z: command not found | bash | zoxide は導入済みだが初期化行が実行されていない |
| zsh: command not found: z | zsh | zoxide は導入済みだが初期化行が実行されていない |
| fish: Unknown command: z | fish | zoxide は導入済みだが初期化行が実行されていない |
| The term 'z' is not recognized as a name of a cmdlet... | PowerShell | zoxide は導入済みだがプロファイルに初期化行がない |

まずこれを実行すると、どちらが壊れているか分かります。

~~~bash
command -v zoxide && zoxide --version
type z
~~~

導入済みで未初期化のマシンでは、1 行目が zoxide 0.10.0、2 行目が bash: type: z: not found でした。

## ケース 1：zoxide 自体が見つからない

新しいシステムでは両方とも失敗します。

~~~text
~$ zoxide --version
bash: zoxide: command not found
~$ z api
bash: z: command not found
~~~

まず zoxide を導入します（方法は[ダウンロードページ](/ja/download/)）。そのうえで導入先を確認します。

- 公式インストールスクリプトは ~/.local/bin に入れます。Ubuntu 標準の ~/.profile は次回ログイン時にこのフォルダーを PATH に加えるため、再ログインで解決します。それまでは ~/.bashrc に export PATH="$HOME/.local/bin:$PATH" を追加してください。詳しくは [Ubuntu ガイド](/ja/tutorials/install-ubuntu/)を参照してください。
- Apple Silicon の Homebrew は /opt/homebrew/bin に入ります。~/.zprofile に brew shellenv の行がないと Homebrew のツールがすべて見つかりません。macOS の検証ではこの方法で zsh:1: command not found: zoxide を再現しました。
- Windows の winget はリンク用フォルダーをユーザー PATH に追加しますが、開いていたターミナルには反映されません。新しいウィンドウを開いてください。

## ケース 2：z が見つからない

zoxide --version は動くのに z が動かない場合は、シェルの設定ファイルの最後に初期化行を追加し、新しいターミナルを開きます。

~~~bash
# ~/.bashrc
eval "$(zoxide init bash)"

# ~/.zshrc
eval "$(zoxide init zsh)"
~~~

~~~fish
# ~/.config/fish/config.fish
zoxide init fish | source
~~~

PowerShell と Nushell の書き方は異なります。[初期化ガイド](/ja/blog/zoxide-init-guide/)を参照してください。

## ケース 3：初期化行が PATH の設定より前にある

見落としやすいケースです。~/.bashrc で初期化行を PATH の行より上に置きました。

~~~bash
eval "$(zoxide init bash)"
export PATH="$HOME/.local/bin:$PATH"
~~~

すると新しいターミナルを開くたびに次のエラーが出て、z は存在しませんでした。

~~~text
bash: zoxide: command not found
~$ type z
bash: type: z: not found
~~~

初期化行は zoxide を呼び出すため、その時点で PATH に zoxide が含まれている必要があります。PATH の行を初期化行より上に移してください。

## ケース 4：初期化行を書くファイルが違う

初期化行を ~/.bash_profile にだけ書きました。多くの Linux ターミナルが起動する通常の対話型 bash では bash: type: z: not found となり、ログインシェル（bash -l）では z is a function となりました。非ログインの対話型 bash は ~/.bashrc を読むので、そこに書いてください。

## まとめて確認する

[zoxide-doctor](/ja/tools/zoxide-doctor/) は PATH、バイナリ、初期化の出力、プロファイルを 1 コマンドで確認し、追加すべき行を表示します。

~~~bash
npx zoxide-doctor
~~~

## 関連する問題

- z はあるが zoxide: no match found と表示される：[no match found の修正](/ja/blog/troubleshooting-zoxide-no-match-found/)を参照してください。
- 昨日まで動いていた z の様子がおかしい：[zoxide が動作しない](/ja/blog/zoxide-not-working/)を参照してください。`,
  },
  'troubleshooting-zoxide-no-match-found': {
    en: String.raw`# Fixing "zoxide: no match found" and database errors

zoxide: no match found means z ran, searched the database, and found nothing it was allowed to return. That is different from z: command not found, which is covered in the [command-not-found guide](/blog/zoxide-command-not-found/). We reproduced each cause below on a real system.

## Test environment

| Item | Value |
| --- | --- |
| Tested on | October 8, 2026 |
| System | Fresh official ubuntu:24.04 container, bash 5.2.21, driven through tmux |
| zoxide | 0.10.0 from the official install script |

## Start by looking at the database

~~~bash
zoxide query --list --score
~~~

After visiting a few test directories, ours printed:

~~~text
   4.0 /home/dev/notes
   4.0 /home/dev/work/web-app/src
   4.0 /home/dev/projects/Docs
   4.0 /home/dev/projects/api-gateway
   4.0 /home/dev/projects/api-server
~~~

If the directory you want is not in this list, zoxide cannot jump to it. If it is listed, the problem is the keywords.

## Cause 1: the database is empty or never learned the directory

On a fresh install, zoxide query --list printed nothing and z api printed zoxide: no match found with exit status 1. zoxide only knows directories you have visited in an interactive shell or added yourself.

In bash, zoxide records a directory when the prompt is drawn. A cd inside a script or a non-interactive bash -c command records nothing; we saw the same on [PowerShell](/tutorials/install-windows/). Add such directories explicitly:

~~~bash
zoxide add ~/projects/api-server
~~~

## Cause 2: the last keyword does not match the last folder name

zoxide requires your last keyword to match the last part of the path. With /home/dev/work/web-app/src in the database:

~~~text
~$ z web
zoxide: no match found
~$ z web src
~/work/web-app/src$
~~~

web matches earlier in the path, so add a keyword for the final folder. This rule caused the same result in our Windows and macOS tests.

## Cause 3: you are already in the only match

zoxide never returns the directory you are in. From /home/dev/projects/api-server, z api went to /home/dev/projects/api-gateway, the next match. If that is the only match, you get no match found.

## Cause 4: the directory was deleted

We removed ~/notes and ran z notes: zoxide: no match found, exit status 1. Afterwards zoxide query --list no longer contained /home/dev/notes. zoxide drops entries for directories that no longer exist when it meets them.

## Cause 5: the directory is excluded

Your home directory is excluded by default; it never appeared in our database. If you set _ZO_EXCLUDE_DIRS, directories that match are never recorded. With _ZO_EXCLUDE_DIRS="$HOME:$HOME/projects/api-gateway", visiting api-gateway left it out of the list. Setting the variable replaces the default, which is why $HOME stays in the value. See the [advanced configuration guide](/tutorials/advanced-config/) for the syntax.

## Not a cause: upper and lower case

z docs and z DOCS both reached /home/dev/projects/Docs, so case was not a problem.

## Same message, different reason: cancelling zi

Pressing Esc in the zi picker also prints zoxide: no match found. It only means you cancelled; see the [fzf guide](/tutorials/fzf-integration/).

## Database errors

When zoxide cannot write its database, it says so directly. We made the data folder read-only and ran zoxide add:

~~~text
zoxide: could not write to database

Caused by:
    0: could not create file: /home/dev/.local/share/zoxide/tmp_kQQiwtHzmpah
    1: Permission denied (os error 13)
~~~

The error shows zoxide creating a temporary file in the same folder as the database, so the folder itself must be writable by your user, not only the database file. One way to end up here is running zoxide through sudo, which can leave files owned by root; we did not reproduce that case. Check the owner and fix it:

~~~bash
ls -ld ~/.local/share/zoxide ~/.local/share/zoxide/*
sudo chown -R "$USER" ~/.local/share/zoxide
~~~

The default location is ~/.local/share/zoxide on Linux, ~/Library/Application Support/zoxide on macOS and %LOCALAPPDATA%\zoxide on Windows, unless _ZO_DATA_DIR points elsewhere.

## Useful commands while debugging

~~~bash
zoxide query --list --score      # what zoxide knows, with scores
zoxide query api                 # what z api would choose, without jumping
zoxide remove ~/projects/Docs    # forget a wrong entry
_ZO_ECHO=1 z api                 # print the chosen directory before jumping
~~~

zoxide query exits with status 1 when nothing matches, so scripts can check it. We confirmed each of these commands in the same run.`,
    zh: String.raw`# 修复 “zoxide: no match found” 与数据库错误

zoxide: no match found 的意思是：z 运行了，也查了数据库，但没有找到可以返回的目录。它和 z: command not found 不是一回事，后者见 [command not found 排查指南](/zh/blog/zoxide-command-not-found/)。下面每一种原因，我们都在真实系统上复现过。

## 测试环境

| 项目 | 值 |
| --- | --- |
| 测试日期 | 2026 年 10 月 8 日 |
| 系统 | 全新的官方 ubuntu:24.04 容器，bash 5.2.21，通过 tmux 驱动 |
| zoxide | 0.10.0，官方安装脚本安装 |

## 先看看数据库里有什么

~~~bash
zoxide query --list --score
~~~

访问几个测试目录之后，我们的输出是：

~~~text
   4.0 /home/dev/notes
   4.0 /home/dev/work/web-app/src
   4.0 /home/dev/projects/Docs
   4.0 /home/dev/projects/api-gateway
   4.0 /home/dev/projects/api-server
~~~

如果想去的目录不在列表里，zoxide 就跳不过去；如果在列表里，问题就出在关键词上。

## 原因一：数据库是空的，或者从没学到这个目录

刚装好时，zoxide query --list 什么都不输出，z api 输出 zoxide: no match found，退出码为 1。zoxide 只知道你在交互式 Shell 里访问过的目录，或者你手动添加的目录。

在 bash 里，zoxide 是在显示提示符时记录目录的。脚本或非交互的 bash -c 命令里的 cd 不会被记录；我们在 [PowerShell](/zh/tutorials/install-windows/) 上也看到同样的情况。这类目录请手动添加：

~~~bash
zoxide add ~/projects/api-server
~~~

## 原因二：最后一个关键词没匹配到最后一级文件夹名

zoxide 要求最后一个关键词必须匹配路径的最后一段。数据库里有 /home/dev/work/web-app/src 时：

~~~text
~$ z web
zoxide: no match found
~$ z web src
~/work/web-app/src$
~~~

web 匹配的是路径前面的部分，所以要再加一个匹配最后一级文件夹的关键词。在 Windows 和 macOS 的实测中，这条规则也造成了同样的结果。

## 原因三：你已经在唯一的匹配目录里了

zoxide 从不返回你当前所在的目录。在 /home/dev/projects/api-server 里运行 z api，跳到了下一个匹配 /home/dev/projects/api-gateway。如果当前目录就是唯一的匹配，就会提示 no match found。

## 原因四：目录被删除了

我们删掉 ~/notes 后运行 z notes，得到 zoxide: no match found，退出码 1。之后 zoxide query --list 里也不再有 /home/dev/notes。zoxide 遇到已经不存在的目录时，会把对应记录删掉。

## 原因五：目录被排除了

家目录默认被排除，它从没出现在我们的数据库里。如果设置了 _ZO_EXCLUDE_DIRS，匹配的目录永远不会被记录。设置 _ZO_EXCLUDE_DIRS="$HOME:$HOME/projects/api-gateway" 后，访问 api-gateway 也不会进入列表。设置这个变量会覆盖默认值，所以值里要保留 $HOME。写法见[高级配置教程](/zh/tutorials/advanced-config/)。

## 不是原因：大小写

z docs 和 z DOCS 都能跳到 /home/dev/projects/Docs，大小写不是问题。

## 同样的提示，不同的原因：取消 zi

在 zi 选择界面按 Esc，也会打印 zoxide: no match found。这只表示你取消了选择，见 [fzf 集成教程](/zh/tutorials/fzf-integration/)。

## 数据库错误

zoxide 写不了数据库时会直接说明。我们把数据目录设成只读，然后运行 zoxide add：

~~~text
zoxide: could not write to database

Caused by:
    0: could not create file: /home/dev/.local/share/zoxide/tmp_kQQiwtHzmpah
    1: Permission denied (os error 13)
~~~

从报错可以看出，zoxide 会在数据库所在的目录里创建一个临时文件，所以不只是数据库文件，这个目录本身也必须对你的用户可写。通过 sudo 运行 zoxide 可能会留下属于 root 的文件，导致这种情况，不过这一点我们没有复现。检查所有者并修正：

~~~bash
ls -ld ~/.local/share/zoxide ~/.local/share/zoxide/*
sudo chown -R "$USER" ~/.local/share/zoxide
~~~

如果没有用 _ZO_DATA_DIR 改过位置，默认目录在 Linux 上是 ~/.local/share/zoxide，macOS 上是 ~/Library/Application Support/zoxide，Windows 上是 %LOCALAPPDATA%\zoxide。

## 排查时常用的命令

~~~bash
zoxide query --list --score      # zoxide 知道哪些目录，以及得分
zoxide query api                 # z api 会选哪个目录（不跳转）
zoxide remove ~/projects/Docs    # 删除一条错误记录
_ZO_ECHO=1 z api                 # 跳转前打印选中的目录
~~~

没有匹配时，zoxide query 的退出码是 1，脚本可以据此判断。以上命令我们都在同一次运行中确认过。`,
    ja: String.raw`# 「zoxide: no match found」とデータベースエラーの修正

zoxide: no match found は、z が実行されデータベースを検索したものの、返せるディレクトリが見つからなかったことを意味します。z: command not found とは別の問題で、そちらは [command not found ガイド](/ja/blog/zoxide-command-not-found/)で扱っています。以下の原因はすべて実際のシステムで再現しました。

## テスト環境

| 項目 | 値 |
| --- | --- |
| 検証日 | 2026 年 10 月 8 日 |
| システム | 新規の公式 ubuntu:24.04 コンテナ、bash 5.2.21 を tmux で操作 |
| zoxide | 0.10.0（公式インストールスクリプト） |

## まずデータベースを確認する

~~~bash
zoxide query --list --score
~~~

テスト用ディレクトリをいくつか訪れた後の出力です。

~~~text
   4.0 /home/dev/notes
   4.0 /home/dev/work/web-app/src
   4.0 /home/dev/projects/Docs
   4.0 /home/dev/projects/api-gateway
   4.0 /home/dev/projects/api-server
~~~

目的のディレクトリが一覧になければ zoxide は移動できません。一覧にあれば、問題はキーワードの方です。

## 原因 1：データベースが空、またはそのディレクトリを学習していない

導入直後は zoxide query --list が何も出力せず、z api は zoxide: no match found（終了コード 1）でした。zoxide が知っているのは、対話型シェルで訪れたディレクトリと、自分で追加したディレクトリだけです。

bash では、プロンプトが表示されたときにディレクトリが記録されます。スクリプトや非対話の bash -c コマンド内の cd は記録されません。[PowerShell](/ja/tutorials/install-windows/) でも同じでした。こうしたディレクトリは明示的に追加します。

~~~bash
zoxide add ~/projects/api-server
~~~

## 原因 2：最後のキーワードが最後のフォルダー名に一致しない

zoxide は最後のキーワードがパスの最後の要素に一致することを求めます。データベースに /home/dev/work/web-app/src がある場合：

~~~text
~$ z web
zoxide: no match found
~$ z web src
~/work/web-app/src$
~~~

web はパスの前半に一致しているので、最後のフォルダー用のキーワードを加えます。Windows と macOS の検証でも同じ結果でした。

## 原因 3：唯一の候補に今いる

zoxide は現在のディレクトリを返しません。/home/dev/projects/api-server で z api を実行すると、次の候補 /home/dev/projects/api-gateway に移動しました。それが唯一の候補なら no match found になります。

## 原因 4：ディレクトリが削除された

~/notes を削除して z notes を実行すると、zoxide: no match found（終了コード 1）でした。その後 zoxide query --list に /home/dev/notes は含まれていませんでした。zoxide は存在しないディレクトリに出会うと、その記録を削除します。

## 原因 5：ディレクトリが除外されている

ホームディレクトリは既定で除外されており、データベースに一度も現れませんでした。_ZO_EXCLUDE_DIRS を設定すると、一致するディレクトリは記録されません。_ZO_EXCLUDE_DIRS="$HOME:$HOME/projects/api-gateway" の状態で api-gateway を訪れても、一覧には入りませんでした。この変数は既定値を置き換えるため、値に $HOME を残しています。書き方は[高度な設定ガイド](/ja/tutorials/advanced-config/)を参照してください。

## 原因ではないもの：大文字と小文字

z docs でも z DOCS でも /home/dev/projects/Docs に移動できました。大文字小文字は問題になりません。

## 同じ表示でも理由が違う：zi のキャンセル

zi の選択画面で Esc を押しても zoxide: no match found と表示されます。キャンセルしただけです。[fzf 連携ガイド](/ja/tutorials/fzf-integration/)を参照してください。

## データベースのエラー

データベースに書き込めないとき、zoxide ははっきりそう表示します。データフォルダーを読み取り専用にして zoxide add を実行しました。

~~~text
zoxide: could not write to database

Caused by:
    0: could not create file: /home/dev/.local/share/zoxide/tmp_kQQiwtHzmpah
    1: Permission denied (os error 13)
~~~

エラーから、zoxide がデータベースと同じフォルダーに一時ファイルを作ることが分かります。データベースファイルだけでなく、フォルダー自体もユーザーが書き込める必要があります。sudo 経由で zoxide を実行すると root 所有のファイルが残り、この状態になることがありますが、このケースは再現していません。所有者を確認して修正します。

~~~bash
ls -ld ~/.local/share/zoxide ~/.local/share/zoxide/*
sudo chown -R "$USER" ~/.local/share/zoxide
~~~

_ZO_DATA_DIR で変えていなければ、既定の場所は Linux が ~/.local/share/zoxide、macOS が ~/Library/Application Support/zoxide、Windows が %LOCALAPPDATA%\zoxide です。

## 調査に役立つコマンド

~~~bash
zoxide query --list --score      # zoxide が知っているディレクトリとスコア
zoxide query api                 # z api が選ぶ場所（移動しない）
zoxide remove ~/projects/Docs    # 誤った記録を削除
_ZO_ECHO=1 z api                 # 移動前に選んだディレクトリを表示
~~~

一致がないと zoxide query は終了コード 1 を返すため、スクリプトで判定できます。これらのコマンドはすべて同じ実行で確認しました。`,
  },
  'zoxide-not-working': {
    en: String.raw`# zoxide not working: troubleshooting by symptom

Start from what you see. Each symptom below links to the cause we reproduced and the fix that worked.

## Test environment

| Item | Value |
| --- | --- |
| Tested on | October 8, 2026 |
| Linux | Fresh official ubuntu:24.04 container; bash 5.2.21, zsh 5.9, fish 3.7.0, driven through tmux |
| Also used | Our [Windows](/tutorials/install-windows/), [macOS](/tutorials/install-macos/) and [Ubuntu](/tutorials/install-ubuntu/) install tests |
| zoxide | 0.10.0 |

## Symptom table

| What you see | Most likely cause | Go to |
| --- | --- | --- |
| zoxide: command not found | Binary missing or not on PATH | [command not found](/blog/zoxide-command-not-found/) |
| z: command not found | Init line missing, in the wrong file, or before PATH | [command not found](/blog/zoxide-command-not-found/) |
| zoxide: no match found | Directory not learned, keyword rule, deleted or excluded | [no match found](/blog/troubleshooting-zoxide-no-match-found/) |
| zoxide: detected a possible configuration issue | Something removed zoxide's hook after init | Below |
| z works but nothing new is learned | Prompt hook replaced, or you only cd in scripts | Below |
| z goes to the wrong directory | Ranking, or the current directory is skipped | Below |
| zoxide: could not find fzf, is it installed? | fzf missing (only zi needs it) | [fzf guide](/tutorials/fzf-integration/) |
| Failed to open /dev/tty | zi ran without a terminal | [fzf guide](/tutorials/fzf-integration/) |
| zoxide: could not write to database | Data folder not writable | [no match found](/blog/troubleshooting-zoxide-no-match-found/) |

## "detected a possible configuration issue"

zoxide checks that its hook is still installed. We cleared PROMPT_COMMAND after the init line in bash, changed directory and ran z:

~~~text
zoxide: detected a possible configuration issue.
Please ensure that zoxide is initialized right at the end of your shell configuration file (usually ~/.bashrc).
~~~

Our macOS test showed the same message in zsh when chpwd_functions was cleared. The fix is the one the message gives: move the init line to the very end of the file, after plugin managers, prompt themes and anything else that sets PROMPT_COMMAND, precmd or chpwd. Set _ZO_DOCTOR=0 only if you understand why the warning appears.

## z works, but new directories are not learned

How zoxide learns depends on the shell:

| Shell | When a directory is recorded |
| --- | --- |
| bash | When the prompt is drawn (PROMPT_COMMAND) |
| PowerShell | When the prompt function runs |
| zsh | On every directory change (chpwd) |

Two consequences we reproduced. In bash and PowerShell, cd inside a script records nothing, so add such directories with zoxide add. In PowerShell, a prompt theme that redefines the prompt function after zoxide stops learning silently, with no warning; put the zoxide line last. That case is shown step by step in the [Windows guide](/tutorials/install-windows/).

## z goes somewhere unexpected

Check what zoxide would choose and why:

~~~bash
zoxide query --list --score
zoxide query api
~~~

Things we saw:

- zoxide never returns the current directory. From api-server, z api went to api-gateway.
- If the argument is a real path, z behaves like cd. From the home folder, z projects entered ./projects even though no zoxide entry was involved, and z .. and z - worked like cd .. and cd -.
- An old entry with a high score can win. Remove it with zoxide remove /full/path.

## Two zoxide versions

If zoxide --version prints a version you did not expect, list every copy:

~~~bash
type -a zoxide
~~~

On Ubuntu with both apt and the install script, this showed ~/.local/bin/zoxide (0.10.0) first and /usr/bin/zoxide (0.9.3) after it. The first one wins. Keep one installation.

## With --cmd cd, cd errors look different

If you initialized zoxide with --cmd cd, cd into a folder that does not exist printed zoxide: no match found instead of bash's usual "No such file or directory". That is expected: cd is now zoxide's function. See the [alias guide](/blog/zoxide-alias-autocomplete/).

## Reset only as a last resort

Deleting the database clears all learned directories. Back it up first:

~~~bash
cp -r ~/.local/share/zoxide ~/zoxide-backup
rm -r ~/.local/share/zoxide
~~~

Open a new terminal; zoxide creates a new database on the next visit. Most problems on this page are fixed without this step.

## One-command check

[zoxide-doctor](/tools/zoxide-doctor/) checks PATH, the binary, init output and profile files. It does not detect a hook removed later in the profile, so read the section above if it reports healthy and learning still fails.`,
    zh: String.raw`# zoxide 无法正常工作：按症状排查

从你看到的现象入手。下面每种症状都对应我们复现过的原因和验证有效的修法。

## 测试环境

| 项目 | 值 |
| --- | --- |
| 测试日期 | 2026 年 10 月 8 日 |
| Linux | 全新的官方 ubuntu:24.04 容器；bash 5.2.21、zsh 5.9、fish 3.7.0，通过 tmux 驱动 |
| 另外参考 | 我们的 [Windows](/zh/tutorials/install-windows/)、[macOS](/zh/tutorials/install-macos/) 和 [Ubuntu](/zh/tutorials/install-ubuntu/) 安装实测 |
| zoxide | 0.10.0 |

## 症状对照表

| 你看到的 | 最可能的原因 | 去哪里看 |
| --- | --- | --- |
| zoxide: command not found | 程序没装或不在 PATH 里 | [command not found](/zh/blog/zoxide-command-not-found/) |
| z: command not found | 初始化行缺失、写错文件或在 PATH 之前 | [command not found](/zh/blog/zoxide-command-not-found/) |
| zoxide: no match found | 目录没学到、关键词规则、已删除或被排除 | [no match found](/zh/blog/troubleshooting-zoxide-no-match-found/) |
| zoxide: detected a possible configuration issue | 初始化之后有东西移除了 zoxide 的钩子 | 见下文 |
| z 能用，但不再学习新目录 | 提示符钩子被替换，或者只在脚本里 cd | 见下文 |
| z 跳到了意料之外的目录 | 排名问题，或当前目录被跳过 | 见下文 |
| zoxide: could not find fzf, is it installed? | 缺少 fzf（只有 zi 需要） | [fzf 教程](/zh/tutorials/fzf-integration/) |
| Failed to open /dev/tty | zi 在没有终端的环境里运行 | [fzf 教程](/zh/tutorials/fzf-integration/) |
| zoxide: could not write to database | 数据目录不可写 | [no match found](/zh/blog/troubleshooting-zoxide-no-match-found/) |

## “detected a possible configuration issue”

zoxide 会检查自己的钩子是否还在。我们在 bash 里于初始化行之后清空了 PROMPT_COMMAND，切换目录后运行 z：

~~~text
zoxide: detected a possible configuration issue.
Please ensure that zoxide is initialized right at the end of your shell configuration file (usually ~/.bashrc).
~~~

在 macOS 实测中，zsh 里清空 chpwd_functions 后也出现了同样的提示。修法就是提示里说的：把初始化行移到配置文件的最末尾，放在插件管理器、提示符主题以及其他会设置 PROMPT_COMMAND、precmd 或 chpwd 的配置之后。只有在明白警告原因的情况下，才设置 _ZO_DOCTOR=0 关闭它。

## z 能用，但不再学习新目录

zoxide 学习目录的方式因 Shell 而异：

| Shell | 什么时候记录目录 |
| --- | --- |
| bash | 显示提示符时（PROMPT_COMMAND） |
| PowerShell | 运行 prompt 函数时 |
| zsh | 每次切换目录时（chpwd） |

我们复现了两个后果。在 bash 和 PowerShell 里，脚本中的 cd 不会被记录，这类目录请用 zoxide add 添加。在 PowerShell 里，如果提示符主题在 zoxide 之后重新定义了 prompt 函数，zoxide 会悄悄停止学习，而且没有任何警告，所以要把 zoxide 那一行放在最后。这个情况在 [Windows 教程](/zh/tutorials/install-windows/)里有逐步演示。

## z 跳到了意料之外的目录

先看看 zoxide 会选哪个目录、为什么：

~~~bash
zoxide query --list --score
zoxide query api
~~~

我们观察到：

- zoxide 从不返回当前目录。在 api-server 里运行 z api，跳到了 api-gateway。
- 如果参数是一个真实存在的路径，z 的行为和 cd 一样。在家目录下，z projects 直接进入了 ./projects，并没有用到 zoxide 的记录；z .. 和 z - 也和 cd .. 、cd - 一样。
- 得分很高的旧记录可能会胜出，可以用 zoxide remove /完整/路径 删掉。

## 装了两个 zoxide 版本

如果 zoxide --version 输出的版本不对，列出所有副本：

~~~bash
type -a zoxide
~~~

在同时用 apt 和安装脚本装过的 Ubuntu 上，这里先列出 ~/.local/bin/zoxide（0.10.0），后面才是 /usr/bin/zoxide（0.9.3）。排在前面的生效，建议只保留一种安装方式。

## 用了 --cmd cd 后，cd 的报错变了

如果用 --cmd cd 初始化 zoxide，cd 到一个不存在的文件夹时，输出的是 zoxide: no match found，而不是 bash 平常的 “No such file or directory”。这是正常的，因为 cd 现在是 zoxide 的函数。详见[别名与补全](/zh/blog/zoxide-alias-autocomplete/)。

## 万不得已才重置

删除数据库会清空所有学到的目录，请先备份：

~~~bash
cp -r ~/.local/share/zoxide ~/zoxide-backup
rm -r ~/.local/share/zoxide
~~~

新开一个终端，下次访问目录时 zoxide 会新建数据库。本页的大多数问题都不需要这一步。

## 一条命令检查

[zoxide-doctor](/zh/tools/zoxide-doctor/) 会检查 PATH、程序、初始化输出和配置文件。它查不出配置文件后面又移除钩子的情况，所以如果它报告正常但 zoxide 仍不学习，请看上面的说明。`,
    ja: String.raw`# zoxide が動作しない：症状別のトラブルシューティング

見えている症状から始めてください。以下の症状ごとに、再現した原因と効果を確認した修正方法を示します。

## テスト環境

| 項目 | 値 |
| --- | --- |
| 検証日 | 2026 年 10 月 8 日 |
| Linux | 新規の公式 ubuntu:24.04 コンテナ。bash 5.2.21、zsh 5.9、fish 3.7.0 を tmux で操作 |
| 参考 | [Windows](/ja/tutorials/install-windows/)、[macOS](/ja/tutorials/install-macos/)、[Ubuntu](/ja/tutorials/install-ubuntu/) のインストール検証 |
| zoxide | 0.10.0 |

## 症状の一覧

| 表示・状態 | 主な原因 | 参照先 |
| --- | --- | --- |
| zoxide: command not found | バイナリが未導入、または PATH にない | [command not found](/ja/blog/zoxide-command-not-found/) |
| z: command not found | 初期化行がない、ファイルが違う、PATH より前 | [command not found](/ja/blog/zoxide-command-not-found/) |
| zoxide: no match found | 未学習、キーワードの規則、削除、除外 | [no match found](/ja/blog/troubleshooting-zoxide-no-match-found/) |
| zoxide: detected a possible configuration issue | 初期化後に何かが zoxide のフックを外した | 下記 |
| z は動くが新しいディレクトリを覚えない | プロンプトのフックが置き換えられた、またはスクリプト内でしか cd していない | 下記 |
| z が予想外の場所へ移動する | 順位、または現在のディレクトリが除外される | 下記 |
| zoxide: could not find fzf, is it installed? | fzf がない（必要なのは zi だけ） | [fzf ガイド](/ja/tutorials/fzf-integration/) |
| Failed to open /dev/tty | ターミナルのない環境で zi を実行 | [fzf ガイド](/ja/tutorials/fzf-integration/) |
| zoxide: could not write to database | データフォルダーに書き込めない | [no match found](/ja/blog/troubleshooting-zoxide-no-match-found/) |

## 「detected a possible configuration issue」

zoxide は自分のフックが残っているかを確認します。bash で初期化行の後に PROMPT_COMMAND を空にし、ディレクトリを移動して z を実行しました。

~~~text
zoxide: detected a possible configuration issue.
Please ensure that zoxide is initialized right at the end of your shell configuration file (usually ~/.bashrc).
~~~

macOS の検証でも、zsh で chpwd_functions を空にすると同じメッセージが出ました。修正はメッセージのとおりです。初期化行を設定ファイルの最後、プラグインマネージャーやプロンプトテーマ、PROMPT_COMMAND・precmd・chpwd を設定するものより後に移してください。_ZO_DOCTOR=0 で警告を消すのは、理由を理解している場合だけにしてください。

## z は動くが、新しいディレクトリを覚えない

zoxide が学習するタイミングはシェルによって異なります。

| シェル | ディレクトリを記録するタイミング |
| --- | --- |
| bash | プロンプト表示時（PROMPT_COMMAND） |
| PowerShell | prompt 関数の実行時 |
| zsh | ディレクトリが変わるたび（chpwd） |

再現した影響は 2 つです。bash と PowerShell では、スクリプト内の cd は記録されないため、zoxide add で追加します。PowerShell では、zoxide の後でプロンプトテーマが prompt 関数を再定義すると、警告もなく学習が止まります。zoxide の行は最後に置いてください。手順は [Windows ガイド](/ja/tutorials/install-windows/)で示しています。

## z が予想外の場所へ移動する

zoxide が何をなぜ選ぶかを確認します。

~~~bash
zoxide query --list --score
zoxide query api
~~~

確認したこと：

- zoxide は現在のディレクトリを返しません。api-server で z api を実行すると api-gateway に移動しました。
- 引数が実在するパスなら、z は cd と同じ動作をします。ホームで z projects を実行すると zoxide の記録を使わずに ./projects へ入り、z .. と z - も cd .. と cd - と同じでした。
- スコアの高い古い記録が勝つことがあります。zoxide remove /フル/パス で削除できます。

## zoxide が 2 つ入っている

zoxide --version が想定外の版を表示する場合は、すべてのコピーを表示します。

~~~bash
type -a zoxide
~~~

apt とインストールスクリプトの両方で入れた Ubuntu では、~/.local/bin/zoxide（0.10.0）が先、/usr/bin/zoxide（0.9.3）が後に表示されました。先頭のものが使われます。導入方法は 1 つにしてください。

## --cmd cd を使うと cd のエラーが変わる

--cmd cd で初期化すると、存在しないフォルダーへ cd したときに bash の通常の「No such file or directory」ではなく zoxide: no match found と表示されます。cd が zoxide の関数になったためで、想定どおりの動作です。[エイリアスのガイド](/ja/blog/zoxide-alias-autocomplete/)を参照してください。

## リセットは最後の手段

データベースを削除すると学習したディレクトリはすべて消えます。先にバックアップしてください。

~~~bash
cp -r ~/.local/share/zoxide ~/zoxide-backup
rm -r ~/.local/share/zoxide
~~~

新しいターミナルを開くと、次の移動時に zoxide が新しいデータベースを作ります。このページの問題の多くは、この手順なしで解決します。

## 1 コマンドで確認

[zoxide-doctor](/ja/tools/zoxide-doctor/) は PATH、バイナリ、初期化の出力、プロファイルを確認します。プロファイルの後半でフックが外されるケースは検出できないため、healthy と表示されても学習しない場合は上の説明を読んでください。`,
  },
  'zoxide-alias-autocomplete': {
    en: String.raw`# zoxide alias and autocomplete: --cmd cd, zi and Tab completion

This page covers the two things people search for most after installing zoxide: replacing cd with zoxide, and getting Tab completion to work. Everything below was run in real bash, zsh and fish sessions.

## Test environment

| Item | Value |
| --- | --- |
| Tested on | October 8, 2026 |
| System | Fresh official ubuntu:24.04 container, driven through tmux |
| Shells | bash 5.2.21 (with the bash-completion package loaded), zsh 5.9, fish 3.7.0 |
| zoxide / fzf | 0.10.0 / 0.74.4 |

## You do not need an alias for zoxide to learn

zoxide learns directories through a shell hook that the init line installs. The hook part of the init script is the same with the default z command, with --cmd cd and with --no-cmd. Setting up an alias is only about which command name you type.

## Replace cd with --cmd cd

~~~bash
# ~/.bashrc (use "zsh" in ~/.zshrc)
eval "$(zoxide init bash --cmd cd)"
~~~

This defines cd and cdi instead of z and zi. In our test, type cd printed cd is a function, type cdi printed cdi is a function, and z no longer existed. Ordinary cd usage kept working:

| Command | Result in our test |
| --- | --- |
| cd /tmp | /tmp |
| cd (no argument) | /home/dev |
| cd - | back to /tmp |
| cd .. from ~/projects | /home/dev |
| cd api from home (no ./api folder) | /home/dev/projects/api-server, via zoxide |
| cd no-such-dir | zoxide: no match found, exit status 1 |

The last row is the one difference people notice: a typo no longer prints bash's "No such file or directory", because cd is now zoxide's function.

## Use any name with --cmd

~~~bash
eval "$(zoxide init bash --cmd j)"
~~~

This gave us j and ji, and no z. It is handy if your fingers already know autojump's j.

## Define nothing with --no-cmd

~~~bash
eval "$(zoxide init bash --no-cmd)"
~~~

No z or zi is created, but the hook and the internal functions are. type __zoxide_z printed __zoxide_z is a function, so you can define your own command on top of it. You do not need to create zi yourself with the default setup; the init line already defines it.

## Tab completion

zoxide's init output includes completion code for each shell: complete -F __zoxide_z_complete in bash, compdef __zoxide_z_complete in zsh, and complete --command __zoxide_z in fish.

### Space then Tab opens the picker

Typing z api, then a space, then Tab opened the interactive picker in all three shells:

~~~text
>   < 1/1
▌   12.0 /home/dev/projects/api-server
~~~

In zsh, choosing an entry put the full path on the command line; we did not check that step in bash and fish. This needs fzf. In zsh, it worked even without running compinit.

### Tab without a space completes folder names

Typing z proj and pressing Tab, with no space, completed the local folder name to z projects/ in bash and in zsh (with compinit). That is ordinary path completion, the same as cd.

## Troubleshooting completion

- Tab opens nothing after z api and a space: check that fzf is installed and that the init line runs in this shell.
- zoxide: could not find fzf, is it installed?: install fzf; see the [fzf guide](/tutorials/fzf-integration/).
- Tab completes the wrong thing in bash: we tested with the bash-completion package loaded before the init line, as Ubuntu does by default; other setups were not tested.
- PowerShell and Nushell completion were not part of this test.

## Next steps

- [fzf integration](/tutorials/fzf-integration/): what zi shows and how to customize it safely.
- [Command reference](/blog/zoxide-commands/): query, add, remove and import.
- [zoxide not working](/blog/zoxide-not-working/): when z stops learning or jumps to the wrong place.`,
    zh: String.raw`# zoxide 别名与自动补全：--cmd cd、zi 和 Tab 补全

装好 zoxide 之后，大家最常搜的两件事是：用 zoxide 替换 cd，以及让 Tab 补全生效。下面的内容都在真实的 bash、zsh 和 fish 会话里运行过。

## 测试环境

| 项目 | 值 |
| --- | --- |
| 测试日期 | 2026 年 10 月 8 日 |
| 系统 | 全新的官方 ubuntu:24.04 容器，通过 tmux 驱动 |
| Shell | bash 5.2.21（已加载 bash-completion 软件包）、zsh 5.9、fish 3.7.0 |
| zoxide / fzf | 0.10.0 / 0.74.4 |

## zoxide 学习目录不需要别名

zoxide 是通过初始化行安装的 Shell 钩子来学习目录的。不管用默认的 z、--cmd cd 还是 --no-cmd，初始化脚本里的钩子部分都一样。设置别名只决定你输入哪个命令名。

## 用 --cmd cd 替换 cd

~~~bash
# ~/.bashrc（在 ~/.zshrc 里写 zsh）
eval "$(zoxide init bash --cmd cd)"
~~~

这样定义的是 cd 和 cdi，而不是 z 和 zi。实测中，type cd 输出 cd is a function，type cdi 输出 cdi is a function，z 已经不存在。平常的 cd 用法都照常可用：

| 命令 | 实测结果 |
| --- | --- |
| cd /tmp | /tmp |
| cd（不带参数） | /home/dev |
| cd - | 回到 /tmp |
| 在 ~/projects 里 cd .. | /home/dev |
| 在家目录 cd api（没有 ./api 文件夹） | /home/dev/projects/api-server，由 zoxide 跳转 |
| cd no-such-dir | zoxide: no match found，退出码 1 |

最后一行是大家会注意到的唯一区别：输错名字时，不再显示 bash 的 “No such file or directory”，因为 cd 现在是 zoxide 的函数。

## 用 --cmd 起任意名字

~~~bash
eval "$(zoxide init bash --cmd j)"
~~~

这样得到的是 j 和 ji，没有 z。如果你已经习惯了 autojump 的 j，这样很顺手。

## 用 --no-cmd 什么都不定义

~~~bash
eval "$(zoxide init bash --no-cmd)"
~~~

不会创建 z 和 zi，但钩子和内部函数都在。type __zoxide_z 输出 __zoxide_z is a function，你可以在它的基础上定义自己的命令。默认配置下不需要自己创建 zi，初始化行已经定义好了。

## Tab 补全

zoxide 的初始化输出里包含各 Shell 的补全代码：bash 里是 complete -F __zoxide_z_complete，zsh 里是 compdef __zoxide_z_complete，fish 里是 complete --command __zoxide_z。

### 空格加 Tab 打开选择界面

输入 z api，再按空格和 Tab，三种 Shell 都打开了交互选择界面：

~~~text
>   < 1/1
▌   12.0 /home/dev/projects/api-server
~~~

在 zsh 里选中一项后，完整路径会填到命令行上；bash 和 fish 我们没有检查这一步。这需要 fzf。在 zsh 里，即使没有运行 compinit 也能用。

### 不加空格的 Tab 补全文件夹名

输入 z proj 后直接按 Tab（不加空格），在 bash 和 zsh（已运行 compinit）里都补全成了 z projects/。这就是普通的路径补全，和 cd 一样。

## 补全排查

- 输入 z api 加空格后按 Tab 没反应：检查 fzf 是否已安装，以及当前 Shell 是否运行了初始化行。
- zoxide: could not find fzf, is it installed?：安装 fzf，见 [fzf 集成教程](/zh/tutorials/fzf-integration/)。
- bash 里 Tab 补全的内容不对：我们测试时在初始化行之前加载了 bash-completion 软件包（Ubuntu 默认如此），其他配置没有测试。
- PowerShell 和 Nushell 的补全不在本次测试范围内。

## 下一步

- [fzf 集成](/zh/tutorials/fzf-integration/)：zi 显示什么，以及如何安全地自定义。
- [命令参考](/zh/blog/zoxide-commands/)：query、add、remove 和 import。
- [zoxide 无法正常工作](/zh/blog/zoxide-not-working/)：z 不再学习或跳错目录时。`,
    ja: String.raw`# zoxide のエイリアスと自動補完：--cmd cd、zi、Tab 補完

zoxide を入れた後によく調べられるのは、cd を zoxide に置き換える方法と、Tab 補完を動かす方法の 2 つです。以下はすべて実際の bash、zsh、fish のセッションで実行しました。

## テスト環境

| 項目 | 値 |
| --- | --- |
| 検証日 | 2026 年 10 月 8 日 |
| システム | 新規の公式 ubuntu:24.04 コンテナを tmux で操作 |
| シェル | bash 5.2.21（bash-completion パッケージを読み込み）、zsh 5.9、fish 3.7.0 |
| zoxide / fzf | 0.10.0 / 0.74.4 |

## 学習にエイリアスは不要

zoxide は初期化行が設定するシェルのフックでディレクトリを学習します。既定の z、--cmd cd、--no-cmd のどれでも、初期化スクリプトのフック部分は同じです。エイリアスの設定は、入力するコマンド名を決めるだけです。

## --cmd cd で cd を置き換える

~~~bash
# ~/.bashrc（~/.zshrc では zsh と書く）
eval "$(zoxide init bash --cmd cd)"
~~~

z と zi の代わりに cd と cdi が定義されます。テストでは type cd が cd is a function、type cdi が cdi is a function を表示し、z は存在しなくなりました。通常の cd の使い方はそのまま動きました。

| コマンド | テスト結果 |
| --- | --- |
| cd /tmp | /tmp |
| cd（引数なし） | /home/dev |
| cd - | /tmp に戻る |
| ~/projects で cd .. | /home/dev |
| ホームで cd api（./api フォルダーなし） | zoxide により /home/dev/projects/api-server |
| cd no-such-dir | zoxide: no match found、終了コード 1 |

最後の行が唯一気づく違いです。打ち間違えても bash の「No such file or directory」は出ません。cd が zoxide の関数になったためです。

## --cmd で好きな名前を使う

~~~bash
eval "$(zoxide init bash --cmd j)"
~~~

j と ji が定義され、z はありませんでした。autojump の j に慣れている場合に便利です。

## --no-cmd で何も定義しない

~~~bash
eval "$(zoxide init bash --no-cmd)"
~~~

z と zi は作られませんが、フックと内部関数は作られます。type __zoxide_z は __zoxide_z is a function を表示したので、これを使って独自のコマンドを定義できます。既定の設定なら zi を自分で作る必要はありません。初期化行がすでに定義しています。

## Tab 補完

zoxide の初期化出力には各シェルの補完コードが含まれます。bash は complete -F __zoxide_z_complete、zsh は compdef __zoxide_z_complete、fish は complete --command __zoxide_z です。

### スペースの後に Tab で選択画面を開く

z api と入力し、スペース、Tab と押すと、3 つのシェルすべてで対話選択画面が開きました。

~~~text
>   < 1/1
▌   12.0 /home/dev/projects/api-server
~~~

zsh では項目を選ぶとフルパスがコマンドラインに入りました。bash と fish ではこの手順を確認していません。fzf が必要です。zsh では compinit を実行しなくても動作しました。

### スペースなしの Tab はフォルダー名を補完する

z proj と入力してスペースなしで Tab を押すと、bash と zsh（compinit 実行済み）でローカルのフォルダー名が補完され z projects/ になりました。cd と同じ通常のパス補完です。

## 補完のトラブルシューティング

- z api とスペースの後に Tab を押しても何も起きない：fzf が入っているか、このシェルで初期化行が実行されているかを確認します。
- zoxide: could not find fzf, is it installed?：fzf を導入します。[fzf 連携ガイド](/ja/tutorials/fzf-integration/)を参照してください。
- bash で Tab の補完内容がおかしい：テストでは初期化行の前に bash-completion パッケージを読み込みました（Ubuntu の既定）。それ以外の構成は試していません。
- PowerShell と Nushell の補完は今回のテスト対象外です。

## 次のステップ

- [fzf 連携](/ja/tutorials/fzf-integration/)：zi の画面と安全なカスタマイズ方法。
- [コマンドリファレンス](/ja/blog/zoxide-commands/)：query、add、remove、import。
- [zoxide が動作しない](/ja/blog/zoxide-not-working/)：z が学習しない、または違う場所へ移動する場合。`,
  },
};
