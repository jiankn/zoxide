import type { Components } from 'react-markdown';
import CodeBlockWrapper from '@/components/CodeBlock/CodeBlockWrapper';
import { getContentRedirect, localizePath } from '@/data/search-intents';

interface MarkdownComponentOptions {
  /**
   * Force links rendered by markdown to open in a specific target.
   * When undefined, the markdown content controls the target attribute.
   */
  linkTarget?: '_blank' | '_self';
  /**
   * Keep root-relative article links in the reader's current language.
   */
  locale?: string;
}

export function createMarkdownComponents(
  options: MarkdownComponentOptions = {}
): Components {
  const { linkTarget, locale } = options;

  const Code = ({
    inline,
    className,
    children,
    ...props
  }: React.HTMLAttributes<HTMLElement> & { inline?: boolean }) => {
    const match = /language-(\w+)/.exec(className || '');

    if (!inline && match) {
      return (
        <CodeBlockWrapper className={className || ''} language={match[1]}>
          {children}
        </CodeBlockWrapper>
      );
    }

    return (
      <code
        className="rounded bg-[#e6eaf1] px-1.5 py-0.5 font-mono text-[0.9em] text-ink"
        {...props}
      >
        {children}
      </code>
    );
  };

  return {
    pre({ children }) {
      return <>{children}</>;
    },
    code: Code,
    a({ children, ...props }) {
      const originalHref = props.href;
      const isExternal = Boolean(
        originalHref && /^(?:https?:)?\/\//i.test(originalHref)
      );
      const canonicalHref = originalHref === '/en' || originalHref === '/en/'
        ? '/'
        : originalHref?.replace(/^\/en(?=\/)/, '');
      const resolvedHref = canonicalHref && locale
        ? getContentRedirect(locale, canonicalHref) || canonicalHref
        : canonicalHref;
      const alreadyLocalized = Boolean(
        resolvedHref && /^\/(?:zh|ja)(?:\/|$)/.test(resolvedHref)
      );
      const isRootRelative = Boolean(
        resolvedHref?.startsWith('/') && !resolvedHref.startsWith('//')
      );
      let href = resolvedHref;
      // Evidence files are shared static assets, with no locale prefix or trailing slash.
      if (resolvedHref && locale && isRootRelative && !resolvedHref.startsWith('/evidence/')) {
        href = alreadyLocalized
          ? `${resolvedHref.replace(/\/+$/, '')}/`
          : localizePath(locale, resolvedHref);
      }
      const target = isExternal ? (linkTarget ?? props.target) : undefined;

      return (
        <a
          {...props}
          href={href}
          target={target}
          rel={target === '_blank' ? 'noopener noreferrer' : props.rel}
          className="font-semibold text-blue-700 underline decoration-blue-200 underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
        >
          {children}
        </a>
      );
    },
    h1({ children, ...props }) {
      return (
        <h1
          className="font-serif font-bold text-4xl text-ink mt-10 mb-4"
          {...props}
        >
          {children}
        </h1>
      );
    },
    h2({ children, ...props }) {
      return (
        <h2
          className="font-serif font-bold text-2xl text-ink border-b border-rule pb-2 mt-10 mb-4"
          {...props}
        >
          {children}
        </h2>
      );
    },
    h3({ children, ...props }) {
      return (
        <h3
          className="font-serif font-bold text-xl text-ink mt-10 mb-4"
          {...props}
        >
          {children}
        </h3>
      );
    },
    p({ children, ...props }) {
      return (
        <p
          className="font-sans text-base leading-7 text-ink mb-4"
          {...props}
        >
          {children}
        </p>
      );
    },
    ul({ children, ...props }) {
      return (
        <ul
          className="list-disc text-ink mb-4 space-y-2 ml-6"
          {...props}
        >
          {children}
        </ul>
      );
    },
    ol({ children, ...props }) {
      return (
        <ol
          className="list-decimal text-ink mb-4 space-y-2 ml-6"
          {...props}
        >
          {children}
        </ol>
      );
    },
    table({ children, ...props }) {
      return (
        <div className="mb-6 max-w-full overflow-x-auto rounded-lg border border-rule">
          <table
            className="min-w-full border-collapse bg-white text-left text-sm"
            {...props}
          >
            {children}
          </table>
        </div>
      );
    },
    th({ children, ...props }) {
      return (
        <th
          className="whitespace-nowrap border-b border-gray-200 bg-gray-50 px-4 py-3 font-semibold text-gray-900"
          {...props}
        >
          {children}
        </th>
      );
    },
    td({ children, ...props }) {
      return (
        <td
          className="min-w-40 border-b border-gray-100 px-4 py-3 align-top leading-6 text-gray-700"
          {...props}
        >
          {children}
        </td>
      );
    },
    li({ children, ...props }) {
      return (
        <li className="mb-1" {...props}>
          {children}
        </li>
      );
    },
    blockquote({ children, ...props }) {
      return (
        <blockquote
          className="border-l-4 border-[var(--line-zsh)] bg-paper py-2 pl-4 pr-3 my-6 text-base text-ink"
          {...props}
        >
          {children}
        </blockquote>
      );
    },
  };
}

