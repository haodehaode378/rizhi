import Link from "next/link";
import type { Book } from "@daily-book/shared";

function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="flex gap-1 text-amber-500 text-sm">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < full ? "opacity-100" : i === full && half ? "opacity-70" : "opacity-20"}>
          ★
        </span>
      ))}
    </div>
  );
}

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const map: Record<string, { label: string; color: string }> = {
    easy: { label: "轻松", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
    medium: { label: "进阶", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
    hard: { label: "挑战", color: "bg-red-500/20 text-red-400 border-red-500/30" },
  };
  const d = map[difficulty] || map.medium;
  return (
    <span className={`text-xs font-medium border px-2 py-0.5 rounded-full ${d.color}`}>
      {d.label}
    </span>
  );
}

function CoverFallback({ title }: { title: string }) {
  const colors = ["from-amber-600 to-red-600", "from-blue-600 to-purple-600", "from-emerald-600 to-teal-600"];
  const idx = title.charCodeAt(0) % colors.length;
  return (
    <div className={`w-full h-full bg-gradient-to-br ${colors[idx]} flex items-center justify-center`}>
      <span className="text-white text-4xl font-black opacity-80">{title[0]}</span>
    </div>
  );
}

export function BookCard({ book }: { book: Book }) {
  return (
    <Link
      href={`/book/${book.slug}`}
      className="group relative flex flex-col bg-gray-900/60 border border-gray-800/50 rounded-2xl overflow-hidden hover:border-amber-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-amber-500/5 hover:shadow-2xl"
    >
      {/* Cover */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-800">
        {book.cover ? (
          <img
            src={book.cover}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <CoverFallback title={book.title} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60" />
        {/* Badges */}
        <div className="absolute top-4 right-4 flex gap-2">
          <span className="text-xs font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full backdrop-blur-sm">
            {book.genre}
          </span>
          <DifficultyBadge difficulty={book.difficulty} />
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-3 p-5 flex-1">
        <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
          {book.title}
        </h3>
        <p className="text-sm text-gray-400">{book.author}</p>
        <Stars rating={book.rating} />
        <p className="text-sm text-amber-400/80 italic line-clamp-1">{book.oneLiner}</p>
        <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed flex-1">
          {book.summary}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
          <span>{book.date}</span>
          <span>{book.readingTime}</span>
        </div>
      </div>
    </Link>
  );
}
