---
title: "How to install zoxide on Mac and enable shell integration + tab completion"
description: "Step-by-step guide to installing zoxide on macOS, configuring zoxide init for popular shells, and making tab completion work smoothly."
keywords: ["how to install zoxide in Mac", "zoxide init", "what shell does zoxide work with", "does zoxide have tab completion"]
slug: "install-zoxide-mac-shell-integration-completion"
---

# How to install zoxide on Mac (and make it actually work)

People search **“how to install zoxide in Mac”** and often hit the same snag: they install the binary, type `z`, and nothing works. That’s because zoxide isn’t a standalone “command you run once.” To behave like a smarter `cd`, it must be integrated into your shell startup so it can define `z`, install hooks, and enable completions.

This post is the Mac-focused setup guide: installation options, the correct `zoxide init` line for each shell, common plugin-order pitfalls, and what to expect from tab completion.

---

## Install zoxide on macOS

### Option 1: Homebrew (most common)

```bash
brew install zoxide
```

Homebrew also makes it easy to upgrade later.

### Option 2: Cargo (for the latest build)

If you use Rust tooling:

```bash
cargo install zoxide --locked
```

### Option 3: Other package managers

macOS users sometimes prefer MacPorts or Nix. The official GitHub repo lists many options.

After installing, verify:

```bash
zoxide --version
which zoxide
```

If `which zoxide` returns nothing, fix your PATH before moving on.

---

## What shell does zoxide work with? (Mac edition)

On macOS, the most common shells are:

- **Zsh** (default on modern macOS)
- **Bash** (still used by some power users)
- **Fish** (popular for interactive UX)

zoxide supports all major shells; you just need the right init snippet.

---

## Enable shell integration (the required step)

Remember: `zoxide init <shell>` prints a block of shell script. You must evaluate it at startup so it runs every time your terminal opens.

### Zsh (default on macOS)

Add to `~/.zshrc`:

```zsh
eval "$(zoxide init zsh)"
```

Then reload:

```zsh
source ~/.zshrc
```

**Plugin order tip:** If you use a plugin manager (oh-my-zsh, zinit, etc.), put the init line after plugin loading so it doesn’t get overridden by custom `z` functions or completion systems.

### Bash

Add to `~/.bashrc` (or `~/.bash_profile` for some login setups):

```bash
eval "$(zoxide init bash)"
```

Reload:

```bash
source ~/.bashrc
```

### Fish

Add to `~/.config/fish/config.fish`:

```fish
zoxide init fish | source
```

---

## Does zoxide have tab completion?

Yes—zoxide provides shell completion support, and it can also use fzf for interactive selection.

That said, “tab completion” depends on how your shell is configured:

- In Zsh, completion typically requires the completion system to be enabled (many setups already do this).
- In Bash, programmable completion needs to be enabled (often default in modern setups).
- In Fish, completions are usually built-in and “just work,” but the exact behavior differs from Zsh.

If you press Tab and nothing completes, the most common causes are:

1. The init line isn’t actually being loaded (wrong file, wrong shell, or not reloaded).
2. A plugin defines a conflicting `z` or overrides completion behavior.
3. Your completion system isn’t enabled (common in minimal dotfiles).

A practical fix: move the zoxide init line later in your config, reload, and test again.

---

## Upgrade your experience: `zi` + fzf (interactive jumping)

Many users think of `zi` as the “directory picker.” When fzf is installed, `zi` gives you a searchable list of known directories.

Install fzf on macOS via Homebrew:

```bash
brew install fzf
```

Now try:

```bash
zi
```

If everything is wired correctly, you’ll get a fast fuzzy list of directories you’ve visited.

---

## Optional: replace `cd` with zoxide (use `--cmd cd`)

If you want `cd` to behave like zoxide, you can alias the command name at init time:

```zsh
eval "$(zoxide init zsh --cmd cd)"
```

This can be awesome—but test it after your default `z` setup is stable. If you rely on Zsh’s own `cd` magic or other plugins, you may prefer to keep `z` separate.

---

## Troubleshooting checklist (Mac)

- **`z: command not found`** → your init line isn’t loading; confirm `echo $SHELL` and edit the right config file.
- **`which zoxide` returns nothing** → PATH issue; fix install or shell PATH.
- **Tab completion doesn’t work** → confirm init loads, then check plugin conflicts, then verify your completion system is enabled.
- **`zi` isn’t interactive** → install fzf and restart the shell.

---

## Wrap-up

On macOS, zoxide is a 2-step tool:

1) install the binary, and  
2) enable `zoxide init` for your shell so `z` exists, hooks record directories, and completions can load.

Once it’s configured, directory navigation becomes one of those “why didn’t I do this earlier?” upgrades.
