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

// GET /api/books/:slug
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const books = loadBooks();
  const book = books.find((b: { slug: string }) => b.slug === slug);

  if (!book) {
    return NextResponse.json({ error: "未找到" }, { status: 404 });
  }

  return NextResponse.json(book);
}

// PUT /api/books/:slug
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const body = await req.json();
  const books = loadBooks();
  const idx = books.findIndex((b: { slug: string }) => b.slug === slug);

  if (idx === -1) {
    return NextResponse.json({ error: "未找到" }, { status: 404 });
  }

  books[idx] = { ...books[idx], ...body, slug };
  saveBooks(books);

  return NextResponse.json(books[idx]);
}

// DELETE /api/books/:slug
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const books = loadBooks();
  const filtered = books.filter((b: { slug: string }) => b.slug !== slug);

  if (filtered.length === books.length) {
    return NextResponse.json({ error: "未找到" }, { status: 404 });
  }

  saveBooks(filtered);

  return NextResponse.json({ ok: true });
}
