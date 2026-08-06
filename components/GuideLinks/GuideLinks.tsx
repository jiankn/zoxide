import { Link } from '@/i18n/routing';

type SupportedLocale = 'en' | 'zh' | 'ja';

interface GuideLinksProps {
  locale: string;
  currentPath: string;
}

const copy: Record<SupportedLocale, {
  eyebrow: string;
  title: string;
  description: string;
  guides: Array<{ href: string; title: string; description: string }>;
}> = {
  en: {
    eyebrow: 'Related learning path',
    title: 'Continue with a practical guide',
    description: 'Move from installation to daily use, troubleshooting, and tool selection without losing context.',
    guides: [
      {
        href: '/tutorials/install-ubuntu',
        title: 'Install zoxide on Ubuntu 24.04',
        description: 'Choose apt or the upstream installer, configure your shell, and verify the result.',
      },
      {
        href: '/tutorials/basic-commands',
        title: 'Learn the core commands',
        description: 'Use z, zi, query, add, and remove with predictable results.',
      },
      {
        href: '/blog/zoxide-command-not-found',
        title: 'Fix command-not-found errors',
        description: 'Separate PATH problems from missing shell initialization.',
      },
      {
        href: '/tutorials/fzf-integration',
        title: 'Set up interactive selection',
        description: 'Connect a compatible fzf release and use zi for ambiguous matches.',
      },
      {
        href: '/blog/zoxide-vs-autojump',
        title: 'Compare zoxide with autojump',
        description: 'Evaluate commands, platform support, and a low-risk migration path.',
      },
    ],
  },
  zh: {
    eyebrow: '相关学习路线',
    title: '接着解决下一个实际问题',
    description: '从安装、日常使用到故障排查和工具选择，沿着同一条内容线继续阅读。',
    guides: [
      {
        href: '/tutorials/install-ubuntu',
        title: '在 Ubuntu 24.04 安装 zoxide',
        description: '判断该选 apt 还是上游脚本，完成 Shell 配置并验证结果。',
      },
      {
        href: '/tutorials/basic-commands',
        title: '掌握常用命令',
        description: '理解 z、zi、query、add 和 remove 的实际用法。',
      },
      {
        href: '/blog/zoxide-command-not-found',
        title: '修复命令未找到',
        description: '区分 PATH 问题和 Shell 初始化缺失。',
      },
      {
        href: '/tutorials/fzf-integration',
        title: '配置交互式选择',
        description: '安装兼容版本的 fzf，用 zi 处理同名候选。',
      },
      {
        href: '/blog/zoxide-vs-autojump',
        title: '比较 zoxide 与 autojump',
        description: '按命令、平台支持和迁移成本选择工具。',
      },
    ],
  },
  ja: {
    eyebrow: '関連する学習ルート',
    title: '次の実践ガイドへ進む',
    description: 'インストール、日常操作、問題解決、ツール選びを同じ流れで確認できます。',
    guides: [
      {
        href: '/tutorials/install-ubuntu',
        title: 'Ubuntu 24.04 に zoxide を導入',
        description: 'apt と上流インストーラーを比較し、シェル設定と動作確認まで進めます。',
      },
      {
        href: '/tutorials/basic-commands',
        title: '基本コマンドを覚える',
        description: 'z、zi、query、add、remove を期待どおりに使います。',
      },
      {
        href: '/blog/zoxide-command-not-found',
        title: 'command not found を直す',
        description: 'PATH とシェル初期化の問題を切り分けます。',
      },
      {
        href: '/tutorials/fzf-integration',
        title: '対話選択を設定する',
        description: '対応する fzf を導入し、曖昧な候補を zi で選びます。',
      },
      {
        href: '/blog/zoxide-vs-autojump',
        title: 'zoxide と autojump を比較',
        description: 'コマンド、対応環境、移行手順から自分に合う方を選びます。',
      },
    ],
  },
};

export default function GuideLinks({ locale, currentPath }: GuideLinksProps) {
  const supportedLocale: SupportedLocale = locale === 'zh' || locale === 'ja' ? locale : 'en';
  const localizedCopy = copy[supportedLocale];
  const guides = localizedCopy.guides
    .filter((guide) => guide.href !== currentPath)
    .slice(0, 4);

  return (
    <section
      aria-labelledby="related-learning-path"
      className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-slate-50 p-6 md:p-8"
    >
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
        {localizedCopy.eyebrow}
      </p>
      <h2 id="related-learning-path" className="text-2xl font-bold text-slate-950">
        {localizedCopy.title}
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
        {localizedCopy.description}
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {guides.map((guide) => (
          <Link
            key={guide.href}
            href={guide.href}
            className="group rounded-xl border border-slate-200 bg-white p-4 transition hover:border-blue-300 hover:shadow-sm"
          >
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-700">
              {guide.title}
            </h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              {guide.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
