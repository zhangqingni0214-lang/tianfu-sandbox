// ============================================================
// investorTiers.js — 投资人三梯度配置
// ============================================================

export const TIERS = {
  low: {
    id: 'low',
    label: '50 - 200 万',
    sub: '加盟间接投资 · 单店',
    icon: '◐',
    budgetMin: 50,
    budgetMax: 200,
    description: '单人/小团队、单点加盟店、明星品牌底店',
    // 推荐器的偏好权重（用于 TOP N 排序）
    weights: { G:0.20, E:0.15, C:0.20, K:0.25, X:0.20 },   // 偏重竞争稳定 + 外部不踩坑
    // 业态默认推荐顺序
    categoryPriority: ['coffee', 'conv', 'hotpot'],
    // 风险偏好：保守
    riskTolerance: 'low',
    targetROI: 0.25,            // 期望年化 ROI 25%
    targetPayback: 3.0,         // 期望回收期 3 年内
    // 铺位筛选规则
    spotFilter: (sp) => sp.tier !== 'high' && sp.rent < 200,
  },

  mid: {
    id: 'mid',
    label: '200 - 1000 万',
    sub: '区域代理 · 多店投资',
    icon: '●',
    budgetMin: 200,
    budgetMax: 1000,
    description: '3-10 家店组合投资，需要风险分散 + 区域协同',
    weights: { G:0.25, E:0.20, C:0.20, K:0.20, X:0.15 },   // 偏重地段 + 经济活力
    categoryPriority: ['hotpot', 'coffee', 'conv'],
    riskTolerance: 'mid',
    targetROI: 0.30,
    targetPayback: 2.5,
    spotFilter: (sp) => true,   // 不筛
  },

  high: {
    id: 'high',
    label: '1000 万以上',
    sub: '机构 / 基金 · 品牌级',
    icon: '◉',
    budgetMin: 1000,
    budgetMax: 10000,
    description: '机构投资人 / 基金，看品牌整体逻辑、退出可能',
    weights: { G:0.30, E:0.25, C:0.15, K:0.15, X:0.15 },   // 偏重地段 + 经济活力（追求高确定性）
    categoryPriority: ['coffee', 'hotpot', 'conv'],
    riskTolerance: 'high',     // 能承受风险
    targetROI: 0.35,
    targetPayback: 2.0,
    spotFilter: (sp) => sp.tier === 'high' || sp.rent > 150,  // 只看头部
  },
};

// 风险偏好对蒙特卡洛的解读规则
export const RISK_LABELS = {
  low:  { okBankruptcy: 0.05, color:'#34c759', label:'保守型',
          rule:'破产概率 < 5% 才推荐' },
  mid:  { okBankruptcy: 0.15, color:'#ff9500', label:'平衡型',
          rule:'破产概率 < 15% 可投' },
  high: { okBankruptcy: 0.30, color:'#ff3b30', label:'进取型',
          rule:'高回报为先，破产概率 < 30%' },
};
