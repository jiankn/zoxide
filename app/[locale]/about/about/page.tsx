import AdSlot from '@/components/AdSlot/AdSlot';
import Link from 'next/link';

export const metadata = {
  title: '关于我们 - zoxide.org',
  description: '了解 zoxide.org - zoxide 粉丝网站，提供教程、技巧和最新动态。',
  keywords: 'about us, 关于我们, zoxide fan site',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <main className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              关于我们
            </h1>
            <p className="text-sm text-gray-600 mb-6">
              最后更新：2025年11月30日
            </p>
          </div>

          <AdSlot slotId="faq-top" />

          <section className="prose prose-lg max-w-none">
            <h2>网站简介</h2>
            <p>
              zoxide.org 是一个专注于 zoxide 工具的粉丝网站。我们的目标是提供高质量的教程、技巧和最新动态，帮助用户更好地使用 zoxide 提升工作效率。
            </p>

            <h2>重要声明</h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <p className="text-yellow-800">
                <strong>免责声明：</strong>本网站是信息性网站，与 ajeetdsouza 或 Ajeet D&apos;Souza 无任何关联。
                我们不托管文件，仅链接到 SourceForge 发布版本。所有内容均为原创。
              </p>
            </div>

            <h2>我们的使命</h2>
            <p>
              我们致力于：
            </p>
            <ul>
              <li>提供准确、实用的 zoxide 使用教程</li>
              <li>分享最佳实践和高级技巧</li>
              <li>及时更新 zoxide 的最新动态</li>
              <li>帮助用户解决使用中的问题</li>
            </ul>

            <h2>网站内容</h2>
            <p>我们的网站包含以下内容：</p>
            <ul>
              <li><strong>教程</strong>：从入门到高级的完整教程</li>
              <li><strong>博客</strong>：使用技巧、性能优化、对比分析等文章</li>
              <li><strong>下载指南</strong>：各平台安装方法和配置说明</li>
              <li><strong>更新日志</strong>：zoxide 版本更新历史</li>
              <li><strong>常见问题</strong>：FAQ 和故障排除指南</li>
            </ul>

            <h2>开源项目</h2>
            <p>
              zoxide 是一个开源项目，由 <a href="https://github.com/ajeetdsouza" target="_blank" rel="noopener noreferrer">Ajeet D&apos;Souza</a> 开发。
              您可以在 <a href="https://github.com/ajeetdsouza/zoxide" target="_blank" rel="noopener noreferrer">GitHub</a> 上查看源代码和贡献。
            </p>

            <h2>联系我们</h2>
            <p>
              如果您有任何问题、建议或反馈，欢迎通过以下方式联系我们：
            </p>
            <ul>
              <li>网站：<a href="https://zoxide.org">zoxide.org</a></li>
              <li>GitHub：<a href="https://github.com/ajeetdsouza/zoxide" target="_blank" rel="noopener noreferrer">zoxide 官方仓库</a></li>
            </ul>

            <h2>隐私和条款</h2>
            <p>
              请查看我们的{' '}
              <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-800 underline">
                隐私政策
              </Link>
              {' '}和{' '}
              <Link href="/terms-of-service" className="text-blue-600 hover:text-blue-800 underline">
                服务条款
              </Link>
              。
            </p>
          </section>

          <AdSlot slotId="faq-bottom" />
        </main>

        <aside className="hidden lg:block">
          <div className="sticky top-20 self-start max-h-[calc(100vh-80px)]">
            <AdSlot slotId="faq-sidebar" lazy={true} />
          </div>
        </aside>
      </div>
    </div>
  );
}

