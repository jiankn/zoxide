import type { Components } from 'react-markdown';
import CodeBlockWrapper from '@/components/CodeBlock/CodeBlockWrapper';

interface MarkdownComponentOptions {
  /**
   * Force links rendered by markdown to open in a specific target.
   * When undefined, the markdown content controls the target attribute.
   */
  linkTarget?: '_blank' | '_self';
}

export function createMarkdownComponents(
  options: MarkdownComponentOptions = {}
): Components {
  const { linkTarget } = options;

  return {
    code({ inline, className, children, ...props }) {
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
          className="bg-[#E3E2E0] dark:bg-[#37352F] text-[#EB5757] dark:text-[#FF7B72] px-1.5 py-0.5 rounded font-mono text-sm"
          {...props}
        >
          {children}
        </code>
      );
    },
    a({ children, ...props }) {
      const target = linkTarget ?? props.target;

      return (
        <a
          {...props}
          target={target}
          rel={target === '_blank' ? 'noopener noreferrer' : props.rel}
          className="text-gray-500 underline decoration-gray-300 underline-offset-4 hover:text-black dark:hover:text-gray-300 transition-colors"
        >
          {children}
        </a>
      );
    },
    h1({ children, ...props }) {
      return (
        <h1
          className="font-serif font-bold text-4xl text-[#37352F] dark:text-gray-100 mt-10 mb-4"
          {...props}
        >
          {children}
        </h1>
      );
    },
    h2({ children, ...props }) {
      return (
        <h2
          className="font-serif font-bold text-2xl text-[#37352F] dark:text-gray-100 border-b border-[#E9E9E7] dark:border-[#2F2F2F] pb-2 mt-10 mb-4"
          {...props}
        >
          {children}
        </h2>
      );
    },
    h3({ children, ...props }) {
      return (
        <h3
          className="font-serif font-bold text-xl text-[#37352F] dark:text-gray-100 mt-10 mb-4"
          {...props}
        >
          {children}
        </h3>
      );
    },
    p({ children, ...props }) {
      return (
        <p
          className="font-sans text-base leading-7 text-[#37352F] dark:text-gray-300 mb-4"
          {...props}
        >
          {children}
        </p>
      );
    },
    ul({ children, ...props }) {
      return (
        <ul
          className="list-disc text-[#37352F] dark:text-gray-300 mb-4 space-y-2 ml-6"
          {...props}
        >
          {children}
        </ul>
      );
    },
    ol({ children, ...props }) {
      return (
        <ol
          className="list-decimal text-[#37352F] dark:text-gray-300 mb-4 space-y-2 ml-6"
          {...props}
        >
          {children}
        </ol>
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
          className="border-l-4 border-black dark:border-gray-300 pl-4 py-1 my-6 italic text-lg font-serif text-[#37352F] dark:text-gray-300"
          {...props}
        >
          {children}
        </blockquote>
      );
    },
  };
}

