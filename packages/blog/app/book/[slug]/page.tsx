import { books, getBookBySlug } from "@daily-book/shared";
import { Header } from "@/components/Header";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

export function generateStaticParams() {
  return books.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const book = getBookBySlug(slug);
  if (!book) return {};

  return {
    title: book.title,
    description: book.oneLiner || book.summary,
    openGraph: {
      title: `${book.title} — 日知`,
      description: book.oneLiner || book.summary,
      images: book.cover ? [book.cover] : [],
      type: "article",
    },
  };
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

  const base = process.env.SITE_URL || "https://rizhi.dev";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    author: { "@type": "Person", name: book.author },
    genre: book.genre,
    abstract: book.summary,
    review: { "@type": "Review", reviewBody: book.review },
    image: book.cover || undefined,
    url: `${base}/book/${book.slug}`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: book.rating,
      bestRating: 5,
    },
  };

  return (
    <>
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
            <div className="w-72 md:w-80 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-gray-800/30 bg-gray-800">
              {book.cover ? (
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-amber-600 to-red-600 flex items-center justify-center">
                  <span className="text-white text-6xl font-black opacity-80">{book.title[0]}</span>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-6 flex-1">
            <div className="flex gap-2 w-fit">
              <span className="text-xs font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full">
                {book.genre}
              </span>
              {book.difficulty && (
                <span className={`text-xs font-medium border px-3 py-1 rounded-full ${
                  book.difficulty === "easy" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" :
                  book.difficulty === "hard" ? "bg-red-500/20 text-red-400 border-red-500/30" :
                  "bg-blue-500/20 text-blue-400 border-blue-500/30"
                }`}>
                  {book.difficulty === "easy" ? "轻松" : book.difficulty === "hard" ? "挑战" : "进阶"}
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              {book.title}
            </h1>
            <p className="text-xl text-gray-300">{book.author}</p>
            {book.oneLiner && (
              <p className="text-lg text-amber-400/80 italic">「{book.oneLiner}」</p>
            )}
            <Stars rating={book.rating} />
            <div className="flex gap-6 text-sm text-gray-500">
              <span>{book.date}</span>
              {book.readingTime && <span>阅读时间：{book.readingTime}</span>}
            </div>
            {book.targetAudience && (
              <p className="text-sm text-gray-400">适合：{book.targetAudience}</p>
            )}
            {book.tags && book.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {book.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-gray-800 text-gray-400 px-2.5 py-1 rounded-full border border-gray-700/50">
                    {tag}
                  </span>
                ))}
              </div>
            )}
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
        日知 — 日知一书，日进一步
      </footer>
    </>
  );
}
