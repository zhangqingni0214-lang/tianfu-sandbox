// ============================================================
// categories.js — 业态参数库（L1 大类 + L2 细分）
// ============================================================

export const L1_CATEGORIES = [
  { id:'fb',      label:'餐饮',  icon:'🍽' },
  { id:'retail',  label:'零售',  icon:'🛍' },
  { id:'service', label:'服务',  icon:'⚙' },
  { id:'ent',     label:'娱乐',  icon:'🎬' },
];

// 共用季节模板
const SEASON_FB     = [ 0.05, 0.18, 0.08, 0.05, 0.03, 0.00,-0.05,-0.08, 0.05, 0.12, 0.15, 0.20];
const SEASON_RETAIL = [-0.10,-0.18, 0.05, 0.08, 0.10, 0.05, 0.10, 0.08, 0.05, 0.15, 0.25, 0.18];
const SEASON_SVC    = [-0.05,-0.02, 0.05, 0.05, 0.03, 0.05, 0.08, 0.10, 0.05, 0.05, 0.02,-0.02];
const SEASON_ENT    = [ 0.08, 0.20,-0.05,-0.02,-0.05, 0.05, 0.15, 0.18, 0.05, 0.10, 0.05, 0.15];

const COMMON_SEG = [
  { name:'金融白领', share:0.45, r1:0.14, r2:0.72, AOV_mul:1.4 },
  { name:'周边居民', share:0.28, r1:0.08, r2:0.55, AOV_mul:1.0 },
  { name:'商旅访客', share:0.17, r1:0.13, r2:0.65, AOV_mul:1.8 },
  { name:'其他',     share:0.10, r1:0.05, r2:0.40, AOV_mul:0.8 },
];

// ============================================================
// L2 业态（每个有完整财务模型）
// ============================================================
export const CATEGORIES = {

  // ============ 餐饮 F&B ============
  coffee: {
    L1:'fb', id:'coffee', label:'精品咖啡', icon:'☕',
    AOV:42, r1:0.13, r2:0.72, r3:1.25, M:0.92,
    netMargin:0.18, monthlyOpex:5.5, investBase:80, investPerM2:0.45,
    minArea:60, maxArea:250, N_carry:55, densityMul:1.00,
    segments: COMMON_SEG, season: SEASON_FB,
    position: [0.55, 0.85, 0.60, 0.75, 0.55],
  },
  tea: {
    L1:'fb', id:'tea', label:'新茶饮', icon:'🧋',
    AOV:28, r1:0.18, r2:0.78, r3:1.30, M:0.90,
    netMargin:0.22, monthlyOpex:4.2, investBase:65, investPerM2:0.40,
    minArea:35, maxArea:120, N_carry:48, densityMul:0.85,
    segments: COMMON_SEG, season: SEASON_FB,
    position: [0.40, 0.65, 0.85, 0.60, 0.50],
  },
  bakery: {
    L1:'fb', id:'bakery', label:'烘焙甜品', icon:'🥐',
    AOV:38, r1:0.12, r2:0.70, r3:1.40, M:0.85,
    netMargin:0.20, monthlyOpex:5.0, investBase:75, investPerM2:0.42,
    minArea:50, maxArea:160, N_carry:30, densityMul:0.55,
    segments: COMMON_SEG, season: SEASON_FB,
    position: [0.45, 0.75, 0.65, 0.70, 0.65],
  },
  fastfood: {
    L1:'fb', id:'fastfood', label:'简餐快餐', icon:'🍱',
    AOV:35, r1:0.16, r2:0.82, r3:1.10, M:0.88,
    netMargin:0.12, monthlyOpex:5.8, investBase:70, investPerM2:0.50,
    minArea:80, maxArea:220, N_carry:40, densityMul:0.75,
    segments: COMMON_SEG, season: SEASON_FB,
    position: [0.40, 0.55, 0.90, 0.40, 0.50],
  },
  chinese: {
    L1:'fb', id:'chinese', label:'中餐正餐', icon:'🥘',
    AOV:95, r1:0.06, r2:0.85, r3:1.05, M:0.82,
    netMargin:0.14, monthlyOpex:9.0, investBase:160, investPerM2:0.70,
    minArea:180, maxArea:500, N_carry:28, densityMul:0.55,
    segments: COMMON_SEG, season: SEASON_FB,
    position: [0.60, 0.75, 0.35, 0.80, 0.55],
  },
  hotpot: {
    L1:'fb', id:'hotpot', label:'火锅', icon:'🍲',
    AOV:145, r1:0.06, r2:0.85, r3:1.00, M:0.85,
    netMargin:0.12, monthlyOpex:12, investBase:220, investPerM2:0.85,
    minArea:180, maxArea:600, N_carry:22, densityMul:0.40,
    segments: COMMON_SEG, season: SEASON_FB,
    position: [0.50, 0.65, 0.30, 0.85, 0.40],
  },
  western: {
    L1:'fb', id:'western', label:'西餐料理', icon:'🍝',
    AOV:160, r1:0.05, r2:0.88, r3:1.10, M:0.78,
    netMargin:0.16, monthlyOpex:11, investBase:180, investPerM2:0.78,
    minArea:140, maxArea:380, N_carry:20, densityMul:0.36,
    segments: COMMON_SEG, season: SEASON_FB,
    position: [0.70, 0.85, 0.30, 0.85, 0.55],
  },

  // ============ 零售 Retail ============
  fashion: {
    L1:'retail', id:'fashion', label:'时装服饰', icon:'👔',
    AOV:380, r1:0.06, r2:0.30, r3:1.40, M:0.78,
    netMargin:0.25, monthlyOpex:8.0, investBase:140, investPerM2:0.55,
    minArea:80, maxArea:380, N_carry:35, densityMul:0.60,
    segments: COMMON_SEG, season: SEASON_RETAIL,
    position: [0.65, 0.80, 0.40, 0.65, 0.50],
  },
  cosmetics: {
    L1:'retail', id:'cosmetics', label:'美妆护肤', icon:'💄',
    AOV:280, r1:0.08, r2:0.35, r3:1.50, M:0.80,
    netMargin:0.28, monthlyOpex:7.5, investBase:130, investPerM2:0.52,
    minArea:50, maxArea:200, N_carry:28, densityMul:0.50,
    segments: COMMON_SEG, season: SEASON_RETAIL,
    position: [0.65, 0.75, 0.55, 0.70, 0.70],
  },
  digital: {
    L1:'retail', id:'digital', label:'数码电子', icon:'📱',
    AOV:1200, r1:0.04, r2:0.18, r3:1.10, M:0.72,
    netMargin:0.08, monthlyOpex:10, investBase:180, investPerM2:0.60,
    minArea:80, maxArea:400, N_carry:18, densityMul:0.35,
    segments: COMMON_SEG, season: SEASON_RETAIL,
    position: [0.55, 0.75, 0.70, 0.55, 0.40],
  },
  bookstore: {
    L1:'retail', id:'bookstore', label:'书店文创', icon:'📚',
    AOV:65, r1:0.10, r2:0.32, r3:1.60, M:0.75,
    netMargin:0.15, monthlyOpex:6.5, investBase:110, investPerM2:0.45,
    minArea:120, maxArea:400, N_carry:14, densityMul:0.25,
    segments: COMMON_SEG, season: SEASON_RETAIL,
    position: [0.60, 0.85, 0.30, 0.90, 0.65],
  },
  luxury: {
    L1:'retail', id:'luxury', label:'轻奢精品', icon:'💎',
    AOV:2800, r1:0.03, r2:0.15, r3:1.05, M:0.65,
    netMargin:0.32, monthlyOpex:14, investBase:280, investPerM2:0.85,
    minArea:120, maxArea:380, N_carry:12, densityMul:0.20,
    segments: COMMON_SEG, season: SEASON_RETAIL,
    position: [0.85, 0.92, 0.30, 0.85, 0.50],
  },

  // ============ 服务 Service ============
  conv: {
    L1:'service', id:'conv', label:'便利店', icon:'🏪',
    AOV:22, r1:0.25, r2:0.90, r3:1.60, M:0.95,
    netMargin:0.06, monthlyOpex:3.8, investBase:45, investPerM2:0.28,
    minArea:25, maxArea:120, N_carry:35, densityMul:0.65,
    segments: COMMON_SEG, season: SEASON_SVC,
    position: [0.30, 0.50, 0.95, 0.20, 0.40],
  },
  beauty: {
    L1:'service', id:'beauty', label:'美容 SPA', icon:'💅',
    AOV:480, r1:0.04, r2:0.62, r3:1.20, M:0.75,
    netMargin:0.30, monthlyOpex:8.5, investBase:150, investPerM2:0.55,
    minArea:80, maxArea:280, N_carry:22, densityMul:0.42,
    segments: COMMON_SEG, season: SEASON_SVC,
    position: [0.70, 0.80, 0.30, 0.85, 0.75],
  },
  fitness: {
    L1:'service', id:'fitness', label:'健身房', icon:'💪',
    AOV:380, r1:0.03, r2:0.55, r3:1.0, M:0.70,
    netMargin:0.20, monthlyOpex:14, investBase:280, investPerM2:0.50,
    minArea:300, maxArea:1200, N_carry:10, densityMul:0.18,
    segments: COMMON_SEG, season: SEASON_SVC,
    position: [0.45, 0.70, 0.45, 0.75, 0.85],
  },
  edu: {
    L1:'service', id:'edu', label:'教育培训', icon:'🎓',
    AOV:1800, r1:0.02, r2:0.65, r3:1.0, M:0.65,
    netMargin:0.35, monthlyOpex:10, investBase:160, investPerM2:0.45,
    minArea:150, maxArea:500, N_carry:16, densityMul:0.30,
    segments: COMMON_SEG, season: SEASON_SVC,
    position: [0.55, 0.85, 0.30, 0.55, 0.50],
  },

  // ============ 娱乐 Ent ============
  cinema: {
    L1:'ent', id:'cinema', label:'电影院', icon:'🎬',
    AOV:55, r1:0.04, r2:0.85, r3:1.15, M:0.78,
    netMargin:0.10, monthlyOpex:25, investBase:520, investPerM2:0.40,
    minArea:800, maxArea:1800, N_carry:6, densityMul:0.10,
    segments: COMMON_SEG, season: SEASON_ENT,
    position: [0.50, 0.70, 0.40, 0.80, 0.30],
  },
  ktv: {
    L1:'ent', id:'ktv', label:'KTV', icon:'🎤',
    AOV:280, r1:0.03, r2:0.80, r3:1.0, M:0.65,
    netMargin:0.15, monthlyOpex:18, investBase:380, investPerM2:0.60,
    minArea:400, maxArea:1200, N_carry:8, densityMul:0.14,
    segments: COMMON_SEG, season: SEASON_ENT,
    position: [0.55, 0.50, 0.55, 0.85, 0.30],
  },
};

// 反查：L1 → 该 L1 下的 L2 列表
export function getL2sByL1(l1Id){
  return Object.values(CATEGORIES).filter(c => c.L1 === l1Id);
}

// ============================================================
// 周边竞品定位向量（K 计算的差异化分）；缺省值兜底
// ============================================================
const DEFAULT_COMPETITORS = [
  [0.45, 0.60, 0.70, 0.50, 0.45],
  [0.55, 0.70, 0.65, 0.55, 0.50],
  [0.70, 0.80, 0.45, 0.75, 0.60],
  [0.40, 0.55, 0.85, 0.40, 0.35],
  [0.55, 0.65, 0.60, 0.55, 0.45],
];
export const COMPETITOR_POSITIONS = new Proxy({
  coffee: [
    [0.40, 0.60, 0.85, 0.40, 0.30],
    [0.50, 0.70, 0.70, 0.55, 0.45],
    [0.80, 0.95, 0.30, 0.90, 0.75],
    [0.35, 0.50, 0.95, 0.30, 0.25],
    [0.60, 0.70, 0.65, 0.60, 0.45],
    [0.55, 0.65, 0.75, 0.50, 0.35],
  ],
  hotpot: [
    [0.40, 0.55, 0.35, 0.70, 0.30],
    [0.55, 0.70, 0.40, 0.80, 0.45],
    [0.75, 0.85, 0.25, 0.85, 0.55],
    [0.45, 0.60, 0.50, 0.65, 0.40],
    [0.50, 0.65, 0.40, 0.75, 0.45],
  ],
  conv: [
    [0.35, 0.50, 0.95, 0.20, 0.45],
    [0.30, 0.45, 0.95, 0.20, 0.40],
    [0.40, 0.55, 0.90, 0.25, 0.50],
    [0.32, 0.48, 0.93, 0.22, 0.42],
  ],
}, {
  get(t, k){ return t[k] || DEFAULT_COMPETITORS; }
});
