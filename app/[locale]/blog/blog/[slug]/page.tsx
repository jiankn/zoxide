import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getPostBySlug, getRelatedPosts } from '@/data/blog';
import AdSlot from '@/components/AdSlot/AdSlot';
import ShareButtons from '@/components/ShareButtons/ShareButtons';
import RelatedPosts from '@/components/RelatedPosts/RelatedPosts';
import { Calendar, Clock, User } from 'lucide-react';
import { generateArticleSchema } from '@/lib/seo/schema';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// 生成静态路径
export async function generateStaticParams() {
  const { getAllPosts } = await import('@/data/blog');
  const posts = getAllPosts();
  
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// 生成元数据
export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  
  if (!post) {
    return {
      title: '文章未找到',
    };
  }

  return {
    title: `${post.title} - zoxide 博客`,
    description: post.excerpt,
    keywords: post.tags.join(', '),
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(post, 3);
  const articleSchema = generateArticleSchema(
    post.title,
    post.excerpt,
    post.author,
    post.date,
    `https://zoxide.org/blog/${post.slug}`
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />
      <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* 主内容区 - 占 2/3 宽度 */}
        <main className="lg:col-span-2 space-y-8">
          {/* 文章标题和元信息 */}
          <header>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {post.title}
            </h1>
            
            {/* 元信息 */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{post.readTime} 分钟阅读</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{post.author}</span>
              </div>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                {post.category}
              </span>
            </div>

            {/* 分享按钮 */}
            <ShareButtons title={post.title} url={`/blog/${post.slug}`} />
          </header>

          {/* 广告位 1: 文章标题下方 */}
          <AdSlot slotId="article-top" />

          {/* 文章正文 */}
          <article className="markdown-content">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // 自定义代码块样式
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
                // 自定义链接样式
                a: ({ node, ...props }: any) => (
                  <a
                    {...props}
                    className="text-blue-600 hover:text-blue-800 underline dark:text-blue-400 dark:hover:text-blue-300"
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                ),
                // 自定义标题样式
                h1: ({ node, ...props }: any) => (
                  <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900 dark:text-white" {...props} />
                ),
                h2: ({ node, ...props }: any) => (
                  <h2 className="text-2xl font-bold mt-6 mb-3 text-gray-900 dark:text-white" {...props} />
                ),
                h3: ({ node, ...props }: any) => (
                  <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-900 dark:text-white" {...props} />
                ),
                // 自定义段落样式
                p: ({ node, ...props }: any) => (
                  <p className="mb-4 text-gray-700 dark:text-gray-300 leading-7" {...props} />
                ),
                // 自定义列表样式
                ul: ({ node, ...props }: any) => (
                  <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300" {...props} />
                ),
                ol: ({ node, ...props }: any) => (
                  <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300" {...props} />
                ),
                li: ({ node, ...props }: any) => (
                  <li className="ml-4" {...props} />
                ),
                // 自定义引用样式
                blockquote: ({ node, ...props }: any) => (
                  <blockquote
                    className="border-l-4 border-blue-500 pl-4 italic my-4 text-gray-600 dark:text-gray-400"
                    {...props}
                  />
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </article>

          {/* 广告位 3: 文章内容中段（在第3-4段之后） */}
          <div className="my-8">
            <AdSlot slotId="in-article" />
          </div>

          {/* 标签 */}
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* 广告位 4: 文章底部 */}
          <AdSlot slotId="article-bottom" />

          {/* 相关文章推荐 */}
          <RelatedPosts posts={relatedPosts} />
        </main>

        {/* 侧边栏 - 占 1/3 宽度，Sticky 定位 */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 self-start max-h-[calc(100vh-80px)]">
            {/* 广告位 2: 侧边栏顶部 Sticky 广告 */}
            <AdSlot slotId="article-sidebar" lazy={true} />
          </div>
        </aside>
      </div>
    </div>
    </>
  );
}

