"use client";

import { useState, useMemo } from "react";
import type { Book } from "@daily-book/shared";
import { BookCard } from "./BookCard";

interface FilterBarProps {
  books: Book[];
}

export function FilterBar({ books }: FilterBarProps) {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "rating">("date");

  const genres = useMemo(() => [...new Set(books.map((b) => b.genre))].sort(), [books]);

  const filtered = useMemo(() => {
    return books
      .filter((b) => {
        const matchSearch =
          !search ||
          b.title.includes(search) ||
          b.author.includes(search) ||
          b.summary.includes(search) ||
          (b.tags || []).some((t) => t.includes(search));
        const matchGenre = !genre || b.genre === genre;
        const matchDiff = !difficulty || b.difficulty === difficulty;
        return matchSearch && matchGenre && matchDiff;
      })
      .sort((a, b) =>
        sortBy === "rating" ? b.rating - a.rating : b.date.localeCompare(a.date)
      );
  }, [books, search, genre, difficulty, sortBy]);

  return (
    <>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          type="text"
          placeholder="搜索书名、作者、标签..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-gray-900/60 border border-gray-800/50 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500/50 transition-colors placeholder-gray-600"
        />
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="bg-gray-900/60 border border-gray-800/50 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500/50"
        >
          <option value="">全部分类</option>
          {genres.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="bg-gray-900/60 border border-gray-800/50 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500/50"
        >
          <option value="">全部难度</option>
          <option value="easy">轻松</option>
          <option value="medium">进阶</option>
          <option value="hard">挑战</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "date" | "rating")}
          className="bg-gray-900/60 border border-gray-800/50 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500/50"
        >
          <option value="date">最新优先</option>
          <option value="rating">评分最高</option>
        </select>
      </div>

      {/* Results count */}
      {(search || genre || difficulty) && (
        <p className="text-gray-500 text-sm mb-6">
          找到 {filtered.length} 本书
          {search && <span> · 关键词：{search}</span>}
          {genre && <span> · 分类：{genre}</span>}
          {difficulty && <span> · 难度：{difficulty === "easy" ? "轻松" : difficulty === "hard" ? "挑战" : "进阶"}</span>}
        </p>
      )}

      {/* Book Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((book) => (
          <BookCard key={book.slug} book={book} />
        ))}
      </section>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-gray-600">
          没有找到匹配的书籍
        </div>
      )}
    </>
  );
}
