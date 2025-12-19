import AdSlot from '@/components/AdSlot/AdSlot';

export const metadata = {
  title: 'zoxide vs 其他工具对比 - 性能和使用体验',
  description: '对比 zoxide 与 autojump、z、fasd 等工具的差异，了解为什么选择 zoxide。',
  keywords: 'zoxide vs autojump comparison, zoxide vs z, zoxide vs fasd, best cd replacement tool',
};

// 对比数据
const comparisons = [
  {
    tool: 'autojump',
    features: {
      '性能': '中等',
      '模糊搜索': '不支持',
      '学习算法': '基础',
      '跨平台': '是',
      '维护状态': '活跃',
    },
    zoxideFeatures: {
      '性能': '极快（Rust）',
      '模糊搜索': '支持',
      '学习算法': '智能',
      '跨平台': '是',
      '维护状态': '非常活跃',
    },
  },
  {
    tool: 'z',
    features: {
      '性能': '中等',
      '模糊搜索': '不支持',
      '学习算法': '基础',
      '跨平台': '是',
      '维护状态': '较慢',
    },
    zoxideFeatures: {
      '性能': '极快（Rust）',
      '模糊搜索': '支持',
      '学习算法': '智能',
      '跨平台': '是',
      '维护状态': '非常活跃',
    },
  },
];

export default function ComparisonsPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* 主内容区 - 占 2/3 宽度 */}
        <main className="lg:col-span-2 space-y-12">
          {/* 页面标题 */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              zoxide vs 其他工具
            </h1>
            <p className="text-lg text-gray-600">
              对比 zoxide 与其他目录导航工具的差异，了解为什么选择 zoxide。
            </p>
          </div>

          {/* 广告位 1: 标题下方 */}
          <AdSlot slotId="comparisons-top" />

          {/* 对比表格 */}
          <div className="space-y-8">
            {comparisons.map((comparison, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
              >
                <div className="bg-gray-50 px-6 py-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    zoxide vs {comparison.tool}
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                          特性
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                          {comparison.tool}
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-blue-600">
                          zoxide
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(comparison.features).map(([feature, value]) => (
                        <tr
                          key={feature}
                          className="border-b border-gray-200"
                        >
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {feature}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {value}
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-blue-600">
                            {comparison.zoxideFeatures[feature as keyof typeof comparison.zoxideFeatures]}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>

          {/* 广告位 3: 对比表格中间位置 */}
          <AdSlot slotId="comparisons-middle" />

          {/* 广告位 4: 页面底部 */}
          <AdSlot slotId="comparisons-bottom" />
        </main>

        {/* 侧边栏 - 占 1/3 宽度，Sticky 定位 */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 self-start max-h-[calc(100vh-80px)]">
            {/* 广告位 2: 侧边栏 Sticky 广告 */}
            <AdSlot slotId="comparisons-sidebar" lazy={true} />
          </div>
        </aside>
      </div>
    </div>
  );
}

