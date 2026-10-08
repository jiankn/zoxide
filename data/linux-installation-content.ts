export const linuxInstallationContent: Record<string, string> = {
  en: String.raw`# Install and configure zoxide on Arch Linux and NixOS

On Arch Linux, install the repository package and add an initialization line to your shell configuration. On NixOS, the system module can install zoxide and initialize the shell. Home Manager is another route if you already manage your user configuration with it.

The binary and the shell command are separate checks: zoxide --version checks the installed program; type z checks whether your shell has loaded the navigation function.

## Test environment and scope

| Item | Recorded environment |
| --- | --- |
| Test date | October 9, 2026, UTC+8; the run timestamps are October 8 in UTC |
| Arch Linux | Official archlinux:base container, x86_64; VERSION_ID 20261004.0.606936 |
| Arch packages | zoxide 0.10.0-1; Bash 5.3.20, Zsh 5.9.2, tmux 3.7c |
| NixOS | Two booted QEMU/KVM virtual machines, NixOS 26.05 (Yarara), x86_64 |
| NixOS packages | zoxide 0.9.9; Bash 5.3.9, Zsh 5.9.1 on the system-module VM, tmux 3.6a |
| Pinned sources | nixpkgs 7c8764b7c7b0; Home Manager release-26.05, db7d5e233271 |

The [archived test evidence](/evidence/2026-10-09/arch-nixos.json) contains the cited outputs, configuration snippets, image digest and full source commits. Installation, build and kernel logs are omitted.

We used the ordinary user tester and interactive login shells in tmux. Each command returned to a prompt; database snapshots came from a separate process. Each case used an isolated _ZO_DATA_DIR. Output below shortens /home/tester to ~. The NixOS configurations were built in CI and then booted; we did not install NixOS from an ISO or run nixos-rebuild inside the guests. AUR packages, standalone Home Manager, Fish and fzf selection were not tested.

## Arch Linux: package, then shell initialization

Our container first completed a full upgrade, then installed zoxide from the repository. In a normal user account, use sudo for the package operations:

~~~bash
sudo pacman -Syu
sudo pacman -S zoxide
command -v zoxide
zoxide --version
~~~

The last two commands returned /usr/bin/zoxide and zoxide 0.10.0. The zoxide line in pacman -Q zoxide zsh tmux python was zoxide 0.10.0-1. Repository versions can change. [Arch's maintenance guidance](https://wiki.archlinux.org/title/System_maintenance#Partial_upgrades_are_unsupported) explains why a database refresh without a complete upgrade is unsupported.

For Bash, add this line at the end of ~/.bashrc:

~~~bash
eval "$(zoxide init bash)"
~~~

For Zsh, use this line at the end of ~/.zshrc instead:

~~~zsh
eval "$(zoxide init zsh)"
~~~

Open a new terminal and run type z. Bash reported z is a function; Zsh reported a shell function from /home/tester/.zshrc. Installing the package alone does not load that function into an existing shell. More shells are covered in the [initialization guide](/blog/zoxide-init-guide/).

## NixOS: use the system module

In an existing NixOS configuration, enable:

~~~nix
programs.zoxide.enable = true;
~~~

Our system-module VM also enabled programs.zsh.enable = true to test Zsh. It used no Home Manager configuration. The binary appeared at /run/current-system/sw/bin/zoxide and printed zoxide 0.9.9. Bash reported z is a function; Zsh reported a shell function from /etc/zshrc.

The [pinned NixOS module](https://github.com/NixOS/nixpkgs/blob/7c8764b7c7b09b34f632464276218ef9090eaa11/nixos/modules/programs/zoxide.nix) enables Bash and Zsh integration by default. It adds shell initialization, so this setup does not need another manual eval line. On the first Zsh launch, its setup wizard appeared; creating an empty ~/.zshrc allowed the system initialization to run without that wizard.

To apply a change on your own existing NixOS system, the usual command is:

~~~bash
sudo nixos-rebuild switch
~~~

If your system uses flakes, keep its existing --flake target. This command is application guidance; our VM test built and booted the configuration instead of executing this rebuild command inside the guest.

## Home Manager: an alternative user configuration

Our second NixOS VM used Home Manager as a NixOS module, with the same nixpkgs packages and without the system zoxide module. For an existing Home Manager user configuration, the tested fragment was:

~~~nix
programs.bash.enable = true;
programs.zoxide = {
  enable = true;
  enableBashIntegration = true;
  options = [ "--cmd" "cd" ];
};
~~~

This renamed the navigation function to cd and the interactive function to cdi. In a new Bash login, type cd and type cdi reported functions; type -t z produced no output and exited with status 1. The binary was /etc/profiles/per-user/tester/bin/zoxide, version 0.9.9. After learning a directory, cd api-server reached it.

Remove the options line if you want the usual z and zi names. Our Arch Bash case separately verified --cmd cd with zoxide 0.10.0. The [Home Manager module](https://github.com/nix-community/home-manager/blob/db7d5e2332710f5abb088f6b5de927d7f9511b35/modules/programs/zoxide.nix) and the NixOS system module use different extra-argument fields:

| Configuration scope | Extra initialization arguments |
| --- | --- |
| NixOS system configuration | programs.zoxide.flags |
| Home Manager user configuration | programs.zoxide.options |

Put the Home Manager fragment in your user configuration, rather than copying its options field into the system module. Apply it through your existing NixOS/Home Manager setup. The tested Home Manager shell here was Bash.

## Test directory learning and jumps

With the default z name, run these as separate commands, waiting for a prompt after each:

~~~bash
mkdir -p ~/projects/api-server
cd ~/projects/api-server
cd ~
z api-server
pwd
~~~

In our isolated databases, the initial query was empty. After the first visit, an external zoxide query --list --score showed:

~~~text
   4.0 ~/projects/api-server
~~~

| Tested setup | Navigation command | Result |
| --- | --- | --- |
| Arch Bash and Zsh | z api-server | ~/projects/api-server |
| NixOS system module, Bash and Zsh | z api-server | ~/projects/api-server |
| NixOS + Home Manager, Bash with --cmd cd | cd api-server | ~/projects/api-server |

The Arch --cmd cd case also learned and reached ~/projects/api-gateway. These results show that ordinary cd with an initialized hook can record a visit; replacing cd is optional.

For the deliberately absent keyword zz-no-such-keyword-923, the navigation command exited with status 1 and printed zoxide: no match found. The next pwd still showed the previous directory. Visit a directory by its full path before expecting a keyword to find it.

The initialization also defined zi, or cdi when renamed, but command -v fzf found no executable in these environments. A defined function does not prove that selection works. See the separately tested [fzf guide](/tutorials/fzf-integration/) before using it.

## Removal and retained data

On Arch, remove the init line from your shell configuration, then remove the package:

~~~bash
sudo pacman -R zoxide
~~~

Our package removal exited with status 0. A new login's command -v zoxide exited with status 1; all three isolated test databases still existed and were nonempty.

On NixOS or Home Manager, disable programs.zoxide.enable in the configuration that enabled it, apply that configuration and open a new terminal. We tested this by switching each VM to a prebuilt specialisation with its zoxide module disabled. Both switches succeeded, a fresh login could no longer find zoxide, and the test databases remained. This checked removal through configuration activation, without an in-guest rebuild or garbage collection.

On Linux, the usual database location is ~/.local/share/zoxide/db.zo; XDG_DATA_HOME or _ZO_DATA_DIR can change it. Our files were under the isolated directories listed in the evidence. Removing the program did not delete those files. The [configuration guide](/tutorials/advanced-config/) explains the data-directory settings; [Ubuntu installation](/tutorials/install-ubuntu/) has its own distribution-specific test.`,
  zh: String.raw`# 在 Arch Linux 和 NixOS 上安装与配置 zoxide

Arch Linux 可以安装官方仓库的软件包，再给 Shell 加初始化行。NixOS 可以用系统模块同时安装程序并生成初始化配置；如果你已经用 Home Manager 管理用户配置，也可以走这条路线。

安装程序和加载跳转函数是两件事：zoxide --version 检查二进制，type z 检查当前 Shell 是否已经加载函数。

## 测试环境与范围

| 项目 | 实际环境 |
| --- | --- |
| 日期 | 2026-10-09，UTC+8；运行记录的 UTC 日期为 10 月 8 日 |
| Arch Linux | 官方 archlinux:base 容器，x86_64；VERSION_ID 为 20261004.0.606936 |
| Arch 版本 | zoxide 软件包 0.10.0-1；Bash 5.3.20、Zsh 5.9.2、tmux 3.7c |
| NixOS | 两台实际启动的 QEMU/KVM 虚拟机，NixOS 26.05（Yarara），x86_64 |
| NixOS 版本 | zoxide 0.9.9；Bash 5.3.9，系统模块虚拟机的 Zsh 5.9.1；tmux 3.6a |
| 固定源码 | nixpkgs 7c8764b7c7b0；Home Manager release-26.05，db7d5e233271 |

[测试证据存档](/evidence/2026-10-09/arch-nixos.json)保留了本文引用的输出、配置片段、镜像摘要和完整源码提交号，省略安装、构建和内核日志。

测试使用普通用户 tester，在 tmux 中启动交互式登录 Shell。每条命令之后等提示符出现，再从另一个进程查询数据库；各案例用独立的 _ZO_DATA_DIR。下文把 /home/tester 缩写为 ~。NixOS 配置由 CI 构建后启动，本轮没有从 ISO 安装系统，也没有在虚拟机内运行 nixos-rebuild。AUR、独立安装的 Home Manager、Fish 和 fzf 选择界面未测。

## Arch Linux：先安装，再初始化 Shell

容器先完成全系统更新，再从仓库安装 zoxide。普通用户执行包管理操作时加 sudo：

~~~bash
sudo pacman -Syu
sudo pacman -S zoxide
command -v zoxide
zoxide --version
~~~

后两条命令分别输出 /usr/bin/zoxide 和 zoxide 0.10.0。pacman -Q zoxide zsh tmux python 的 zoxide 行是 zoxide 0.10.0-1。仓库版本会变化；[Arch 维护文档](https://wiki.archlinux.org/title/System_maintenance#Partial_upgrades_are_unsupported)说明了为什么不能只刷新包数据库而不完成全系统更新。

Bash 用户把下面一行加到 ~/.bashrc 末尾：

~~~bash
eval "$(zoxide init bash)"
~~~

Zsh 用户改用下面这一行，放到 ~/.zshrc 末尾：

~~~zsh
eval "$(zoxide init zsh)"
~~~

打开新终端后运行 type z。Bash 输出 z is a function；Zsh 显示这是来自 /home/tester/.zshrc 的 Shell 函数。只安装软件包不会让已有终端自动加载函数。其他 Shell 的配置见[初始化指南](/zh/blog/zoxide-init-guide/)。

## NixOS：系统模块已经能完成配置

在已有 NixOS 配置中启用：

~~~nix
programs.zoxide.enable = true;
~~~

系统模块虚拟机还设置了 programs.zsh.enable = true，用来测试 Zsh，没有接入 Home Manager。程序路径为 /run/current-system/sw/bin/zoxide，版本输出是 zoxide 0.9.9。Bash 显示 z is a function；Zsh 显示函数来自 /etc/zshrc。

[本轮固定版本的 NixOS 模块](https://github.com/NixOS/nixpkgs/blob/7c8764b7c7b09b34f632464276218ef9090eaa11/nixos/modules/programs/zoxide.nix)默认启用 Bash 和 Zsh 集成，会生成初始化代码。采用这份配置时，不必再手写一条 eval。首次启动 Zsh 出现了新用户向导；创建空的 ~/.zshrc 后，系统初始化可以直接运行。

在你已有的 NixOS 系统上，通常这样应用配置：

~~~bash
sudo nixos-rebuild switch
~~~

使用 flake 的系统沿用原有 --flake 目标。这是本机应用配置的方法；本轮测试采用 CI 构建并启动虚拟机，没有在运行中的虚拟机内执行这条重建命令。

## Home Manager：已有用户配置的另一条路线

第二台虚拟机把 Home Manager 作为 NixOS 模块接入，共用同一份 nixpkgs，没有启用系统的 zoxide 模块。在已有 Home Manager 用户配置中，实测片段是：

~~~nix
programs.bash.enable = true;
programs.zoxide = {
  enable = true;
  enableBashIntegration = true;
  options = [ "--cmd" "cd" ];
};
~~~

这份配置将跳转函数命名为 cd，交互选择函数命名为 cdi。在新的 Bash 登录会话中，type cd 和 type cdi 都显示函数；type -t z 没有输出，退出码为 1。程序位于 /etc/profiles/per-user/tester/bin/zoxide，版本同样为 0.9.9。记录目录后，cd api-server 能跳到它。

需要保留 z 和 zi 名称时，去掉 options 这一行。Arch 的 Bash 也单独验证了 zoxide 0.10.0 的 --cmd cd。[Home Manager 模块](https://github.com/nix-community/home-manager/blob/db7d5e2332710f5abb088f6b5de927d7f9511b35/modules/programs/zoxide.nix)和 NixOS 系统模块传初始化参数的字段不同：

| 配置位置 | 初始化额外参数 |
| --- | --- |
| NixOS 系统配置 | programs.zoxide.flags |
| Home Manager 用户配置 | programs.zoxide.options |

把 Home Manager 片段放到用户配置里，不要把它的 options 字段直接粘到系统模块中。通过你现有的 NixOS/Home Manager 配置方式应用即可；这轮 Home Manager 只测试了 Bash。

## 检查目录学习和跳转

使用默认 z 名称时，下面的命令逐条执行，每条之后等提示符回来：

~~~bash
mkdir -p ~/projects/api-server
cd ~/projects/api-server
cd ~
z api-server
pwd
~~~

隔离数据库的初始查询为空。第一次进入 api-server 后，从终端外运行 zoxide query --list --score，得到：

~~~text
   4.0 ~/projects/api-server
~~~

| 实测配置 | 跳转命令 | 结果 |
| --- | --- | --- |
| Arch 的 Bash、Zsh | z api-server | ~/projects/api-server |
| NixOS 系统模块的 Bash、Zsh | z api-server | ~/projects/api-server |
| NixOS + Home Manager，Bash 使用 --cmd cd | cd api-server | ~/projects/api-server |

Arch 的 --cmd cd 案例还记录并跳到了 ~/projects/api-gateway。普通 cd 配合已加载的 hook 就能记录访问，不需要先把 cd 替换掉。

我们输入了不存在的关键词 zz-no-such-keyword-923，跳转命令输出 zoxide: no match found，退出码为 1；随后 pwd 仍显示原目录。新目录先用完整路径进入，等提示符出现后，再尝试关键词跳转。

初始化虽然定义了 zi（改名后为 cdi），但这些环境中的 command -v fzf 都没有找到程序。函数存在不代表选择界面可用；使用前可参考另一轮实测的 [fzf 教程](/zh/tutorials/fzf-integration/)。

## 卸载后，数据库还在

Arch 用户先删除 Shell 配置中的初始化行，再卸载包：

~~~bash
sudo pacman -R zoxide
~~~

本轮包删除退出码为 0。新登录会话里的 command -v zoxide 返回 1，三个隔离测试数据库仍存在且非空。

NixOS 或 Home Manager 用户在原先启用它的配置里禁用 programs.zoxide.enable，应用配置后打开新终端。我们分别切换到预构建的 specialisation，其中对应模块已禁用。两次切换均成功，新登录会话找不到 zoxide，测试数据库仍在。这验证的是配置激活后的移除，没有在虚拟机中重建，也没有运行垃圾回收。

Linux 的常见数据库路径是 ~/.local/share/zoxide/db.zo，XDG_DATA_HOME 或 _ZO_DATA_DIR 可以改变它。本轮使用证据中列出的隔离目录，移除程序没有删除这些文件。目录设置见[高级配置](/zh/tutorials/advanced-config/)；Ubuntu 用户可看另有发行版实测的[安装教程](/zh/tutorials/install-ubuntu/)。`,
  ja: String.raw`# Arch Linux と NixOS で zoxide を導入・設定する

Arch Linux では公式リポジトリのパッケージを入れ、シェルに初期化行を追加します。NixOS ではシステムモジュールでパッケージと初期化を設定できます。すでにユーザー設定を Home Manager で管理している場合は、そのモジュールも使えます。

実行ファイルの導入と移動関数の読み込みは別に確認します。zoxide --version はプログラム、type z は現在のシェルに定義された関数の確認です。

## 検証環境と範囲

| 項目 | 記録した環境 |
| --- | --- |
| 検証日 | 2026-10-09、UTC+8。実行記録の UTC 日付は 10 月 8 日 |
| Arch Linux | 公式 archlinux:base コンテナ、x86_64。VERSION_ID は 20261004.0.606936 |
| Arch の版 | zoxide パッケージ 0.10.0-1、Bash 5.3.20、Zsh 5.9.2、tmux 3.7c |
| NixOS | 起動した QEMU/KVM 仮想マシン 2 台。NixOS 26.05（Yarara）、x86_64 |
| NixOS の版 | zoxide 0.9.9、Bash 5.3.9、システムモジュール側の Zsh 5.9.1、tmux 3.6a |
| 固定ソース | nixpkgs 7c8764b7c7b0、Home Manager release-26.05 の db7d5e233271 |

[検証結果のアーカイブ](/evidence/2026-10-09/arch-nixos.json)には、本文で参照する出力、設定例、イメージの digest、完全なソースコミットを保存しています。導入・ビルド・カーネルのログは省きました。

一般ユーザー tester で tmux の対話ログインシェルを使い、各コマンドの後にプロンプトへ戻しました。データベースは別のプロセスから確認し、ケースごとに _ZO_DATA_DIR を分離しました。以下では /home/tester を ~ に短縮しています。NixOS は CI で設定をビルドしてから起動しました。ISO からの OS 導入やゲスト内の nixos-rebuild は実行していません。AUR、単独構成の Home Manager、Fish、fzf の選択画面も未検証です。

## Arch Linux：パッケージを入れてからシェルを初期化

コンテナではシステム全体の更新を完了し、リポジトリから zoxide を導入しました。通常のユーザーでパッケージを操作するときは sudo を付けます。

~~~bash
sudo pacman -Syu
sudo pacman -S zoxide
command -v zoxide
zoxide --version
~~~

最後の 2 コマンドは /usr/bin/zoxide と zoxide 0.10.0 を返しました。pacman -Q zoxide zsh tmux python の zoxide の行は zoxide 0.10.0-1 でした。リポジトリの版は変わります。[Arch の保守ガイド](https://wiki.archlinux.org/title/System_maintenance#Partial_upgrades_are_unsupported)では、パッケージデータベースだけを更新する部分的な更新をサポートしない理由を説明しています。

Bash では ~/.bashrc の末尾に次を追加します。

~~~bash
eval "$(zoxide init bash)"
~~~

Zsh では代わりに ~/.zshrc の末尾へ追加します。

~~~zsh
eval "$(zoxide init zsh)"
~~~

新しい端末を開いて type z を確認します。Bash は z is a function、Zsh は /home/tester/.zshrc のシェル関数と表示しました。パッケージの導入だけでは、開いているシェルに関数は読み込まれません。他のシェルは[初期化ガイド](/ja/blog/zoxide-init-guide/)を参照してください。

## NixOS：システムモジュールを使う

既存の NixOS 設定で次を有効にします。

~~~nix
programs.zoxide.enable = true;
~~~

システムモジュールの VM では Zsh の検証用に programs.zsh.enable = true も設定し、Home Manager は使いませんでした。プログラムは /run/current-system/sw/bin/zoxide にあり、zoxide 0.9.9 と表示しました。Bash は z is a function、Zsh は /etc/zshrc のシェル関数と表示しました。

[固定した NixOS モジュール](https://github.com/NixOS/nixpkgs/blob/7c8764b7c7b09b34f632464276218ef9090eaa11/nixos/modules/programs/zoxide.nix)では、Bash と Zsh の連携が既定で有効です。初期化コードも生成するため、この設定に手書きの eval を重ねる必要はありません。Zsh の初回起動では設定ウィザードが出ました。空の ~/.zshrc を作ると、ウィザードを表示せずシステムの初期化が動きました。

自分の既存 NixOS システムで設定を適用する通常のコマンドは次のとおりです。

~~~bash
sudo nixos-rebuild switch
~~~

flake を使うシステムでは、既存の --flake ターゲットを使います。これは設定適用の案内です。今回の VM 検証では CI でビルドして起動し、ゲスト内でこの再ビルドコマンドは実行していません。

## Home Manager：ユーザー設定から導入する

2 台目の NixOS VM では Home Manager を NixOS モジュールとして使い、同じ nixpkgs のパッケージを共有しました。システムの zoxide モジュールは有効にしていません。既存の Home Manager ユーザー設定で検証した断片は次のとおりです。

~~~nix
programs.bash.enable = true;
programs.zoxide = {
  enable = true;
  enableBashIntegration = true;
  options = [ "--cmd" "cd" ];
};
~~~

移動関数は cd、対話選択関数は cdi になります。新しい Bash ログインで type cd と type cdi は関数を表示し、type -t z は出力なしで終了コード 1 になりました。プログラムは /etc/profiles/per-user/tester/bin/zoxide、版は 0.9.9 でした。記録後に cd api-server で移動できました。

z と zi の名前を使う場合は options の行を外します。Arch の Bash でも zoxide 0.10.0 の --cmd cd を別に確認しました。[Home Manager モジュール](https://github.com/nix-community/home-manager/blob/db7d5e2332710f5abb088f6b5de927d7f9511b35/modules/programs/zoxide.nix)と NixOS のシステムモジュールでは、初期化の追加引数に使う項目が違います。

| 設定の場所 | 初期化の追加引数 |
| --- | --- |
| NixOS のシステム設定 | programs.zoxide.flags |
| Home Manager のユーザー設定 | programs.zoxide.options |

Home Manager の断片はユーザー設定に置き、options の項目をシステムモジュールへそのままコピーしないでください。既存の NixOS/Home Manager の手順で適用します。今回 Home Manager で検証したシェルは Bash です。

## ディレクトリ記録と移動を確認

既定の z を使う場合、次を 1 コマンドずつ実行し、毎回プロンプトへ戻るのを待ちます。

~~~bash
mkdir -p ~/projects/api-server
cd ~/projects/api-server
cd ~
z api-server
pwd
~~~

分離したデータベースの初期状態は空でした。api-server へ最初に移動した後、端末外の zoxide query --list --score は次を返しました。

~~~text
   4.0 ~/projects/api-server
~~~

| 検証した構成 | 移動コマンド | 移動先 |
| --- | --- | --- |
| Arch の Bash、Zsh | z api-server | ~/projects/api-server |
| NixOS システムモジュールの Bash、Zsh | z api-server | ~/projects/api-server |
| NixOS + Home Manager、Bash の --cmd cd | cd api-server | ~/projects/api-server |

Arch の --cmd cd ケースでは ~/projects/api-gateway の記録と移動も確認しました。初期化済みの hook があれば通常の cd でも訪問を記録でき、cd の置き換えは必須ではありません。

存在しないキーワード zz-no-such-keyword-923 を渡すと、移動コマンドは zoxide: no match found を表示して終了コード 1 になりました。直後の pwd は元のディレクトリを示しました。新しいディレクトリにはまず完全なパスで入り、プロンプトへ戻ってからキーワードを試してください。

初期化で zi（改名時は cdi）も定義されましたが、これらの環境の command -v fzf は実行ファイルを見つけませんでした。関数が存在しても選択画面の動作確認にはなりません。利用前に別の実行で検証した [fzf ガイド](/ja/tutorials/fzf-integration/)を参照してください。

## 削除後もデータは残る

Arch ではシェル設定の初期化行を削除し、パッケージを削除します。

~~~bash
sudo pacman -R zoxide
~~~

パッケージ削除の終了コードは 0 でした。新しいログインで command -v zoxide は終了コード 1 になり、分離した 3 つのテスト用データベースは存在し、空にはなっていませんでした。

NixOS または Home Manager では、有効にした側の programs.zoxide.enable を無効にし、設定適用後に新しい端末を開きます。検証では、各モジュールを無効にしたビルド済み specialisation へ VM を切り替えました。両方で切り替えが成功し、新しいログインは zoxide を見つけず、テスト用データベースは残りました。設定のアクティベーションによる削除を確認したもので、ゲスト内の再ビルドやガベージコレクションは行っていません。

Linux の通常の保存先は ~/.local/share/zoxide/db.zo ですが、XDG_DATA_HOME または _ZO_DATA_DIR で変わります。今回の保存先は証拠に記載した分離ディレクトリで、プログラムの削除ではファイルは消えませんでした。保存先の設定は[高度な設定](/ja/tutorials/advanced-config/)、Ubuntu の導入は別のディストリビューション検証を記録した[Ubuntu ガイド](/ja/tutorials/install-ubuntu/)を参照してください。`,
};
