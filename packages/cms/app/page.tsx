import { books } from "@daily-book/shared";
import Link from "next/link";

function StatCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <p className="text-gray-500 text-sm mb-1">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

export default function Dashboard() {
  const total = books.length;
  const genres = [...new Set(books.map((b) => b.genre))];
  const latest = [...books].sort((a, b) => b.date.localeCompare(a.date))[0];
  const avgRating = (books.reduce((s, b) => s + b.rating, 0) / total).toFixed(1);

  const genreCounts = books.reduce<Record<string, number>>((acc, b) => {
    acc[b.genre] = (acc[b.genre] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen p-8 max-w-6xl mx-auto">
      <header className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-bold text-white">日知 — 管理后台</h1>
          <p className="text-gray-500 text-sm mt-1">数据概览</p>
        </div>
        <nav className="flex gap-4 text-sm">
          <Link href="/" className="text-amber-400 hover:text-amber-300">仪表盘</Link>
          <Link href="/books" className="text-gray-400 hover:text-white">书籍管理</Link>
          <Link href="/settings" className="text-gray-400 hover:text-white">设置</Link>
        </nav>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard label="书籍总数" value={total} color="text-white" />
        <StatCard label="分类数" value={genres.length} color="text-amber-400" />
        <StatCard label="平均评分" value={avgRating} color="text-emerald-400" />
        <StatCard label="最近更新" value={latest?.date || "-"} color="text-blue-400" />
      </div>

      {/* Genre Distribution */}
      <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-10">
        <h2 className="text-lg font-semibold text-white mb-4">分类分布</h2>
        <div className="space-y-3">
          {Object.entries(genreCounts)
            .sort(([, a], [, b]) => b - a)
            .map(([genre, count]) => (
              <div key={genre} className="flex items-center gap-3">
                <span className="text-sm text-gray-400 w-20">{genre}</span>
                <div className="flex-1 bg-gray-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${(count / total) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500 w-8 text-right">{count}</span>
              </div>
            ))}
        </div>
      </section>

      {/* Recent Books */}
      <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">最近推荐</h2>
        <div className="space-y-3">
          {[...books]
            .sort((a, b) => b.date.localeCompare(a.date))
            .slice(0, 5)
            .map((b) => (
              <div key={b.slug} className="flex items-center justify-between py-2 border-b border-gray-800/50 last:border-0">
                <div>
                  <span className="text-white font-medium">{b.title}</span>
                  <span className="text-gray-500 text-sm ml-2">{b.author}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-amber-400 text-sm">{"★".repeat(Math.round(b.rating))}</span>
                  <span className="text-gray-600 text-xs">{b.date}</span>
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}
