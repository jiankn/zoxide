import AdSlot from '@/components/AdSlot/AdSlot';
import { generateFAQPageSchema } from '@/lib/seo/schema';
import { getTranslations, getLocale } from 'next-intl/server';
import { generateMultilingualMetadata } from '@/lib/seo/metadata';

export async function generateMetadata() {
  const tSeo = await getTranslations('seo');
  const tFaq = await getTranslations('faq');
  const locale = await getLocale();
  return generateMultilingualMetadata(
    locale,
    '/faq',
    {
      title: tSeo('titles.faq'),
      description: tFaq('description'),
      keywords: tSeo('faq'),
    }
  );
}

// 常见问题数据
const faqs = [
  {
    question: 'zoxide 支持哪些 Shell？',
    answer: 'zoxide 支持所有主流 Shell，包括 zsh、bash、fish、PowerShell 等。',
  },
  {
    question: '如何卸载 zoxide？',
    answer: '根据你的安装方式卸载：Homebrew 使用 `brew uninstall zoxide`，Scoop 使用 `scoop uninstall zoxide`，Cargo 使用 `cargo uninstall zoxide`。',
  },
  {
    question: 'zoxide 的数据库存储在哪里？',
    answer: 'zoxide 的数据库默认存储在用户主目录下的 `.zo` 文件中。可以通过环境变量 `_ZO_DATA_DIR` 自定义位置。',
  },
  {
    question: '如何排除特定目录？',
    answer: '使用环境变量 `_ZO_EXCLUDE_DIRS` 可以排除不需要索引的目录，多个目录用冒号分隔。',
  },
  {
    question: 'zoxide 与 autojump 有什么区别？',
    answer: 'zoxide 使用 Rust 编写，性能更快；支持模糊搜索；学习算法更智能。详细对比请查看对比页面。',
  },
];

export default function FAQPage() {
  const faqSchema = generateFAQPageSchema(faqs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <div className="container mx-auto max-w-7xl px-4 py-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* 主内容区 - 占 2/3 宽度 */}
        <main className="lg:col-span-2 space-y-12">
          {/* 页面标题 */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              常见问题 (FAQ)
            </h1>
            <p className="text-lg text-gray-600">
              zoxide 使用中的常见问题和解决方案。
            </p>
          </div>

          {/* 广告位 1: 标题下方 */}
          <AdSlot slotId="faq-top" />

          {/* 问题列表 */}
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
              >
                <h2 className="mb-3 text-lg font-semibold text-gray-900">
                  {faq.question}
                </h2>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>

          {/* 广告位 3: 问题列表中间位置 */}
          <AdSlot slotId="faq-middle" />

          {/* 广告位 4: 页面底部 */}
          <AdSlot slotId="faq-bottom" />
        </main>

        {/* 侧边栏 - 占 1/3 宽度，Sticky 定位 */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 self-start max-h-[calc(100vh-80px)]">
            {/* 广告位 2: 侧边栏 Sticky 广告 */}
            <AdSlot slotId="faq-sidebar" lazy={true} />
          </div>
        </aside>
      </div>
    </div>
    </>
  );
}

