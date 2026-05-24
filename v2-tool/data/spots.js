// ============================================================
// spots.js — 成都金融城核心 1km² 内 30 个虚拟候选铺位
// 数据：AI 编造，符合行业经验区间；坐标基于真实金融城路网
// ============================================================

export const CITY = {
  name: '成都金融城',
  center: { lng: 104.0668, lat: 30.5728 },     // 真实坐标参考
  // 用于地图渲染的局部坐标范围（米，以 IFC 为原点 0,0）
  bbox: { xMin: -500, xMax: 500, zMin: -500, zMax: 500 }
};

// 关键地标（用于沙盘渲染参考）
export const LANDMARKS = [
  { id:'IFC1',  name:'天府国际金融中心 T1', x:-40, z:-20, w:60, d:55, h:220, anchor:true },
  { id:'IFC2',  name:'天府国际金融中心 T2', x: 30, z:-30, w:55, d:50, h:200, anchor:true },
  { id:'TWIN1', name:'金融城双子塔 南',     x: 90, z: 30, w:45, d:45, h:218, anchor:true },
  { id:'TWIN2', name:'金融城双子塔 北',     x: 90, z:-50, w:45, d:45, h:218, anchor:true },
  { id:'IN99',  name:'银泰 in99',           x:-120,z: 50, w:120,d:90, h: 55, anchor:true, mall:true },
  { id:'AFC',   name:'华商金融中心',         x:-130,z:-90, w:60, d:55, h:160 },
  { id:'JZ',    name:'交子金融广场 T1',      x: 170,z:-90, w:50, d:50, h:180 },
  { id:'JZ2',   name:'交子金融广场 T2',      x: 170,z: 60, w:48, d:48, h:165 },
  { id:'R1',    name:'枫丹国际',             x:-180,z: 80, w:50, d:50, h: 90, res:true },
  { id:'R2',    name:'中国华商交子公馆',     x: 200,z: 140,w:55, d:55, h:110, res:true },
];

export const METRO = [
  { id:'M1', name:'金融城站',  x:0,   z:80, lines:['1号线'] },
  { id:'M2', name:'双子塔站',  x:130, z:0,  lines:['1号线','6号线'] },
  { id:'M3', name:'交子大道站',x:-150,z:0,  lines:['18号线'] },
];

// 客源点（91 小区压缩为 10 代表点）
export const SOURCES = [
  { id:'S1', name:'奥克斯宽庭',     x:-260, z: 220, H:8200 },
  { id:'S2', name:'誉峰东区',       x: 280, z: 280, H:3400 },
  { id:'S3', name:'时代晶科名苑',   x: 360, z:-160, H:12000},
  { id:'S4', name:'中海城南1号',    x:-300, z:-220, H:5700 },
  { id:'S5', name:'枫丹国际居民区', x:-180, z: 80,  H:2300 },
  { id:'S6', name:'南苑 A 区',      x: 240, z:-300, H:3000 },
  { id:'S7', name:'人居·天府名居',  x:-340, z:-30,  H:3800 },
  { id:'S8', name:'南城都汇',       x: 60,  z:-360, H:4600 },
  { id:'S9', name:'金融城官邸',     x:-100, z: 340, H:2900 },
  { id:'S10',name:'银泰悦湾',       x: 360, z: 60,  H:5100 },
];

// ============================================================
// 30 个候选铺位
// 每个铺位的属性：
//   id           唯一编号
//   name         铺位名 / 所在楼栋
//   address      地址（中文）
//   x, z         局部坐标（米）
//   area         面积 ㎡
//   floor        楼层（1/2/B1/3+）
//   rent         月租金 元/㎡·月
//   metroDist    最近地铁口距离 m
//   T            城市地段等级 1-10
//   S            街道引导评分 1-10
//   C            通勤动线评分 1-10
//   BC           街道介数中心性 0-1
//   F_pass       铺位前日均路过客流（估算）
//   tier         投资门槛梯度匹配：'low' / 'mid' / 'high'
//   tags         特征标签（用于展示）
//   anchorWeight 周边锚店权重 0-1
// ============================================================

export const SPOTS = [
  // —— IFC + 双子塔 黄金区域（高线/高租金/高 ROI） ——
  { id:'SP01', name:'IFC T1 一层临街 A 铺', address:'天府大道北段 IFC T1·1F',
    x: 5, z: 30, area: 180, floor:'1F', rent: 320, metroDist: 56, T:10, S:9.5, C:8.8, BC:0.82,
    F_pass: 2400, tier:'high', anchorWeight:0.95, tags:['顶级地段','地铁口','IFC锚店'] },

  { id:'SP02', name:'IFC T2 一层东向铺',    address:'天府大道北段 IFC T2·1F',
    x: 60, z:-30, area: 145, floor:'1F', rent: 290, metroDist: 102, T:10, S:9, C:8.5, BC:0.78,
    F_pass: 1900, tier:'high', anchorWeight:0.92, tags:['IFC内部','写字楼客'] },

  { id:'SP03', name:'双子塔南座 B1 美食街', address:'金融城路 双子塔南·B1',
    x: 90, z: 30, area: 110, floor:'B1',rent: 180, metroDist: 28, T:10, S:7.5, C:9.2, BC:0.76,
    F_pass: 3200, tier:'mid', anchorWeight:0.90, tags:['地铁直连','美食街','午市强'] },

  { id:'SP04', name:'双子塔北 二层连廊',    address:'金融城路 双子塔北·2F',
    x: 90, z:-50, area: 200, floor:'2F', rent: 145, metroDist: 80, T:10, S:6, C:7.5, BC:0.65,
    F_pass: 1100, tier:'mid', anchorWeight:0.88, tags:['二层','空中连廊'] },

  { id:'SP05', name:'in99 三层 主力店位',   address:'锦悦西路 银泰 in99·3F',
    x:-120, z: 80, area: 320, floor:'3F', rent: 105, metroDist: 220, T:10, S:5.5, C:6.5, BC:0.42,
    F_pass: 1400, tier:'high', anchorWeight:0.98, tags:['锚店内','奢侈品邻区'] },

  { id:'SP06', name:'in99 一层 黄金中庭',   address:'锦悦西路 银泰 in99·1F',
    x:-120, z: 30, area: 90, floor:'1F', rent: 480, metroDist: 180, T:10, S:9.5, C:9.5, BC:0.55,
    F_pass: 3800, tier:'high', anchorWeight:0.99, tags:['顶租','中庭','导流强'] },

  // —— 交子大道沿线（次核心） ——
  { id:'SP07', name:'华商金融中心一层',      address:'交子大道 华商金融中心',
    x:-130, z:-60, area: 165, floor:'1F', rent: 220, metroDist: 175, T:9, S:8.5, C:7.8, BC:0.70,
    F_pass: 1500, tier:'mid', anchorWeight:0.75, tags:['临街一线','写字楼底商'] },

  { id:'SP08', name:'交子金融广场 T1 临街',  address:'交子大道 交子金融广场',
    x: 170, z:-65, area: 140, floor:'1F', rent: 195, metroDist: 240, T:9, S:8, C:7.5, BC:0.62,
    F_pass: 1200, tier:'mid', anchorWeight:0.78, tags:['交子大道','金融客群'] },

  { id:'SP09', name:'交子金融广场 T2 二层',  address:'交子大道 交子金融广场 T2·2F',
    x: 170, z: 75, area: 220, floor:'2F', rent: 90, metroDist: 280, T:9, S:6, C:6.8, BC:0.58,
    F_pass: 700, tier:'mid', anchorWeight:0.72, tags:['二层','大面积'] },

  { id:'SP10', name:'AFC 中航国际广场 A 一层', address:'交子大道 AFC·A座·1F',
    x: 220, z:-30, area: 105, floor:'1F', rent: 175, metroDist: 360, T:8, S:7.5, C:7, BC:0.55,
    F_pass: 950, tier:'mid', anchorWeight:0.70, tags:['办公商务区'] },

  // —— 锦悦西路 / 锦城大道（住商混合） ——
  { id:'SP11', name:'枫丹国际底商',          address:'锦悦西路 枫丹国际·1F',
    x:-180, z: 60, area: 95, floor:'1F', rent: 130, metroDist: 320, T:8, S:7, C:6.5, BC:0.48,
    F_pass: 800, tier:'low', anchorWeight:0.60, tags:['社区底商','晚市'] },

  { id:'SP12', name:'瑞禧公馆底商',          address:'锦城大道 瑞禧公馆·1F',
    x:-60, z: 145, area: 75, floor:'1F', rent: 110, metroDist: 95, T:8, S:6.5, C:7, BC:0.52,
    F_pass: 1100, tier:'low', anchorWeight:0.55, tags:['居民区','地铁近'] },

  { id:'SP13', name:'南苑 A 区临街',         address:'交子南二路 南苑A区·1F',
    x: 240, z:-280, area: 60, floor:'1F', rent: 85, metroDist: 580, T:7, S:5.5, C:5.5, BC:0.32,
    F_pass: 600, tier:'low', anchorWeight:0.40, tags:['纯居民','轻量起步'] },

  { id:'SP14', name:'人居·天府名居底商',     address:'剑南大道 天府名居·1F',
    x:-340, z:-50, area: 88, floor:'1F', rent: 95, metroDist: 480, T:7, S:6, C:6, BC:0.38,
    F_pass: 720, tier:'low', anchorWeight:0.50, tags:['老社区','刚需'] },

  { id:'SP15', name:'中海城南1号底商',       address:'剑南大道 中海城南1号·1F',
    x:-300, z:-200, area: 130, floor:'1F', rent: 105, metroDist: 410, T:7, S:6.5, C:6.5, BC:0.42,
    F_pass: 900, tier:'mid', anchorWeight:0.55, tags:['高端居民区','改善型'] },

  // —— 在建/新交付区域（升值预期高，风险也高） ——
  { id:'SP16', name:'金融城8号一层（建设中）',address:'金融城路 金融城8号',
    x:-200, z:-30, area: 280, floor:'1F', rent: 85, metroDist: 360, T:9, S:5, C:6.5, BC:0.50,
    F_pass: 0, tier:'high', anchorWeight:0.80, tags:['在建','期房铺','预期升值'] },

  { id:'SP17', name:'金融城东 新交付商街',   address:'金融城东 新交付商街·1F',
    x: 380, z:  20, area: 110, floor:'1F', rent: 75, metroDist: 520, T:8, S:5.5, C:6, BC:0.40,
    F_pass: 400, tier:'mid', anchorWeight:0.50, tags:['新区','客流培育期'] },

  { id:'SP18', name:'银泰悦湾 商业街',       address:'益州路 银泰悦湾·1F',
    x: 360, z:  90, area: 95, floor:'1F', rent: 120, metroDist: 380, T:8, S:7, C:6.8, BC:0.45,
    F_pass: 850, tier:'mid', anchorWeight:0.62, tags:['高端居住区','配套商街'] },

  // —— 地铁口商业 / 通道商业 ——
  { id:'SP19', name:'金融城站 B 出口商业街', address:'金融城站 B 口连廊',
    x: 5, z: 75, area: 65, floor:'B1', rent: 260, metroDist: 12, T:10, S:9, C:9.5, BC:0.85,
    F_pass: 5200, tier:'mid', anchorWeight:0.85, tags:['地铁直连','超高流量','面积小'] },

  { id:'SP20', name:'双子塔站 A 出口便利店位', address:'双子塔站 A 口·-1F',
    x: 130, z:-5,  area: 38, floor:'B1', rent: 220, metroDist: 8,  T:10, S:8.5, C:9.5, BC:0.82,
    F_pass: 6500, tier:'low', anchorWeight:0.85, tags:['地铁口','便利店专属'] },

  { id:'SP21', name:'交子大道站 通道铺',     address:'交子大道站 通道',
    x:-150, z: 10, area: 42, floor:'B1', rent: 195, metroDist: 6,  T:9, S:7.5, C:9, BC:0.78,
    F_pass: 4800, tier:'low', anchorWeight:0.70, tags:['地铁口','早晚高峰'] },

  // —— 二线位置（性价比款） ——
  { id:'SP22', name:'锦城公园北门商业',      address:'锦城大道 公园北门',
    x:-50, z: 320, area: 105, floor:'1F', rent: 95, metroDist: 280, T:7, S:7, C:6.5, BC:0.45,
    F_pass: 1300, tier:'low', anchorWeight:0.45, tags:['公园边','周末客流'] },

  { id:'SP23', name:'交子公园东门街铺',      address:'交子公园 东门',
    x: 80, z: 280, area: 85, floor:'1F', rent: 110, metroDist: 240, T:8, S:7.5, C:7, BC:0.55,
    F_pass: 1700, tier:'mid', anchorWeight:0.60, tags:['网红公园','打卡'] },

  { id:'SP24', name:'锦悦西路次干道铺',      address:'锦悦西路 中段',
    x:-220, z:-130, area: 70, floor:'1F', rent: 78, metroDist: 460, T:6, S:5, C:5.5, BC:0.30,
    F_pass: 550, tier:'low', anchorWeight:0.35, tags:['次干道','低租金'] },

  { id:'SP25', name:'天府长城街区铺',        address:'天府长城北门街区',
    x: 340, z: 240, area: 115, floor:'1F', rent: 88, metroDist: 540, T:7, S:6, C:5.8, BC:0.35,
    F_pass: 680, tier:'mid', anchorWeight:0.42, tags:['老牌住宅','稳定客流'] },

  { id:'SP26', name:'益州二路 沿街铺',       address:'益州东二路',
    x: 280, z:-120, area: 80, floor:'1F', rent: 92, metroDist: 380, T:7, S:6.5, C:6, BC:0.40,
    F_pass: 750, tier:'low', anchorWeight:0.45, tags:['车流多','停车便利'] },

  { id:'SP27', name:'宋庆龄幼儿园对街',      address:'宋庆龄幼儿园对面',
    x:-80, z: 220, area: 65, floor:'1F', rent: 105, metroDist: 200, T:7, S:6.8, C:7, BC:0.50,
    F_pass: 1400, tier:'low', anchorWeight:0.55, tags:['亲子动线','高端家庭'] },

  // —— 写字楼裙楼 ——
  { id:'SP28', name:'华敏世家花园底商',      address:'锦城大道 华敏世家',
    x:-60, z:-180, area: 95, floor:'1F', rent: 100, metroDist: 320, T:7, S:6.5, C:6.5, BC:0.42,
    F_pass: 850, tier:'mid', anchorWeight:0.55, tags:['中端住宅','配套'] },

  { id:'SP29', name:'东方希望中心一层',      address:'金融城东 东方希望中心',
    x: 280, z:  10, area: 175, floor:'1F', rent: 165, metroDist: 320, T:8, S:7.5, C:7.2, BC:0.55,
    F_pass: 1300, tier:'mid', anchorWeight:0.68, tags:['总部楼底商'] },

  // —— 高端组合：投资额最高的"门面" ——
  { id:'SP30', name:'IFC 中庭旗舰店位',      address:'IFC 中央广场·1F',
    x:-10, z:  0, area: 420, floor:'1F', rent: 360, metroDist: 95, T:10, S:9.5, C:9, BC:0.80,
    F_pass: 3500, tier:'high', anchorWeight:0.95, tags:['旗舰店','大面积','品牌窗口'] },
];

// 给铺位附加一些计算用的派生字段（饱和度的同业数，按区域定）
SPOTS.forEach(sp => {
  // 简单按距 IFC 中心的距离推同业密度（核心区咖啡饱和度高）
  const dCenter = Math.hypot(sp.x, sp.z);
  sp.sameCount_coffee  = Math.max(8, Math.round(40 - dCenter/12));
  sp.sameCount_hotpot  = Math.max(3, Math.round(18 - dCenter/30));
  sp.sameCount_conv    = Math.max(4, Math.round(22 - dCenter/22));
});
