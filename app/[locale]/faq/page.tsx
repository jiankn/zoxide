import { getTranslations, getMessages, setRequestLocale } from 'next-intl/server';
import { generateFAQPageSchema } from '@/lib/seo/schema';
import { generateMultilingualMetadata } from '@/lib/seo/metadata';
import { Link } from '@/i18n/routing';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const tSeo = await getTranslations('seo');
  const tFaq = await getTranslations('faq');
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

export default async function FAQPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  // 启用静态渲染 (SSG)
  setRequestLocale(locale);

  const t = await getTranslations('faq');
  const messages = await getMessages();
  const faqs = messages.faq.items as Array<{ question: string; answer: string }>;
  const faqSchema = generateFAQPageSchema(faqs);
  const depthPaths = [
    '/tutorials/shell-setup',
    '/download',
    '/features',
    '/tutorials/advanced-config',
    '/tutorials/basic-commands',
  ];
  const linkLabels = locale === 'zh'
    ? ['查看 Shell 配置教程', '选择安装方法', '了解性能与工作方式', '查看高级配置', '学习数据库与基础命令']
    : locale === 'ja'
      ? ['シェル設定を見る', '導入方法を選ぶ', '性能と仕組みを確認', '高度な設定を見る', 'DBと基本コマンドを学ぶ']
      : ['Open the shell setup guide', 'Choose an installation method', 'Understand performance and behavior', 'Open advanced configuration', 'Learn the database and core commands'];
  const supportCopy = locale === 'zh'
    ? { title: '仍然没有解决？', description: '按可执行文件、PATH、Shell 初始化、学习数据的顺序检查，避免一次同时修改多处。', doctor: '运行 zoxide-doctor', troubleshooting: '打开完整故障排查' }
    : locale === 'ja'
      ? { title: 'まだ解決しない場合', description: '実行ファイル、PATH、シェル初期化、学習データの順で確認し、複数箇所を同時に変えないようにします。', doctor: 'zoxide-doctor を使う', troubleshooting: '詳しいトラブル解決' }
      : { title: 'Still stuck?', description: 'Check the executable, PATH, shell initialization, and learned data in that order instead of changing several layers at once.', doctor: 'Run zoxide-doctor', troubleshooting: 'Open the full troubleshooting guide' };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <Breadcrumbs locale={locale} path="/faq" currentLabel={t('title')} />
        <main className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t('title')}
            </h1>
            <p className="text-lg text-gray-600">
              {t('description')}
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  {faq.question}
                </h2>
                <p className="leading-7 text-gray-700">{faq.answer}</p>
                <Link href={depthPaths[index]} className="mt-4 inline-block font-semibold text-blue-700 hover:text-blue-900">
                  {linkLabels[index]} →
                </Link>
              </div>
            ))}
          </div>

          <section className="rounded-xl bg-gray-950 p-6 text-white">
            <h2 className="text-2xl font-bold">{supportCopy.title}</h2>
            <p className="mt-3 leading-7 text-gray-300">{supportCopy.description}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/tools/zoxide-doctor" className="rounded-lg bg-blue-600 px-4 py-3 font-semibold hover:bg-blue-500">{supportCopy.doctor}</Link>
              <Link href="/blog/zoxide-not-working" className="rounded-lg border border-gray-600 px-4 py-3 font-semibold hover:border-blue-400">{supportCopy.troubleshooting}</Link>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

