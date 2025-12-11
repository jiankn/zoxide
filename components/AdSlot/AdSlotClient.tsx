'use client';

import dynamic from 'next/dynamic';

interface AdSlotClientProps {
  slotId: string;
  lazy?: boolean;
  className?: string;
}

// 在客户端按需加载广告组件，避免服务端渲染阶段出现 window 相关引用
const LazyAdSlot = dynamic(() => import('./AdSlot'), { ssr: false });

export default function AdSlotClient(props: AdSlotClientProps) {
  return <LazyAdSlot {...props} />;
}

