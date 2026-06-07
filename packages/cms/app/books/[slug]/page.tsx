"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import type { Book } from "@daily-book/shared";

const EMPTY: Book = {
  slug: "",
  title: "",
  author: "",
  cover: "",
  rating: 4,
  genre: "文学",
  tags: [],
  difficulty: "medium",
  readingTime: "",
  targetAudience: "",
  oneLiner: "",
  summary: "",
  review: "",
  quote: "",
  date: new Date().toISOString().slice(0, 10),
};

export default function EditBookPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const isNew = slug === "new";

  const [form, setForm] = useState<Book>(EMPTY);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  useEffect(() => {
    if (isNew) return;
    fetch(`/api/books/${slug}`)
      .then((r) => r.json())
      .then((book) => {
        setForm(book);
        setTagsInput((book.tags || []).join(", "));
        setLoading(false);
      });
  }, [slug, isNew]);

  function update<K extends keyof Book>(key: K, value: Book[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
    const body = { ...form, tags };

    const url = isNew ? "/api/books" : `/api/books/${slug}`;
    const method = isNew ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      router.push("/books");
    } else {
      const data = await res.json();
      setError(data.error || "保存失败");
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">加载中...</div>;
  }

  return (
    <div className="min-h-screen p-8 max-w-3xl mx-auto">
      <header className="mb-8">
        <Link href="/books" className="text-gray-400 hover:text-amber-400 text-sm mb-4 inline-block">
          ← 返回书籍列表
        </Link>
        <h1 className="text-2xl font-bold text-white">
          {isNew ? "添加书籍" : `编辑：${form.title}`}
        </h1>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Field label="书名" value={form.title} onChange={(v) => update("title", v)} required />
          <Field label="作者" value={form.author} onChange={(v) => update("author", v)} required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Slug" value={form.slug} onChange={(v) => update("slug", v)} required disabled={!isNew} />
          <Field label="日期" value={form.date} onChange={(v) => update("date", v)} type="date" required />
        </div>

        <Field label="封面 URL" value={form.cover} onChange={(v) => update("cover", v)} />

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">分类</label>
            <select
              value={form.genre}
              onChange={(e) => update("genre", e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500"
            >
              {["文学", "历史", "科技", "哲学", "心理学", "商业", "艺术", "社会学", "自我提升", "效率", "小说", "科普"].map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">难度</label>
            <select
              value={form.difficulty}
              onChange={(e) => update("difficulty", e.target.value as Book["difficulty"])}
              className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500"
            >
              <option value="easy">轻松</option>
              <option value="medium">进阶</option>
              <option value="hard">挑战</option>
            </select>
          </div>
          <Field label="评分" value={String(form.rating)} onChange={(v) => update("rating", Number(v))} type="number" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="阅读时间" value={form.readingTime} onChange={(v) => update("readingTime", v)} placeholder="如：4-5小时" />
          <Field label="标签" value={tagsInput} onChange={setTagsInput} placeholder="逗号分隔，如：哲学, 成长, 寓言" />
        </div>

        <Field label="一句话推荐" value={form.oneLiner} onChange={(v) => update("oneLiner", v)} />
        <Field label="适合谁读" value={form.targetAudience} onChange={(v) => update("targetAudience", v)} />
        <Textarea label="摘要" value={form.summary} onChange={(v) => update("summary", v)} />
        <Textarea label="书评" value={form.review} onChange={(v) => update("review", v)} rows={6} />
        <Field label="金句" value={form.quote} onChange={(v) => update("quote", v)} />

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-medium px-8 py-3 rounded-lg transition-colors"
          >
            {saving ? "保存中..." : "保存"}
          </button>
          <Link href="/books" className="px-8 py-3 rounded-lg border border-gray-700 text-gray-400 hover:text-white transition-colors">
            取消
          </Link>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500 disabled:opacity-50"
      />
    </div>
  );
}

function Textarea({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500 resize-y"
      />
    </div>
  );
}
