---
title: "When zoxide Works but z Does Not"
published: false
description: "A shell startup-file checklist for the case where zoxide is installed but the z command is missing."
tags: linux, shell, cli, productivity
---

There is a particular kind of terminal problem that invites the wrong fix. `zoxide --version` prints a version. Then `z work` returns `command not found`. Reinstalling the package changes nothing.

The executable is present. The shell integration did not make it into the interactive session that is open in front of you.

`zoxide init` prints shell code. Loading that code gives the shell its `z` command and arranges for normal directory changes to be recorded. That distinction makes the failure much easier to narrow down.

That split also explains why [zoxide](https://zoxide.org/) can be installed successfully while `z` is still unavailable in a new terminal.

This checklist assumes that zoxide itself is already on `PATH`. If it is not, start with the package installation. The platform-specific [install zoxide](https://zoxide.org/download/) page is the place to choose a single installation method before debugging startup files.

> Disclosure: I maintain zoxide.org as an independent guide site. It is not the official zoxide project. The commands below were checked against the [official zoxide documentation](https://github.com/ajeetdsouza/zoxide).

## Prove which part is missing

Run these in the terminal where `z` fails.

```bash
command -v zoxide
zoxide --version
type z
```

The first two commands should find and run the executable. The last command should report a shell function after initialization. When it says that `z` is unknown, focus on the shell configuration rather than the installed binary.

PowerShell has its own useful equivalent.

```powershell
Get-Command zoxide
zoxide --version
Get-Command z
```

`Get-Command zoxide` and `Get-Command z` answer different questions. The former locates the executable. The latter checks whether the profile created the command you type every day.

## Find the shell that actually started

On Linux and macOS, this is a quick first check.

```bash
ps -p $$ -o comm=
```

The result tells you what process owns the prompt. A terminal configured to launch Zsh will not read a Bash configuration file, even if both files happen to exist in the home directory.

The target files for the common shells are these.

| Shell | Startup file used for the usual interactive setup | Integration line |
| --- | --- | --- |
| Bash | `~/.bashrc` | `eval "$(zoxide init bash)"` |
| Zsh | `~/.zshrc` | `eval "$(zoxide init zsh)"` |
| Fish | `~/.config/fish/config.fish` | `zoxide init fish \| source` |
| PowerShell | `$PROFILE` | `Invoke-Expression (& { (zoxide init powershell \| Out-String) })` |

Add one matching line near the end of the file. Open a fresh terminal afterwards. A new session is a more useful test than pasting the line into the current prompt because it exercises the actual startup path.

If you use a shell framework, its loading order matters. Put the zoxide line after the part that defines or replaces directory-changing helpers. A later definition of `z` can overwrite the function that zoxide generated.

## Check for a startup file that exits early

Configuration files often contain conditions that make sense on their own. A guard for non-interactive shells, an early `return`, or a plugin manager can stop later lines from running.

There is a simple way to test the generated code without editing anything permanently.

```bash
eval "$(zoxide init bash)"
type z
```

Replace `bash` with the shell you are currently using. If `type z` now reports a function, the generated integration is fine. The remaining problem is the file, the load order, or the kind of shell your terminal launches.

For Fish, use this temporary check.

```fish
zoxide init fish | source
type -a z
```

For PowerShell, use the same expression that belongs in the profile, then inspect the command.

```powershell
Invoke-Expression (& { (zoxide init powershell | Out-String) })
Get-Command z
```

Do not leave a copy-pasted alias such as `alias z='zoxide query'` as a workaround. The generated integration contains the directory-changing behavior that a plain query command cannot provide.

## Separate a missing command from an empty database

Once `z` exists, a second symptom can still be confusing. `z project` may report no match on a new machine. That result means the command loaded, but zoxide has little or no directory history to search.

Visit a couple of directories with normal `cd` commands, then inspect the data.

```bash
zoxide query --list --score
```

If the list stays empty after opening directories in a fresh session, the hook is not being run. Return to the startup-file check and look for another `cd` wrapper. If entries appear, try a query that matches one of their path components.

```bash
z src
zoxide query --list --score src
```

The first form asks zoxide to change directory through the shell integration. The second exposes the candidates so you can see why a particular path did or did not match.

## A short repair order

When the terminal setup has accumulated several package managers, frameworks, and old aliases, change one thing at a time.

1. Confirm that `zoxide --version` works.
2. Confirm which shell owns the prompt.
3. Keep one matching `zoxide init` line in that shell's interactive startup file.
4. Open a new terminal and run `type z` or `Get-Command z`.
5. Visit a directory and use `zoxide query --list --score` before judging search results.

That sequence prevents a database question from being mistaken for an installation question. Once the function is present and the directory list begins to fill, the rest of zoxide behaves like a small shell tool again.

More background and related terminal guides are collected at [zoxide.org](https://zoxide.org/).
