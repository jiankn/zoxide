# zoxide.org AdSense 申请前准备审计

- 审计日期：2026-07-16
- 阶段：申请前
- 范围：线上站点 `https://zoxide.org`、本地仓库 `C:\antigravity\zoxide`
- 结论：**当前线上站点不建议立即提交 AdSense 申请。** 本地代码已完成主要内容、隐私、抓取和可信度修复，但必须先部署，并在 AdSense 后台启用 Google 认可的 CMP，再完成账户与所有权核验。

## 结论摘要

### 当前线上站点

状态：**Not ready**

主要阻断项：

1. 线上仍是旧版隐私政策，未完整披露 Google 广告相关 Cookie、第三方标识符、用户控制和 EEA/英国/瑞士同意机制。
2. 线上 sitemap 有 135 条记录但只有 132 个唯一 URL，三个语言版本的 `/tutorials/videos/` 重复。
3. 线上仍存在过时或不准确内容，包括旧 changelog、虚构/错误标注的视频内容、SEO 元话术及部分不准确命令。
4. 线上多语言教程存在英文复制到中文/日文页面的情况，带来复制、低价值和语言质量风险。
5. 尚未确认 AdSense 账户状态、申请人年龄、重复账户、域名所有权及 `ads.txt` 发布商 ID 是否与申请账户一致。
6. 当前自定义 Cookie 弹窗不是 Google 认证 CMP。若向 EEA、英国或瑞士用户投放个性化广告，仍需在 AdSense“隐私权和消息”中启用 Google CMP，或接入另一家 Google 认证 CMP。

### 本地修复候选版本

状态：**代码侧主要修复完成，但仍不应在部署和账户侧 CMP 完成前申请。**

已完成：

- 保留既有 URL、slug、canonical、页面标题、H1、SEO 元数据和核心关键词字段。
- Google Analytics 改为用户明确同意后才加载；拒绝可选 Cookie 时不加载。
- 隐私政策补充 Google Analytics、AdSense、Cookie、广告控制、撤回同意和联系信息。
- 修复 sitemap 重复项。
- 修复 changelog、安装命令、配置说明和视频来源/署名。
- 删除暗示官方关联的结构化数据 `sameAs`。
- 代码块改为服务端渲染，抓取器无需等待客户端 JavaScript 即可读取正文代码。
- 为此前复制英文的中文/日文教程加入原创本地化正文。
- 93 个文章/教程详情页的规范化正文精确重复组从 9 组降为 0 组。

## SEO 保护边界

本次修改遵循“排名资产冻结”原则：

- 不改页面 URL、路由和 slug。
- 不改 canonical。
- 不改既有页面 title、H1、meta description、`primaryKeyword` 和 locale `seo` 字段。
- 不删除已排名页面；仅从 sitemap 中移除重复记录。
- 只修正正文中的错误事实、虚假来源、复制语言内容、隐私披露和抓取问题。

本地冻结基线复核结果：**0 个冻结 SEO 字段组发生变化**。这能显著降低变更风险，但搜索引擎排名无法由代码审计保证绝对不波动。

### 保留的编辑风险

按本次 SEO 保护要求，少数既有 meta/excerpt 仍保留较强的关键词导向措辞；它们没有出现在修复后的可见正文中，也未形成精确重复页，但仍应作为人工编辑观察项。若后续确需调整，应保持目标关键词和搜索意图不变，并作为独立、小批量 SEO 变更进行，而不要与本次 AdSense 部署同时修改。

## 线上抓取与技术证据

- 首页、Features、Privacy、Changelog、Videos、下载教程等代表 URL 对普通抓取器及 `Mediapartners-Google` 返回 HTTP 200。
- `robots.txt` 未封禁 `Mediapartners-Google`，并声明 sitemap。
- 线上存在 `ads.txt`：`google.com, pub-3562784107542460, DIRECT, f08c47fec0942fa0`。
- 线上 canonical 正常，未发现关键页 `noindex`。
- 线上 sitemap：135 条记录、132 个唯一 URL；本地修复后：132 条记录、132 个唯一 URL。
- 本地构建生成 183 个静态页面；文章代码块可在初始 HTML 中抓取。

## ADS-* 全量检查

状态说明：

- `Pass`：现有证据满足该检查项。
- `Fail`：存在明确不满足项。
- `Unknown`：需要账户、所有权、流量或人工材料才能确认。
- `N/A`：当前站点或申请前阶段不适用。

| 检查项 | 线上 | 本地候选 | 证据与后续动作 |
|---|---|---|---|
| ADS-ELIG-01 | Unknown | Unknown | 未取得申请人年龄/监护账户信息；提交前人工确认申请人已满 18 岁或使用合规监护账户。 |
| ADS-ELIG-02 | Unknown | Unknown | 无法从代码确认是否已有同主体 AdSense 账户；提交前确认不创建重复账户。 |
| ADS-ELIG-03 | Fail | Fail | 线上存在内容与隐私阻断；本地内容侧已修复，但 Google 认证 CMP 和账户核验仍未完成。 |
| ADS-ELIG-04 | N/A | N/A | 独立 Next.js 网站，不是 Blogger、YouTube 或托管合作伙伴申请流程。 |
| ADS-OWN-01 | Pass | Pass | 本地仓库可控制模板、layout、`head` 元数据及脚本注入路径。 |
| ADS-OWN-02 | Unknown | Unknown | 仓库访问不等同于域名法律/管理所有权；需确认 DNS、Search Console 或 AdSense 验证权限。 |
| ADS-OWN-03 | Pass | Pass | 页面正常支持 JavaScript；本地还将正文代码块改为 SSR，基础正文不依赖客户端渲染。 |
| ADS-SITE-01 | Unknown | Unknown | 需在 AdSense 后台确认站点已添加、所有权已验证并最终标记为 Ready。 |
| ADS-SITE-02 | Pass | Pass | 站点可部署 `ads.txt`、meta 标签或 head 验证代码。 |
| ADS-TXT-01 | Unknown | Unknown | 线上有 Google seller 行，但必须确认 `pub-3562784107542460` 与本次申请账户一致。 |
| ADS-TXT-02 | Pass | Pass | 根路径已发布 `ads.txt`。 |
| ADS-CONTENT-01 | Fail | Pass | 线上仍有过时/不准确内容；本地已修正命令、changelog、来源和错误事实。 |
| ADS-CONTENT-02 | Fail | Pass | 线上视频页和多语言页存在复制/弱增值问题；本地加入真实来源、说明和原创本地化正文。 |
| ADS-CONTENT-03 | Pass | Pass | 首页、分类页、教程和博客均有可抓取主内容；申请前仍应抽查过短页面。 |
| ADS-CONTENT-04 | Pass | Pass | 未发现 coming soon、lorem ipsum、空站或仅为广告构建的页面。 |
| ADS-CONTENT-05 | Pass | Pass | 当前未发现广告、联盟块或付费推广压过主内容。 |
| ADS-CONTENT-06 | Fail | Pass | 线上部分中文/日文教程仍为英文复制；本地已完成对应语言正文覆盖。 |
| ADS-CONTENT-07 | N/A | N/A | 未发现开放评论或用户生成内容功能。 |
| ADS-CONTENT-08 | Fail | Pass | 线上正文仍出现“追关键词”“搜索引擎偏好”等面向搜索引擎的话术；本地可见正文已移除，同时保留原目标关键词字段。少数冻结 meta/excerpt 仍需人工观察。 |
| ADS-UX-01 | Pass | Pass | 桌面/移动导航、页脚及主要入口清晰；未发现关键死链式菜单。 |
| ADS-UX-02 | Pass | Pass | 首页、教程、博客、功能、下载和政策页信息架构可理解。 |
| ADS-UX-03 | Pass | Pass | 未发现假下载按钮、假播放按钮、无关跳转或把广告伪装成导航。 |
| ADS-UX-04 | Pass | Pass | 未发现自动下载、强制跳转、恶意脚本或阻断式弹窗；本地 Cookie 管理可接受、拒绝及重新打开。 |
| ADS-UX-05 | Pass | Pass | About/Contact/Privacy/Terms 等信任入口可访问；本地政策内容更完整。 |
| ADS-UX-06 | Pass | Pass | 当前无侵入式广告占位或与内容混淆的广告布局。 |
| ADS-CRAWL-01 | Pass | Pass | 代表页面公开可访问并返回 200；本地构建成功。 |
| ADS-CRAWL-02 | Pass | Pass | 无登录墙；`robots.txt` 默认允许 Google 广告抓取器，代表页面对 `Mediapartners-Google` 可访问。 |
| ADS-CRAWL-03 | Pass | Pass | 主要内容页均通过 GET 访问，不要求 POST 数据。 |
| ADS-CRAWL-04 | Pass | Pass | 关键页面未发现脆弱或多层重定向依赖。 |
| ADS-CRAWL-05 | Pass | Pass | URL 稳定、可读，无会话 ID；canonical 与本地化路径明确。 |
| ADS-CRAWL-06 | Pass | Pass | 审计时 DNS、TLS 和线上响应正常。 |
| ADS-CRAWL-07 | Fail | Pass | 线上 sitemap 有三个重复 URL；本地已修复为 132/132 唯一 URL。 |
| ADS-PROG-01 | Unknown | Unknown | 代码无法证明站长或团队不会自点广告/制造展示；申请前建立书面禁止规则。 |
| ADS-PROG-02 | Pass | Pass | 未发现鼓励点击广告、奖励广告行为或吸引注意力到广告的文案。 |
| ADS-PROG-03 | N/A | N/A | 尚未部署广告位；上线广告时仅使用中性“广告/赞助”标签并保持视觉区分。 |
| ADS-PROG-04 | Unknown | Unknown | 无 Analytics/广告账户流量来源数据；需确认不存在点击交换、机器人、垃圾推广或低质买量。 |
| ADS-PROG-05 | N/A | N/A | 尚未发现 AdSense 广告代码或自定义广告包装。 |
| ADS-PROG-06 | N/A | N/A | 尚未部署广告位；未来不得放在弹窗、邮件、私信、无内容页或第三方框架页。 |
| ADS-PROG-07 | N/A | N/A | 普通网站，不是 WebView 变现项目。 |
| ADS-PUB-01 | Pass | Pass | 未发现违法活动、非法商品或明显权利侵害教程。 |
| ADS-PUB-02 | Unknown | Unknown | 未发现明确侵权证据，但需确认站点所用品牌标识、截图和媒体素材的授权/合理使用与署名。 |
| ADS-PUB-03 | Pass | Pass | 未发现仇恨、骚扰、威胁、自残、暴力赞美或恐怖组织内容。 |
| ADS-PUB-04 | Pass | Pass | 未发现动物虐待或濒危物种交易内容。 |
| ADS-PUB-05 | Fail | Pass | 线上结构化数据曾通过官方 GitHub `sameAs` 暗示关联，且视频/内容标注不准确；本地已改为独立站说明并修正来源。 |
| ADS-PUB-06 | Pass | Pass | 未发现钓鱼、窃取个人信息、虚假致富或欺骗性服务。 |
| ADS-PUB-07 | Pass | Pass | 未发现伪造文件、作弊、入侵、破解、绕过检测或间谍软件指导。 |
| ADS-PUB-08 | Pass | Pass | 未发现性交易、婚介、成人家庭内容或儿童性剥削内容。 |
| ADS-PUB-09 | Unknown | Unknown | 页面身份信息本地已改善；仍需核对 AdSense 账户、站点身份和 `ads.txt` publisher ID 完全一致。 |
| ADS-PUB-10 | N/A | N/A | 当前无广告；未来广告不得覆盖内容、导航或阻断交互。 |
| ADS-PUB-11 | Fail | Pass | 线上有复制语言页、弱增值视频页和错误事实；本地 93 个详情正文精确重复组为 0，且已补充原创说明。仍应人工抽查较短页面的实际用户价值。 |
| ADS-PUB-12 | N/A | N/A | 当前无广告位；未来不得在后台、屏外或用户注意力明显不在页面时请求广告。 |
| ADS-PUB-13 | N/A | N/A | 站点主题不涉及选举、医学共识或气候共识声明。 |
| ADS-PUB-14 | N/A | N/A | 未发现涉及公共议题的欺骗性合成媒体。 |
| ADS-PUB-15 | N/A | N/A | 未发现儿童相关内容、上传或社区功能。 |
| ADS-PUB-16 | N/A | N/A | 未发现利用突发危机或敏感事件变现的内容。 |
| ADS-REST-01 | N/A | N/A | 无性内容、性产品或性服务主题。 |
| ADS-REST-02 | N/A | N/A | 无血腥、恶心、重度暴力或突出粗俗语言内容。 |
| ADS-REST-03 | N/A | N/A | 无爆炸物、枪械、武器销售或制作说明。 |
| ADS-REST-04 | N/A | N/A | 无烟草、娱乐性毒品、吸毒用具或制毒内容。 |
| ADS-REST-05 | N/A | N/A | 无酒类销售或不负责任饮酒推广。 |
| ADS-REST-06 | N/A | N/A | 无赌博或付费机会游戏内容。 |
| ADS-REST-07 | N/A | N/A | 无处方药、网上药房、未批准药物或补充剂销售。 |
| ADS-REST-08 | N/A | N/A | 当前无广告或视频广告实现；嵌入视频本身未覆盖正文。 |
| ADS-PRIV-01 | Fail | Pass | 线上政策披露不足；本地已披露 Google 产品引发的数据收集、Cookie、标识符、用途和控制。 |
| ADS-PRIV-02 | Fail | Pass | 线上未充分说明第三方广告服务可能放置/读取 Cookie 或使用 IP/标识符；本地已补充。 |
| ADS-PRIV-03 | Pass | Pass | 未发现向 Google 请求传递姓名、邮箱等 PII；本地 GA 仅在明确同意后加载。 |
| ADS-PRIV-04 | Fail | Fail | 本地自定义弹窗实现分析 Cookie opt-in，但不是 Google 认证 CMP；投放前须启用 Google CMP 或其他认证 CMP。 |
| ADS-PRIV-05 | N/A | N/A | 未发现精确定位权限或数据收集。 |
| ADS-PRIV-06 | N/A | N/A | 站点不是面向儿童的服务，未发现 COPPA 定向场景。 |
| ADS-PRIV-07 | Pass | Pass | 未发现设置、修改、拦截或删除 Google 域 Cookie 的代理代码。 |
| ADS-PRIV-08 | N/A | N/A | 尚未启用个性化广告或敏感类别受众列表；未来配置时需重新审计。 |
| ADS-PRIV-09 | N/A | N/A | 站点不提供住房、就业或信贷定向广告服务。 |
| ADS-PRIV-10 | N/A | N/A | 尚未启用个性化广告；启用时需落实 CMP、广告选择控制和受众数据权利。 |

## 申请前必须完成

1. 部署本地修复，并重新抓取线上代表页面、`robots.txt`、`sitemap.xml`、`ads.txt` 和 canonical。
2. 在 AdSense“隐私权和消息”启用 Google 认证 CMP，或接入其他 Google 认证 CMP；验证 EEA、英国和瑞士访问路径。
3. 确认 `pub-3562784107542460` 就是本次申请账户的 publisher ID。
4. 确认申请人年龄、无重复账户、域名所有权、AdSense Sites 状态和合法流量来源。
5. 部署后观察 Search Console 抓取、canonical 和索引状态，避免同时进行 URL、title、H1 或关键词策略调整。
6. 人工抽查品牌素材授权、短页面内容价值及未来广告位，避免广告贴近下载/复制按钮。

## 参考政策

- [Make your site's pages ready for AdSense](https://support.google.com/adsense/answer/7299563?hl=en)
- [AdSense Program policies](https://support.google.com/adsense/answer/48182?hl=en)
- [Google Publisher Policies](https://support.google.com/adsense/answer/10502938?hl=en)
- [Google EU user consent policy](https://www.google.com/about/company/user-consent-policy/)
- [Google consent management requirements for publishers](https://support.google.com/adsense/answer/13554116?hl=en)
