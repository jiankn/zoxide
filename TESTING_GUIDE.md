# 代码块改造测试指南

## ✅ 代码检查结果

### 1. 组件导入检查
- ✅ `web/app/[locale]/tutorials/[slug]/page.tsx` - 已导入 CodeBlockWrapper
- ✅ `web/app/[locale]/blog/[slug]/page.tsx` - 已导入 CodeBlockWrapper
- ✅ `web/app/[locale]/blog/blog/[slug]/page.tsx` - 已导入 CodeBlockWrapper
- ✅ `web/app/[locale]/tutorials/tutorials/[slug]/page.tsx` - 已导入 CodeBlockWrapper
- ✅ `web/app/[locale]/download/page.tsx` - 已导入 CodeBlock

### 2. 旧样式检查
- ✅ 所有旧样式 `bg-[#FBF9F5]` 已被移除

### 3. Lint 检查
- ✅ 无 Lint 错误

## 📋 详细测试步骤

### 步骤 1: 启动开发服务器

```bash
cd web
npm run dev
```

服务器将在 `http://localhost:3000` 启动

### 步骤 2: 测试教程页面

#### 英文教程页面测试

1. **Performance 教程**
   - 访问: http://localhost:3000/en/tutorials/performance
   - 检查项:
     - [ ] 代码块显示为终端风格（深色背景 #1E1E1E）
     - [ ] 终端头部有三个圆点（红、黄、绿）
     - [ ] 语言标识符显示（bash, sh 等）
     - [ ] 提示符颜色：紫色用户、蓝色主机、绿色路径
     - [ ] 命令文本为绿色 (#10B981)
     - [ ] Hover 时显示复制按钮
     - [ ] 点击复制后按钮变为绿色对勾
     - [ ] 复制的内容正确（可粘贴验证）
     - [ ] 代码格式正确（换行、缩进）

2. **Advanced Config 教程**
   - 访问: http://localhost:3000/en/tutorials/advanced-config
   - 重复上述检查项

3. **FZF Integration 教程**
   - 访问: http://localhost:3000/en/tutorials/fzf-integration
   - 重复上述检查项

#### 中文教程页面测试

1. **Performance 教程（中文）**
   - 访问: http://localhost:3000/zh/tutorials/performance
   - 检查项:
     - [ ] 所有检查项同英文版本
     - [ ] 页面内容为中文
     - [ ] 代码块中的注释为中文（如果有）

### 步骤 3: 测试博客页面

1. **博客列表页**
   - 访问: http://localhost:3000/en/blog
   - 访问: http://localhost:3000/zh/blog
   - 检查项:
     - [ ] 列表显示正常
     - [ ] 点击任意文章进入详情页

2. **博客详情页**
   - 选择任意一篇博客文章
   - 检查项:
     - [ ] 代码块显示为终端风格
     - [ ] 复制功能正常
     - [ ] 代码格式正确

### 步骤 4: 测试下载页面

1. **英文下载页**
   - 访问: http://localhost:3000/en/download
   - 检查项:
     - [ ] 安装命令显示为终端风格
     - [ ] Homebrew 命令显示正确
     - [ ] Scoop 命令显示正确
     - [ ] Cargo 命令显示正确
     - [ ] Shell 配置命令显示正确
     - [ ] zsh 配置显示正确
     - [ ] bash 配置显示正确
     - [ ] fish 配置显示正确
     - [ ] PowerShell 配置显示正确（提示符为 PS C:\>）
     - [ ] 所有复制功能正常

2. **中文下载页**
   - 访问: http://localhost:3000/zh/download
   - 重复上述检查项
   - 额外检查:
     - [ ] 页面内容为中文
     - [ ] 描述文本为中文

### 步骤 5: 代码示例正确性验证

#### 验证命令语法

1. **安装命令**
   - `brew install zoxide` ✅
   - `scoop install zoxide` ✅
   - `cargo install zoxide` ✅

2. **Shell 配置命令**
   - `eval "$(zoxide init zsh)"` ✅
   - `eval "$(zoxide init bash)"` ✅
   - `zoxide init fish | source` ✅
   - `Invoke-Expression (& { (zoxide init powershell | Out-String) })` ✅

3. **教程中的代码示例**
   - 检查所有 bash 脚本语法
   - 检查所有环境变量设置
   - 检查所有路径是否正确

### 步骤 6: 国际化检查

#### 检查硬编码文本

1. **下载页面**
   ```bash
   # 检查是否有硬编码中文
   grep -r "在 macOS\|安装\|配置" web/app/[locale]/download/
   ```

2. **其他页面**
   - 检查所有页面是否使用 `t('...')` 而不是硬编码文本
   - 检查 `messages/en.json` 和 `messages/zh.json` 是否完整

### 步骤 7: 浏览器兼容性测试

1. **Chrome/Edge**
   - [ ] 代码块显示正常
   - [ ] 复制功能正常
   - [ ] Hover 效果正常

2. **Firefox**
   - [ ] 代码块显示正常
   - [ ] 复制功能正常

3. **Safari**
   - [ ] 代码块显示正常
   - [ ] 复制功能正常

### 步骤 8: 响应式测试

1. **桌面端** (1920x1080)
   - [ ] 代码块显示正常
   - [ ] 复制按钮位置正确

2. **平板端** (768x1024)
   - [ ] 代码块显示正常
   - [ ] 复制按钮可点击

3. **移动端** (375x667)
   - [ ] 代码块显示正常
   - [ ] 代码可横向滚动
   - [ ] 复制按钮可点击

## 🐛 常见问题排查

### 问题 1: 代码块显示为旧样式
**原因**: 浏览器缓存
**解决**: 
- 清除浏览器缓存
- 使用无痕模式
- 硬刷新 (Ctrl+Shift+R / Cmd+Shift+R)

### 问题 2: 复制功能不工作
**原因**: 
- 浏览器不支持 navigator.clipboard
- 页面未使用 HTTPS（本地开发除外）
**解决**: 
- 检查浏览器控制台错误
- 确认页面在 HTTPS 或 localhost

### 问题 3: 代码块格式错误
**原因**: JSON 中的换行符未正确处理
**解决**: 
- 检查 `messages/en.json` 和 `messages/zh.json` 中的代码块格式
- 确保使用 `\n` 表示换行

### 问题 4: 国际化缺失
**原因**: 翻译键值不存在
**解决**: 
- 检查 `messages/en.json` 和 `messages/zh.json`
- 添加缺失的翻译键值

## ✅ 测试检查清单

### 功能测试
- [ ] 所有代码块显示为终端风格
- [ ] 复制功能在所有页面正常工作
- [ ] 代码格式正确（换行、缩进）
- [ ] 提示符颜色正确
- [ ] 命令文本颜色正确

### 国际化测试
- [ ] 英文页面显示英文内容
- [ ] 中文页面显示中文内容
- [ ] 无硬编码文本
- [ ] 所有翻译键值存在

### 代码正确性测试
- [ ] 所有命令语法正确
- [ ] 所有路径正确
- [ ] 所有环境变量正确
- [ ] 脚本格式正确

### 兼容性测试
- [ ] Chrome/Edge 正常
- [ ] Firefox 正常
- [ ] Safari 正常
- [ ] 移动端正常

## 📝 测试报告模板

```
测试日期: [日期]
测试人员: [姓名]
测试环境: [浏览器版本、操作系统]

测试结果:
- 教程页面: ✅/❌
- 博客页面: ✅/❌
- 下载页面: ✅/❌
- 国际化: ✅/❌
- 代码正确性: ✅/❌

发现的问题:
1. [问题描述]
2. [问题描述]

修复建议:
1. [建议]
2. [建议]
```

