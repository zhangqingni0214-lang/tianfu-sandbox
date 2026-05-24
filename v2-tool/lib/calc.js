// ============================================================
// calc.js — 五维计算引擎（套餐 B+C 公式融合，加 5 年现金流 / IRR / NPV）
// 所有函数纯函数，无副作用，可被任意页面 import
// ============================================================

import { SPOTS, LANDMARKS, METRO, SOURCES } from '../data/spots.js';
import { CATEGORIES, COMPETITOR_POSITIONS } from '../data/categories.js';
import { TIERS, RISK_LABELS } from '../data/investorTiers.js';

// 楼层系数
const FLOOR_FACTOR = { '1F':1.0, '2F':0.7, 'B1':0.85, '3F':0.55, '4F+':0.40 };

// 外部性（全局基准 · 金融城）
export const EXTERNALITY = {
  pol_mu: 1.5, pol_sd: 0.4,
  risk_mu: -0.5, risk_sd: 0.25,
  media_mu: 8.2, media_sd: 1.0,
  sent_mu: 0.6, sent_sd: 0.2,
};

// 客群消费倾向（武侯区 / 金融城）
const PROPENSITY = 0.85;

// ============================================================
// ① 地理性 G — 套餐③ 简化 GIS（POI 距离² + 介数中心性）
// ============================================================
export function calcG(spot){
  const T = spot.T;
  const BC = spot.BC;
  const f = FLOOR_FACTOR[spot.floor] ?? 0.6;

  // POI 加权（锚店 / 距离²）
  let poi = 0;
  LANDMARKS.filter(l => l.anchor).forEach(l => {
    const d = Math.max(20, Math.hypot(l.x - spot.x, l.z - spot.z));
    const w = l.mall ? 1.0 : 0.7;
    poi += w / (d*d) * 1e4;
  });

  // 地铁衰减（exp(-d/200)）
  const Rm = Math.exp(-spot.metroDist / 200);
  const metroScore = Rm * 10;

  const G = 0.30*T + 0.18*Math.min(10, poi*2) + 0.20*(BC*10)
          + 0.12*(f*10) + 0.20*metroScore;
  return Math.max(0, Math.min(10, G));
}

// ============================================================
// ② 经济动态 E — 套餐② 时段加权 + Huff 客流补充
// ============================================================
export function calcE(spot, periodTau = 0.62){
  // 周边日均客流（按介数中心性放大基础流量）
  const F_area = 85000 * (0.4 + 0.6*spot.BC);
  const P_day = 2681 / 30;     // 武侯区人均月消费 / 30
  const E = F_area * P_day * PROPENSITY * 0.90 * (1 + periodTau * 0.5) / 10000;
  return E;   // 万元/天潜在盘子
}

// 归一化到 0-10
export function normE(Eday){ return Math.max(0, Math.min(10, Eday/900*10)); }

// ============================================================
// ③ 消费者画像 C — 分客群漏斗
// ============================================================
export function calcDailyRev(spot, categoryId){
  const cat = CATEGORIES[categoryId];
  let total = 0;
  const breakdown = [];
  cat.segments.forEach(s => {
    const v = spot.F_pass * s.share * s.r1 * s.r2 * cat.r3 * (cat.AOV * s.AOV_mul);
    total += v;
    breakdown.push({ name: s.name, value: v });
  });
  return { total, breakdown };
}

export function normC(dailyRev){ return Math.max(0, Math.min(10, dailyRev/3500*10)); }

// ============================================================
// ④ 竞争生态 K — U 形曲线 + 定位差异化
// ============================================================
export function cosineDistance(a, b){
  let dot=0, na=0, nb=0;
  for (let i=0;i<a.length;i++){ dot+=a[i]*b[i]; na+=a[i]*a[i]; nb+=b[i]*b[i]; }
  return 1 - dot/Math.sqrt(na*nb);
}

export function calcDiffScore(categoryId){
  const my = CATEGORIES[categoryId].position;
  const comps = COMPETITOR_POSITIONS[categoryId] || [];
  if (!comps.length) return 5;
  let sum = 0;
  comps.forEach(c => sum += cosineDistance(my, c));
  return (sum / comps.length) * 10;  // 0-10
}

export function calcK(spot, categoryId){
  const cat = CATEGORIES[categoryId];
  const Nsame = spot['sameCount_' + categoryId];
  const Ncarry = cat.N_carry;
  const Wa = spot.anchorWeight;

  // U 形：集聚收益 − 超载惩罚
  const agg = Math.log(1 + Nsame) * 0.15;
  const loss = Math.pow(Nsame / Ncarry, 2) * 0.8;

  // 差异化加成
  const diff = calcDiffScore(categoryId);
  const diffBoost = diff * 0.015;   // 最多 +0.15

  const K = 1 + agg - loss + Wa*0.2 + diffBoost;
  return Math.max(0.3, Math.min(1.6, K));
}

export function normK(K){ return Math.max(0, Math.min(10, (K-0.4)/(1.5-0.4)*10)); }

// ============================================================
// ⑤ 外部性 X — 含季节调整 + 蒙特卡洛
// ============================================================
export function calcX_base(){
  const e = EXTERNALITY;
  return 1 + 0.05*e.pol_mu + 0.03*e.risk_mu + 0.01*e.media_mu + 0.05*e.sent_mu;
}

export function calcX_month(month, categoryId){
  const X = calcX_base();
  const seasonM = CATEGORIES[categoryId].season[month-1];
  return X * (1 + seasonM);
}

export function normX(X){ return Math.max(0, Math.min(10, (X-0.7)/(1.4-0.7)*10)); }

// 正态随机
export function gauss(mu, sd){
  let u=0, v=0;
  while(u===0) u = Math.random();
  while(v===0) v = Math.random();
  return mu + sd * Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);
}

// ============================================================
// Huff 引力客流
// ============================================================
export function calcHuffFlow(spot){
  const A_self = spot.area;
  const alpha = 1.2, beta = 1.8;
  // 竞争目的地（in99 + 万达 + 环宇荟）
  const others = [
    { x:-120, z:50, A: 190000 },
    { x:170,  z:0,  A: 120000 },
    { x:130,  z:80, A: 30000  },
  ];
  let totalFlow = 0;
  const probs = [];
  SOURCES.forEach(s=>{
    const d_self = Math.max(50, Math.hypot(s.x-spot.x, s.z-spot.z));
    const num = Math.pow(A_self, alpha) / Math.pow(d_self, beta);
    let denom = num;
    others.forEach(o=>{
      const d = Math.max(50, Math.hypot(s.x-o.x, s.z-o.z));
      denom += Math.pow(o.A, alpha) / Math.pow(d, beta);
    });
    const p = num/denom;
    const flow = s.H * p * 0.18;
    probs.push({ source:s, p, flow, d_self });
    totalFlow += flow;
  });
  return { probs, totalFlow };
}

// ============================================================
// 综合评估（单地块 × 业态 → 完整指标）
// ============================================================
export function evaluateSpot(spot, categoryId, options = {}){
  const cat = CATEGORIES[categoryId];
  const G = calcG(spot);
  const Eday = calcE(spot);
  const En = normE(Eday);
  const rev = calcDailyRev(spot, categoryId);
  const Cn = normC(rev.total);
  const K = calcK(spot, categoryId);
  const Kn = normK(K);
  const X = calcX_base();
  const Xn = normX(X);
  const diff = calcDiffScore(categoryId);

  // 综合分（默认权重）
  const w = options.weights || { G:0.25, E:0.20, C:0.20, K:0.20, X:0.15 };
  const score = w.G*G + w.E*En + w.C*Cn + w.K*Kn + w.X*Xn;

  // 年营收（万元）
  const yearRev = rev.total * K * X * 365 / 10000;
  // 年租金
  const yearRent = spot.rent * spot.area * 12 / 10000;
  // 初始投入
  const invest = cat.investBase + cat.investPerM2 * spot.area;
  // 年净利
  const yearProfit = yearRev * cat.netMargin - yearRent - cat.monthlyOpex * 12;
  // ROI / 回收期 / 租金比
  const roi = yearProfit / invest;
  const payback = invest / Math.max(0.1, yearProfit);
  const rentRatio = yearRent / yearRev * 100;

  return {
    spot, categoryId, cat,
    G, E:Eday, En, Cn, Kn, Xn, K, X, diff,
    dailyRev: rev.total, segBreakdown: rev.breakdown,
    yearRev, yearRent, invest, yearProfit, roi, payback, rentRatio,
    score,
  };
}

// ============================================================
// 蒙特卡洛 ROI 分布（1000 次）
// ============================================================
export function runMonteCarlo(spot, categoryId, N = 1000, scenario = 'base'){
  const cat = CATEGORIES[categoryId];
  const shifts = {
    opt:  { pol:+0.4, risk:+0.2, sent:+0.2, flow_mul:1.15 },
    base: { pol:0, risk:0, sent:0, flow_mul:1.0 },
    pes:  { pol:-0.4, risk:-0.2, sent:-0.2, flow_mul:0.85 },
  }[scenario];

  const K = calcK(spot, categoryId);
  const yearRent = spot.rent * spot.area * 12 / 10000;
  const invest = cat.investBase + cat.investPerM2 * spot.area;
  const baseRev = calcDailyRev(spot, categoryId).total;
  const e = EXTERNALITY;

  const ROIs = [], revs = [], paybacks = [];
  for (let i=0; i<N; i++){
    const pol = gauss(e.pol_mu + shifts.pol, e.pol_sd);
    const risk = gauss(e.risk_mu + shifts.risk, e.risk_sd);
    const media = Math.max(0, gauss(e.media_mu, e.media_sd));
    const sent = Math.max(-1, Math.min(1, gauss(e.sent_mu + shifts.sent, e.sent_sd)));
    const Xb = 1 + 0.05*pol + 0.03*risk + 0.01*media + 0.05*sent;
    const fFactor = Math.max(0.5, gauss(1.0 * shifts.flow_mul, 0.12));
    const dailyRev = baseRev * fFactor;
    const yearRev = dailyRev * K * Xb * 365 / 10000;
    const profit = yearRev * cat.netMargin - yearRent - cat.monthlyOpex*12;
    const roi = profit/invest;
    ROIs.push(roi); revs.push(yearRev); paybacks.push(invest/Math.max(0.1, profit));
  }
  ROIs.sort((a,b)=>a-b); revs.sort((a,b)=>a-b); paybacks.sort((a,b)=>a-b);
  return {
    p10ROI: ROIs[Math.floor(N*0.1)],
    p50ROI: ROIs[Math.floor(N*0.5)],
    p90ROI: ROIs[Math.floor(N*0.9)],
    meanROI: ROIs.reduce((a,b)=>a+b,0)/N,
    p50Rev: revs[Math.floor(N*0.5)],
    p50Payback: paybacks[Math.floor(N*0.5)],
    bankruptcy: ROIs.filter(r => r<0).length / N,
    sharpe: meanSharpe(ROIs),
    ROIs, revs,
  };
}

// 夏普比 = (期望回报 - 无风险利率) / 标准差
function meanSharpe(arr, rf = 0.03){
  const mu = arr.reduce((a,b)=>a+b,0)/arr.length;
  const sd = Math.sqrt(arr.reduce((s,v)=>s+(v-mu)**2, 0)/arr.length);
  return (mu - rf) / Math.max(0.01, sd);
}

// ============================================================
// 5 年现金流 / IRR / NPV
// ============================================================
export function cashFlow5Y(evalResult, scenario = 'base'){
  // 假设：
  // - 第 1 年：达成预测营收的 70%（爬坡期）
  // - 第 2 年：90%
  // - 第 3-5 年：100% / 105% / 108%（成熟期 + 自然增长）
  // - 租金每年涨 5%
  const ramp = { base:[0.70, 0.90, 1.00, 1.05, 1.08],
                 opt: [0.85, 1.00, 1.10, 1.15, 1.20],
                 pes: [0.55, 0.75, 0.85, 0.85, 0.85] }[scenario];
  const cat = evalResult.cat;
  const flows = [];
  let cumulative = -evalResult.invest;
  flows.push({ year: 0, rev: 0, rent: 0, profit: -evalResult.invest, cum: cumulative });
  for (let y=1; y<=5; y++){
    const rev = evalResult.yearRev * ramp[y-1];
    const rent = evalResult.yearRent * Math.pow(1.05, y-1);
    const opex = cat.monthlyOpex * 12 * Math.pow(1.03, y-1);
    const profit = rev * cat.netMargin - rent - opex;
    cumulative += profit;
    flows.push({ year: y, rev, rent, profit, cum: cumulative });
  }
  // IRR（Newton 迭代）
  const cfs = flows.map(f => f.year === 0 ? -evalResult.invest : f.profit);
  const irr = computeIRR(cfs);
  // NPV（折现率 8%）
  const npv = cfs.reduce((s, cf, i) => s + cf / Math.pow(1.08, i), 0);
  // 回本年（cum 首次 ≥0 的年份）
  const breakEven = flows.find(f => f.year > 0 && f.cum >= 0)?.year ?? null;
  return { flows, irr, npv, breakEven };
}

function computeIRR(cfs, guess = 0.1){
  let r = guess;
  for (let iter=0; iter<60; iter++){
    let npv = 0, dnpv = 0;
    for (let i=0; i<cfs.length; i++){
      npv  += cfs[i] / Math.pow(1+r, i);
      dnpv += -i * cfs[i] / Math.pow(1+r, i+1);
    }
    const newR = r - npv/dnpv;
    if (Math.abs(newR - r) < 1e-5) return newR;
    r = newR;
  }
  return r;
}

// ============================================================
// 推荐器（核心）：对全部铺位评估 + 排序 + TOP N
// ============================================================
export function recommend(categoryId, tierId, options = {}){
  const tier = TIERS[tierId];
  const filtered = SPOTS.filter(tier.spotFilter);

  const evaluated = filtered.map(sp => {
    const ev = evaluateSpot(sp, categoryId, { weights: tier.weights });
    // 投资金额匹配度修正（铺位实际投入 vs 用户预算）
    const budgetFit = (ev.invest >= tier.budgetMin && ev.invest <= tier.budgetMax) ? 1.0
                    : ev.invest < tier.budgetMin ? 0.85 : 0.70;
    // ROI / 回收期匹配（与梯度目标对照）
    const roiFit = Math.min(1.2, Math.max(0.5, ev.roi / tier.targetROI));
    const paybackFit = Math.min(1.2, Math.max(0.5, tier.targetPayback / Math.max(0.5, ev.payback)));
    const matchScore = ev.score * budgetFit * (roiFit*0.5 + paybackFit*0.5);
    return { ...ev, matchScore, budgetFit, roiFit, paybackFit };
  });
  evaluated.sort((a,b) => b.matchScore - a.matchScore);
  return evaluated;
}

// ============================================================
// 工具：风险评级
// ============================================================
export function classifyRisk(bankruptcy, tierId = 'mid'){
  const tier = TIERS[tierId];
  const labels = RISK_LABELS[tier.riskTolerance];
  if (bankruptcy < 0.05) return { level:'低', color:'#34c759', label:'强烈推荐', value: bankruptcy };
  if (bankruptcy < labels.okBankruptcy) return { level:'中', color:'#ffcc00', label:'可投', value: bankruptcy };
  if (bankruptcy < 0.30) return { level:'高', color:'#ff9500', label:'谨慎', value: bankruptcy };
  return { level:'极高', color:'#ff3b30', label:'不建议', value: bankruptcy };
}
