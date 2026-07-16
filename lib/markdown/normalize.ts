export function stripLeadingH1(content: string | undefined): string | undefined {
  if (!content) return content;

  // Remove ATX H1: lines starting with "# " and following blank line(s)
  const removedAtx = content.replace(/^\s*#\s.+(\r?\n)+/, '');

  // Remove Setext H1: title line followed by a line of ===
  const lines = removedAtx.split(/\r?\n/);
  if (lines.length >= 2 && /^=+$/.test(lines[1].trim())) {
    return lines.slice(2).join('\n');
  }

  return removedAtx;
}

/**
 * Correct duplicated, outdated factual snippets at render time without changing
 * article titles, metadata, slugs, keywords, or source-language routing.
 */
export function normalizeZoxideFacts(content: string | undefined): string | undefined {
  if (!content) return content;

  const replacements: Array<[string | RegExp, string]> = [
    [/sudo apt update && sudo apt install zoxide/g, 'curl -sSfL https://raw.githubusercontent.com/ajeetdsouza/zoxide/main/install.sh | sh'],
    [/sudo apt install zoxide/g, 'curl -sSfL https://raw.githubusercontent.com/ajeetdsouza/zoxide/main/install.sh | sh'],
    [/curl -sS https:\/\/raw\.githubusercontent\.com\/ajeetdsouza\/zoxide\/main\/install\.sh \| bash/g, 'curl -sSfL https://raw.githubusercontent.com/ajeetdsouza/zoxide/main/install.sh | sh'],
    [/cargo install zoxide(?! --locked)/g, 'cargo install zoxide --locked'],
    [/~\/\.zo(?![A-Za-z0-9_-])/g, '~/.local/share/zoxide/db.zo'],
    [
      /the `\.zo` file in the user's home directory/gi,
      'the platform data directory (for example, `~/.local/share/zoxide/db.zo` on Linux)',
    ],
    [
      /用户主目录下的 `\.zo` 文件/g,
      '平台数据目录（例如 Linux 上的 `~/.local/share/zoxide/db.zo`）',
    ],
    [/zoxide remove -i/g, 'zoxide remove /full/path/to/directory'],
    [/Maximum history age/g, 'Database aging threshold'],
    [/Keep roughly one year of history/g, 'Use a lower database aging threshold'],
    [
      /This controls how long entries stay in the database\./g,
      'This sets the maximum total frecency score used by the database aging algorithm.',
    ],
    [
      /这控制了条目在数据库中保留的时间。/g,
      '它设置数据库老化算法使用的最大总 frecency 分数。',
    ],
    [/最大历史记录天数/g, '数据库老化阈值'],
    [/最大历史记录为 5000 天/g, '数据库老化阈值设为 5000'],
    [/只保留最近 1 年的记录/g, '降低数据库老化阈值'],
    [/Team Collaboration/g, 'Configuration Portability'],
    [/Team collaboration/g, 'Configuration portability'],
    [/团队协作/g, '配置迁移'],
    [/チームコラボレーション/g, '設定の移行'],
    [/团队共享数据库/g, '团队共享配置'],
    [/### 共享数据库/g, '### 独立数据库与配置迁移'],
    [/# 使用共享数据库位置/g, '# 使用每位用户的独立数据库位置'],
    [/团队成员可以共享常用目录/g, '团队成员可以共享配置说明，但不要并发写入同一数据库'],
    [/共享数据库/g, '独立数据库'],
    [/shared database/gi, 'separate per-user database'],
    [/共有データベース/g, 'ユーザー別データベース'],
    [/\/shared\/path\/zoxide/g, '$HOME/.local/share/zoxide'],
    [/\/shared\/zoxide/g, '$HOME/.local/share/zoxide'],
    [
      /10x faster than traditional `cd` command/gi,
      'optimized for fast directory matching and fewer keystrokes than manual `cd` navigation',
    ],
    [
      /10x faster than traditional cd command/gi,
      'optimized for fast directory matching and fewer keystrokes than manual cd navigation',
    ],
    [
      /比传统 `cd` 命令快 10 倍以上/g,
      '使用 Rust 编写并针对目录匹配进行了优化',
    ],
    [/zoxide 比 autojump 快 \*\*10 倍\*\*。/g, '实际性能会因设备、Shell 和数据规模而异，建议在本机进行可复现测试。'],
    [/従来の`?cd`?コマンドより10倍高速/g, '高速なディレクトリ照合向けに最適化'],
    [
      /- \*\*zoxide\*\*: ~5ms 启动时间\n- \*\*autojump\*\*: ~50ms 启动时间/g,
      '- **实际结果**：启动时间取决于设备、Shell 配置和数据库规模，请在相同环境中进行可复现测试',
    ],
    [
      /If you are chasing the keyword \*\*"zoxide download"\*\*, you probably want/g,
      'If you searched for **"zoxide download"**, you probably want',
    ],
    [
      /Why the "zoxide download" keyword matters/g,
      'What a safe zoxide download guide should cover',
    ],
    [
      /Search engines prefer a page that answers the user intent directly\./g,
      'A useful download guide should answer the installation and verification questions directly.',
    ],
    [
      /Search engines prefer pages that explain \*\*where\*\* to download, \*\*how\*\* to install, and \*\*how to verify\*\* success\. We cover all three\./g,
      'A useful download guide should clearly explain where to download, how to install, and how to verify success.',
    ],
    [
      /official download page: https:\/\/zoxide\.org\/en\/download/g,
      'zoxide.org download guide: https://zoxide.org/download/',
    ],
  ];

  return replacements.reduce(
    (normalized, [pattern, replacement]) => normalized.replace(pattern, replacement),
    content,
  );
}

