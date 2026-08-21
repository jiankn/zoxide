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
        className="bg-[#E3E2E0] text-[#EB5757] px-1.5 py-0.5 rounded font-mono text-sm"
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
      if (resolvedHref && locale && isRootRelative) {
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
          className="text-gray-500 underline decoration-gray-300 underline-offset-4 hover:text-black transition-colors"
        >
          {children}
        </a>
      );
    },
    h1({ children, ...props }) {
      return (
        <h1
          className="font-serif font-bold text-4xl text-[#37352F] mt-10 mb-4"
          {...props}
        >
          {children}
        </h1>
      );
    },
    h2({ children, ...props }) {
      return (
        <h2
          className="font-serif font-bold text-2xl text-[#37352F] border-b border-[#E9E9E7] pb-2 mt-10 mb-4"
          {...props}
        >
          {children}
        </h2>
      );
    },
    h3({ children, ...props }) {
      return (
        <h3
          className="font-serif font-bold text-xl text-[#37352F] mt-10 mb-4"
          {...props}
        >
          {children}
        </h3>
      );
    },
    p({ children, ...props }) {
      return (
        <p
          className="font-sans text-base leading-7 text-[#37352F] mb-4"
          {...props}
        >
          {children}
        </p>
      );
    },
    ul({ children, ...props }) {
      return (
        <ul
          className="list-disc text-[#37352F] mb-4 space-y-2 ml-6"
          {...props}
        >
          {children}
        </ul>
      );
    },
    ol({ children, ...props }) {
      return (
        <ol
          className="list-decimal text-[#37352F] mb-4 space-y-2 ml-6"
          {...props}
        >
          {children}
        </ol>
      );
    },
    table({ children, ...props }) {
      return (
        <div className="mb-6 max-w-full overflow-x-auto rounded-lg border border-gray-200">
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
          className="border-l-4 border-black pl-4 py-1 my-6 italic text-lg font-serif text-[#37352F]"
          {...props}
        >
          {children}
        </blockquote>
      );
    },
  };
}

