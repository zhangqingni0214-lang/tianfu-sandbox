# CLAUDE.md — 项目上下文（给 Claude Code 看的）

## 这是什么
**单页 3D 商业沙盘** — B 套"商业落地型"形态，天府国际金融中心 500m 核心区。
入口 = `index.html`，所有逻辑都在这一个文件里 + 共享 data/lib。

## 核心约束
- **单页纯静态**，无后端，无构建步骤
- 模块加载：ES Module + importmap，**必须通过 HTTP 服务器**（不能 file://）
- 风格：苹果白 / 铂金 / 磨砂玻璃（rgba(255,255,255,0.78) + backdrop-filter）
- 字体：-apple-system + PingFang SC
- 配色：主 #4a90e2，金 #d4af37，墨 #1d1d1f，绿 #34c759，红 #ff3b30

## 文件地图

```
v2-tool/
├── index.html         单页 B 沙盘（约 500 行 HTML + JS + CSS）
├── data/
│   ├── spots.js          导出 SPOTS(30 个铺位) / LANDMARKS / METRO / SOURCES
│   ├── categories.js     导出 CATEGORIES(coffee/hotpot/conv) / COMPETITOR_POSITIONS
│   └── investorTiers.js  导出 TIERS / RISK_LABELS（保留供后续扩展）
└── lib/
    ├── calc.js           核心计算引擎（纯函数，无副作用）
    └── styles.css        共享苹果风样式
```

## 计算引擎（lib/calc.js）

| 函数 | 输入 | 输出 |
|---|---|---|
| `calcG(spot)` | 铺位 | 地理评分 0-10（含 POI 距离² + 介数中心性 + 地铁衰减） |
| `calcE(spot, tau)` | 铺位 + 时段集中度 | 日均潜在盘子（万元） |
| `calcDailyRev(spot, catId)` | 铺位 + 业态 | `{ total, breakdown }` 分客群日营收 |
| `calcK(spot, catId)` | 铺位 + 业态 | 竞争修正系数 0.3-1.6 |
| `evaluateSpot(spot, catId)` | 铺位 + 业态 | 完整 18 字段评估结果（页面主入口） |

## index.html 内部状态

```js
const state = {
  cat: 'coffee',         // 业态: coffee / hotpot / conv
  period: 'morning',     // 时段: morning / lunch / evening / off
  month: 5,              // 月份: 1-12
  spotId: 'SP01',        // 当前候选铺位 ID
};
```

切换任一字段都会触发 `refreshAll()` 重新计算并更新所有浮窗。

## 维护原则

1. **改数据不改代码**：所有可调参数都在 `data/*.js`
2. **保持苹果风骨**：新增 UI 元素必须用 `.panel` 类或继承现有变量
3. **纯函数**：`lib/calc.js` 不能有副作用
4. **单页约束**：不要再拆分页面，保持单 HTML

## 常见任务

### 加业态
```js
// data/categories.js
newCat: { AOV, r1, r2, r3, netMargin, monthlyOpex, investBase, investPerM2,
          segments:[...], season:[12 个数], position:[5 维向量], N_carry }
```
然后到 `data/spots.js` 末尾的 forEach 里加 `sameCount_newCat` 字段，
最后到 `index.html` 的业态切换 pill 里加按钮即可。

### 加铺位
直接在 `data/spots.js` 的 `SPOTS` 数组 push 一条，14 个字段照葫芦画瓢。

### 改沙盘风格
所有 UI 浮窗在 `index.html` 的 `<style>` 里，按 ID（#hud-top / #radar-panel / 等）找。
3D 场景在 `<script type="module">` 里，搜 `THREE.Mesh` 找建筑、`metroGroups` 找地铁。

## 不要做的事

- ❌ 不要拆分成多页（用户明确说"只做 B 单页"）
- ❌ 不要加构建依赖（Webpack/Vite）
- ❌ 不要把 Three.js 改 require，保持 ES Module + importmap
- ❌ 不要在 calc.js 里有副作用

## 快速 checklist

- [ ] 切业态：右下 U 曲线应该跟着变（不同业态 N_carry 不同）
- [ ] 切时段：街道粒子密度 + 客群条形 + 营收数字应同步变
- [ ] 拖月份滑块：年营收数字应随季节修正涨/跌
- [ ] 切铺位：摄像机平滑飞过去，候选铺位蓝光柱位置变化
- [ ] 鼠标 hover 建筑：应有淡蓝高亮
