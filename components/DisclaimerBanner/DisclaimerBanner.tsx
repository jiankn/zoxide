import { getTranslations } from 'next-intl/server';

/**
 * 全站“非官方指南”声明条。
 * 服务端渲染且不可关闭：保证爬虫、AdSense 审核和每位访客在初始 HTML 中都能看到，
 * 避免本站被误认为 zoxide 官方网站。
 */
export default async function DisclaimerBanner() {
  const t = await getTranslations('disclaimer');

  return (
    <div className="bg-yellow-50 border-b border-yellow-200">
      <div className="container mx-auto max-w-7xl px-4 py-2">
        <p className="text-xs sm:text-sm text-yellow-900">
          <strong>{t('label')}</strong> {t('message')}{' '}
          <a
            href="https://github.com/ajeetdsouza/zoxide"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-yellow-950"
          >
            {t('officialLink')}
          </a>
        </p>
      </div>
    </div>
  );
}
