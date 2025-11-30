import AdSlot from '@/components/AdSlot/AdSlot';
import Link from 'next/link';
import { Play } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
  const tSeo = await getTranslations('seo');
  const tTutorials = await getTranslations('tutorials');
  return {
    title: tSeo('titles.videos'),
    description: tTutorials('videos.description') || 'Watch videos to learn zoxide installation, configuration, and advanced tips.',
    keywords: tSeo('video'),
  };
}

// Video data
const videos = [
  {
    id: 'quick-start',
    title: 'zoxide Quick Start',
    description: 'Install zoxide and learn the basics in 5 minutes.',
    duration: '5:30',
    youtubeId: 'aghxkpyRVDY',
    thumbnail: 'https://img.youtube.com/vi/aghxkpyRVDY/maxresdefault.jpg',
  },
  {
    id: 'advanced-config',
    title: 'zoxide Advanced Configuration',
    description: 'Environment variables, custom aliases, exclusions, and more.',
    duration: '12:15',
    youtubeId: '_tFuiIIADzg',
    thumbnail: 'https://img.youtube.com/vi/_tFuiIIADzg/maxresdefault.jpg',
  },
  {
    id: 'fzf-integration',
    title: 'zoxide + fzf Integration',
    description: 'Combine zoxide with fzf for powerful fuzzy directory search.',
    duration: '8:45',
    youtubeId: '-2Nz8rn05bk',
    thumbnail: 'https://img.youtube.com/vi/-2Nz8rn05bk/maxresdefault.jpg',
  },
];

export default function VideosPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <main className="lg:col-span-2 space-y-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              zoxide Video Tutorials
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Watch video guides to learn installation, configuration, and advanced tips.
            </p>
          </div>

          <AdSlot slotId="tutorials-top" />

          {/* Video list */}
          <div className="space-y-8">
            {videos.map((video) => (
              <div
                key={video.id}
                className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-800 overflow-hidden"
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
                    className="absolute inset-0 w-full h-full"
                    style={{ pointerEvents: 'auto' }}
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {video.title}
                    </h2>
                    <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Play className="h-4 w-4" />
                      {video.duration}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {video.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <AdSlot slotId="tutorials-middle" />

          {/* Related resources */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Related Tutorials
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Link
                href="/tutorials/quick-start"
                className="block rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-800"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Quick Start
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get started with zoxide in minutes.
                </p>
              </Link>
              <Link
                href="/tutorials/advanced-config"
                className="block rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-800"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Advanced Configuration
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Learn advanced setup tips.
                </p>
              </Link>
            </div>
          </section>

          <AdSlot slotId="tutorials-bottom" />
        </main>

        <aside className="hidden lg:block">
          <div className="sticky top-20 self-start max-h-[calc(100vh-80px)]">
            <AdSlot slotId="tutorials-sidebar" lazy={true} />
          </div>
        </aside>
      </div>
    </div>
  );
}
