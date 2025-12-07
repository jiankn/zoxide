import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getPostBySlug, getRelatedPosts } from '@/data/blog';
import AdSlot from '@/components/AdSlot/AdSlot';
import ShareButtons from '@/components/ShareButtons/ShareButtons';
import RelatedPosts from '@/components/RelatedPosts/RelatedPosts';
import { createMarkdownComponents } from '@/components/Markdown/markdownComponents';
import { Calendar, Clock, User } from 'lucide-react';
import { generateArticleSchema } from '@/lib/seo/schema';
import { getTranslations, getLocale } from 'next-intl/server';
import { generateMultilingualMetadata } from '@/lib/seo/metadata';

const blogMarkdownComponents = createMarkdownComponents({ linkTarget: '_blank' });

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
  const locale = await getLocale();
  const post = getPostBySlug(slug);
  const t = await getTranslations('blog');
  
  if (!post) {
    const tNotFound = await getTranslations('blog');
    return {
      title: tNotFound('notFound') || (locale === 'zh' ? '文章未找到' : 'Post Not Found'),
    };
  }

  const tData = t.raw(`data.${slug}`);
  const title = tData?.title || post.title;
  const excerpt = tData?.excerpt || post.excerpt;
  const tSeo = await getTranslations('seo');
  
  // 使用 SEO 标题模板，替换 {title} 占位符
  const seoTitle = tSeo('titles.blogPost', { title });

  // 生成多语言 SEO 元数据（包括 canonical 和 hreflang）
  return generateMultilingualMetadata(
    locale,
    `/blog/${slug}`,
    {
      title: seoTitle,
      description: excerpt,
      keywords: post.tags.join(', '),
    }
  );
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const locale = await getLocale();
  const post = getPostBySlug(slug);
  const t = await getTranslations('blog.detail');

  if (!post) {
    notFound();
  }

  const tBlog = await getTranslations('blog');
  const tData = tBlog.raw(`data.${slug}`) || {};
  const relatedPosts = getRelatedPosts(post, 3);
  
  // 获取翻译后的数据
  const title = tData?.title || post.title;
  const excerpt = tData?.excerpt || post.excerpt;
  const content = tData?.content || post.content;
  // 分类翻译：如果数据文件中的分类是中文，需要翻译
  const categoryMap: Record<string, string> = {
    '教程': locale === 'zh' ? '教程' : 'Tutorial',
    '对比': locale === 'zh' ? '对比' : 'Comparison',
    '技巧': locale === 'zh' ? '技巧' : 'Tips',
    '故障排除': locale === 'zh' ? '故障排除' : 'Troubleshooting',
  };
  const category = tData?.category || categoryMap[post.category] || post.category;
  const author = tData?.author || post.author;
  // 标签翻译
  const tags = tData?.tags || post.tags;

  const articleSchema = generateArticleSchema(
    title,
    excerpt,
    author,
    post.date,
    `https://zoxide.org/${locale}/blog/${post.slug}`
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {title}
            </h1>
            
            {/* 元信息 */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{post.readTime} {t('readTime')}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{author}</span>
              </div>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                {category}
              </span>
            </div>

            {/* 分享按钮 */}
            <ShareButtons title={title} url={`/${locale}/blog/${post.slug}`} />
          </header>

          {/* 广告位 1: 文章标题下方 */}
          <AdSlot slotId="article-top" />

          {/* 文章正文 */}
          <article className="markdown-content max-w-3xl mx-auto">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={blogMarkdownComponents}
            >
              {content}
            </ReactMarkdown>
          </article>

          {/* 广告位 3: 文章内容中段（在第3-4段之后） */}
          <div className="my-8">
            <AdSlot slotId="in-article" />
          </div>

          {/* 标签 */}
          <div className="flex flex-wrap gap-2">
            {tags.map((tag: string) => (
              <span
                key={tag}
                className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
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

