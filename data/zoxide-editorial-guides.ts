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

The [getting started guide](/tutorials/quick-start/) explains the normal §z§ workflow. The [command reference](/blog/zoxide-commands/) covers §query§, §remove§, and other subcommands. The behavior and version requirement on this page were checked against the [zoxide upstream documentation](https://github.com/ajeetdsouza/zoxide).`),
    },
  },
};

export function getEditorialGuide(
  locale: string,
  slug: string,
): EditorialGuide | undefined {
  return guides[slug]?.[locale];
}
