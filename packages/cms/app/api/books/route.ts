import { NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const BOOKS_PATH = join(process.cwd(), "../shared/data/books.json");

function loadBooks() {
  return JSON.parse(readFileSync(BOOKS_PATH, "utf8"));
}

function saveBooks(books: unknown[]) {
  writeFileSync(BOOKS_PATH, JSON.stringify(books, null, 2) + "\n", "utf8");
}

// GET /api/books
export async function GET() {
  const books = loadBooks();
  return NextResponse.json(books);
}

// POST /api/books
export async function POST(req: Request) {
  const body = await req.json();
  const books = loadBooks();

  // Check duplicate slug
  if (books.some((b: { slug: string }) => b.slug === body.slug)) {
    return NextResponse.json({ error: "slug 已存在" }, { status: 400 });
  }

  books.push(body);
  saveBooks(books);

  return NextResponse.json(body, { status: 201 });
}

// PUT /api/books — batch update
export async function PUT(req: Request) {
  const updated = await req.json();
  saveBooks(updated);
  return NextResponse.json({ ok: true });
}
