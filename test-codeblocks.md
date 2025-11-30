# 代码块改造测试清单

## 快速测试命令

### 1. 检查代码块组件导出
```bash
# 检查组件文件是否存在
ls -la web/components/CodeBlock/
```

### 2. 检查所有页面是否正确导入 CodeBlock
```bash
# 检查教程页面
grep -r "CodeBlock" web/app/[locale]/tutorials/
grep -r "CodeBlock" web/app/[locale]/blog/
grep -r "CodeBlock" web/app/[locale]/download/
```

### 3. 检查 TypeScript 编译错误
```bash
cd web
npm run build
```

### 4. 检查 Lint 错误
```bash
cd web
npm run lint
```

## 手动测试清单

### 测试页面列表

#### 教程页面（英文）
- [ ] http://localhost:3000/en/tutorials/performance
- [ ] http://localhost:3000/en/tutorials/advanced-config
- [ ] http://localhost:3000/en/tutorials/fzf-integration
- [ ] http://localhost:3000/en/tutorials/getting-started

#### 教程页面（中文）
- [ ] http://localhost:3000/zh/tutorials/performance
- [ ] http://localhost:3000/zh/tutorials/advanced-config
- [ ] http://localhost:3000/zh/tutorials/fzf-integration
- [ ] http://localhost:3000/zh/tutorials/getting-started

#### 博客页面
- [ ] http://localhost:3000/en/blog (列表页)
- [ ] http://localhost:3000/zh/blog (列表页)
- [ ] 选择任意一篇博客文章测试

#### 下载页面
- [ ] http://localhost:3000/en/download
- [ ] http://localhost:3000/zh/download

### 每个页面的测试项

#### ✅ 代码块显示测试
- [ ] 代码块显示为终端风格（深色背景）
- [ ] 终端头部有三个圆点（红、黄、绿）
- [ ] 语言标识符显示正确
- [ ] 提示符颜色正确（紫色用户、蓝色主机、绿色路径）
- [ ] 命令文本为绿色
- [ ] 代码格式正确（换行、缩进）

#### ✅ 复制功能测试
- [ ] Hover 代码块时显示复制按钮
- [ ] 点击复制按钮后按钮变为绿色对勾
- [ ] 复制的内容正确（可以粘贴验证）
- [ ] 2秒后按钮恢复为复制图标

#### ✅ 国际化测试
- [ ] 英文页面显示英文内容
- [ ] 中文页面显示中文内容
- [ ] 无硬编码文本
- [ ] 所有翻译键值存在

#### ✅ 代码示例正确性测试
- [ ] 所有命令语法正确
- [ ] 所有路径正确
- [ ] 所有环境变量正确
- [ ] 脚本格式正确

## 自动化测试脚本

### 检查所有代码块是否正确使用新组件
```bash
# 检查是否还有旧的代码块样式
grep -r "bg-\[#FBF9F5\]" web/app/[locale]/
grep -r "rounded-md bg-\[#FBF9F5\]" web/app/[locale]/
```

### 检查国际化
```bash
# 检查硬编码中文
grep -r "在 macOS\|安装\|配置" web/app/[locale]/download/
grep -r "下载\|安装" web/app/[locale]/download/
```

## 预期问题及解决方案

### 问题 1: CodeBlock 组件未正确导入
**解决方案**: 检查 import 语句

### 问题 2: 代码块显示为旧样式
**解决方案**: 检查 ReactMarkdown components 配置

### 问题 3: 复制功能不工作
**解决方案**: 检查浏览器控制台错误，确认 navigator.clipboard 可用

### 问题 4: 国际化缺失
**解决方案**: 检查 messages/en.json 和 messages/zh.json

