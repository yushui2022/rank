c'la# 夜间追求目标执行计划

> 文件名按当前约定保留为 `eneving-plan.md`。本文件用于 23:30 到次日 08:00 的无人值守执行，不替代长期产品蓝图 `plan.md`，而是把今晚的执行边界、节奏、子 Agent 分工、提交策略和验收方式固定下来。

## 1. 夜间总目标

在用户无法参与指导的 8 小时窗口内，把当前榜单项目从“已有静态原型”继续打磨成更像成熟海外 AI / Robotics 排名数据产品的前端。

今晚不追求一次做完所有长期功能，而是追求三件事：

1. 产品结构更完整：从单页榜单进一步接近“市场数据终端 + 公司/模型/机器人发现平台”。
2. 视觉和交互更有品味：轻量、国际化、机构级、榜单优先，避免黑暗终端风、模板化 SaaS 风、AI 紫蓝渐变风。
3. 代码更能承接后续重构：组件、数据、类型、页面状态要清晰，为后面接 Excel / JSON / 后端数据留下入口。

## 2. 当前项目主线

项目定位：

- 面向海外的 AI 与 Robotics 榜单产品。
- 不是报告页，不是营销落地页，而是一个可持续更新的 ranking intelligence product。
- 第一阶段允许做大量加法，先把产品形态做厚，后面再做减法。

真实数据根目录：

```text
C:\Users\xiaoy\Desktop\榜单\outputs\019e910c-af91-7f70-b575-98ceeb8830a1\industry_rankings
```

夜间执行必须以这个目录里的榜单数据为产品源头。前端可以先做 prototype UI，但产品结构、分类、命名、页面入口和数据字段必须围绕这个目录已经生成或将要生成的行业榜单展开，不能凭空做一套脱离真实榜单工作流的假产品。

数据优先级：

1. 优先读取 `industry_rankings` 里的真实榜单文件结构，理解一级行业、二级赛道、文件命名和 workbook/sheet 输出规律。
2. 如果前端暂时无法直接解析 Excel，先建立中间 TypeScript/JSON 数据层，但字段要能映射回 Excel 榜单。
3. 所有 sample / prototype 数据必须保留 `dataStatus: "prototype"` 或同等标记。
4. 不把空中想象出来的公司、分数、来源包装成最终榜单数据。
5. 页面设计要服务这个榜单数据资产，而不是反过来让数据去适配随便生成的 UI。

一级大类：

- AI
- Robotics

AI 方向继续沿用之前的相对成熟结构：

- Foundation Models
- AI Agents
- AI Infra
- AI Hardware
- Generative Media
- Autonomous Driving
- AI Trust & Governance

Robotics 已经升为一级大类，需要在产品中拥有和 AI 同等重要的位置，而不是 AI 下面的一个小类。

Robotics 初始二级方向：

- Industrial robot bodies
- Mobile robots
- Commercial service robots
- Home consumer robots
- Special-purpose robots
- Bionic / embodied robots
- Robot components
- Robot software and platforms
- Robot system integration
- Robot services and operations

## 3. 今晚默认假设

如果夜间执行过程中没有用户指导，按以下默认口径推进：

1. 首页优先做成 `Market Overview`，不是公司介绍页。
2. 首屏必须能看到榜单、市场状态、AI / Robotics 入口、筛选或视图切换。
3. 文案以英文产品界面为主，必要处保留中文内部 taxonomy 注释。
4. 数据允许使用 prototype data，但必须明确标注为 prototype，不伪装成最终研究排名。
5. 不引入后端、数据库、登录、支付、真实告警发送。
6. 不做大规模依赖迁移，不切换框架，不引入重型 UI 框架。
7. 优先使用现有 React + TypeScript + Vite + CSS 架构。
8. 所有实现都要能通过 `npm.cmd run build`。
9. 顶部导航不机械补页面。只给对榜单产品有明确价值的入口做完整页面，其余入口可以合并、降级、隐藏或作为未来入口。
10. `News` / 新闻页面是用户明确想要的功能，要作为重点页面规划和实现。
11. 代码必须模块化，禁止把夜间新增功能继续堆进单个超大文件。

## 4. 顶部导航取舍规则

当前前端顶部可能存在这些入口：

- Rankings
- Trending
- New
- Categories
- Companies
- Models
- Robotics
- Methodology
- Sources

这些入口不是都必须做成独立页面。夜间执行按产品价值判断。

### 必须保留并认真打磨的入口

1. Rankings
   - 产品主入口。
   - 承载 Top 10、行业/赛道切换、筛选、排序、证据质量、榜单更新周期。

2. Categories
   - 承载 AI / Robotics 的一级和二级分类。
   - 必须能反映真实 `industry_rankings` 数据目录。

3. Companies
   - 承载公司索引、公司画像、榜单入选记录、跨赛道出现次数。
   - 可先做列表 + detail preview，不一定做完整路由。

4. Robotics
   - 必须独立出来，因为 Robotics 已升为一级大类。
   - 页面要展示机器人自己的二级结构，而不是挤在 AI 里。

5. Methodology
   - 榜单可信度核心。
   - 必须解释评分、数据源、proxy、quality、更新周期。

6. Sources
   - 数据溯源核心。
   - 至少要有 Source Ledger 的产品形态。

7. News
   - 用户明确要求要新闻页面。
   - 不是普通博客，而是 AI / Robotics ranking news intelligence。
   - 应围绕榜单变动、公司动态、模型发布、融资、机器人部署、评测更新、来源新增来设计。

### 可以合并或降级的入口

1. Trending
   - 可作为 Rankings 的 leaderboard view，也可作为首页模块。
   - 如果独立页面同质化严重，不强行独立。

2. New
   - 可与 News 或 Recent Additions 合并。
   - 更适合表达为 New Listings / Newly Added / Recent Updates。

3. Models
   - 如果当前真实数据还不足，可先作为 AI / Foundation Models 的过滤视图。
   - 不要为了按钮存在而做空页面。

### News 页面方向

News 页面必须像一个数据产品里的情报页，而不是内容站。

推荐模块：

- Ranking Updates：哪些榜单发生新增、排名变化、分数变化。
- Company Events：融资、产品发布、客户部署、并购、IPO、关停。
- Model Releases：模型发布、benchmark 更新、价格变化、API/开源变化。
- Robotics Deployments：机器人真实落地、订单、产线、医院/仓储/家庭场景。
- Source Watch：新增来源、来源质量变化、争议来源。
- Analyst Briefs：短评，不写空泛新闻稿。
- Filters：AI / Robotics、category、company、event type、source quality、date。

News 页面验收标准：

- 视觉不输首页。
- 不是文章卡片堆砌。
- 能和榜单、公司、来源互相跳转或至少互相关联。
- 新闻条目必须有 source / date / affected ranking / related entity 字段。
- prototype 新闻必须明确标记，不能冒充真实新闻。

## 5. 模块化和代码结构规则

夜间新增功能必须控制文件复杂度。

原则：

- `App.tsx` 只负责应用状态编排和页面组合，不继续变成巨型文件。
- 大页面拆进 `src/pages` 或 `src/features`。
- 可复用 UI 放入 `src/components`。
- 真实/原型数据放入 `src/data`。
- 类型放入 `src/types`。
- 过滤、排序、格式化放入 `src/utils`。
- CSS 可以先保留单文件，但新页面明显变多时应拆分为局部 CSS 文件或按 feature 分区维护。

建议结构：

```text
src/
  app/
    App.tsx
    app.css
  components/
    TopNav.tsx
    DomainSwitcher.tsx
    RankingTable.tsx
    ...
  pages/
    RankingsPage.tsx
    CategoriesPage.tsx
    CompaniesPage.tsx
    RoboticsPage.tsx
    MethodologyPage.tsx
    SourcesPage.tsx
    NewsPage.tsx
  data/
    rankingData.ts
    newsData.ts
    sourceData.ts
  types/
    rankings.ts
    news.ts
  utils/
    rankingFilters.ts
    formatters.ts
```

文件控制线：

- 单个 React 文件超过 350 行时，优先拆分。
- 单个 CSS 文件继续增长时，必须按 section 加清楚注释，或拆到 feature CSS。
- 一个组件只承担一个明确职责。
- 不为了“快”把所有新页面写进 `App.tsx`。

## 6. 审美大师级前端审查标准

夜间执行必须从商业产品级视角审查当前前端。

重点检查：

- 页面是否像真实海外数据产品，而不是 demo。
- 首屏是否给出榜单产品的核心价值。
- 视觉密度是否服务扫描和比较。
- 颜色是否克制、可信、国际化。
- 字体层级是否有机构感。
- 表格、badge、tabs、filters、source ledger 是否像成熟产品组件。
- 页面之间是否有产品连续性。
- 是否存在“臭的前端”：空按钮、假功能、无意义卡片、重复模块、模板文案、错位、溢出、无 hover/focus、不可解释数据。
- 是否有过多装饰却没有信息。
- 是否有为了好看牺牲可读性的地方。

商业产品级要求：

- 每个主要模块都回答一个用户问题。
- 每个按钮要么可用，要么明确是 prototype/disabled，不做虚假交互。
- 每个页面都应有清晰的信息架构，而不是同质化卡片堆叠。
- 数据和证据要持续可见。
- 用户能从“看榜单”自然走向“看公司/来源/新闻/方法论”。

## 7. Claude 审议机制

Claude 只做评审和审议，不允许直接修改代码。

Claude 是加分项，不是阻塞项。夜间执行不能因为 Claude 网络差、无响应、输出无效或答非所问而停住。

夜间执行前，Codex 必须把以下内容发送给 Claude：

- `plan.md`
- `eneving-plan.md`
- 用户最新补充的项目思想：
  - 产品必须依据 `industry_rankings` 榜单数据目录。
  - 顶部按钮不机械建页，有价值才做。
  - News 页面明确要做，并且要做好。
  - 代码必须模块化，避免单文件冗余。
  - 要以审美大师角度把前端提升到商业产品级。
  - Claude 只评审，不修改代码。

Claude 的评审问题：

```text
你只作为前端审美与产品结构评审，不要修改代码。
请客观评价这个夜间计划是否能把项目从 demo 推到商业级榜单产品。
重点看：
1. 产品结构是否合理。
2. 哪些顶部导航应该独立成页面，哪些应该合并。
3. News 页面如何做才不像普通博客。
4. 当前 light institutional ranking product 方向是否成立。
5. 模块化和代码风险在哪里。
6. 哪些视觉问题最应该夜间优先处理。
请给出直率、可执行的批评，不要客套。
```

Codex 收到 Claude 评审后必须：

1. 判断 Claude 的意见是否符合用户目标。
2. 采纳有价值的意见。
3. 拒绝偏离榜单产品、偏营销、偏炫技、偏暗黑风的意见。
4. 必要时更新 `eneving-plan.md`。
5. 然后再进入实际实现。

Claude 失败处理规则：

1. 单次 Claude 评审等待时间不应超过 10 分钟。
2. 如果 Claude 网络差、无响应、返回乱码、只说套话、试图开始改代码、没有给出具体批评，则视为无效评审。
3. Claude 无效时，Codex 必须自己完成产品结构、审美、模块化和数据映射审查。
4. Codex 自审时必须按本文件的质量门槛执行，不能因为 Claude 失败而降低标准。
5. 早报中如实说明 Claude 是否成功参与评审；Claude 未成功不影响夜间继续执行。

Claude 不能做的事：

- 不直接编辑代码。
- 不自行 push。
- 不自行改变产品方向。
- 不把页面改成营销站。
- 不引入未经 Codex 审查的新依赖。

## 8. 夜间执行角色

### Codex 主控

Codex 负责：

- 读完整 `plan.md`、`eneving-plan.md`、`AGENTS.md`、`CLAUDE.md`。
- 检查 git 状态，保护已有改动。
- 拆分夜间任务。
- 指派子 Agent 或 Claude 做局部视觉 / 组件升级。
- 进行代码审查、集成、构建、截图 QA。
- 决定何时提交、何时推送。
- 早上输出完整交付报告。

### Claude 视觉实现 Agent

Claude 在本夜间计划中默认只作为评审 Agent，可用于：

- 评审视觉升级方向。
- 评审页面布局是否商业产品级。
- 指出 CSS 和组件审美问题。
- 指出空状态、hover、active、focus、responsive polish 的缺口。
- 用 `redesign-existing-projects`、`design-taste-frontend`、`minimalist-ui` 等 skill 的审美标准进行评价。

Claude 不应独立决定产品方向，也不应直接改代码。Claude 的输入必须包含：

- 当前产品定位。
- 用户明确讨厌黑暗终端风。
- 必须保持轻量机构级 ranking product。
- 不允许做营销 hero。
- 不允许只改颜色。
- 不允许破坏现有交互。

### 子 Agent 模式

允许开启多个子 Agent，但每个子 Agent 必须职责单一，避免污染主上下文。

建议子 Agent：

1. UX Structure Agent
   - 任务：检查产品信息架构是否像成熟榜单产品。
   - 输出：缺失页面、缺失模块、导航问题、用户路径问题。

2. Visual Taste Agent
   - 任务：审查当前页面是否有模板感、颜色问题、密度问题、品牌感问题。
   - 输出：需要改的视觉问题，不直接改代码，除非明确授权。

3. Table Interaction Agent
   - 任务：只看 ranking table、filters、tabs、sorting、mobile table。
   - 输出：交互缺陷和建议实现。

4. Data Model Agent
   - 任务：审查 `src/data`、`src/types` 是否能承接 AI / Robotics 多域榜单。
   - 输出：字段缺口、命名问题、source/evidence 追踪问题。

5. QA Agent
   - 任务：跑 build、截图、检查 mobile/desktop 溢出和空白。
   - 输出：失败项、截图路径、修复建议。

子 Agent 输出必须简短、结构化，主控只采纳能推进今晚目标的部分。

## 9. 夜间时间表

### 23:30 - 00:00：基线确认

目标：

- 确认仓库干净。
- 确认 GitHub 已同步。
- 确认当前前端可运行。
- 记录当前视觉问题。
- 检查 `industry_rankings` 数据目录。
- 把 `plan.md`、`eneving-plan.md` 和用户补充发给 Claude 做评审。

必须执行：

- `git status --short --branch`
- `npm.cmd run build`
- 打开或检查 `http://127.0.0.1:4173/`
- 截图桌面和移动端基线。
- 列出 `industry_rankings` 的文件夹和文件结构。
- 记录 Claude 评审摘要。

产出：

- 基线截图。
- 一条不一定提交的内部 QA 记录。
- 数据目录理解笔记。
- Claude 审议结论。

### 00:00 - 01:30：产品骨架补强

目标：

- 让页面更像完整市场数据产品，而不是单一榜单。
- 明确 AI / Robotics 两大域。
- 增强 overview、domain、track、ranking、detail、methodology、sources 之间的结构关系。
- 根据 `industry_rankings` 建立前端数据映射思路。

优先任务：

- 拆出或整理核心数据结构。
- 补充 Robotics 的一级域展示。
- 补充市场总览区、榜单视图区、右侧 intelligence rail 的关系。
- 增加更明确的 navigation 状态。
- 定义哪些顶部导航独立成页面，哪些合并为视图。

完成条件：

- 首屏信息更清楚。
- AI / Robotics 不再像普通 tab，而像产品一级域。
- build 通过。

建议提交：

- `feat: strengthen ranking product structure`

### 01:30 - 03:00：榜单核心体验升级

目标：

- Ranking table 成为产品核心，而不是页面里的一个表。
- 用户能快速切换视图、筛选、排序、看证据质量。

优先任务：

- 强化 leaderboard views。
- 增强 filter / search / sort 状态。
- 增加 column affordance 或 compact custom columns。
- 加强 evidence、momentum、source quality 的可读性。
- 优化移动端表格展示。

完成条件：

- table 在 1440px 桌面上信息密度高但不乱。
- mobile 至少能清楚看到 rank、name、category、score、trend/evidence。
- 没有关键列被挤出到不可见处。

建议提交：

- `feat: improve leaderboard table interactions`

### 03:00 - 04:30：实体详情和证据链

目标：

- 用户点击或选择一个实体后，能看到它为什么排名靠前。
- 让 methodology 和 sources 不再只是装饰。

优先任务：

- 完善 selected entity panel。
- 加入 score breakdown、source list、risk / opportunity、related entities。
- 加入 prototype detail section 或 detail mode。
- 来源和证据使用明确字段连接，不要只有文字结论。

完成条件：

- 任意榜单实体都有可解释的 detail。
- 证据质量、source count、last verified 能被看到。
- 不伪造真实来源，不把 prototype 数据写成真实研究结论。

建议提交：

- `feat: add entity intelligence detail surface`

### 04:30 - 05:30：News 情报页

目标：

- 做出用户明确想要的新闻页面。
- 新闻页必须服务榜单产品，而不是普通内容流。

优先任务：

- 增加 `NewsPage` 或同等模块。
- 新闻数据结构包括 event type、related entity、related ranking、source、date、impact。
- 增加 Ranking Updates、Company Events、Model Releases、Robotics Deployments、Source Watch 等视图。
- News 能从顶部导航进入。
- News 页面视觉不低于首页。

完成条件：

- News 页面能解释“这些新闻如何影响榜单和公司判断”。
- 不是普通博客卡片堆砌。
- prototype 新闻明确标注。

建议提交：

- `feat: add ranking intelligence news page`

### 05:30 - 06:30：视觉品味和响应式打磨

目标：

- 解决用户最在意的“颜值是硬道理”。
- 让页面有机构级数据产品气质。

视觉方向：

- light institutional ranking bureau。
- 清晰、克制、国际化。
- 高密度但有秩序。
- 数据产品优先，避免营销化。

明确禁止：

- 大面积黑色终端风。
- 紫蓝 AI 渐变。
- 纯装饰 orb / blob / bokeh。
- 巨大 hero。
- 卡片套卡片。
- 只改色不改结构。
- 空洞宣传文案。

优先任务：

- 字体层级。
- 数字对齐和 tabular figures。
- hover / active / focus 状态。
- table row polish。
- chips、tabs、badges、score bars。
- mobile spacing 和 overflow。

完成条件：

- desktop 截图一眼不像模板。
- mobile 不溢出、不遮挡。
- 首屏有明确产品密度和可信感。

建议提交：

- `style: polish institutional ranking interface`

### 06:30 - 07:15：功能闭环补全

目标：

- 做出能增强产品感的轻量闭环。

优先任务：

- Watchlist / Shortlist prototype state。
- Alerts mock panel。
- Source ledger preview。
- Methodology confidence module。
- Empty state / loading-like skeleton / no-result state。
- Command/search affordance。

完成条件：

- 用户能感觉这是一个会持续使用的产品，不只是一次性查看页面。
- 所有 prototype 状态都诚实，不伪装成真实后台功能。

建议提交：

- `feat: add watchlist and source confidence flows`

### 07:15 - 08:00：最终 QA、提交、推送、报告

目标：

- 收口，不再做大改。
- 修 TypeScript、布局、明显视觉问题。
- 给用户早上能直接看懂的结果。

必须执行：

- `npm.cmd run build`
- desktop screenshot
- mobile screenshot
- `git status --short --branch`
- 必要时 `git log --oneline -5`

如构建通过：

- 最终 commit。
- push 到 GitHub。
- 生成早报。

建议最终提交：

- `chore: finalize overnight frontend polish`

早报必须包含：

- 改了什么。
- 哪些文件变化最大。
- 构建是否通过。
- 截图路径。
- GitHub 是否已推送。
- 仍然需要老板定夺的问题。

## 10. 多频率提交策略

允许夜间多次提交，推荐按稳定里程碑提交，而不是每改一点就提交。

提交前必须满足：

- 当前改动是一个可描述的阶段。
- TypeScript 没有明显语法错误。
- 能跑 build 的阶段必须先跑 build。
- 不把截图、临时日志、缓存、无关文件提交进去。

推荐提交节奏：

- 00:00 前：通常不提交，只做基线。
- 01:30 左右：产品结构阶段提交。
- 03:00 左右：榜单交互阶段提交。
- 04:30 左右：实体详情和证据链阶段提交。
- 06:00 左右：视觉 polish 阶段提交。
- 07:45 左右：最终 QA 提交。

push 策略：

- 每个 build 通过的重要里程碑可以 push。
- 至少最终 08:00 前 push 一次。
- 如果 GitHub HTTPS 不通，优先使用 SSH：`git@github.com:yushui2022/rank.git`。

提交信息风格：

- `feat: ...` 用于新增产品能力。
- `style: ...` 用于纯视觉打磨。
- `refactor: ...` 用于结构调整但不改变行为。
- `fix: ...` 用于修 bug。
- `chore: ...` 用于收尾、配置、文档。

## 11. 质量门槛

任何夜间最终交付必须满足：

- `npm.cmd run build` 通过，或明确说明失败原因和失败文件。
- 页面能在 `http://127.0.0.1:4173/` 或 Vite dev 地址打开。
- 桌面 1440px 无明显遮挡、错位、文字溢出。
- 移动端 390px 左右无严重横向溢出。
- 首屏不是营销 hero。
- Ranking table 是核心。
- AI 和 Robotics 都是一级域。
- Methodology / Sources / Evidence 可见。
- Watchlist / Shortlist / Alerts 如出现，必须是诚实的 prototype。
- 没有把 prototype 数据包装成真实研究结论。
- 至少检查并理解 `industry_rankings` 数据目录。
- 顶部导航不能保留一堆不可用的空中按钮。
- News 页面必须存在或明确说明为何暂缓。
- 主要代码不能继续集中堆在单个巨大文件中。
- Claude 评审必须完成，且 Codex 必须说明采纳/不采纳哪些意见。

## 12. 禁止事项

夜间无人值守期间禁止：

- 删除用户未明确要求删除的文件。
- `git reset --hard`。
- 强推。
- 大规模换框架。
- 引入复杂后端。
- 引入登录、支付、真实通知系统。
- 把页面做成营销落地页。
- 回到黑暗终端风。
- 为了视觉效果牺牲榜单可读性。
- 提交 `node_modules`、截图临时文件、日志文件。
- 伪造真实数据源、真实收入、真实市场份额、真实客户数。
- 脱离 `industry_rankings` 数据资产另造一套产品世界观。
- 给每个顶部按钮机械创建同质化页面。
- 让 Claude 直接修改代码。

## 13. 失败处理

如果某个阶段卡住超过 45 分钟：

1. 停止扩大改动范围。
2. 保留已经可运行的部分。
3. 跑 `git diff --stat` 判断影响面。
4. 优先修 build。
5. 如果无法修复，提交前必须回到可构建状态。
6. 早报里说明卡点、原因、建议下一步。

如果发现当前实现方向明显不对：

- 不等待用户指导。
- 以 `plan.md` 和本文件为准。
- 回到 light institutional ranking product 方向。
- 保留榜单核心，删减花哨但不清楚的视觉模块。

## 14. 早上交付格式

08:00 前最终回复应包含：

```text
夜间执行结果

1. 本地地址：
2. GitHub 状态：
3. 最新提交：
4. 构建结果：
5. 桌面截图：
6. 移动端截图：
7. 主要完成：
8. 仍需确认：
9. 下一步建议：
10. Claude 评审采纳情况：
```

如果执行期间做了多次提交，需要列出提交范围：

```text
git log --oneline -5
```

## 15. 今晚最重要的判断标准

用户最在意的不是“有没有多几个模块”，而是：

- 是否真的像一个成熟互联网产品。
- 是否像面向海外的榜单数据产品。
- 是否有品味。
- 是否大规模重构了产品形态，而不是小修小补。
- 是否为后续大量 AI / Robotics 榜单数据接入打好了结构。
- 是否真实依托已有榜单数据目录。
- 是否把空中按钮变成有取舍的产品导航。
- News 是否成为榜单情报页，而不是普通内容页。
- 代码是否足够模块化，能承接后续重构。

如果资源有限，优先级如下：

1. 数据资产映射。
2. 产品结构。
3. 榜单核心体验。
4. News 情报页。
5. 视觉品味。
6. 证据和方法论可信感。
7. 轻量 retention 功能。
8. 代码清晰度。

## 16. Codex 自审基线

如果 Claude 无法提供有效评审，Codex 按下面结论直接执行。

### 产品结构判断

当前项目最危险的问题不是页面少，而是“榜单数据资产”和“前端产品结构”之间没有足够强的连接。夜间第一优先级应是让前端看起来是从 `industry_rankings` 长出来的产品，而不是一个漂亮但悬空的 dashboard。

必须建立的结构关系：

- `industry_rankings` -> categories / tracks。
- 每个 Excel 榜单 -> 一个 ranking surface。
- 每个公司 -> company profile / ranking appearances。
- 每个 source -> source ledger。
- 每个新闻事件 -> affected ranking / affected company / source。

### 顶部导航最终建议

建议独立页面：

- Rankings：主工作台。
- Categories：AI / Robotics 分类地图。
- Companies：公司索引和画像入口。
- Robotics：机器人一级域页，必须独立。
- Methodology：方法论页。
- Sources：来源账本页。
- News：榜单情报页，必须独立。

建议不独立或暂缓：

- Trending：并入 Rankings 的 leaderboard view 和首页模块。
- New：并入 News / Recent Additions / newly listed rankings。
- Models：暂时作为 AI / Foundation Models 的过滤视图，等真实模型数据更厚后再独立。

### News 页面判断

News 不能做成普通博客。普通博客的结构是 title + excerpt + date + card，这对榜单产品价值很弱。

News 应该是事件账本：

- event type
- related company / model / robot vendor
- affected ranking
- affected score dimension
- source quality
- date
- impact level
- analyst note

视觉上应更像 Bloomberg / CoinMarketCap updates / Crunchbase news intelligence，而不是 Medium。

### 视觉优先修复

夜间最该处理的审美问题：

1. 空按钮和虚假导航。
2. 首页和二级页视觉关系不连续。
3. 数据密度不足或密度混乱。
4. 表格不像产品核心。
5. source / evidence / methodology 可信感弱。
6. 卡片过多但信息结构不强。
7. mobile 只缩小桌面，而不是重新组织信息。

### 模块化风险

如果夜间新增 News、Categories、Companies、Robotics、Sources 等页面，继续把逻辑堆在 `App.tsx` 会迅速失控。

必须优先拆分：

- 页面组件。
- data fixtures。
- types。
- filtering/sorting utils。
- shared UI components。

判断标准：

- `App.tsx` 应该能在 200-300 行左右维持清晰。
- `RankingTable.tsx` 只管表格，不管全站产品状态。
- `NewsPage.tsx` 不应写死在 App 内部。
- 数据结构必须可替换为 workbook import。
