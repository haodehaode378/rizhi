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

export function BookCard({ book }: { book: Book }) {
  return (
    <Link
      href={`/book/${book.slug}`}
      className="group relative flex flex-col bg-gray-900/60 border border-gray-800/50 rounded-2xl overflow-hidden hover:border-amber-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-amber-500/5 hover:shadow-2xl"
    >
      {/* Cover */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-800">
        <img
          src={book.cover}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60" />
        {/* Genre Badge */}
        <span className="absolute top-4 right-4 text-xs font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full backdrop-blur-sm">
          {book.genre}
        </span>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-3 p-5 flex-1">
        <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
          {book.title}
        </h3>
        <p className="text-sm text-gray-400">{book.author}</p>
        <Stars rating={book.rating} />
        <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed flex-1">
          {book.summary}
        </p>
        <div className="text-xs text-gray-500 mt-1">{book.date}</div>
      </div>
    </Link>
  );
}
