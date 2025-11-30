import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getTutorialBySlug, getAllTutorials } from '@/data/tutorials';
import AdSlot from '@/components/AdSlot/AdSlot';
import Link from 'next/link';
import { Calendar, Clock, BookOpen } from 'lucide-react';

interface TutorialPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// 生成静态路径
export async function generateStaticParams() {
  const tutorials = getAllTutorials();
  
  return tutorials.map((tutorial) => ({
    slug: tutorial.slug,
  }));
}

// 生成元数据
export async function generateMetadata({ params }: TutorialPageProps) {
  const { slug } = await params;
  const tutorial = getTutorialBySlug(slug);
  
  if (!tutorial) {
    return {
      title: '教程未找到',
    };
  }

  return {
    title: `${tutorial.title} - zoxide 教程`,
    description: tutorial.excerpt,
  };
}

export default async function TutorialPage({ params }: TutorialPageProps) {
  const { slug } = await params;
  const tutorial = getTutorialBySlug(slug);

  if (!tutorial) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <main className="lg:col-span-2 space-y-8">
          <header>
            <div className="mb-4">
              <Link
                href="/tutorials"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
              >
                ← 返回教程列表
              </Link>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {tutorial.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{tutorial.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{tutorial.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>{tutorial.category}</span>
              </div>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                {tutorial.level}
              </span>
            </div>
          </header>

          <AdSlot slotId="tutorials-top" />

          <article className="markdown-content">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code: ({ node, inline, className, children, ...props }: any) => {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <div className="relative my-4">
                      <pre className="rounded-lg bg-gray-900 p-4 overflow-x-auto">
                        <code
                          className={className}
                          {...props}
                          style={{
                            color: '#e5e7eb',
                            fontSize: '0.875rem',
                          }}
                        >
                          {children}
                        </code>
                      </pre>
                    </div>
                  ) : (
                    <code
                      className={className}
                      {...props}
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.05)',
                        padding: '0.2rem 0.4rem',
                        borderRadius: '0.25rem',
                        fontSize: '0.9em',
                        color: '#e11d48',
                      }}
                    >
                      {children}
                    </code>
                  );
                },
                a: ({ node, ...props }: any) => (
                  <a
                    {...props}
                    className="text-blue-600 hover:text-blue-800 underline dark:text-blue-400 dark:hover:text-blue-300"
                  />
                ),
                h1: ({ node, ...props }: any) => (
                  <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900 dark:text-white" {...props} />
                ),
                h2: ({ node, ...props }: any) => (
                  <h2 className="text-2xl font-bold mt-6 mb-3 text-gray-900 dark:text-white" {...props} />
                ),
                h3: ({ node, ...props }: any) => (
                  <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-900 dark:text-white" {...props} />
                ),
                p: ({ node, ...props }: any) => (
                  <p className="mb-4 text-gray-700 dark:text-gray-300 leading-7" {...props} />
                ),
                ul: ({ node, ...props }: any) => (
                  <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300" {...props} />
                ),
                ol: ({ node, ...props }: any) => (
                  <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300" {...props} />
                ),
              }}
            >
              {tutorial.content}
            </ReactMarkdown>
          </article>

          <AdSlot slotId="tutorials-middle" />
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

