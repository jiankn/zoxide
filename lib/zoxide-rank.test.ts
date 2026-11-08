// 运行：node --experimental-strip-types lib/zoxide-rank.test.ts
// 断言来自 zoxide 0.10.0 源码规则和 /evidence/2026-10-08/command-init.json 的实测得分。
import assert from 'node:assert/strict';
import { addVisit, age, DAY, HOUR, matchesKeywords, query, score, WEEK, type DirEntry } from './zoxide-rank.ts';

const now = 1_000_000;

// 时间系数四档
assert.equal(score({ path: '/a', rank: 2, lastAccessed: now - 10 }, now), 8);
assert.equal(score({ path: '/a', rank: 2, lastAccessed: now - 2 * HOUR }, now), 4);
assert.equal(score({ path: '/a', rank: 2, lastAccessed: now - 2 * DAY }, now), 1);
assert.equal(score({ path: '/a', rank: 2, lastAccessed: now - 2 * WEEK }, now), 0.5);

// 实测：prompt 模式下一次进入目录、回到提示符两次后得分 8.0（rank 2 × 4），
// pwd 模式只记一次，得分 4.0（rank 1 × 4）
let db: DirEntry[] = [];
db = addVisit(db, '/home/tester/projects/api-server', now);
assert.equal(score(db[0], now), 4);
db = addVisit(db, '/home/tester/projects/api-server', now);
assert.equal(score(db[0], now), 8);

// 匹配：最后一个关键词必须落在最后一段
assert.equal(matchesKeywords('/home/u/work/web-app/src', ['web']), false);
assert.equal(matchesKeywords('/home/u/work/web-app/src', ['web', 'src']), true);
assert.equal(matchesKeywords('/home/u/work/api-docs', ['api']), true);
assert.equal(matchesKeywords('/home/u/work/api-docs', ['docs', 'api']), false);
assert.equal(matchesKeywords('/home/u/Work/API', ['work', 'api']), true);
assert.equal(matchesKeywords('C:\\Users\\u\\work\\api\\src', ['api']), false);

// 查询：排除当前目录，按得分排序
const sample: DirEntry[] = [
  { path: '/w/api', rank: 1, lastAccessed: now - 2 * HOUR },
  { path: '/w/api-docs', rank: 6, lastAccessed: now - 10 * DAY },
  { path: '/w/client', rank: 9, lastAccessed: now },
];
const result = query(sample, ['api'], now);
assert.deepEqual(result.map(r => r.path), ['/w/api', '/w/api-docs']);
assert.equal(query(sample, ['api'], now, '/w/api')[0].path, '/w/api-docs');
assert.equal(query(sample, ['nothing'], now).length, 0);

// 同分时后加入的目录优先（/evidence/2026-11-08/macos.json、ubuntu.json：z api 去了 api-docs）
let tie: DirEntry[] = [];
for (const p of ['/w/api', '/w/api-docs', '/w/client-portal']) tie = addVisit(tie, p, now);
assert.deepEqual(query(tie, [], now).map(r => r.path), ['/w/client-portal', '/w/api-docs', '/w/api']);
assert.equal(query(tie, ['api'], now)[0].path, '/w/api-docs');

// 老化：总和超过上限时缩放到 0.9 × 上限，低于 1 的删除
const aged = age([
  { path: '/big', rank: 9000, lastAccessed: now },
  { path: '/mid', rank: 1999, lastAccessed: now },
  { path: '/tiny', rank: 1, lastAccessed: now },
]);
assert.equal(aged.length, 2);
assert.ok(Math.abs(aged.reduce((s, d) => s + d.rank, 0) - (9000 - 9000 / 11000 * 1)) < 1);
assert.deepEqual(age(sample), sample);

console.log('zoxide-rank: all assertions passed');
