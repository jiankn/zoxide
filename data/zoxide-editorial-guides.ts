export interface EditorialGuide {
  title: string;
  excerpt: string;
  content: string;
}

const markdown = (content: string) => content.replaceAll("§", "`");

const guides: Record<string, Partial<Record<string, EditorialGuide>>> = {
  "mastering-terminal-navigation-zoxide-guide": {
    en: {
      title: "How to use zoxide: first jump, shell setup, and zi",
      excerpt:
        "Set up zoxide, make your first directory jump with z, use zi when several paths match, and know where to go when the shell integration does not load.",
      content: markdown(String.raw`Start with one working jump. zoxide keeps a local record of directories you visit and ranks matching paths when you use §z§. It is useful for places you already work in. It is not a full filesystem search tool.

This page covers the first few commands. Installation details, shell-specific setup, and fzf troubleshooting live on separate pages so that each task has one place to start.

## Add zoxide to your shell

Installing the binary alone does not create the §z§ command. Add the initialization line for the shell you actually use, then open a new terminal.

For Bash, add this to §~/.bashrc§:

§§§bash
eval "$(zoxide init bash)"
§§§

Zsh, Fish, PowerShell, and Nushell use different lines and config-file locations. Use the [shell setup guide](/blog/zoxide-init-guide/) rather than adapting the Bash command by hand.

## Make your first jump

After you have visited a directory at least once, try a word from its path:

§§§bash
z project
z client portal
z project /
§§§

§z project§ changes to the highest-ranked learned directory that matches §project§. Adding another word narrows the match. Adding §/§ asks zoxide to look for a subdirectory beginning with the preceding query.

zoxide still accepts normal path-like navigation:

§§§bash
z ~/code/example
z ..
z -
§§§

Use those forms when you already know the exact location. The ranked matching is most helpful when you remember part of a familiar path but not the full path.

## Choose a directory instead of taking the first match

If several repositories have similar names, install fzf and use §zi§:

§§§bash
zi project
§§§

§zi§ opens an interactive selector backed by fzf. Type to filter the candidates, choose one, and press Enter. The [zoxide and fzf guide](/blog/zoxide-fzf-interactive-guide-en/) includes the prerequisite check and the common "could not find fzf" failure.

## Inspect a surprising result

When §z project§ picks the wrong directory, inspect the database before changing your configuration:

§§§bash
zoxide query --list --score project
§§§

This prints the matching paths and their calculated scores. You can then use a more specific query, choose with §zi§, or remove a stale entry with the command reference.

## Continue with the task you have

- Need the binary first? Use the [download and install guide](/download/).
- Need the correct line for your shell? Use [zoxide init](/blog/zoxide-init-guide/).
- Need every subcommand? Use the [zoxide commands reference](/blog/zoxide-commands/).
- Need an interactive picker? Use [zoxide with fzf](/blog/zoxide-fzf-interactive-guide-en/).

The commands on this page were checked against the [zoxide upstream documentation](https://github.com/ajeetdsouza/zoxide). This is an independent documentation site, not the official zoxide project.`),
    },
  },
  "zoxide-init-guide": {
    en: {
      title: "zoxide init for Bash, Zsh, Fish, PowerShell and Nushell",
      excerpt:
        "Add the correct zoxide init line for Bash, Zsh, Fish, PowerShell, or Nushell. Reload the profile, test z and zi, and fix common startup issues.",
      content: markdown(String.raw`Run §zoxide --version§ before changing a shell profile. If that command fails, install the binary first. If it works but §z§ does not, the missing step is usually §zoxide init§.

§zoxide init <shell>§ prints the shell code that defines §z§ and §zi§, then records directory changes for future matching. Put the appropriate line in the startup file for the shell you actually open. Do not paste the Bash line into every shell.

## Bash

Add this to the end of §~/.bashrc§:

§§§bash
eval "$(zoxide init bash)"
§§§

Open a new Bash session after saving the file.

## Zsh

Add this to the end of §~/.zshrc§:

§§§zsh
eval "$(zoxide init zsh)"
§§§

If you use §compinit§, zoxide's upstream documentation says this line must come after it. Rebuild the completion cache only if completion loading still fails.

## Fish

Add this to §~/.config/fish/config.fish§:

§§§fish
zoxide init fish | source
§§§

Start a new Fish shell, then try a directory you have already visited.

## PowerShell

Find the profile path with §echo $PROFILE§, then add this line to that profile:

§§§powershell
Invoke-Expression (& { (zoxide init powershell | Out-String) })
§§§

Close and reopen PowerShell. If the profile is blocked by an execution policy, resolve that policy before assuming the zoxide command is wrong.

## Nushell

Nushell uses two files. First, find the paths with §$nu.env-path§ and §$nu.config-path§. Save the generated setup in the env file:

§§§nu
zoxide init nushell | save -f ~/.zoxide.nu
§§§

Then source it from the config file:

§§§nu
source ~/.zoxide.nu
§§§

The upstream project documents Nushell v0.89.0 or newer for this integration.

## Test the setup

Open a fresh shell and run a harmless navigation command:

§§§bash
z ..
§§§

Then return with §z -§, or try §z§ followed by part of a directory you have visited. If fzf is installed, §zi§ opens interactive selection.

## About --cmd

§zoxide init§ supports §--cmd§ to change the command prefix. For example, §--cmd j§ creates §j§ and §ji§. Using §--cmd cd§ replaces the usual §cd§ command, so test it in a disposable shell before putting it in a profile you depend on.

For installation help, start with [download and install](/download/). For the interactive selector, see [zoxide with fzf](/blog/zoxide-fzf-interactive-guide-en/). Commands and shell placement were checked against the [upstream setup instructions](https://github.com/ajeetdsouza/zoxide#installation).`),
    },
  },
  "zoxide-fzf-interactive-guide-en": {
    en: {
      title: "zoxide + fzf: set up zi for interactive directory jumps",
      excerpt:
        "Use zi to choose among learned zoxide directories with fzf. Check the fzf prerequisite, initialize your shell, and fix the common missing-fzf error.",
      content: markdown(String.raw`§z§ picks the highest-ranked matching directory. §zi§ is for the cases where you want to see the choices first. It uses fzf to present learned directories in an interactive selector.

This guide assumes zoxide is installed and its shell integration already loads. If §z§ itself is missing, fix that first in the [zoxide init guide](/blog/zoxide-init-guide/).

## Check the prerequisite

The zoxide project lists fzf as optional for interactive selection and documents fzf v0.51.0 as the minimum supported version. Check whether it is available:

§§§bash
fzf --version
§§§

If your shell cannot find fzf, install it with your operating system's package manager, then open a new terminal. Do not rely on an alias to hide a missing executable.

## Use zi

After zoxide and fzf are available, run:

§§§bash
zi project
§§§

Replace §project§ with a word from a directory you have visited. fzf displays the matching learned directories. Type to narrow the list, select one, and press Enter to change into it.

Use §zi§ without an argument when you want to browse the learned directory list. Use §z project§ when you are happy to take the highest-ranked match without choosing manually.

## When the selector does not appear

The error §zoxide: could not find fzf, is it installed?§ means the current shell cannot execute §fzf§. Check these in order:

1. Run §fzf --version§ in the same shell that shows the error.
2. Install or repair fzf with the package manager for that operating system.
3. Open a new shell so it receives the updated PATH.
4. Confirm the zoxide initialization line still loads, then run §zi§ again.

If §z§ works but §zi§ does not, the problem is usually fzf availability rather than the zoxide database.

## Optional selector settings

zoxide passes §_ZO_FZF_OPTS§ to fzf during interactive selection. Set it before the §zoxide init§ line in the shell config file. For example:

§§§bash
export _ZO_FZF_OPTS="--height 40% --layout=reverse --border"
eval "$(zoxide init bash)"
§§§

Those options affect the selector's appearance, not which directories zoxide learns or how it ranks them. Start with the default behavior and add options only if you know the fzf flags you want.

## Useful related commands

When a broad query returns too many directories, inspect the candidates instead of guessing:

§§§bash
zoxide query --list --score project
§§§

The [getting started guide](/blog/mastering-terminal-navigation-zoxide-guide/) explains the normal §z§ workflow. The [command reference](/blog/zoxide-commands/) covers §query§, §remove§, and other subcommands. The behavior and version requirement on this page were checked against the [zoxide upstream documentation](https://github.com/ajeetdsouza/zoxide).`),
    },
  },
  "zoxide-commands": {
    en: {
      title: "Zoxide commands: z, zi, query, add, remove, and import",
      excerpt:
        "Use z, zi, query, add, remove, and import with tested examples. Inspect or edit zoxide's learned directory database without guessing at paths.",
      content: markdown(String.raw`This is a reference for the commands that affect a zoxide directory database. Use the short shell commands for navigation. Use the §zoxide§ binary when you need to inspect, add, remove, or import entries.

Run §zoxide --help§ on your own machine when a flag matters. Package versions can differ from the current upstream documentation.

## Everyday navigation

| Goal | Command |
| --- | --- |
| Jump to the highest-ranked match | §z project§ |
| Narrow a match with more words | §z client portal§ |
| Enter a matching subdirectory | §z project /§ |
| Use a normal path | §z ~/code/project§ |
| Go up or return | §z ..§, §z -§ |
| Choose interactively with fzf | §zi project§ |

§z§ and §zi§ are created by the shell initialization script. If either command is missing, use the [zoxide init guide](/blog/zoxide-init-guide/) before editing the database.

## Inspect matching directories

§§§bash
zoxide query project
zoxide query --list --score project
§§§

The first command returns the best matching path. §--list§ shows every matching result, and §--score§ adds the calculated score. Add §--all§ if you need to include deleted directories. §--interactive§ uses fzf, which must be installed separately.

## Add a directory deliberately

§§§bash
zoxide add ~/code/project
§§§

§zoxide add§ creates a database entry when the path is new. When the path already exists in the database, it increments that entry's rank. Use it when you have a real directory to add, not as a substitute for a search query.

## Remove a stale directory

§§§bash
zoxide remove ~/code/old-project
§§§

§remove§ accepts paths. Check the output of §zoxide query --list§ first so that you remove the intended entry. If a directory should never be learned again, configure §_ZO_EXCLUDE_DIRS§ before the §zoxide init§ line. The upstream documentation uses an OS-specific list separator for that variable.

## Import a previous history

§§§bash
zoxide import autojump
§§§

The upstream project documents imports from atuin, autojump, fasd, z, z.lua, and zsh-z. Keep the original tool and its data until you have opened a new shell and verified that the imported entries behave as expected.

## Use configuration flags carefully

§zoxide init --cmd j§ changes the default command names to §j§ and §ji§. §zoxide init --cmd cd§ replaces §cd§, which can change habits and scripts in ways that are hard to undo during a busy session. Test a custom prefix in a temporary shell first.

§_ZO_ECHO=1§ prints the chosen directory before navigation. §_ZO_MAXAGE§ limits the database's aging threshold. §_ZO_RESOLVE_SYMLINKS=1§ resolves symlinks before they are added. These options are useful only when they address a specific workflow problem.

For a first install, use [download and install](/download/). For interactive selection, use [zoxide with fzf](/blog/zoxide-fzf-interactive-guide-en/). This page was checked against the [zoxide command manual](https://github.com/ajeetdsouza/zoxide/blob/main/man/man1/zoxide.1), [query manual](https://github.com/ajeetdsouza/zoxide/blob/main/man/man1/zoxide-query.1), and upstream README.`),
    },
  },
};

export function getEditorialGuide(
  locale: string,
  slug: string,
): EditorialGuide | undefined {
  return guides[slug]?.[locale];
}
