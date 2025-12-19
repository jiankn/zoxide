# zoxide init: The Comprehensive Guide to Shell Integration

So, you’ve installed **zoxide** using a package manager like Homebrew, Scoop, or Apt. You type `z` in your terminal, expecting magic, but all you get is **`command not found`** or a cursor that does nothing.

Don't worry — this is the most common stumbling block for new users.

Installing the binary is only step one. Step two is **initialization**.

This guide focuses entirely on the `zoxide init` command — the bridge that connects the zoxide binary to your shell's behavior. We’ll cover how to configure it for every major shell, how to optimize it for performance, and how to use advanced flags to replace `cd` entirely.

---

## What Does `zoxide init` Actually Do?

Before we paste code into config files, it helps to understand what’s happening.

`zoxide` is an executable, but your shell (Bash, Zsh, etc.) needs to know how to talk to it when you change directories.

When you run:

```bash
zoxide init <shell>
```

…it outputs a block of shell script. This script does three things:

1. **Defines the `z` command (or function).**
2. **Sets up a “hook”** that listens every time you change a directory, adding that path to zoxide’s database.
3. **Handles the logic for the `zi`** (interactive selection) command.

This is why simply running `zoxide` does nothing. You need to **evaluate** (run) this output every time your shell starts.

---

## Configuration by Shell

Below are the correct `zoxide init` setups for the most popular shells.

### 1. Bash (Linux / macOS default)

Add the following line to the end of your `~/.bashrc` file:

```bash
eval "$(zoxide init bash)"
```

**Pro Tip:** If you are on macOS and using Bash (rare nowadays, as Zsh is default), you might need to add this to `~/.bash_profile` instead.

---

### 2. Zsh (macOS default / Power users)

Edit your `~/.zshrc` file:

```zsh
eval "$(zoxide init zsh)"
```

**Troubleshooting Zsh:** If you use plugins like oh-my-zsh or `zsh-syntax-highlighting`, make sure the zoxide init line is placed **after plugins are loaded**, but generally **before syntax highlighting** to ensure the command is recognized correctly.

---

### 3. Fish Shell

Fish handles things differently. It doesn't use `eval` in the same way. Add this to your `~/.config/fish/config.fish`:

```fish
zoxide init fish | source
```

---

### 4. PowerShell (Windows)

For Windows users, you need to edit your PowerShell profile. You can find the profile path by typing:

```powershell
$PROFILE
```

Add this line to that file:

```powershell
Invoke-Expression (& { (zoxide init powershell | Out-String) })
```

---

### 5. Nushell

Nushell is gaining traction for its structured data approach.

Add this to your env file (usually `~/.config/nushell/env.nu`):

```nu
zoxide init nushell | save -f ~/.zoxide.nu
```

And then in your config file (`~/.config/nushell/config.nu`), add:

```nu
source ~/.zoxide.nu
```

---

## Advanced: Replacing `cd` with zoxide

Many users (myself included) prefer not to think about whether to use `cd` or `z`. We want `cd` to just be smarter.

You can force `zoxide init` to alias `cd` to `z` automatically using the `--cmd` flag.

### Example for Zsh

Change your init line to:

```zsh
eval "$(zoxide init zsh --cmd cd)"
```

### What this does

- `cd` now uses zoxide's fuzzy logic.
- `cd ..` still goes up one directory.
- `cd /tmp` still goes to an absolute path.
- But `cd foo` will jump to your most frequent `foo` directory, even if it's deep in your file system.

> **Note:** If you use this, the `z` command will still exist, but `cd` becomes your daily driver.

---

## Performance Tuning: Lazy Loading

If you are obsessive about shell startup time (milliseconds matter!), running:

```zsh
eval "$(zoxide init zsh)"
```

…adds a tiny bit of overhead because it has to spawn the zoxide binary just to generate text.

You can **lazy load** zoxide. This means the shell won't initialize zoxide until the first time you actually type `z`.

### Example: Zsh Lazy Load Script

```zsh
z() {
    unfunction "$0"
    eval "$(zoxide init zsh)"
    $0 "$@"
}
```

⚠️ **Warning:** The downside of lazy loading is that zoxide won't record directory changes until after you run `z` for the first time in that session. If you open a terminal, `cd` around manually, and then close it without ever running `z`, those paths won't be saved to the database.

---

## Troubleshooting Common init Errors

### “command not found: z”

- Did you restart the shell? The config file is only read on startup.
  - Run `source ~/.zshrc` (or equivalent), or open a new terminal tab.
- Is zoxide in your `PATH`?
  - Run `which zoxide`. If it returns nothing, check your installation method.
- Did you use the wrong shell syntax?
  - Putting the Bash `eval` command into `config.fish` will fail.

---

### “zoxide: error: unknown flag”

You might be using an outdated version of zoxide. The init flags have evolved.

- Check version:

```bash
zoxide --version
```

- Update it.
  - If you installed via `apt` on an old Ubuntu distro, it might be very old.
  - Prefer **Homebrew** or the **official install script** for the latest version.

---

## Final Thoughts

The `zoxide init` command is a “set it and forget it” step, but understanding it gives you control over your terminal environment.

Whether you stick to the standard `z` command or alias `cd` entirely, proper initialization is the key to unlocking that 10× navigation speed.

Now, go edit that config file.
