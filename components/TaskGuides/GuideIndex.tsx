import { Link } from '@/i18n/routing';
import { taskGroups, words } from '@/data/task-guides';

export default function GuideIndex({ locale }: { locale: string }) {
  return <div className="space-y-12">
    {taskGroups(locale).map(group => <section key={group.title} className="border-t border-gray-200 pt-7">
      <h2 className="text-2xl font-serif font-bold">{group.title}</h2>
      <p className="mt-3 max-w-3xl leading-7 text-gray-600">{group.description}</p>
      <ul className="mt-5 grid gap-x-10 md:grid-cols-2">{group.links.map(link => <li key={link.href} className="border-b border-gray-100 py-4"><Link href={link.href} className="font-medium text-blue-700 underline decoration-blue-200 underline-offset-4 hover:decoration-blue-700">{link.title}</Link></li>)}</ul>
    </section>)}
    <p className="flex flex-wrap gap-6"><Link href="/tutorials" className="text-blue-700 underline">{words(locale, 'Follow the learning path', '按学习顺序阅读', '学習順に読む')}</Link><Link href="/faq" className="text-blue-700 underline">FAQ</Link></p>
  </div>;
}
