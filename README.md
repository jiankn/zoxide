# [zoxide.org](https://zoxide.org/) - zoxide 独立社区指南

这是一个使用 Next.js 16 + TypeScript + Tailwind CSS 构建的 zoxide 独立社区指南，提供 Linux、macOS、Windows 安装说明、Shell 集成教程和常见问题排查。本站不是 zoxide 官方项目，也不隶属于其作者。

在线访问：[zoxide 安装与使用指南](https://zoxide.org/)

## 技术栈

- **Next.js 16** (App Router)
- **TypeScript** (严格模式)
- **Tailwind CSS** (样式)
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



## 项目结构

```
web/
├── app/ # Next.js App Router 页面
│ ├── page.tsx # 首页
│ ├── features/ # 功能特性页面
│ ├── tutorials/ # 教程页面
│ ├── download/ # 下载页面
│ ├── blog/ # 博客页面
│ ├── changelog/ # 更新日志页面
│ ├── faq/ # FAQ 页面
│ ├── comparisons/ # 对比页面
│ ├── layout.tsx # 根布局
│ └── providers.tsx # 全局 Provider
├── components/ # React 组件
│ ├── Navigation/ # 导航栏
│ ├── Footer/ # 页脚
│ └── Hero/ # Hero 区域
├── lib/ # 工具函数
│ └── seo/ # SEO 相关
└── public/ # 静态资源
```

## 功能特性

- ✅ 响应式设计（移动端/桌面端）
- ✅ 统一亮色主题体验
- ✅ SEO 优化（Metadata、关键词）
- ✅ 多语言支持（中文/英文/日文）
- ✅ 简洁单栏布局

## 待办事项

请参考项目根目录的 `zoxide项目待办.md` 文件。

## 许可证

MIT
