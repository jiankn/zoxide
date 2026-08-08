---
title: "Zoxide Setup That Actually Works: Install, Initialize, and Verify"
published: false
description: "A practical zoxide setup guide for Bash, Zsh, Fish, PowerShell, and Nushell, with verification and troubleshooting commands."
tags: linux, cli, productivity, opensource
---

Installing zoxide is easy. Getting from “the binary exists” to “the `z` command works every time I open a terminal” is where people tend to lose ten minutes.

The reason is simple: zoxide has two layers. The executable stores and queries directory history; a small piece of shell code defines `z`, `zi`, and the hook that records where you go. A package manager installs the first layer. `zoxide init` supplies the second.

If the tool is new to you, this short explanation of [what zoxide is](https://zoxide.org/blog/what-is-zoxide-smarter-cd/) covers the mental model. The rest of this post is the setup I use to get a clean, testable installation.

> Disclosure: I maintain zoxide.org as an independent guide site. It is not the official zoxide project. Commands in this post were checked against the [official zoxide repository](https://github.com/ajeetdsouza/zoxide).

## 1. Install the binary

Pick one method for your platform. Do not install the same executable with three package managers; that makes later upgrades and PATH debugging needlessly confusing.

Linux and WSL:

```bash
curl -sSfL https://raw.githubusercontent.com/ajeetdsouza/zoxide/main/install.sh | sh
```

macOS with Homebrew:

```bash
brew install zoxide
```

Windows with WinGet:

```powershell
winget install ajeetdsouza.zoxide
```

Any platform with a working Rust toolchain:

```bash
cargo install zoxide --locked
```

There are more distribution-specific options in this [install zoxide](https://zoxide.org/download/) guide. Whichever route you choose, verify the executable before touching your shell config:

```bash
zoxide --version
```

If that command fails, stop here. This is an installation or PATH problem, not a shell-initialization problem.

## 2. Initialize the shell

Add exactly one matching line near the end of your shell configuration.

Bash (`~/.bashrc`):

```bash
eval "$(zoxide init bash)"
```

Zsh (`~/.zshrc`):

```bash
eval "$(zoxide init zsh)"
```

Fish (`~/.config/fish/config.fish`):

```fish
zoxide init fish | source
```

PowerShell (`$PROFILE`):

```powershell
Invoke-Expression (& { (zoxide init powershell | Out-String) })
```

Nushell uses two files. Generate the integration from the environment file:

```nu
zoxide init nushell | save -f ~/.zoxide.nu
```

Then load it from the config file:

```nu
source ~/.zoxide.nu
```

Restart the terminal after saving the file. Sourcing the file works too, but a fresh process is a better test: it proves the setup survives a normal shell launch.

## 3. Verify all three layers

A reliable diagnosis checks the executable, generated shell function, and database separately.

### Check the executable

```bash
command -v zoxide
zoxide --version
```

PowerShell equivalent:

```powershell
Get-Command zoxide
zoxide --version
```

### Check the generated command

For Bash and Zsh:

```bash
type z
type zi
```

For Fish:

```fish
type -a z
type -a zi
```

You should see a function rather than a second unrelated executable.

### Check the database

Visit a few directories normally, then inspect what zoxide knows:

```bash
zoxide query --list --score
```

If the list stays empty after normal navigation, the hook is not loading. Look for an early `return` in the shell config, competing `cd` wrappers, or an init line placed before a framework that overwrites it.

## 4. Use the small command set that matters

You do not need to memorize much:

```bash
z project            # Jump to the best match
z client api         # Match multiple keywords
z -                  # Return to the previous directory
zi project           # Choose interactively with fzf
```

The underlying database commands are useful when a match looks wrong:

```bash
zoxide query --list --score project
zoxide add ~/src/important-project
zoxide remove ~/src/old-project
```

The extended [zoxide commands reference](https://zoxide.org/blog/zoxide-commands/) covers import, query flags, environment variables, and database maintenance. For daily use, the six commands above are usually enough.

## 5. Fix the common failure modes

### `zoxide` works, but `z` is not found

The binary is installed; the shell integration is missing or loaded from the wrong file. Confirm which shell is actually running:

```bash
ps -p $$ -o comm=
```

Then put the matching init line in the startup file that interactive sessions read.

### `zi` says it cannot find fzf

`zi` uses fzf for interactive selection. Install fzf, verify it is on PATH, and restart the shell:

```bash
fzf --version
```

Plain `z keyword` works without the interactive picker.

### A keyword opens the wrong directory

Inspect the candidates before changing anything:

```bash
zoxide query --list --score keyword
```

Zoxide ranks by frequency and recency. Visiting the intended directory, or explicitly adding it, raises its score. Remove a stale entry only when you are sure it is no longer useful.

### Aliasing `cd` causes recursion or odd behavior

Do not write `alias cd=z`. Let zoxide generate a safe replacement:

```bash
eval "$(zoxide init zsh --cmd cd)"
```

Use the equivalent command for your shell. If the behavior is still strange, return to the default `z` command first and rule out other `cd` wrappers.

## A clean setup is observable

The most useful habit is to test one layer at a time:

1. `zoxide --version` proves installation and PATH.
2. `type z` proves shell initialization.
3. `zoxide query --list --score` proves the hook is recording directories.

Once those three checks pass, zoxide stops feeling magical and becomes a small, predictable terminal tool—which is exactly what a navigation utility should be.
