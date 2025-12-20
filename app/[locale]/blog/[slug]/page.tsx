import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import dynamic from 'next/dynamic';
import { Link } from '@/i18n/routing';
import { getPostBySlug, getRelatedPosts } from '@/data/blog';
import RelatedPosts from '@/components/RelatedPosts/RelatedPosts';
import { createMarkdownComponents } from '@/components/Markdown/markdownComponents';
import { getTranslations, getLocale } from 'next-intl/server';
import { Calendar, Clock, User } from 'lucide-react';
import { generateArticleSchema } from '@/lib/seo/schema';
import { generateMultilingualMetadata } from '@/lib/seo/metadata';

// 客户端再加载的交互组件，减小首包体积
const AdSlot = dynamic(() => import('@/components/AdSlot/AdSlotClient'), {
  loading: () => null,
});
const ShareButtons = dynamic(() => import('@/components/ShareButtons/ShareButtons'), {
  loading: () => null,
});

const blogMarkdownComponents = createMarkdownComponents({ linkTarget: '_blank' });

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
}

export async function generateStaticParams() {
  const { getAllPosts } = await import('@/data/blog');
  const posts = getAllPosts();
  
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug, locale } = await params;
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
  const author = tData?.author || post.author;
  const tSeo = await getTranslations('seo');
  
  // 使用 SEO 标题模板，替换 {title} 占位符
  const seoTitle = tSeo('titles.blogPost', { title });
  
  // 优化 description：确保长度在 150-160 字符之间，包含关键词
  const optimizedDescription = excerpt.length > 160 
    ? excerpt.substring(0, 157) + '...'
    : excerpt;

  // 生成多语言 SEO 元数据（包括 canonical 和 hreflang）
  // canonical URL 由 generateMultilingualMetadata 自动生成，确保格式一致
  const canonicalUrl = `https://zoxide.org/${locale}/blog/${slug}`;
  const imageUrl = `https://zoxide.org/icon.svg`;
  
  const metadata = generateMultilingualMetadata(
    locale,
    `/blog/${slug}`,
    {
      title: seoTitle,
      description: optimizedDescription,
      keywords: post.tags.join(', '),
      // Open Graph 元数据
      openGraph: {
        title: seoTitle,
        description: optimizedDescription,
        url: canonicalUrl,
        siteName: 'zoxide.org',
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
        locale: locale === 'zh' ? 'zh_CN' : 'en_US',
        type: 'article',
        publishedTime: post.date,
        authors: [author],
        tags: post.tags,
      },
      // Twitter Card 元数据
      twitter: {
        card: 'summary_large_image',
        title: seoTitle,
        description: optimizedDescription,
        images: [imageUrl],
      },
    }
  );

  return metadata;
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
  };
  const category = tData?.category || categoryMap[post.category] || post.category;
  const author = tData?.author || post.author;
  // 标签翻译
  const tags = tData?.tags || post.tags;

  // 使用与 canonical URL 一致的格式
  const articleUrl = `https://zoxide.org/${locale}/blog/${post.slug}`;
  
  // 生成文章结构化数据
  const articleSchema = generateArticleSchema(
    title,
    excerpt,
    author,
    post.date,
    articleUrl,
    post.date // dateModified 使用发布日期（如果有更新日期可以单独设置）
  );

  // 如果是教程类文章，添加 HowTo Schema
  const isTutorial = post.category === '教程' || post.category === 'Tutorial';
  let howToSchema = null;
  
  if (isTutorial && slug === 'zoxide-init-guide') {
    // 为 zoxide init 文章生成 HowTo Schema
    const { generateHowToSchema } = await import('@/lib/seo/schema');
    howToSchema = generateHowToSchema(
      title,
      excerpt,
      [
        {
          name: 'Install zoxide',
          text: 'Install zoxide using a package manager like Homebrew, Scoop, or Apt.',
        },
        {
          name: 'Initialize Shell',
          text: 'Run zoxide init command for your shell (bash, zsh, fish, PowerShell, or nushell).',
        },
        {
          name: 'Configure Shell',
          text: 'Add the initialization command to your shell configuration file.',
        },
        {
          name: 'Reload Shell',
          text: 'Reload your shell or open a new terminal window to activate zoxide.',
        },
      ]
    );
  }

  return (
    <>
      {/* 文章结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />
      {/* HowTo 结构化数据（如果是教程） */}
      {howToSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(howToSchema),
          }}
        />
      )}
      {/* 面包屑导航结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: locale === 'zh' ? '首页' : 'Home',
                item: `https://zoxide.org/${locale}/`,
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: locale === 'zh' ? '博客' : 'Blog',
                item: `https://zoxide.org/${locale}/blog`,
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: title,
                item: articleUrl,
              },
            ],
          }),
        }}
      />
      <div className="container mx-auto max-w-7xl px-4 py-12">
        {/* 面包屑导航 UI */}
        <nav className="mb-6 text-sm text-gray-600" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="hover:text-blue-600 transition-colors">
                {locale === 'zh' ? '首页' : 'Home'}
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link href="/blog" className="hover:text-blue-600 transition-colors">
                {locale === 'zh' ? '博客' : 'Blog'}
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 truncate max-w-xs" aria-current="page">
              {title}
            </li>
          </ol>
        </nav>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <main className="lg:col-span-2 space-y-8">
            <header>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {title}
              </h1>
              
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

              <ShareButtons title={title} url={`/${locale}/blog/${post.slug}`} />
            </header>

            <AdSlot slotId="article-top" />

            <article className="markdown-content max-w-3xl mx-auto">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={blogMarkdownComponents}
              >
                {content}
              </ReactMarkdown>
            </article>

            <div className="my-8">
              <AdSlot slotId="in-article" />
            </div>

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

            <AdSlot slotId="article-bottom" />
            <RelatedPosts posts={relatedPosts} />
          </main>

          <aside className="hidden lg:block">
            <div className="sticky top-20 self-start max-h-[calc(100vh-80px)]">
              <AdSlot slotId="article-sidebar" lazy={true} />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
