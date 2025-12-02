'use client';

import Image from 'next/image';

interface LogoProps {
  size?: number;
  className?: string;
}

/**
 * 导航 Logo 与站点 Favicon 复用同一份 icon.svg，
 * 保证品牌形象一致。
 */
export default function Logo({ size = 24, className }: LogoProps) {
  const mergedClass = [className].filter(Boolean).join(' ');

  return (
    <Image
      src="/icon.svg"
      alt="zoxide logo"
      width={size}
      height={size}
      className={mergedClass}
      priority
    />
  );
}

