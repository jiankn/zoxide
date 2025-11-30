# Vercel 部署和域名配置指南

## 将 zoxide.org 连接到 Vercel 部署

### 第一步：在 Vercel 中添加自定义域名

1. **登录 Vercel**
   - 访问 https://vercel.com
   - 登录你的账户

2. **选择项目**
   - 进入你的项目（zoxide）
   - 如果没有部署，先连接 GitHub 仓库并部署

3. **添加自定义域名**
   - 进入项目设置（Settings）
   - 点击左侧菜单的 "Domains"
   - 在 "Domains" 输入框中输入：`zoxide.org`
   - 点击 "Add" 按钮

4. **获取 DNS 配置信息**
   - Vercel 会显示需要配置的 DNS 记录
   - 通常有两种方式：
     - **方式 A（推荐）**：使用 A 记录
       - 类型：A
       - 主机：@ 或留空
       - 值：Vercel 提供的 IP 地址（通常是 76.76.21.21）
     - **方式 B**：使用 CNAME 记录
       - 类型：CNAME
       - 主机：@ 或 www
       - 值：cname.vercel-dns.com

### 第二步：在 Namecheap 中配置 DNS

1. **登录 Namecheap**
   - 访问 https://www.namecheap.com
   - 登录你的账户

2. **进入域名管理**
   - 点击 "Domain List"
   - 找到 `zoxide.org` 域名
   - 点击 "Manage"

3. **配置 DNS 记录**
   - 选择 "Advanced DNS" 标签
   - 删除现有的 A 记录和 CNAME 记录（如果有）

4. **添加 Vercel DNS 记录**

   **推荐配置（使用 A 记录）：**
   ```
   类型: A Record
   主机: @
   值: 76.76.21.21
   TTL: Automatic (或 3600)
   ```

   **或者使用 CNAME（如果 A 记录不工作）：**
   ```
   类型: CNAME Record
   主机: @
   值: cname.vercel-dns.com
   TTL: Automatic (或 3600)
   ```

   **添加 www 子域名（可选）：**
   ```
   类型: CNAME Record
   主机: www
   值: cname.vercel-dns.com
   TTL: Automatic (或 3600)
   ```

5. **保存更改**
   - 点击 "Save All Changes" 按钮
   - 等待几分钟让 DNS 记录生效

### 第三步：验证配置

1. **在 Vercel 中验证**
   - 回到 Vercel 的 Domains 页面
   - 等待 DNS 验证完成（通常需要几分钟到几小时）
   - 状态会从 "Pending" 变为 "Valid"

2. **测试访问**
   - 在浏览器中访问 https://zoxide.org
   - 如果看到你的网站，说明配置成功

### 常见问题

#### 1. DNS 传播时间
- DNS 更改通常需要 5 分钟到 48 小时才能完全传播
- 可以使用 https://dnschecker.org 检查 DNS 传播状态

#### 2. SSL 证书
- Vercel 会自动为你的域名配置 SSL 证书（HTTPS）
- 证书通常会在域名验证后自动生成

#### 3. 如果使用 Cloudflare
- 如果你使用 Cloudflare 作为 DNS 提供商，需要：
  - 将 DNS 记录指向 Vercel
  - 或者将 Cloudflare 的代理模式设置为 "DNS only"（灰色云朵）

#### 4. 子域名配置
- 如果需要配置 www.zoxide.org：
  - 在 Vercel 中添加 `www.zoxide.org` 域名
  - 在 Namecheap 中添加 CNAME 记录：
    - 主机：www
    - 值：cname.vercel-dns.com

### 快速检查清单

- [ ] 在 Vercel 中添加了 `zoxide.org` 域名
- [ ] 在 Namecheap 中配置了 DNS 记录（A 或 CNAME）
- [ ] 等待 DNS 传播（5 分钟到 48 小时）
- [ ] 在 Vercel 中验证域名状态为 "Valid"
- [ ] 测试访问 https://zoxide.org

### 参考链接

- Vercel 域名文档：https://vercel.com/docs/concepts/projects/domains
- Namecheap DNS 配置：https://www.namecheap.com/support/knowledgebase/article.aspx/767/10/how-to-change-dns-for-a-domain/

