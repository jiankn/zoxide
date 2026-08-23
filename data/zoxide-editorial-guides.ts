export interface EditorialGuide {
  title: string;
  excerpt: string;
  content: string;
  lastReviewed?: string;
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

§zi§ opens an interactive selector backed by fzf. Type to filter the candidates, choose one, and press Enter. The [zoxide and fzf guide](/tutorials/fzf-integration/) includes the prerequisite check and the common "could not find fzf" failure.

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
- Need an interactive picker? Use [zoxide with fzf](/tutorials/fzf-integration/).

The commands on this page were checked against the [zoxide upstream documentation](https://github.com/ajeetdsouza/zoxide). This is an independent documentation site, not the official zoxide project.`),
    },
  },
  "zoxide-init-guide": {
    en: {
      title: "zoxide init for Bash, Zsh, Fish, PowerShell and Nushell",
      excerpt:
        "Add the correct zoxide init line for Bash, Zsh, Fish, PowerShell, or Nushell. Reload the profile, test z and zi, and fix common startup issues.",
      lastReviewed: "2026-08-23",
      content: markdown(String.raw`Run §zoxide --version§ before changing a shell profile. If that command fails, install the binary first. If it works but §z§ does not, the missing step is usually §zoxide init§.

§zoxide init <shell>§ prints the shell code that defines §z§ and §zi§, then records directory changes for future matching. Put the appropriate line in the startup file for the shell you actually open. Do not paste the Bash line into every shell.

This is an independent, task-focused guide. If you need the canonical command list, open the [official zoxide installation and configuration documentation](https://github.com/ajeetdsouza/zoxide#installation).

## Quick shell reference

| Shell | Startup file | Initialization line |
| --- | --- | --- |
| Bash | §~/.bashrc§ | §eval "$(zoxide init bash)"§ |
| Zsh | §~/.zshrc§ | §eval "$(zoxide init zsh)"§ |
| Fish | §~/.config/fish/config.fish§ | §zoxide init fish \| source§ |
| PowerShell | the path printed by §$PROFILE§ | §Invoke-Expression (& { (zoxide init powershell \| Out-String) })§ |
| Nushell | §$nu.env-path§ and §$nu.config-path§ | generate §~/.zoxide.nu§, then source it |

Use the detailed section for your shell before copying a line. The file must belong to the shell that starts in your terminal, and the initialization should run after tools that replace prompt or directory-change hooks.

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

Open a fresh shell and test the binary, generated shell command, and learned database separately:

§§§bash
zoxide --version
type z
zoxide query --list
§§§

In PowerShell, use §Get-Command zoxide§ and §Get-Command z§ instead of §type§. The checks mean different things:

- §zoxide --version§ fails: the executable is missing or not on PATH.
- the binary works but §type z§ or §Get-Command z§ fails: the profile did not load the init line.
- both commands work but the query list is empty: visit a few directories after initialization, or add one test path with §zoxide add§.

Then try §z§ followed by part of a directory you have visited. If fzf is installed, §zi§ opens interactive selection.

## Fix the configuration warning

If zoxide prints §detected a possible configuration issue§, first move the initialization line to the end of the active interactive-shell configuration, after prompt frameworks and other tools that install directory-change hooks. Remove duplicate init lines, open a completely new terminal, and repeat the three checks above.

A warning that appears only when an automation tool starts a non-interactive Zsh process can be a different case from a broken interactive terminal. Confirm that a normal terminal still defines §z§ and records directories before changing a working profile. The upstream project tracked that non-interactive warning separately in [issue 1208](https://github.com/ajeetdsouza/zoxide/issues/1208).

## About --cmd

§zoxide init§ supports §--cmd§ to change the command prefix. For example, §--cmd j§ creates §j§ and §ji§. Using §--cmd cd§ replaces the usual §cd§ command, so test it in a disposable shell before putting it in a profile you depend on.

For installation help, start with [download and install](/download/). For the interactive selector, see [zoxide with fzf](/tutorials/fzf-integration/). Commands and shell placement were checked against the [upstream setup instructions](https://github.com/ajeetdsouza/zoxide#installation).`),
    },
  },
  "zoxide-not-working": {
    en: {
      title: "zoxide not working? Diagnose PATH, init, database, and fzf",
      excerpt:
        "Run a four-layer zoxide diagnosis for a missing binary, unloaded z command, empty or unwritable database, and zi/fzf errors without deleting your history.",
      lastReviewed: "2026-08-23",
      content: markdown(String.raw`Do not reinstall or delete the database first. A zoxide failure usually belongs to one of four layers: the executable, shell initialization, the learned directory database, or the optional fzf selector. Test them in that order so one symptom does not send you to the wrong fix.

## Sixty-second diagnosis

Run these commands in the same terminal where zoxide fails:

§§§bash
zoxide --version
type z
zoxide query --list
fzf --version
§§§

PowerShell users should replace §type z§ with §Get-Command z§. The fzf check matters only when §zi§ fails; normal §z§ navigation does not require fzf.

| Result | What it means | Next action |
| --- | --- | --- |
| §zoxide --version§ is not found | Binary or PATH problem | Follow the [command-not-found diagnosis](/blog/zoxide-command-not-found/) |
| Binary works, but §z§ is missing | Shell profile or §zoxide init§ problem | Follow the [shell initialization guide](/blog/zoxide-init-guide/) |
| §z§ exists, but queries return no path | Empty, excluded, or mismatched database | Follow the [no-match diagnosis](/blog/troubleshooting-zoxide-no-match-found/) |
| §z§ works, but §zi§ cannot find fzf | Optional selector dependency is missing | Follow the [zoxide and fzf guide](/tutorials/fzf-integration/) |

## The binary works but z does not

§zoxide§ is the executable. §z§ and §zi§ are functions generated for your current shell. This distinction explains why installation can succeed while §z project§ still produces a command-not-found error.

Confirm which shell is running, then inspect the profile that shell actually reads:

§§§bash
ps -p $$ -o comm=
type z
§§§

Do not copy a Bash init line into Fish or PowerShell. Use the exact shell-specific line and open a new terminal after saving it. If the message says §detected a possible configuration issue§, place the init line after prompt frameworks and other directory hooks, then remove any duplicate initialization.

## z exists but does not learn directories

First inspect the database through the supported command interface instead of guessing its filename:

§§§bash
zoxide query --list --score
§§§

Open a real directory with normal §cd§, return to the prompt, and run the command again. If the new path never appears, check that the init line runs in the interactive shell and that §_ZO_EXCLUDE_DIRS§ does not match the path. Configuration variables must be set before §zoxide init§.

To separate the shell hook from database writing, add one known directory deliberately:

§§§bash
zoxide add /absolute/path/to/project
zoxide query project
§§§

Use a real absolute path. If the add command succeeds, the database is writable and the remaining problem is normally the shell hook or exclusion rule.

## Fix database write and temporary-file errors

Current zoxide releases store §db.zo§ under the operating system's user data location, not §~/.zo§:

| Platform | Default location |
| --- | --- |
| Linux/BSD | §$XDG_DATA_HOME/zoxide/db.zo§, or §$HOME/.local/share/zoxide/db.zo§ when XDG_DATA_HOME is unset |
| macOS | §$HOME/Library/Application Support/zoxide/db.zo§ |
| Windows | §%LOCALAPPDATA%\\zoxide\\db.zo§ |

§_ZO_DATA_DIR§ can override the directory. If you set it, print that variable in the failing shell and verify the directory exists and is owned by the current user. Errors such as §could not move temporary database§ usually need a directory-level permission or filesystem check; making only the existing file writable may not be enough because zoxide writes a temporary database and then replaces the old one.

Do not run zoxide with §sudo -E§ against a normal user's data directory, do not share one writable database between accounts, and do not use §chmod 777§. Correct the owner or move §_ZO_DATA_DIR§ to a private, local user-data directory.

## Wrong directory or no match

List candidates before changing ranking data:

§§§bash
zoxide query --list --score project
§§§

Add another ordered path fragment, choose interactively with §zi project§, or remove one confirmed stale path with §zoxide remove /absolute/old/path§. Avoid repeatedly adding a path just to force its score upward; a precise query is easier to understand and maintain.

## Preserve evidence before a reset

There is rarely a reason to delete the complete database. Save the readable entries first:

§§§bash
zoxide query --all --list --score
§§§

If that command fails, record the exact error, §zoxide --version§, operating system, shell, data-directory ownership, and whether the failure occurs in a new interactive terminal. Those details are more useful in an [upstream issue](https://github.com/ajeetdsouza/zoxide/issues) than a generic “not working” report.

The command flags and default data locations on this page were checked against the [official zoxide README](https://github.com/ajeetdsouza/zoxide).`),
    },
  },
  "troubleshooting-zoxide-no-match-found": {
    en: {
      title: "zoxide no match found: fix learning, queries, and stale paths",
      excerpt:
        "Fix zoxide no match found by checking learned directories, matching rules, exclusions, and stale paths before changing or deleting the database.",
      lastReviewed: "2026-08-23",
      content: markdown(String.raw`§zoxide: no match found§ means the §z§ function ran, but zoxide could not return a learned directory for that query. It is different from §z: command not found§, which means shell initialization did not create the command at all.

Start with the database rather than reinstalling:

§§§bash
zoxide query --list
zoxide query --list --score project
§§§

If the first command is empty, use the learning checks below. If it contains directories but the second command is empty, inspect how the query matches paths.

## Confirm that zoxide has learned a directory

zoxide learns from directory changes after its shell hook has loaded. Open a known directory normally, return to a prompt, and query it:

§§§bash
cd /absolute/path/to/example-project
zoxide query --list --score example-project
§§§

For a controlled test, add the same real directory directly:

§§§bash
zoxide add /absolute/path/to/example-project
zoxide query example-project
§§§

If direct add works but normal visits are never recorded, the database is healthy; repair the shell hook in the [zoxide init guide](/blog/zoxide-init-guide/). Also check whether §_ZO_EXCLUDE_DIRS§ matches the missing path. That variable must be defined before the init line.

## Use zoxide's matching rules

The upstream algorithm applies predictable rules:

1. Matching is case-insensitive.
2. Every query term must appear in the path in the same order.
3. The final component of the final term must match the final directory name.
4. Matching results are ordered by frecency.

For example, §z client portal§ can match §/work/client/customer-portal§, while reversing the words may not. If §z project§ is too broad or returns nothing useful, copy two ordered fragments from the actual path instead of repeatedly changing scores.

Use a literal path when you already know it:

§§§bash
z /absolute/path/to/project
§§§

Use §zi project§ when several learned directories match and you want to choose before moving. The interactive command requires fzf; a §could not find fzf§ message belongs to the [fzf setup guide](/tutorials/fzf-integration/), not to the database reset path.

## Inspect excluded and unavailable paths

Show unavailable entries as well as current paths:

§§§bash
zoxide query --all --list --score project
§§§

The upstream algorithm lazily prunes unavailable entries that are older than 90 days. Remove a confirmed stale entry explicitly when it is getting in the way:

§§§bash
zoxide remove /absolute/path/to/old-project
§§§

Do not delete the entire database to remove one path. If a directory was renamed, visit or add the new absolute path, verify it appears, and only then remove the old one.

## When query succeeds but z still says no match

Run both commands with the same keyword:

§§§bash
zoxide query project
z project
§§§

If the first prints a valid path but the second fails, the learned data and query are working. The remaining fault is in the generated shell wrapper, a custom §--cmd§ alias, or another plugin redefining the command. Open a clean shell with the standard init line before altering the database.

On PowerShell, check §Get-Command z§ and avoid naming a custom §--cmd§ after a command that the generated wrapper itself must call. On Bash or Zsh, use §type -a z§ to find a competing alias or function.

## Keep no-match separate from database write errors

A readable database can still fail to save because of permissions. If §zoxide add§ reports a temporary-database or permission error, use the [general zoxide troubleshooting guide](/blog/zoxide-not-working/) to check the OS-specific data directory and ownership. A plain no-match response by itself is not evidence of database corruption.

Matching behavior and pruning were checked against the [official zoxide algorithm documentation](https://github.com/ajeetdsouza/zoxide/wiki/Algorithm), and command flags against the [upstream README](https://github.com/ajeetdsouza/zoxide).`),
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

For a first install, use [download and install](/download/). For interactive selection, use [zoxide with fzf](/tutorials/fzf-integration/). This page was checked against the [zoxide command manual](https://github.com/ajeetdsouza/zoxide/blob/main/man/man1/zoxide.1), [query manual](https://github.com/ajeetdsouza/zoxide/blob/main/man/man1/zoxide-query.1), and upstream README.`),
    },
  },
};

export function getEditorialGuide(
  locale: string,
  slug: string,
): EditorialGuide | undefined {
  return guides[slug]?.[locale];
}
