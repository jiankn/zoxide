import RankingSimulator from '@/components/RankingSimulator/RankingSimulator';
import CommandBlock from '@/components/TaskGuides/CommandBlock';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import { Link, routing } from '@/i18n/routing';
import { generateMultilingualMetadata } from '@/lib/seo/metadata';
import { setRequestLocale } from 'next-intl/server';
import { getPrimaryPaths } from '@/data/search-intents';
import { words } from '@/data/task-guides';

// 规则依据：zoxide v0.10.0 源码 src/db/dir.rs（score）、src/db/mod.rs（add_update、age）、
// src/db/stream.rs（filter_by_keywords），2026-11-08 核对；实测得分见 /evidence/2026-10-08/command-init.json

const copy = {
  en: {
    title: 'zoxide Ranking Simulator: Why z Picked That Folder',
    h1: 'Why did z pick that folder?',
    description: 'Simulate zoxide 0.10.0 ranking in your browser: visit folders, move the clock and type a query to see each score, the winner and why other folders were skipped.',
  },
  zh: {
    title: 'zoxide 排名模拟器：z 为什么跳到那个目录',
    h1: 'z 为什么跳到了那个目录？',
    description: '在浏览器里模拟 zoxide 0.10.0 的排名：进入目录、拨动时间、输入关键词，看每个目录的得分、最终跳到哪里，以及其他目录为什么被跳过。',
  },
  ja: {
    title: 'zoxide 順位シミュレーター：z がそのフォルダを選んだ理由',
    h1: 'z はなぜそのフォルダを選んだのか',
    description: 'zoxide 0.10.0 の順位付けをブラウザで再現。フォルダへの移動、時間の経過、キーワード入力で、各スコアと移動先、除外された理由が分かります。',
  },
};

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const content = copy[locale as keyof typeof copy] ?? copy.en;
  return generateMultilingualMetadata(locale, '/tools/ranking-simulator', {
    title: content.title,
    description: content.description,
    keywords: 'zoxide ranking, zoxide frecency, zoxide score, z jumps to wrong directory, zoxide no match found',
  });
}

export default async function RankingSimulatorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const content = copy[locale as keyof typeof copy] ?? copy.en;
  const t = (en: string, zh: string, ja: string) => words(locale, en, zh, ja);
  const primary = getPrimaryPaths(locale);

  const factors = [
    [t('Within the last hour', '1 小时内', '1 時間以内'), '× 4'],
    [t('Within the last day', '1 天内', '1 日以内'), '× 2'],
    [t('Within the last week', '1 周内', '1 週間以内'), '× 0.5'],
    [t('Older than a week', '超过 1 周', '1 週間より前'), '× 0.25'],
  ];

  return (
    <div className="container mx-auto max-w-7xl px-4 py-10 md:px-7">
      <Breadcrumbs locale={locale} path="/tools/ranking-simulator" currentLabel={content.h1} />
      <header className="mb-8 max-w-[70ch]">
        <h1 className="text-[34px] font-extrabold leading-[1.1] tracking-[-0.025em] text-ink md:text-[42px]">{content.h1}</h1>
        <p className="mt-3 text-lg leading-7 text-ink-soft">
          {t('zoxide keeps a record for every folder your shell visits and gives each one a score. Visit a few folders, move the clock and type a query to watch the scores decide where z goes.',
            'zoxide 会给 Shell 进过的每个目录记一笔账，并算出一个得分。在下面进几个目录、拨一拨时间、输入关键词，就能看到得分怎样决定 z 跳去哪里。',
            'zoxide はシェルで移動したフォルダごとに記録を持ち、スコアを付けます。いくつかのフォルダへ移動し、時間を進め、キーワードを入力すると、スコアが移動先を決める様子が分かります。')}
        </p>
      </header>

      <section aria-label={t('Simulator', '模拟器', 'シミュレーター')} className="rounded-[14px] border-[1.5px] border-rule bg-[var(--background)] p-5 md:p-7">
        <RankingSimulator locale={locale} />
      </section>

      <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
        <article className="min-w-0 max-w-[72ch] space-y-10 text-[17px] leading-7 text-gray-700">
          <section>
            <h2 className="mb-3 text-2xl font-extrabold tracking-[-0.01em] text-ink">{t('How zoxide scores a folder', 'zoxide 怎样给目录打分', 'zoxide のスコアの付け方')}</h2>
            <p>{t('Every time the shell hook records a folder, its rank goes up by 1 and its last-visit time is updated. When you run z, each candidate gets a score of rank multiplied by a recency factor:',
              'Shell 的 hook 每记录一次某个目录，它的 rank 就加 1，并刷新“最后访问时间”。执行 z 时，每个候选目录的得分 = rank × 时间系数：',
              'シェルの hook がフォルダを記録するたびに rank が 1 増え、最終訪問時刻が更新されます。z を実行すると、各候補のスコアは rank × 経過時間の係数で決まります。')}</p>
            <table className="mt-4 w-full max-w-md border-collapse text-[15px]">
              <thead><tr className="border-b-[1.5px] border-ink"><th className="py-1.5 text-left">{t('Last visit', '最后访问', '最終訪問')}</th><th className="py-1.5 text-left">{t('Factor', '系数', '係数')}</th></tr></thead>
              <tbody>{factors.map(([a, b]) => <tr key={a} className="border-b border-rule"><td className="py-1.5">{a}</td><td className="py-1.5 font-mono tabular-nums">{b}</td></tr>)}</tbody>
            </table>
            <p className="mt-4">{t('So a folder visited once in the last hour (1 × 4 = 4) beats one visited six times last month (6 × 0.25 = 1.5). In our October 2026 Ubuntu test, the same folder scored 8.0 with the default prompt hook and 4.0 with --hook pwd, because the prompt hook recorded it twice.',
              '所以 1 小时内去过一次的目录（1 × 4 = 4）会赢过上个月去过六次的目录（6 × 0.25 = 1.5）。我们 2026 年 10 月在 Ubuntu 上的实测里，同一个目录在默认的 prompt hook 下得分 8.0，换成 --hook pwd 是 4.0，因为 prompt hook 记了两次。',
              'つまり 1 時間以内に 1 回訪れたフォルダ（1 × 4 = 4）は、先月 6 回訪れたフォルダ（6 × 0.25 = 1.5）より上位になります。2026 年 10 月の Ubuntu での実測では、同じフォルダが既定の prompt hook で 8.0、--hook pwd で 4.0 でした。prompt hook が 2 回記録したためです。')}{' '}
              <a href="/evidence/2026-10-08/command-init.json" className="font-semibold text-ink underline">{t('Archived output', '归档的原始输出', '保存した出力')}</a></p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-extrabold tracking-[-0.01em] text-ink">{t('How a query matches', '关键词怎样匹配', 'キーワードの一致条件')}</h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>{t('Matching ignores case.', '不区分大小写。', '大文字と小文字は区別しません。')}</li>
              <li>{t('The last keyword must appear in the last folder name. z web does not match ~/work/web-app/src, because the last folder is src.', '最后一个关键词必须出现在最后一级目录名里。z web 匹配不到 ~/work/web-app/src，因为最后一级是 src。', '最後のキーワードは末尾のフォルダ名に含まれている必要があります。~/work/web-app/src の末尾は src なので、z web では一致しません。')}</li>
              <li>{t('Earlier keywords must appear, in order, somewhere before it. z web src matches ~/work/web-app/src.', '前面的关键词要按顺序出现在它之前。z web src 就能匹配 ~/work/web-app/src。', 'それ以前のキーワードは、その前のどこかに順番どおり現れる必要があります。z web src なら ~/work/web-app/src に一致します。')}</li>
              <li>{t('z never jumps to the folder you are already in; the next-best match wins instead.', 'z 不会跳到你当前所在的目录，而是选第二名。', 'z は今いるフォルダには移動せず、次点の候補を選びます。')}</li>
              <li>{t('On a tie, the folder zoxide learned later wins. In our November 2026 macOS and Ubuntu runs, ~/work/api and ~/work/api-docs both scored 4.0 and z api went to api-docs, which was visited second.',
                '同分时，zoxide 后学到的目录胜出。我们 2026 年 11 月在 macOS 和 Ubuntu 上的实测里，~/work/api 和 ~/work/api-docs 都是 4.0 分，z api 去了后访问的 api-docs。',
                '同点の場合は、zoxide が後から覚えたフォルダが選ばれます。2026 年 11 月の macOS と Ubuntu の実測では、~/work/api と ~/work/api-docs がどちらも 4.0 で、z api は後に訪れた api-docs へ移動しました。')}{' '}
                <a href="/evidence/2026-11-08/macos.json" className="font-semibold text-ink underline">{t('Archived output', '归档的原始输出', '保存した出力')}</a></li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-extrabold tracking-[-0.01em] text-ink">{t('When old folders disappear', '旧目录什么时候被清掉', '古いフォルダが消えるとき')}</h2>
            <p>{t('When the ranks of all folders add up to more than _ZO_MAXAGE (10000 by default), zoxide scales every rank down so the total becomes 9000, and removes any folder whose rank falls below 1. Rarely used folders fade out this way without you deleting anything.',
              '当所有目录的 rank 加起来超过 _ZO_MAXAGE（默认 10000）时，zoxide 会把每个 rank 按比例缩小，让总和变成 9000，并删除 rank 低于 1 的目录。很少去的目录就这样自然淡出，不需要你手动删除。',
              'すべての rank の合計が _ZO_MAXAGE（既定値 10000）を超えると、zoxide は合計が 9000 になるよう全体を縮小し、rank が 1 未満になったフォルダを削除します。あまり使わないフォルダは、手動で消さなくても自然に消えていきます。')}</p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-extrabold tracking-[-0.01em] text-ink">{t('See the real scores on your machine', '查看你电脑上的真实得分', '自分の環境の実際のスコアを見る')}</h2>
            <p className="mb-3">{t('List every folder with its score, or only the ones a query would match. The first line of the second command is where z would go, unless you are already there.', '第一条列出所有目录和得分，第二条只列出某个关键词能匹配的目录。第二条结果的第一行就是 z 会去的地方（除非你已经在那里）。', '1 つ目はすべてのフォルダとスコア、2 つ目はキーワードに一致するものだけを表示します。2 つ目の先頭行が z の移動先です（すでにそこにいる場合を除く）。')}</p>
            <CommandBlock code={'zoxide query --list --score\nzoxide query --list --score api'} locale={locale} />
          </section>
        </article>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[14px] border-[1.5px] border-rule bg-paper p-5">
            <p className="mb-2 text-[13px] font-bold uppercase tracking-[0.08em] text-ink-soft">{t('Fix it', '修复', '直し方')}</p>
            <ul className="m-0 list-none space-y-0 p-0 text-[15px]">
              <li className="border-b border-rule py-2.5"><Link href={primary.noMatch} className="font-semibold text-ink hover:text-blue-700">zoxide: no match found</Link></li>
              <li className="border-b border-rule py-2.5"><Link href={primary.commands} className="font-semibold text-ink hover:text-blue-700">{t('Remove a stale folder', '删除过期目录', '古いフォルダを削除')}</Link></li>
              <li className="border-b border-rule py-2.5"><Link href={primary.fzf} className="font-semibold text-ink hover:text-blue-700">{t('Pick from a list with zi', '用 zi 从列表里选', 'zi で一覧から選ぶ')}</Link></li>
              <li className="py-2.5"><Link href="/" className="font-semibold text-ink hover:text-blue-700">{t('Set up zoxide for your shell', '按你的 Shell 配置 zoxide', 'シェル別に zoxide を設定')}</Link></li>
            </ul>
          </div>
          <p className="text-[14px] leading-6 text-ink-soft">
            {t('The simulator uses the rules in zoxide 0.10.0 (src/db/dir.rs, src/db/mod.rs, src/db/stream.rs), checked on 2026-11-08. Folder names are examples. It is an independent demo, not part of the zoxide project.',
              '模拟器使用 zoxide 0.10.0 源码中的规则（src/db/dir.rs、src/db/mod.rs、src/db/stream.rs），2026-11-08 核对。目录名是示例。这是独立制作的演示，不属于 zoxide 官方项目。',
              'このシミュレーターは zoxide 0.10.0 のソース（src/db/dir.rs、src/db/mod.rs、src/db/stream.rs）の規則に基づき、2026-11-08 に確認しました。フォルダ名は例です。zoxide 公式とは無関係の独自デモです。')}
          </p>
        </aside>
      </div>
    </div>
  );
}
