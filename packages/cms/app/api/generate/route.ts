import { NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const BOOKS_PATH = join(process.cwd(), "../shared/data/books.json");
const ROOT = join(process.cwd(), "../..");

function loadBooks() {
  return JSON.parse(readFileSync(BOOKS_PATH, "utf8"));
}

function saveBooks(books: unknown[]) {
  writeFileSync(BOOKS_PATH, JSON.stringify(books, null, 2) + "\n", "utf8");
}

function loadEnv() {
  try {
    const env = readFileSync(join(ROOT, ".env"), "utf8");
    for (const line of env.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const val = trimmed.slice(eq + 1).trim();
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {}
}

export async function POST() {
  loadEnv();

  const BASE_URL = process.env.AI_BASE_URL;
  const API_KEY = process.env.AI_API_KEY;
  const MODEL = process.env.AI_MODEL || "mimo-v2.5-pro";

  if (!BASE_URL || !API_KEY) {
    return NextResponse.json({ error: "AI API 未配置" }, { status: 500 });
  }

  const books = loadBooks();
  const existingList = books.map((b: { title: string; author: string }) => `- ${b.title} (${b.author})`).join("\n");
  const today = new Date().toISOString().slice(0, 10);

  const prompt = `你是「日知」的选书官，每天为读者精选一本值得阅读的好书。日知一书，日进一步。

避免推荐以下已推荐过的书：
${existingList || "（暂无）"}

今日日期：${today}

严格按以下 JSON 格式输出，不要有任何其他文字：
{
  "slug": "英文短横线格式的书名slug",
  "title": "中文书名",
  "author": "作者名",
  "cover": "豆瓣或公开可用的封面图片URL",
  "rating": 4.5,
  "genre": "分类",
  "tags": ["标签1", "标签2", "标签3"],
  "difficulty": "easy或medium或hard",
  "readingTime": "预计阅读时间",
  "targetAudience": "适合谁读",
  "oneLiner": "一句话推荐，15字以内",
  "summary": "一句话概括，20-40字",
  "review": "100-200字书评",
  "quote": "金句",
  "date": "${today}"
}

只输出 JSON。`;

  try {
    const res = await fetch(`${BASE_URL.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 4096,
        temperature: 0.9,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: `API 错误: ${text}` }, { status: 500 });
    }

    const data = await res.json();
    let raw = data.choices[0].message.content;

    // Parse JSON
    const codeBlockMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) raw = codeBlockMatch[1].trim();
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return NextResponse.json({ error: "AI 返回格式错误" }, { status: 500 });

    const book = JSON.parse(jsonMatch[0]);
    book.cover = book.cover || "";
    book.rating = Math.min(5, Math.max(1, Number(book.rating) || 4));
    book.slug = (book.slug || "").toLowerCase().replace(/[^a-z0-9-]/g, "-");
    book.tags = Array.isArray(book.tags) ? book.tags : [];
    book.difficulty = ["easy", "medium", "hard"].includes(book.difficulty) ? book.difficulty : "medium";

    // Check duplicate
    if (books.some((b: { slug: string }) => b.slug === book.slug)) {
      return NextResponse.json({ error: `重复: ${book.title}` }, { status: 400 });
    }

    books.push(book);
    saveBooks(books);

    return NextResponse.json(book);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
