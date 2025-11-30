'use client';

interface LogoProps {
  size?: number;
  className?: string;
}

/**
 * Simple “z” mark that inherits current text color.
 */
export default function Logo({ size = 24, className }: LogoProps) {
  const mergedClass = [className].filter(Boolean).join(' ');

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={mergedClass}
      aria-hidden="true"
      focusable="false"
    >
      <rect x="3" y="3" width="18" height="18" rx="4" className="fill-current opacity-10" />
      <path
        d="M8 8h8l-8 8h8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
