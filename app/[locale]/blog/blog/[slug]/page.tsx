import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getPostBySlug, getRelatedPosts } from '@/data/blog';
import AdSlot from '@/components/AdSlot/AdSlot';
import ShareButtons from '@/components/ShareButtons/ShareButtons';
import RelatedPosts from '@/components/RelatedPosts/RelatedPosts';
import CodeBlockWrapper from '@/components/CodeBlock/CodeBlockWrapper';
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
                    target="_blank"
                    rel="noopener noreferrer"
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

