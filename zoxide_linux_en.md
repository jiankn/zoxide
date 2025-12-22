# zoxide on Linux: Install, Initialize, Use, Power Tips, and Uninstall (Keyword: **zoxide linux**)

If you searched for **“zoxide linux”**, you’re probably trying to make terminal navigation faster. You installed the `zoxide` binary, typed `z`, and either got **“command not found”** or nothing happened. That’s normal: installing the binary is only step one. The magic comes from **shell integration**, which is done via `zoxide init`.

This Linux‑first guide takes you from “just installed” to daily driver: installation options for popular distributions, the correct init lines for Bash/Zsh/Fish/Nushell, practical usage patterns, fzf‑powered interactive jumping, performance and hook tips, troubleshooting, and clean removal when you’re done.

---

## 1) What is zoxide (and why it feels “smarter” than `cd`)?

`zoxide` is a smarter directory jumper. It learns from your behavior: every time you enter a directory, it records that path and adjusts its score based on **frequency** and **recency**. Later, you can jump using short keywords:

- Instead of: `cd ~/dev/projects/company/infra/terraform/modules`
- You type: `z terraform` (or `z infra terraform`) and jump straight there

On Linux, this is especially valuable because:

- Your filesystem is often deep (monorepos, multiple repos, container mounts, `/srv`, `/var/log`, etc.).
- You switch between local shells and remote shells (SSH, tmux).
- You want tools that are lightweight, scriptable, and shell‑native.

The core philosophy: **you shouldn’t have to remember full paths**. You should be able to jump by intent.

---

## 2) Install zoxide on Linux: choose the right method

### Option A — Use your distro package manager (recommended)

This is the easiest way to install and receive updates through your system:

```bash
# Debian / Ubuntu
sudo apt update && sudo apt install -y zoxide

# Fedora / RHEL family
sudo dnf install -y zoxide

# Arch / Manjaro
sudo pacman -S zoxide

# openSUSE
sudo zypper install zoxide
```

Verify:

```bash
zoxide --version
which zoxide
```

If `which zoxide` prints nothing, the binary isn’t in your PATH. Fix PATH first before troubleshooting init.

### Option B — Install the latest via Rust/Cargo

If your distro version is outdated, Cargo is a solid way to get the newest build:

```bash
cargo install zoxide --locked
```

Make sure `~/.cargo/bin` is in PATH.

### Option C — Manual binary install (portable + ops-friendly)

Many Linux users keep standalone binaries under `~/.local/bin`:

```bash
mkdir -p ~/.local/bin
# Download a release binary, place it into ~/.local/bin, then:
chmod +x ~/.local/bin/zoxide
```

Confirm `~/.local/bin` is on PATH:

```bash
echo "$PATH" | tr ':' '\n' | head
```

---

## 3) The “missing step”: `zoxide init` (shell integration)

Running:

```bash
zoxide init <shell>
```

does **not** edit your config files. It prints a block of shell script to STDOUT. That script typically:

- defines the `z` command (and companions like `zi`),
- installs a **hook** so directory changes are recorded into the database,
- enables interactive logic (commonly via fzf).

To make zoxide work every time you open a terminal, you must **evaluate** that init script at shell startup by adding it to your shell config file.

---

## 4) Linux shell setup: Bash / Zsh / Fish / Nushell

### Bash

Add this to `~/.bashrc`:

```bash
eval "$(zoxide init bash)"
```

Apply:

```bash
source ~/.bashrc
```

### Zsh

Add this to `~/.zshrc`:

```zsh
eval "$(zoxide init zsh)"
```

If you use plugin managers (oh‑my‑zsh, zinit, zim), place the init line after plugin loading so it doesn’t get overridden by completions or custom functions.

### Fish

Add to `~/.config/fish/config.fish`:

```fish
zoxide init fish | source
```

### Nushell

Common pattern:

```nu
zoxide init nushell | save -f ~/.zoxide.nu
```

Then in `config.nu`:

```nu
source ~/.zoxide.nu
```

---

## 5) Everyday usage (what you’ll actually type)

Once initialized, these cover most workflows:

```bash
z foo        # jump to the best match for "foo"
z foo bar    # multi-keyword match for better precision
z foo/       # can also cd into real directories directly
z ..         # go to parent directory
z -          # go back to previous directory
zi foo       # interactive selection (usually needs fzf)
```

### Install fzf for interactive mode (recommended)

On Linux, fzf is usually a package away:

```bash
# Debian/Ubuntu
sudo apt install -y fzf

# Fedora
sudo dnf install -y fzf

# Arch
sudo pacman -S fzf
```

Then try:

```bash
zi
```

You should get a searchable directory picker.

---

## 6) Power tip: make zoxide your default `cd` (unify muscle memory)

If you don’t want to think “cd vs z”, you can let zoxide take over the command name via `--cmd`. Example for Zsh:

```zsh
eval "$(zoxide init zsh --cmd cd)"
```

What you get:

- `cd` still goes home with no args.
- `cd ..` still goes up.
- `cd /etc` still goes to absolute paths.
- `cd work` becomes fuzzy and jumps to your most-used `work` directory.

If you see odd behavior, revert to default `z` first (remove `--cmd cd`), confirm zoxide works, then investigate hook conflicts with your prompt, plugins, or custom `cd` functions.

### Bonus: control when zoxide records directories (`--hook`)

Depending on your shell/prompt setup, you might want different hook behavior. A common alternative is recording at each prompt render:

```bash
eval "$(zoxide init bash --hook prompt)"
```

Most Linux users should keep the default; change it only if you notice directories not being recorded consistently.

---

## 7) Database location, privacy, and cleanup

On Linux, zoxide typically follows XDG conventions. The database is commonly stored under:

- `$XDG_DATA_HOME/zoxide`, or
- `~/.local/share/zoxide`

That’s local to your user account. You can also control the DB location with environment variables (for backups/sync or privacy), and exclude directories you don’t want tracked (caches, build outputs, temp folders). Keeping your history clean improves matching quality.

---

## 8) Practical Linux workflows that feel great with zoxide

### Multi-repo development

If you have many repos like:

- `~/dev/company/api`
- `~/dev/company/web`
- `~/dev/company/infra`
- `~/dev/personal/sideproject`

You can jump with intent:

```bash
z company api
z personal side
```

Multi-keyword matching is often more precise than a single token.

### SSH and servers

You can install zoxide on remote hosts too. The main “gotcha” is init placement: some shells read different files for login vs interactive sessions. When in doubt, confirm your shell startup behavior and put the init line in the file that is guaranteed to be loaded.

### tmux

tmux panes are shells. If your shell config initializes zoxide, it works consistently across panes and sessions.

---

## 9) Troubleshooting (Linux pitfalls)

### “command not found: z”

- Ensure your init line is in the right file (`.bashrc`, `.zshrc`, etc.).
- Reload it (`source ~/.zshrc`) or open a new terminal.
- Confirm `zoxide` is in PATH (`which zoxide`).

### “It doesn’t learn / doesn’t add directories”

This is usually a hook conflict: prompt frameworks, custom `cd` wrappers, or plugin managers modifying hooks. Put the init line later in your config. If you use `--cmd cd`, disable it and confirm basic `z` learning first.

### `zi` isn’t interactive

Install `fzf`, restart your shell, and ensure `fzf` is in PATH (`which fzf`).

---

## 10) Uninstall zoxide on Linux (and optionally remove history)

### Step 1 — Remove init lines

Delete the line you added, such as:

- `eval "$(zoxide init bash)"`
- `eval "$(zoxide init zsh)"`
- `zoxide init fish | source`

Restart your shell.

### Step 2 — Remove the package/binary

Pick the method matching your install:

```bash
# apt
sudo apt remove -y zoxide

# dnf
sudo dnf remove -y zoxide

# pacman
sudo pacman -R zoxide

# cargo
cargo uninstall zoxide
```

### Step 3 — Remove the database (optional)

To delete your navigation history:

```bash
rm -rf "${XDG_DATA_HOME:-$HOME/.local/share}/zoxide"
```

---

## Wrap-up

The “**zoxide linux**” experience boils down to two essentials:

1) install a working zoxide binary, and  
2) **initialize it properly** so your shell records directory changes and provides the `z/zi` commands.

After that, it’s all ergonomics: fzf for interactive picking, multi-keyword jumps for precision, and optional takeover of `cd` if you want one unified muscle memory. If you live in a terminal all day, zoxide is one of the highest-ROI upgrades you can make in under five minutes.
