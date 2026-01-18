import Hero from '@/components/Hero/Hero';
import { Link } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';
import { Zap, Search, Brain } from 'lucide-react';
import { generateMultilingualMetadata } from '@/lib/seo/metadata';

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

export default async function Home() {
  const t = await getTranslations('home');

  return (
    <div className="flex flex-col">
      {/* Hero 区域 */}
      <Hero />

      {/* 主内容区域 */}
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <main className="space-y-16">
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
                className="rounded-lg border border-gray-200 bg-gray-50 p-6 shadow-sm transition-all hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('installation.macos')}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {t('installation.macosDesc')}
                </p>
                <code className="block text-sm text-gray-800 bg-white p-3 rounded">
                  brew install zoxide
                </code>
              </Link>
              <Link
                href="/tutorials/install-windows"
                className="rounded-lg border border-gray-200 bg-gray-50 p-6 shadow-sm transition-all hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('installation.windows')}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {t('installation.windowsDesc')}
                </p>
                <code className="block text-sm text-gray-800 bg-white p-3 rounded">
                  scoop install zoxide
                </code>
              </Link>
              <Link
                href="/tutorials/install-ubuntu"
                className="rounded-lg border border-gray-200 bg-gray-50 p-6 shadow-sm transition-all hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('installation.linux')}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {t('installation.linuxDesc')}
                </p>
                <code className="block text-sm text-gray-800 bg-white p-3 rounded">
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

