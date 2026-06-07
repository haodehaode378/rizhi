"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Book } from "@daily-book/shared";

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState("");

  useEffect(() => {
    fetch("/api/books")
      .then((r) => r.json())
      .then(setBooks);
  }, []);

  const genres = [...new Set(books.map((b) => b.genre))].sort();
  const filtered = books
    .filter((b) => {
      const matchSearch = !search || b.title.includes(search) || b.author.includes(search);
      const matchGenre = !genreFilter || b.genre === genreFilter;
      return matchSearch && matchGenre;
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  async function handleDelete(slug: string, title: string) {
    if (!confirm(`确定删除「${title}」？`)) return;

    const res = await fetch(`/api/books/${slug}`, { method: "DELETE" });
    if (res.ok) {
      setBooks((prev) => prev.filter((b) => b.slug !== slug));
    }
  }

  return (
    <div className="min-h-screen p-8 max-w-6xl mx-auto">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">书籍管理</h1>
          <p className="text-gray-500 text-sm mt-1">共 {books.length} 本</p>
        </div>
        <nav className="flex gap-4 text-sm">
          <Link href="/" className="text-gray-400 hover:text-white">仪表盘</Link>
          <Link href="/books" className="text-amber-400 hover:text-amber-300">书籍管理</Link>
          <Link href="/settings" className="text-gray-400 hover:text-white">设置</Link>
        </nav>
      </header>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="搜索书名或作者..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500"
        />
        <select
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
          className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500"
        >
          <option value="">全部分类</option>
          {genres.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
        <Link
          href="/books/new"
          className="bg-amber-500 hover:bg-amber-600 text-black font-medium px-5 py-2.5 rounded-lg text-sm transition-colors"
        >
          + 添加书籍
        </Link>
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800 text-left text-sm text-gray-500">
              <th className="px-6 py-4">书名</th>
              <th className="px-6 py-4">作者</th>
              <th className="px-6 py-4">分类</th>
              <th className="px-6 py-4">评分</th>
              <th className="px-6 py-4">日期</th>
              <th className="px-6 py-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr key={b.slug} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                <td className="px-6 py-4">
                  <Link href={`/books/${b.slug}`} className="text-white hover:text-amber-400 font-medium">
                    {b.title}
                  </Link>
                </td>
                <td className="px-6 py-4 text-gray-400">{b.author}</td>
                <td className="px-6 py-4">
                  <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">{b.genre}</span>
                </td>
                <td className="px-6 py-4 text-amber-400">{b.rating}</td>
                <td className="px-6 py-4 text-gray-500 text-sm">{b.date}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDelete(b.slug, b.title)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    删除
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-600">
                  暂无书籍
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
