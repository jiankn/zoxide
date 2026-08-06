import Hero from '@/components/Hero/Hero';
import { Link } from '@/i18n/routing';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Zap, Search, Brain } from 'lucide-react';
import { generateMultilingualMetadata } from '@/lib/seo/metadata';
import { getHomeGuide } from '@/data/home-guide';

const installGuidePaths = [
  '/tutorials/install-macos',
  '/tutorials/install-ubuntu',
  '/tutorials/install-windows',
];

const troubleshootingGuidePaths = [
  '/blog/zoxide-command-not-found',
  '/blog/zoxide-init-guide',
  '/blog/troubleshooting-zoxide-no-match-found',
  '/tutorials/basic-commands',
  '/tutorials/fzf-integration',
];

const contextualLinkCopy = {
  en: {
    features: 'See all zoxide features →',
    install: 'Open the full installation guide →',
    shell: 'Read the complete shell setup guide →',
    commands: 'Continue with the basic commands guide →',
    fix: 'Follow the detailed fix →',
    compare: 'Compare zoxide with autojump, z, and fasd →',
    faq: 'Read every FAQ and troubleshooting path →',
  },
  zh: {
    features: '查看全部 zoxide 功能 →',
    install: '打开完整安装教程 →',
    shell: '阅读完整 Shell 配置教程 →',
    commands: '继续学习基础命令 →',
    fix: '查看详细排查步骤 →',
    compare: '对比 zoxide、autojump、z 与 fasd →',
    faq: '查看全部常见问题与排错入口 →',
  },
  ja: {
    features: 'zoxide の機能をすべて見る →',
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
    ? 'zoxide is a smarter cd command for instant directory navigation. Get installation guides for Ubuntu, macOS, Windows, and tutorials for fzf and Neovim integration.'
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

  const t = await getTranslations('home');
  const guide = getHomeGuide(locale);
  const linkCopy = contextualLinkCopy[locale === 'zh' || locale === 'ja' ? locale : 'en'];

  return (
    <div className="flex flex-col">
      {/* Hero 区域 */}
      <Hero />

      {/* 主内容区域 */}
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <main className="space-y-16">
          <section className="rounded-2xl border border-blue-100 bg-blue-50/60 p-6 md:p-10">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
              {guide.eyebrow}
            </p>
            <h2 className="max-w-4xl text-3xl font-bold tracking-tight text-gray-950 md:text-4xl">
              {guide.title}
            </h2>
            <div className="mt-6 max-w-4xl space-y-4 text-lg leading-8 text-gray-700">
              {guide.introduction.map((paragraph) => (
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
            <div className="max-w-4xl space-y-4 text-lg leading-8 text-gray-700">
              {guide.overview.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {guide.overview.points.map((point) => (
                <div key={point.title} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900">{point.title}</h3>
                  <p className="mt-2 leading-7 text-gray-600">{point.text}</p>
                </div>
              ))}
            </div>
            <Link href="/features" className="mt-6 inline-block font-semibold text-blue-700 hover:text-blue-900">
              {linkCopy.features}
            </Link>
          </section>

          <section id="install-zoxide" className="scroll-mt-24">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{guide.install.title}</h2>
            <p className="max-w-4xl text-lg leading-8 text-gray-700">{guide.install.introduction}</p>
            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {guide.install.methods.map((method, index) => (
                <article key={method.title} className="min-w-0 flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
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
            <p className="mt-6 rounded-lg border-l-4 border-blue-500 bg-blue-50 p-4 leading-7 text-gray-700">
              {guide.install.verification}
            </p>
          </section>

          <section id="activate-zoxide" className="scroll-mt-24">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{guide.activate.title}</h2>
            <p className="max-w-4xl text-lg leading-8 text-gray-700">{guide.activate.introduction}</p>
            <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white">
              {guide.activate.shells.map((shell, index) => (
                <div key={shell.name} className={`min-w-0 grid gap-3 p-5 md:grid-cols-[9rem_1fr_1.4fr] md:items-center ${index ? 'border-t border-gray-200' : ''}`}>
                  <h3 className="font-semibold text-gray-900">{shell.name}</h3>
                  <p className="text-sm leading-6 text-gray-600">{shell.profile}</p>
                  <code className="block max-w-full overflow-x-auto rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-900">{shell.command}</code>
                </div>
              ))}
            </div>
            <p className="mt-6 text-base leading-7 text-gray-700">{guide.activate.verification}</p>
            <Link href="/tutorials/shell-setup" className="mt-4 inline-block font-semibold text-blue-700 hover:text-blue-900">
              {linkCopy.shell}
            </Link>
          </section>

          <section id="first-zoxide-session" className="scroll-mt-24">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{guide.firstSession.title}</h2>
            <div className="max-w-4xl space-y-4 text-lg leading-8 text-gray-700">
              {guide.firstSession.introduction.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white">
              {guide.firstSession.commands.map((item, index) => (
                <div key={item.command} className={`min-w-0 grid gap-3 p-5 md:grid-cols-[17rem_1fr] md:items-center ${index ? 'border-t border-gray-200' : ''}`}>
                  <code className="block max-w-full overflow-x-auto rounded-md bg-gray-950 px-3 py-2 text-sm text-gray-100">{item.command}</code>
                  <p className="leading-7 text-gray-700">{item.purpose}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-xl bg-gray-50 p-6">
              <h3 className="text-xl font-semibold text-gray-900">{guide.firstSession.learningTitle}</h3>
              <div className="mt-3 max-w-4xl space-y-3 leading-7 text-gray-700">
                {guide.firstSession.learning.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <Link href="/tutorials/basic-commands" className="mt-4 inline-block font-semibold text-blue-700 hover:text-blue-900">
                {linkCopy.commands}
              </Link>
            </div>
          </section>

          <section id="zoxide-troubleshooting" className="scroll-mt-24">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{guide.troubleshooting.title}</h2>
            <p className="max-w-4xl text-lg leading-8 text-gray-700">{guide.troubleshooting.introduction}</p>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {guide.troubleshooting.items.map((item, index) => (
                <article key={item.title} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
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

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{guide.workflow.title}</h2>
            <p className="max-w-4xl text-lg leading-8 text-gray-700">{guide.workflow.introduction}</p>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {guide.workflow.choices.map((choice) => (
                <article key={choice.title} className="rounded-xl border border-gray-200 bg-white p-6">
                  <h3 className="text-lg font-semibold text-gray-900">{choice.title}</h3>
                  <p className="mt-2 leading-7 text-gray-600">{choice.text}</p>
                </article>
              ))}
            </div>
            <p className="mt-6 max-w-4xl leading-7 text-gray-700">{guide.workflow.conclusion}</p>
            <Link href="/comparisons" className="mt-4 inline-block font-semibold text-blue-700 hover:text-blue-900">
              {linkCopy.compare}
            </Link>
          </section>

          <section id="zoxide-faq" className="scroll-mt-24">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">{guide.faq.title}</h2>
            <div className="divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-white">
              {guide.faq.items.map((item) => (
                <details key={item.question} className="group p-6 open:bg-gray-50">
                  <summary className="cursor-pointer list-none text-lg font-semibold text-gray-900 marker:hidden">
                    {item.question}
                  </summary>
                  <p className="mt-3 max-w-4xl leading-7 text-gray-700">{item.answer}</p>
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

          {/* 功能亮点卡片 */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              {t('features.title')}
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <Zap className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t('features.fast.title')}
                </h3>
                <p className="text-gray-600">
                  {t('features.fast.description')}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <Search className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t('features.fuzzy.title')}
                </h3>
                <p className="text-gray-600">
                  {t('features.fuzzy.description')}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <Brain className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t('features.smart.title')}
                </h3>
                <p className="text-gray-600">
                  {t('features.smart.description')}
                </p>
              </div>
            </div>
          </section>

          {/* 安装指南 */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              {t('installation.title')}
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Link
                href="/tutorials/install-macos"
                className="min-w-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 p-6 shadow-sm transition-all hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('installation.macos')}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {t('installation.macosDesc')}
                </p>
                <code className="block overflow-x-auto whitespace-nowrap text-sm text-gray-800 bg-white p-3 rounded">
                  brew install zoxide
                </code>
              </Link>
              <Link
                href="/tutorials/install-windows"
                className="min-w-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 p-6 shadow-sm transition-all hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('installation.windows')}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {t('installation.windowsDesc')}
                </p>
                <code className="block overflow-x-auto whitespace-nowrap text-sm text-gray-800 bg-white p-3 rounded">
                  scoop install zoxide
                </code>
              </Link>
              <Link
                href="/tutorials/install-ubuntu"
                className="min-w-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 p-6 shadow-sm transition-all hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('installation.linux')}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {t('installation.linuxDesc')}
                </p>
                <code className="block overflow-x-auto whitespace-nowrap text-sm text-gray-800 bg-white p-3 rounded">
                  {t('installation.ubuntuCommand')}
                </code>
              </Link>
            </div>
          </section>

          {/* 教程推荐 */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              {t('tutorials.title')}
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Link
                href="/tutorials/quick-start"
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('tutorials.quickStart')}
                </h3>
                <p className="text-sm text-gray-600">
                  {t('tutorials.quickStartDesc')}
                </p>
              </Link>
              <Link
                href="/tutorials/advanced-config"
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('tutorials.advanced')}
                </h3>
                <p className="text-sm text-gray-600">
                  {t('tutorials.advancedDesc')}
                </p>
              </Link>
              <Link
                href="/tutorials/shell-setup"
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('tutorials.shellIntegration')}
                </h3>
                <p className="text-sm text-gray-600">
                  {t('tutorials.shellIntegrationDesc')}
                </p>
              </Link>
            </div>
          </section>

          {/* 常见问题/快速链接 */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              {t('quickLinks.title')}
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Link
                href="/blog/zoxide-command-not-found"
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('quickLinks.commandNotFound')}
                </h3>
                <p className="text-sm text-gray-600">
                  {t('quickLinks.commandNotFoundDesc')}
                </p>
              </Link>
              <Link
                href="/tutorials/install-ubuntu"
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('quickLinks.installUbuntu')}
                </h3>
                <p className="text-sm text-gray-600">
                  {t('quickLinks.installUbuntuDesc')}
                </p>
              </Link>
              <Link
                href="/tutorials/install-arch-nixos"
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('quickLinks.installLinux')}
                </h3>
                <p className="text-sm text-gray-600">
                  {t('quickLinks.installLinuxDesc')}
                </p>
              </Link>
              <Link
                href="/tutorials/install-windows"
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('quickLinks.installWindows')}
                </h3>
                <p className="text-sm text-gray-600">
                  {t('quickLinks.installWindowsDesc')}
                </p>
              </Link>
              <Link
                href="/tutorials/install-macos"
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('quickLinks.installMacos')}
                </h3>
                <p className="text-sm text-gray-600">
                  {t('quickLinks.installMacosDesc')}
                </p>
              </Link>
              <Link
                href="/download"
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('quickLinks.download')}
                </h3>
                <p className="text-sm text-gray-600">
                  {t('quickLinks.downloadDesc')}
                </p>
              </Link>
              <Link
                href="/tutorials/fzf-integration"
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('quickLinks.fzfIntegration')}
                </h3>
                <p className="text-sm text-gray-600">
                  {t('quickLinks.fzfIntegrationDesc')}
                </p>
              </Link>
              <Link
                href="/tutorials/advanced-config"
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('quickLinks.nvimIntegration')}
                </h3>
                <p className="text-sm text-gray-600">
                  {t('quickLinks.nvimIntegrationDesc')}
                </p>
              </Link>
            </div>
          </section>

          {/* 相关工具 */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              {t('relatedTools.title')}
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Link
                href="/comparisons"
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('relatedTools.autojump')}
                </h3>
                <p className="text-sm text-gray-600">
                  {t('relatedTools.autojumpDesc')}
                </p>
              </Link>
              <Link
                href="/tutorials/fzf-integration"
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('relatedTools.fzf')}
                </h3>
                <p className="text-sm text-gray-600">
                  {t('relatedTools.fzfDesc')}
                </p>
              </Link>
            </div>
          </section>

          {/* CTA 区域 */}
          <section className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">
              {t('cta.title')}
            </h2>
            <p className="mb-6 text-blue-100">
              {t('cta.description')}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/download"
                className="inline-block rounded-lg bg-white px-6 py-3 font-semibold text-blue-600 transition-all hover:bg-gray-100"
              >
                {t('cta.install')}
              </Link>
              <a
                href="https://github.com/ajeetdsouza/zoxide"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-lg border-2 border-white px-6 py-3 font-semibold text-white transition-all hover:bg-white/10"
              >
                {t('cta.github')}
              </a>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

