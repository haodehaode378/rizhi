import { books, getBookBySlug } from "@daily-book/shared";
import { Header } from "@/components/Header";
import { notFound } from "next/navigation";
import Link from "next/link";

export function generateStaticParams() {
  return books.map((b) => ({ slug: b.slug }));
}

function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="flex gap-1.5 text-amber-500 text-2xl">
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={
            i < full
              ? "opacity-100"
              : i === full && half
                ? "opacity-70"
                : "opacity-20"
          }
        >
          ★
        </span>
      ))}
      <span className="text-gray-400 text-lg ml-2">{rating}</span>
    </div>
  );
}

export default async function BookPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const book = getBookBySlug(slug);
  if (!book) return notFound();

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-6 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-amber-400 transition-colors mb-10 text-sm"
        >
          ← 返回书架
        </Link>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Cover */}
          <div className="flex-shrink-0">
            <div className="w-72 md:w-80 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-gray-800/30">
              <img
                src={book.cover}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-6 flex-1">
            <span className="text-xs font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full w-fit">
              {book.genre}
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              {book.title}
            </h1>
            <p className="text-xl text-gray-300">{book.author}</p>
            <Stars rating={book.rating} />
            <div className="text-sm text-gray-500">{book.date}</div>
          </div>
        </div>

        {/* Summary */}
        <section className="mt-14">
          <h2 className="text-2xl font-bold text-white mb-4">一句话推荐</h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            {book.summary}
          </p>
        </section>

        {/* Review */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-white mb-4">书评</h2>
          <p className="text-gray-300 leading-relaxed text-lg">{book.review}</p>
        </section>

        {/* Quote */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-white mb-4">金句</h2>
          <blockquote className="border-l-4 border-amber-500 bg-amber-500/5 rounded-r-xl px-8 py-6 text-xl text-amber-200 italic leading-relaxed">
            「{book.quote}」
          </blockquote>
        </section>
      </main>

      <footer className="border-t border-gray-800/50 mt-20 py-8 text-center text-gray-500 text-sm">
        每日一本好书 — 发现阅读的乐趣
      </footer>
    </>
  );
}
