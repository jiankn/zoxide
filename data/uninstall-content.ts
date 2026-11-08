// 卸载教程（/tutorials/uninstall-zoxide）三语正文。
// 输出和结论来自 2026-11-08 GitHub Actions 实测（public/evidence/2026-11-08/uninstall.json），
// winget 来自同日本机测试（windows.json），pacman 与 NixOS 来自 2026-10-09 的 arch-nixos.json。
// 注意：String.raw 里不能出现 “${”，否则会被当成插值。

const en = String.raw`# How to uninstall zoxide completely

Removing zoxide takes three steps, in this order: delete the init line from your shell profile, uninstall the program with the tool you installed it with, then decide whether to keep the database. If you skip the first step, every new terminal prints an error. No uninstaller we tested deletes the database for you.

Everything below was run on November 8, 2026 unless noted, and the messages are copied from those runs.

## Test environment

| Install method | System | zoxide | Raw record |
| --- | --- | --- | --- |
| Homebrew | macOS 26.7.2 arm64, Homebrew 7.0.11, zsh | 0.10.0 | [uninstall.json](/evidence/2026-11-08/uninstall.json) |
| Official install script | Ubuntu 24.04 container, ordinary user, bash | 0.10.0 | [uninstall.json](/evidence/2026-11-08/uninstall.json) |
| apt | Ubuntu 24.04 container | 0.9.3 (the Ubuntu package) | [uninstall.json](/evidence/2026-11-08/uninstall.json) |
| Cargo | Ubuntu 24.04 runner, cargo 1.99.1 | 0.10.0 | [uninstall.json](/evidence/2026-11-08/uninstall.json) |
| Scoop | Windows Server 2025 runner, PowerShell 7.6.9 | 0.10.0 | [uninstall.json](/evidence/2026-11-08/uninstall.json) |
| winget | Windows 11, PowerShell 7.6.9 | 0.10.0 | [windows.json](/evidence/2026-11-08/windows.json) |
| pacman, NixOS | Arch Linux container, NixOS 26.05 VM (October 8, 2026) | 0.10.0 / 0.9.9 | [arch-nixos.json](/evidence/2026-10-09/arch-nixos.json) |

## Step 1: delete the init line

The init line is what creates z in each new shell. Find it first:

~~~bash
grep -n zoxide ~/.zshrc ~/.bashrc ~/.bash_profile ~/.config/fish/config.fish 2>/dev/null
~~~

~~~powershell
Select-String -Path $PROFILE -Pattern zoxide
~~~

| Shell | Profile file | Line to delete |
| --- | --- | --- |
| zsh | ~/.zshrc | eval "$(zoxide init zsh)" |
| bash | ~/.bashrc (on macOS also ~/.bash_profile) | eval "$(zoxide init bash)" |
| fish | ~/.config/fish/config.fish | zoxide init fish \| source |
| PowerShell | the file $PROFILE points to | Invoke-Expression (& { (zoxide init powershell \| Out-String) }) |

If you used options such as --cmd cd, the line is longer, but it always contains zoxide init. Delete any zoxide variables you set near it too, such as _ZO_DATA_DIR or _ZO_EXCLUDE_DIRS. If grep finds nothing and z still works in a new terminal, a plugin manager is loading it, for example Oh My Zsh with zoxide in its plugins list. Remove it there.

### What happens if you leave the line in

We uninstalled the program first and kept the line, then opened a new shell. zsh on macOS printed:

~~~text
/Users/runner/.zshrc:1: command not found: zoxide
~~~

bash on Ubuntu printed:

~~~text
bash: zoxide: command not found
~~~

PowerShell printed two errors when it loaded the profile:

~~~text
The term 'zoxide' is not recognized as a name of a cmdlet, function, script file, or executable program.
Invoke-Expression: Cannot bind argument to parameter 'Command' because it is null.
~~~

The shell still opens, and after deleting the line the same test printed nothing. If you see one of these messages after an uninstall, this step is what was missed. We did not record the fish message.

## Step 2: uninstall the program

Use the same tool you installed with. If you are not sure, run command -v zoxide (PowerShell: (Get-Command zoxide).Source) and look at the path.

| Installed with | Path it reports | Uninstall command |
| --- | --- | --- |
| Homebrew | /opt/homebrew/bin/zoxide (Intel: /usr/local/bin) | brew uninstall zoxide |
| winget | ...\WinGet\Packages\ajeetdsouza.zoxide_...\zoxide.exe | winget uninstall --id ajeetdsouza.zoxide -e |
| Scoop | ~\scoop\shims\zoxide.exe | scoop uninstall zoxide |
| Cargo | ~/.cargo/bin/zoxide | cargo uninstall zoxide |
| apt (Debian, Ubuntu) | /usr/bin/zoxide | sudo apt remove zoxide |
| pacman (Arch) | /usr/bin/zoxide | sudo pacman -R zoxide |
| Install script | ~/.local/bin/zoxide | rm ~/.local/bin/zoxide ~/.local/share/man/man1/zoxide*.1 |

What each one did in our tests:

- **Homebrew** removed 18 files, including the man pages and the bash, zsh and fish completions.
- **winget** printed that the package was found and uninstalled successfully.
- **Scoop** removed the zoxide.shim and zoxide.exe shims, and Get-Command zoxide found nothing afterwards.
- **Cargo** removed ~/.cargo/bin/zoxide, the only file it had installed.
- **apt** removed the package completely: dpkg afterwards reported no package named zoxide, so apt purge has nothing extra to clean. Ubuntu 24.04 ships zoxide 0.9.3.
- **pacman** removed the package, and command -v zoxide failed afterwards.
- **The install script** has no uninstaller. It placed one binary in ~/.local/bin and six man pages in ~/.local/share/man/man1, and the rm command above removed all of them.

### NixOS and Home Manager

zoxide is configuration there, so remove it from the configuration and rebuild. With the module, set programs.zoxide.enable = false (or delete the block); if you only added pkgs.zoxide to a package list, delete it from that list. Then run sudo nixos-rebuild switch or home-manager switch. In our NixOS test, after switching to a configuration with zoxide disabled, a new login shell no longer found zoxide, and the databases were still in the home directory.

### Installed more than one way?

After the uninstall, command -v zoxide should print nothing. If it prints another path, a second copy is still installed, for example both Homebrew and Cargo. which -a zoxide (PowerShell: Get-Command zoxide -All) lists every copy. Remove each with its own tool.

We did not test Chocolatey, MacPorts, dnf or zypper. They use their usual remove commands, and the database steps below apply to them too.

## Step 3: keep or delete the database

zoxide stores the directories it has learned in one file, db.zo. Homebrew, Scoop, apt, pacman, NixOS and the script method all left it in place in our tests.

| System | Default location |
| --- | --- |
| macOS | ~/Library/Application Support/zoxide/db.zo |
| Linux | ~/.local/share/zoxide/db.zo ($XDG_DATA_HOME/zoxide if you set it) |
| Windows | %LOCALAPPDATA%\zoxide\db.zo |

If _ZO_DATA_DIR was set, the file is in that folder instead. Keep it if you might reinstall: a new install with the same location starts with your old history. To delete it:

macOS:

~~~bash
rm -rf ~/Library/Application\ Support/zoxide
~~~

Linux:

~~~bash
rm -rf ~/.local/share/zoxide
~~~

Windows:

~~~powershell
Remove-Item -Recurse -Force "$env:LOCALAPPDATA\zoxide"
~~~

Only want zoxide to forget its history? Delete the database and keep the program. To forget a single folder, use zoxide remove with that path; see the [command reference](/blog/zoxide-commands/).

## Step 4: check that it is gone

Open a new terminal window, so the old profile is not still loaded, and run:

~~~bash
command -v zoxide; echo "exit $?"
~~~

~~~powershell
Get-Command zoxide -ErrorAction SilentlyContinue; "found=" + [bool](Get-Command zoxide -ErrorAction SilentlyContinue)
~~~

In our tests the first printed nothing but exit 1, and the second printed found=False. The new window should also open without any message about zoxide.

## Reinstalling later

Follow the guide for your system: [macOS](/tutorials/install-macos/), [Windows](/tutorials/install-windows/), [Ubuntu](/tutorials/install-ubuntu/) or [Arch Linux and NixOS](/tutorials/install-arch-nixos/). If you kept db.zo, z works with your old history as soon as the init line is back.`;

const zh = String.raw`# 如何彻底卸载 zoxide

卸载 zoxide 分三步，顺序别反：先删掉 Shell 配置文件里的初始化行，再用当初安装它的工具卸载程序，最后决定数据库留不留。第一步不做，每开一个新终端都会报错；我们测过的卸载方式，没有一种会替你删数据库。

下面的命令和报错除特别注明外，都来自 2026 年 11 月 8 日的实测，原样照抄。

## 测试环境

| 安装方式 | 系统 | zoxide | 原始记录 |
| --- | --- | --- | --- |
| Homebrew | macOS 26.7.2 arm64，Homebrew 7.0.11，zsh | 0.10.0 | [uninstall.json](/evidence/2026-11-08/uninstall.json) |
| 官方安装脚本 | Ubuntu 24.04 容器，普通用户，bash | 0.10.0 | [uninstall.json](/evidence/2026-11-08/uninstall.json) |
| apt | Ubuntu 24.04 容器 | 0.9.3（Ubuntu 自带的包） | [uninstall.json](/evidence/2026-11-08/uninstall.json) |
| Cargo | Ubuntu 24.04，cargo 1.99.1 | 0.10.0 | [uninstall.json](/evidence/2026-11-08/uninstall.json) |
| Scoop | Windows Server 2025，PowerShell 7.6.9 | 0.10.0 | [uninstall.json](/evidence/2026-11-08/uninstall.json) |
| winget | Windows 11，PowerShell 7.6.9 | 0.10.0 | [windows.json](/evidence/2026-11-08/windows.json) |
| pacman、NixOS | Arch Linux 容器、NixOS 26.05 虚拟机（2026 年 10 月 8 日） | 0.10.0 / 0.9.9 | [arch-nixos.json](/evidence/2026-10-09/arch-nixos.json) |

## 第 1 步：删掉初始化行

z 命令是每次开新 Shell 时由这一行创建的。先找到它：

~~~bash
grep -n zoxide ~/.zshrc ~/.bashrc ~/.bash_profile ~/.config/fish/config.fish 2>/dev/null
~~~

~~~powershell
Select-String -Path $PROFILE -Pattern zoxide
~~~

| Shell | 配置文件 | 要删的那一行 |
| --- | --- | --- |
| zsh | ~/.zshrc | eval "$(zoxide init zsh)" |
| bash | ~/.bashrc（macOS 还要看 ~/.bash_profile） | eval "$(zoxide init bash)" |
| fish | ~/.config/fish/config.fish | zoxide init fish \| source |
| PowerShell | $PROFILE 指向的文件 | Invoke-Expression (& { (zoxide init powershell \| Out-String) }) |

如果加过 --cmd cd 之类的选项，这一行会更长，但一定包含 zoxide init。旁边设置的 zoxide 环境变量（例如 _ZO_DATA_DIR、_ZO_EXCLUDE_DIRS）也一起删掉。如果 grep 什么都没找到，新终端里 z 却还能用，说明是插件管理器在加载它，比如 Oh My Zsh 的 plugins 列表里有 zoxide，到那里删。

### 不删这一行会怎样

我们先卸载程序、保留初始化行，然后开一个新 Shell。macOS 上的 zsh 输出：

~~~text
/Users/runner/.zshrc:1: command not found: zoxide
~~~

Ubuntu 上的 bash 输出：

~~~text
bash: zoxide: command not found
~~~

PowerShell 加载配置文件时报了两条错：

~~~text
The term 'zoxide' is not recognized as a name of a cmdlet, function, script file, or executable program.
Invoke-Expression: Cannot bind argument to parameter 'Command' because it is null.
~~~

终端仍然能打开；删掉这一行后再开新 Shell，就什么都不输出了。卸载后看到上面任意一条，就是漏了这一步。fish 的报错我们没有记录。

## 第 2 步：卸载程序

用当初安装的那个工具卸载。不确定的话，运行 command -v zoxide（PowerShell 用 (Get-Command zoxide).Source），看路径就知道。

| 安装方式 | 显示的路径 | 卸载命令 |
| --- | --- | --- |
| Homebrew | /opt/homebrew/bin/zoxide（Intel 芯片为 /usr/local/bin） | brew uninstall zoxide |
| winget | ...\WinGet\Packages\ajeetdsouza.zoxide_...\zoxide.exe | winget uninstall --id ajeetdsouza.zoxide -e |
| Scoop | ~\scoop\shims\zoxide.exe | scoop uninstall zoxide |
| Cargo | ~/.cargo/bin/zoxide | cargo uninstall zoxide |
| apt（Debian、Ubuntu） | /usr/bin/zoxide | sudo apt remove zoxide |
| pacman（Arch） | /usr/bin/zoxide | sudo pacman -R zoxide |
| 官方安装脚本 | ~/.local/bin/zoxide | rm ~/.local/bin/zoxide ~/.local/share/man/man1/zoxide*.1 |

实测中各自做了什么：

- **Homebrew** 删除了 18 个文件，包括 man 手册和 bash、zsh、fish 的补全文件。
- **winget** 提示找到软件包并已成功卸载。
- **Scoop** 删除了 zoxide.shim 和 zoxide.exe 两个 shim，之后 Get-Command zoxide 找不到任何东西。
- **Cargo** 删除了 ~/.cargo/bin/zoxide，这也是它装的唯一一个文件。
- **apt** 把包删得很干净：之后 dpkg 直接报告没有名为 zoxide 的包，所以 apt purge 没有额外可清的东西。Ubuntu 24.04 仓库里的 zoxide 是 0.9.3。
- **pacman** 删除软件包后，command -v zoxide 找不到程序。
- **官方安装脚本**没有卸载命令。它在 ~/.local/bin 放了一个程序，在 ~/.local/share/man/man1 放了六个 man 手册，上面那条 rm 命令全部删掉了。

### NixOS 和 Home Manager

在这里 zoxide 是配置的一部分，所以要从配置里去掉再重建。用模块的话，把 programs.zoxide.enable 设为 false（或删掉整段）；只是把 pkgs.zoxide 加进了软件包列表的，从列表里删掉。然后运行 sudo nixos-rebuild switch 或 home-manager switch。NixOS 实测中，切换到关闭 zoxide 的配置后，新登录的 Shell 找不到 zoxide，家目录里的数据库仍然保留。

### 装过不止一份？

卸载后 command -v zoxide 应该什么都不输出。如果还显示另一个路径，说明还有第二份，比如 Homebrew 和 Cargo 各装了一份。which -a zoxide（PowerShell 用 Get-Command zoxide -All）会列出所有副本，各自用对应的工具删。

Chocolatey、MacPorts、dnf、zypper 我们没有测。它们用各自常规的删除命令，下面数据库的处理同样适用。

## 第 3 步：数据库留还是删

zoxide 把学到的目录存在一个文件 db.zo 里。实测中 Homebrew、Scoop、apt、pacman、NixOS 和安装脚本方式卸载后，这个文件都还在。

| 系统 | 默认位置 |
| --- | --- |
| macOS | ~/Library/Application Support/zoxide/db.zo |
| Linux | ~/.local/share/zoxide/db.zo（设置了 $XDG_DATA_HOME 则在其下的 zoxide 目录） |
| Windows | %LOCALAPPDATA%\zoxide\db.zo |

设置过 _ZO_DATA_DIR 的话，文件在那个目录里。以后可能还会装回来，就留着：重新安装后用同一位置，直接带着以前的记录。要删的话：

macOS：

~~~bash
rm -rf ~/Library/Application\ Support/zoxide
~~~

Linux：

~~~bash
rm -rf ~/.local/share/zoxide
~~~

Windows：

~~~powershell
Remove-Item -Recurse -Force "$env:LOCALAPPDATA\zoxide"
~~~

只是想让 zoxide 忘掉记录？删数据库、保留程序即可。只想忘掉某一个目录，用 zoxide remove 加那个路径，见[命令参考](/zh/blog/zoxide-commands/)。

## 第 4 步：确认已经卸干净

新开一个终端窗口（避免旧配置还在内存里），运行：

~~~bash
command -v zoxide; echo "exit $?"
~~~

~~~powershell
Get-Command zoxide -ErrorAction SilentlyContinue; "found=" + [bool](Get-Command zoxide -ErrorAction SilentlyContinue)
~~~

实测中第一条什么都没输出，只显示 exit 1；第二条输出 found=False。新窗口打开时也不应再出现任何关于 zoxide 的提示。

## 以后想装回来

按你的系统看对应教程：[macOS](/zh/tutorials/install-macos/)、[Windows](/zh/tutorials/install-windows/)、[Ubuntu](/zh/tutorials/install-ubuntu/)、[Arch Linux 和 NixOS](/zh/tutorials/install-arch-nixos/)。如果保留了 db.zo，把初始化行加回去后，z 立刻就能用上以前的记录。`;

const ja = String.raw`# zoxide を完全にアンインストールする方法

zoxide の削除は 3 段階で、順番が大切です。まずシェル設定ファイルの初期化行を消し、次にインストールに使ったツールで本体を削除し、最後にデータベースを残すか決めます。最初の手順を飛ばすと、新しいターミナルを開くたびにエラーが出ます。今回試したどの方法でも、データベースは自動では消えませんでした。

特に記載がない限り、以下は 2026 年 11 月 8 日の実測で、メッセージはその出力をそのまま載せています。

## テスト環境

| 導入方法 | システム | zoxide | 生データ |
| --- | --- | --- | --- |
| Homebrew | macOS 26.7.2 arm64、Homebrew 7.0.11、zsh | 0.10.0 | [uninstall.json](/evidence/2026-11-08/uninstall.json) |
| 公式インストールスクリプト | Ubuntu 24.04 コンテナ、一般ユーザー、bash | 0.10.0 | [uninstall.json](/evidence/2026-11-08/uninstall.json) |
| apt | Ubuntu 24.04 コンテナ | 0.9.3（Ubuntu のパッケージ） | [uninstall.json](/evidence/2026-11-08/uninstall.json) |
| Cargo | Ubuntu 24.04、cargo 1.99.1 | 0.10.0 | [uninstall.json](/evidence/2026-11-08/uninstall.json) |
| Scoop | Windows Server 2025、PowerShell 7.6.9 | 0.10.0 | [uninstall.json](/evidence/2026-11-08/uninstall.json) |
| winget | Windows 11、PowerShell 7.6.9 | 0.10.0 | [windows.json](/evidence/2026-11-08/windows.json) |
| pacman・NixOS | Arch Linux コンテナ、NixOS 26.05 VM（2026 年 10 月 8 日） | 0.10.0 / 0.9.9 | [arch-nixos.json](/evidence/2026-10-09/arch-nixos.json) |

## 手順 1：初期化行を消す

z コマンドは、新しいシェルを開くたびにこの行が作っています。まず場所を探します。

~~~bash
grep -n zoxide ~/.zshrc ~/.bashrc ~/.bash_profile ~/.config/fish/config.fish 2>/dev/null
~~~

~~~powershell
Select-String -Path $PROFILE -Pattern zoxide
~~~

| シェル | 設定ファイル | 消す行 |
| --- | --- | --- |
| zsh | ~/.zshrc | eval "$(zoxide init zsh)" |
| bash | ~/.bashrc（macOS は ~/.bash_profile も） | eval "$(zoxide init bash)" |
| fish | ~/.config/fish/config.fish | zoxide init fish \| source |
| PowerShell | $PROFILE が指すファイル | Invoke-Expression (& { (zoxide init powershell \| Out-String) }) |

--cmd cd などのオプションを付けた場合は行が長くなりますが、必ず zoxide init を含みます。近くで設定した zoxide の環境変数（_ZO_DATA_DIR や _ZO_EXCLUDE_DIRS など）も一緒に消してください。grep で何も見つからないのに新しいターミナルで z が使える場合は、プラグインマネージャーが読み込んでいます。たとえば Oh My Zsh の plugins に zoxide が入っていれば、そこから外します。

### 行を残したままだとどうなるか

本体だけ先に削除し、初期化行を残して新しいシェルを開きました。macOS の zsh の出力：

~~~text
/Users/runner/.zshrc:1: command not found: zoxide
~~~

Ubuntu の bash の出力：

~~~text
bash: zoxide: command not found
~~~

PowerShell はプロファイルの読み込み時に 2 つのエラーを出しました。

~~~text
The term 'zoxide' is not recognized as a name of a cmdlet, function, script file, or executable program.
Invoke-Expression: Cannot bind argument to parameter 'Command' because it is null.
~~~

ターミナル自体は開きます。行を消してから同じテストをすると、何も表示されませんでした。アンインストール後にこれらのメッセージが出たら、この手順が抜けています。fish のメッセージは記録していません。

## 手順 2：本体を削除する

インストールに使ったのと同じツールで削除します。分からなければ command -v zoxide（PowerShell は (Get-Command zoxide).Source）を実行し、表示されたパスで判断します。

| 導入方法 | 表示されるパス | 削除コマンド |
| --- | --- | --- |
| Homebrew | /opt/homebrew/bin/zoxide（Intel は /usr/local/bin） | brew uninstall zoxide |
| winget | ...\WinGet\Packages\ajeetdsouza.zoxide_...\zoxide.exe | winget uninstall --id ajeetdsouza.zoxide -e |
| Scoop | ~\scoop\shims\zoxide.exe | scoop uninstall zoxide |
| Cargo | ~/.cargo/bin/zoxide | cargo uninstall zoxide |
| apt（Debian・Ubuntu） | /usr/bin/zoxide | sudo apt remove zoxide |
| pacman（Arch） | /usr/bin/zoxide | sudo pacman -R zoxide |
| 公式インストールスクリプト | ~/.local/bin/zoxide | rm ~/.local/bin/zoxide ~/.local/share/man/man1/zoxide*.1 |

テストでそれぞれが行ったこと：

- **Homebrew** は man ページと bash・zsh・fish の補完を含む 18 ファイルを削除しました。
- **winget** はパッケージを見つけて正常にアンインストールしたと表示しました。
- **Scoop** は zoxide.shim と zoxide.exe の 2 つの shim を削除し、その後 Get-Command zoxide は何も見つけませんでした。
- **Cargo** は導入した唯一のファイル ~/.cargo/bin/zoxide を削除しました。
- **apt** はパッケージを完全に削除しました。その後 dpkg は zoxide というパッケージ自体がないと報告したので、apt purge で追加に消すものはありません。Ubuntu 24.04 の zoxide は 0.9.3 です。
- **pacman** で削除した後、command -v zoxide は失敗しました。
- **公式インストールスクリプト**には削除コマンドがありません。~/.local/bin に本体 1 つ、~/.local/share/man/man1 に man ページ 6 つを置いており、上の rm ですべて消えました。

### NixOS と Home Manager

ここでは zoxide は設定の一部なので、設定から外して再構築します。モジュールを使っている場合は programs.zoxide.enable = false にする（またはブロックごと消す）、パッケージ一覧に pkgs.zoxide を足しただけなら一覧から消します。その後 sudo nixos-rebuild switch か home-manager switch を実行します。NixOS のテストでは、zoxide を無効にした設定へ切り替えると新しいログインシェルから zoxide が見つからなくなり、データベースはホームディレクトリに残っていました。

### 複数の方法で入れていた場合

削除後、command -v zoxide は何も表示しないはずです。別のパスが出たら、Homebrew と Cargo の両方など、もう 1 つ残っています。which -a zoxide（PowerShell は Get-Command zoxide -All）ですべての場所を一覧し、それぞれのツールで削除してください。

Chocolatey、MacPorts、dnf、zypper は試していません。通常の削除コマンドを使い、下のデータベースの扱いも同じです。

## 手順 3：データベースを残すか消すか

zoxide は覚えたディレクトリを db.zo という 1 つのファイルに保存します。テストでは Homebrew、Scoop、apt、pacman、NixOS、スクリプト方式のどれで削除しても残っていました。

| システム | 既定の場所 |
| --- | --- |
| macOS | ~/Library/Application Support/zoxide/db.zo |
| Linux | ~/.local/share/zoxide/db.zo（$XDG_DATA_HOME を設定していればその下の zoxide） |
| Windows | %LOCALAPPDATA%\zoxide\db.zo |

_ZO_DATA_DIR を設定していた場合はそのフォルダーにあります。また入れ直すかもしれないなら残しておきましょう。同じ場所で再インストールすれば以前の履歴から始まります。消す場合：

macOS：

~~~bash
rm -rf ~/Library/Application\ Support/zoxide
~~~

Linux：

~~~bash
rm -rf ~/.local/share/zoxide
~~~

Windows：

~~~powershell
Remove-Item -Recurse -Force "$env:LOCALAPPDATA\zoxide"
~~~

履歴だけ忘れさせたいなら、本体は残してデータベースだけ消せば十分です。1 つのフォルダーだけなら zoxide remove にそのパスを渡します。[コマンド一覧](/ja/blog/zoxide-commands/)を参照してください。

## 手順 4：消えたか確認する

古い設定が残らないよう新しいターミナルを開き、次を実行します。

~~~bash
command -v zoxide; echo "exit $?"
~~~

~~~powershell
Get-Command zoxide -ErrorAction SilentlyContinue; "found=" + [bool](Get-Command zoxide -ErrorAction SilentlyContinue)
~~~

テストでは 1 つ目は exit 1 だけを表示し、2 つ目は found=False を表示しました。新しいウィンドウを開いたときに zoxide に関するメッセージが出なければ完了です。

## 後で入れ直すとき

お使いのシステムのガイドに従ってください：[macOS](/ja/tutorials/install-macos/)、[Windows](/ja/tutorials/install-windows/)、[Ubuntu](/ja/tutorials/install-ubuntu/)、[Arch Linux・NixOS](/ja/tutorials/install-arch-nixos/)。db.zo を残していれば、初期化行を戻した時点で以前の履歴のまま z が使えます。`;

export const uninstallContent = { en, zh, ja };
