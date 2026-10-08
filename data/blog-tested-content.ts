// 实测改写的博客正文（2026-10-08，全新 ubuntu:24.04 容器 + tmux 真实终端）。
// 优先级高于 messages 中的旧正文，由 getBlogContentOverride 读取。
export const testedBlogContent: Record<string, Record<string, string>> = {
  'what-is-zoxide-smarter-cd': {
    en: String.raw`# What is zoxide? How directory jumping and learning work

zoxide records directories in a database and finds them from short keywords. The z command is a function loaded into your shell: it asks the binary for a destination, then changes the shell's directory. Our test used z api to reach ~/projects/api-server after adding that path to a fresh database.

Recording happens through shell hooks. This matters when interpreting a score: Bash and Zsh did not record the same sequence of cd commands in the same way.

## Test environment

| Item | Value |
| --- | --- |
| Date | October 8, 2026 |
| System | Fresh ubuntu:24.04 container, reporting Ubuntu 24.04.5 LTS; x86_64 |
| User | Ordinary user tester, uid 1001 |
| Shells | Bash 5.2.21 and Zsh 5.9 |
| zoxide | 0.10.0, installed as tester with the official installation script |
| Hook | Default pwd, as reported by zoxide init --help |
| Method | GitHub Actions; tmux 3.4 interactive shells, 120 × 30; separate startup files and _ZO_DATA_DIR for each case |
| fzf | Not installed; interactive selection was not tested in this run |

The [test log](https://github.com/jiankn/zoxide/actions/runs/37785045934) contains generated shell code, captured terminals and queries from outside those terminals. The artifact contains the full captures and results.json. We abbreviate /home/tester as ~ in output below. Terminal excerpts omit completion markers and blank space; generated-code excerpts are explicitly cropped.

## Why z can change the current shell's directory

In a separate navigation case, we first ran zoxide add /home/tester/projects/api-server. The shell started in /home/tester. The captured output, split into individual commands for readability, was:

~~~text
$ pwd
~
$ zoxide query api
~/projects/api-server
$ pwd
~
$ z api
$ pwd
~/projects/api-server
~~~

The query printed a path and left the current shell in its original directory. Calling z changed that shell's directory. Reading the code printed by zoxide init bash explains the difference.

These two function definitions are excerpts from that generated output; the intervening code is omitted:

~~~bash
function z() {
    __zoxide_z "$@"
}

function __zoxide_cd() {
    # shellcheck disable=SC2164
    \builtin cd -- "$@"
}
~~~

Inside the keyword branch of __zoxide_z, the generated query line was:

~~~bash
        result="$(\command zoxide query --exclude "$(__zoxide_pwd)" -- "$@")" &&
~~~

This last line is a cropped excerpt, not a standalone command. The following line passes the result to __zoxide_cd. The call sequence is z → __zoxide_z → zoxide query → __zoxide_cd → builtin cd. The built-in cd executes inside the current shell; the query subprocess supplies the path.

Generating this code and loading it are separate steps. Our Bash startup file loaded it with eval "$(zoxide init bash)"; Zsh used eval "$(zoxide init zsh)" after compinit. The [tested initialization guide](/blog/zoxide-init-guide/) covers startup files and command names.

## What the frecency score showed immediately after recording

The score combines frequency and recency. For this test, we measured the immediate effect of recording a directory, using zoxide query --list --score. The displayed number is a score, not a literal visit count.

We gave explicit add commands their own empty _ZO_DATA_DIR and queried immediately after each command:

~~~text
$ zoxide query --list --score
# No output: the database was empty.
$ zoxide add ~/projects/api-server
$ zoxide query --list --score
   4.0 ~/projects/api-server
$ zoxide add ~/projects/api-server
$ zoxide query --list --score
   8.0 ~/projects/api-server
$ zoxide add ~/projects/api-server
$ zoxide query --list --score
  12.0 ~/projects/api-server
~~~

The comment describing empty output is an annotation. Repeated add calls increased this one path's score even though the caller never changed directory. That separates explicit recording from automatic recording by a shell hook.

Next, each interactive shell started with another empty database and default initialization. We sent one command at a time, waited for its prompt, then queried the same database from an external process. The table follows one continuous sequence in each shell:

| Action | Bash: api-server score | Zsh: api-server score |
| --- | --- | --- |
| cd ~/projects/api-server | 4.0 | 4.0 |
| cd . while already there | 4.0 | 8.0 |
| cd ~, then cd ~/projects/api-server, as separate commands | 8.0 | 12.0 |
| Leave and return once more, as separate commands | 12.0 | 16.0 |

Bash did not add another record for cd .; Zsh did. Returning after leaving added another record in both shells. Thus a score can reflect hook events, including a same-directory cd in Zsh, rather than distinct directories visited.

**Time-based score changes were not tested.** We did not wait across hour, day or week boundaries, alter the clock, or measure _ZO_MAXAGE cleanup. These immediate scores do not establish how a record's score changes after a long wait.

## When Bash and Zsh record the directory

The actual hook registrations in the interactive shells were:

~~~text
Bash:
declare -- PROMPT_COMMAND="__zoxide_hook"

Zsh:
typeset -a chpwd_functions=( __zoxide_hook )
~~~

Bash's default pwd hook runs through PROMPT_COMMAND before the next prompt. Its generated function compares the current path with the previous path. Zsh attaches the function to chpwd_functions and calls add when that event fires. These are different implementations of the same default hook mode.

To see the timing, we sent this as one command line after the score sequence above:

~~~bash
cd ~/projects/api-gateway; cd ~/work/api-docs; zoxide query --list --score
~~~

We then ran another query from outside the terminal after the prompt returned:

| Query point | Bash | Zsh |
| --- | --- | --- |
| Query on the same line as both cd commands | Only api-server, score 12.0 | api-server 16.0, api-docs 4.0, api-gateway 4.0 |
| External query after the next prompt | api-server 12.0 and api-docs 4.0; no api-gateway | The same three entries as above |

Bash learned the final directory when the prompt appeared and missed the intermediate directory. Zsh recorded both cd events before the query on that line. An empty query result immediately after cd in a Bash command list can therefore reflect timing; check again after the prompt.

### A cd in a child script did not teach the parent shell

Our child Bash script changed into ~/scratch/script-only and printed its working directory. On returning, the interactive parent printed ~/projects/api-server. Its database still contained only api-server, with the same score as before, in both the Bash and Zsh parent cases. The child script did not load zoxide integration.

We also tested a separate noninteractive Bash process that did load it:

~~~bash
bash -c 'eval "$(zoxide init bash)"; cd /home/tester/scratch/script-only; pwd'
~~~

It printed the script-only path, but an external query of that case's fresh database returned no entries. There was no prompt to run PROMPT_COMMAND. For explicit recording in a script, the add commands above provide a tested route.

### PowerShell: a separately dated Windows test

The [Windows installation tutorial](/tutorials/install-windows/) tested Windows 11 Pro 23H2, PowerShell 7.6.6 and zoxide 0.10.0 on September 30, 2026. It found that recording happens through the prompt function: redefining prompt after initialization stopped learning, and script cd commands without prompts did not record visits. This is evidence from that earlier Windows test; we did not run PowerShell in the present Ubuntu case.

## z also accepts real paths, z .. and z -

The navigation terminal also produced these results:

| Starting directory | Command | Directory reported by pwd |
| --- | --- | --- |
| ~/projects/api-server | z .. | ~/projects |
| ~/projects | z - | ~/projects/api-server |
| ~/projects/api-server | z /home/tester/scratch | ~/scratch |
| ~/scratch | z unlearned-child | ~/scratch/unlearned-child |

Before the last two moves, the query list contained no unlearned-child entry. The child directory already existed on disk, and z entered it without a learned match. The generated Bash function checks whether a single argument is a usable path before falling back to a database query.

These cases behaved like cd for a parent path, the previous directory, an absolute path and an existing child. This test did not compare every cd option, CDPATH or symlink behavior. You can use these tested path forms alongside keyword jumps; the [command reference](/blog/zoxide-commands/) covers the broader command set.

## Reproduce the recording test in a separate shell

Create the test directories and choose an empty database before loading integration. Run this setup in a separate Bash session:

~~~bash
mkdir -p ~/projects/api-server ~/projects/api-gateway ~/work/api-docs
export _ZO_DATA_DIR="$(mktemp -d)"
eval "$(zoxide init bash)"
~~~

In Zsh, use eval "$(zoxide init zsh)" instead. Send each cd as a separate line when comparing scores after prompts. For the compound-command case, keep both cd commands and the query on one line. Our automated check used tmux capture-pane -p and an external query sharing that shell's _ZO_DATA_DIR.

The tested 0.10.0 help lists six public configuration variables: _ZO_DATA_DIR, _ZO_ECHO, _ZO_EXCLUDE_DIRS, _ZO_FZF_OPTS, _ZO_MAXAGE and _ZO_RESOLVE_SYMLINKS. We varied _ZO_DATA_DIR to isolate cases; we did not vary the other five here. Other hook modes and additional Linux shells are covered in the [initialization tests](/blog/zoxide-init-guide/). This run did not test fzf, macOS or Windows profiles, or long-term score changes.
`,
  },
  'zoxide-shi-shenme-z-mingling-tidai-cd': {
    zh: String.raw`# zoxide 是什么？它如何跳转目录、记录访问和计分

zoxide 把目录记录到数据库里，让你用短关键词找到路径。终端里的 z 是初始化代码定义的 Shell 函数：先向 zoxide 二进制查询目标，再在当前 Shell 里执行 cd。本次测试先把 ~/projects/api-server 加入一个空数据库，随后用 z api 跳到了这个目录。

目录由 Shell 的 hook 自动记录。Bash 和 Zsh 对同一组 cd 命令的记录结果不同，因此“进去了一次”与“分数增加了一次”不能简单画等号。

## 测试环境

| 项目 | 实际环境 |
| --- | --- |
| 日期 | 2026-10-08 |
| 系统 | 全新 ubuntu:24.04 容器；系统报告 Ubuntu 24.04.5 LTS；x86_64 |
| 用户 | 普通用户 tester，uid 1001 |
| Shell | Bash 5.2.21、Zsh 5.9 |
| zoxide | 0.10.0，由 tester 使用官方安装脚本安装 |
| hook | zoxide init --help 显示的默认模式 pwd |
| 方法 | GitHub Actions + tmux 3.4，120 × 30 交互终端；每个案例使用独立启动文件和 _ZO_DATA_DIR |
| fzf | 本轮未安装，也未测试交互式选择 |

[本次测试日志](https://github.com/jiankn/zoxide/actions/runs/37785045934)包含初始化代码、终端抓屏和终端外部的数据库查询；附件保留了完整抓屏与 results.json。下文输出把 /home/tester 缩写为 ~，删去了测试完成标记和空白行；初始化代码的节选会单独注明。

## z 为什么能改变当前 Shell 的目录

跳转案例使用独立数据库，先执行 zoxide add /home/tester/projects/api-server，再从 /home/tester 开始查询。下面把抓屏中同一行的命令拆开展示，便于对应输入和输出：

~~~text
$ pwd
~
$ zoxide query api
~/projects/api-server
$ pwd
~
$ z api
$ pwd
~/projects/api-server
~~~

query 输出了一个路径，当前 Shell 仍在原处；执行 z 后，当前目录才变成 api-server。zoxide init bash 生成的代码解释了这个过程。

以下两个函数来自生成结果，中间的其他代码已省略：

~~~bash
function z() {
    __zoxide_z "$@"
}

function __zoxide_cd() {
    # shellcheck disable=SC2164
    \builtin cd -- "$@"
}
~~~

__zoxide_z 的关键词查询分支里有这一行：

~~~bash
        result="$(\command zoxide query --exclude "$(__zoxide_pwd)" -- "$@")" &&
~~~

这一行也是节选，不能作为独立命令执行；后面省略的一行把查询结果传给 __zoxide_cd。调用顺序是 z → __zoxide_z → zoxide query → __zoxide_cd → builtin cd。查询进程提供路径，Shell 函数在当前 Shell 内调用内建 cd。

生成代码之后还要加载它。测试用 Bash 启动文件执行 eval "$(zoxide init bash)"；Zsh 则在 compinit 后执行 eval "$(zoxide init zsh)"。[初始化实测指南](/zh/blog/zoxide-init-guide/)解释了启动文件位置和命令名称。

## frecency 分数如何变化：本次测到的即时结果

frecency 把使用频率与近期程度结合起来。本轮用 zoxide query --list --score 观察记录后立即查询的分数；这个数值是显示分数，不是访问次数。

显式 add 使用独立、空的 _ZO_DATA_DIR，每次添加后立即查询：

~~~text
$ zoxide query --list --score
# 没有输出：数据库为空。
$ zoxide add ~/projects/api-server
$ zoxide query --list --score
   4.0 ~/projects/api-server
$ zoxide add ~/projects/api-server
$ zoxide query --list --score
   8.0 ~/projects/api-server
$ zoxide add ~/projects/api-server
$ zoxide query --list --score
  12.0 ~/projects/api-server
~~~

“没有输出”是编辑注释。调用者没有切换目录，连续三次 add 仍把同一路径的分数依次加到了 4.0、8.0、12.0。显式添加与 Shell 自动记录可以分开观察。

接下来，Bash 和 Zsh 各自从另一份空数据库开始，使用默认初始化。每发出一条命令，我们都等待提示符重新出现，再从终端外部查询同一个数据库。下表按实际执行顺序列出同一路径的分数：

| 操作 | Bash 中 api-server 的分数 | Zsh 中 api-server 的分数 |
| --- | --- | --- |
| cd ~/projects/api-server | 4.0 | 4.0 |
| 已在目录内，再执行 cd . | 4.0 | 8.0 |
| 分两条命令执行 cd ~、cd ~/projects/api-server | 8.0 | 12.0 |
| 再离开并返回一次，两条命令分别执行 | 12.0 | 16.0 |

Bash 的 cd . 没有重复记录，Zsh 的 cd . 增加了记录。先离开、再回到这个目录，两种 Shell 都会增加记录。Zsh 的同目录 cd 也能产生记录事件，分数因此不能直接当作访问不同目录的次数。

**等待时间对分数的影响未测试。** 本轮没有跨小时、天或周等待，没有修改系统时钟，也没有测试 _ZO_MAXAGE 的清理行为。上面的即时分数不能作为长期变化的实测证据。

## Bash 与 Zsh 到底在何时记录目录

交互终端实际显示的 hook 注册是：

~~~text
Bash:
declare -- PROMPT_COMMAND="__zoxide_hook"

Zsh:
typeset -a chpwd_functions=( __zoxide_hook )
~~~

Bash 的默认 pwd hook 由 PROMPT_COMMAND 在下一个提示符出现前调用，生成的函数会比较当前路径与上次路径。Zsh 把函数接到 chpwd_functions，在该事件发生时执行 add。同样叫默认 pwd 模式，实现时机却不同。

完成上面的分数序列后，我们把以下内容作为一行发送到终端：

~~~bash
cd ~/projects/api-gateway; cd ~/work/api-docs; zoxide query --list --score
~~~

等提示符重新出现，再从终端外部查询一次，结果如下：

| 查询时刻 | Bash | Zsh |
| --- | --- | --- |
| 两次 cd 后，同一行里的 query | 只有 api-server，分数 12.0 | api-server 16.0、api-docs 4.0、api-gateway 4.0 |
| 下一个提示符出现后的外部 query | api-server 12.0、api-docs 4.0；没有 api-gateway | 仍是上面三个记录 |

Bash 到提示符出现时才记住最后的 api-docs，中间的 api-gateway 没有被记录。Zsh 在同一行里的 query 执行前就记录了两次 cd。因此，在 Bash 的命令列表里紧接 cd 查询，还看不到新目录时，可以等提示符出现后再查一次。

### 子脚本里的 cd 没有教会父 Shell

测试用子 Bash 脚本进入 ~/scratch/script-only 并打印路径。脚本结束后，交互父 Shell 打印的仍是 ~/projects/api-server。Bash 和 Zsh 父 Shell 的数据库都仍只有 api-server，分数也没有改变；这个子脚本没有加载 zoxide 初始化代码。

我们另外测试了一份会加载初始化代码的非交互 Bash：

~~~bash
bash -c 'eval "$(zoxide init bash)"; cd /home/tester/scratch/script-only; pwd'
~~~

它打印了 script-only 路径，但在外部查询这一案例的空数据库，仍没有记录。非交互执行不会绘制提示符，也就不会调用 PROMPT_COMMAND。脚本需要主动记录目录时，可以采用上面实测过的 add。

### PowerShell：引用另一份有日期的 Windows 实测

[Windows 安装教程](/zh/tutorials/install-windows/)的测试日期是 2026-09-30，环境为 Windows 11 Pro 23H2、PowerShell 7.6.6 和 zoxide 0.10.0。那次测试发现目录记录通过 prompt 函数完成：初始化后再重定义 prompt 会停止记录，不绘制提示符的脚本 cd 也不记录。这里引用的是此前的 Windows 证据，本轮 Ubuntu 测试没有运行 PowerShell。

## z 也能处理真实路径、z .. 和 z -

跳转终端还得到了以下结果：

| 起始目录 | 命令 | pwd 输出的目录 |
| --- | --- | --- |
| ~/projects/api-server | z .. | ~/projects |
| ~/projects | z - | ~/projects/api-server |
| ~/projects/api-server | z /home/tester/scratch | ~/scratch |
| ~/scratch | z unlearned-child | ~/scratch/unlearned-child |

最后两次跳转前，查询列表里没有 unlearned-child 记录。这个子目录已经存在于磁盘上，z 没有依赖已学习的匹配就进入了它。生成的 Bash 函数会先检查单个参数能否当作路径使用，再考虑数据库查询。

在这些案例里，父目录、上一目录、绝对路径和已有子目录的行为与 cd 一致。本轮没有比较 cd 的全部选项、CDPATH 或符号链接行为。[命令参考](/zh/blog/zoxide-commands/)提供了更完整的命令实测。

## 在独立 Shell 中复现记录测试

先创建测试目录，再在加载初始化代码之前设置一个空数据库。下面的准备命令放在另开的 Bash 会话里执行：

~~~bash
mkdir -p ~/projects/api-server ~/projects/api-gateway ~/work/api-docs
export _ZO_DATA_DIR="$(mktemp -d)"
eval "$(zoxide init bash)"
~~~

Zsh 会话改用 eval "$(zoxide init zsh)"。比较提示符之后的分数时，把每次 cd 分行发送；测试同一行连续切换时，把两次 cd 和 query 保持在一行。自动测试通过 tmux capture-pane -p 抓屏，外部查询与交互 Shell 共用同一 _ZO_DATA_DIR。

实测的 0.10.0 帮助列出了六个公开配置变量：_ZO_DATA_DIR、_ZO_ECHO、_ZO_EXCLUDE_DIRS、_ZO_FZF_OPTS、_ZO_MAXAGE、_ZO_RESOLVE_SYMLINKS。本轮只改变了用于隔离案例的 _ZO_DATA_DIR，其余五项没有改变。其他 hook 模式和更多 Linux Shell 的结果见[初始化实测](/zh/blog/zoxide-init-guide/)。本轮未测试 fzf、macOS 与 Windows 配置文件，也未测试分数的长期变化。
`,
  },
  'zoxide-toha-cd-no-kawari': {
    ja: String.raw`# zoxide とは？ディレクトリ移動と記録の仕組みを実測

zoxide はディレクトリをデータベースに記録し、短いキーワードからパスを検索するツールです。端末で使う z は初期化コードが定義するシェル関数で、バイナリから移動先を受け取り、現在のシェルで cd を実行します。今回のテストでは空のデータベースに ~/projects/api-server を追加し、z api でその場所へ移動しました。

自動記録にはシェルの hook が使われます。Bash と Zsh で同じ cd の列を実行しても、記録された回数は同じになりませんでした。

## テスト環境

| 項目 | 実際の環境 |
| --- | --- |
| 日付 | 2026-10-08 |
| OS | 新規 ubuntu:24.04 コンテナ。OS の表示は Ubuntu 24.04.5 LTS、x86_64 |
| ユーザー | 一般ユーザー tester、uid 1001 |
| シェル | Bash 5.2.21、Zsh 5.9 |
| zoxide | 0.10.0。tester が公式インストールスクリプトで導入 |
| hook | zoxide init --help が示す既定値 pwd |
| 方法 | GitHub Actions、tmux 3.4 の対話端末、120 × 30。ケースごとに起動ファイルと _ZO_DATA_DIR を分離 |
| fzf | 今回は未インストール。対話選択も未テスト |

[テストログ](https://github.com/jiankn/zoxide/actions/runs/37785045934)には生成コード、端末のキャプチャ、端末外からのデータベース検索を記録しています。添付アーティファクトには完全なキャプチャと results.json があります。以下の出力では /home/tester を ~ に短縮し、完了マーカーと空行を省きました。生成コードの抜粋もその都度明示します。

## z が現在のシェルのディレクトリを変える流れ

移動用のケースでは、別のデータベースに zoxide add /home/tester/projects/api-server でパスを追加しました。シェルの開始位置は /home/tester です。端末で同じ行に送ったコマンドを個別に分けると、入出力は次のようになります。

~~~text
$ pwd
~
$ zoxide query api
~/projects/api-server
$ pwd
~
$ z api
$ pwd
~/projects/api-server
~~~

query が出力したのはパスで、現在のシェルは元の場所に残っています。z を実行すると、そのシェルの現在位置が api-server に変わりました。zoxide init bash の生成結果を見ると、役割を確認できます。

次の二つの関数は生成結果からの抜粋です。間にある別のコードは省いています。

~~~bash
function z() {
    __zoxide_z "$@"
}

function __zoxide_cd() {
    # shellcheck disable=SC2164
    \builtin cd -- "$@"
}
~~~

__zoxide_z のキーワード検索の分岐には、次の行がありました。

~~~bash
        result="$(\command zoxide query --exclude "$(__zoxide_pwd)" -- "$@")" &&
~~~

この一行も抜粋であり、単独で実行するためのコマンドではありません。省略した次の行で結果を __zoxide_cd に渡します。呼び出しは z → __zoxide_z → zoxide query → __zoxide_cd → builtin cd と進みます。検索用の子プロセスがパスを出し、シェル関数が現在のシェル内で組み込みの cd を実行します。

生成したコードを読み込む必要もあります。テストの Bash 起動ファイルでは eval "$(zoxide init bash)"、Zsh では compinit の後に eval "$(zoxide init zsh)" を実行しました。起動ファイルとコマンド名は[初期化の実測ガイド](/ja/blog/zoxide-init-guide/)で確認できます。

## frecency のスコアを記録直後に調べる

frecency は頻度と最近の使用を組み合わせる考え方です。今回は zoxide query --list --score で、記録直後の数値を測りました。表示される数値はスコアであり、訪問回数そのものではありません。

明示的な add のテストでは、専用の空の _ZO_DATA_DIR を使い、追加するたびにすぐ検索しました。

~~~text
$ zoxide query --list --score
# 出力なし。データベースは空。
$ zoxide add ~/projects/api-server
$ zoxide query --list --score
   4.0 ~/projects/api-server
$ zoxide add ~/projects/api-server
$ zoxide query --list --score
   8.0 ~/projects/api-server
$ zoxide add ~/projects/api-server
$ zoxide query --list --score
  12.0 ~/projects/api-server
~~~

「出力なし」のコメントは編集時の注記です。呼び出す側は移動していませんが、同じパスへの三回の add でスコアが 4.0、8.0、12.0 と増えました。明示的な記録とシェル hook による記録は、別々に調べられます。

対話テストでは Bash と Zsh にそれぞれ別の空のデータベースを用意し、既定の初期化を使いました。一つずつコマンドを送り、プロンプトが戻ってから端末外のプロセスで同じデータベースを検索しています。表は各シェルで続けて実行した順序です。

| 操作 | Bash の api-server スコア | Zsh の api-server スコア |
| --- | --- | --- |
| cd ~/projects/api-server | 4.0 | 4.0 |
| 同じ場所で cd . | 4.0 | 8.0 |
| cd ~ と cd ~/projects/api-server を別々に送信 | 8.0 | 12.0 |
| もう一度離れて戻る。二つのコマンドを別々に送信 | 12.0 | 16.0 |

Bash では cd . で記録が増えず、Zsh では増えました。一度離れて戻った場合は両方で増えています。Zsh では同じ場所への cd も記録イベントになるため、このスコアを異なる場所への訪問数として数えることはできません。

**待ち時間によるスコアの変化は未テストです。** 時間・日・週の境界を越えて待つ実験、時計の変更、_ZO_MAXAGE による削除は行っていません。上の即時スコアは長時間経過後の変化を測った結果ではありません。

## Bash と Zsh が記録するタイミング

対話端末で確認した hook の登録は次のとおりでした。

~~~text
Bash:
declare -- PROMPT_COMMAND="__zoxide_hook"

Zsh:
typeset -a chpwd_functions=( __zoxide_hook )
~~~

Bash の既定の pwd hook は、次のプロンプトの前に PROMPT_COMMAND 経由で動きます。生成された関数は現在のパスと直前のパスを比較します。Zsh は chpwd_functions に関数を登録し、そのイベントが起きると add を実行します。同じ既定モードでも呼び出すタイミングが異なります。

上のスコア測定の後、端末に次の一行を送りました。

~~~bash
cd ~/projects/api-gateway; cd ~/work/api-docs; zoxide query --list --score
~~~

プロンプトが戻ってから、端末外でもう一度検索した結果を並べます。

| 検索時点 | Bash | Zsh |
| --- | --- | --- |
| 二つの cd と同じ行の query | api-server 12.0 のみ | api-server 16.0、api-docs 4.0、api-gateway 4.0 |
| 次のプロンプトの後、端末外の query | api-server 12.0 と api-docs 4.0。api-gateway はなし | 上と同じ三つの記録 |

Bash はプロンプトが表示されると最後の api-docs を記録し、途中の api-gateway は記録しませんでした。Zsh は同じ行の query が始まる前に両方の cd を記録しています。Bash で cd のすぐ後に新しいパスが見つからない場合は、プロンプトが戻った後の検索と比較できます。

### 子スクリプト内の cd は親シェルに記録されなかった

子 Bash スクリプトで ~/scratch/script-only に移動して現在位置を出力しました。終了後に対話型の親シェルが出した位置は ~/projects/api-server のままです。親が Bash と Zsh のどちらでも、データベースには以前と同じスコアの api-server だけが残りました。この子スクリプトは zoxide の初期化を読み込んでいません。

さらに、初期化を読み込む別の非対話 Bash も試しました。

~~~bash
bash -c 'eval "$(zoxide init bash)"; cd /home/tester/scratch/script-only; pwd'
~~~

script-only のパスは出力されましたが、このケースの空のデータベースを外から検索しても記録はありませんでした。プロンプトを描画しないため、PROMPT_COMMAND が呼ばれません。スクリプトで明示的に記録する方法としては、上の add を実測しています。

### PowerShell の説明は別の日の Windows テストから

[Windows インストールガイド](/ja/tutorials/install-windows/)は 2026-09-30 に Windows 11 Pro 23H2、PowerShell 7.6.6、zoxide 0.10.0 で測定した記事です。記録が prompt 関数を通ること、初期化後に prompt を再定義すると記録が止まること、プロンプトを描画しないスクリプトの cd は記録されないことを確認しています。これは以前の Windows テストからの引用で、今回の Ubuntu ケースでは PowerShell を実行していません。

## 実在するパス、z .. と z - の動作

移動用の端末では次の結果も得られました。

| 開始位置 | コマンド | pwd が示した位置 |
| --- | --- | --- |
| ~/projects/api-server | z .. | ~/projects |
| ~/projects | z - | ~/projects/api-server |
| ~/projects/api-server | z /home/tester/scratch | ~/scratch |
| ~/scratch | z unlearned-child | ~/scratch/unlearned-child |

最後の二つの移動前には、検索リストに unlearned-child の記録がありませんでした。その子ディレクトリはディスク上に存在しており、学習済みの候補なしで移動できました。生成された Bash 関数は、引数が一つならパスとして移動できるかを先に確認し、その後でデータベース検索へ進みます。

このケースでは、親ディレクトリ、直前のディレクトリ、絶対パス、実在する子ディレクトリへの移動が cd と同様に動きました。cd の全オプション、CDPATH、シンボリックリンクの挙動は比較していません。ほかのコマンドは[コマンド実測リファレンス](/ja/blog/zoxide-commands/)にまとめています。

## 別のシェルで記録テストを再現する

テスト用のディレクトリを作り、初期化を読み込む前に空のデータベースを選びます。別に開いた Bash セッションで次の準備を実行してください。

~~~bash
mkdir -p ~/projects/api-server ~/projects/api-gateway ~/work/api-docs
export _ZO_DATA_DIR="$(mktemp -d)"
eval "$(zoxide init bash)"
~~~

Zsh セッションでは eval "$(zoxide init zsh)" を使います。プロンプト後のスコアを比べる場合は cd を一行ずつ送り、連続移動のケースは二つの cd と query を同じ行にします。自動テストは tmux capture-pane -p で端末を取得し、対話シェルと同じ _ZO_DATA_DIR を端末外の検索にも渡しました。

測定した 0.10.0 のヘルプには、公開設定変数として _ZO_DATA_DIR、_ZO_ECHO、_ZO_EXCLUDE_DIRS、_ZO_FZF_OPTS、_ZO_MAXAGE、_ZO_RESOLVE_SYMLINKS の六つが載っています。今回変更したのはケースを分けるための _ZO_DATA_DIR だけで、ほかの五つは変更していません。別の hook モードと Linux シェルの結果は[初期化テスト](/ja/blog/zoxide-init-guide/)で読めます。今回、fzf、macOS と Windows のプロファイル、長期的なスコア変化は未テストです。
`,
  },
  'zoxide-init-guide': {
    en: String.raw`# zoxide init: tested shell setup, command names and hook modes

zoxide init generates shell code. Loading that code defines navigation commands and connects directory recording to a shell hook. We tested both parts separately: a defined z command does not prove that directory learning is enabled.

## Test environment

| Item | Value |
| --- | --- |
| Date | October 8, 2026 |
| System | Fresh ubuntu:24.04 container, x86_64, ordinary user tester |
| Shells | Bash 5.2.21, Zsh 5.9, Fish 3.7.0, PowerShell 7.6.6, Nushell 0.116.1 |
| zoxide | 0.10.0, installed with the official script as the user |
| fzf | 0.74.4 (a140afeb), installed from its upstream clone with --bin |
| Method | GitHub Actions; tmux 3.4 interactive terminals, 120 × 30; isolated startup files and _ZO_DATA_DIR |

The [test run](https://github.com/jiankn/zoxide/actions/runs/37778722771) includes generated initialization code, terminal captures and database queries. Output paths here abbreviate /home/tester as ~. Screen excerpts omit completion markers, empty space and parts of function definitions. These were Linux tests, including PowerShell; this run did not test Windows or macOS profiles.

## Initialize Bash, Zsh or Fish, then check z

First, zoxide --version must work in the shell where you want to initialize it. Our binary printed zoxide 0.10.0. If the binary is missing, follow [download and install](/download/) before editing a profile.

The normal startup lines are:

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

Our interactive tests used explicit --hook prompt, --hook pwd or --hook none with these loading forms. The tested help reports pwd as the default. For Zsh, the test configuration ran autoload -Uz compinit; compinit before initialization. The startup-file locations above follow the [upstream setup instructions](https://github.com/ajeetdsouza/zoxide/tree/v0.10.0#installation); we used separate test startup files.

After initialization, type z confirmed the command in all three shells:

| Shell | Result |
| --- | --- |
| Bash | z is a function; its body calls __zoxide_z |
| Zsh | z is a shell function; its body calls __zoxide_z |
| Fish | z is a function with definition; the generated alias calls __zoxide_z |

For example, the Bash excerpt was:

~~~bash
z is a function
z ()
{
    __zoxide_z "$@"
}
~~~

Use [command not found troubleshooting](/blog/zoxide-command-not-found/) when the version command works but this check fails.

## zoxide init --hook: default pwd is implemented differently by each shell

The 0.10.0 help lists three hook modes: prompt, pwd and none. We tested all three in Bash, Zsh and Fish, starting each case with an empty query list.

To choose a hook, edit the initialization line in your startup file and open a fresh shell. These forms were used in the pwd tests:

~~~bash
eval "$(zoxide init bash --hook pwd)"
eval "$(zoxide init zsh --hook pwd)"
~~~

~~~fish
zoxide init fish --hook pwd | source
~~~

The measurement sequence matters. First we entered cd /home/tester/projects/api-server, then ran zoxide query --list --score as the next interactive command. After it returned to the prompt, the test driver read the score with a separate external query. We then entered cd . and read externally again. Finally, one input line entered api-gateway and then api-docs; after another query, we checked whether the intermediate api-gateway path had been learned.

| Shell and hook | Score after cd and the following query returned | Score after cd . | Intermediate api-gateway recorded |
| --- | --- | --- | --- |
| Bash prompt | 8.0 | 12.0 | No |
| Bash pwd | 4.0 | 4.0 | No |
| Bash none | No record | No record | No |
| Zsh prompt | 8.0 | 12.0 | No |
| Zsh pwd | 4.0 | 8.0 | Yes |
| Zsh none | No record | No record | No |
| Fish prompt | 8.0 | 12.0 | No |
| Fish pwd | 4.0 | 8.0 | Yes |
| Fish none | No record | No record | No |

With prompt, returning to another prompt increased the score even when the command was only a query. That is why the external observation was 8.0 after one cd plus one query. It should not be read as two directory changes.

With pwd, the generated Bash code used PROMPT_COMMAND to compare the current directory with its previous value. It did not record cd . and it missed the intermediate directory in a single line containing two cd commands. Zsh registered chpwd_functions; Fish registered an --on-variable PWD handler. Both recorded cd . and the intermediate directory in our test.

Here is the Bash pwd case, with the automation markers removed:

~~~text
B> zoxide query --list --score
(no output)
B> cd /home/tester/projects/api-server
B> zoxide query --list --score
   4.0 ~/projects/api-server
B> cd .
~~~

The external query after cd . still showed 4.0. In Zsh and Fish it showed 8.0. The parenthesized empty-output line above is an article annotation.

--hook none defined the navigation commands but left all three test databases empty after ordinary cd commands. If you choose it, automatic learning is disabled; the separate add command remained available in our [command tests](/blog/zoxide-commands/).

## --cmd and --no-cmd: command names and learning are separate

In fresh Bash, Zsh and Fish sessions, --cmd j created j and ji. type z and type zi failed in those sessions. --no-cmd created neither pair, while type __zoxide_z confirmed that the internal navigation function still existed. The recording hook remained active: after cd into api-server, query returned its record.

~~~bash
eval "$(zoxide init bash --cmd j)"

# In a separate fresh shell:
eval "$(zoxide init bash --no-cmd)"
~~~

The tests combined these naming flags with --hook prompt; command-name checks were also performed in Zsh and Fish using their corresponding init syntax. The lines above show the same naming choices with the default hook.

We also tested Bash with --hook prompt --cmd cd. It defined cd and cdi; z and zi were absent in that fresh shell. A single line that entered api-gateway and then api-docs still recorded only the final directory. Changing the prefix does not make a prompt hook observe every intermediate cd.

## PowerShell: loaded successfully on Linux

PowerShell was installed from Microsoft's Ubuntu 24.04 package repository. Our startup script loaded:

~~~powershell
Invoke-Expression (& { (zoxide init powershell | Out-String) })
Get-Command z,zi | Format-Table CommandType,Name -AutoSize
~~~

The lookup returned:

~~~text
CommandType Name
----------- ----
      Alias z
      Alias zi
~~~

Before changing directory, query --list --score was empty. After Set-Location /home/tester/projects/api-server and a return to the prompt, it showed 4.0 for that path. z .. then moved to ~/projects. The generated default initialization wrapped the prompt function and checked for a changed location.

PowerShell's other hook modes and naming flags were not tested. For a Windows profile walkthrough based on a separate Windows test, see [install on Windows](/tutorials/install-windows/).

## Nushell: generate a file, then source it

Nushell 0.116.1 was installed from its official Linux release archive. The test driver saved the output of zoxide init nushell to /home/tester/cases/zoxide.nu before starting the shell. Its test config contained:

~~~nu
source /home/tester/cases/zoxide.nu
~~~

help z reported Alias for __zoxide_z, with Command Type: custom. help zi reported Alias for __zoxide_zi. The initially empty database acquired api-server with score 4.0 after cd into that directory. After z .., print (pwd) returned ~/projects. The generated code attached recording to hooks.env_change.PWD.

The upstream configuration form uses a generated file too:

~~~nu
# Generate the file before config.nu sources it:
zoxide init nushell | save -f ~/.zoxide.nu

# In config.nu:
source ~/.zoxide.nu
~~~

Our run verified sourcing the generated file and using its commands with explicit test config paths. Automatic loading of a user's default env.nu/config.nu, other hook modes, naming flags and older Nushell versions were not tested.

## Check the database as well as the command

A useful setup check has two parts: look up z, then change to a real test directory and inspect query --list. The hook tests showed why both are needed: --hook none still provided z, and a query-only check could increase scores under --hook prompt.

zoxide --help listed six public configuration variables: _ZO_DATA_DIR, _ZO_ECHO, _ZO_EXCLUDE_DIRS, _ZO_FZF_OPTS, _ZO_MAXAGE and _ZO_RESOLVE_SYMLINKS. We used _ZO_DATA_DIR for isolation; this guide did not test the behavior of the other five. See [advanced configuration](/tutorials/advanced-config/) for their separate tests.

## Common questions

### Does --cmd cd keep z available?

In our fresh Bash session, it created cd and cdi, while type z and type zi failed. Check existing functions if you are reconfiguring a shell that has already been initialized.

### Does --no-cmd stop directory learning?

It did not in our tests. With an active hook, the database learned the directory even though z and zi were not defined. --hook none is the separate choice that disabled automatic recording.

### Does pwd mean the same recording timing in every shell?

No. Bash checked at the prompt; Zsh and Fish recorded their directory events, including cd . in this run. The table above gives the measured differences.

Choose the zoxide init line for your shell, verify its command definition, and check one learned directory. The [command reference](/blog/zoxide-commands/) covers jumps and database operations; the [fzf guide](/tutorials/fzf-integration/) covers interactive selection.`,
    zh: String.raw`# zoxide init 初始化指南：五种 Shell 配置与 hook 实测

zoxide init 会生成 Shell 代码。加载这段代码后，导航命令被定义，目录记录也接入 Shell 的 hook。这次把两件事分开测试：能找到 z，不代表目录一定正在被记录。

## 测试环境

| 项目 | 实际配置 |
| --- | --- |
| 日期 | 2026 年 10 月 8 日 |
| 系统 | 全新 ubuntu:24.04 容器，x86_64，普通用户 tester |
| Shell | Bash 5.2.21、Zsh 5.9、Fish 3.7.0、PowerShell 7.6.6、Nushell 0.116.1 |
| zoxide | 0.10.0，以普通用户运行官方脚本安装 |
| fzf | 0.74.4（a140afeb），克隆上游仓库后用 --bin 安装 |
| 方法 | GitHub Actions；tmux 3.4 交互终端，120 × 30；独立启动文件和 _ZO_DATA_DIR |

[测试运行](https://github.com/jiankn/zoxide/actions/runs/37778722771)保存了初始化输出、终端抓取和数据库查询。本文输出中的 ~ 代表 /home/tester，屏幕摘录省略自动化完成标记、空白和部分函数定义。PowerShell 也运行在 Linux 上；本轮没有测试 Windows、macOS 的配置文件。

## Bash、Zsh、Fish：加载初始化代码，再检查 z

先在准备配置的 Shell 中执行 zoxide --version。这次输出 zoxide 0.10.0。二进制命令找不到时，先按[下载安装指南](/zh/download/)处理。

通常使用的启动配置行如下：

~~~bash
# Bash：~/.bashrc
eval "$(zoxide init bash)"

# Zsh：~/.zshrc
eval "$(zoxide init zsh)"
~~~

~~~fish
# Fish：~/.config/fish/config.fish
zoxide init fish | source
~~~

交互测试在这些加载形式中分别显式加入 --hook prompt、--hook pwd 或 --hook none。实测 help 标明默认值是 pwd。Zsh 的测试配置还在初始化前运行了 autoload -Uz compinit; compinit。上面列出的常规配置文件位置来自[上游配置说明](https://github.com/ajeetdsouza/zoxide/tree/v0.10.0#installation)，本次使用的是隔离的测试启动文件。

加载后，三个 Shell 的 type z 均确认命令已定义：

| Shell | 实际结果 |
| --- | --- |
| Bash | z is a function，函数调用 __zoxide_z |
| Zsh | z is a shell function，函数调用 __zoxide_z |
| Fish | z is a function with definition，生成的别名函数调用 __zoxide_z |

例如 Bash 输出的片段是：

~~~bash
z is a function
z ()
{
    __zoxide_z "$@"
}
~~~

版本命令能运行、这个检查却失败时，参照[command not found 排错](/zh/blog/zoxide-command-not-found/)。

## zoxide init --hook：默认 pwd，各 Shell 的记录时机有差异

0.10.0 的 help 列出 prompt、pwd、none 三种模式。Bash、Zsh、Fish 的九组测试都从空查询列表开始。

选择模式时，修改启动文件里的初始化行，再打开一个全新 Shell。pwd 测试使用了下面的加载形式。

~~~bash
eval "$(zoxide init bash --hook pwd)"
eval "$(zoxide init zsh --hook pwd)"
~~~

~~~fish
zoxide init fish --hook pwd | source
~~~

下表的测量过程需要说明。先输入 cd /home/tester/projects/api-server，再在下一条交互命令中执行 zoxide query --list --score。等查询返回提示符，测试程序在 Shell 外部再查一次分数，得到第一列。随后执行一次 cd .，再从外部查询，得到第二列。最后，在同一输入行先 cd 到 api-gateway，再 cd 到 api-docs，查询后检查中间目录 api-gateway 有没有被记录。

| Shell 与 hook | cd 和随后查询返回提示符后的分数 | cd . 后的分数 | 中间目录 api-gateway 是否记录 |
| --- | --- | --- | --- |
| Bash prompt | 8.0 | 12.0 | 否 |
| Bash pwd | 4.0 | 4.0 | 否 |
| Bash none | 无记录 | 无记录 | 否 |
| Zsh prompt | 8.0 | 12.0 | 否 |
| Zsh pwd | 4.0 | 8.0 | 是 |
| Zsh none | 无记录 | 无记录 | 否 |
| Fish prompt | 8.0 | 12.0 | 否 |
| Fish pwd | 4.0 | 8.0 | 是 |
| Fish none | 无记录 | 无记录 | 否 |

prompt 模式下，即使只执行查询，返回新提示符也会加分。因此，一次 cd 加一次查询后，从外部看到的是 8.0，不能把它解释成两次目录变化。

pwd 模式下，Bash 生成的代码在 PROMPT_COMMAND 中比较当前目录与前一次目录。cd . 没有加分，同一输入行里两次 cd 的中间目录也没记录。Zsh 使用 chpwd_functions，Fish 使用 --on-variable PWD；这两个 Shell 都记录了 cd . 和中间目录。

Bash pwd 模式的终端摘录如下，已省略自动化标记：

~~~text
B> zoxide query --list --score
（无输出）
B> cd /home/tester/projects/api-server
B> zoxide query --list --score
   4.0 ~/projects/api-server
B> cd .
~~~

cd . 后，从外部查询仍是 4.0；Zsh 和 Fish 则是 8.0。“无输出”是文章标注，不是程序输出。

--hook none 仍然定义导航命令，但执行普通 cd 后，三个 Shell 的测试数据库都保持为空。它关闭的是自动学习；手动 add 在同轮[命令测试](/zh/blog/zoxide-commands/)中仍可使用。

## --cmd 与 --no-cmd：命令名和学习机制分别控制

在全新的 Bash、Zsh、Fish 会话里，--cmd j 定义了 j 和 ji，type z 与 type zi 失败。--no-cmd 没有定义这两组名称，但 type __zoxide_z 确认内部导航函数仍然存在。记录 hook 也还在：cd 到 api-server 后，查询能看到目录记录。

~~~bash
eval "$(zoxide init bash --cmd j)"

# 在另一份全新 Shell 中：
eval "$(zoxide init bash --no-cmd)"
~~~

实测时，这些命名参数与 --hook prompt 一起使用，Zsh 和 Fish 也分别用对应初始化语法检查了命令定义。上面示例保留命名参数，使用默认 hook。

还在 Bash 测试了 --hook prompt --cmd cd。它定义 cd 和 cdi；该全新 Shell 中没有 z 和 zi。同一输入行先进入 api-gateway，再进入 api-docs，仍然只记录最终目录。更换命令前缀，不会让 prompt hook 记录每一次中间 cd。

## PowerShell：在 Linux 中成功加载

PowerShell 从 Microsoft 的 Ubuntu 24.04 软件源安装。测试启动脚本执行：

~~~powershell
Invoke-Expression (& { (zoxide init powershell | Out-String) })
Get-Command z,zi | Format-Table CommandType,Name -AutoSize
~~~

查询命令定义得到：

~~~text
CommandType Name
----------- ----
      Alias z
      Alias zi
~~~

切换目录前，query --list --score 为空。Set-Location /home/tester/projects/api-server 返回提示符后，该路径的分数为 4.0。随后 z .. 移动到 ~/projects。默认生成代码包装了 prompt 函数，并检查位置是否变化。

PowerShell 的其他 hook 模式和命名参数未测试。Windows 配置文件的步骤来自另一次 Windows 实测，见[Windows 安装指南](/zh/tutorials/install-windows/)。

## Nushell：先生成文件，再 source

Nushell 0.116.1 从官方 Linux 发布压缩包安装。启动 Shell 前，测试程序把 zoxide init nushell 的输出保存到 /home/tester/cases/zoxide.nu。测试配置文件加载它：

~~~nu
source /home/tester/cases/zoxide.nu
~~~

help z 显示 Alias for __zoxide_z，Command Type 为 custom；help zi 显示 Alias for __zoxide_zi。原本为空的数据库，在 cd 到 api-server 后出现了分数 4.0 的记录。执行 z .. 后，print (pwd) 输出 ~/projects。生成代码把目录记录接入 hooks.env_change.PWD。

上游提供的常规配置方式同样先生成文件：

~~~nu
# 在 config.nu 加载前生成文件：
zoxide init nushell | save -f ~/.zoxide.nu

# config.nu 中：
source ~/.zoxide.nu
~~~

本轮验证了通过显式测试配置路径 source 生成文件，以及命令跳转和目录记录。用户默认 env.nu/config.nu 的自动加载、其他 hook 模式、命名参数和较老 Nushell 版本未测试。

## 检查命令定义，也检查数据库

配置后可以做两项检查：先查找 z，再进入一个真实测试目录，观察 query --list。hook 测试说明了为什么需要两项：--hook none 也能定义 z，而 --hook prompt 下只做查询也会继续加分。

zoxide --help 列出的六个公开配置变量是 _ZO_DATA_DIR、_ZO_ECHO、_ZO_EXCLUDE_DIRS、_ZO_FZF_OPTS、_ZO_MAXAGE、_ZO_RESOLVE_SYMLINKS。本文用 _ZO_DATA_DIR 隔离测试，其他五个变量的行为没有在本篇测试；另见[高级配置实测](/zh/tutorials/advanced-config/)。

## 常见问题

### --cmd cd 后还保留 z 吗？

本次全新 Bash 会话只有 cd 和 cdi，type z、type zi 都失败。在原有会话里修改配置时，再用 type 检查实际定义。

### --no-cmd 会停止学习目录吗？

这次测试中不会。hook 仍在工作，数据库照样学到了目录，只是没有定义 z 和 zi。关闭自动记录使用的是另一项 --hook none。

### pwd 在每种 Shell 中都是一样的记录时机吗？

不是。Bash 在提示符时检查；Zsh 和 Fish 记录目录事件，本次连 cd . 都加分。具体差异见上面的实测表。

选择符合当前 Shell 的 zoxide init 加载行，再确认命令定义和一条新学到的目录记录。[命令参考](/zh/blog/zoxide-commands/)覆盖跳转和数据库操作，[fzf 集成](/zh/tutorials/fzf-integration/)覆盖交互选择。`,
    ja: String.raw`# zoxide init：5 種類のシェル設定と hook の実測

zoxide init はシェルコードを生成します。そのコードを読み込むと移動コマンドが定義され、ディレクトリの記録がシェルの hook に接続されます。今回はこの 2 つを別々に確認しました。z が見つかるだけでは、学習も有効とは限りません。

## テスト環境

| 項目 | 実際の構成 |
| --- | --- |
| 日付 | 2026 年 10 月 8 日 |
| システム | 新規 ubuntu:24.04 コンテナ、x86_64、一般ユーザー tester |
| シェル | Bash 5.2.21、Zsh 5.9、Fish 3.7.0、PowerShell 7.6.6、Nushell 0.116.1 |
| zoxide | 0.10.0。一般ユーザーとして公式スクリプトで導入 |
| fzf | 0.74.4（a140afeb）。上流 clone から --bin で導入 |
| 方法 | GitHub Actions、tmux 3.4 の対話端末、120 × 30。独立した起動ファイルと _ZO_DATA_DIR |

[テスト実行](https://github.com/jiankn/zoxide/actions/runs/37778722771)に生成コード、端末キャプチャ、データベースの検索結果を保存しました。出力では /home/tester を ~ に短縮しています。画面から完了マーカー、空白、関数定義の一部を省きました。PowerShell も Linux 上で実行しています。Windows と macOS のプロファイルは今回未テストです。

## Bash、Zsh、Fish：初期化してから z を確認する

設定するシェルで、まず zoxide --version を実行します。今回は zoxide 0.10.0 を表示しました。バイナリが見つからなければ、先に[ダウンロードと導入](/ja/download/)を確認してください。

通常の起動設定行は次のとおりです。

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

対話テストでは、これらの読み込み方に --hook prompt、--hook pwd、--hook none を明示的に加えました。実際の help は pwd を既定値として示しています。Zsh のテスト設定では、初期化の前に autoload -Uz compinit; compinit も実行しました。通常の設定ファイルの位置は[上流の設定手順](https://github.com/ajeetdsouza/zoxide/tree/v0.10.0#installation)に従い、テスト自体は独立した起動ファイルを使っています。

初期化後、3 つのシェルで type z がコマンド定義を確認しました。

| シェル | 結果 |
| --- | --- |
| Bash | z is a function。関数から __zoxide_z を呼ぶ |
| Zsh | z is a shell function。関数から __zoxide_z を呼ぶ |
| Fish | z is a function with definition。生成した alias 関数から __zoxide_z を呼ぶ |

Bash の出力の抜粋です。

~~~bash
z is a function
z ()
{
    __zoxide_z "$@"
}
~~~

バージョン確認は成功するのに z が見つからない場合は、[command not found の対処](/ja/blog/zoxide-command-not-found/)を参照してください。

## zoxide init --hook：既定の pwd でもシェルごとに記録タイミングが違う

0.10.0 の help には prompt、pwd、none があります。Bash、Zsh、Fish の 9 ケースすべてを、空の検索一覧から始めました。

hook を選ぶ際は起動ファイルの初期化行を変更し、新規シェルを開きます。pwd テストで使った読み込み方です。

~~~bash
eval "$(zoxide init bash --hook pwd)"
eval "$(zoxide init zsh --hook pwd)"
~~~

~~~fish
zoxide init fish --hook pwd | source
~~~

表の測定手順を説明します。まず cd /home/tester/projects/api-server を入力し、次の対話コマンドで zoxide query --list --score を実行しました。プロンプトに戻った後、テストプログラムがシェルの外から検索してスコアを読みました。これが最初の数値列です。続いて cd . を 1 回実行し、もう一度外から検索しました。最後に、1 行で api-gateway と api-docs へ続けて cd し、検索後に途中の api-gateway が記録されたか確認しました。

| シェルと hook | cd と次の検索が戻った後のスコア | cd . 後のスコア | 途中の api-gateway を記録 |
| --- | --- | --- | --- |
| Bash prompt | 8.0 | 12.0 | いいえ |
| Bash pwd | 4.0 | 4.0 | いいえ |
| Bash none | 記録なし | 記録なし | いいえ |
| Zsh prompt | 8.0 | 12.0 | いいえ |
| Zsh pwd | 4.0 | 8.0 | はい |
| Zsh none | 記録なし | 記録なし | いいえ |
| Fish prompt | 8.0 | 12.0 | いいえ |
| Fish pwd | 4.0 | 8.0 | はい |
| Fish none | 記録なし | 記録なし | いいえ |

prompt では、検索だけでも次のプロンプトに戻るとスコアが増えました。そのため、cd 1 回と検索 1 回の後に外から観測した値は 8.0 です。ディレクトリを 2 回変えたという意味ではありません。

pwd の Bash 生成コードは、PROMPT_COMMAND で現在と前回のディレクトリを比較していました。cd . は加算せず、1 行の 2 回の cd では途中の場所を記録しませんでした。Zsh は chpwd_functions、Fish は --on-variable PWD を登録していました。この 2 つは cd . と途中のディレクトリを記録しました。

Bash pwd ケースの端末から、自動化マーカーを省いた抜粋です。

~~~text
B> zoxide query --list --score
（出力なし）
B> cd /home/tester/projects/api-server
B> zoxide query --list --score
   4.0 ~/projects/api-server
B> cd .
~~~

cd . 後に外から検索しても 4.0 のままでした。Zsh と Fish では 8.0 でした。「出力なし」は記事側の注記です。

--hook none でも移動コマンドは定義されましたが、通常の cd の後も 3 シェルのデータベースは空でした。自動学習を無効にする選択です。手動の add は同じ実行の[コマンドテスト](/ja/blog/zoxide-commands/)で利用できました。

## --cmd と --no-cmd：コマンド名と学習を別々に設定する

新規の Bash、Zsh、Fish で --cmd j は j と ji を作り、type z と type zi は失敗しました。--no-cmd はどちらの組も作りませんでしたが、type __zoxide_z で内部の移動関数は確認できました。記録 hook は有効で、api-server に cd した後の検索にそのパスが現れました。

~~~bash
eval "$(zoxide init bash --cmd j)"

# 別の新規シェルで:
eval "$(zoxide init bash --no-cmd)"
~~~

実測では命名オプションを --hook prompt と組み合わせ、Zsh と Fish も各シェルの初期化構文で定義を確認しました。上の例は同じ命名設定で既定の hook を使います。

Bash の --hook prompt --cmd cd も試しました。cd と cdi が定義され、新規シェルに z と zi はありませんでした。1 行で api-gateway、続けて api-docs に移動しても、記録は最後の場所だけでした。コマンドの接頭辞を変えても、prompt hook が途中の cd をすべて記録するわけではありません。

## PowerShell：Linux 上で初期化を確認

Microsoft の Ubuntu 24.04 パッケージリポジトリから PowerShell を導入しました。起動スクリプトは次を実行しました。

~~~powershell
Invoke-Expression (& { (zoxide init powershell | Out-String) })
Get-Command z,zi | Format-Table CommandType,Name -AutoSize
~~~

コマンド定義の検索結果です。

~~~text
CommandType Name
----------- ----
      Alias z
      Alias zi
~~~

移動前の query --list --score は空でした。Set-Location /home/tester/projects/api-server がプロンプトに戻ると、そのパスのスコアは 4.0 でした。z .. は ~/projects に移動しました。既定の生成コードは prompt 関数を包み、場所の変化を確認していました。

PowerShell の他の hook と命名オプションは未テストです。別の Windows 実測によるプロファイル手順は[Windows 導入ガイド](/ja/tutorials/install-windows/)にあります。

## Nushell：ファイルを生成して source する

Nushell 0.116.1 を公式 Linux リリースアーカイブから導入しました。テストプログラムは起動前に zoxide init nushell の出力を /home/tester/cases/zoxide.nu へ保存しました。テスト設定で次を読み込みました。

~~~nu
source /home/tester/cases/zoxide.nu
~~~

help z は Alias for __zoxide_z、Command Type は custom と表示しました。help zi は Alias for __zoxide_zi でした。空のデータベースは api-server に cd した後、そのパスをスコア 4.0 で記録しました。z .. の後、print (pwd) は ~/projects を返しました。生成コードは hooks.env_change.PWD に記録処理を接続しています。

上流の通常の設定例も、先にファイルを生成する形です。

~~~nu
# config.nu が読む前に生成する:
zoxide init nushell | save -f ~/.zoxide.nu

# config.nu 内:
source ~/.zoxide.nu
~~~

明示したテスト設定パスで生成ファイルを source し、移動と記録を確認しました。ユーザー既定の env.nu/config.nu の自動読み込み、他の hook、命名オプション、古い Nushell は未テストです。

## コマンド定義とデータベースの両方を確認する

設定後は z の定義を調べ、実在するテストディレクトリに移動して query --list も確認します。--hook none でも z は定義され、--hook prompt では検索だけでも加算されました。片方の確認だけでは、この違いが分かりません。

zoxide --help が列挙した公開設定変数は _ZO_DATA_DIR、_ZO_ECHO、_ZO_EXCLUDE_DIRS、_ZO_FZF_OPTS、_ZO_MAXAGE、_ZO_RESOLVE_SYMLINKS の 6 つです。このページでは _ZO_DATA_DIR でテストを分離しました。残る 5 つの動作は本稿ではテストしていません。個別の実測は[詳細設定](/ja/tutorials/advanced-config/)を参照してください。

## よくある質問

### --cmd cd でも z は残る？

新規 Bash セッションは cd と cdi を作り、type z と type zi は失敗しました。すでに初期化したシェルを変更する際は、古い関数が残っているかも確認します。

### --no-cmd は学習も止める？

今回のテストでは止まりませんでした。有効な hook はディレクトリを記録し、z と zi だけが定義されませんでした。自動記録を止める選択は --hook none です。

### pwd の記録タイミングは全シェルで同じ？

同じではありません。Bash はプロンプトで確認し、Zsh と Fish はディレクトリのイベントを記録しました。今回は cd . も加算されました。測定表に違いを示しています。

現在のシェルに合う zoxide init の読み込み行を選び、コマンド定義と新しく記録されたパスを確認します。[コマンド一覧](/ja/blog/zoxide-commands/)は移動とデータ操作、[fzf 連携](/ja/tutorials/fzf-integration/)は対話選択を扱います。`,
  },
  'zoxide-commands': {
    en: String.raw`# zoxide commands: z, zi, query, add, remove, import and edit

The zoxide commands below were run against version 0.10.0. The distinction that matters first is simple: z and zi change your shell's directory; zoxide query prints a path. The import syntax also needs a version check: this release rejected --from and accepted import subcommands instead.

## Test environment

| Item | Value |
| --- | --- |
| Date | October 8, 2026 |
| System | Fresh ubuntu:24.04 container, x86_64, ordinary user tester |
| Shells | Bash 5.2.21, Zsh 5.9, Fish 3.7.0; navigation examples here use Bash |
| zoxide | 0.10.0, installed as the user with the official install script |
| fzf | 0.74.4 (a140afeb), cloned from the upstream repository and installed with --bin |
| Method | GitHub Actions, tmux 3.4, 120 × 30 terminal; separate _ZO_DATA_DIR for each case |

The [test run and terminal captures](https://github.com/jiankn/zoxide/actions/runs/37778722771) contain the original outputs. On this page, ~ in output replaces /home/tester. Terminal excerpts omit automation completion markers, unused screen space and some function bodies. Import fixtures retain absolute paths because they are file contents, not shell expressions.

For the navigation tests we initialized Bash with --hook none, then populated a separate database using add. That kept the scores stable while testing jumps. Our starting list was:

~~~text
$ zoxide query --list --score
  12.0 ~/projects/api-server
   8.0 ~/projects/api-gateway
   4.0 ~/projects/space project
   4.0 ~/work/web-app/src
   4.0 ~/work/api-docs
~~~

## z: keywords and existing paths

z is a shell function supplied by initialization. Bash reported:

~~~bash
z is a function
z ()
{
    __zoxide_z "$@"
}
~~~

These are the observed destinations in one session, starting in ~:

| Command | Destination |
| --- | --- |
| z api | ~/projects/api-server |
| z projects gateway | ~/projects/api-gateway |
| z .. | ~/projects |
| z - | ~/projects/api-gateway |
| z /home/tester/scratch/unlearned-child | ~/scratch/unlearned-child, which was absent from the database |
| z | ~ |
| z projects / | ~/projects/api-server, from ~ |

An existing path works without a learned record. For keyword queries, order mattered: zoxide query projects gateway returned api-gateway, while zoxide query api projects printed zoxide: no match found and exited with status 1. The single keyword apiserver also failed against api-server. These results do not support treating z as arbitrary fuzzy filesystem search.

If type z fails, use the [initialization guide](/blog/zoxide-init-guide/). The binary installation alone does not define this function.

## zi and query --interactive: choose, then check who changes directory

From ~, zi api opened fzf with the three learned api paths. We pressed Down once and Enter; pwd then printed ~/projects/api-gateway.

In a separate selection, zoxide query --interactive api returned ~/projects/api-server. The following pwd still printed ~. This binary command returns the selection; the shell function zi performs the directory change.

Pressing Escape in the query selector returned exit status 130 without printing a selected path. The tested fzf was 0.74.4. The [upstream setup instructions](https://github.com/ajeetdsouza/zoxide/tree/v0.10.0#installation) list 0.51.0 as the minimum supported version; that minimum version was not tested in this run. See the [fzf integration guide](/tutorials/fzf-integration/) for setup.

## zoxide query: the flags actually listed in 0.10.0

We read zoxide query --help, then exercised each query option below:

| Option | Observed behavior |
| --- | --- |
| -l, --list | Listed all three api matches, in score order |
| -s, --score | Added a numeric score; without --list, returned only the first match |
| -i, --interactive | Opened the fzf selector and printed its selected path |
| -a, --all | Included a recorded directory after it was deleted from the filesystem |
| --exclude PATH | Skipped the specified path; excluding api-server made api-gateway the result |
| --base-dir PATH | Restricted results to paths inside the specified directory |

~~~text
$ zoxide query --score api
  12.0 ~/projects/api-server
$ zoxide query --exclude /home/tester/projects/api-server api
~/projects/api-gateway
$ zoxide query --list --base-dir /home/tester/projects api
~/projects/api-server
~/projects/api-gateway
~~~

The unavailable-directory test is useful when inspecting an old database. We added ~/scratch/deleted, removed that directory from the filesystem, and ran these queries in order:

~~~text
$ zoxide query --list --score --all
   4.0 ~/scratch/deleted
$ zoxide query --list --score
(no output)
$ zoxide query --list --score --all
   4.0 ~/scratch/deleted
~~~

The parenthesized line denotes an empty result; the program did not print it. A normal query hid the unavailable directory but did not delete its record in this test. Use remove when you want an explicit deletion.

## add and remove: operate on paths

In a fresh database, one add of /home/tester/projects/api-server produced a displayed score of 4.0. Three separate adds produced 12.0. After emptying the test database again, add --score 3 for the same path also produced 12.0. These are immediate query scores from the test, not counts of visits or measurements of long-term aging.

~~~bash
zoxide add /home/tester/projects/api-server
zoxide add --score 3 /home/tester/projects/api-server
zoxide add /home/tester/projects/api-gateway /home/tester/work/api-docs
~~~

remove requires a stored path. A fragment was rejected:

~~~text
$ zoxide remove api-server
zoxide: path not found in database: api-server
$ zoxide remove /home/tester/projects/api-server
(no output; the next list was empty)
~~~

Both add and remove accepted two paths in one command. remove --help listed no interactive removal flag. The database editor is a separate command.

## import: use the 0.10.0 subcommands

We tried the older syntax for both autojump and z. Both attempts exited with status 2:

~~~text
$ zoxide import --from autojump /home/tester/.local/share/autojump/autojump.txt
error: unexpected argument '--from' found
~~~

For this version, the working commands were:

~~~bash
zoxide import autojump
zoxide import z
~~~

Adding a filename after either subcommand was also rejected. In this Ubuntu test, autojump imported ~/.local/share/autojump/autojump.txt and z imported ~/.z. We created these synthetic files to test parsing; we did not install autojump or z for this article.

The autojump file contained two rows, with a literal tab between weight and path:

~~~text
10	/home/tester/projects/api-server
2	/home/tester/work/api-docs
~~~

Before import, zoxide query --list --score returned nothing. After zoxide import autojump:

~~~text
   0.2 ~/projects/api-server
   0.2 ~/work/api-docs
~~~

The imported scores were not the source weights 10 and 2. The displayed precision also made the two initial scores look equal; this output is insufficient to infer their full numeric values.

The z file used path, rank and Unix timestamp, separated by vertical bars:

~~~text
/home/tester/projects/api-gateway|3|1791463409
/home/tester/work/web-app/src|2|1791463409
~~~

Its separate destination database was empty before import. After zoxide import z:

~~~text
  12.0 ~/projects/api-gateway
   8.0 ~/work/web-app/src
~~~

A second import into either nonempty database failed with zoxide: current database is not empty, specify --merge to continue anyway. With --merge, the command succeeded. Reimporting the same z fixture changed the scores to 24.0 and 16.0; reimporting the autojump fixture changed them to 0.5 and 0.4. Repeated merging can add weight to entries that are already present.

The help also listed atuin, fasd, z.lua and zsh-z importers. Those four importers were not tested here.

## edit: the database editor exists

zoxide edit opened an fzf interface. This is a shortened excerpt of its actual screen, with borders and the preview pane removed:

~~~text
ctrl-r:reload    ctrl-d:delete
ctrl-w:increment ctrl-s:decrement

 SCORE PATH
  12.0 ~/projects/api-server
   8.0 ~/projects/api-gateway
~~~

We exited with Ctrl+C and confirmed that the database list was unchanged. Opening and cancellation were tested; deleting entries and adjusting their scores through this interface were not tested.

## Common questions

### Why does query return a path without moving me?

query is the binary command we used for inspection. Use the initialized z or zi shell function to change the current shell's directory.

### Can remove take the same keyword as z?

Our remove api-server attempt failed. Copy the full stored path from query --list, then pass that path to remove.

### Why does an import example with --from fail?

It is not the syntax accepted by the tested 0.10.0 binary. Check zoxide import --help and the chosen importer's help before migrating history.

For daily zoxide commands, start with z and query --list --score. The [init guide](/blog/zoxide-init-guide/) explains learning hooks, and [advanced configuration](/tutorials/advanced-config/) covers configuration variables. Long-term score decay, other operating systems and the four untested importers are outside this test.`,
    zh: String.raw`# zoxide 命令参考：z、zi、query、add、remove、import 与 edit 实测

这份 zoxide 命令参考来自 0.10.0 的实际运行结果。先分清两种操作：z 和 zi 改变当前 Shell 的目录，zoxide query 输出路径。导入命令尤其需要核对版本：这次运行中，--from 被拒绝，正确语法是 import 后接工具名子命令。

## 测试环境

| 项目 | 实际配置 |
| --- | --- |
| 日期 | 2026 年 10 月 8 日 |
| 系统 | 全新 ubuntu:24.04 容器，x86_64，普通用户 tester |
| Shell | Bash 5.2.21、Zsh 5.9、Fish 3.7.0；本文跳转示例使用 Bash |
| zoxide | 0.10.0，以普通用户运行官方安装脚本安装 |
| fzf | 0.74.4（a140afeb），克隆上游仓库后运行 --bin 安装 |
| 方法 | GitHub Actions，tmux 3.4，120 × 30 终端；每组用例使用独立的 _ZO_DATA_DIR |

[测试运行与终端抓取](https://github.com/jiankn/zoxide/actions/runs/37778722771)保留了原始输出。本文输出中的 ~ 代表 /home/tester；终端摘录省略了自动化完成标记、空白屏幕和部分函数体。导入文件中的路径保留绝对形式，因为文件里的 ~ 不会由 Shell 展开。

跳转测试先用 --hook none 初始化 Bash，再用 add 填充独立数据库，避免测试过程中分数继续变化。起始列表如下：

~~~text
$ zoxide query --list --score
  12.0 ~/projects/api-server
   8.0 ~/projects/api-gateway
   4.0 ~/projects/space project
   4.0 ~/work/web-app/src
   4.0 ~/work/api-docs
~~~

## z：关键词跳转和真实路径

z 由初始化代码定义。Bash 的 type z 输出是：

~~~bash
z is a function
z ()
{
    __zoxide_z "$@"
}
~~~

从用户主目录开始，连续执行下面的命令，得到这些位置：

| 命令 | pwd 确认的位置 |
| --- | --- |
| z api | ~/projects/api-server |
| z projects gateway | ~/projects/api-gateway |
| z .. | ~/projects |
| z - | ~/projects/api-gateway |
| z /home/tester/scratch/unlearned-child | ~/scratch/unlearned-child，这个目录没有数据库记录 |
| z | ~ |
| z projects / | 从主目录跳到 ~/projects/api-server |

真实路径存在时，不需要事先学习。关键词查询则要留意顺序：zoxide query projects gateway 找到了 api-gateway；zoxide query api projects 返回 zoxide: no match found，退出码为 1。把 api-server 写成 apiserver 也没有匹配。这些结果不能支持“随便模糊输入就能搜索整个文件系统”的说法。

如果 type z 找不到命令，先看[初始化指南](/zh/blog/zoxide-init-guide/)。只装二进制程序不会自动定义这个函数。

## zi 与 query --interactive：选中路径之后发生什么

在主目录执行 zi api，fzf 列出了三个包含 api 的已记录目录。按一次向下键，再按 Enter，pwd 显示 ~/projects/api-gateway。

另一次执行 zoxide query --interactive api，选中后输出 ~/projects/api-server，随后 pwd 仍然是主目录。二进制命令负责返回选择结果，zi 的 Shell 函数负责改变目录。

在 query 的选择界面按 Escape，退出码为 130，没有输出选中的路径。这次用的是 fzf 0.74.4。[上游配置说明](https://github.com/ajeetdsouza/zoxide/tree/v0.10.0#installation)列出的最低版本是 0.51.0，但本轮没有测试这个最低版本；安装步骤见[fzf 集成指南](/zh/tutorials/fzf-integration/)。

## zoxide query：按 0.10.0 的 help 核对参数

我们先读取 zoxide query --help，再逐项测试：

| 参数 | 实测行为 |
| --- | --- |
| -l、--list | 列出三个 api 匹配项，按分数排列 |
| -s、--score | 在路径前显示分数；不加 --list 时只返回第一项 |
| -i、--interactive | 打开 fzf，输出选中的路径 |
| -a、--all | 显示文件系统中已经被删除、数据库中仍有记录的目录 |
| --exclude PATH | 排除指定路径；排除 api-server 后返回 api-gateway |
| --base-dir PATH | 只搜索指定目录内部的记录 |

~~~text
$ zoxide query --score api
  12.0 ~/projects/api-server
$ zoxide query --exclude /home/tester/projects/api-server api
~/projects/api-gateway
$ zoxide query --list --base-dir /home/tester/projects api
~/projects/api-server
~/projects/api-gateway
~~~

排查旧记录时，--all 有一个容易误解的地方。测试先添加 ~/scratch/deleted，再从文件系统删除该目录，然后依次执行：

~~~text
$ zoxide query --list --score --all
   4.0 ~/scratch/deleted
$ zoxide query --list --score
（无输出）
$ zoxide query --list --score --all
   4.0 ~/scratch/deleted
~~~

“无输出”是本文标注，程序没有打印这几个字。普通查询隐藏了不可用目录，但这次没有把它从数据库删掉。要明确删除记录，使用 remove。

## add 与 remove：参数是路径

在空数据库中，对 /home/tester/projects/api-server 执行一次 add，查询分数为 4.0；分三次添加，分数为 12.0。清空测试数据库的记录后，执行一次 add --score 3，同样得到 12.0。这是立即查询到的分数，不能直接当成访问次数，也不是长期衰减测试。

~~~bash
zoxide add /home/tester/projects/api-server
zoxide add --score 3 /home/tester/projects/api-server
zoxide add /home/tester/projects/api-gateway /home/tester/work/api-docs
~~~

remove 不接受跳转时用的关键词片段：

~~~text
$ zoxide remove api-server
zoxide: path not found in database: api-server
$ zoxide remove /home/tester/projects/api-server
（无输出；随后查询列表为空）
~~~

add 和 remove 都成功接受了一条命令中的两个路径。remove --help 没有列出交互删除参数；交互数据库编辑使用另一条命令 edit。

## import：0.10.0 使用工具名子命令

旧写法分别用 autojump 和 z 测试过，均以退出码 2 失败：

~~~text
$ zoxide import --from autojump /home/tester/.local/share/autojump/autojump.txt
error: unexpected argument '--from' found
~~~

这次成功运行的写法是：

~~~bash
zoxide import autojump
zoxide import z
~~~

子命令后再加文件名，也会报 unexpected argument。在本次 Ubuntu 环境里，autojump 读取 ~/.local/share/autojump/autojump.txt，z 读取 ~/.z。两份源文件都是为测试解析格式而人工创建的；本文没有实际安装 autojump 或 z。

autojump 文件有两行，权重和路径之间是一个真正的 Tab：

~~~text
10	/home/tester/projects/api-server
2	/home/tester/work/api-docs
~~~

导入前，zoxide query --list --score 无输出。执行 zoxide import autojump 后：

~~~text
   0.2 ~/projects/api-server
   0.2 ~/work/api-docs
~~~

导入分数没有照搬源文件的 10 和 2。显示精度让两项看起来都是 0.2，不能据此认定它们的完整数值相等。

z 文件用竖线分隔路径、rank 和 Unix 时间戳：

~~~text
/home/tester/projects/api-gateway|3|1791463409
/home/tester/work/web-app/src|2|1791463409
~~~

另一份目标数据库在导入前也是空的。执行 zoxide import z 后：

~~~text
  12.0 ~/projects/api-gateway
   8.0 ~/work/web-app/src
~~~

两个数据库再次导入时，都返回 zoxide: current database is not empty, specify --merge to continue anyway。加上 --merge 后成功。重复合并同一份 z 文件，分数变为 24.0 和 16.0；重复合并 autojump 文件，则变为 0.5 和 0.4。合并相同数据会继续增加已有记录的权重。

help 还列出了 atuin、fasd、z.lua、zsh-z 四种导入子命令，这四项未测试。

## edit：数据库编辑界面确实存在

zoxide edit 打开了 fzf 界面。下面是实际屏幕的精简摘录，省略边框、预览区和其余记录：

~~~text
ctrl-r:reload    ctrl-d:delete
ctrl-w:increment ctrl-s:decrement

 SCORE PATH
  12.0 ~/projects/api-server
   8.0 ~/projects/api-gateway
~~~

这次按 Ctrl+C 退出，再查询确认列表没有变化。已测试打开和取消；通过编辑界面删除记录、调整分数的操作未测试。

## 常见问题

### 为什么 query 输出路径，却没有跳转？

query 是用来检查数据库的二进制命令。要改变当前 Shell 的目录，使用初始化后定义的 z 或 zi。

### remove 可以使用 z 的关键词吗？

这次 remove api-server 失败了。先从 query --list 找到完整记录路径，再把这个路径交给 remove。

### 为什么带 --from 的导入示例报错？

测试的 0.10.0 二进制不接受该语法。迁移历史前，先看 zoxide import --help 和所选导入子命令的 help。

日常使用 zoxide 命令，可以先掌握 z 与 query --list --score。[初始化指南](/zh/blog/zoxide-init-guide/)解释目录如何被记录，[高级配置](/zh/tutorials/advanced-config/)说明配置变量。本轮没有测试长期分数衰减、其他操作系统和另外四种导入来源。`,
    ja: String.raw`# zoxide コマンド一覧：z・zi・query・add・remove・import・edit の実測

この zoxide コマンド一覧は、0.10.0 を実行した結果から書いています。z と zi はシェルの現在のディレクトリを変え、zoxide query はパスを出力します。インポート構文にも違いがありました。このバージョンは --from を拒否し、import のサブコマンドを受け付けました。

## テスト環境

| 項目 | 実際の構成 |
| --- | --- |
| 日付 | 2026 年 10 月 8 日 |
| システム | 新規 ubuntu:24.04 コンテナ、x86_64、一般ユーザー tester |
| シェル | Bash 5.2.21、Zsh 5.9、Fish 3.7.0。このページの移動例は Bash |
| zoxide | 0.10.0。一般ユーザーとして公式インストールスクリプトを実行 |
| fzf | 0.74.4（a140afeb）。上流リポジトリを clone し、--bin で導入 |
| 方法 | GitHub Actions、tmux 3.4、120 × 30 の端末。ケースごとに独立した _ZO_DATA_DIR |

[テスト実行と端末キャプチャ](https://github.com/jiankn/zoxide/actions/runs/37778722771)に元の出力があります。このページでは、出力の ~ を /home/tester の省略形として使います。端末の抜粋から自動化用の完了マーカー、空白、関数本体の一部を省きました。インポート元ファイルはシェル式ではないため、絶対パスのまま掲載しています。

移動テストでは --hook none で Bash を初期化し、add で別のデータベースを作りました。移動中にスコアが変わらない構成です。開始時の一覧は次のとおりでした。

~~~text
$ zoxide query --list --score
  12.0 ~/projects/api-server
   8.0 ~/projects/api-gateway
   4.0 ~/projects/space project
   4.0 ~/work/web-app/src
   4.0 ~/work/api-docs
~~~

## z：キーワードと実在するパス

z は初期化コードが定義するシェル関数です。Bash の type z は次を表示しました。

~~~bash
z is a function
z ()
{
    __zoxide_z "$@"
}
~~~

ホームディレクトリから順に実行し、pwd で移動先を確認しました。

| コマンド | 移動先 |
| --- | --- |
| z api | ~/projects/api-server |
| z projects gateway | ~/projects/api-gateway |
| z .. | ~/projects |
| z - | ~/projects/api-gateway |
| z /home/tester/scratch/unlearned-child | ~/scratch/unlearned-child。データベースには未登録 |
| z | ~ |
| z projects / | ホームから ~/projects/api-server へ |

実在するパスなら、学習済みの記録がなくても移動できました。キーワードの順序は結果に影響します。zoxide query projects gateway は api-gateway を返しましたが、zoxide query api projects は zoxide: no match found を表示し、終了コードは 1 でした。api-server に対して apiserver と入力しても一致しません。この結果から、任意のあいまいな入力でファイルシステム全体を検索できるとは言えません。

type z が失敗する場合は[初期化ガイド](/ja/blog/zoxide-init-guide/)を参照してください。バイナリの導入だけでは、この関数は定義されません。

## zi と query --interactive：選択後に誰が移動するか

ホームから zi api を実行すると、fzf に学習済みの api パスが 3 件表示されました。下矢印を 1 回押して Enter で決定すると、pwd は ~/projects/api-gateway を表示しました。

別の選択では zoxide query --interactive api が ~/projects/api-server を出力しました。その後の pwd はホームのままでした。バイナリは選択したパスを返し、zi のシェル関数がディレクトリを変えます。

query の選択画面で Escape を押すと、パスを出力せず終了コード 130 で戻りました。今回は fzf 0.74.4 を使用しています。[上流の設定手順](https://github.com/ajeetdsouza/zoxide/tree/v0.10.0#installation)が示す最低対応バージョンは 0.51.0 ですが、その最低バージョン自体は今回テストしていません。設定は[fzf 連携ガイド](/ja/tutorials/fzf-integration/)にあります。

## zoxide query：0.10.0 の help にあるオプション

zoxide query --help を読み、次の検索オプションをそれぞれ実行しました。

| オプション | 観察した動作 |
| --- | --- |
| -l、--list | api の一致 3 件をスコア順に表示 |
| -s、--score | パスにスコアを付加。--list がなければ先頭の 1 件のみ |
| -i、--interactive | fzf を開き、選択したパスを出力 |
| -a、--all | ファイルシステムから削除済みの、記録に残るディレクトリを表示 |
| --exclude PATH | 指定パスを除外。api-server を除外すると api-gateway を返した |
| --base-dir PATH | 指定ディレクトリ内部の記録に検索を限定 |

~~~text
$ zoxide query --score api
  12.0 ~/projects/api-server
$ zoxide query --exclude /home/tester/projects/api-server api
~/projects/api-gateway
$ zoxide query --list --base-dir /home/tester/projects api
~/projects/api-server
~/projects/api-gateway
~~~

古い記録を調べる際は --all の動作に注意が必要です。~/scratch/deleted を登録してから実際のディレクトリを削除し、次の順で実行しました。

~~~text
$ zoxide query --list --score --all
   4.0 ~/scratch/deleted
$ zoxide query --list --score
（出力なし）
$ zoxide query --list --score --all
   4.0 ~/scratch/deleted
~~~

「出力なし」は記事側の注記で、プログラムの出力ではありません。通常の検索は利用できないパスを隠しましたが、このテストでは記録を削除しませんでした。明示的に消すには remove を使います。

## add と remove：パスを渡す

空のデータベースで /home/tester/projects/api-server を 1 回 add すると、直後の検索スコアは 4.0 でした。3 回の add では 12.0 です。テストのデータベースが再び空の状態で add --score 3 を 1 回実行した場合も 12.0 でした。これは直後に表示されたスコアであり、訪問回数そのものや長期間の減衰を測った値ではありません。

~~~bash
zoxide add /home/tester/projects/api-server
zoxide add --score 3 /home/tester/projects/api-server
zoxide add /home/tester/projects/api-gateway /home/tester/work/api-docs
~~~

remove に移動用のキーワード断片を渡すと失敗しました。

~~~text
$ zoxide remove api-server
zoxide: path not found in database: api-server
$ zoxide remove /home/tester/projects/api-server
（出力なし。次の一覧は空）
~~~

add と remove は、1 コマンドに 2 つのパスを渡した場合も成功しました。remove --help に対話削除のオプションはありませんでした。対話形式のデータベース編集は edit で行います。

## import：0.10.0 のサブコマンド構文

autojump と z の両方で旧構文を試しました。どちらも終了コード 2 で失敗しました。

~~~text
$ zoxide import --from autojump /home/tester/.local/share/autojump/autojump.txt
error: unexpected argument '--from' found
~~~

このバージョンで動いたコマンドは次の 2 つです。

~~~bash
zoxide import autojump
zoxide import z
~~~

サブコマンドの後にファイル名を追加しても unexpected argument になりました。今回の Ubuntu 環境では autojump が ~/.local/share/autojump/autojump.txt、z が ~/.z を読みました。解析を確かめるために作った合成データであり、この記事では autojump と z 自体を導入していません。

autojump ファイルは 2 行で、重みとパスの間には実際の Tab を入れました。

~~~text
10	/home/tester/projects/api-server
2	/home/tester/work/api-docs
~~~

インポート前の zoxide query --list --score は空でした。zoxide import autojump の実行後は次の出力です。

~~~text
   0.2 ~/projects/api-server
   0.2 ~/work/api-docs
~~~

元ファイルの重み 10 と 2 は、そのまま検索スコアになりませんでした。表示精度のため両方とも 0.2 に見えますが、完全な数値が等しいとまでは判断できません。

z のファイルは、パス、rank、Unix タイムスタンプを縦線で区切ります。

~~~text
/home/tester/projects/api-gateway|3|1791463409
/home/tester/work/web-app/src|2|1791463409
~~~

別の空のデータベースに zoxide import z を実行すると、次の記録になりました。

~~~text
  12.0 ~/projects/api-gateway
   8.0 ~/work/web-app/src
~~~

どちらも 2 回目のインポートは zoxide: current database is not empty, specify --merge to continue anyway で失敗しました。--merge を付けると成功しました。同じ z ファイルを再びマージした結果は 24.0 と 16.0、autojump ファイルでは 0.5 と 0.4 です。同じデータを繰り返しマージすると、既存の記録に重みが加わります。

help は atuin、fasd、z.lua、zsh-z も列挙していました。この 4 種類のインポートは未テストです。

## edit：データベース編集画面

zoxide edit は fzf の画面を開きました。実際のキャプチャから枠、プレビュー、残りの記録を省いた抜粋です。

~~~text
ctrl-r:reload    ctrl-d:delete
ctrl-w:increment ctrl-s:decrement

 SCORE PATH
  12.0 ~/projects/api-server
   8.0 ~/projects/api-gateway
~~~

Ctrl+C で終了し、一覧が変わっていないことを確認しました。起動とキャンセルはテストしましたが、画面内での削除とスコア調整は未テストです。

## よくある質問

### query がパスを出しても移動しないのはなぜ？

query はデータベースを調べるバイナリコマンドです。現在のシェルを移動させるには、初期化済みの z または zi を使います。

### remove に z と同じキーワードを渡せる？

remove api-server は失敗しました。query --list で完全な記録パスを確認し、それを remove に渡します。

### --from を使うインポート例が失敗するのはなぜ？

今回の 0.10.0 バイナリが受け付ける構文ではありません。移行前に zoxide import --help と対象サブコマンドの help を確認してください。

日常の zoxide コマンドは、z と query --list --score から始められます。[初期化ガイド](/ja/blog/zoxide-init-guide/)で記録フック、[詳細設定](/ja/tutorials/advanced-config/)で環境変数を確認できます。長期間のスコア減衰、他の OS、残る 4 種類のインポートは今回テストしていません。`,
  },
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
  "zoxide-alternatives-comparison-open-source": {
    en: String.raw`# zoxide alternatives tested in Bash: autojump, z, fasd and z.lua

All five tools learned our five test directories. The useful differences appeared when we reversed keywords, omitted a hyphen, asked for a missing match, or deleted a record. For example, autojump and fasd found api-server from apiserver; zoxide, z and the default z.lua setup did not. A missing match also did not always produce a nonzero exit status.

## Test environment

| Item | Recorded value |
| --- | --- |
| Date | 2026-10-08 |
| System | GitHub Actions, fresh ubuntu:24.04 container; Ubuntu 24.04.5 LTS, x86_64 |
| Shell and terminal | Bash 5.2.21, tmux 3.4; interactive Bash driven with send-keys and capture-pane |
| User | tester, UID 1001; HOME=/home/tester for every tool |
| Isolation | One tool initialized per Bash session, separate shell histories; the same directories and visit sequence |
| Evidence | [Complete test run and downloadable terminal captures](https://github.com/jiankn/zoxide/actions/runs/37799809255) |

Output excerpts omit the prompt and the test driver's exit-status markers. In examples, ~ means /home/tester. The result table uses the directory labels defined below; its numbers are shell exit statuses, not scores. These are observations from this configuration and sequence.

## Installation: versions and elapsed time

All five installations succeeded. Package installation ran as root; learning, jumping and importing ran as tester. The zoxide installer placed its executable in ~/.local/bin, which we added to PATH.

| Tool | Tested version or source revision | Installation performed | Elapsed |
| --- | --- | --- | --- |
| zoxide | 0.10.0 | Download and run the official install.sh | 1.048 s |
| autojump | v22.5.1; apt package 22.5.1-1.1 | apt-get install -y -qq autojump | 2.201 s |
| z | [d37a763a6a30e1b32766fecc3b8ffd6127f8a0fd](https://github.com/rupa/z/blob/d37a763a6a30e1b32766fecc3b8ffd6127f8a0fd/z.sh) | git clone --depth 1 of rupa/z | 0.349 s |
| fasd | 1.0.1; apt package 1.0.1-3 | apt-get install -y -qq fasd | 0.984 s |
| z.lua | [86a9fc5b308b66197720811d295e3812b1c73325](https://github.com/skywind3000/z.lua/blob/86a9fc5b308b66197720811d295e3812b1c73325/z.lua); Lua 5.4.6 | apt-get install -y -qq lua5.4, then shallow clone of skywind3000/z.lua | 2.103 s |

The clock covered each tool's installation commands once, including downloads. The z.lua measurement includes installing Lua, whose apt package was 5.4.6-3build2. The earlier apt update and common dependencies such as curl, Git, Python and tmux are excluded. These numbers describe one runner's setup; they do not measure query speed or establish a performance ranking.

We used the following initialization lines independently. The paths reflect where the test clones were installed. Loading all five together would create competing z commands.

| Tool | Initialization in the test Bash session | Jump command |
| --- | --- | --- |
| zoxide | eval "$(zoxide init bash)" | z |
| autojump | source /usr/share/autojump/autojump.sh | j |
| z | source /home/tester/tools/z/z.sh | z |
| fasd | eval "$(fasd --init auto)" | z |
| z.lua | eval "$(lua /home/tester/tools/z.lua/z.lua --init bash)" | z |

## The shared directory history

| Label | Directory |
| --- | --- |
| S | ~/projects/api-server |
| G | ~/projects/api-gateway |
| D | ~/work/api-docs |
| W | ~/work/web-app/src |
| L | ~/projects/legacy/src |
| HOME | /home/tester |

Starting at HOME, we ran cd to S, G, D, W, L, S, HOME, S and HOME, in that order. Each cd was a separate interactive command followed by a prompt. W and L deliberately have the same final directory name, src. The list command for every tool contained all five paths after training.

For example, zoxide query --list --score printed:

~~~text
  12.0 /home/tester/projects/api-server
   4.0 /home/tester/projects/legacy/src
   4.0 /home/tester/work/web-app/src
   4.0 /home/tester/work/api-docs
   4.0 /home/tester/projects/api-gateway
~~~

autojump --stat showed weight 17.3 for S and 10.0 for each other test path. fasd's directory list also included HOME. We did not compare the tools' score scales: their hooks and scoring differ.

## Eight keyword queries, in a fixed order

Before each query, we separately ran cd /home/tester. The queries below were then executed from top to bottom, using j for autojump and z for the others. Successful jumps were allowed to update history; we did not restore the initial database between rows. Each cell shows the resulting directory and exit status.

| Keywords | zoxide | autojump | z | fasd | z.lua |
| --- | --- | --- | --- | --- | --- |
| api | S (0) | S (0) | S (0) | S (0) | S (0) |
| projects gateway | G (0) | G (0) | G (0) | G (0) | G (0) |
| api projects | HOME (1) | HOME (0) | HOME (1) | HOME (0) | HOME (0) |
| web-app src | W (0) | W (0) | W (0) | W (0) | W (0) |
| src web-app | HOME (1) | HOME (0) | HOME (1) | HOME (0) | HOME (0) |
| src | W (0) | W (0) | W (0) | W (0) | W (0) |
| apiserver | HOME (1) | S (0) | HOME (1) | S (0) | HOME (0) |
| zz-no-such-keyword-923 | HOME (1) | HOME (0) | HOME (1) | HOME (0) | HOME (0) |

None of the five accepted the two reversed keyword sequences in this test. For same-name directories, the earlier web-app src jump had already reinforced W before we asked for src alone. Its selection here does not prove that W would win with a fresh history or a different visit order.

The apiserver row is another practical distinction. Dropping the hyphen still reached api-server with autojump and fasd. The same input left the other three at HOME. This is a measured example, not a claim that any tool handles every typo.

### What a missing match actually printed

| Command | Terminal output | Exit status | Directory afterward |
| --- | --- | --- | --- |
| z zz-no-such-keyword-923, zoxide | zoxide: no match found | 1 | HOME |
| j zz-no-such-keyword-923, autojump | . | 0 | HOME |
| z zz-no-such-keyword-923, z | No output | 1 | HOME |
| z zz-no-such-keyword-923, fasd | No output | 0 | HOME |
| z zz-no-such-keyword-923, z.lua | No output | 0 | HOME |

“No output” is our description of an empty capture. autojump printed a literal dot; its initialized j function remained in the current directory and returned 0. For scripts, checking that the directory actually changed matters when using the tested fasd, z.lua or autojump wrappers.

## Listing, deleting and locating the database

| Tool | List command we ran | Record deletion we verified | Data file in this test |
| --- | --- | --- | --- |
| zoxide | zoxide query --list --score | zoxide remove /home/tester/projects/api-gateway | ~/cases/zoxide-data/db.zo, with _ZO_DATA_DIR set |
| autojump | autojump --stat | Offline edit of one existing-path row; --purge for a removed directory | ~/.local/share/autojump/autojump.txt |
| z | z -l | cd /home/tester/projects/api-gateway; z -x; cd /home/tester, on one command line | ~/.z |
| fasd | fasd -ld | fasd -D /home/tester/projects/api-gateway | ~/.fasd |
| z.lua | z -l | z -x /home/tester/projects/api-gateway | ~/.zlua |

For zoxide, z, fasd and z.lua, the subsequent list omitted G while retaining S. z's -x removes the current directory's record; leaving on the same command line avoids presenting another prompt in that directory. z.lua needed the explicit path.

autojump --remove /home/tester/projects/api-gateway was rejected with exit status 2 and “unrecognized arguments: --remove”. We closed its interactive session, backed up autojump.txt as autojump.txt.before-manual-delete, and removed the tab-separated row whose path exactly equalled G. An initialized autojump --stat confirmed that G disappeared while the directory itself still existed. We then removed the dedicated test file notes.txt and its empty D directory, ran autojump --purge, and confirmed that D disappeared too. Both list checks and purge returned 0. Purge and removing a still-existing path are different operations.

### fasd also learned a file

In fasd's session, after cat /home/tester/work/api-docs/notes.txt, f notes returned:

~~~text
6          /home/tester/work/api-docs/notes.txt
~~~

The directory stayed at HOME and the command returned 0. This verifies file lookup in the initialized fasd setup. We did not test launching an editor or compare file lookup in the other tools.

## Importing real autojump and z histories into zoxide

These sources were the databases produced by the interactive sessions above, saved before deletion. No records were fabricated. Each import used a separate, previously created empty zoxide data directory and the same tester HOME.

zoxide 0.10.0 rejected both attempts using the old --from TOOL FILE form. The error began “error: unexpected argument '--from' found”, with exit status 2. The tested commands are zoxide import autojump and zoxide import z. They read the source tool's default data file; neither tested subcommand accepts a FILE argument.

### autojump source: ~/.local/share/autojump/autojump.txt

~~~bash
export _ZO_DATA_DIR=/home/tester/cases/import-autojump
zoxide query --list --score
zoxide import autojump
zoxide query --list --score
~~~

The first query had no output. The import returned 0. The second query printed:

~~~text
   0.2 /home/tester/projects/api-server
   0.2 /home/tester/work/web-app/src
   0.2 /home/tester/projects/api-gateway
   0.2 /home/tester/work/api-docs
   0.2 /home/tester/projects/legacy/src
~~~

All five paths survived, but the displayed scores are on zoxide's scale and rounded to one decimal place. Equal-looking 0.2 values do not establish identical underlying values or preserve autojump's printed weights.

### z source: ~/.z

~~~bash
export _ZO_DATA_DIR=/home/tester/cases/import-z
zoxide query --list --score
zoxide import z
zoxide query --list --score
~~~

Again the first query was empty and the import returned 0. The second query printed:

~~~text
  16.0 /home/tester/projects/api-server
  12.0 /home/tester/work/web-app/src
   8.0 /home/tester/projects/api-gateway
   4.0 /home/tester/work/api-docs
   4.0 /home/tester/projects/legacy/src
~~~

This verifies migration of the learned paths in these two default layouts. Custom source locations and merging into an existing zoxide database were not tested here.

## Choosing from the behavior we measured

If you want explicit failure status, removal by full path and migration from either tested history, zoxide covered those cases. If you already use autojump's j and rely on inputs like apiserver, this example gives a reason to try your usual keywords before migrating. z worked by sourcing one script and kept a ~/.z database; it fits a Bash setup where that interface already meets your needs.

fasd is worth considering when you need both file lookup and directory jumping: we exercised both in one initialized session. z.lua worked after installing Lua and offered deletion by explicit path, so it is an option for an environment where a Lua runtime is already acceptable. These are choices based on the tested tasks; we did not measure maintenance cost or long-term reliability.

For a focused migration discussion, see the existing [zoxide vs autojump comparison](/blog/zoxide-vs-autojump/). The [zoxide command reference](/blog/zoxide-commands/) and [initialization guide](/blog/zoxide-init-guide/) cover its commands and shell hooks in more detail.

## Not tested in this comparison

We did not benchmark 2,000 directories, compare query latency, use fzf or completion, test other shells or operating systems, observe long-term score aging, or enable z.lua's enhanced mode. The installation times above include different setup work. Neither those times nor the five-directory results establish which tool is fastest on a larger database.`,
  },
  "zoxide-tidai-autojump-z-fasd-zlua": {
    zh: String.raw`# zoxide 替代工具实测对比（autojump、z、fasd、z.lua）

五种工具都学到了同一组五个目录。差别出现在具体输入上。把 api-server 写成 apiserver，autojump 和 fasd 仍能找到，zoxide、z 和默认配置的 z.lua 没有跳转。输入一个完全不存在的关键词时，有的工具报错，有的留在原地却返回退出码 0。选工具之前，这些行为比笼统的功能清单更值得核对。

## 测试环境

| 项目 | 实测值 |
| --- | --- |
| 日期 | 2026-10-08 |
| 系统 | GitHub Actions 中的全新 ubuntu:24.04 容器，Ubuntu 24.04.5 LTS，x86_64 |
| Shell 与终端 | Bash 5.2.21、tmux 3.4，用 send-keys 输入交互命令，再用 capture-pane 抓取结果 |
| 用户 | tester，UID 1001，所有工具的 HOME 都是 /home/tester |
| 隔离方式 | 每个 Bash 会话只初始化一种工具，Shell 历史分开；目录和访问顺序一致 |
| 原始证据 | [完整测试运行及可下载的终端记录](https://github.com/jiankn/zoxide/actions/runs/37799809255) |

下面的输出省略了提示符和测试脚本的退出码标记，~ 都代表 /home/tester。跳转表用字母缩写目录，括号内是 Shell 退出码，不是评分。结果只对应本次配置和命令顺序。

## 安装方式、版本和耗时

五种工具都安装成功。apt 安装由 root 执行，学习目录、跳转和导入由普通用户 tester 执行。zoxide 官方脚本把程序放在 ~/.local/bin，测试环境将这个目录加入了 PATH。

| 工具 | 测到的版本或源码提交 | 实际安装方式 | 耗时 |
| --- | --- | --- | --- |
| zoxide | 0.10.0 | 下载并运行官方 install.sh | 1.048 秒 |
| autojump | v22.5.1，apt 包 22.5.1-1.1 | apt-get install -y -qq autojump | 2.201 秒 |
| z | [d37a763a6a30e1b32766fecc3b8ffd6127f8a0fd](https://github.com/rupa/z/blob/d37a763a6a30e1b32766fecc3b8ffd6127f8a0fd/z.sh) | 对 rupa/z 执行 git clone --depth 1 | 0.349 秒 |
| fasd | 1.0.1，apt 包 1.0.1-3 | apt-get install -y -qq fasd | 0.984 秒 |
| z.lua | [86a9fc5b308b66197720811d295e3812b1c73325](https://github.com/skywind3000/z.lua/blob/86a9fc5b308b66197720811d295e3812b1c73325/z.lua)，Lua 5.4.6 | apt-get install -y -qq lua5.4，再浅克隆 skywind3000/z.lua | 2.103 秒 |

每项只计时一次，包含对应安装命令的下载时间。z.lua 的时间还包含 Lua 安装，Lua 的 apt 包版本是 5.4.6-3build2。提前执行的 apt update，以及 curl、Git、Python、tmux 等共用依赖的安装，不计入表中。这组数值反映该 runner 的安装过程，不能用于比较查询速度。

各自的交互 Bash 会话用了下面的初始化行。源码路径就是测试时的克隆位置。不要把五行一起加载，它们会争用 z 命令。

| 工具 | 本次初始化行 | 跳转命令 |
| --- | --- | --- |
| zoxide | eval "$(zoxide init bash)" | z |
| autojump | source /usr/share/autojump/autojump.sh | j |
| z | source /home/tester/tools/z/z.sh | z |
| fasd | eval "$(fasd --init auto)" | z |
| z.lua | eval "$(lua /home/tester/tools/z.lua/z.lua --init bash)" | z |

## 同一组目录怎么训练

| 表内缩写 | 目录 |
| --- | --- |
| S | ~/projects/api-server |
| G | ~/projects/api-gateway |
| D | ~/work/api-docs |
| W | ~/work/web-app/src |
| L | ~/projects/legacy/src |
| HOME | /home/tester |

从 HOME 开始，依次用 cd 进入 S、G、D、W、L、S、HOME、S、HOME。每次 cd 都是独立的交互命令，执行完等待提示符。W 和 L 的末级目录都叫 src，用来观察同名目录的选择。

训练后，五种工具各自的列表都包含这五条路径。zoxide query --list --score 输出如下。

~~~text
  12.0 /home/tester/projects/api-server
   4.0 /home/tester/projects/legacy/src
   4.0 /home/tester/work/web-app/src
   4.0 /home/tester/work/api-docs
   4.0 /home/tester/projects/api-gateway
~~~

autojump --stat 给 S 显示的权重是 17.3，其余四个目录都是 10.0。fasd 的目录列表还包含 HOME。不同工具的记录钩子和评分尺度不同，所以这里不把分数大小当作横向排名。

## 同样的八组关键词，实际跳到哪里

每行查询前，先单独执行 cd /home/tester。随后按表格从上到下测试，autojump 输入 j，其余输入 z。成功跳转会继续影响历史，没有在每行之间恢复数据库。每格依次写出最终目录和退出码。

| 关键词 | zoxide | autojump | z | fasd | z.lua |
| --- | --- | --- | --- | --- | --- |
| api | S (0) | S (0) | S (0) | S (0) | S (0) |
| projects gateway | G (0) | G (0) | G (0) | G (0) | G (0) |
| api projects | HOME (1) | HOME (0) | HOME (1) | HOME (0) | HOME (0) |
| web-app src | W (0) | W (0) | W (0) | W (0) | W (0) |
| src web-app | HOME (1) | HOME (0) | HOME (1) | HOME (0) | HOME (0) |
| src | W (0) | W (0) | W (0) | W (0) | W (0) |
| apiserver | HOME (1) | S (0) | HOME (1) | S (0) | HOME (0) |
| zz-no-such-keyword-923 | HOME (1) | HOME (0) | HOME (1) | HOME (0) | HOME (0) |

两组倒序关键词都没能让任何工具跳转。单独输入 src 时，五种工具都选了 W，但前面的 web-app src 已经增加了 W 的访问记录。这个结果不能推广成“无论历史如何都选 W”。遇到同名目录，加上能区分上级目录的关键词，在本次测试中确实有效。

apiserver 这一行也值得试在自己的历史上。去掉连字符后，autojump 和 fasd 仍能找到 api-server，其他三种工具留在 HOME。这只是一个实际匹配样例，不代表它们能纠正所有拼写差异。

### 未匹配时的真实输出和退出码

| 输入命令 | 终端输出 | 退出码 | 执行后目录 |
| --- | --- | --- | --- |
| z zz-no-such-keyword-923，zoxide | zoxide: no match found | 1 | HOME |
| j zz-no-such-keyword-923，autojump | . | 0 | HOME |
| z zz-no-such-keyword-923，z | 无输出 | 1 | HOME |
| z zz-no-such-keyword-923，fasd | 无输出 | 0 | HOME |
| z zz-no-such-keyword-923，z.lua | 无输出 | 0 | HOME |

“无输出”是对空终端记录的说明。autojump 输出的则是一个真实的点号，初始化后的 j 留在当前目录，仍返回 0。用本次测到的 autojump、fasd 或 z.lua 包装命令写脚本时，不能把退出码 0 直接当作“已跳到目标目录”。

## 怎么查看、删除记录，数据放在哪里

| 工具 | 跑过的列表命令 | 验证过的删除方式 | 本次数据文件 |
| --- | --- | --- | --- |
| zoxide | zoxide query --list --score | zoxide remove /home/tester/projects/api-gateway | ~/cases/zoxide-data/db.zo，由 _ZO_DATA_DIR 指定 |
| autojump | autojump --stat | 关闭会话后删掉现存目录的一行；已消失目录用 --purge | ~/.local/share/autojump/autojump.txt |
| z | z -l | 同一命令行执行 cd /home/tester/projects/api-gateway; z -x; cd /home/tester | ~/.z |
| fasd | fasd -ld | fasd -D /home/tester/projects/api-gateway | ~/.fasd |
| z.lua | z -l | z -x /home/tester/projects/api-gateway | ~/.zlua |

删除后，zoxide、z、fasd 和 z.lua 的列表都不再包含 G，而 S 仍在。z 的 -x 删除当前目录记录，所以测试在同一命令行里离开该目录，避免下一次提示符将它重新记录。z.lua 的删除命令需要明确传入路径。

autojump --remove /home/tester/projects/api-gateway 返回退出码 2，错误包含 unrecognized arguments: --remove。我们关闭 autojump 的交互会话，将 autojump.txt 备份成 autojump.txt.before-manual-delete，再按制表符分隔的完整路径删除 G 对应的一行。加载初始化脚本后执行 --stat，确认 G 已不在列表里，但目录仍然存在。

随后删除专用测试文件 notes.txt 和它所在的空 D 目录，运行 autojump --purge，另一次 --stat 确认 D 的记录也被移除。两次列表检查和 purge 都返回 0。清理不存在的目录，与删除仍然存在的目录记录，需要分开处理。

### fasd 还学到了一份文件

在 fasd 会话中执行 cat /home/tester/work/api-docs/notes.txt 后，f notes 给出下面的输出。

~~~text
6          /home/tester/work/api-docs/notes.txt
~~~

命令返回 0，当前目录仍是 HOME。这验证了 fasd 初始化后的文件查询。打开编辑器的流程，以及其他工具的文件查询，本次没有测试。

## 用真实 autojump 和 z 历史迁移到 zoxide

导入来源就是前面交互会话实际生成的数据文件，在删除记录前保存，没有手工伪造记录。两次导入分别使用预先建立的独立空 zoxide 数据目录，普通用户和 HOME 保持一致。

zoxide 0.10.0 不接受旧的 --from TOOL FILE 写法。两次尝试都返回退出码 2，错误以 error: unexpected argument '--from' found 开头。实测可用的是 zoxide import autojump 和 zoxide import z，它们读取对应工具的默认数据文件，这两个子命令都没有 FILE 参数。

### autojump 的来源文件

读取的是 ~/.local/share/autojump/autojump.txt。

~~~bash
export _ZO_DATA_DIR=/home/tester/cases/import-autojump
zoxide query --list --score
zoxide import autojump
zoxide query --list --score
~~~

第一次查询没有输出，导入返回 0。第二次查询打印如下结果。

~~~text
   0.2 /home/tester/projects/api-server
   0.2 /home/tester/work/web-app/src
   0.2 /home/tester/projects/api-gateway
   0.2 /home/tester/work/api-docs
   0.2 /home/tester/projects/legacy/src
~~~

五条路径全部保留下来。分数属于 zoxide 的尺度，显示时只保留一位小数；同样显示为 0.2，不足以证明内部数值完全相等，也不等于保留了 autojump 原来的权重显示。

### z 的来源文件

读取的是 ~/.z，这次改用另一份空数据库。

~~~bash
export _ZO_DATA_DIR=/home/tester/cases/import-z
zoxide query --list --score
zoxide import z
zoxide query --list --score
~~~

第一次查询同样没有输出，导入返回 0。随后列表如下。

~~~text
  16.0 /home/tester/projects/api-server
  12.0 /home/tester/work/web-app/src
   8.0 /home/tester/projects/api-gateway
   4.0 /home/tester/work/api-docs
   4.0 /home/tester/projects/legacy/src
~~~

这两组结果验证了默认文件位置下的真实历史迁移。自定义来源位置、向已有 zoxide 数据库合并，本次没有测试。

## 根据这些行为怎么选

如果需要明确的失败退出码、按完整路径删除记录，以及迁移本次两种历史来源，zoxide 都完成了对应测试。已经习惯 autojump 的 j，且经常输入 apiserver 这类省略连字符的关键词，可以先用自己的历史核对匹配结果再迁移。z 通过加载一个脚本工作，使用 ~/.z 数据文件，适合已经认可这套 Bash 接口的配置。

fasd 适合同时需要目录跳转和文件查询的使用场景，本次在一个会话中验证了两者。z.lua 在装好 Lua 后正常工作，也能按明确路径删除记录，可以考虑用于已有 Lua 运行环境的配置。这些建议只依据本次任务，没有评估长期维护成本或可靠性。

需要更聚焦的迁移讨论，可以看已有的 [zoxide 与 autojump 专题对比](/zh/blog/zoxide-vs-autojump/)。zoxide 的具体命令和钩子说明见 [命令参考](/zh/blog/zoxide-commands/)及[初始化指南](/zh/blog/zoxide-init-guide/)。

## 本次没有测试的项目

没有做 2,000 目录的查询基准、查询延迟排名、fzf 或补全、其他 Shell 和操作系统、长期评分衰减，也没有启用 z.lua 的增强模式。各项安装时间包含的工作不同；安装耗时和这五个目录的结果，都不足以判断大型数据库上哪种工具最快。`,
  },
  "zoxide-daitai-autojump-z-fasd-zlua": {
    ja: String.raw`# zoxide 代替ツールを実測比較（autojump・z・fasd・z.lua）

5 種類すべてが同じ 5 つのディレクトリを学習しました。違いが出たのは検索語の順序、ハイフンの省略、該当候補がない場合、履歴の削除です。api-server を apiserver と入力すると autojump と fasd は移動できましたが、zoxide、z、既定設定の z.lua は移動しませんでした。また、候補がなくても終了コード 0 を返すコマンドがありました。

## テスト環境

| 項目 | 記録した値 |
| --- | --- |
| 検証日 | 2026-10-08 |
| システム | GitHub Actions の新規 ubuntu:24.04 コンテナ、Ubuntu 24.04.5 LTS、x86_64 |
| シェルと端末 | Bash 5.2.21、tmux 3.4。send-keys で対話コマンドを送り、capture-pane で取得 |
| ユーザー | tester、UID 1001。すべて HOME=/home/tester |
| 分離方法 | Bash セッションごとに 1 種類だけ初期化し、シェル履歴も分離。同じディレクトリと訪問順を使用 |
| 検証記録 | [テスト実行とダウンロードできる端末記録](https://github.com/jiankn/zoxide/actions/runs/37799809255) |

掲載した出力からはプロンプトとテスト用の終了コードマーカーを省いています。例の ~ は /home/tester です。結果表では下記のディレクトリ記号を使い、括弧内にシェルの終了コードを記載します。スコアではありません。結果の範囲は、この設定とコマンド順序に限ります。

## インストール方法、バージョン、所要時間

すべてインストールに成功しました。apt は root で実行し、学習、移動、インポートは一般ユーザー tester で実行しました。zoxide の公式スクリプトは ~/.local/bin に実行ファイルを置いたため、このディレクトリを PATH に追加しました。

| ツール | 検証したバージョンまたはソースのコミット | 実行した導入方法 | 所要時間 |
| --- | --- | --- | --- |
| zoxide | 0.10.0 | 公式 install.sh をダウンロードして実行 | 1.048 秒 |
| autojump | v22.5.1、apt パッケージ 22.5.1-1.1 | apt-get install -y -qq autojump | 2.201 秒 |
| z | [d37a763a6a30e1b32766fecc3b8ffd6127f8a0fd](https://github.com/rupa/z/blob/d37a763a6a30e1b32766fecc3b8ffd6127f8a0fd/z.sh) | rupa/z を git clone --depth 1 | 0.349 秒 |
| fasd | 1.0.1、apt パッケージ 1.0.1-3 | apt-get install -y -qq fasd | 0.984 秒 |
| z.lua | [86a9fc5b308b66197720811d295e3812b1c73325](https://github.com/skywind3000/z.lua/blob/86a9fc5b308b66197720811d295e3812b1c73325/z.lua)、Lua 5.4.6 | apt-get install -y -qq lua5.4、続いて skywind3000/z.lua を浅くクローン | 2.103 秒 |

各導入コマンドを 1 回計測し、ダウンロード時間も含めました。z.lua は Lua の導入時間を含み、Lua の apt パッケージは 5.4.6-3build2 でした。事前の apt update と curl、Git、Python、tmux など共通依存の導入時間は含めていません。これは 1 台の runner での導入記録であり、検索速度の比較には使えません。

Bash の各セッションでは次の行を個別に読み込みました。ソースのパスは検証時の配置です。まとめて読み込むと z コマンドが競合します。

| ツール | 検証に使った初期化行 | 移動コマンド |
| --- | --- | --- |
| zoxide | eval "$(zoxide init bash)" | z |
| autojump | source /usr/share/autojump/autojump.sh | j |
| z | source /home/tester/tools/z/z.sh | z |
| fasd | eval "$(fasd --init auto)" | z |
| z.lua | eval "$(lua /home/tester/tools/z.lua/z.lua --init bash)" | z |

## 共通のディレクトリ履歴

| 記号 | ディレクトリ |
| --- | --- |
| S | ~/projects/api-server |
| G | ~/projects/api-gateway |
| D | ~/work/api-docs |
| W | ~/work/web-app/src |
| L | ~/projects/legacy/src |
| HOME | /home/tester |

HOME から始め、cd で S、G、D、W、L、S、HOME、S、HOME の順に移動しました。cd は 1 回ずつ入力し、次のプロンプトを待ちました。W と L はどちらも末尾が src なので、同名ディレクトリの選択を確認できます。

学習後の一覧には、どのツールでも 5 つすべてのパスがありました。zoxide query --list --score の出力は次のとおりです。

~~~text
  12.0 /home/tester/projects/api-server
   4.0 /home/tester/projects/legacy/src
   4.0 /home/tester/work/web-app/src
   4.0 /home/tester/work/api-docs
   4.0 /home/tester/projects/api-gateway
~~~

autojump --stat は S の重みを 17.3、残る 4 つを 10.0 と表示しました。fasd のディレクトリ一覧には HOME も含まれました。記録フックとスコアの尺度が異なるため、数値の大小をツール間の順位にはしていません。

## 同じ 8 組の検索語で移動する

毎回、検索の前に別コマンドで cd /home/tester を実行しました。表の上から順に autojump では j、それ以外では z を使っています。成功した移動は履歴に反映され、行ごとにデータベースを初期状態へ戻していません。各セルは移動後のディレクトリと終了コードです。

| 検索語 | zoxide | autojump | z | fasd | z.lua |
| --- | --- | --- | --- | --- | --- |
| api | S (0) | S (0) | S (0) | S (0) | S (0) |
| projects gateway | G (0) | G (0) | G (0) | G (0) | G (0) |
| api projects | HOME (1) | HOME (0) | HOME (1) | HOME (0) | HOME (0) |
| web-app src | W (0) | W (0) | W (0) | W (0) | W (0) |
| src web-app | HOME (1) | HOME (0) | HOME (1) | HOME (0) | HOME (0) |
| src | W (0) | W (0) | W (0) | W (0) | W (0) |
| apiserver | HOME (1) | S (0) | HOME (1) | S (0) | HOME (0) |
| zz-no-such-keyword-923 | HOME (1) | HOME (0) | HOME (1) | HOME (0) | HOME (0) |

2 組の逆順の検索語では、すべて移動できませんでした。src だけの場合は全ツールが W を選びましたが、先に実行した web-app src で W の履歴が増えています。別の訪問順や初期履歴でも W が選ばれるとは判断できません。この構成では、親ディレクトリ名を含めた検索で同名の src を指定できました。

apiserver の行では、ハイフンを省いても autojump と fasd が api-server を見つけました。残る 3 種類は HOME に留まりました。これは実測した 1 例であり、あらゆる入力の違いを補正できるという意味ではありません。

### 候補がない場合の出力と終了コード

| 入力したコマンド | 端末の出力 | 終了コード | 実行後のディレクトリ |
| --- | --- | --- | --- |
| z zz-no-such-keyword-923、zoxide | zoxide: no match found | 1 | HOME |
| j zz-no-such-keyword-923、autojump | . | 0 | HOME |
| z zz-no-such-keyword-923、z | 出力なし | 1 | HOME |
| z zz-no-such-keyword-923、fasd | 出力なし | 0 | HOME |
| z zz-no-such-keyword-923、z.lua | 出力なし | 0 | HOME |

「出力なし」は空の取得結果を説明したものです。autojump は実際にピリオド 1 個を表示し、初期化済みの j は現在地に留まって 0 を返しました。今回の autojump、fasd、z.lua のラッパーをスクリプトから使う場合、終了コードだけで目的地への移動成功を判定できません。

## 一覧、削除、データファイル

| ツール | 実行した一覧コマンド | 検証した削除操作 | 今回のデータファイル |
| --- | --- | --- | --- |
| zoxide | zoxide query --list --score | zoxide remove /home/tester/projects/api-gateway | _ZO_DATA_DIR で指定した ~/cases/zoxide-data/db.zo |
| autojump | autojump --stat | セッション終了後に存在するパスの行を削除。消えたディレクトリは --purge | ~/.local/share/autojump/autojump.txt |
| z | z -l | cd /home/tester/projects/api-gateway; z -x; cd /home/tester を 1 行で実行 | ~/.z |
| fasd | fasd -ld | fasd -D /home/tester/projects/api-gateway | ~/.fasd |
| z.lua | z -l | z -x /home/tester/projects/api-gateway | ~/.zlua |

削除後、zoxide、z、fasd、z.lua の一覧から G が消え、S は残りました。z の -x は現在地の履歴を削除します。その場所で次のプロンプトを表示しないよう、同じコマンド行で HOME に戻りました。z.lua の削除にはパスを明示しました。

autojump --remove /home/tester/projects/api-gateway は終了コード 2 で拒否され、エラーに unrecognized arguments: --remove と表示されました。autojump の対話セッションを閉じ、autojump.txt を autojump.txt.before-manual-delete にバックアップしてから、タブ区切りのパスが G と完全一致する行を削除しました。初期化スクリプトを読み込んで --stat を実行すると、ディレクトリは存在したまま G の履歴だけが消えていました。

続いて専用テストファイル notes.txt と空になった D ディレクトリを削除し、autojump --purge を実行しました。再度 --stat を実行すると D も消えました。2 回の一覧確認と purge はいずれも 0 を返しました。存在しないディレクトリの掃除と、存在するパスの履歴削除は別の操作です。

### fasd のファイル検索も確認

fasd のセッションで cat /home/tester/work/api-docs/notes.txt を実行した後、f notes は次を返しました。

~~~text
6          /home/tester/work/api-docs/notes.txt
~~~

終了コードは 0、現在地は HOME のままでした。初期化済み fasd のファイル検索を確認できました。エディターの起動や、他のツールでのファイル検索は検証していません。

## 実際の autojump と z の履歴を zoxide に移す

移行元には、上記の対話セッションが生成し、削除前に保存したファイルを使いました。手作りの履歴ではありません。各インポートでは事前に用意した別々の空の zoxide データディレクトリを使い、tester と HOME は共通です。

zoxide 0.10.0 は古い --from TOOL FILE 形式を受け付けませんでした。どちらも終了コード 2 で、エラーの先頭は error: unexpected argument '--from' found でした。検証できたコマンドは zoxide import autojump と zoxide import z です。それぞれ既定の移行元ファイルを読み、検証した 2 つのサブコマンドには FILE 引数がありません。

### autojump の移行元

読み込んだファイルは ~/.local/share/autojump/autojump.txt です。

~~~bash
export _ZO_DATA_DIR=/home/tester/cases/import-autojump
zoxide query --list --score
zoxide import autojump
zoxide query --list --score
~~~

最初の検索は出力なし、インポートは終了コード 0 でした。次の検索では以下を表示しました。

~~~text
   0.2 /home/tester/projects/api-server
   0.2 /home/tester/work/web-app/src
   0.2 /home/tester/projects/api-gateway
   0.2 /home/tester/work/api-docs
   0.2 /home/tester/projects/legacy/src
~~~

5 つのパスはすべて移りました。表示値は zoxide の尺度で小数第 1 位まで丸められています。すべて 0.2 に見えることから内部値も等しいとは判断できず、autojump の重み表示をそのまま引き継ぐわけでもありません。

### z の移行元

ファイルは ~/.z です。別の空のデータベースを使いました。

~~~bash
export _ZO_DATA_DIR=/home/tester/cases/import-z
zoxide query --list --score
zoxide import z
zoxide query --list --score
~~~

最初は出力なしで、インポートは 0 を返しました。その後の一覧は次のとおりです。

~~~text
  16.0 /home/tester/projects/api-server
  12.0 /home/tester/work/web-app/src
   8.0 /home/tester/projects/api-gateway
   4.0 /home/tester/work/api-docs
   4.0 /home/tester/projects/legacy/src
~~~

この結果で、2 種類の既定ファイルから実際の学習済みパスを移行できました。移行元の独自配置や、既存 zoxide データベースへのマージは今回検証していません。

## 実測した動作を基に選ぶ

明示的な失敗コード、フルパスでの削除、今回の 2 種類の履歴移行が必要なら、zoxide はそれぞれの検証を通りました。autojump の j に慣れ、apiserver のような入力を使う場合は、移行前に自分の履歴でも検索を試す意味があります。z は 1 つのスクリプトを読み込んで動き、\~/.z を使用しました。この Bash インターフェースで用が足りる構成なら候補になります。

ディレクトリ移動とファイル検索を同時に使いたい場合、fasd は今回の両方の操作を実行できました。z.lua は Lua を導入すると動作し、明示したパスの履歴を削除できたため、Lua ランタイムを使う構成で検討できます。ここでの選び方は今回の操作に基づき、長期の保守費用や信頼性は評価していません。

移行を中心に読む場合は、既存の [zoxide と autojump の比較](/ja/blog/zoxide-vs-autojump/)を参照してください。個々のコマンドとフックについては[コマンドリファレンス](/ja/blog/zoxide-commands/)と[初期化ガイド](/ja/blog/zoxide-init-guide/)で扱っています。

## 今回検証していない項目

2,000 ディレクトリの検索ベンチマーク、検索時間の順位、fzf と補完、別のシェルや OS、長期間のスコア減衰、z.lua の enhanced モードは検証していません。上記の導入時間は含む作業が異なり、5 ディレクトリでの結果と合わせても、大規模な履歴でどれが最速かは判断できません。`,
  },
};
