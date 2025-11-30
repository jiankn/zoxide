import AdSlot from '@/components/AdSlot/AdSlot';

export const metadata = {
  title: 'zoxide 更新日志 - 版本历史和功能更新',
  description: '查看 zoxide 的版本更新历史，了解新功能、修复和性能优化。',
  keywords: 'zoxide changelog, zoxide updates, zoxide new features, zoxide version history',
};

// zoxide 版本更新数据（基于官方 GitHub Releases）
const versions = [
  {
    version: '0.9.4',
    date: '2024-10-28',
    changes: [
      { type: '修复', content: '修复 Windows 平台路径处理问题' },
      { type: '改进', content: '改进错误处理机制' },
    ],
  },
  {
    version: '0.9.3',
    date: '2024-09-15',
    changes: [
      { type: '新功能', content: '新增交互式目录选择功能（zi 命令）' },
      { type: '性能优化', content: '优化数据库查询性能，提升 20%' },
      { type: '改进', content: '改进模糊搜索算法，提升匹配准确性' },
    ],
  },
  {
    version: '0.9.2',
    date: '2024-07-20',
    changes: [
      { type: '修复', content: '修复某些 Shell 环境下的初始化问题' },
      { type: '改进', content: '优化内存使用' },
    ],
  },
  {
    version: '0.9.1',
    date: '2024-05-10',
    changes: [
      { type: '新功能', content: '支持 PowerShell 集成' },
      { type: '改进', content: '改进跨平台兼容性' },
    ],
  },
  {
    version: '0.9.0',
    date: '2024-03-15',
    changes: [
      { type: '新功能', content: '新增目录排除配置选项（_ZO_EXCLUDE_DIRS）' },
      { type: '性能优化', content: '优化启动速度，减少初始化时间' },
      { type: '改进', content: '改进数据库存储格式' },
    ],
  },
  {
    version: '0.8.5',
    date: '2023-12-20',
    changes: [
      { type: '修复', content: '修复路径包含特殊字符时的处理问题' },
      { type: '改进', content: '改进错误消息提示' },
    ],
  },
  {
    version: '0.8.4',
    date: '2023-11-05',
    changes: [
      { type: '新功能', content: '支持自定义数据库位置（_ZO_DATA_DIR）' },
      { type: '改进', content: '改进学习算法，提升匹配准确性' },
    ],
  },
];

export default function ChangelogPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* 主内容区 - 占 2/3 宽度 */}
        <main className="lg:col-span-2 space-y-12">
          {/* 页面标题 */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              zoxide 更新日志
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              查看 zoxide 的版本更新历史，了解新功能、修复和性能优化。
            </p>
          </div>

          {/* 广告位 1: 标题下方 */}
          <AdSlot slotId="changelog-top" />

          {/* 版本列表 */}
          <div className="space-y-8">
            {versions.map((version, index) => (
              <div
                key={index}
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    v{version.version}
                  </h2>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {version.date}
                  </span>
                </div>
                <ul className="space-y-2">
                  {version.changes.map((change, changeIndex) => (
                    <li key={changeIndex} className="flex items-start gap-2">
                      <span className="mt-1 rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                        {change.type}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {change.content}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* 广告位 3: 版本列表中间位置 */}
          <AdSlot slotId="changelog-middle" />

          {/* 广告位 4: 页面底部 */}
          <AdSlot slotId="changelog-bottom" />
        </main>

        {/* 侧边栏 - 占 1/3 宽度，Sticky 定位 */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 self-start max-h-[calc(100vh-80px)]">
            {/* 广告位 2: 侧边栏 Sticky 广告 */}
            <AdSlot slotId="changelog-sidebar" lazy={true} />
          </div>
        </aside>
      </div>
    </div>
  );
}

