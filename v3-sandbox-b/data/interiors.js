// ============================================================
// interiors.js — 建筑内部楼层 / 单元 程序化生成
// 每栋商业体按高度推算楼层数 + 业态规则填充单元
// ============================================================

import { LANDMARKS, SPOTS } from './spots.js';

// 品牌池（成都/全国常见）
const BRAND_POOL = {
  cafe: ['星巴克','%ARABICA','M Stand','Manner','Tims 天好咖啡','Seesaw','瑞幸','Costa'],
  tea:  ['喜茶','奈雪的茶','茶颜悦色','蜜雪冰城','霸王茶姬','一点点','古茗','7分甜'],
  fastfood: ['麦当劳','肯德基','汉堡王','Tastien 塔斯汀','华莱士','西少爷','和府捞面','张亮麻辣烫'],
  chinese: ['海底捞','小龙坎','大龙燚','蜀大侠','马路边边','陈麻婆豆腐','龙抄手','钢管厂五区小郡肝'],
  fineDining: ['太二酸菜鱼','西贝莜面村','绿茶餐厅','外婆家','九锅一堂','费大厨','蜀九香'],
  intlDining: ['必胜客','Pizza Express','TGI Fridays','吉野家','和民'],
  bakery: ['原麦山丘','85度C','面包新语','幸福西饼','好利来'],
  retailLuxe: ['Apple Store','LV','Gucci','Prada','Tiffany','Cartier'],
  retailFashion: ['优衣库','ZARA','MUJI','H&M','UR','GAP','NIKE','Adidas','lululemon'],
  retailLife: ['屈臣氏','丝芙兰','名创优品','文具集合','蔚蓝海岸','小米之家'],
  retailKid: ['乐高','迪士尼商店','Babycare','江博士'],
  retailBook: ['钟书阁','言几又','西西弗书店','朵云书院'],
  service: ['DR婚戒','周大福','周生生','Tiffany','银行 ATM','洗衣店','花店'],
  fitness: ['一兆韦德','威尔士健身','SuperMonkey','乐刻运动'],
  beauty: ['丝芙兰','屈臣氏 SPA','美甲店','美容院'],
  edu: ['新东方','学而思','VIPKID','英孚教育'],
  bank: ['工商银行','建设银行','招商银行','成都银行','农商银行','中信银行'],
  cinema: ['万达影城','金逸影城','UME 影城'],
  ktv: ['钱柜 KTV','量贩 KTV'],
  office: [], // 办公层没有品牌
};

// 业态元数据 — 苹果商务配色（低饱和、暖灰/冷灰双色系，避免抢眼）
const CATEGORY_META = {
  cafe:       { type:'咖啡', cat:'F&B',     color:'#c9b394', icon:'☕' },
  tea:        { type:'茶饮', cat:'F&B',     color:'#c4ad8e', icon:'🧋' },
  fastfood:   { type:'快餐', cat:'F&B',     color:'#d4be94', icon:'🍔' },
  chinese:    { type:'中餐', cat:'F&B',     color:'#bca088', icon:'🍲' },
  fineDining: { type:'正餐', cat:'F&B',     color:'#b09280', icon:'🍽' },
  intlDining: { type:'西餐', cat:'F&B',     color:'#bea088', icon:'🍝' },
  bakery:     { type:'烘焙', cat:'F&B',     color:'#d5c4a4', icon:'🥐' },
  retailLuxe:   { type:'轻奢',     cat:'Retail',  color:'#a99c98', icon:'💎' },
  retailFashion:{ type:'时装',     cat:'Retail',  color:'#a8b4be', icon:'👔' },
  retailLife:   { type:'生活方式', cat:'Retail',  color:'#aebcc4', icon:'🛍' },
  retailKid:    { type:'母婴儿童', cat:'Retail',  color:'#b4c0b6', icon:'🧸' },
  retailBook:   { type:'书店',     cat:'Retail',  color:'#b0b4a8', icon:'📚' },
  service:    { type:'服务',     cat:'Service', color:'#aebbb2', icon:'🔧' },
  fitness:    { type:'健身',     cat:'Service', color:'#a4b4b0', icon:'💪' },
  beauty:     { type:'美容',     cat:'Service', color:'#c4b0b6', icon:'💅' },
  edu:        { type:'教育',     cat:'Service', color:'#aeb8c4', icon:'🎓' },
  bank:       { type:'金融',     cat:'Service', color:'#a0b0bc', icon:'🏦' },
  cinema:     { type:'影院',     cat:'Ent',    color:'#aea4b4', icon:'🎬' },
  ktv:        { type:'娱乐',     cat:'Ent',    color:'#b4a4b0', icon:'🎤' },
  office:     { type:'办公',     cat:'Office', color:'#bcc2ca', icon:'🏢' },
  vacant:     { type:'空铺',     cat:'Vacant', color:'#e2e5e9', icon:'❓' },
};

// 各类楼层的业态分布权重
const FLOOR_PROFILES = {
  B1_food:    { name:'美食街',     weights: { cafe:1, tea:2, fastfood:3, chinese:1, fineDining:1, bakery:1 } },
  L1_street:  { name:'临街商业',   weights: { cafe:3, tea:2, retailLuxe:2, retailFashion:1, bank:1, service:1 } },
  L2_dining:  { name:'餐饮零售',   weights: { chinese:2, fineDining:2, intlDining:1, retailFashion:2, retailLife:1, tea:1 } },
  L3_retail:  { name:'精品零售',   weights: { retailFashion:3, retailLife:2, retailLuxe:1, retailKid:1, retailBook:1, beauty:1 } },
  L4_life:    { name:'生活配套',   weights: { retailLife:2, beauty:2, fitness:2, edu:1, retailKid:1 } },
  L5_ent:     { name:'娱乐影院',   weights: { cinema:3, ktv:1, fineDining:1, intlDining:1 } },
  office:     { name:'办公楼层',   weights: { office:10 } },
};

// 不同建筑的"业态主题"
const BUILDING_TEMPLATES = {
  // 商场：B1+5 层全是商业
  IN99: {
    type: 'mall',
    floors: [
      { id:'B1', type:'B1_food',  units: 14 },
      { id:'1F', type:'L1_street', units: 18 },
      { id:'2F', type:'L2_dining', units: 16 },
      { id:'3F', type:'L3_retail', units: 18 },
      { id:'4F', type:'L4_life',   units: 14 },
      { id:'5F', type:'L5_ent',    units: 8  },
    ],
    occupancy: 0.94,
  },
  // 写字楼（IFC / 双子塔 / 交子）：低层商业 + 高层办公
  IFC1: {
    type: 'office',
    floors: [
      { id:'1F', type:'L1_street', units: 8 },
      { id:'2F', type:'L2_dining', units: 6 },
      ...Array.from({length:30}, (_,i)=>({ id:(i+3)+'F', type:'office', units: 4 })),
    ],
    occupancy: 0.88,
  },
  IFC2: {
    type: 'office',
    floors: [
      { id:'1F', type:'L1_street', units: 6 },
      ...Array.from({length:28}, (_,i)=>({ id:(i+2)+'F', type:'office', units: 4 })),
    ],
    occupancy: 0.86,
  },
  TWIN1: {
    type: 'office',
    floors: [
      { id:'B1', type:'B1_food',  units: 10 },
      { id:'1F', type:'L1_street', units: 6 },
      ...Array.from({length:28}, (_,i)=>({ id:(i+2)+'F', type:'office', units: 4 })),
    ],
    occupancy: 0.92,
  },
  TWIN2: {
    type: 'office',
    floors: [
      { id:'B1', type:'B1_food',  units: 8 },
      { id:'1F', type:'L1_street', units: 6 },
      ...Array.from({length:28}, (_,i)=>({ id:(i+2)+'F', type:'office', units: 4 })),
    ],
    occupancy: 0.90,
  },
  AFC: {
    type: 'office',
    floors: [
      { id:'1F', type:'L1_street', units: 6 },
      { id:'2F', type:'L2_dining', units: 4 },
      ...Array.from({length:20}, (_,i)=>({ id:(i+3)+'F', type:'office', units: 4 })),
    ],
    occupancy: 0.78,
  },
  JZ: {
    type: 'office',
    floors: [
      { id:'1F', type:'L1_street', units: 6 },
      ...Array.from({length:24}, (_,i)=>({ id:(i+2)+'F', type:'office', units: 4 })),
    ],
    occupancy: 0.83,
  },
  JZ2: {
    type: 'office',
    floors: [
      { id:'1F', type:'L1_street', units: 6 },
      ...Array.from({length:22}, (_,i)=>({ id:(i+2)+'F', type:'office', units: 4 })),
    ],
    occupancy: 0.80,
  },
};

// 字符种子伪随机（让结果稳定）
function seedRandom(seed){
  let s = 0;
  for (let i=0;i<seed.length;i++) s = (s*31 + seed.charCodeAt(i)) >>> 0;
  return () => { s = (s*1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

// 按权重抽业态
function pickCategory(weights, rand){
  let total = 0;
  for (const k in weights) total += weights[k];
  let r = rand() * total;
  for (const k in weights){
    r -= weights[k];
    if (r <= 0) return k;
  }
  return Object.keys(weights)[0];
}

// 抽品牌 + 楼层内同品牌不重复
function pickBrand(category, usedSet, rand){
  const pool = BRAND_POOL[category] || ['—'];
  const available = pool.filter(b => !usedSet.has(b));
  const list = available.length ? available : pool;
  return list[Math.floor(rand() * list.length)];
}

// 生成单元
function genUnit(floorId, unitIdx, categoryKey, rand, occupancy, usedBrandsOnFloor){
  const meta = CATEGORY_META[categoryKey];
  const status = rand() < occupancy ? 'occupied' : 'vacant';
  const isOffice = categoryKey === 'office';
  let name;
  if (status === 'vacant'){
    name = '招商中';
  } else if (isOffice){
    // 办公单元：公司名
    const COMPANIES = ['投资管理','基金管理','证券','律师事务所','会计师事务所','咨询','科技','贸易','保险','银行支行'];
    const PREFIXES = ['创鑫','华瑞','金茂','锦城','蓉创','蜀信','天府','宝创','汇成','正信'];
    name = PREFIXES[Math.floor(rand()*PREFIXES.length)] + COMPANIES[Math.floor(rand()*COMPANIES.length)];
  } else {
    name = pickBrand(categoryKey, usedBrandsOnFloor, rand);
    usedBrandsOnFloor.add(name);
  }
  // 面积按类型给区间
  const sizeRange = isOffice ? [120, 380] :
    categoryKey === 'cafe' || categoryKey === 'tea' ? [55, 140] :
    categoryKey === 'cinema' ? [800, 1600] :
    categoryKey === 'retailLuxe' || categoryKey === 'retailFashion' ? [120, 380] :
    categoryKey === 'fineDining' || categoryKey === 'chinese' ? [180, 420] :
    [60, 180];
  const area = Math.round(sizeRange[0] + rand() * (sizeRange[1] - sizeRange[0]));
  // 租金按楼层 + 类型
  let baseRent = isOffice ? 100 : 200;
  if (categoryKey === 'retailLuxe' || categoryKey === 'cinema') baseRent = 130;
  const rent = Math.round((baseRent + rand()*120) * (status === 'vacant' ? 0.85 : 1.0));
  return {
    id: floorId + '-U' + (unitIdx+1).toString().padStart(2,'0'),
    name, type: meta.type, cat: meta.cat, color: meta.color, icon: meta.icon,
    categoryKey, area, rent, status,
    floorId,
  };
}

// 生成整栋建筑内饰
function generateInterior(buildingId, building, template){
  const rand = seedRandom(buildingId);
  const floors = template.floors.map(f => {
    const profile = FLOOR_PROFILES[f.type];
    const used = new Set();
    const units = [];
    for (let i=0; i<f.units; i++){
      const cat = pickCategory(profile.weights, rand);
      units.push(genUnit(f.id, i, cat, rand, template.occupancy, used));
    }
    return {
      id: f.id,
      label: profile.name,
      units,
    };
  });
  // 把候选铺位也映射进来：若该建筑包含一个候选铺位（按地址匹配），替换第一个单元
  const candidateSpots = SPOTS.filter(sp => sp.address.includes(building.name.replace(/^成都/,'').slice(0,4)));
  candidateSpots.forEach(sp => {
    // 找匹配楼层
    const targetFloor = floors.find(f => f.id === sp.floor) || floors[0];
    if (!targetFloor) return;
    // 把第一个商业单元替换成候选铺位（保留 spot id 引用）
    const replaceIdx = targetFloor.units.findIndex(u => u.cat !== 'Office');
    if (replaceIdx >= 0){
      const oldUnit = targetFloor.units[replaceIdx];
      targetFloor.units[replaceIdx] = {
        ...oldUnit,
        name: '★ ' + sp.name,
        spotId: sp.id,
        area: sp.area,
        rent: sp.rent,
        status: 'candidate',     // 特殊状态
        candidate: true,
      };
    }
  });
  // 统计
  const allUnits = floors.flatMap(f => f.units);
  const occupied = allUnits.filter(u => u.status === 'occupied' || u.status === 'candidate').length;
  return {
    buildingId,
    buildingName: building.name,
    floors,
    totalUnits: allUnits.length,
    occupied,
    occupancyRate: occupied / allUnits.length,
    totalArea: allUnits.reduce((s,u)=> s+u.area, 0),
  };
}

// 预生成所有商业建筑的内饰
export const INTERIORS = {};
for (const id in BUILDING_TEMPLATES){
  const b = LANDMARKS.find(l => l.id === id);
  if (b){
    INTERIORS[id] = generateInterior(id, b, BUILDING_TEMPLATES[id]);
  }
}

// 暴露元数据
export { CATEGORY_META };

// 判断建筑是否可"进入"（有内饰数据）
export function isEnterable(buildingId){
  return !!INTERIORS[buildingId];
}
