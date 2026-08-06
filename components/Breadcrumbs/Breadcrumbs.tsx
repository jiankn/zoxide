import { Link } from '@/i18n/routing';

type SupportedLocale = 'en' | 'zh' | 'ja';

interface BreadcrumbsProps {
  locale: string;
  path: string;
  currentLabel?: string;
}

const labels: Record<SupportedLocale, Record<string, string>> = {
  en: {
    home: 'Home',
    features: 'Features',
    tutorials: 'Tutorials',
    videos: 'Videos',
    download: 'Download',
    blog: 'Blog',
    changelog: 'Changelog',
    faq: 'FAQ',
    comparisons: 'Comparisons',
    about: 'About',
    'privacy-policy': 'Privacy Policy',
    'terms-of-service': 'Terms of Service',
    contact: 'Contact',
    tools: 'Tools',
    'zoxide-doctor': 'zoxide-doctor',
    autojump: 'zoxide vs autojump',
    z: 'zoxide vs z',
    fasd: 'zoxide vs fasd',
  },
  zh: {
    home: '首页',
    features: '功能',
    tutorials: '教程',
    videos: '视频',
    download: '下载',
    blog: '博客',
    changelog: '更新日志',
    faq: '常见问题',
    comparisons: '工具对比',
    about: '关于',
    'privacy-policy': '隐私政策',
    'terms-of-service': '服务条款',
    contact: '联系',
    tools: '工具',
    'zoxide-doctor': 'zoxide-doctor',
    autojump: 'zoxide 对比 autojump',
    z: 'zoxide 对比 z',
    fasd: 'zoxide 对比 fasd',
  },
  ja: {
    home: 'ホーム',
    features: '機能',
    tutorials: 'チュートリアル',
    videos: '動画',
    download: 'ダウンロード',
    blog: 'ブログ',
    changelog: '変更履歴',
    faq: 'よくある質問',
    comparisons: 'ツール比較',
    about: 'このサイトについて',
    'privacy-policy': 'プライバシーポリシー',
    'terms-of-service': '利用規約',
    contact: 'お問い合わせ',
    tools: 'ツール',
    'zoxide-doctor': 'zoxide-doctor',
    autojump: 'zoxide と autojump',
    z: 'zoxide と z',
    fasd: 'zoxide と fasd',
  },
};

function absoluteUrl(locale: SupportedLocale, path: string) {
  const normalizedPath = path === '/' ? '' : `/${path.replace(/^\/+|\/+$/g, '')}`;
  const localePrefix = locale === 'en' ? '' : `/${locale}`;
  return `https://zoxide.org${localePrefix}${normalizedPath}/`;
}

export default function Breadcrumbs({ locale, path, currentLabel }: BreadcrumbsProps) {
  const supportedLocale: SupportedLocale = locale === 'zh' || locale === 'ja' ? locale : 'en';
  const copy = labels[supportedLocale];
  const segments = path.split('/').filter(Boolean);
  const items = [
    { label: copy.home, href: '/' },
    ...segments
      .map((segment, index) => ({
        segment,
        label: index === segments.length - 1 && currentLabel
          ? currentLabel
          : copy[segment] || segment.replace(/-/g, ' '),
        href: `/${segments.slice(0, index + 1).join('/')}`,
      }))
      .filter((item) => item.segment !== 'tools')
      .map(({ label, href }) => ({ label, href })),
  ];
  const ariaLabel = supportedLocale === 'zh' ? '面包屑导航' : supportedLocale === 'ja' ? 'パンくずリスト' : 'Breadcrumb';
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: absoluteUrl(supportedLocale, item.href),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <nav className="mb-8 text-sm text-gray-600" aria-label={ariaLabel}>
        <ol className="flex flex-wrap items-center gap-2">
          {items.map((item, index) => {
            const isCurrent = index === items.length - 1;
            return (
              <li key={item.href} className="flex min-w-0 items-center gap-2">
                {index > 0 && <span aria-hidden="true" className="text-gray-400">/</span>}
                {isCurrent ? (
                  <span className="max-w-[22rem] truncate text-gray-900" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <Link href={item.href} className="transition-colors hover:text-blue-700">
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
