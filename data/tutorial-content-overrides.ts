const englishTutorialContent: Record<string, string> = {
  'install-macos': String.raw`# How to install zoxide on macOS (tested with Homebrew and zsh)

This guide installs zoxide on macOS with Homebrew, connects it to zsh (the default macOS shell), and then tests the points where a Mac setup usually fails: Homebrew's PATH on Apple Silicon, the z command, and the hook that records directories. The commands and outputs below are from a real test run, not copied from the README.

## Test environment

| Item | Value |
| --- | --- |
| Tested on | September 30, 2026 |
| Machine | GitHub Actions macOS runner, Apple M1 (virtual), 3 cores |
| OS | macOS 26.6.2, arm64 |
| Shell | zsh 5.9 (the macOS default); system bash 3.2.57 also checked |
| Homebrew | 6.0.22, prefix /opt/homebrew |
| zoxide | 0.10.0 (Homebrew bottle) |
| fzf | 0.74.3 (Homebrew) |

We used a clean virtual Mac so that no earlier configuration could hide a problem. Timings on your own Mac will differ, but the behavior described here is the same.

## Step 1: install with Homebrew

~~~bash
brew install zoxide
~~~

Homebrew listed zoxide as stable 0.10.0 (bottled), and the install took about 3 seconds because a prebuilt bottle was used. Check where it landed:

~~~bash
command -v zoxide
zoxide --version
~~~

On Apple Silicon our output was /opt/homebrew/bin/zoxide and zoxide 0.10.0. On an Intel Mac, Homebrew uses /usr/local/bin instead.

### If the shell says command not found: zoxide

On Apple Silicon, /opt/homebrew/bin is not on the default PATH. Homebrew's installer asks you to add a brew shellenv line to ~/.zprofile, and if that step was skipped, every Homebrew tool is missing. We reproduced it by starting zsh with only the system PATH:

~~~text
zsh:1: command not found: zoxide
~~~

Adding the shellenv line fixed it in the same test:

~~~bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
~~~

Open a new terminal window afterwards. If brew itself is also "not found", this is the cause.

## Step 2: add zoxide to ~/.zshrc

Installing the binary does not create z. With an empty ~/.zshrc, our interactive zsh printed:

~~~text
zsh:1: command not found: z
~~~

Add the init line at the end of ~/.zshrc:

~~~bash
echo 'eval "$(zoxide init zsh)"' >> ~/.zshrc
~~~

Open a new window and check:

~~~bash
type z zi
~~~

Our run printed that z and zi are shell functions from ~/.zshrc. To make zoxide replace cd itself, use zoxide init zsh --cmd cd; in our test that defined cd and cdi as zoxide functions.

## Step 3: how zoxide learns directories in zsh

We read the script that zoxide init zsh generates. In zsh, zoxide adds its hook to chpwd_functions, a zsh feature that runs whenever the current directory changes. That has two practical consequences, and we tested both.

**cd inside zsh scripts is recorded.** A non-interactive zsh script that ran the init line and then changed directories four times produced this database:

~~~text
   8.0 .../zo-demo/projects/web-app/src
   4.0 .../zo-demo/notes/2026
   4.0 .../zo-demo/projects/api-server
~~~

This is different from PowerShell on Windows, where zoxide records from the prompt and scripts teach it nothing. See our [Windows guide](/tutorials/install-windows/) for that case.

**Something that clears chpwd_functions after zoxide breaks learning, and zoxide tells you.** We put a line that empties chpwd_functions after the init line, a pattern some plugin setups produce. On the next z, zoxide printed:

~~~text
zoxide: detected a possible configuration issue.
Please ensure that zoxide is initialized right at the end of your shell configuration file (usually ~/.zshrc).
~~~

The database stayed empty. If you see this message, move the zoxide init line below your plugin manager, theme and any other shell setup. By contrast, clearing precmd_functions (the prompt hook list) did not affect zoxide in zsh: directories were still recorded.

## Step 4: test jumping, and the matching rule

After the visits above, z web failed:

~~~text
zoxide: no match found
~~~

The top entry was web-app/src, but zoxide requires the last keyword to match the last component of the path, which is src. These worked:

~~~bash
z web src      # web matches earlier in the path, src matches the last part
z proj api     # api matches api-server, the last component
~~~

When a jump fails, run zoxide query -ls and check whether your last keyword appears in the final folder name.

## Step 5: zi needs fzf

On the clean machine, zi failed with:

~~~text
zoxide: could not find fzf, is it installed?
~~~

~~~bash
brew install fzf
~~~

That installed fzf 0.74.3. zi's picker needs a real interactive terminal, so our automated run stopped at confirming fzf was installed; open a new window and run zi to see it. z never needs fzf. The [fzf integration guide](/tutorials/fzf-integration/) covers tuning the picker.

## What about bash on macOS?

macOS still ships bash 3.2.57 as /bin/bash. In our test, eval "$(zoxide init bash)" loaded without errors under that version and defined the z function. We did not run a full interactive bash session, so if you use bash as your daily shell, check with zoxide query -ls after a few directory changes. Since zsh is the default shell on current macOS, zsh is the path this guide recommends.

## Does zoxide slow down zsh?

We measured with 2,000 directories in the database (a 149 KB db.zo):

| Measurement (median) | Time |
| --- | --- |
| zoxide query repo1500 src | 8.4 ms |
| zoxide --version (bare process start) | 4.7 ms |
| zsh -i startup, empty ~/.zshrc | 14.1 ms |
| zsh -i startup, with zoxide init | 27.1 ms |

A lookup is a few milliseconds above starting the process at all, and the init line added about 13 ms to shell startup. On this test machine, zoxide is not a meaningful source of terminal lag. If your shell feels slow, measure the rest of ~/.zshrc first.

## Where zoxide keeps its data on macOS

By default the database is ~/Library/Application Support/zoxide/db.zo. Our first zoxide add created it there. Set _ZO_DATA_DIR to move it. Deleting db.zo resets what zoxide has learned without removing zoxide.

## Uninstall

~~~bash
brew uninstall zoxide
~~~

Then remove the init line from ~/.zshrc, otherwise every new terminal prints command not found: zoxide.

## Next steps

- [Command reference](/blog/zoxide-commands/) for z, zi, z - and query flags
- [Advanced configuration](/tutorials/advanced-config/) for _ZO_EXCLUDE_DIRS and other variables
- [zoxide-doctor](/tools/zoxide-doctor/) to check a setup automatically`,
  'install-windows': String.raw`# How to install zoxide on Windows (tested with PowerShell 7)

This guide installs zoxide on Windows with winget, wires it into PowerShell, and then checks the three places where a Windows setup usually breaks: the binary on PATH, the z command in the shell, and the prompt hook that records directories. Every command and output below comes from a real test run, not from the README.

## Test environment

| Item | Value |
| --- | --- |
| Tested on | September 30, 2026 |
| OS | Windows 11 Pro 23H2 (build 22631) |
| Shell | PowerShell 7.6.6 |
| zoxide | 0.10.0, installed with winget |
| CPU | Intel Core i5-1135G7 laptop |

The test machine uses a Chinese Windows display language, so PowerShell's own error messages appeared in Chinese. Where that happened, this page shows the standard English wording of the same message. zoxide's own messages are always English.

## Step 1: install the binary with winget

winget ships with current Windows 10 and 11 builds, so it needs no extra package manager.

~~~powershell
winget install --id ajeetdsouza.zoxide -e
~~~

winget puts a zoxide.exe link in %LOCALAPPDATA%\Microsoft\WinGet\Links and adds that folder to your user PATH. Terminals that were already open do not see the new PATH, so open a new PowerShell window and check:

~~~powershell
zoxide --version
(Get-Command zoxide).Source
~~~

Our run printed zoxide 0.10.0 and C:\Users\YourName\AppData\Local\Microsoft\WinGet\Links\zoxide.exe. If zoxide --version fails only in an old window, the install is fine and the window is stale.

### Other install methods

Scoop (scoop install zoxide), Cargo (cargo install zoxide --locked) and the zip from the [official releases page](https://github.com/ajeetdsouza/zoxide/releases) also work. We did not re-test them for this page. Pick one method only: two copies on PATH is a common source of "wrong version" confusion. Get-Command zoxide -All lists every copy PowerShell can see.

## Step 2: initialize zoxide in your PowerShell profile

Installing the binary does not create z. Right after install, our test gave PowerShell's standard error:

~~~text
z: The term 'z' is not recognized as a name of a cmdlet, function, script file, or executable program.
~~~

The fix is the init line. Open your profile:

~~~powershell
if (-not (Test-Path $PROFILE)) { New-Item -Path $PROFILE -ItemType File -Force }
notepad $PROFILE
~~~

Add this as the last line of the file:

~~~powershell
Invoke-Expression (& { (zoxide init powershell | Out-String) })
~~~

Then open a new window and confirm:

~~~powershell
Get-Command z, zi
~~~

In our test both appeared as aliases (z and zi point to internal zoxide functions). If you want zoxide to replace cd itself, use zoxide init powershell --cmd cd instead.

## Step 3: understand how zoxide learns directories on PowerShell

This is the part most guides skip. We read the script that zoxide init powershell generates: on PowerShell, zoxide records the current directory from inside your prompt function. A directory is learned only when a prompt is drawn after you arrive there.

We tested two consequences.

**Another prompt tool can silently disable learning.** When a prompt theme redefined the prompt function after zoxide had initialized, we changed directory and drew the prompt again, and the database stayed empty. zoxide query -ls printed nothing. If you use oh-my-posh, Starship or a custom prompt function, put the zoxide init line after them, at the very end of the profile.

**cd inside scripts is not recorded.** Scripts do not draw a prompt between commands, so they teach zoxide nothing. In a script or scheduled task, add paths explicitly:

~~~powershell
zoxide add "D:\work\api-server"
~~~

## Step 4: test that jumping works

Visit a few folders in an interactive window (cd to each, pressing Enter each time), then list what zoxide learned:

~~~powershell
zoxide query -ls
~~~

Our run, after visiting web-app\src twice and two other folders once:

~~~text
   8.0 C:\...\zo-demo\projects\web-app\src
   4.0 C:\...\zo-demo\notes\2026
   4.0 C:\...\zo-demo\projects\api-server
~~~

Scores are higher for recent visits, so a folder used twice in the last hour already ranks first.

One matching rule surprised us. z web returned "zoxide: no match found" even though web-app\src was the top entry. zoxide requires the last keyword to match the last component of the path, and the last component here is src. These worked:

~~~powershell
z web src      # web matches earlier in the path, src matches the last part
z proj api     # api matches api-server, the last component
~~~

If a jump fails, run zoxide query -ls and check whether your last keyword appears in the final folder name.

## Step 5: zi needs fzf

zi (interactive selection) failed on our clean machine with:

~~~text
zoxide: could not find fzf, is it installed?
~~~

Install fzf, open a new window, and zi works:

~~~powershell
winget install --id junegunn.fzf -e
~~~

z does not need fzf. See the [fzf integration guide](/tutorials/fzf-integration/) for tuning the picker.

## Does zoxide slow down PowerShell?

We measured with 2,000 directories in the database (a 167 KB db.zo file):

| Measurement (median) | Time |
| --- | --- |
| zoxide query repo1500 src | 16.3 ms |
| zoxide --version (bare process start) | 11.8 ms |
| Set-Location to a full path | 3.7 ms |
| Re-running the init line in an open session | 13.3 ms |

A lookup costs about 4–5 ms more than starting the process at all, so the database size barely matters at this scale. Starting a fresh pwsh -NoProfile went from 249 ms to 546 ms when the init line was added. About 190 ms of that came from PowerShell loading its own Microsoft.PowerShell.Utility module, which the init script calls. Most real profiles load that module anyway, so the extra startup cost for a typical user was closer to 110 ms on this laptop.

## Where zoxide keeps its data on Windows

By default the database is %LOCALAPPDATA%\zoxide\db.zo. Set the _ZO_DATA_DIR environment variable to move it, for example to sync it between machines. Deleting db.zo resets what zoxide has learned. It does not remove zoxide itself.

## Uninstall

~~~powershell
winget uninstall --id ajeetdsouza.zoxide -e
~~~

Also delete the init line from $PROFILE, otherwise every new window will print an error that zoxide cannot be found.

## Next steps

- [Command reference](/blog/zoxide-commands/) for z, zi, z - and query flags
- [Advanced configuration](/tutorials/advanced-config/) for _ZO_EXCLUDE_DIRS and other variables
- [zoxide-doctor](/tools/zoxide-doctor/) to check a setup automatically`,
  'install-ubuntu': String.raw`# How to install zoxide on Ubuntu 24.04 (tested in a clean container)

This guide installs zoxide on Ubuntu 24.04 with apt or with the official install script, connects it to Bash, and checks the points where an Ubuntu setup usually goes wrong: an older apt version, ~/.local/bin and PATH, two copies of zoxide, the shell hook, and fzf. Every output below comes from a real run on a fresh Ubuntu 24.04 system.

## Test environment

| Item | Value |
| --- | --- |
| Tested on | October 8, 2026 |
| System | Official ubuntu:24.04 container (Ubuntu 24.04.5 LTS, x86_64) on a GitHub Actions runner |
| CPU | AMD EPYC 7763, 4 cores |
| Shell | GNU bash 5.2.21 |
| apt packages | zoxide 0.9.3-1, fzf 0.44.1-1ubuntu0.3 |
| Upstream | zoxide 0.10.0 from the official script; fzf 0.74.4 from the fzf Git installer |

apt commands ran as root inside the container, so the sudo you see below was not needed there. The official script ran as a normal user named dev. A container has no desktop and no terminal window, so we could not open the interactive zi picker; the fzf section says exactly what was and was not tested.

## Choose the installation method first

| Method | Version on Ubuntu 24.04 | Best for | Trade-off |
| --- | --- | --- | --- |
| Ubuntu apt | 0.9.3 | Managed workstations and servers that update through apt | One minor release behind upstream |
| Official install script | 0.10.0 (current) | Personal Linux or WSL accounts | You update it yourself |
| Cargo | current | Machines that already maintain a Rust toolchain | Long build; not re-tested for this page |

The [zoxide installation documentation](https://github.com/ajeetdsouza/zoxide#installation) recommends the install script for Linux and WSL. apt is still a reasonable choice; just choose it knowing it ships 0.9.3.

## Prerequisites

Check the system and the shell you are using before changing anything.

~~~bash
lsb_release -ds
ps -p $$ -o comm=
~~~

The second command prints bash on a default Ubuntu install. If it prints zsh or fish, use the matching section below. WSL users run the same commands inside the Ubuntu shell.

## Method A: install the Ubuntu package with apt

Ask apt what it will install before installing it.

~~~bash
sudo apt update
apt-cache policy zoxide
~~~

On our fresh system:

~~~text
zoxide:
  Installed: (none)
  Candidate: 0.9.3-1
  Version table:
     0.9.3-1 500
        500 http://archive.ubuntu.com/ubuntu noble/universe amd64 Packages
~~~

The package comes from the universe component, which was already enabled in the official image. Install it and check the binary:

~~~bash
sudo apt install zoxide
command -v zoxide
zoxide --version
~~~

The install took about 2 seconds and printed /usr/bin/zoxide and zoxide 0.9.3. If apt instead reports Unable to locate package or Candidate: (none), universe is disabled on your machine; enable it with sudo add-apt-repository universe and run sudo apt update again. We did not need this step, so it is untested here.

## Method B: install the current upstream release

Run the official installer as your normal user, without sudo:

~~~bash
curl -sSfL https://raw.githubusercontent.com/ajeetdsouza/zoxide/main/install.sh | sh
~~~

It installed zoxide 0.10.0 to ~/.local/bin and ended with this note:

~~~text
zoxide is installed!
Note: /home/dev/.local/bin is not on your $PATH. zoxide will not work unless it is added to $PATH.
~~~

The note is accurate for the shell you are in, but it is not the whole story on Ubuntu. Ubuntu's default ~/.profile adds ~/.local/bin to PATH whenever that folder exists, and it runs at login. In our test, a fresh login shell after the install already had /home/dev/.local/bin at the front of PATH. On a desktop, that means logging out and back in. If you do not want to wait, add the folder yourself in ~/.bashrc:

~~~bash
export PATH="$HOME/.local/bin:$PATH"
~~~

If you prefer to read the script before running it, download it first:

~~~bash
curl -sSfL https://raw.githubusercontent.com/ajeetdsouza/zoxide/main/install.sh -o /tmp/zoxide-install.sh
less /tmp/zoxide-install.sh
sh /tmp/zoxide-install.sh
~~~

### If you installed both

We installed the apt package and the script version on the same machine. type -a lists every copy in PATH order:

~~~text
zoxide is /home/dev/.local/bin/zoxide
zoxide is /usr/bin/zoxide
zoxide is /bin/zoxide
~~~

The first one wins, so zoxide --version printed 0.10.0. The /bin/zoxide line is not a third installation: on Ubuntu, /bin points to /usr/bin, so the apt copy simply shows up twice. Keep one method and remove the other, otherwise updates become confusing.

## Method C: use Cargo when Rust is already installed

Cargo makes sense only if the machine already keeps a Rust toolchain up to date; installing Rust just for zoxide is unnecessary when the script provides a prebuilt binary. We did not re-test this method for this page.

~~~bash
cargo install zoxide --locked
export PATH="$HOME/.cargo/bin:$PATH"
zoxide --version
~~~

## Initialize zoxide in the active shell

Installing the binary does not create z. Before the init line, our interactive Bash printed:

~~~text
bash: type: z: not found
~~~

### Bash on the default Ubuntu terminal

Add this line to the end of ~/.bashrc, then open a new terminal:

~~~bash
eval "$(zoxide init bash)"
~~~

~~~bash
type z
~~~

After the change, the first line of the output was z is a function.

### Zsh

Add the line to the end of ~/.zshrc and open a new terminal. We tested zsh on macOS rather than here; see the [macOS guide](/tutorials/install-macos/) for the zsh-specific behavior.

~~~bash
eval "$(zoxide init zsh)"
~~~

### Fish

Add this line to ~/.config/fish/config.fish and open a new Fish session.

~~~fish
zoxide init fish | source
~~~

## How Bash learns directories

We read the code that zoxide init bash generates: it adds a function called __zoxide_hook to PROMPT_COMMAND, which Bash runs each time it draws a prompt. A directory is recorded only when a prompt appears while you are in it.

We tested the consequence. A non-interactive bash -c command that changed into ~/work/api-server and back recorded nothing, and zoxide query api returned zoxide: no match found. Running the prompt hook once in the same command recorded the directory. So cd inside scripts, cron jobs and CI steps does not teach zoxide anything; use zoxide add there. This matches what we saw with [PowerShell on Windows](/tutorials/install-windows/) and differs from zsh, which records on every directory change.

## Run an end-to-end test

Run these in the interactive shell you just configured:

~~~bash
mkdir -p "$HOME/projects/zoxide-demo"
zoxide add "$HOME/projects/zoxide-demo"
cd "$HOME"
z zoxide-demo
pwd
zoxide query zoxide-demo
zoxide query --list
~~~

All three output lines in our run were /home/dev/projects/zoxide-demo: pwd confirms the jump, and the two queries confirm the entry is in the database. From here, visit real projects normally; the [command reference](/blog/zoxide-commands/) covers querying, adding and removing entries.

## Ubuntu 24.04's fzf version

fzf is optional. Plain z never uses it; zi uses fzf to show a picker. The upstream README states that the minimum supported fzf version is v0.51.0, and Ubuntu 24.04 ships 0.44.1, so apt's fzf is officially unsupported.

What we measured: we ran zoxide's interactive query with fzf in filter mode, which accepts all the options zoxide passes but needs no terminal. fzf 0.44.1 from apt accepted them and returned the matching directories with both zoxide 0.10.0 and the apt zoxide 0.9.3. So zi is not guaranteed to fail with apt's fzf, but the picker itself was not tested and is outside the supported range. If zi misbehaves, install a current fzf with the upstream Git installer. We ran it with --bin, which only fetches the binary, and got 0.74.4, which worked the same way. Without --bin, the installer also offers to set up key bindings and completion:

~~~bash
git clone --depth 1 https://github.com/junegunn/fzf.git ~/.fzf
~/.fzf/install
~~~

Without a terminal, zi fails with this message. It is what you will see if zi runs from a script or a non-interactive SSH command:

~~~text
Failed to open /dev/tty
zoxide: fzf returned an error
~~~

## Does zoxide slow Bash down?

With 2,000 directories in the database, one zoxide query took about 1 ms on this machine. Interactive Bash startup went from about 8 ms without the init line to about 10 ms with it. The measurement is coarse (millisecond resolution), but zoxide is not a noticeable part of Bash startup.

## Troubleshooting by symptom

### zoxide: command not found

Run command -v zoxide. For the script, check ~/.local/bin and log in again or add the export line; for Cargo, check ~/.cargo/bin. Our [command-not-found guide](/blog/zoxide-command-not-found/) separates the cases, and [zoxide-doctor](/tools/zoxide-doctor/) checks them in one command.

### z: command not found

The binary is installed but the shell function was not loaded. Check that the init line is in ~/.bashrc, not only in ~/.bash_profile, and open a new terminal.

### zoxide: no match found

The database has not learned that directory. Visit it in an interactive shell or add the full path with zoxide add, then check with zoxide query --list.

### zi shows Failed to open /dev/tty

zi was started without a terminal, for example from a script. Run it in an interactive terminal. If it fails there too, check fzf --version as described above.

### apt and the script version both appear

Run type -a zoxide. Remove the one you do not want with the method that installed it, then open a new terminal.

## Uninstalling

We removed both copies in turn. sudo apt remove zoxide removed /usr/bin/zoxide and left the script version in place. Deleting ~/.local/bin/zoxide removed the other one, after which type -a zoxide reported not found. In both cases the database stayed at ~/.local/share/zoxide/db.zo; delete that folder too if you want a clean slate, and remove the init line from ~/.bashrc.

## Updating and choosing the next step

For apt, use normal Ubuntu updates. For the script, run the installer again to fetch the current release. For Cargo, rerun cargo install zoxide --locked.

Once the installation works, compare [zoxide with autojump](/blog/zoxide-vs-autojump/) before migrating an existing history, or set up the picker with the [fzf guide](/tutorials/fzf-integration/).

## Sources checked

- [zoxide upstream installation and shell setup](https://github.com/ajeetdsouza/zoxide#installation)
- [zoxide official installer source](https://github.com/ajeetdsouza/zoxide/blob/main/install.sh)
- [zoxide upstream releases](https://github.com/ajeetdsouza/zoxide/releases)
- [Ubuntu 24.04 zoxide package](https://packages.ubuntu.com/noble/zoxide)
- [Ubuntu 24.04 fzf package](https://packages.ubuntu.com/noble/fzf)
- [fzf upstream installation guide](https://github.com/junegunn/fzf#installation)`,

  'quick-start': String.raw`# Verify zoxide in five minutes

This quick start assumes the zoxide binary is already installed. Its job is deliberately narrow: confirm the binary, shell initialization, learned database, and first smart jump. If you still need an installer, begin on the [download page](/download/). For what zoxide is and how it ranks directories, read [what zoxide is](/blog/what-is-zoxide-smarter-cd/).

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
- Use the [command reference](/blog/zoxide-commands/) for z, zi, query, add, and remove.
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
  'install-windows': String.raw`# Windows に zoxide をインストールする方法（PowerShell 7 で検証）

このガイドでは winget で zoxide を Windows にインストールし、PowerShell に組み込んだうえで、Windows で壊れやすい三つのポイントを順に確認します。PATH 上のバイナリ、シェルの z コマンド、そしてディレクトリを記録する prompt フックです。以下のコマンドと出力はすべて実際のテスト結果で、README の転記ではありません。

## テスト環境

| 項目 | 値 |
| --- | --- |
| 検証日 | 2026 年 9 月 30 日 |
| OS | Windows 11 Pro 23H2（ビルド 22631） |
| シェル | PowerShell 7.6.6 |
| zoxide | 0.10.0（winget でインストール） |
| CPU | Intel Core i5-1135G7 ノート PC |

テスト機の表示言語は中国語のため、PowerShell 自体のエラーは中国語で表示されました。本ページでは同じメッセージの英語版を載せています。zoxide 自身のメッセージは常に英語です。

## ステップ 1：winget でインストール

現在の Windows 10 / 11 には winget が標準で入っているため、追加のパッケージマネージャーは不要です。

~~~powershell
winget install --id ajeetdsouza.zoxide -e
~~~

winget は %LOCALAPPDATA%\Microsoft\WinGet\Links に zoxide.exe へのリンクを置き、そのフォルダーをユーザー PATH に追加します。すでに開いているターミナルには新しい PATH が反映されないので、新しい PowerShell ウィンドウで確認します。

~~~powershell
zoxide --version
(Get-Command zoxide).Source
~~~

テストでは zoxide 0.10.0 と C:\Users\ユーザー名\AppData\Local\Microsoft\WinGet\Links\zoxide.exe が表示されました。古いウィンドウでだけ失敗する場合、インストールは正常でウィンドウが古いだけです。

### その他のインストール方法

Scoop（scoop install zoxide）、Cargo（cargo install zoxide --locked）、[公式リリースページ](https://github.com/ajeetdsouza/zoxide/releases)の zip でも導入できますが、本ページでは再検証していません。方法は一つに絞ってください。PATH 上に zoxide が二つあると「バージョンが違う」混乱の原因になります。Get-Command zoxide -All で PowerShell から見えるすべてのコピーを確認できます。

## ステップ 2：PowerShell プロファイルで初期化

バイナリを入れただけでは z コマンドは作られません。インストール直後に z を実行すると、PowerShell の標準エラーになりました。

~~~text
z: The term 'z' is not recognized as a name of a cmdlet, function, script file, or executable program.
~~~

初期化行を追加して解決します。まずプロファイルを開きます。

~~~powershell
if (-not (Test-Path $PROFILE)) { New-Item -Path $PROFILE -ItemType File -Force }
notepad $PROFILE
~~~

ファイルの最終行に次を追加します。

~~~powershell
Invoke-Expression (& { (zoxide init powershell | Out-String) })
~~~

新しいウィンドウで確認します。

~~~powershell
Get-Command z, zi
~~~

テストでは z と zi がエイリアスとして表示され、zoxide の内部関数を指していました。cd 自体を置き換えたい場合は zoxide init powershell --cmd cd を使います。

## ステップ 3：PowerShell で zoxide がディレクトリを覚える仕組み

多くの解説が省略している部分です。zoxide init powershell が生成するスクリプトを読むと、PowerShell 版の zoxide は prompt 関数（プロンプトを表示するたびに実行される関数）の中で現在のディレクトリを記録しています。つまり、そのディレクトリに移動してプロンプトが再表示されたときにだけ記録されます。

この仕組みによる影響を二つ検証しました。

**別のプロンプトツールが記録を無効にすることがある。** zoxide の初期化後にプロンプトテーマが prompt 関数を再定義した状態で、ディレクトリを移動してプロンプトを再表示しても、データベースは空のままでした。zoxide query -ls は何も出力しません。oh-my-posh、Starship、独自の prompt を使っている場合は、zoxide の初期化行をそれらより後、プロファイルの一番最後に置いてください。

**スクリプト内の cd は記録されない。** スクリプトはコマンドの合間にプロンプトを表示しないため、zoxide は何も学習しません。スクリプトやタスクスケジューラでは明示的に追加します。

~~~powershell
zoxide add "D:\work\api-server"
~~~

## ステップ 4：ジャンプを試す

対話ウィンドウでいくつかのフォルダーに cd し（毎回 Enter）、zoxide が覚えた内容を表示します。

~~~powershell
zoxide query -ls
~~~

web-app\src に 2 回、他の 2 フォルダーに 1 回ずつ移動した後の出力です。

~~~text
   8.0 C:\...\zo-demo\projects\web-app\src
   4.0 C:\...\zo-demo\notes\2026
   4.0 C:\...\zo-demo\projects\api-server
~~~

最近の訪問ほどスコアが高くなるため、1 時間以内に 2 回使ったフォルダーがすでに先頭です。

意外だったマッチングの規則があります。web-app\src が先頭なのに、z web は「zoxide: no match found」を返しました。zoxide は最後のキーワードがパスの最後の要素に一致することを求めますが、ここでの最後の要素は src です。次の書き方は成功しました。

~~~powershell
z web src      # web はパスの前半、src は最後の要素に一致
z proj api     # api は最後の要素 api-server に一致
~~~

ジャンプに失敗したら zoxide query -ls を実行し、最後のキーワードが目的のフォルダー名に含まれているか確認してください。

## ステップ 5：zi には fzf が必要

クリーンなテスト機では、zi（対話的な選択）が次のエラーで失敗しました。

~~~text
zoxide: could not find fzf, is it installed?
~~~

fzf をインストールして新しいウィンドウを開けば zi が使えます。

~~~powershell
winget install --id junegunn.fzf -e
~~~

z 自体は fzf を必要としません。選択画面の調整は [fzf 連携ガイド](/ja/tutorials/fzf-integration/) を参照してください。

## zoxide で PowerShell は遅くなる？

データベースに 2,000 個のディレクトリ（db.zo は 167 KB）を入れて計測しました。

| 計測項目（中央値） | 時間 |
| --- | --- |
| zoxide query repo1500 src | 16.3 ms |
| zoxide --version（プロセス起動のみ） | 11.8 ms |
| フルパスへの Set-Location | 3.7 ms |
| 開いているセッションで初期化行を再実行 | 13.3 ms |

検索はプロセス起動そのものより 4〜5 ms 多いだけで、この規模ではデータベースの大きさはほぼ影響しません。pwsh -NoProfile の起動時間は、初期化行を加えると 249 ms から 546 ms になりました。そのうち約 190 ms は、初期化スクリプトが呼び出す PowerShell 標準の Microsoft.PowerShell.Utility モジュールの読み込みです。実際のプロファイルの多くは元々このモジュールを読み込むため、一般的な利用者にとっての追加起動時間は、このノート PC で 110 ms 程度でした。

## Windows でのデータ保存場所

既定のデータベースは %LOCALAPPDATA%\zoxide\db.zo です。環境変数 _ZO_DATA_DIR で場所を変更でき、複数の PC 間で同期することもできます。db.zo を削除すると学習内容がリセットされますが、zoxide 本体は削除されません。

## アンインストール

~~~powershell
winget uninstall --id ajeetdsouza.zoxide -e
~~~

$PROFILE の初期化行も削除してください。残っていると、新しいウィンドウを開くたびに zoxide が見つからないというエラーが出ます。

## 次のステップ

- [コマンドリファレンス](/ja/blog/zoxide-commands/)：z、zi、z - と query のオプション
- [高度な設定](/ja/tutorials/advanced-config/)：_ZO_EXCLUDE_DIRS などの環境変数
- [zoxide-doctor](/ja/tools/zoxide-doctor/)：設定を自動でチェック`,
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

  'install-ubuntu': String.raw`# Ubuntu 24.04 に zoxide をインストールする方法（クリーンなコンテナで検証）

このガイドでは apt または公式インストールスクリプトで Ubuntu 24.04 に zoxide を入れ、Bash に組み込んだうえで、Ubuntu で問題が起きやすい点を確認します。apt 版の古さ、~/.local/bin と PATH、zoxide が 2 つ入った状態、シェルのフック、そして fzf です。以下の出力はすべて、新規の Ubuntu 24.04 での実際の実行結果です。

## テスト環境

| 項目 | 値 |
| --- | --- |
| 検証日 | 2026 年 10 月 8 日 |
| システム | GitHub Actions ランナー上の公式 ubuntu:24.04 コンテナ（Ubuntu 24.04.5 LTS、x86_64） |
| CPU | AMD EPYC 7763、4 コア |
| シェル | GNU bash 5.2.21 |
| apt パッケージ | zoxide 0.9.3-1、fzf 0.44.1-1ubuntu0.3 |
| 上流版 | 公式スクリプトの zoxide 0.10.0、fzf の Git インストールで得た fzf 0.74.4 |

コンテナ内の apt コマンドは root で実行したため、以下の sudo はそこでは不要でした。公式スクリプトは dev という一般ユーザーで実行しました。コンテナにはデスクトップもターミナルもないため、zi の対話選択画面は開けませんでした。何を検証し何を検証していないかは fzf の節で明記します。

## 最初に導入方法を選ぶ

| 方法 | Ubuntu 24.04 での版 | 向いている用途 | 注意点 |
| --- | --- | --- | --- |
| Ubuntu apt | 0.9.3 | apt で一括更新するワークステーションやサーバー | 上流より 1 マイナー版古い |
| 公式インストールスクリプト | 0.10.0（現行） | 個人の Linux や WSL アカウント | 更新は自分で行う |
| Cargo | 現行 | Rust ツールチェーンを維持しているマシン | ビルドに時間がかかる。本ページでは再検証していない |

[zoxide 公式のインストール手順](https://github.com/ajeetdsouza/zoxide#installation)は Linux と WSL にスクリプトを推奨しています。apt も選択肢として問題ありませんが、0.9.3 が入ることは理解しておいてください。

## 事前確認

作業前に、システムと現在のシェルを確認します。

~~~bash
lsb_release -ds
ps -p $$ -o comm=
~~~

標準の Ubuntu では 2 つ目のコマンドが bash を表示します。zsh や fish の場合は下の該当する節を見てください。WSL でも Ubuntu シェル内で同じコマンドを使います。

## 方法 A　apt で Ubuntu パッケージを入れる

インストール前に、apt が何を入れるかを確認します。

~~~bash
sudo apt update
apt-cache policy zoxide
~~~

新規のシステムでは次のとおりでした。

~~~text
zoxide:
  Installed: (none)
  Candidate: 0.9.3-1
  Version table:
     0.9.3-1 500
        500 http://archive.ubuntu.com/ubuntu noble/universe amd64 Packages
~~~

パッケージは universe コンポーネントにあり、公式イメージでは最初から有効でした。インストールしてバイナリを確認します。

~~~bash
sudo apt install zoxide
command -v zoxide
zoxide --version
~~~

約 2 秒でインストールされ、/usr/bin/zoxide と zoxide 0.9.3 が表示されました。apt が Unable to locate package や Candidate: (none) を返す場合は universe が無効なので、sudo add-apt-repository universe の後に sudo apt update を実行してください。今回のテストではこの手順は不要だったため、未検証です。

## 方法 B　現在の上流版を入れる

公式インストーラーを sudo なしで、一般ユーザーとして実行します。

~~~bash
curl -sSfL https://raw.githubusercontent.com/ajeetdsouza/zoxide/main/install.sh | sh
~~~

zoxide 0.10.0 が ~/.local/bin に入り、最後に次の注意が表示されました。

~~~text
zoxide is installed!
Note: /home/dev/.local/bin is not on your $PATH. zoxide will not work unless it is added to $PATH.
~~~

この注意は現在のシェルについては正しいものの、Ubuntu では話の一部にすぎません。Ubuntu 標準の ~/.profile は ~/.local/bin が存在すると PATH に追加し、このファイルはログイン時に実行されます。テストでは、インストール後に開いたログインシェルで /home/dev/.local/bin がすでに PATH の先頭にありました。デスクトップでは一度ログアウトして再ログインすることを意味します。待ちたくない場合は ~/.bashrc に自分で追加します。

~~~bash
export PATH="$HOME/.local/bin:$PATH"
~~~

実行前にスクリプトを読みたい場合は、先にダウンロードします。

~~~bash
curl -sSfL https://raw.githubusercontent.com/ajeetdsouza/zoxide/main/install.sh -o /tmp/zoxide-install.sh
less /tmp/zoxide-install.sh
sh /tmp/zoxide-install.sh
~~~

### 両方入れてしまった場合

同じマシンに apt 版とスクリプト版の両方を入れました。type -a は PATH の順にすべてのコピーを表示します。

~~~text
zoxide is /home/dev/.local/bin/zoxide
zoxide is /usr/bin/zoxide
zoxide is /bin/zoxide
~~~

先頭のものが使われるため、zoxide --version は 0.10.0 を表示しました。/bin/zoxide は 3 つ目のインストールではありません。Ubuntu では /bin が /usr/bin を指しているため、apt 版が 2 回表示されているだけです。方法は 1 つに絞り、もう一方は削除してください。更新時の混乱を防げます。

## 方法 C　Rust 環境がある場合は Cargo を使う

Cargo が適しているのは、マシンで Rust ツールチェーンを継続的に維持している場合だけです。スクリプトがビルド済みバイナリを提供しているので、zoxide のためだけに Rust を入れる必要はありません。本ページではこの方法を再検証していません。

~~~bash
cargo install zoxide --locked
export PATH="$HOME/.cargo/bin:$PATH"
zoxide --version
~~~

## 利用中のシェルを初期化する

バイナリを入れただけでは z は作られません。初期化行を追加する前、対話型 Bash は次のように表示しました。

~~~text
bash: type: z: not found
~~~

### Ubuntu 標準の Bash

~/.bashrc の最後に次の行を追加し、新しいターミナルを開きます。

~~~bash
eval "$(zoxide init bash)"
~~~

~~~bash
type z
~~~

追加後、出力の 1 行目は z is a function でした。

### Zsh

~/.zshrc の最後に追加し、新しいターミナルを開きます。zsh は macOS で検証しました。zsh 固有の動作は [macOS ガイド](/ja/tutorials/install-macos/) を参照してください。

~~~bash
eval "$(zoxide init zsh)"
~~~

### Fish

~/.config/fish/config.fish に次の行を追加し、新しい Fish セッションを開きます。

~~~fish
zoxide init fish | source
~~~

## Bash がディレクトリを覚える仕組み

zoxide init bash が生成するコードを読むと、__zoxide_hook という関数を PROMPT_COMMAND に追加しています。Bash はプロンプトを表示するたびにこれを実行します。つまり、そのディレクトリでプロンプトが表示されたときにだけ記録されます。

その影響を検証しました。~/work/api-server に移動して戻る非対話の bash -c コマンドでは何も記録されず、zoxide query api は zoxide: no match found を返しました。同じコマンド内でプロンプトのフックを 1 回実行すると、ディレクトリが記録されました。したがって、スクリプト、cron、CI 内の cd では zoxide は何も学習しません。そうした場面では zoxide add を使ってください。これは [Windows の PowerShell](/ja/tutorials/install-windows/) と同じで、移動のたびに記録する zsh とは異なります。

## 最初のジャンプまで確認する

設定したばかりの対話型シェルで実行します。

~~~bash
mkdir -p "$HOME/projects/zoxide-demo"
zoxide add "$HOME/projects/zoxide-demo"
cd "$HOME"
z zoxide-demo
pwd
zoxide query zoxide-demo
zoxide query --list
~~~

今回の実行では 3 行とも /home/dev/projects/zoxide-demo でした。pwd でジャンプが成功したことを、2 つの query でデータベースに登録されたことを確認できます。あとは普段どおり実際のプロジェクトへ移動してください。検索、追加、削除は[コマンドリファレンス](/ja/blog/zoxide-commands/)を参照してください。

## Ubuntu 24.04 の fzf は版に注意する

fzf は任意です。通常の z は fzf を使わず、zi だけが選択画面に fzf を使います。上流の README は fzf の最低サポート版を v0.51.0 としており、Ubuntu 24.04 の fzf は 0.44.1 なので、apt 版 fzf は公式サポート外です。

計測した内容：zoxide の対話検索を fzf のフィルターモードで実行しました。このモードは zoxide が渡すすべてのオプションを受け取りますが、ターミナルを必要としません。apt の fzf 0.44.1 はそれらを受け付け、zoxide 0.10.0 と apt の zoxide 0.9.3 のどちらでも該当ディレクトリを返しました。つまり apt の fzf で zi が必ず失敗するわけではありませんが、選択画面そのものは未検証で、サポート範囲外です。zi の動作がおかしい場合は、上流の Git 方式で現行の fzf を入れてください。--bin（バイナリだけを取得）で実行したところ 0.74.4 が入り、同様に動作しました。--bin なしではキーバインドや補完の設定も尋ねられます。

~~~bash
git clone --depth 1 https://github.com/junegunn/fzf.git ~/.fzf
~/.fzf/install
~~~

ターミナルがない環境では、zi は次のエラーで失敗します。スクリプトや非対話の SSH コマンドで zi を実行すると表示されるのがこれです。

~~~text
Failed to open /dev/tty
zoxide: fzf returned an error
~~~

## zoxide で Bash は遅くなる？

データベースに 2,000 個のディレクトリがある状態で、このマシンでは zoxide query 1 回が約 1 ms でした。対話型 Bash の起動時間は、初期化行なしで約 8 ms、ありで約 10 ms です。計測はミリ秒単位の粗いものですが、zoxide が Bash の起動を目立って遅くすることはありません。

## 症状ごとのトラブルシューティング

### zoxide: command not found

command -v zoxide を実行します。スクリプトで入れた場合は ~/.local/bin を確認し、再ログインするか export 行を追加します。Cargo の場合は ~/.cargo/bin を確認します。[command not found ガイド](/ja/blog/zoxide-command-not-found/)で原因を切り分けられ、[zoxide-doctor](/ja/tools/zoxide-doctor/) なら 1 コマンドで確認できます。

### z: command not found

バイナリは入っていますが、シェル関数が読み込まれていません。初期化行が ~/.bash_profile だけでなく ~/.bashrc にあることを確認し、新しいターミナルを開いてください。

### zoxide: no match found

データベースがまだそのディレクトリを学習していません。対話型シェルで一度移動するか、zoxide add でフルパスを追加し、zoxide query --list で確認します。

### zi で Failed to open /dev/tty と表示される

スクリプトなど、ターミナルのない環境で zi が起動されています。対話型ターミナルで実行してください。そこでも失敗する場合は、上記のとおり fzf --version を確認します。

### apt 版とユーザー版が両方見つかる

type -a zoxide を実行します。不要な方を、入れたときと同じ方法で削除し、新しいターミナルを開いてください。

## アンインストール

2 つのコピーを順に削除しました。sudo apt remove zoxide で /usr/bin/zoxide は消え、スクリプト版はそのまま残りました。続けて ~/.local/bin/zoxide を削除すると、type -a zoxide は not found になりました。どちらの場合もデータベースは ~/.local/share/zoxide/db.zo に残ります。完全に消したい場合はこのフォルダーも削除し、\~/.bashrc の初期化行も削除してください。

## 更新後の進み方

apt 版は通常の Ubuntu 更新で、スクリプト版はインストーラーの再実行で、Cargo 版は cargo install zoxide --locked の再実行で更新します。

インストールが動いたら、既存の履歴を移行する前に [zoxide と autojump の比較](/ja/blog/zoxide-vs-autojump/)を確認するか、[fzf 連携ガイド](/ja/tutorials/fzf-integration/)で選択画面を設定してください。

## 確認した資料

- [zoxide 公式のインストールとシェル設定](https://github.com/ajeetdsouza/zoxide#installation)
- [zoxide 公式インストーラーのソース](https://github.com/ajeetdsouza/zoxide/blob/main/install.sh)
- [zoxide 上流のリリース](https://github.com/ajeetdsouza/zoxide/releases)
- [Ubuntu 24.04 の zoxide パッケージ](https://packages.ubuntu.com/noble/zoxide)
- [Ubuntu 24.04 の fzf パッケージ](https://packages.ubuntu.com/noble/fzf)
- [fzf 上流のインストール手順](https://github.com/junegunn/fzf#installation)`,

  'install-macos': String.raw`# macOS に zoxide をインストールする方法（Homebrew + zsh で検証）

このガイドでは Homebrew で zoxide を macOS にインストールし、macOS の既定シェルである zsh に組み込んだうえで、Mac で失敗しやすいポイントを検証します。Apple Silicon での Homebrew の PATH、z コマンド、ディレクトリを記録するフックです。以下のコマンドと出力は README の転記ではなく、実際のテスト結果です。

## テスト環境

| 項目 | 値 |
| --- | --- |
| 検証日 | 2026 年 9 月 30 日 |
| マシン | GitHub Actions の macOS ランナー、Apple M1（仮想マシン）、3 コア |
| OS | macOS 26.6.2、arm64 |
| シェル | zsh 5.9（macOS 既定）。システム標準の bash 3.2.57 も確認 |
| Homebrew | 6.0.22、プレフィックス /opt/homebrew |
| zoxide | 0.10.0（Homebrew のビルド済みパッケージ） |
| fzf | 0.74.3（Homebrew） |

既存の設定が問題を隠さないよう、クリーンな仮想 Mac を使いました。お使いの Mac では時間が異なりますが、ここで説明する動作は同じです。

## ステップ 1：Homebrew でインストール

~~~bash
brew install zoxide
~~~

Homebrew では zoxide が stable 0.10.0 (bottled) と表示され、ビルド済みパッケージのためインストールは約 3 秒で終わりました。インストール先を確認します。

~~~bash
command -v zoxide
zoxide --version
~~~

Apple Silicon では /opt/homebrew/bin/zoxide と zoxide 0.10.0 が表示されました。Intel Mac の Homebrew は /usr/local/bin を使います。

### command not found: zoxide と表示される場合

Apple Silicon では /opt/homebrew/bin が既定の PATH に含まれていません。Homebrew のインストーラーは ~/.zprofile に brew shellenv の行を追加するよう案内しますが、この手順を飛ばすと Homebrew のツールがすべて見つからなくなります。システムの PATH だけで zsh を起動して再現しました。

~~~text
zsh:1: command not found: zoxide
~~~

同じテストで shellenv の行を追加すると解決しました。

~~~bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
~~~

その後、新しいターミナルウィンドウを開きます。brew 自体も見つからない場合は、これが原因です。

## ステップ 2：~/.zshrc に zoxide を追加

バイナリを入れただけでは z は作られません。~/.zshrc が空の状態で、対話型 zsh は次のように表示しました。

~~~text
zsh:1: command not found: z
~~~

~/.zshrc の最後に初期化行を追加します。

~~~bash
echo 'eval "$(zoxide init zsh)"' >> ~/.zshrc
~~~

新しいウィンドウで確認します。

~~~bash
type z zi
~~~

テストでは z と zi が ~/.zshrc 由来のシェル関数として表示されました。cd 自体を置き換えたい場合は zoxide init zsh --cmd cd を使います。テストでは cd と cdi が zoxide の関数として定義されました。

## ステップ 3：zsh で zoxide がディレクトリを覚える仕組み

zoxide init zsh が生成するスクリプトを読むと、zsh 版の zoxide は chpwd_functions にフックを追加しています。これはカレントディレクトリが変わるたびに zsh が実行する関数の一覧です。ここから生じる二つの影響を検証しました。

**zsh スクリプト内の cd も記録される。** 初期化行を実行してから 4 回ディレクトリを移動する非対話型の zsh スクリプトで、データベースは次のようになりました。

~~~text
   8.0 .../zo-demo/projects/web-app/src
   4.0 .../zo-demo/notes/2026
   4.0 .../zo-demo/projects/api-server
~~~

これは Windows の PowerShell とは異なります。PowerShell 版はプロンプト表示時に記録するため、スクリプト内の移動は記録されません。詳しくは [Windows ガイド](/ja/tutorials/install-windows/) を参照してください。

**初期化後に chpwd_functions を空にすると学習が止まり、zoxide が警告を出す。** 初期化行の後に chpwd_functions を空にする行を置きました。一部のプラグイン設定で起こりうる状態です。次に z を実行すると、zoxide は次のように表示しました。

~~~text
zoxide: detected a possible configuration issue.
Please ensure that zoxide is initialized right at the end of your shell configuration file (usually ~/.zshrc).
~~~

データベースは空のままでした。このメッセージが出たら、zoxide の初期化行をプラグインマネージャー、テーマ、その他のシェル設定より後に移してください。対照として、precmd_functions（プロンプトのフック一覧）を空にしても zsh では zoxide に影響せず、ディレクトリは記録されました。

## ステップ 4：ジャンプとマッチングの規則を試す

上の移動の後、z web は失敗しました。

~~~text
zoxide: no match found
~~~

先頭の候補は web-app/src でしたが、zoxide は最後のキーワードがパスの最後の要素に一致することを求めます。ここでの最後の要素は src です。次の書き方は成功しました。

~~~bash
z web src      # web はパスの前半、src は最後の要素に一致
z proj api     # api は最後の要素 api-server に一致
~~~

ジャンプに失敗したら zoxide query -ls を実行し、最後のキーワードが目的のフォルダー名に含まれているか確認してください。

## ステップ 5：zi には fzf が必要

クリーンなマシンでは、zi が次のエラーで失敗しました。

~~~text
zoxide: could not find fzf, is it installed?
~~~

~~~bash
brew install fzf
~~~

これで fzf 0.74.3 が入りました。zi の選択画面には本物の対話型ターミナルが必要なため、自動テストでは fzf のインストール確認までにとどめています。新しいウィンドウで zi を実行して確認してください。z は fzf を必要としません。選択画面の調整は [fzf 連携ガイド](/ja/tutorials/fzf-integration/) を参照してください。

## macOS の bash は？

macOS には今も bash 3.2.57 が /bin/bash として入っています。テストでは、このバージョンで eval "$(zoxide init bash)" がエラーなく読み込まれ、z 関数が定義されました。完全な対話型 bash セッションは実行していないため、普段 bash を使う場合は、何度かディレクトリを移動した後に zoxide query -ls で確認してください。現在の macOS の既定シェルは zsh なので、このガイドでは zsh を推奨します。

## zoxide で zsh は遅くなる？

データベースに 2,000 個のディレクトリ（db.zo は 149 KB）を入れて計測しました。

| 計測項目（中央値） | 時間 |
| --- | --- |
| zoxide query repo1500 src | 8.4 ms |
| zoxide --version（プロセス起動のみ） | 4.7 ms |
| zsh -i の起動、~/.zshrc が空 | 14.1 ms |
| zsh -i の起動、zoxide の初期化あり | 27.1 ms |

検索はプロセス起動そのものより数ミリ秒多いだけで、初期化行によるシェル起動の増加は約 13 ms でした。このテスト機では、zoxide はターミナルの遅さの主な原因ではありません。シェルの起動が遅い場合は、まず ~/.zshrc の他の設定を計測してください。

## macOS でのデータ保存場所

既定のデータベースは ~/Library/Application Support/zoxide/db.zo で、最初の zoxide add でここに作成されました。_ZO_DATA_DIR で場所を変更できます。db.zo を削除すると学習内容がリセットされますが、zoxide 本体は削除されません。

## アンインストール

~~~bash
brew uninstall zoxide
~~~

その後 ~/.zshrc の初期化行を削除してください。残っていると、新しいターミナルを開くたびに command not found: zoxide と表示されます。

## 次のステップ

- [コマンドリファレンス](/ja/blog/zoxide-commands/)：z、zi、z - と query のオプション
- [高度な設定](/ja/tutorials/advanced-config/)：_ZO_EXCLUDE_DIRS などの環境変数
- [zoxide-doctor](/ja/tools/zoxide-doctor/)：設定を自動でチェック`,
};

const chineseTutorialContent: Record<string, string> = {
  'install-windows': String.raw`# 在 Windows 上安装 zoxide（PowerShell 7 实测）

本文用 winget 在 Windows 上安装 zoxide，接入 PowerShell，然后逐一检查 Windows 上最容易出问题的三个环节：zoxide 程序是否在 PATH 里、z 命令是否存在、记录目录的 prompt 钩子是否在工作。下面所有命令和输出都来自一次真实测试，而不是照抄 README。

## 测试环境

| 项目 | 值 |
| --- | --- |
| 测试日期 | 2026 年 9 月 30 日 |
| 系统 | Windows 11 专业版 23H2（版本 22631） |
| Shell | PowerShell 7.6.6 |
| zoxide | 0.10.0，通过 winget 安装 |
| CPU | Intel Core i5-1135G7 笔记本 |

测试机的 Windows 显示语言是中文，所以 PowerShell 自身的报错是中文；zoxide 自己输出的信息始终是英文。

## 第 1 步：用 winget 安装

当前的 Windows 10 和 11 都自带 winget，不需要另装包管理器。

~~~powershell
winget install --id ajeetdsouza.zoxide -e
~~~

winget 会在 %LOCALAPPDATA%\Microsoft\WinGet\Links 放一个 zoxide.exe 链接，并把这个目录加入用户 PATH。已经打开的终端看不到新的 PATH，所以请新开一个 PowerShell 窗口再检查：

~~~powershell
zoxide --version
(Get-Command zoxide).Source
~~~

我们的输出是 zoxide 0.10.0 和 C:\Users\你的用户名\AppData\Local\Microsoft\WinGet\Links\zoxide.exe。如果只有旧窗口里 zoxide --version 失败，说明安装没问题，只是窗口没刷新。

### 其他安装方式

Scoop（scoop install zoxide）、Cargo（cargo install zoxide --locked）以及[官方 Releases 页面](https://github.com/ajeetdsouza/zoxide/releases)的 zip 包也都可以，但本文没有重新实测这几种方式。只选一种即可：PATH 里同时存在两份 zoxide，是“版本不对”问题的常见来源。Get-Command zoxide -All 可以列出 PowerShell 能找到的所有副本。

## 第 2 步：在 PowerShell 配置文件里初始化

安装程序本身不会创建 z 命令。刚装完时我们运行 z，得到的是 PowerShell 的标准报错：

~~~text
术语 'z' 不会被识别为 cmdlet、函数、脚本文件或可执行程序的名称。
~~~

解决办法是加上初始化命令。先打开配置文件：

~~~powershell
if (-not (Test-Path $PROFILE)) { New-Item -Path $PROFILE -ItemType File -Force }
notepad $PROFILE
~~~

把下面这行放在文件的最后一行：

~~~powershell
Invoke-Expression (& { (zoxide init powershell | Out-String) })
~~~

新开一个窗口确认：

~~~powershell
Get-Command z, zi
~~~

实测中 z 和 zi 都以别名（Alias）形式出现，指向 zoxide 的内部函数。如果想让 zoxide 直接替换 cd，改用 zoxide init powershell --cmd cd。

## 第 3 步：弄清 zoxide 在 PowerShell 里如何记录目录

这是多数教程没讲的部分。我们读了 zoxide init powershell 生成的脚本：在 PowerShell 里，zoxide 是在 prompt 函数（每次显示命令提示符时运行的函数）里记录当前目录的。也就是说，只有你进入某个目录、并且提示符重新显示之后，这个目录才会被记住。

我们实测了由此带来的两个后果。

**别的提示符工具可能悄悄让记录失效。** 当某个提示符主题在 zoxide 初始化之后重新定义了 prompt 函数，我们切换目录并重新显示提示符，数据库仍然是空的，zoxide query -ls 什么都不输出。如果你用 oh-my-posh、Starship 或自定义 prompt，请把 zoxide 的初始化行放在它们后面，也就是配置文件的最末尾。

**脚本里的 cd 不会被记录。** 脚本在命令之间不会显示提示符，所以脚本里切换目录不会让 zoxide 学到任何东西。在脚本或计划任务里，请显式添加路径：

~~~powershell
zoxide add "D:\work\api-server"
~~~

## 第 4 步：测试跳转

在交互窗口里用 cd 进入几个目录（每次回车），然后查看 zoxide 学到了什么：

~~~powershell
zoxide query -ls
~~~

我们访问 web-app\src 两次、另外两个目录各一次后的输出：

~~~text
   8.0 C:\...\zo-demo\projects\web-app\src
   4.0 C:\...\zo-demo\notes\2026
   4.0 C:\...\zo-demo\projects\api-server
~~~

最近访问的目录得分会被加权，所以一小时内用过两次的目录已经排在第一。

有一条匹配规则让我们意外：web-app\src 明明排第一，z web 却返回 “zoxide: no match found”。原因是 zoxide 要求最后一个关键词必须匹配路径的最后一段，而这里最后一段是 src。下面两种写法都能成功：

~~~powershell
z web src      # web 匹配路径前面的部分，src 匹配最后一段
z proj api     # api 匹配最后一段 api-server
~~~

跳转失败时，先运行 zoxide query -ls，看看最后一个关键词是否出现在目标文件夹名里。

## 第 5 步：zi 需要 fzf

在干净的测试机上，zi（交互式选择）报错：

~~~text
zoxide: could not find fzf, is it installed?
~~~

安装 fzf，新开窗口后 zi 就能用了：

~~~powershell
winget install --id junegunn.fzf -e
~~~

z 本身不依赖 fzf。选择器的调优见 [fzf 集成教程](/zh/tutorials/fzf-integration/)。

## zoxide 会拖慢 PowerShell 吗？

我们在数据库里放了 2,000 个目录（db.zo 文件 167 KB）后测量：

| 测量项（中位数） | 耗时 |
| --- | --- |
| zoxide query repo1500 src | 16.3 ms |
| zoxide --version（仅启动进程） | 11.8 ms |
| Set-Location 到完整路径 | 3.7 ms |
| 在已打开的会话里重新执行初始化行 | 13.3 ms |

一次查询只比“启动进程本身”多 4–5 ms，在这个规模下数据库大小几乎没有影响。新开 pwsh -NoProfile 的时间，加上初始化行后从 249 ms 变成 546 ms。其中约 190 ms 来自 PowerShell 加载自带的 Microsoft.PowerShell.Utility 模块（初始化脚本会调用它）。大多数实际使用的配置文件本来就会加载这个模块，所以对普通用户来说，这台笔记本上的额外启动开销更接近 110 ms。

## zoxide 在 Windows 上把数据存在哪里

默认数据库位置是 %LOCALAPPDATA%\zoxide\db.zo。设置环境变量 _ZO_DATA_DIR 可以换位置，例如在多台电脑之间同步。删除 db.zo 会清空 zoxide 学到的记录，但不会卸载 zoxide。

## 卸载

~~~powershell
winget uninstall --id ajeetdsouza.zoxide -e
~~~

同时要删掉 $PROFILE 里的初始化行，否则每个新窗口都会报找不到 zoxide。

## 下一步

- [命令参考](/zh/blog/zoxide-commands/)：z、zi、z - 与 query 参数
- [高级配置](/zh/tutorials/advanced-config/)：_ZO_EXCLUDE_DIRS 等环境变量
- [zoxide-doctor](/zh/tools/zoxide-doctor/)：自动检查你的配置`,
  'install-ubuntu': String.raw`# 在 Ubuntu 24.04 安装 zoxide（干净容器实测）

本文用 apt 或官方安装脚本在 Ubuntu 24.04 上安装 zoxide，接入 Bash，然后逐一检查 Ubuntu 上最容易出问题的地方：apt 版本偏旧、~/.local/bin 与 PATH、同时装了两份 zoxide、Shell 钩子，以及 fzf。下面所有输出都来自一台全新 Ubuntu 24.04 系统上的真实运行。

## 测试环境

| 项目 | 值 |
| --- | --- |
| 测试日期 | 2026 年 10 月 8 日 |
| 系统 | GitHub Actions 运行器上的官方 ubuntu:24.04 容器（Ubuntu 24.04.5 LTS，x86_64） |
| CPU | AMD EPYC 7763，4 核 |
| Shell | GNU bash 5.2.21 |
| apt 软件包 | zoxide 0.9.3-1，fzf 0.44.1-1ubuntu0.3 |
| 上游版本 | 官方脚本安装的 zoxide 0.10.0；fzf Git 安装方式得到的 fzf 0.74.4 |

容器里的 apt 命令以 root 身份运行，所以下文中的 sudo 在那里并不需要；官方脚本以名为 dev 的普通用户运行。容器没有桌面和终端窗口，因此无法打开 zi 的交互选择界面，fzf 一节会写明哪些测了、哪些没测。

## 先选安装方式

| 方式 | Ubuntu 24.04 上的版本 | 适合 | 代价 |
| --- | --- | --- | --- |
| Ubuntu apt | 0.9.3 | 通过 apt 统一更新的工作站和服务器 | 比上游落后一个小版本 |
| 官方安装脚本 | 0.10.0（当前版本） | 个人 Linux 或 WSL 账户 | 需要自己更新 |
| Cargo | 当前版本 | 已经维护 Rust 工具链的机器 | 编译时间长；本页未重新实测 |

[zoxide 官方安装说明](https://github.com/ajeetdsouza/zoxide#installation)推荐 Linux 和 WSL 使用安装脚本。apt 依然可以用，只是要清楚它装的是 0.9.3。

## 开始前的检查

动手之前，先确认系统和当前使用的 Shell：

~~~bash
lsb_release -ds
ps -p $$ -o comm=
~~~

默认安装的 Ubuntu 第二条命令会输出 bash。如果输出 zsh 或 fish，请看下文对应的小节。WSL 用户在 Ubuntu Shell 里运行同样的命令即可。

## 方式一　使用 apt 安装

安装前先问 apt 会装哪个版本：

~~~bash
sudo apt update
apt-cache policy zoxide
~~~

在我们的全新系统上：

~~~text
zoxide:
  Installed: (none)
  Candidate: 0.9.3-1
  Version table:
     0.9.3-1 500
        500 http://archive.ubuntu.com/ubuntu noble/universe amd64 Packages
~~~

这个包来自 universe 组件，官方镜像里默认已启用。安装并检查程序：

~~~bash
sudo apt install zoxide
command -v zoxide
zoxide --version
~~~

安装用时约 2 秒，输出 /usr/bin/zoxide 和 zoxide 0.9.3。如果 apt 提示 Unable to locate package 或 Candidate: (none)，说明你的机器没有启用 universe，可以运行 sudo add-apt-repository universe 再执行 sudo apt update。我们的测试不需要这一步，所以这一步未经实测。

## 方式二　安装当前上游版本

以普通用户身份运行官方安装脚本，不要加 sudo：

~~~bash
curl -sSfL https://raw.githubusercontent.com/ajeetdsouza/zoxide/main/install.sh | sh
~~~

它把 zoxide 0.10.0 装进 ~/.local/bin，最后输出这条提示：

~~~text
zoxide is installed!
Note: /home/dev/.local/bin is not on your $PATH. zoxide will not work unless it is added to $PATH.
~~~

这条提示对当前 Shell 来说是对的，但在 Ubuntu 上并不是全部。Ubuntu 默认的 ~/.profile 会在 ~/.local/bin 存在时把它加进 PATH，而这个文件在登录时执行。实测中，安装后新开的登录 Shell 里，/home/dev/.local/bin 已经排在 PATH 最前面。对桌面用户来说，就是注销再重新登录一次。如果不想等，可以自己把目录加进 ~/.bashrc：

~~~bash
export PATH="$HOME/.local/bin:$PATH"
~~~

如果想先看脚本内容再运行，可以先下载：

~~~bash
curl -sSfL https://raw.githubusercontent.com/ajeetdsouza/zoxide/main/install.sh -o /tmp/zoxide-install.sh
less /tmp/zoxide-install.sh
sh /tmp/zoxide-install.sh
~~~

### 两种方式都装了怎么办

我们在同一台机器上同时装了 apt 版和脚本版。type -a 会按 PATH 顺序列出所有副本：

~~~text
zoxide is /home/dev/.local/bin/zoxide
zoxide is /usr/bin/zoxide
zoxide is /bin/zoxide
~~~

排在第一个的生效，所以 zoxide --version 输出的是 0.10.0。/bin/zoxide 并不是第三份安装：Ubuntu 上 /bin 指向 /usr/bin，apt 版只是出现了两次。建议只保留一种方式，删掉另一种，否则更新时容易混乱。

## 方式三　已有 Rust 时使用 Cargo

只有机器上本来就在维护 Rust 工具链时，用 Cargo 才划算；安装脚本已经提供预编译程序，没必要为了 zoxide 专门装 Rust。本页没有重新实测这种方式。

~~~bash
cargo install zoxide --locked
export PATH="$HOME/.cargo/bin:$PATH"
zoxide --version
~~~

## 初始化当前 Shell

安装程序本身不会创建 z 命令。加初始化行之前，交互式 Bash 输出：

~~~text
bash: type: z: not found
~~~

### Ubuntu 默认 Bash

把这一行加到 ~/.bashrc 末尾，然后新开一个终端：

~~~bash
eval "$(zoxide init bash)"
~~~

~~~bash
type z
~~~

加上之后，输出的第一行是 z is a function。

### Zsh

把下面这行加到 ~/.zshrc 末尾，然后新开终端。zsh 我们是在 macOS 上实测的，zsh 特有的行为见 [macOS 教程](/zh/tutorials/install-macos/)。

~~~bash
eval "$(zoxide init zsh)"
~~~

### Fish

把这一行加进 ~/.config/fish/config.fish，然后新开一个 Fish 会话。

~~~fish
zoxide init fish | source
~~~

## Bash 如何记录目录

我们读了 zoxide init bash 生成的代码：它把一个叫 __zoxide_hook 的函数加进 PROMPT_COMMAND，Bash 每次显示提示符时都会运行它。也就是说，只有在某个目录下显示过提示符，这个目录才会被记录。

我们实测了由此带来的后果：一条非交互的 bash -c 命令进入 ~/work/api-server 再返回，什么都没记录，zoxide query api 返回 zoxide: no match found。在同一条命令里手动运行一次提示符钩子后，目录就被记录了。所以脚本、cron 任务和 CI 步骤里的 cd 不会让 zoxide 学到任何东西，这些场景请用 zoxide add。这和 [Windows 上的 PowerShell](/zh/tutorials/install-windows/) 一致，而 zsh 则会在每次切换目录时记录。

## 完成一次端到端验证

在刚配置好的交互式 Shell 里运行：

~~~bash
mkdir -p "$HOME/projects/zoxide-demo"
zoxide add "$HOME/projects/zoxide-demo"
cd "$HOME"
z zoxide-demo
pwd
zoxide query zoxide-demo
zoxide query --list
~~~

我们这次运行的三行输出都是 /home/dev/projects/zoxide-demo：pwd 确认跳转成功，两条 query 确认目录已在数据库里。之后正常访问真实项目即可；查询、添加和删除记录见[命令参考](/zh/blog/zoxide-commands/)。

## Ubuntu 24.04 的 fzf 版本问题

fzf 是可选的。普通的 z 完全不用它，zi 才会用 fzf 显示选择界面。上游 README 写明最低支持的 fzf 版本是 v0.51.0，而 Ubuntu 24.04 提供的是 0.44.1，所以 apt 版 fzf 不在官方支持范围内。

我们实测了什么：让 zoxide 的交互查询以 fzf 的过滤模式运行，这种模式会接收 zoxide 传入的全部参数，但不需要终端。apt 的 fzf 0.44.1 接受了这些参数，并且无论搭配 zoxide 0.10.0 还是 apt 的 zoxide 0.9.3，都返回了匹配的目录。所以 apt 的 fzf 并不一定会让 zi 失败，但选择界面本身没有测到，而且它在官方支持范围之外。如果 zi 表现异常，请用上游的 Git 方式安装当前版本的 fzf。我们用 --bin 参数运行（只下载程序文件），得到 0.74.4，表现相同；不加 --bin 时，安装程序还会询问是否配置快捷键和补全：

~~~bash
git clone --depth 1 https://github.com/junegunn/fzf.git ~/.fzf
~/.fzf/install
~~~

没有终端时，zi 会报下面这个错误。在脚本或非交互的 SSH 命令里运行 zi，看到的就是它：

~~~text
Failed to open /dev/tty
zoxide: fzf returned an error
~~~

## zoxide 会拖慢 Bash 吗？

数据库里有 2,000 个目录时，这台机器上一次 zoxide query 约 1 ms。交互式 Bash 的启动时间，不加初始化行约 8 ms，加上后约 10 ms。这个测量比较粗（精度为毫秒），但 zoxide 不会明显拖慢 Bash 启动。

## 按症状排查

### 出现 zoxide command not found

运行 command -v zoxide。脚本安装的话检查 ~/.local/bin，然后重新登录或加上 export 那一行；Cargo 安装的话检查 ~/.cargo/bin。[command not found 排查指南](/zh/blog/zoxide-command-not-found/)会逐步区分这些情况，[zoxide-doctor](/zh/tools/zoxide-doctor/) 可以一条命令检查完。

### 出现 z command not found

程序装好了，但 Shell 函数没有加载。确认初始化行在 ~/.bashrc 里，而不只是在 ~/.bash_profile 里，然后新开终端。

### 出现 zoxide no match found

数据库还没学到这个目录。在交互式 Shell 里访问一次，或者用 zoxide add 加上完整路径，再用 zoxide query --list 确认。

### zi 提示 Failed to open /dev/tty

zi 是在没有终端的环境里启动的，比如在脚本中。请在交互式终端里运行。如果在终端里也失败，按上文检查 fzf --version。

### apt 版本和个人版本同时出现

运行 type -a zoxide。用当初安装的方式删掉不需要的那一份，然后新开终端。

## 卸载

我们依次删掉了两份。sudo apt remove zoxide 删除了 /usr/bin/zoxide，脚本版保持不变；再删除 ~/.local/bin/zoxide 后，type -a zoxide 显示找不到。两种情况下数据库都还留在 ~/.local/share/zoxide/db.zo；想彻底清理就把这个目录也删掉，并删除 ~/.bashrc 里的初始化行。

## 后续更新与阅读

apt 安装的随 Ubuntu 正常更新；脚本安装的重新运行一次安装脚本即可获取当前版本；Cargo 安装的重新运行 cargo install zoxide --locked。

安装正常后，迁移已有记录前可以先看 [zoxide 与 autojump 的对比](/zh/blog/zoxide-vs-autojump/)，或者按 [fzf 集成教程](/zh/tutorials/fzf-integration/)配置选择界面。

## 核对资料

- [zoxide 官方安装与 Shell 配置说明](https://github.com/ajeetdsouza/zoxide#installation)
- [zoxide 官方安装脚本源码](https://github.com/ajeetdsouza/zoxide/blob/main/install.sh)
- [zoxide 上游发布页](https://github.com/ajeetdsouza/zoxide/releases)
- [Ubuntu 24.04 zoxide 软件包](https://packages.ubuntu.com/noble/zoxide)
- [Ubuntu 24.04 fzf 软件包](https://packages.ubuntu.com/noble/fzf)
- [fzf 上游安装说明](https://github.com/junegunn/fzf#installation)`,

  'install-macos': String.raw`# 在 macOS 上安装 zoxide（Homebrew + zsh 实测）

本文用 Homebrew 在 macOS 上安装 zoxide，接入 zsh（macOS 默认 Shell），然后逐一测试 Mac 上最容易出问题的地方：Apple Silicon 上 Homebrew 的 PATH、z 命令是否存在、记录目录的钩子是否在工作。下面的命令和输出都来自一次真实测试，而不是照抄 README。

## 测试环境

| 项目 | 值 |
| --- | --- |
| 测试日期 | 2026 年 9 月 30 日 |
| 机器 | GitHub Actions macOS 运行器，Apple M1（虚拟机），3 核 |
| 系统 | macOS 26.6.2，arm64 |
| Shell | zsh 5.9（macOS 默认）；另外检查了系统自带的 bash 3.2.57 |
| Homebrew | 6.0.22，安装前缀 /opt/homebrew |
| zoxide | 0.10.0（Homebrew 预编译包） |
| fzf | 0.74.3（Homebrew） |

我们用的是一台干净的虚拟 Mac，避免已有配置掩盖问题。你自己电脑上的耗时会不同，但本文描述的行为是一样的。

## 第 1 步：用 Homebrew 安装

~~~bash
brew install zoxide
~~~

Homebrew 显示 zoxide 为 stable 0.10.0 (bottled)，因为使用了预编译包，安装约 3 秒完成。检查安装位置：

~~~bash
command -v zoxide
zoxide --version
~~~

在 Apple Silicon 上我们的输出是 /opt/homebrew/bin/zoxide 和 zoxide 0.10.0。Intel 芯片的 Mac 上，Homebrew 使用的是 /usr/local/bin。

### 如果提示 command not found: zoxide

Apple Silicon 上 /opt/homebrew/bin 默认不在 PATH 里。Homebrew 安装程序会提示你往 ~/.zprofile 加一行 brew shellenv，如果跳过了这一步，所有 Homebrew 装的工具都会找不到。我们用只含系统 PATH 的 zsh 复现了这个问题：

~~~text
zsh:1: command not found: zoxide
~~~

在同一测试里加上 shellenv 这一行就解决了：

~~~bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
~~~

之后新开一个终端窗口。如果连 brew 本身也提示找不到，原因就是这个。

## 第 2 步：把 zoxide 加进 ~/.zshrc

安装程序本身不会创建 z 命令。在 ~/.zshrc 为空时，交互式 zsh 输出：

~~~text
zsh:1: command not found: z
~~~

把初始化命令加到 ~/.zshrc 的末尾：

~~~bash
echo 'eval "$(zoxide init zsh)"' >> ~/.zshrc
~~~

新开窗口后检查：

~~~bash
type z zi
~~~

我们的输出显示 z 和 zi 都是来自 ~/.zshrc 的 shell 函数。如果想让 zoxide 直接替换 cd，改用 zoxide init zsh --cmd cd；实测中它会把 cd 和 cdi 定义为 zoxide 的函数。

## 第 3 步：zoxide 在 zsh 里如何记录目录

我们读了 zoxide init zsh 生成的脚本：在 zsh 里，zoxide 把钩子加进 chpwd_functions，这是 zsh 在每次切换目录时都会运行的函数列表。由此带来两个实际影响，我们都做了测试。

**zsh 脚本里的 cd 也会被记录。** 一个非交互式 zsh 脚本执行初始化命令后切换了四次目录，数据库变成：

~~~text
   8.0 .../zo-demo/projects/web-app/src
   4.0 .../zo-demo/notes/2026
   4.0 .../zo-demo/projects/api-server
~~~

这和 Windows 上的 PowerShell 不同：PowerShell 版是在显示提示符时记录的，脚本里的切换不会被记住。那种情况见我们的 [Windows 教程](/zh/tutorials/install-windows/)。

**如果之后有东西清空了 chpwd_functions，记录就会失效，而且 zoxide 会提醒你。** 我们在初始化命令之后加了一行清空 chpwd_functions 的代码，这是某些插件配置会产生的情况。下一次运行 z 时，zoxide 输出：

~~~text
zoxide: detected a possible configuration issue.
Please ensure that zoxide is initialized right at the end of your shell configuration file (usually ~/.zshrc).
~~~

数据库始终是空的。看到这条提示时，请把 zoxide 的初始化行移到插件管理器、主题和其他 Shell 配置的后面。作为对照，清空 precmd_functions（提示符钩子列表）在 zsh 里不影响 zoxide，目录照常被记录。

## 第 4 步：测试跳转与匹配规则

完成上面的访问后，z web 失败了：

~~~text
zoxide: no match found
~~~

排第一的明明是 web-app/src，但 zoxide 要求最后一个关键词必须匹配路径的最后一段，而这里最后一段是 src。下面两种写法都成功了：

~~~bash
z web src      # web 匹配路径前面的部分，src 匹配最后一段
z proj api     # api 匹配最后一段 api-server
~~~

跳转失败时，先运行 zoxide query -ls，看看最后一个关键词是否出现在目标文件夹名里。

## 第 5 步：zi 需要 fzf

在干净的机器上，zi 报错：

~~~text
zoxide: could not find fzf, is it installed?
~~~

~~~bash
brew install fzf
~~~

这样装上了 fzf 0.74.3。zi 的选择界面需要真实的交互终端，所以自动化测试只确认到 fzf 安装成功；请新开窗口运行 zi 查看效果。z 本身从不依赖 fzf。选择器的调优见 [fzf 集成教程](/zh/tutorials/fzf-integration/)。

## macOS 上的 bash 呢？

macOS 仍然自带 bash 3.2.57（/bin/bash）。实测中 eval "$(zoxide init bash)" 在这个版本下加载没有报错，并定义了 z 函数。我们没有跑完整的交互式 bash 会话，所以如果你日常用 bash，请在切换几个目录后用 zoxide query -ls 确认一下。由于当前 macOS 默认 Shell 是 zsh，本文推荐走 zsh 这条路。

## zoxide 会拖慢 zsh 吗？

我们在数据库里放了 2,000 个目录（db.zo 为 149 KB）后测量：

| 测量项（中位数） | 耗时 |
| --- | --- |
| zoxide query repo1500 src | 8.4 ms |
| zoxide --version（仅启动进程） | 4.7 ms |
| zsh -i 启动，~/.zshrc 为空 | 14.1 ms |
| zsh -i 启动，加入 zoxide 初始化 | 27.1 ms |

一次查询只比启动进程本身多几毫秒，初始化命令让 Shell 启动多了约 13 ms。在这台测试机上，zoxide 不是终端卡顿的明显来源。如果你的 Shell 启动很慢，先测量 ~/.zshrc 里的其他配置。

## zoxide 在 macOS 上把数据存在哪里

默认数据库位置是 ~/Library/Application Support/zoxide/db.zo，我们第一次执行 zoxide add 时就在这里创建了它。设置 _ZO_DATA_DIR 可以换位置。删除 db.zo 会清空学习记录，但不会卸载 zoxide。

## 卸载

~~~bash
brew uninstall zoxide
~~~

然后删掉 ~/.zshrc 里的初始化行，否则每个新终端都会提示 command not found: zoxide。

## 下一步

- [命令参考](/zh/blog/zoxide-commands/)：z、zi、z - 与 query 参数
- [高级配置](/zh/tutorials/advanced-config/)：_ZO_EXCLUDE_DIRS 等环境变量
- [zoxide-doctor](/zh/tools/zoxide-doctor/)：自动检查你的配置`,
};

const localizedTutorialContent: Record<string, Record<string, string>> = {
  en: englishTutorialContent,
  ja: japaneseTutorialContent,
  zh: chineseTutorialContent,
};

export function getTutorialContentOverride(locale: string, slug: string): string | undefined {
  return localizedTutorialContent[locale]?.[slug];
}
