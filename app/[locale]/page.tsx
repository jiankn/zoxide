import Hero from '@/components/Hero/Hero';
import { Link } from '@/i18n/routing';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { generateMultilingualMetadata } from '@/lib/seo/metadata';
import { getHomeGuide } from '@/data/home-guide';
import { getPrimaryPaths } from '@/data/search-intents';

const installGuidePaths = [
  '/tutorials/install-macos',
  '/tutorials/install-ubuntu',
  '/tutorials/install-windows',
];

const contextualLinkCopy = {
  en: {
    features: 'Learn what zoxide is and how it ranks directories →',
    install: 'Open the full installation guide →',
    shell: 'Read the complete shell setup guide →',
    commands: 'Continue with the basic commands guide →',
    fix: 'Follow the detailed fix →',
    compare: 'Compare zoxide with autojump, z, and fasd →',
    faq: 'Read every FAQ and troubleshooting path →',
  },
  zh: {
    features: '了解 zoxide 是什么、如何给目录排序 →',
    install: '打开完整安装教程 →',
    shell: '阅读完整 Shell 配置教程 →',
    commands: '继续学习基础命令 →',
    fix: '查看详细排查步骤 →',
    compare: '对比 zoxide、autojump、z 与 fasd →',
    faq: '查看全部常见问题与排错入口 →',
  },
  ja: {
    features: 'zoxide の仕組みと順位付けを見る →',
    install: '詳しいインストール手順へ →',
    shell: 'シェル設定ガイドを読む →',
    commands: '基本コマンドガイドへ進む →',
    fix: '詳しい解決手順を見る →',
    compare: 'zoxide、autojump、z、fasd を比較 →',
    faq: 'FAQ とトラブル解決をすべて見る →',
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('seo');

  // 根据语言设置不同的描述（优化长度：155-160字符）
  const description = locale === 'en'
    ? 'Install zoxide on Ubuntu, macOS and Windows. Configure your shell and fzf, learn directory jumping, and fix common setup errors with this unofficial guide.'
    : 'zoxide 是一个智能的目录跳转工具，使用 Rust 编写，性能卓越。支持模糊搜索、学习你的使用习惯，让终端导航变得轻松高效。';

  // 生成多语言 SEO 元数据（包括 canonical 和 hreflang）
  // 直接从 params 获取 locale，确保 canonical URL 与 URL 路径一致
  return generateMultilingualMetadata(
    locale,
    '',
    {
      title: t('titles.home'),
      description,
      keywords: t('main'),
    }
  );
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  // 启用静态渲染 (SSG)
  setRequestLocale(locale);

  const t = (en: string, zh: string, ja: string) => locale === 'zh' ? zh : locale === 'ja' ? ja : en;
  const guide = getHomeGuide(locale);
  const linkCopy = contextualLinkCopy[locale === 'zh' || locale === 'ja' ? locale : 'en'];
  const primary = getPrimaryPaths(locale);
  const troubleshootingGuidePaths = [
    primary.commandNotFound,
    primary.init,
    primary.noMatch,
    primary.commands,
    primary.fzf,
  ];

  return (
    <div className="flex flex-col">
      {/* Hero 区域 */}
      <Hero />

      {/* 主内容区域 */}
      <div className="container mx-auto max-w-6xl px-5 pb-16 pt-8">
        <div className="space-y-16">
          <section className="rounded-2xl border border-blue-100 bg-blue-50/60 p-6 md:p-10">
            <h2 className="max-w-3xl text-3xl font-bold tracking-tight text-gray-950 md:text-4xl">
              {guide.title}
            </h2>
            <div className="mt-6 max-w-3xl space-y-4 text-lg leading-8 text-gray-700">
              {guide.introduction.slice(1).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <nav className="mt-8 border-t border-blue-100 pt-6" aria-label={guide.contentsLabel}>
              <p className="mb-3 text-sm font-semibold text-gray-900">{guide.contentsLabel}</p>
              <div className="flex flex-wrap gap-2">
                {guide.contents.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-800 transition-colors hover:border-blue-400 hover:bg-blue-100"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </nav>
          </section>

          <section id="what-zoxide-does" className="scroll-mt-24">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{guide.overview.title}</h2>
            <div className="max-w-3xl space-y-4 text-lg leading-8 text-gray-700">
              {guide.overview.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {guide.overview.points.map((point) => (
                <div key={point.title} className="rounded-xl border border-gray-200 bg-white p-5">
                  <h3 className="text-lg font-semibold text-gray-900">{point.title}</h3>
                  <p className="mt-2 leading-7 text-gray-600">{point.text}</p>
                </div>
              ))}
            </div>
            <Link href={primary.definition} className="mt-6 inline-block font-semibold text-blue-700 hover:text-blue-900">
              {linkCopy.features}
            </Link>
          </section>

          <section id="install-zoxide" className="scroll-mt-24">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{guide.install.title}</h2>
            <p className="max-w-3xl text-lg leading-8 text-gray-700">{guide.install.introduction}</p>
            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {guide.install.methods.map((method, index) => (
                <article key={method.title} className="min-w-0 flex flex-col rounded-xl border border-gray-200 bg-white p-6">
                  <h3 className="text-xl font-semibold text-gray-900">{method.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{method.bestFor}</p>
                  <pre className="mt-5 max-w-full overflow-x-auto rounded-lg bg-gray-950 p-4 text-sm text-gray-100"><code>{method.command}</code></pre>
                  <p className="mt-4 text-sm leading-6 text-gray-600">{method.note}</p>
                  <Link href={installGuidePaths[index]} className="mt-5 text-sm font-semibold text-blue-700 hover:text-blue-900">
                    {linkCopy.install}
                  </Link>
                </article>
              ))}
            </div>
            <p className="mt-6 rounded-lg bg-blue-50 p-4 leading-7 text-gray-700">
              {guide.install.verification}
            </p>
            <Link href="/download" className="mt-4 inline-block font-semibold text-blue-700 hover:text-blue-900">{t('Choose commands for your system and shell →', '按系统与 Shell 选择安装步骤 →', 'OS・シェルに合う手順を選ぶ →')}</Link>
          </section>

          <section id="activate-zoxide" className="scroll-mt-24">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{guide.activate.title}</h2>
            <p className="max-w-3xl text-lg leading-8 text-gray-700">{guide.activate.introduction}</p>
            <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white">
              {guide.activate.shells.map((shell, index) => (
                <div key={shell.name} className={`min-w-0 grid gap-3 p-5 md:grid-cols-[7rem_minmax(0,1fr)_minmax(0,1.4fr)] md:items-center ${index ? 'border-t border-gray-200' : ''}`}>
                  <h3 className="font-semibold text-gray-900">{shell.name}</h3>
                  <p className="min-w-0 break-words text-sm leading-6 text-gray-600">{shell.profile}</p>
                  <code className="block min-w-0 max-w-full overflow-x-auto rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-900">{shell.command}</code>
                </div>
              ))}
            </div>
            <p className="mt-6 text-base leading-7 text-gray-700">{guide.activate.verification}</p>
            <Link href={primary.init} className="mt-4 inline-block font-semibold text-blue-700 hover:text-blue-900">
              {linkCopy.shell}
            </Link>
          </section>

          <section id="first-zoxide-session" className="scroll-mt-24">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{guide.firstSession.title}</h2>
            <div className="max-w-3xl space-y-4 text-lg leading-8 text-gray-700">
              {guide.firstSession.introduction.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900">{t('Try a repeatable first jump', '先验证一次真实跳转', '最初のジャンプを確認する')}</h3>
              <p className="mt-3 max-w-3xl leading-7 text-gray-700">{t('After activating your shell, these examples create a zoxide-home-demo directory in your home folder, add it to the database and jump to it. The final path should end in zoxide-home-demo. Use only the block for your shell.', '完成 Shell 初始化后，下面的示例会在主目录创建 zoxide-home-demo，将它加入数据库并跳转过去。最后显示的路径应以 zoxide-home-demo 结尾。只运行与你的 Shell 对应的一组命令。', 'シェル設定後、ホームに zoxide-home-demo を作成し、履歴へ追加して移動します。最後のパスが zoxide-home-demo で終わることを確認してください。利用中のシェルに合う方だけ実行します。')}</p>
              <div className="mt-5 grid gap-5 lg:grid-cols-2">
                <div className="min-w-0">
                  <h4 className="font-semibold text-gray-900">Bash / Zsh / Fish</h4>
                  <pre className="mt-3 max-w-full overflow-x-auto rounded-lg bg-gray-950 p-4 text-sm text-gray-100"><code>{`mkdir -p ~/zoxide-home-demo
cd ~
zoxide add ~/zoxide-home-demo
zoxide query zoxide-home-demo
z zoxide-home-demo
pwd`}</code></pre>
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-gray-900">PowerShell</h4>
                  <pre className="mt-3 max-w-full overflow-x-auto rounded-lg bg-gray-950 p-4 text-sm text-gray-100"><code>{`New-Item -ItemType Directory -Force -Path "$HOME/zoxide-home-demo" | Out-Null
Set-Location $HOME
zoxide add "$HOME/zoxide-home-demo"
zoxide query zoxide-home-demo
z zoxide-home-demo
Get-Location`}</code></pre>
                </div>
              </div>
            </div>
            <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white">
              {guide.firstSession.commands.map((item, index) => (
                <div key={item.command} className={`min-w-0 grid gap-3 p-5 md:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] md:items-center ${index ? 'border-t border-gray-200' : ''}`}>
                  <code className="block min-w-0 max-w-full overflow-x-auto rounded-md bg-gray-950 px-3 py-2 text-sm text-gray-100">{item.command}</code>
                  <p className="leading-7 text-gray-700">{item.purpose}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-xl bg-gray-50 p-6">
              <h3 className="text-xl font-semibold text-gray-900">{guide.firstSession.learningTitle}</h3>
              <div className="mt-3 max-w-3xl space-y-3 leading-7 text-gray-700">
                {guide.firstSession.learning.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <Link href={primary.commands} className="mt-4 inline-block font-semibold text-blue-700 hover:text-blue-900">
                {linkCopy.commands}
              </Link>
            </div>
            <div className="mt-10 border-t border-gray-200 pt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{guide.workflow.title}</h3>
              <p className="max-w-3xl text-lg leading-8 text-gray-700">{guide.workflow.introduction}</p>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {guide.workflow.choices.map((choice) => (
                  <article key={choice.title} className="min-w-0">
                    <h4 className="text-lg font-semibold text-gray-900">{choice.title}</h4>
                    <p className="mt-2 leading-7 text-gray-600">{choice.text}</p>
                  </article>
                ))}
              </div>
              <p className="mt-6 max-w-3xl leading-7 text-gray-700">{guide.workflow.conclusion}</p>
              <Link href={primary.alternatives} className="mt-4 inline-block font-semibold text-blue-700 hover:text-blue-900">
                {linkCopy.compare}
              </Link>
            </div>

          </section>

          <section id="zoxide-troubleshooting" className="scroll-mt-24">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{guide.troubleshooting.title}</h2>
            <p className="max-w-3xl text-lg leading-8 text-gray-700">{guide.troubleshooting.introduction}</p>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {guide.troubleshooting.items.map((item, index) => (
                <article key={item.title} className="rounded-xl border border-gray-200 bg-white p-6">
                  <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                  <p className="mt-2 leading-7 text-gray-600">{item.text}</p>
                  {item.command && (
                    <code className="mt-4 block overflow-x-auto rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-900">{item.command}</code>
                  )}
                  <Link href={troubleshootingGuidePaths[index]} className="mt-5 inline-block text-sm font-semibold text-blue-700 hover:text-blue-900">
                    {linkCopy.fix}
                  </Link>
                </article>
              ))}
            </div>
          </section>

          <section id="tested-findings" className="scroll-mt-24 border-t border-gray-200 pt-10">
            <h2 className="font-serif text-3xl font-bold">{t('What our tests can help you catch', '实测能帮你发现什么', '実測から分かった落とし穴')}</h2>
            <p className="mt-4 max-w-3xl leading-7 text-gray-600">{t('These findings come from the October 2026 tests documented in our guides. Follow each link for the environment, commands, output and limitations.', '以下结论来自教程中记录的 2026 年 10 月测试。链接内保留环境、命令、输出与适用边界。', '2026年10月のガイド内の検証に基づく結果です。環境・コマンド・出力・制限は各リンク先で確認できます。')}</p>
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <article className="min-w-0">
                <h3 className="text-xl font-semibold">{t('A healthy report can still miss a broken hook', 'healthy 报告也可能漏掉失效的 hook', 'healthy でも hook の問題は残る')}</h3>
                <pre className="mt-4 overflow-x-auto rounded-lg bg-gray-950 p-4 text-sm text-white"><code>{`zoxide-doctor: healthy
# Does a new directory appear in history?
zoxide query --list`}</code></pre>
                <p className="mt-4 leading-7">{t('Our Windows 11 / PowerShell 7.6.6 test reproduced a theme replacing the prompt after zoxide. The CLI found the init line, but directory learning stopped.', 'Windows 11 / PowerShell 7.6.6 实测复现了主题在 zoxide 后覆盖 prompt：CLI 能找到初始化行，但目录学习停止。', 'Windows 11 / PowerShell 7.6.6 で、テーマが後から prompt を上書きするケースを再現。初期化行はあっても学習が止まりました。')}</p>
                <Link href={primary.doctor} className="mt-3 inline-block text-blue-700 underline">{t('Read the report and its limits', '查看报告与能力限制', 'レポートと制限を読む')}</Link>
              </article>
              <article className="min-w-0">
                <h3 className="text-xl font-semibold">{t('A saved path can still return No match found', '有历史记录，仍可能 No match found', '履歴があっても一致しない理由')}</h3>
                <pre className="mt-4 overflow-x-auto rounded-lg bg-gray-950 p-4 text-sm text-white"><code>{`~/work/web-app/src
# Last directory component: src`}</code></pre>
                <p className="mt-4 leading-7">{t('The final keyword must match the last directory component. A query ending in web does not select web-app/src. Check keyword order and the current directory before resetting history.', '最后一个关键词必须匹配末级目录，结尾为 web 的查询不能选中 web-app/src。重置历史前先查关键词顺序与当前目录。', '最後の語は末尾のディレクトリ名に一致する必要があります。末尾が web の検索語では web-app/src を選べません。履歴削除前に語順と現在地を確認。')}</p>
                <Link href={primary.noMatch} className="mt-3 inline-block text-blue-700 underline">{t('Check the matching cases', '查看匹配问题实测', 'マッチの検証を読む')}</Link>
              </article>
            </div>
            <Link href="/about" className="mt-6 inline-block font-semibold text-blue-700 hover:text-blue-900">{t('How we test and maintain these guides', '我们如何测试与维护指南', 'ガイドの検証・更新方針')}</Link>
          </section>

          <section id="zoxide-faq" className="scroll-mt-24">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">{guide.faq.title}</h2>
            <div className="divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-white">
              {guide.faq.items.map((item) => (
                <details key={item.question} className="group p-6 open:bg-gray-50">
                  <summary className="cursor-pointer text-lg font-semibold text-gray-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700">
                    {item.question}
                  </summary>
                  <p className="mt-3 max-w-3xl leading-7 text-gray-700">{item.answer}</p>
                </details>
              ))}
            </div>
            <Link href="/faq" className="mt-6 inline-block font-semibold text-blue-700 hover:text-blue-900">
              {linkCopy.faq}
            </Link>
          </section>

          <section className="rounded-2xl bg-gray-950 p-6 text-white md:p-10">
            <h2 className="text-3xl font-bold">{guide.next.title}</h2>
            <p className="mt-4 max-w-3xl leading-7 text-gray-300">{guide.next.description}</p>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {guide.next.links.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-xl border border-gray-700 bg-gray-900 p-5 transition-colors hover:border-blue-400 hover:bg-gray-800">
                  <h3 className="font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-300">{item.description}</p>
                </Link>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
