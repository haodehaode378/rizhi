import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const BOOKS_PATH = join(ROOT, "packages/shared/data/books.json");

// ─── Load .env ───────────────────────────────────────────────────
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
  } catch {
    // .env is optional, env vars may be set externally
  }
}

loadEnv();

const BASE_URL = process.env.AI_BASE_URL;
const API_KEY = process.env.AI_API_KEY;
const MODEL = process.env.AI_MODEL || "mimo-v2.5-pro";
const MAX_TOKENS = parseInt(process.env.AI_MAX_TOKENS || "4096", 10);
const TEMPERATURE = parseFloat(process.env.AI_TEMPERATURE || "0.9");

if (!BASE_URL || !API_KEY) {
  console.error("Missing AI_BASE_URL or AI_API_KEY. Check .env file.");
  process.exit(1);
}

// ─── Load existing books ─────────────────────────────────────────
function loadBooks() {
  try {
    return JSON.parse(readFileSync(BOOKS_PATH, "utf8"));
  } catch {
    return [];
  }
}

function saveBooks(books) {
  writeFileSync(BOOKS_PATH, JSON.stringify(books, null, 2) + "\n", "utf8");
}

// ─── Build prompt ────────────────────────────────────────────────
function buildPrompt(existingBooks) {
  const today = new Date().toISOString().slice(0, 10);
  const existingList = existingBooks
    .map((b) => `- ${b.title} (${b.author})`)
    .join("\n");

  return `你是「日知」的选书官，每天为读者精选一本值得阅读的好书。日知一书，日进一步。

## 要求

1. 从人类经典著作中选一本好书推荐
2. 品类不限：文学、历史、科技、哲学、心理学、商业、艺术、社会学等都可以
3. 中文或英文书籍均可，但书评和摘要用中文写
4. 避免推荐以下已推荐过的书：

${existingList || "（暂无已推荐书籍）"}

## 今日日期

${today}

## 输出格式

严格按以下 JSON 格式输出，不要有任何其他文字：

{
  "slug": "英文短横线格式的书名slug",
  "title": "中文书名",
  "author": "作者名",
  "cover": "豆瓣或公开可用的封面图片URL，如果找不到就写空字符串",
  "rating": 4.5,
  "genre": "分类（如：文学、历史、科技、哲学、心理学、商业、艺术、社会学、自我提升、效率等）",
  "tags": ["标签1", "标签2", "标签3", "标签4"],
  "difficulty": "easy或medium或hard",
  "readingTime": "预计阅读时间，如：4-5小时",
  "targetAudience": "这本书适合谁读，一句话说明",
  "oneLiner": "一句话推荐，15字以内，有记忆点",
  "summary": "一句话概括这本书讲什么，20-40字",
  "review": "100-200字的书评，要有观点、有温度、能引发阅读欲望，不要写成干巴巴的简介",
  "quote": "书中最有力量的一句话（中文）",
  "date": "${today}"
}

注意：
- rating 是 1-5 的数字，支持 0.5 步长
- slug 只能用小写英文和短横线
- cover 尽量找真实可用的图片 URL，找不到就留空字符串
- tags 是 3-5 个中文标签，描述书籍的核心主题
- difficulty: easy=通俗易懂，medium=需要一定基础，hard=有阅读门槛
- readingTime: 根据书籍篇幅和难度估算
- targetAudience: 具体描述适合什么人读
- oneLiner: 要有记忆点，像广告语
- 书评要有个人视角，像一个真人在推荐，不要像百科词条
- 只输出 JSON，不要有其他任何文字`;
}

// ─── Call AI API ─────────────────────────────────────────────────
async function callAI(prompt) {
  const url = `${BASE_URL.replace(/\/$/, "")}/chat/completions`;

  console.log(`Calling ${MODEL} at ${BASE_URL}...`);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      max_tokens: MAX_TOKENS,
      temperature: TEMPERATURE,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}

// ─── Parse & validate ────────────────────────────────────────────
function parseBookResponse(raw) {
  // Try to extract JSON from the response (may have markdown code blocks)
  let jsonStr = raw.trim();

  // Strip markdown code block if present
  const codeBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    jsonStr = codeBlockMatch[1].trim();
  }

  // Try to find JSON object
  const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("No JSON object found in response");
  }

  const book = JSON.parse(jsonMatch[0]);

  // Validate required fields
  const required = ["slug", "title", "author", "genre", "summary", "review", "quote", "date"];
  for (const field of required) {
    if (!book[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  // Ensure defaults
  book.cover = book.cover || "";
  book.rating = Math.min(5, Math.max(1, Number(book.rating) || 4));
  book.slug = book.slug.toLowerCase().replace(/[^a-z0-9-]/g, "-");
  book.tags = Array.isArray(book.tags) ? book.tags : [];
  book.difficulty = ["easy", "medium", "hard"].includes(book.difficulty) ? book.difficulty : "medium";
  book.readingTime = book.readingTime || "未知";
  book.targetAudience = book.targetAudience || "所有读者";
  book.oneLiner = book.oneLiner || book.summary;

  return book;
}

// ─── Main ────────────────────────────────────────────────────────
async function main() {
  const existingBooks = loadBooks();
  console.log(`Existing books: ${existingBooks.length}`);

  const prompt = buildPrompt(existingBooks);

  let raw;
  try {
    raw = await callAI(prompt);
  } catch (err) {
    console.error("AI API call failed:", err.message);
    process.exit(1);
  }

  console.log("\n--- Raw AI response ---");
  console.log(raw);
  console.log("--- End ---\n");

  let book;
  try {
    book = parseBookResponse(raw);
  } catch (err) {
    console.error("Failed to parse AI response:", err.message);
    process.exit(1);
  }

  // Check for duplicate slug
  if (existingBooks.some((b) => b.slug === book.slug)) {
    console.error(`Duplicate slug "${book.slug}" — book may already exist.`);
    process.exit(1);
  }

  // Check for duplicate title
  if (existingBooks.some((b) => b.title === book.title)) {
    console.error(`Duplicate title "${book.title}" — book may already exist.`);
    process.exit(1);
  }

  // Append and save
  existingBooks.push(book);
  saveBooks(existingBooks);

  console.log(`Added: ${book.title} (${book.author}) — ${book.genre}`);
  console.log(`Rating: ${book.rating}/5`);
  console.log(`Date: ${book.date}`);
  console.log(`Total books: ${existingBooks.length}`);
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
