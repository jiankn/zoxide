---
title: "Alternatives to zoxide: autojump vs zoxide vs z.lua vs fasd (plus open source & shell support)"
description: "Compare zoxide with popular directory-jump alternatives, learn what problems each solves, and understand zoxide’s open-source story and shell compatibility."
keywords: ["what are the alternatives to zoxide", "autojump vs zoxide", "is zoxide open source", "what shell does zoxide work with"]
slug: "zoxide-alternatives-comparison-open-source"
---

# Alternatives to zoxide: what to use (and when)

If you’re searching **“what are the alternatives to zoxide”**, you’re already convinced of the bigger idea: **directory jumping** is worth it. The remaining question is which tool fits your workflow.

zoxide is popular because it’s fast, cross-shell, and modern—but it’s not the only option. This post compares zoxide with common alternatives (autojump, “z”, fasd, z.lua, and plain fzf workflows), and also answers the “meta” questions that affect adoption: **is zoxide open source** and **what shell does zoxide work with**.

---

## Why directory jump tools exist (the shared problem)

All of these tools exist because `cd` scales poorly with real developer workflows:

- deep repo structures,
- multiple projects and environments,
- frequent context switching,
- and humans remembering intent rather than paths.

So the category exists to turn navigation into: “jump where I mean.”

---

## zoxide at a glance

zoxide describes itself as “a smarter cd command,” inspired by older tools like `z` and autojump.  
Its core idea is simple:

- record directories you visit,
- rank them by your behavior (frequency + recency),
- jump by fuzzy keywords via `z` (and optionally `zi`).

This “learned ranking” is what makes it feel like it gets better over time.

---

## Alternatives to zoxide (with practical trade-offs)

### 1) autojump

**autojump** is one of the classic directory jumpers. It’s been around a long time, and many people adopted it early. Reasons you might still choose it:

- it’s widely packaged,
- it has lots of community snippets,
- it’s “good enough” for many workflows.

Reasons people migrate away:

- zoxide is often faster and tends to feel more modern,
- shell integration and cross-platform tooling can be smoother in zoxide,
- many users prefer zoxide’s defaults and integrations.

zoxide also supports importing data from autojump, which helps with migration.

### 2) “z” (the original z.sh / rupa/z)

The original **`z`** scripts are lightweight and simple. They’re often implemented as shell scripts with minimal dependencies. The upside is simplicity; the downside is that the ecosystem is fragmented, and features differ across forks. If you love minimalism and your shell setup is stable, the original “z” can be enough.

zoxide is explicitly inspired by `z` and modernizes the concept.

### 3) fasd

**fasd** is an older but powerful tool that ranks files and directories (not just directories). If you want “jump + open files” style workflows, fasd can be attractive. However, some users find its behavior and setup less straightforward, and they prefer a dedicated directory jumper plus separate tools for files.

### 4) z.lua

**z.lua** is popular among users who like Lua-based tooling and want extensive configuration knobs. It’s fast and flexible, and it’s a strong choice if you already live in a Lua ecosystem (like Neovim-heavy setups). The trade-off is: you may end up tuning a lot.

### 5) fzf-only directory workflows

Some people skip “learning” entirely and rely on fzf to search directories on demand. This can work well if you don’t want a database, or if you prefer explicit interactive selection every time.

Trade-off: you lose the “it learns my habits” ranking that makes zoxide fast with a few letters.

---

## What shell does zoxide work with?

zoxide supports all major shells, and the official documentation provides init snippets for each one.  
In practice, if your workflow includes Bash, Zsh, Fish, PowerShell, or Nushell, zoxide is usually a safe bet.

This shell breadth is one reason it’s widely recommended as the “default” directory jumper today.

---

## Is zoxide open source? (and why it matters)

Yes—zoxide is open source on GitHub and distributed under the MIT license.

For teams and long-lived dotfile setups, that matters because:

- you can audit what the init scripts do,
- you can pin versions,
- you can contribute fixes,
- and you aren’t betting on a closed tool disappearing.

---

## Which should you choose? A simple decision framework

Choose **zoxide** if you want:

- strong cross-shell support,
- modern integrations (including fzf),
- a tool that “learns” and improves over time,
- easy onboarding and migration support.

Choose **autojump** if you want:

- a long-established, widely packaged default,
- and you already have it working everywhere.

Choose **z** (script) if you want:

- minimal dependencies and a simple mental model,
- and you’re okay with fewer modern integrations.

Choose **fasd** if you want:

- ranking for files and directories in one tool,
- and you’re comfortable with its older style.

Choose **z.lua** if you want:

- maximum configurability and a Lua-friendly ecosystem.

Choose **fzf-only** if you want:

- no learning database, always interactive search,
- and you don’t mind a couple more keystrokes per jump.

---

## Wrap-up

The directory-jump category is mature, and there are several good options. But zoxide has become a common recommendation because it combines:

- “learned” ranking,
- broad shell support,
- and a modern open-source project surface.

If you’re on the fence, install it, enable `zoxide init`, and try it for a week. The fastest test is always real usage.
