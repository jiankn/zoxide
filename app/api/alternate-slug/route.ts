import { NextRequest, NextResponse } from 'next/server';
import { getAlternateSlug } from '@/data/blog';

/**
 * API 端点：获取文章在目标语言中对应的 slug
 * 用于语言切换时正确导航到配对文章
 * 
 * 参数：
 * - slug: 当前文章的 slug
 * - locale: 目标语言 (zh | en | ja)
 * - type: 内容类型（目前只支持 blog，未来可扩展）
 * 
 * 返回：
 * - alternateSlug: 配对的 slug，或 null（无对应文章）
 */
export async function GET(request: NextRequest) {
    const slug = request.nextUrl.searchParams.get('slug');
    const locale = request.nextUrl.searchParams.get('locale') as 'zh' | 'en' | 'ja' | null;

    if (!slug || !locale) {
        return NextResponse.json(
            { error: 'Missing required parameters: slug and locale' },
            { status: 400 }
        );
    }

    if (!['zh', 'en', 'ja'].includes(locale)) {
        return NextResponse.json(
            { error: 'Invalid locale, must be zh, en, or ja' },
            { status: 400 }
        );
    }


    const alternateSlug = getAlternateSlug(slug, locale);

    return NextResponse.json({ alternateSlug });
}
