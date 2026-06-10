import type { CategorySummary } from "../types/rankings";

export const categories: CategorySummary[] = [
  {
    id: "ai",
    name: "AI",
    description: "承接基础模型、智能体、基础设施、硬件、生成媒体、自动驾驶与治理榜单。",
    tracks: [
      {
        id: "foundation-models",
        name: "Foundation Models",
        levelLabel: "二级类目",
        description: "覆盖通用基模、端侧模型、嵌入模型、科研与行业专用基础模型。",
        examples: ["基模", "端侧小模型", "Embedding 嵌入模型"],
      },
      {
        id: "ai-agents",
        name: "AI Agents",
        levelLabel: "二级类目",
        description: "覆盖金融、企业、医疗、政企办公与通用任务代理。",
        examples: ["金融 Agent", "企业 Agent", "通用大模型 Agent"],
      },
      {
        id: "ai-infra",
        name: "AI Infra",
        levelLabel: "二级类目",
        description: "覆盖数据采集标注、开发框架与专项行业基建。",
        examples: ["数据采集与标注", "AI 开发框架", "专项行业基建"],
      },
      {
        id: "ai-hardware",
        name: "AI Hardware",
        levelLabel: "二级类目",
        description: "覆盖智算集群、服务器、配套硬件与 AI 芯片。",
        examples: ["智算集群", "AI 服务器", "AI 芯片"],
      },
    ],
  },
  {
    id: "robotics",
    name: "Robotics",
    description: "承接机器人本体、具身智能、零部件、软件平台、集成与服务。",
    tracks: [
      {
        id: "robot-bodies",
        name: "机器人本体",
        levelLabel: "建议二级类目",
        description: "用于收纳工业固定式、移动、商服、家用、特种与仿生机器人等直接机器人形态。",
        examples: ["工业固定式机器人本体", "移动机器人本体", "商用服务机器人"],
      },
      {
        id: "embodied-intelligence",
        name: "具身智能与机器人智能体",
        levelLabel: "建议二级类目",
        description: "覆盖 VLA、机器人基础模型、操作智能与感知决策控制一体化。",
        examples: ["VLA 智能体", "机器人基础模型", "操作智能"],
      },
      {
        id: "robot-core-components",
        name: "机器人核心零部件",
        levelLabel: "建议二级类目",
        description: "覆盖减速器、伺服、控制器、传感器、视觉、灵巧手与电池电源系统。",
        examples: ["减速器", "控制器", "电池与电源系统"],
      },
      {
        id: "robot-software",
        name: "机器人软件与开发平台",
        levelLabel: "建议二级类目",
        description: "覆盖机器人 OS、仿真平台、导航调度、运动控制与数据闭环平台。",
        examples: ["机器人 OS", "机器人仿真平台", "多机调度系统"],
      },
      {
        id: "robot-integration",
        name: "机器人系统集成与解决方案",
        levelLabel: "建议二级类目",
        description: "覆盖产线、仓储、医疗、农业、建筑等场景的集成交付。",
        examples: ["产线集成", "仓储自动化集成", "行业解决方案"],
      },
      {
        id: "robot-operations",
        name: "机器人服务与运营",
        levelLabel: "建议二级类目",
        description: "覆盖 RaaS、运维、售后、安全认证与检测测试。",
        examples: ["RaaS", "机器人运维", "安全认证"],
      },
    ],
  },
];
