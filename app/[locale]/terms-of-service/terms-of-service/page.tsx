import AdSlot from '@/components/AdSlot/AdSlot';
import { getTranslations, getLocale } from 'next-intl/server';
import { generateMultilingualMetadata } from '@/lib/seo/metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('seo');
  const tTerms = await getTranslations('termsOfService');
  return generateMultilingualMetadata(
    locale,
    '/terms-of-service',
    {
      title: t('titles.termsOfService'),
      description: tTerms('description'),
      keywords: t('legal'),
    }
  );
}

export default async function TermsOfServicePage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <main className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              服务条款
            </h1>
            <p className="text-sm text-gray-600 mb-6">
              最后更新：2025年11月30日
            </p>
          </div>

          <AdSlot slotId="faq-top" />

          <section className="prose prose-lg max-w-none">
            <h2>1. 接受条款</h2>
            <p>
              通过访问和使用 zoxide.org（&quot;本网站&quot;），您同意遵守本服务条款。如果您不同意这些条款，请不要使用本网站。
            </p>

            <h2>2. 网站性质</h2>
            <p>
              <strong>重要声明</strong>：本网站是信息性网站，与 ajeetdsouza 或 Ajeet D&apos;Souza 无任何关联。我们不托管文件，仅链接到 SourceForge 发布版本。所有内容均为原创。
            </p>

            <h2>3. 使用许可</h2>
            <p>在遵守本服务条款的前提下，我们授予您有限的、非独占的、不可转让的许可，以访问和使用本网站。</p>

            <h2>4. 禁止行为</h2>
            <p>您同意不会：</p>
            <ul>
              <li>以任何非法或未经授权的方式使用本网站</li>
              <li>尝试未经授权访问本网站的任何部分</li>
              <li>干扰或破坏本网站的正常运行</li>
              <li>复制、修改或分发本网站的内容（除非明确允许）</li>
            </ul>

            <h2>5. 知识产权</h2>
            <p>
              本网站的所有内容，包括但不限于文本、图形、徽标、图标和软件，均为我们的财产或我们授权使用的财产，受版权和其他知识产权法保护。
            </p>

            <h2>6. 免责声明</h2>
            <p>
              本网站按 &quot;原样&quot; 提供，不提供任何明示或暗示的保证。我们不保证：
            </p>
            <ul>
              <li>网站将始终可用或无错误</li>
              <li>网站内容准确、完整或最新</li>
              <li>网站将满足您的特定需求</li>
            </ul>

            <h2>7. 责任限制</h2>
            <p>
              在法律允许的最大范围内，我们对因使用或无法使用本网站而产生的任何直接、间接、偶然或后果性损害不承担责任。
            </p>

            <h2>8. 外部链接</h2>
            <p>
              本网站可能包含指向外部网站的链接。我们不对这些外部网站的内容、隐私政策或做法负责。
            </p>

            <h2>9. 广告</h2>
            <p>
              本网站可能包含第三方广告。我们不对这些广告的内容或准确性负责。点击广告即表示您同意遵守广告商的条款和条件。
            </p>

            <h2>10. 服务条款变更</h2>
            <p>
              我们保留随时修改本服务条款的权利。我们会在本页面上发布更新后的服务条款，并更新 &quot;最后更新&quot; 日期。继续使用本网站即表示您接受修改后的条款。
            </p>

            <h2>11. 联系我们</h2>
            <p>
              如果您对本服务条款有任何疑问，请通过以下方式联系我们：
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

