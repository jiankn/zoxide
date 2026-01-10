const baseUrl = 'https://zoxide.org';
const routing = { locales: ['zh', 'en', 'ja'], defaultLocale: 'en' };
const locale = 'en';
const normalizedPath = '';

// 生成canonical URL
const canonicalUrl = normalizedPath === ''
  ? (locale === routing.defaultLocale ? `${baseUrl}/` : `${baseUrl}/${locale}/`)
  : (locale === routing.defaultLocale ? `${baseUrl}${normalizedPath}/` : `${baseUrl}/${locale}${normalizedPath}/`);

console.log('English canonical URL:', canonicalUrl);

// 生成语言版本
routing.locales.forEach((loc) => {
  const url = normalizedPath === ''
    ? (loc === routing.defaultLocale ? `${baseUrl}/` : `${baseUrl}/${loc}/`)
    : (loc === routing.defaultLocale ? `${baseUrl}${normalizedPath}/` : `${baseUrl}/${loc}${normalizedPath}/`);
  console.log(`${loc}: ${url}`);
});
