export type HomeGuideContent = {
  eyebrow: string;
  title: string;
  introduction: string[];
  contentsLabel: string;
  contents: Array<{ href: string; label: string }>;
  overview: {
    title: string;
    paragraphs: string[];
    points: Array<{ title: string; text: string }>;
  };
  install: {
    title: string;
    introduction: string;
    methods: Array<{
      title: string;
      bestFor: string;
      command: string;
      note: string;
    }>;
    verification: string;
  };
  activate: {
    title: string;
    introduction: string;
    shells: Array<{
      name: string;
      profile: string;
      command: string;
    }>;
    verification: string;
  };
  firstSession: {
    title: string;
    introduction: string[];
    commands: Array<{ command: string; purpose: string }>;
    learningTitle: string;
    learning: string[];
  };
  troubleshooting: {
    title: string;
    introduction: string;
    items: Array<{ title: string; text: string; command?: string }>;
  };
  workflow: {
    title: string;
    introduction: string;
    choices: Array<{ title: string; text: string }>;
    conclusion: string;
  };
  faq: {
    title: string;
    items: Array<{ question: string; answer: string }>;
  };
  next: {
    title: string;
    description: string;
    links: Array<{ href: string; title: string; description: string }>;
  };
};

const homeGuides: Record<string, HomeGuideContent> = {
  en: {
    eyebrow: "Start here",
    title: "Install and use zoxide without leaving this page",
    introduction: [
      "zoxide is a directory jumper for people who spend time in a terminal. It remembers directories you actually visit, ranks them using both frequency and recency, and lets you return with a short fragment instead of typing an exact path. If you regularly move between projects, repositories, configuration folders, and download directories, it removes a small but repeated interruption from the day.",
      "This independent guide takes you from a clean system to a working first jump. You will install the binary, connect it to your shell, teach it a few directories, verify the result, and diagnose the mistakes that cause most new installations to fail. The upstream project, source code, release files, and definitive version-specific instructions remain on the official zoxide GitHub repository.",
    ],
    contentsLabel: "On this page",
    contents: [
      { href: "#what-zoxide-does", label: "What zoxide changes" },
      { href: "#install-zoxide", label: "Install the binary" },
      { href: "#activate-zoxide", label: "Activate your shell" },
      { href: "#first-zoxide-session", label: "Run a first session" },
      { href: "#zoxide-troubleshooting", label: "Fix common problems" },
      { href: "#zoxide-faq", label: "Read the FAQ" },
    ],
    overview: {
      title: "What zoxide changes—and what it does not",
      paragraphs: [
        "The regular cd command expects a path. That is ideal when you already know the location, when a script must be deterministic, or when you are moving to a nearby directory. zoxide adds a second navigation method for places you revisit. After it has seen a path such as ~/work/client-portal, typing z portal can select the best learned match and change into it.",
        "zoxide does not index every folder on the computer and it does not search file contents. Its database is built from directory visits observed by the shell hook. A fresh installation therefore has little to match; use cd normally for a short time or add a known directory explicitly, then zoxide becomes useful. The default setup creates z and zi commands while leaving cd available.",
      ],
      points: [
        {
          title: "Short queries",
          text: "Match meaningful fragments such as z api or z client docs instead of retyping a long absolute path.",
        },
        {
          title: "Habit-aware ranking",
          text: "Frequently and recently used directories receive stronger scores, so results adapt as your work changes.",
        },
        {
          title: "Local control",
          text: "The directory database lives on your machine. You can list entries, remove paths, exclude folders, or move the data location.",
        },
      ],
    },
    install: {
      title: "Step 1: install the zoxide binary",
      introduction:
        "Choose one method for your operating system. Package managers make upgrades and removal easier. On Linux, the upstream project recommends its install script because Debian and Ubuntu repository packages may be unavailable or outdated; read a remote script before running it if your security policy requires review.",
      methods: [
        {
          title: "macOS with Homebrew",
          bestFor: "Best for most macOS users who already use Homebrew.",
          command: "brew install zoxide",
          note: "Homebrew installs the binary but does not edit your shell profile. Complete Step 2 below.",
        },
        {
          title: "Ubuntu, Debian, or WSL",
          bestFor: "The installation path recommended by the upstream project for Linux and WSL.",
          command: "curl -sSfL https://raw.githubusercontent.com/ajeetdsouza/zoxide/main/install.sh | sh",
          note: "The installer commonly places zoxide under your user account. Follow any PATH instruction printed at the end, then open a new terminal.",
        },
        {
          title: "Windows with winget",
          bestFor: "Recommended upstream option for a normal Windows PowerShell setup.",
          command: "winget install ajeetdsouza.zoxide",
          note: "Scoop users can run scoop install zoxide instead. Restart the terminal if the updated PATH is not visible immediately.",
        },
      ],
      verification:
        "Before changing a profile, run zoxide --version. A version number proves the binary is installed and reachable through PATH. If this command fails, shell initialization is not yet the problem—fix the installation or PATH first.",
    },
    activate: {
      title: "Step 2: activate zoxide in your shell",
      introduction:
        "Installing the executable is only half of the setup. z and zi are shell functions generated by zoxide init, so the matching initialization line must run whenever a new shell starts. Add the line to the end of the correct profile rather than pasting it only into the current terminal.",
      shells: [
        {
          name: "Bash",
          profile: "Add to ~/.bashrc",
          command: 'eval "$(zoxide init bash)"',
        },
        {
          name: "Zsh",
          profile: "Add to ~/.zshrc, after compinit when completions are enabled",
          command: 'eval "$(zoxide init zsh)"',
        },
        {
          name: "Fish",
          profile: "Add to ~/.config/fish/config.fish",
          command: "zoxide init fish | source",
        },
        {
          name: "PowerShell",
          profile: "Add to the file shown by $PROFILE",
          command: "Invoke-Expression (& { (zoxide init powershell | Out-String) })",
        },
      ],
      verification:
        "Open a new terminal after saving the profile. Then run z --help. If zoxide --version works but z does not, the binary is fine and the profile line was either added to the wrong file, did not run, or was overwritten by a later alias or plugin.",
    },
    firstSession: {
      title: "Step 3: complete a first zoxide session",
      introduction: [
        "A directory jumper needs history before it can make a good choice. Visit two or three real directories with cd, returning to the shell prompt after each change. The default hook records directory changes as you work. For a predictable test, use folders with distinctive names rather than several paths that all end in src.",
        "Suppose you have already visited ~/work/client-portal and ~/work/internal-api. The commands below cover the normal daily workflow. Exact behavior depends on the paths in your own database, so inspect a query before relying on it in an automated command.",
      ],
      commands: [
        { command: "z portal", purpose: "Jump to the highest-ranked learned directory matching portal." },
        { command: "z client portal", purpose: "Use more than one fragment to disambiguate similar directory names." },
        { command: "zi work", purpose: "Choose interactively with fzf. Install fzf separately before using zi." },
        { command: "z -", purpose: "Return to the previous directory, similar to cd -." },
        { command: "zoxide query portal", purpose: "Print the directory that a query would select without changing directory." },
        { command: "zoxide query --list", purpose: "List learned directories so you can inspect the local database." },
        { command: "zoxide add ~/work/client-portal", purpose: "Add a directory explicitly when you want a repeatable first test." },
        { command: "zoxide remove ~/old/project", purpose: "Remove an obsolete or sensitive path from the database." },
      ],
      learningTitle: "Why the selected directory can change",
      learning: [
        "zoxide uses a frecency-style score: visits raise a directory's rank, recent use matters, and aging prevents the database from being permanently dominated by old work. That makes a short query adapt to current habits, but it also means z project is not a stable substitute for an exact path inside scripts. Use cd with an absolute path in automation and reserve z for interactive navigation.",
        "When two directories match the same fragment, provide another part of the path or use zi to inspect the candidates. This is usually faster and safer than trying to force a single generic word to select the same folder forever.",
      ],
    },
    troubleshooting: {
      title: "Fix the five most common setup problems",
      introduction:
        "Diagnose the setup in layers: first the executable, then the shell integration, then the learned data. Changing all three at once makes a simple mistake harder to see.",
      items: [
        {
          title: "zoxide: command not found",
          text: "The executable is missing from PATH or installation did not finish. On macOS or Linux, run command -v zoxide; in PowerShell, run Get-Command zoxide. Reopen the terminal after a package manager changes PATH.",
          command: "zoxide --version",
        },
        {
          title: "z: command not found, but zoxide works",
          text: "The init line did not load. Confirm which shell is actually running, edit that shell's profile, place the line near the end, and start a new session. Sourcing ~/.bashrc will not fix a Zsh session, and editing $PROFILE has no effect in Git Bash.",
        },
        {
          title: "No match found",
          text: "The directory has not been learned, the query is too specific, or the path was removed. Visit it with cd and return to a prompt, add it with zoxide add, or inspect zoxide query --list. Start with one distinctive fragment.",
        },
        {
          title: "The wrong directory wins",
          text: "Add a second query term, choose with zi, or remove a stale entry. Do not delete the whole database for one bad match; ranking improves through normal use and targeted cleanup.",
        },
        {
          title: "zi fails or opens no selector",
          text: "Interactive selection depends on fzf, which is optional and installed separately. Confirm fzf --version, then reopen the shell. Plain z queries continue to work without fzf.",
          command: "fzf --version",
        },
      ],
    },
    workflow: {
      title: "Choose the right navigation tool for each job",
      introduction:
        "zoxide is most useful as a complement to familiar shell navigation. The best workflow is not to replace every cd command, but to use the least surprising tool for the distance and context.",
      choices: [
        {
          title: "Use cd for exact or nearby paths",
          text: "Prefer cd .., cd ../sibling, or an absolute path when precision matters, when the destination has not been visited, and inside scripts, aliases shared with a team, CI jobs, or documentation that must behave identically for everyone.",
        },
        {
          title: "Use z for known destinations",
          text: "Use z when you remember a distinctive piece of a directory name and have visited it before. It is ideal for jumping between several active repositories, a notes folder, dotfiles, and recurring client work.",
        },
        {
          title: "Use zi when several matches are plausible",
          text: "The interactive list makes ambiguity visible. It is a good choice when a machine contains many similarly named repositories or when you want to refresh your memory before moving.",
        },
      ],
      conclusion:
        "You do not need a complex configuration on day one. Keep the default z command, build a small amount of real history, and only then consider exclusions, a custom command prefix, data import from autojump, or editor integrations.",
    },
    faq: {
      title: "Frequently asked questions",
      items: [
        {
          question: "Does zoxide replace cd?",
          answer:
            "Not by default. Shell initialization creates z and zi while the normal cd command remains available. z also accepts several path-like inputs, but keeping cd is useful for exact navigation and scripts. Advanced users can change the generated command prefix, including replacing cd, after understanding the tradeoff.",
        },
        {
          question: "Does zoxide scan or upload my filesystem?",
          answer:
            "zoxide maintains a local database of directory paths observed by its shell hook. It is not a file-content search engine. Because directory names can still reveal project or client information, review entries with zoxide query --list, remove paths you do not want stored, and configure excluded directories when necessary.",
        },
        {
          question: "Why does zoxide need fzf?",
          answer:
            "The core z command does not need fzf. fzf powers interactive selection and some completion experiences, including zi. Install it if you want to see and choose among candidates; skip it if direct ranked jumps are enough.",
        },
        {
          question: "Can I migrate from autojump?",
          answer:
            "Yes. Current zoxide releases include an import command for autojump data, so you do not necessarily have to rebuild all history manually. Keep the old tool until you have verified the imported results and shell profile, then remove the old initialization to avoid command or prompt-hook conflicts.",
        },
        {
          question: "Is zoxide.org the official project website?",
          answer:
            "No. zoxide.org is an independent educational site and is not affiliated with or endorsed by the zoxide maintainers. Use the upstream GitHub repository for source code, releases, security review, and authoritative version-specific documentation.",
        },
        {
          question: "How do I uninstall zoxide cleanly?",
          answer:
            "Remove the zoxide init line from your shell profile first, uninstall the package with the same manager used for installation, and open a new shell. The local database may remain in your platform's data directory; inspect and remove it separately only if you no longer need the history.",
        },
      ],
    },
    next: {
      title: "Continue with a focused guide",
      description:
        "Once the basic jump works, use a focused page for platform-specific details or a problem you can reproduce. These guides add depth without making the first setup more complicated.",
      links: [
        { href: "/tutorials/install-ubuntu", title: "Install on Ubuntu 24.04", description: "Choose apt or the upstream installer, then verify PATH and shell setup." },
        { href: "/blog/zoxide-command-not-found", title: "Fix command not found", description: "A step-by-step diagnostic path for every major shell." },
        { href: "/tools/zoxide-doctor", title: "Run zoxide-doctor", description: "Check PATH, shell initialization, profile setup, and optional fzf support with one local command." },
        { href: "/tutorials/fzf-integration", title: "Add fzf selection", description: "Set up interactive directory picking after z works." },
        { href: "/blog/zoxide-vs-autojump", title: "Compare with autojump", description: "Choose a tool and plan a low-risk migration." },
      ],
    },
  },
  zh: {
    eyebrow: "从这里开始",
    title: "不离开本页，完成 zoxide 的安装与第一次跳转",
    introduction: [
      "zoxide 是为终端用户设计的目录跳转工具。它记录你真正访问过的目录，并综合访问频率与最近使用情况进行排序。以后从一个项目切到另一个项目时，不必再输入完整路径，只要给出能辨认目标的几个字符即可。对于每天在代码仓库、配置目录、下载目录和客户项目之间来回切换的人，这能减少大量重复输入。",
      "这份独立教程从空白环境开始，依次完成二进制安装、Shell 初始化、目录学习、结果验证和常见故障排查。zoxide 的源代码、发行文件和与具体版本有关的最终说明，仍应以上游官方 GitHub 仓库为准。",
    ],
    contentsLabel: "本页内容",
    contents: [
      { href: "#what-zoxide-does", label: "理解 zoxide" },
      { href: "#install-zoxide", label: "安装程序" },
      { href: "#activate-zoxide", label: "初始化 Shell" },
      { href: "#first-zoxide-session", label: "完成第一次使用" },
      { href: "#zoxide-troubleshooting", label: "排查常见问题" },
      { href: "#zoxide-faq", label: "常见问答" },
    ],
    overview: {
      title: "zoxide 改变了什么，又没有改变什么",
      paragraphs: [
        "普通 cd 命令要求你给出路径。当你已经知道准确位置、脚本需要确定性，或目标就在相邻目录时，cd 仍然是最合适的工具。zoxide 增加的是另一种导航方式：当它见过 ~/work/client-portal 后，输入 z portal 就能根据本机数据库找到最符合当前习惯的目录。",
        "zoxide 不会扫描电脑上的所有文件夹，也不会搜索文件内容。它的数据库来自 Shell 钩子观察到的目录访问，因此刚安装时几乎没有可匹配的数据。先照常使用 cd 访问几个真实目录，或手动添加一个目录，之后再使用 z。默认配置只新增 z 和 zi，不会删除 cd。",
      ],
      points: [
        { title: "短关键词跳转", text: "用 z api 或 z client docs 这样的片段匹配目录，不必反复输入绝对路径。" },
        { title: "随习惯调整", text: "经常访问且近期使用的目录分数更高，工作重心改变后，排序也会逐渐变化。" },
        { title: "数据留在本机", text: "目录数据库保存在你的设备上，可以列出、删除、排除目录，也可以更改保存位置。" },
      ],
    },
    install: {
      title: "第一步：安装 zoxide 二进制程序",
      introduction:
        "按操作系统选择一种方式即可。包管理器更方便升级和卸载。Linux 上游目前推荐官方安装脚本，因为 Debian、Ubuntu 软件源中的包可能不可用或较旧；如果你的安全规范不允许直接执行远程脚本，请先下载并审查脚本内容。",
      methods: [
        { title: "macOS + Homebrew", bestFor: "适合已经使用 Homebrew 的 macOS 用户。", command: "brew install zoxide", note: "Homebrew 只安装程序，不会自动修改 Shell 配置，请继续完成第二步。" },
        { title: "Ubuntu、Debian 或 WSL", bestFor: "上游项目当前为 Linux 和 WSL 推荐的安装路径。", command: "curl -sSfL https://raw.githubusercontent.com/ajeetdsouza/zoxide/main/install.sh | sh", note: "留意安装结束时输出的 PATH 提示，完成后重新打开终端。" },
        { title: "Windows + winget", bestFor: "适合普通 Windows PowerShell 环境，也是上游推荐方式。", command: "winget install ajeetdsouza.zoxide", note: "使用 Scoop 时可改为 scoop install zoxide。PATH 未立即更新时请重启终端。" },
      ],
      verification:
        "修改配置文件前先运行 zoxide --version。能看到版本号，说明程序已经安装且 PATH 正常。如果这一步失败，问题还不在 Shell 初始化，应先修复安装或 PATH。",
    },
    activate: {
      title: "第二步：在当前 Shell 中启用 zoxide",
      introduction:
        "安装可执行文件只完成了一半。z 和 zi 是 zoxide init 生成的 Shell 函数，因此每次启动新终端时都要执行相应的初始化命令。请把命令写入正确的配置文件末尾，而不是只在当前窗口临时执行一次。",
      shells: [
        { name: "Bash", profile: "添加到 ~/.bashrc", command: 'eval "$(zoxide init bash)"' },
        { name: "Zsh", profile: "添加到 ~/.zshrc；启用补全时放在 compinit 之后", command: 'eval "$(zoxide init zsh)"' },
        { name: "Fish", profile: "添加到 ~/.config/fish/config.fish", command: "zoxide init fish | source" },
        { name: "PowerShell", profile: "添加到 $PROFILE 显示的文件", command: "Invoke-Expression (& { (zoxide init powershell | Out-String) })" },
      ],
      verification:
        "保存后打开新终端，运行 z --help。如果 zoxide --version 正常、但 z 不存在，说明二进制没有问题；通常是配置写错文件、配置未被加载，或后面的别名/插件覆盖了 z。",
    },
    firstSession: {
      title: "第三步：完成一次真实的 zoxide 使用流程",
      introduction: [
        "目录跳转工具先要有历史记录，才能给出合理结果。用 cd 访问两三个真实目录，每次切换后回到命令提示符。默认钩子会在目录变化时记录路径。第一次测试最好选择名称明显不同的目录，避免多个目标都叫 src。",
        "假设你已经访问过 ~/work/client-portal 和 ~/work/internal-api，下面这些命令覆盖日常最常用的场景。最终匹配结果取决于你自己的数据库；自动化脚本需要确定路径时，不要依赖动态排名。",
      ],
      commands: [
        { command: "z portal", purpose: "跳到数据库中排名最高、且匹配 portal 的目录。" },
        { command: "z client portal", purpose: "使用多个片段区分名称相近的目录。" },
        { command: "zi work", purpose: "通过 fzf 交互选择；使用 zi 前要单独安装 fzf。" },
        { command: "z -", purpose: "返回上一个目录，作用类似 cd -。" },
        { command: "zoxide query portal", purpose: "只查看查询会选中哪个目录，不执行跳转。" },
        { command: "zoxide query --list", purpose: "列出已经学习的目录，检查本机数据库。" },
        { command: "zoxide add ~/work/client-portal", purpose: "手动添加目录，适合做可重复的首次测试。" },
        { command: "zoxide remove ~/old/project", purpose: "移除过期或不希望保留的目录记录。" },
      ],
      learningTitle: "为什么同一个关键词的结果可能变化",
      learning: [
        "zoxide 使用类似 frecency 的评分方式：访问会提高分数，近期使用更重要，老数据会逐渐衰减。因此 z project 会跟随你的工作习惯变化，但也不适合在脚本中替代固定绝对路径。交互操作用 z，自动化和团队共享命令仍用明确的 cd 路径。",
        "当多个目录匹配同一个词时，增加另一个路径片段，或用 zi 查看候选项。这样通常比强迫一个过于宽泛的关键词永远命中同一目录更可靠。",
      ],
    },
    troubleshooting: {
      title: "五个最常见问题的排查顺序",
      introduction: "按层次检查：先确认程序存在，再确认 Shell 集成，最后检查学习数据。一次同时修改三处，会让很小的配置错误更难发现。",
      items: [
        { title: "提示 zoxide: command not found", text: "程序不在 PATH，或安装没有完成。macOS/Linux 用 command -v zoxide，PowerShell 用 Get-Command zoxide。包管理器更新 PATH 后要重新打开终端。", command: "zoxide --version" },
        { title: "zoxide 可用，但 z: command not found", text: "初始化行没有加载。先确认当前实际使用的 Shell，再编辑对应配置文件，把初始化命令放到靠后位置并新开会话。编辑 ~/.bashrc 不会修复 Zsh，修改 $PROFILE 也不会影响 Git Bash。" },
        { title: "提示没有匹配结果", text: "目标目录尚未被学习、关键词过窄，或记录已删除。先用 cd 访问一次并回到提示符，也可以用 zoxide add 添加，再用 zoxide query --list 检查。" },
        { title: "总是跳到错误目录", text: "增加第二个关键词、用 zi 手动选择，或只删除那条过期记录。不必因为一个错误匹配就清空整个数据库，正常使用和定向清理会逐渐改善排序。" },
        { title: "zi 没有选择界面", text: "交互选择依赖单独安装的 fzf。先确认 fzf --version，再重启 Shell。没有 fzf 时，普通 z 查询仍然可以工作。", command: "fzf --version" },
      ],
    },
    workflow: {
      title: "不同场景选择不同的目录导航方式",
      introduction: "zoxide 最适合作为传统 Shell 导航的补充。不要把所有 cd 都替换掉，而要根据距离、上下文和确定性选择最不意外的工具。",
      choices: [
        { title: "准确路径或相邻目录用 cd", text: "cd ..、cd ../sibling 和绝对路径最适合目标明确、目录从未访问过，或用于脚本、CI、团队共享命令和必须对所有人保持一致的文档。" },
        { title: "常去的远距离目录用 z", text: "记得目录名的一部分、且过去访问过时使用 z。它特别适合在多个活跃仓库、笔记目录、dotfiles 和固定客户项目之间切换。" },
        { title: "可能有多个匹配时用 zi", text: "交互列表会把歧义直接展示出来。机器上有大量同名仓库，或跳转前想先确认目标时，zi 更稳妥。" },
      ],
      conclusion: "第一天不需要复杂配置。先保留默认 z 命令，积累一小段真实历史；确认基础流程稳定后，再考虑排除目录、自定义命令前缀、导入 autojump 数据或编辑器集成。",
    },
    faq: {
      title: "常见问题",
      items: [
        { question: "zoxide 会替换 cd 吗？", answer: "默认不会。初始化只新增 z 和 zi，原来的 cd 仍然可用。z 也能处理部分普通路径，但 cd 在精确跳转和脚本中依然重要。高级用户理解取舍后，可以更改生成命令的前缀，甚至替换 cd。" },
        { question: "zoxide 会扫描或上传我的文件系统吗？", answer: "zoxide 维护的是 Shell 钩子观察到的本地目录路径数据库，不会搜索文件内容。目录名仍可能暴露客户或项目名称，因此可以用 zoxide query --list 检查、删除不想保存的路径，并按需配置排除目录。" },
        { question: "为什么还要安装 fzf？", answer: "普通 z 命令不依赖 fzf。fzf 用于 zi 和部分交互补全，让你能从多个候选目录中查看并选择。如果直接按排名跳转已经够用，可以不安装。" },
        { question: "能从 autojump 迁移吗？", answer: "可以。当前 zoxide 提供 autojump 数据导入命令，不必完全从零积累历史。确认导入结果和新配置正常前先保留旧工具，验证后再移除旧初始化，避免命令或提示符钩子冲突。" },
        { question: "zoxide.org 是官方项目官网吗？", answer: "不是。zoxide.org 是独立教育站点，与 zoxide 维护者不存在隶属或背书关系。源代码、发行文件、安全审查和具体版本的权威说明，请以上游 GitHub 仓库为准。" },
        { question: "怎样完整卸载 zoxide？", answer: "先从 Shell 配置中删除 zoxide init 行，再用原安装包管理器卸载程序，并打开新终端。本地数据库可能仍留在系统数据目录；确认不再需要历史记录后再单独删除。" },
      ],
    },
    next: {
      title: "继续阅读针对性指南",
      description: "基础跳转正常后，再根据操作系统或可以稳定复现的问题进入专题页。这样能增加必要深度，又不会让第一次安装过度复杂。",
      links: [
        { href: "/tutorials/install-ubuntu", title: "Ubuntu 24.04 安装", description: "选择 apt 或上游脚本，再检查 PATH 和 Shell 配置。" },
        { href: "/blog/zoxide-command-not-found", title: "修复 command not found", description: "覆盖主要 Shell 的逐步诊断流程。" },
        { href: "/tools/zoxide-doctor", title: "运行 zoxide-doctor", description: "用一条本地命令检查 PATH、Shell 初始化、配置文件和可选 fzf。" },
        { href: "/tutorials/fzf-integration", title: "添加 fzf 交互选择", description: "确认 z 可用后再配置目录选择器。" },
        { href: "/blog/zoxide-vs-autojump", title: "与 autojump 比较", description: "选择工具并规划低风险迁移。" },
      ],
    },
  },
  ja: {
    eyebrow: "ここから始める",
    title: "このページだけで zoxide の導入と最初のジャンプを完了する",
    introduction: [
      "zoxide は、ターミナルを日常的に使う人向けのディレクトリジャンパーです。実際に訪れたディレクトリを記録し、頻度と最近の利用状況を組み合わせて順位付けします。プロジェクト、リポジトリ、設定フォルダーの間を移動するとき、長いパスの代わりに短い断片を入力できます。",
      "この独立ガイドでは、バイナリのインストール、シェル連携、学習用の初回操作、確認、よくある失敗の切り分けまでを順番に進めます。ソースコード、リリース、バージョン固有の正式な説明は、上流の zoxide GitHub リポジトリを確認してください。",
    ],
    contentsLabel: "このページの内容",
    contents: [
      { href: "#what-zoxide-does", label: "zoxide の役割" },
      { href: "#install-zoxide", label: "バイナリを入れる" },
      { href: "#activate-zoxide", label: "シェルを設定する" },
      { href: "#first-zoxide-session", label: "最初の操作" },
      { href: "#zoxide-troubleshooting", label: "問題を切り分ける" },
      { href: "#zoxide-faq", label: "FAQ" },
    ],
    overview: {
      title: "zoxide が変えること、変えないこと",
      paragraphs: [
        "通常の cd はパスを指定します。正確な場所が分かる場合、スクリプトで結果を固定したい場合、近くのディレクトリへ移る場合には cd が最適です。zoxide は、繰り返し訪れる場所への別ルートを追加します。~/work/client-portal を学習した後なら、z portal で候補を評価して移動できます。",
        "zoxide は全フォルダーやファイル内容を走査しません。データベースはシェルフックが観測した訪問履歴から作られるため、導入直後は候補がほとんどありません。最初は cd で実際のディレクトリを訪れるか、既知のパスを明示的に追加します。既定設定では z と zi が加わり、cd は残ります。",
      ],
      points: [
        { title: "短いクエリ", text: "z api や z client docs のような断片で、長い絶対パスの再入力を減らします。" },
        { title: "習慣に沿う順位", text: "頻繁で最近使った場所が強くなり、作業の変化に合わせて結果も更新されます。" },
        { title: "ローカルで管理", text: "ディレクトリデータは端末内にあり、一覧、削除、除外、保存先変更が可能です。" },
      ],
    },
    install: {
      title: "手順1：zoxide バイナリをインストール",
      introduction: "OS ごとに一つの方法を選びます。パッケージマネージャーは更新と削除が簡単です。Linux では、Debian/Ubuntu のパッケージが利用できない、または古い場合があるため、上流はインストールスクリプトを推奨しています。組織の規則に応じて実行前に内容を確認してください。",
      methods: [
        { title: "macOS + Homebrew", bestFor: "すでに Homebrew を使っている macOS ユーザー向け。", command: "brew install zoxide", note: "バイナリだけが入ります。シェル設定は次の手順で追加します。" },
        { title: "Ubuntu、Debian、WSL", bestFor: "上流が Linux/WSL 向けに案内する方法。", command: "curl -sSfL https://raw.githubusercontent.com/ajeetdsouza/zoxide/main/install.sh | sh", note: "最後に表示される PATH の案内を確認し、新しいターミナルを開きます。" },
        { title: "Windows + winget", bestFor: "標準的な Windows PowerShell 環境向けの推奨方法。", command: "winget install ajeetdsouza.zoxide", note: "Scoop なら scoop install zoxide も利用できます。PATH 反映後にターミナルを再起動します。" },
      ],
      verification: "設定ファイルを変更する前に zoxide --version を実行します。バージョン番号が出れば、バイナリと PATH は正常です。ここで失敗する場合、シェル初期化ではなくインストール側を直します。",
    },
    activate: {
      title: "手順2：利用中のシェルで zoxide を有効化",
      introduction: "実行ファイルを入れただけでは z と zi は作られません。これらは zoxide init が生成するシェル関数です。現在の画面で一度だけ実行するのではなく、対応する設定ファイルの末尾に追加してください。",
      shells: [
        { name: "Bash", profile: "~/.bashrc に追加", command: 'eval "$(zoxide init bash)"' },
        { name: "Zsh", profile: "~/.zshrc に追加。補完利用時は compinit の後", command: 'eval "$(zoxide init zsh)"' },
        { name: "Fish", profile: "~/.config/fish/config.fish に追加", command: "zoxide init fish | source" },
        { name: "PowerShell", profile: "$PROFILE が示すファイルに追加", command: "Invoke-Expression (& { (zoxide init powershell | Out-String) })" },
      ],
      verification: "保存後に新しいターミナルを開き、z --help を実行します。zoxide --version は動くのに z がない場合は、設定ファイルが違う、読み込まれていない、後続のエイリアスやプラグインに上書きされた、のいずれかです。",
    },
    firstSession: {
      title: "手順3：最初の zoxide セッションを完了",
      introduction: [
        "良い候補を返すには履歴が必要です。cd で実在する二、三個のディレクトリを訪れ、変更ごとにプロンプトへ戻ります。最初の確認では、すべて src という名前のパスではなく、区別しやすい名前を選びます。",
        "すでに ~/work/client-portal と ~/work/internal-api を訪れたと仮定すると、次のコマンドで日常操作を確認できます。結果は各端末のデータベースで変わるため、自動処理では明示的なパスを使ってください。",
      ],
      commands: [
        { command: "z portal", purpose: "portal に一致する学習済みディレクトリの最上位へ移動。" },
        { command: "z client portal", purpose: "複数断片で似た候補を区別。" },
        { command: "zi work", purpose: "fzf で対話選択。zi の前に fzf を別途導入。" },
        { command: "z -", purpose: "cd - と同様に直前のディレクトリへ戻る。" },
        { command: "zoxide query portal", purpose: "移動せず、選択予定のパスを表示。" },
        { command: "zoxide query --list", purpose: "学習済みディレクトリを一覧表示。" },
        { command: "zoxide add ~/work/client-portal", purpose: "再現可能な初回確認用にパスを明示追加。" },
        { command: "zoxide remove ~/old/project", purpose: "不要または保存したくないパスを削除。" },
      ],
      learningTitle: "選ばれるディレクトリが変わる理由",
      learning: [
        "zoxide は frecency 型のスコアを使い、訪問、最近の利用、時間経過を反映します。現在の習慣に適応する一方、z project はスクリプト内の固定パスには向きません。対話操作では z、CI や共有スクリプトでは明示的な cd を使います。",
        "同じ断片に複数候補があるときは、別のパス要素を追加するか zi で候補を確認します。広すぎる一語を常に同じ場所へ固定するより安全です。",
      ],
    },
    troubleshooting: {
      title: "よくある五つの問題を順番に切り分ける",
      introduction: "バイナリ、シェル連携、学習データの順に確認します。三つを同時に変更すると、小さな設定ミスが見つけにくくなります。",
      items: [
        { title: "zoxide: command not found", text: "PATH に実行ファイルがないか、インストールが未完了です。macOS/Linux は command -v zoxide、PowerShell は Get-Command zoxide で確認し、PATH 更新後にターミナルを開き直します。", command: "zoxide --version" },
        { title: "zoxide は動くが z がない", text: "init 行が読み込まれていません。実際のシェルを確認し、対応する設定の末尾に追加して新しいセッションを開始します。Bash の設定は Zsh に、PowerShell の $PROFILE は Git Bash に適用されません。" },
        { title: "一致する候補がない", text: "未学習、クエリが細かすぎる、または記録が削除されています。cd で訪れてプロンプトへ戻る、zoxide add で追加する、zoxide query --list で確認する、の順で試します。" },
        { title: "別のディレクトリへ飛ぶ", text: "二つ目の語を追加する、zi で選ぶ、古い一件だけを削除する方法があります。一つの誤一致でデータベース全体を消す必要はありません。" },
        { title: "zi の選択画面が出ない", text: "対話選択には別途 fzf が必要です。fzf --version を確認してシェルを再起動します。fzf がなくても通常の z は使えます。", command: "fzf --version" },
      ],
    },
    workflow: {
      title: "場面ごとに適切な移動方法を選ぶ",
      introduction: "zoxide は従来のシェル移動を補う道具です。すべての cd を置き換えず、距離、文脈、結果の確実性に合わせます。",
      choices: [
        { title: "正確・近距離は cd", text: "cd ..、cd ../sibling、絶対パスは、未訪問の場所、スクリプト、CI、チーム共有コマンド、全員で同じ結果が必要な手順に適します。" },
        { title: "既知の遠い場所は z", text: "名前の一部を覚えていて、以前訪問した場所に使います。複数のリポジトリ、ノート、dotfiles、定期的な案件の切り替えに向きます。" },
        { title: "候補が多いときは zi", text: "対話一覧なら曖昧さが見えます。同名リポジトリが多い端末や、移動前に候補を確かめたい場合に適します。" },
      ],
      conclusion: "初日から複雑な設定は不要です。既定の z で実際の履歴を少し作り、安定してから除外、コマンド名変更、autojump データの移行、エディター連携を検討します。",
    },
    faq: {
      title: "よくある質問",
      items: [
        { question: "zoxide は cd を置き換えますか？", answer: "既定では置き換えません。z と zi が追加され、cd は残ります。正確な移動やスクリプトには cd が重要です。仕組みを理解した上で、生成するコマンド接頭辞を変更することはできます。" },
        { question: "ファイルシステムを走査・送信しますか？", answer: "シェルフックが観測したディレクトリパスをローカルデータベースに保存し、ファイル内容は検索しません。パス名に案件情報が含まれる場合は一覧を確認し、不要な記録を削除または除外します。" },
        { question: "fzf は必須ですか？", answer: "通常の z には不要です。fzf は zi と一部の対話補完で候補を表示・選択するために使います。順位付きジャンプだけで十分なら導入しなくても構いません。" },
        { question: "autojump から移行できますか？", answer: "現在の zoxide には autojump データの import が用意されています。結果と新しいシェル設定を確認するまで旧ツールを残し、その後で古い初期化を外すと競合を避けられます。" },
        { question: "zoxide.org は公式サイトですか？", answer: "いいえ。zoxide.org は独立した教育サイトで、zoxide の保守者による運営・承認ではありません。ソース、リリース、セキュリティ、版ごとの正式情報は上流 GitHub を参照してください。" },
        { question: "完全に削除する方法は？", answer: "シェル設定から zoxide init 行を削除し、導入に使ったパッケージマネージャーでアンインストールして、新しいシェルを開きます。履歴が不要なら、残ったローカルデータベースも別途確認して削除します。" },
      ],
    },
    next: {
      title: "目的別ガイドへ進む",
      description: "基本ジャンプが動いたら、OS 固有の詳細や再現できる問題に合わせて個別ガイドを利用してください。初回設定を複雑にせず、必要な深さだけ追加できます。",
      links: [
        { href: "/tutorials/install-ubuntu", title: "Ubuntu 24.04 への導入", description: "apt と上流スクリプトを選び、PATH とシェル設定を確認。" },
        { href: "/blog/zoxide-command-not-found", title: "command not found を直す", description: "主要シェル向けの段階的な診断。" },
        { href: "/tools/zoxide-doctor", title: "zoxide-doctor を実行", description: "PATH、シェル初期化、プロファイル、任意の fzf を1つのローカルコマンドで確認。" },
        { href: "/tutorials/fzf-integration", title: "fzf 選択を追加", description: "z の動作確認後に対話選択を設定。" },
        { href: "/blog/zoxide-vs-autojump", title: "autojump と比較", description: "ツール選択と安全な移行を検討。" },
      ],
    },
  },
};

export function getHomeGuide(locale: string): HomeGuideContent {
  return homeGuides[locale] || homeGuides.en;
}
