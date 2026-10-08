import { getTranslations } from 'next-intl/server';

/**
 * 全站“非官方指南”声明条。
 * 服务端渲染且不可关闭：保证爬虫、AdSense 审核和每位访客在初始 HTML 中都能看到，
 * 避免本站被误认为 zoxide 官方网站。
 */
export default async function DisclaimerBanner() {
  const t = await getTranslations('disclaimer');

  return (
    <div className="bg-gray-50 border-b border-gray-200">
      <div className="container mx-auto max-w-7xl px-4 py-1.5">
        <p className="text-xs text-gray-600">
          <span className="font-medium text-gray-700">{t('label')}</span> {t('message')}{' '}
          <a
            href="https://github.com/ajeetdsouza/zoxide"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-900"
          >
            {t('officialLink')}
          </a>
        </p>
      </div>
    </div>
  );
}
