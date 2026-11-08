import { Link } from '@/i18n/routing';
import { words } from '@/data/task-guides';

// 排错文章里的模拟器入口：先弄清 z 为什么选了别的目录，再动配置
export default function SimulatorCallout({ locale, slug }: { locale: string; slug: string }) {
  const isNoMatch = slug.includes('no-match');
  const lead = isNoMatch
    ? words(locale,
        'Not sure why z says "no match found"? Type your query into the ranking simulator and see which folders fail the last-keyword rule.',
        '不确定 z 为什么报 "no match found"？把你的关键词输进排名模拟器，看哪些目录卡在“最后一个关键词”规则上。',
        'z が "no match found" を返す理由が分からないときは、ランキングシミュレーターにキーワードを入れて、どのフォルダーが「最後のキーワード」規則で外れるか確認できます。')
    : words(locale,
        'If z jumps to the wrong folder rather than failing outright, the ranking simulator shows how visits and time decide the winner.',
        '如果 z 不是报错、而是跳错了目录，排名模拟器能演示访问次数和时间怎样决定最终目标。',
        'z がエラーではなく別のフォルダーへ移動する場合は、ランキングシミュレーターで訪問回数と時間がどう勝者を決めるか確認できます。');
  return (
    <aside className="mx-auto flex max-w-3xl flex-col gap-3 border-l-[6px] border-[var(--line-zsh)] bg-paper px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-[15px] leading-relaxed text-ink">{lead}</p>
      <Link
        href="/tools/ranking-simulator"
        className="shrink-0 rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
      >
        {words(locale, 'Open the simulator', '打开模拟器', 'シミュレーターを開く')}
      </Link>
    </aside>
  );
}
