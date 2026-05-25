// ============================================================
// calc.js  v2.0 — 单地块 × 业态 推演引擎
// 思路：4 类背景因素 → 各自产生潜在客流 → 按业态 flowMix 加权
//       → 漏斗转化 → 修正系数（竞争 K · 同向 M · 季节）→ 财务
// 所有函数返回包含上一层结果的"累积对象"，便于右栏 5 步推演展示
// ============================================================

import {
  TARGET, METRO, OFFICES, RESIDENCES,
  RESIDENCE_INFO, MALL,
} from '../data/context.js';
import { CATEGORIES, N_CARRY, PERIODS } from '../data/categories.js';

// 距离衰减（exp(-d/scale)） — 走路 5 分钟约 400m
function decay(d, scale){ return Math.exp(-d/scale); }
function hypot(a, b){ return Math.hypot(a, b); }
function dist(o){ return hypot(o.x - TARGET.x, o.z - TARGET.z); }

// ============================================================
// Step 1 · 4 类背景因素 → 日均潜在路过人次
// ------------------------------------------------------------
// office:    白领总数 × 日均出入 1.6 次 × 距离衰减
// residence: 居民数 × 日均出行 0.45 次 × 距离衰减
// commute:   地铁日出站 × 步行至目标的概率（exp(-d/250)）× 通勤分流 0.4
// mall:      商场日均客流 × 互补外溢 18%
// ============================================================
export function computeSources(){
  // —— 写字楼：白领 × 日均经过目标 1 次（午餐外出）× 距离衰减 ——
  const officeTotal = OFFICES.reduce((s,o)=>s+o.whiteCollar, 0);
  const avgOfficeDist = OFFICES.reduce((s,o)=>s+dist(o), 0) / OFFICES.length;
  const officeDecay = decay(avgOfficeDist, 160);
  const office = officeTotal * 1.0 * officeDecay;

  // —— 住宅：居民 × 日均出行 0.30 次 × 距离衰减 ——
  const residentTotal = RESIDENCE_INFO.totalResidents;
  const avgResDist = RESIDENCES.reduce((s,r)=>s+dist(r), 0) / RESIDENCES.length;
  const residentDecay = decay(avgResDist, 220);
  const residence = residentTotal * 0.30 * residentDecay;

  // —— 地铁通勤：出站人次 × 步行至目标的概率 × 通勤分流 0.25 ——
  const commuteDecay = decay(METRO.distance, 200);
  const commute = METRO.dailyFlow * commuteDecay * 0.25;

  // —— 商场互补：商场日均客流 × 外溢比 12% ——
  const mallRatio = 0.12;
  const mall = MALL.dailyFlow * mallRatio;

  const total = office + residence + commute + mall;
  return {
    office, residence, commute, mall, total,
    detail: {
      office:    { raw: officeTotal,        decay: officeDecay,   dist: avgOfficeDist, freq: 1.0 },
      residence: { raw: residentTotal,      decay: residentDecay, dist: avgResDist,    freq: 0.30 },
      commute:   { raw: METRO.dailyFlow,    decay: commuteDecay,  dist: METRO.distance, share: 0.25 },
      mall:      { raw: MALL.dailyFlow,     ratio: mallRatio },
    },
  };
}

// ============================================================
// Step 2 · 业态吸引（× flowMix × r1 进店率） → 日有效到店
// ------------------------------------------------------------
// 不同业态对同一片背景客流的"利用效率"完全不同：
//   便民餐饮 65% 客流来自写字楼（白领午餐），10% 来自地铁，2% 来自商场
//   美妆   50% 客流来自商场（女性逛街），15% 写字楼，10% 地铁
// 这就是为什么同一个目标方块，开不同业态收入差别巨大
// ============================================================
export function computeEffective(catId){
  const cat = CATEGORIES[catId];
  const src = computeSources();
  const eff = {};
  ['office','residence','commute','mall'].forEach(k => {
    eff[k] = src[k] * cat.flowMix[k] * cat.r1;
  });
  const total = eff.office + eff.residence + eff.commute + eff.mall;
  return { src, eff, total, cat };
}

// ============================================================
// Step 3 · 漏斗转化 → 日营收
//   日营收 = 有效到店 × r2(成交率) × r3(回头/客单数) × AOV(客单价)
// ============================================================
export function computeDailyRev(catId){
  const e = computeEffective(catId);
  const dailyRev = e.total * e.cat.r2 * e.cat.r3 * e.cat.AOV;
  return { ...e, dailyRev };
}

// ============================================================
// Step 4 · 修正：竞争 K（U 形）× 同向辨识 M × 季节
//   K = 1 + ln(1+N) · 0.18 - (N/Ncarry)² · 0.6  [集聚 - 超载]
//   M 来自业态本身（同向曝光带来的辨识度，0.78–0.95）
//   season = 1 + 当月季节调整
// ============================================================
export function computeAdjusted(catId, month = 6){
  const d = computeDailyRev(catId);
  const cat = d.cat;
  const Ncarry = N_CARRY[catId];
  const agg  = Math.log(1 + cat.sameCount) * 0.18;
  const loss = Math.pow(cat.sameCount / Ncarry, 2) * 0.6;
  const K = Math.max(0.4, Math.min(1.4, 1 + agg - loss));
  const M = cat.M;
  const season = 1 + cat.season[month - 1];
  const adjusted = d.dailyRev * K * M * season;
  return { ...d, K, M, agg, loss, Ncarry, season, month, adjusted };
}

// ============================================================
// Step 5 · 财务结算（年）
// ============================================================
export function computeFinance(catId, month = 6){
  const a = computeAdjusted(catId, month);
  const cat = a.cat;
  const yearRev    = a.adjusted * 365 / 10000;       // 万元
  const yearRent   = TARGET.rent * TARGET.area * 12 / 10000;
  const invest     = cat.investBase + cat.investPerM2 * TARGET.area;
  const yearProfit = yearRev * cat.netMargin - yearRent - cat.monthlyOpex * 12;
  const roi        = yearProfit / invest;
  const payback    = invest / Math.max(0.1, yearProfit);
  const rentRatio  = yearRent / Math.max(0.1, yearRev) * 100;
  return {
    ...a, yearRev, yearRent, invest, yearProfit, roi, payback, rentRatio,
  };
}

// ============================================================
// 综合评分 0-10（用作"哪个业态更适合本铺位"对比）
// ============================================================
export function score(fin){
  // 5 维度归一化
  const G = 7.2;     // 单地块固定（不再多铺位比较）
  const E = Math.max(0, Math.min(10, fin.src.total / 6000 * 10));
  const C = Math.max(0, Math.min(10, fin.dailyRev / 5000 * 10));
  const K = Math.max(0, Math.min(10, (fin.K - 0.4)/(1.4-0.4)*10));
  const X = Math.max(0, Math.min(10, (fin.M * fin.season - 0.6)/(1.3-0.6)*10));
  const total = 0.20*G + 0.22*E + 0.25*C + 0.18*K + 0.15*X;
  return { G, E, C, K, X, total };
}

// 全业态评估（用于推荐"该铺位最适合的 N 个业态"）
// 按年净利排序——最直观的"赚不赚钱"
export function rankAllCategories(month = 6){
  return Object.keys(CATEGORIES).map(id => {
    const fin = computeFinance(id, month);
    const sc = score(fin);
    return { id, cat: CATEGORIES[id], fin, score: sc.total, dims: sc };
  }).sort((a,b) => b.fin.yearProfit - a.fin.yearProfit);
}
