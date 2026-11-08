import { Link } from '@/i18n/routing';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { generateMultilingualMetadata } from '@/lib/seo/metadata';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import { words, taskGroups } from '@/data/task-guides';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('seo');
  const tTutorials = await getTranslations('tutorials');

  return generateMultilingualMetadata(
    locale,
    '/tutorials',
    {
      title: t('titles.tutorials'),
      description: tTutorials('description'),
      keywords: t('tutorial'),
    }
  );
}

export default async function TutorialsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = (en: string, zh: string, ja: string) => words(locale,en,zh,ja);
  const groups = taskGroups(locale);
  const stages = [
    { title: t('Install for your system', '按系统安装', '環境に合わせて導入'), body: groups[0].description, links: groups[0].links.filter(l => l.href !== '/blog/zoxide-init-guide') },
    { title: t('Verify a first jump', '验证首次跳转', '最初のジャンプを確認'), body: t('Already installed? Start here. Confirm the binary, shell function and an explicitly added test directory.', '已经安装？从这里开始，检查程序、Shell 函数和手动加入的测试目录。', '導入済みならここから。実行ファイル、関数、手動追加したテスト用ディレクトリを確認。'), links: [groups[2].links[1],groups[0].links[5]] },
    { title: t('Choose interactively', '交互选择目录', '対話的に選ぶ'), body: t('Use fzf and zi when several paths match. This is optional: plain z works without fzf.', '多个路径匹配时使用 fzf 与 zi。此项可选，普通 z 不依赖 fzf。', '複数候補には fzf と zi。任意の機能で、通常の z は fzf 不要です。'), links: [groups[2].links[2]] },
    { title: t('Tune your configuration', '调整进阶配置', '設定を調整'), body: groups[2].description, links: [groups[2].links[3],groups[2].links[0],groups[2].links[4]] },
  ];
  const title=t('zoxide learning path','zoxide 学习路线','zoxide 学習ルート');
  return <div className="mx-auto max-w-5xl px-5 py-12"><Breadcrumbs locale={locale} path="/tutorials" currentLabel={title} /><h1 className="mt-4 font-serif text-4xl font-bold">{title}</h1><p className="mt-5 max-w-3xl text-lg leading-8">{t('Start at the stage that matches your setup. Each step has a check before you move on.', '从适合当前环境的阶段开始，检查成功后再进入下一步。', '現在の環境に合う段階から始め、確認ができたら次へ進みます。')}</p><ol className="mt-10 space-y-10">{stages.map((stage,i)=><li key={stage.title} className="border-t border-gray-200 pt-6"><h2 className="font-serif text-2xl font-bold">{i+1}. {stage.title}</h2><p className="mt-3 max-w-3xl leading-7 text-gray-600">{stage.body}</p><ul className="mt-4 flex flex-wrap gap-x-7 gap-y-3">{stage.links.map(l=><li key={l.href}><Link href={l.href} className="text-blue-700 underline">{l.title}</Link></li>)}</ul></li>)}</ol><div className="mt-10 flex flex-wrap gap-6 border-t border-gray-200 pt-6 text-blue-700 underline"><Link href="/blog/zoxide-not-working">{t('A check failed? Start troubleshooting', '检查失败？开始排错', '失敗したらトラブル解決へ')}</Link><Link href="/blog">{t('All guides', '全部指南', 'ガイド一覧')}</Link><Link href="/faq">FAQ</Link></div></div>;
}
