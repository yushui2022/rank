# rank

`rank` 是新的榜单前端仓库，用于承接后续的大重构。

当前初始化版本包含：

- `Vite + React + TypeScript` 基础工程
- 面向榜单产品的信息架构占位
- 统一的目录结构与开发脚本

## Scripts

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run preview`

## Structure

- `src/app`：应用壳层与页面编排
- `src/components`：通用组件
- `src/data`：静态样例与后续数据接入层
- `src/styles`：全局样式
- `src/types`：领域类型定义

## Next

1. 接入真实榜单数据
2. 重构导航与筛选结构
3. 细化 AI / Robotics 双大类信息架构
4. 建立榜单详情、方法论、来源页
