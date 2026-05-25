// ============================================================
// categories.js — 8 个常见业态（v2.0 精简版）
// 每个业态都附"该业态主要客流来源构成"——这是新版的关键
// ============================================================

// 客流来源占比（写字楼/住宅/地铁通勤/商场互补）随业态变化
// 例如：精品咖啡 主要白领 + 商场客；便民餐饮 主要白领（午餐）+ 居民（夜晚）

export const CATEGORIES = {
  coffee: {
    id:'coffee', label:'精品咖啡', icon:'☕', color:'#a87b4a',
    AOV: 38, r1: 0.13, r2: 0.72, r3: 1.25, M: 0.92,
    netMargin: 0.18, monthlyOpex: 5.5, investBase: 80, investPerM2: 0.45,
    sameCount: 8,                  // 周边 500m 内同业数
    flowMix: { office: 0.55, residence: 0.10, commute: 0.20, mall: 0.15 },
    season: [-0.05, 0.05, 0.10, 0.10, 0.05, 0.00,-0.05,-0.08, 0.10, 0.15, 0.20, 0.10],
  },
  zhujiao: {
    id:'zhujiao', label:'便民餐饮', icon:'🍱', color:'#c87060',
    AOV: 28, r1: 0.18, r2: 0.85, r3: 1.05, M: 0.88,
    netMargin: 0.10, monthlyOpex: 4.8, investBase: 50, investPerM2: 0.35,
    sameCount: 14,
    flowMix: { office: 0.65, residence: 0.25, commute: 0.08, mall: 0.02 },
    season: [ 0.10, 0.15, 0.05, 0.00,-0.05,-0.10,-0.10,-0.05, 0.05, 0.10, 0.15, 0.18],
  },
  hotpot: {
    id:'hotpot', label:'火锅', icon:'🍲', color:'#b85040',
    AOV: 145, r1: 0.06, r2: 0.85, r3: 1.0, M: 0.85,
    netMargin: 0.12, monthlyOpex: 12, investBase: 220, investPerM2: 0.85,
    sameCount: 5,
    flowMix: { office: 0.30, residence: 0.35, commute: 0.05, mall: 0.30 },
    season: [ 0.15, 0.20, 0.05,-0.05,-0.10,-0.15,-0.10,-0.05, 0.05, 0.12, 0.18, 0.22],
  },
  convenience: {
    id:'convenience', label:'便利店', icon:'🏪', color:'#5a90c2',
    AOV: 22, r1: 0.25, r2: 0.90, r3: 1.60, M: 0.95,
    netMargin: 0.06, monthlyOpex: 3.8, investBase: 45, investPerM2: 0.28,
    sameCount: 10,
    flowMix: { office: 0.45, residence: 0.35, commute: 0.18, mall: 0.02 },
    season: [-0.05,-0.02, 0.05, 0.05, 0.03, 0.05, 0.08, 0.10, 0.05, 0.05, 0.02,-0.02],
  },
  bakery: {
    id:'bakery', label:'烘焙甜品', icon:'🥐', color:'#e0b070',
    AOV: 36, r1: 0.12, r2: 0.72, r3: 1.45, M: 0.88,
    netMargin: 0.20, monthlyOpex: 5.0, investBase: 75, investPerM2: 0.42,
    sameCount: 5,
    flowMix: { office: 0.40, residence: 0.25, commute: 0.15, mall: 0.20 },
    season: [ 0.05, 0.18, 0.08, 0.05, 0.03, 0.00,-0.05,-0.08, 0.05, 0.12, 0.15, 0.22],
  },
  cosmetics: {
    id:'cosmetics', label:'美妆护肤', icon:'💄', color:'#c87aa0',
    AOV: 280, r1: 0.08, r2: 0.35, r3: 1.50, M: 0.80,
    netMargin: 0.28, monthlyOpex: 7.5, investBase: 130, investPerM2: 0.52,
    sameCount: 10,
    flowMix: { office: 0.25, residence: 0.15, commute: 0.10, mall: 0.50 },
    season: [-0.10,-0.15, 0.05, 0.08, 0.10, 0.05, 0.10, 0.08, 0.05, 0.15, 0.25, 0.18],
  },
  fashion: {
    id:'fashion', label:'时装服饰', icon:'👔', color:'#5a7ab8',
    AOV: 380, r1: 0.06, r2: 0.30, r3: 1.40, M: 0.78,
    netMargin: 0.25, monthlyOpex: 8.0, investBase: 140, investPerM2: 0.55,
    sameCount: 22,
    flowMix: { office: 0.15, residence: 0.20, commute: 0.05, mall: 0.60 },
    season: [-0.10,-0.18, 0.05, 0.08, 0.10, 0.05, 0.10, 0.08, 0.05, 0.15, 0.25, 0.18],
  },
  bookstore: {
    id:'bookstore', label:'书店文创', icon:'📚', color:'#7a8c6b',
    AOV: 65, r1: 0.10, r2: 0.32, r3: 1.60, M: 0.75,
    netMargin: 0.15, monthlyOpex: 6.5, investBase: 110, investPerM2: 0.45,
    sameCount: 2,
    flowMix: { office: 0.30, residence: 0.20, commute: 0.05, mall: 0.45 },
    season: [-0.10,-0.18, 0.05, 0.08, 0.10, 0.05, 0.10, 0.08, 0.05, 0.15, 0.25, 0.18],
  },
};

// 业态承载量（用于 K 计算的 U 形）
export const N_CARRY = {
  coffee: 18, zhujiao: 20, hotpot: 8, convenience: 14,
  bakery: 10, cosmetics: 14, fashion: 30, bookstore: 4,
};

// 时段
export const PERIODS = {
  morning: { lab:'早高峰', mul: 1.15, tau: 0.55 },
  lunch:   { lab:'午高峰', mul: 1.45, tau: 0.78 },
  evening: { lab:'晚高峰', mul: 1.25, tau: 0.70 },
  off:     { lab:'平峰',   mul: 0.50, tau: 0.30 },
};
