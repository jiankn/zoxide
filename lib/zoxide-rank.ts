// zoxide 0.10.0 的打分、匹配与老化规则（对照上游源码 src/db/dir.rs、src/db/mod.rs、src/db/stream.rs）。
// 排名模拟器只用这里的纯函数，方便单独测试。

export const HOUR = 60 * 60;
export const DAY = 24 * HOUR;
export const WEEK = 7 * DAY;
export const DEFAULT_MAXAGE = 10000;

export interface DirEntry {
  path: string;
  rank: number;
  lastAccessed: number; // 秒
}

// dir.rs score：rank × 时间系数
export function recencyFactor(elapsed: number) {
  if (elapsed < HOUR) return 4;
  if (elapsed < DAY) return 2;
  if (elapsed < WEEK) return 0.5;
  return 0.25;
}

export function score(dir: DirEntry, now: number) {
  return dir.rank * recencyFactor(Math.max(0, now - dir.lastAccessed));
}

// mod.rs add_update：已有目录 rank + by 并刷新时间；新目录以 by 入库
export function addVisit(db: DirEntry[], path: string, now: number, by = 1): DirEntry[] {
  const found = db.find(d => d.path === path);
  if (found) return db.map(d => (d === found ? { ...d, rank: d.rank + by, lastAccessed: now } : d));
  return [...db, { path, rank: Math.max(by, 0), lastAccessed: now }];
}

// mod.rs age：rank 总和超过 maxAge 时整体缩放到 0.9 × maxAge，低于 1 的目录删除
export function age(db: DirEntry[], maxAge = DEFAULT_MAXAGE): DirEntry[] {
  const total = db.reduce((sum, d) => sum + d.rank, 0);
  if (total <= maxAge) return db;
  const factor = (0.9 * maxAge) / total;
  return db.map(d => ({ ...d, rank: d.rank * factor })).filter(d => d.rank >= 1);
}

// stream.rs filter_by_keywords：路径与关键词都转小写；
// 最后一个关键词从右往左找，命中位置之后不能再有路径分隔符（必须落在最后一段）；
// 其余关键词按从右到左的顺序依次出现在更前面的位置
export function matchesKeywords(path: string, keywords: string[]) {
  const words = keywords.map(k => k.toLowerCase()).filter(Boolean);
  if (words.length === 0) return true;
  let rest = path.toLowerCase();
  const last = words[words.length - 1];
  const idx = rest.lastIndexOf(last);
  if (idx < 0) return false;
  if (/[/\\]/.test(rest.slice(idx + last.length))) return false;
  rest = rest.slice(0, idx);
  for (const word of words.slice(0, -1).reverse()) {
    const i = rest.lastIndexOf(word);
    if (i < 0) return false;
    rest = rest.slice(0, i);
  }
  return true;
}

export interface Ranked extends DirEntry {
  score: number;
}

// z 的查询：匹配关键词、排除当前目录，按得分从高到低。
// 同分时：stream.rs 先按得分升序排序（小数据量下等于稳定排序），再从末尾往前取，
// 所以数据库里后加入的目录排在前面。2026-11-08 macOS/Ubuntu 实测：三个目录同为 4.0 时 z api 去了后加入的 api-docs。
export function query(db: DirEntry[], keywords: string[], now: number, currentDir?: string): Ranked[] {
  return db
    .map((d, index) => ({ ...d, score: score(d, now), index }))
    .filter(d => d.path !== currentDir && matchesKeywords(d.path, keywords))
    .sort((a, b) => b.score - a.score || b.index - a.index);
}

export function splitQuery(text: string) {
  return text.trim().split(/\s+/).filter(Boolean);
}
