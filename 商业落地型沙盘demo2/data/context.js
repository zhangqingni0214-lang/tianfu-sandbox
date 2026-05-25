// ============================================================
// context.js — 简化版沙盘场景：1 个目标方块 + 4 类背景影响因素
// 所有数据为演示用虚拟值，可随时调
// ============================================================

// 单一目标方块（中央，金色高亮）
export const TARGET = {
  x: 0, z: 0, w: 22, d: 16, h: 6,
  name: '目标铺位',
  address: '商业主街临街一线',
  area: 100,           // ㎡
  floor: '1F',
  rent: 280,           // 元/㎡·月（1F 临街一线参考价）
};

// 地铁站（南侧）
export const METRO = {
  x: 0, z: 160, w: 30, d: 12, h: 8,
  name: '商业大道站',
  lines: ['1号线', '6号线'],
  distance: 160,       // 到目标方块的米数
  dailyFlow: 25000,    // 日均出站人数
};

// 写字楼一排（东侧 4 栋）
export const OFFICES = [
  { x: 130, z: -90,  w: 38, d: 38, h: 180, name: '金融大厦', whiteCollar: 3500 },
  { x: 130, z: -30,  w: 38, d: 38, h: 165, name: '科技中心', whiteCollar: 3000 },
  { x: 130, z:  30,  w: 38, d: 38, h: 195, name: '商务广场', whiteCollar: 4000 },
  { x: 130, z:  90,  w: 38, d: 38, h: 150, name: '创业大厦', whiteCollar: 2500 },
];
// 合计白领人数
export const TOTAL_WHITE_COLLAR = OFFICES.reduce((s, o) => s + o.whiteCollar, 0);  // 13000

// 住宅区（北侧一片 8 栋）
export const RESIDENCES = [
  { x: -100, z: -160, w: 28, d: 28, h: 75 },
  { x:  -50, z: -160, w: 28, d: 28, h: 80 },
  { x:    0, z: -160, w: 28, d: 28, h: 70 },
  { x:   50, z: -160, w: 28, d: 28, h: 85 },
  { x: -100, z: -220, w: 28, d: 28, h: 78 },
  { x:  -50, z: -220, w: 28, d: 28, h: 72 },
  { x:    0, z: -220, w: 28, d: 28, h: 80 },
  { x:   50, z: -220, w: 28, d: 28, h: 76 },
];
export const RESIDENCE_INFO = {
  households: 850,         // 总户数
  peoplePerHousehold: 2.6,
  totalResidents: 2210,
};

// 商场（西侧 1 个低体量大体）
export const MALL = {
  x: -180, z: 0, w: 110, d: 90, h: 55,
  name: '银泰 in99',
  dailyFlow: 14000,        // 日均客流
  anchorWeight: 0.95,
  shops: 180,
  // 商场内同业咖啡 / 餐饮等门店分布
  sameCatCount: { coffee: 6, hotpot: 4, fastfood: 8, fashion: 22, cosmetics: 10 },
};

// 道路（连接地铁→目标→商场，写字楼→目标）
export const ROADS = [
  // 主街：南北向，地铁→目标→住宅
  { type: 'main', from: { x: 0, z: 200 },  to: { x: 0, z: -240 }, width: 26 },
  // 东西向：商场→目标→写字楼
  { type: 'main', from: { x: -220, z: 0 }, to: { x: 200, z: 0 },  width: 26 },
];

// 通勤主流动线（用于演示"地铁→写字楼"的客流穿越目标方块）
export const COMMUTE_FLOWS = [
  { from: METRO,        to: OFFICES[1], peakRatio: 0.45 },   // 早高峰主流
  { from: METRO,        to: OFFICES[2], peakRatio: 0.35 },
  { from: RESIDENCES[3], to: METRO,     peakRatio: 0.20 },
];
