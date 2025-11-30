# zoxide.org - zoxide 粉丝网站

这是一个使用 Next.js 16 + TypeScript + Tailwind CSS 构建的 zoxide 粉丝网站项目。

## 技术栈

- **Next.js 16** (App Router)
- **TypeScript** (严格模式)
- **Tailwind CSS** (样式)
- **next-themes** (主题切换)
- **lucide-react** (图标)

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

### 构建生产版本

```bash
npm run build
```

### 启动生产服务器

```bash
npm start
```

## 环境变量配置

在项目根目录创建 `.env.local` 文件：

```env
# 广告位控制开关
# true = 打开真实广告（AdSense）
# false = 关闭广告，显示占位符（Tips）
NEXT_PUBLIC_ENABLE_ADS=false

# AdSense Publisher ID（审核通过后填写）
# NEXT_PUBLIC_ADSENSE_ID=ca-pub-xxxxxxxxxxxxxxxx
```

## 项目结构

```
web/
├── app/                    # Next.js App Router 页面
│   ├── page.tsx           # 首页
│   ├── features/          # 功能特性页面
│   ├── tutorials/         # 教程页面
│   ├── download/          # 下载页面
│   ├── blog/              # 博客页面
│   ├── changelog/         # 更新日志页面
│   ├── faq/               # FAQ 页面
│   ├── comparisons/       # 对比页面
│   ├── layout.tsx         # 根布局
│   └── providers.tsx      # 全局 Provider
├── components/            # React 组件
│   ├── AdSlot/           # 广告位组件
│   ├── Navigation/       # 导航栏
│   ├── Footer/           # 页脚
│   └── Hero/             # Hero 区域
├── lib/                   # 工具函数
│   └── ads/              # 广告管理
└── public/                # 静态资源
```

## 功能特性

- ✅ 响应式设计（移动端/桌面端）
- ✅ 暗色/亮色主题切换
- ✅ 广告位系统（支持占位符和 AdSense 切换）
- ✅ SEO 优化（Metadata、关键词）
- ✅ 双栏布局 + 侧边栏 Sticky 广告

## 待办事项

请参考项目根目录的 `zoxide项目待办.md` 文件。

## 许可证

MIT
