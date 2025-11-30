import AdSlot from '@/components/AdSlot/AdSlot';

export const metadata = {
  title: '隐私政策 - zoxide.org',
  description: 'zoxide.org 隐私政策，说明我们如何收集、使用和保护您的个人信息。',
  keywords: 'privacy policy, 隐私政策, data protection',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <main className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              隐私政策
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              最后更新：2025年11月30日
            </p>
          </div>

          <AdSlot slotId="faq-top" />

          <section className="prose prose-lg max-w-none dark:prose-invert">
            <h2>1. 信息收集</h2>
            <p>
              我们收集以下类型的信息：
            </p>
            <ul>
              <li><strong>自动收集的信息</strong>：当您访问我们的网站时，我们可能会自动收集某些信息，包括您的 IP 地址、浏览器类型、访问时间和访问的页面。</li>
              <li><strong>Cookie 和类似技术</strong>：我们使用 Cookie 来改善您的浏览体验、分析网站流量并个性化内容。</li>
              <li><strong>第三方服务</strong>：我们使用第三方广告服务（例如广告网络）来展示广告，这些服务可能会收集您的信息用于广告个性化。</li>
            </ul>

            <h2>2. 信息使用</h2>
            <p>我们使用收集的信息用于以下目的：</p>
            <ul>
              <li>提供和维护我们的服务</li>
              <li>改善用户体验</li>
              <li>分析网站使用情况</li>
              <li>展示相关广告</li>
            </ul>

            <h2>3. Cookie 使用</h2>
            <p>
              我们使用 Cookie 来：
            </p>
            <ul>
              <li>记住您的偏好设置</li>
              <li>分析网站流量</li>
              <li>提供个性化广告</li>
            </ul>
            <p>
              您可以通过浏览器设置管理 Cookie 偏好。请注意，禁用 Cookie 可能会影响网站的某些功能。
            </p>

            <h2>4. 第三方服务</h2>
            <p>
              我们的网站使用以下第三方服务：
            </p>
            <ul>
              <li><strong>第三方广告服务</strong>：用于展示广告。服务提供商可能使用 Cookie 来根据您的兴趣展示个性化广告。请参阅提供商的隐私政策以了解详情。</li>
              <li><strong>Google Analytics</strong>（如使用）：用于分析网站流量。</li>
            </ul>

            <h2>5. 数据安全</h2>
            <p>
              我们采取合理的安全措施来保护您的个人信息，但我们无法保证绝对安全。我们建议您采取适当措施保护您的个人信息。
            </p>

            <h2>6. 儿童隐私</h2>
            <p>
              我们的服务不面向 13 岁以下的儿童。我们不会故意收集儿童的个人信息。
            </p>

            <h2>7. 隐私政策变更</h2>
            <p>
              我们可能会不时更新本隐私政策。我们会在本页面上发布更新后的隐私政策，并更新"最后更新"日期。
            </p>

            <h2>8. 联系我们</h2>
            <p>
              如果您对本隐私政策有任何疑问，请通过以下方式联系我们：
            </p>
            <p>
              网站：<a href="https://zoxide.org">zoxide.org</a>
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
