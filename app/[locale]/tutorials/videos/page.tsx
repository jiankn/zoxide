import Link from 'next/link';
import { Play } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { generateMultilingualMetadata } from '@/lib/seo/metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const tSeo = await getTranslations('seo');
  const tTutorials = await getTranslations('tutorials');
  return generateMultilingualMetadata(
    locale,
    '/tutorials/videos',
    {
      title: tSeo('titles.videos'),
      description: tTutorials('videos.description') || 'Watch videos to learn zoxide installation, configuration, and advanced tips.',
      keywords: tSeo('video'),
    }
  );
}

// Video data
const videos = [
  {
    id: 'quick-start',
    title: 'zoxide has forever improved the way I navigate in the terminal.',
    description: 'A practical overview of installing zoxide, shell initialization, and everyday directory navigation.',
    author: 'Dreams of Autonomy',
    authorUrl: 'https://www.youtube.com/@dreamsofautonomy',
    youtubeId: 'aghxkpyRVDY',
  },
  {
    id: 'advanced-config',
    title: 'zoxide — better `cd` command',
    description: 'An introduction to zoxide commands and shell integration, with examples of faster terminal navigation.',
    author: 'Coding in Public',
    authorUrl: 'https://www.youtube.com/@CodinginPublic',
    youtubeId: '_tFuiIIADzg',
  },
  {
    id: 'fzf-integration',
    title: 'Mastering zoxide to Boost Your Terminal Productivity - Navigate Like a Wizard',
    description: 'A guided demonstration of zoxide workflows, interactive selection, and terminal productivity tips.',
    author: 'Marco Peluso',
    authorUrl: 'https://www.youtube.com/@MarcoPeluso',
    youtubeId: '-2Nz8rn05bk',
  },
];

const localizedCopy = {
  en: {
    introduction: 'Watch independently produced video guides, then use the notes below to choose the right tutorial for your setup.',
    videoBy: 'Video by',
    watch: 'Watch on YouTube',
    related: 'Related Tutorials',
    quickStart: 'Quick Start',
    quickStartDescription: 'Get started with zoxide in minutes.',
    advanced: 'Advanced Configuration',
    advancedDescription: 'Learn advanced setup tips.',
    descriptions: videos.map((video) => video.description),
  },
  zh: {
    introduction: '观看独立创作者制作的 zoxide 视频，并结合本站说明选择适合自己环境的教程。',
    videoBy: '视频作者',
    watch: '前往 YouTube 观看',
    related: '相关教程',
    quickStart: '快速开始',
    quickStartDescription: '用几分钟完成 zoxide 安装与首次配置。',
    advanced: '高级配置',
    advancedDescription: '了解环境变量、排除目录和 Shell 配置。',
    descriptions: [
      '实用介绍 zoxide 的安装、Shell 初始化和日常目录跳转。',
      '通过示例介绍 zoxide 命令、匹配方式和 Shell 集成。',
      '演示 zoxide 工作流、交互式选择和终端效率技巧。',
    ],
  },
  ja: {
    introduction: '独立クリエイターによるzoxide動画を、各環境に合うチュートリアルを選ぶための補足説明とともに紹介します。',
    videoBy: '動画制作者',
    watch: 'YouTubeで見る',
    related: '関連チュートリアル',
    quickStart: 'クイックスタート',
    quickStartDescription: '数分でzoxideの導入と初期設定を完了します。',
    advanced: '高度な設定',
    advancedDescription: '環境変数、除外ディレクトリ、シェル設定を学びます。',
    descriptions: [
      'zoxideのインストール、シェル初期化、日常的なディレクトリ移動を実例で紹介します。',
      'zoxideのコマンド、マッチング、シェル統合を例とともに解説します。',
      'zoxideのワークフロー、対話式選択、ターミナル効率化のヒントを実演します。',
    ],
  },
};

export default async function VideosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const copy = localizedCopy[locale as keyof typeof localizedCopy] || localizedCopy.en;

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      <main className="space-y-12">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            zoxide Video Tutorials
          </h1>
          <p className="text-lg text-gray-600">
            {copy.introduction}
          </p>
        </div>

        {/* Video list */}
        <div className="space-y-8">
          {videos.map((video, index) => (
            <div
              key={video.id}
              className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden"
            >
              <div className="aspect-video bg-gray-900 relative overflow-hidden rounded-t-lg">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${video.youtubeId}?modestbranding=1&rel=0&showinfo=0&controls=1&disablekb=0`}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  className="absolute inset-0 w-full h-full"
                  style={{ pointerEvents: 'auto' }}
                />
              </div>
              <div className="p-6">
                <div className="mb-2">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {video.title}
                  </h2>
                  <a
                    href={video.authorUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                  >
                    <Play className="h-4 w-4" />
                    {copy.videoBy} {video.author}
                  </a>
                </div>
                <p className="text-gray-600">
                  {copy.descriptions[index]}
                </p>
                <a
                  href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-sm text-blue-600 underline hover:text-blue-800"
                >
                  {copy.watch}
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Related resources */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {copy.related}
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Link
              href="/tutorials/quick-start"
              className="block rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md"
            >
              <h3 className="font-semibold text-gray-900 mb-2">
                {copy.quickStart}
              </h3>
              <p className="text-sm text-gray-600">
                {copy.quickStartDescription}
              </p>
            </Link>
            <Link
              href="/tutorials/advanced-config"
              className="block rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md"
            >
              <h3 className="font-semibold text-gray-900 mb-2">
                {copy.advanced}
              </h3>
              <p className="text-sm text-gray-600">
                {copy.advancedDescription}
              </p>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

