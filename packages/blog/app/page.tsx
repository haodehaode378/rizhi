import { books } from "@daily-book/shared";
import { Header } from "@/components/Header";
import { BookCard } from "@/components/BookCard";

export default function HomePage() {
  const sorted = [...books].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero */}
        <section className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            日知
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            日知一书，日进一步。每天精选一本值得阅读的好书，用最短的时间发现下一本改变你的书。
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-amber-500 to-red-500 mx-auto mt-6 rounded-full" />
        </section>

        {/* Book Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sorted.map((book) => (
            <BookCard key={book.slug} book={book} />
          ))}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 mt-20 py-8 text-center text-gray-500 text-sm">
        日知 — 日知一书，日进一步
      </footer>
    </>
  );
}
