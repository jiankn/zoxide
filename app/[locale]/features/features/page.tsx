import AdSlot from '@/components/AdSlot/AdSlot';
import Link from 'next/link';
import { Zap, Search, Brain, Users, Settings, Rocket } from 'lucide-react';

export const metadata = {
  title: 'zoxide 功能特性 - 智能目录导航工具的核心能力',
  description: '了解 zoxide 的核心功能：极速性能、智能搜索、学习习惯、团队协作等。zoxide 使用 Rust 编写，比传统 cd 命令快 10 倍，支持模糊搜索和自动学习。',
  keywords: 'zoxide features, zoxide capabilities, smart cd command, zoxide vs autojump, zoxide performance, best cd replacement',
};

export default function FeaturesPage() {
  const featureGroups = [
    {
      title: '核心能力',
      features: [
        {
          icon: Zap,
          title: '极速性能',
          description: '使用 Rust 编写，启动速度极快，比传统 cd 命令快 10 倍以上。',
        },
        {
          icon: Search,
          title: '智能搜索',
          description: '支持模糊搜索，只需输入目录名的一部分即可快速跳转，无需完整路径。',
        },
        {
          icon: Brain,
          title: '学习习惯',
          description: '自动学习你的使用习惯，经常访问的目录会优先匹配，越用越智能。',
        },
      ],
    },
    {
      title: '体验增强',
      features: [
        {
          icon: Settings,
          title: '灵活配置',
          description: '支持自定义配置，可以排除特定目录、设置别名等，满足个性化需求。',
        },
        {
          icon: Rocket,
          title: '跨平台支持',
          description: '支持 macOS、Linux、Windows 三大平台，兼容所有主流 Shell 环境。',
        },
        {
          icon: Users,
          title: '团队协作',
          description: '支持共享数据库，团队成员可以共享常用目录，提升团队效率。',
        },
      ],
    },
  ];

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* 主内容区 - 占 2/3 宽度 */}
        <main className="lg:col-span-2 space-y-12">
          {/* 页面标题 */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              zoxide 功能特性
            </h1>
            <p className="text-lg text-gray-600">
              zoxide 是一个智能的目录跳转工具，使用 Rust 编写，性能卓越。
              它比传统的 cd 命令更快、更智能，支持模糊搜索和自动学习，让终端导航变得轻松高效。
              了解更多信息，请访问{' '}
              <a
                href="https://github.com/ajeetdsouza/zoxide"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                GitHub 仓库
              </a>
              。
            </p>
          </div>

          {/* 广告位 1: 标题下方 */}
          <AdSlot slotId="features-top" />

          {/* 功能卡片组 */}
          {featureGroups.map((group, groupIndex) => (
            <section key={groupIndex}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {group.title}
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {group.features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={index}
                      className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
                    >
                      <Icon className="h-8 w-8 text-blue-600 mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}

          {/* 广告位 3: 功能卡片与对比 CTA 之间 */}
          <AdSlot slotId="features-middle" />

          {/* 对比 CTA 区域 */}
          <section className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">
              想了解更多对比信息？
            </h2>
            <p className="mb-6 text-blue-100">
              查看 zoxide 与其他工具的详细对比，了解为什么选择 zoxide
            </p>
            <Link
              href="/comparisons"
              className="inline-block rounded-lg bg-white px-6 py-3 font-semibold text-blue-600 transition-all hover:bg-gray-100"
            >
              查看对比
            </Link>
          </section>

          {/* 广告位 4: 对比 CTA 之前 */}
          <AdSlot slotId="features-bottom" />
        </main>

        {/* 侧边栏 - 占 1/3 宽度，Sticky 定位 */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 self-start max-h-[calc(100vh-80px)]">
            {/* 广告位 2: 侧边栏 Sticky 广告 */}
            <AdSlot slotId="features-sidebar" lazy={true} />
          </div>
        </aside>
      </div>
    </div>
  );
}

