import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getTutorialBySlug, getAllTutorials } from '@/data/tutorials';
import AdSlot from '@/components/AdSlot/AdSlot';
import CodeBlockWrapper from '@/components/CodeBlock/CodeBlockWrapper';
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

          <article className="markdown-content max-w-3xl mx-auto">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code: ({ node, inline, className, children, ...props }: any) => {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <CodeBlockWrapper className={className || ''} language={match[1]}>
                      {children}
                    </CodeBlockWrapper>
                  ) : (
                    <code
                      className="bg-[#E3E2E0] dark:bg-[#37352F] text-[#EB5757] dark:text-[#FF7B72] px-1.5 py-0.5 rounded font-mono text-sm"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                a: ({ node, ...props }: any) => (
                  <a
                    {...props}
                    className="text-gray-500 underline decoration-gray-300 underline-offset-4 hover:text-black dark:hover:text-gray-300 transition-colors"
                  />
                ),
                h1: ({ node, ...props }: any) => (
                  <h1 className="font-serif font-bold text-4xl text-[#37352F] dark:text-gray-100 mt-10 mb-4" {...props} />
                ),
                h2: ({ node, ...props }: any) => (
                  <h2 className="font-serif font-bold text-2xl text-[#37352F] dark:text-gray-100 border-b border-[#E9E9E7] dark:border-[#2F2F2F] pb-2 mt-10 mb-4" {...props} />
                ),
                h3: ({ node, ...props }: any) => (
                  <h3 className="font-serif font-bold text-xl text-[#37352F] dark:text-gray-100 mt-10 mb-4" {...props} />
                ),
                p: ({ node, ...props }: any) => (
                  <p className="font-sans text-base leading-7 text-[#37352F] dark:text-gray-300 mb-4" {...props} />
                ),
                ul: ({ node, ...props }: any) => (
                  <ul className="list-disc text-[#37352F] dark:text-gray-300 mb-4 space-y-2 ml-6" {...props} />
                ),
                ol: ({ node, ...props }: any) => (
                  <ol className="list-decimal text-[#37352F] dark:text-gray-300 mb-4 space-y-2 ml-6" {...props} />
                ),
                li: ({ node, ...props }: any) => (
                  <li className="mb-1" {...props} />
                ),
                blockquote: ({ node, ...props }: any) => (
                  <blockquote
                    className="border-l-4 border-black dark:border-gray-300 pl-4 py-1 my-6 italic text-lg font-serif text-[#37352F] dark:text-gray-300"
                    {...props}
                  />
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

