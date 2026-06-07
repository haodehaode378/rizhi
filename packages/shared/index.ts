import type { Book } from "./types";
import booksData from "./data/books.json";

export type { Book };

export const books: Book[] = booksData as Book[];

export function getBookBySlug(slug: string): Book | undefined {
  return books.find((b) => b.slug === slug);
}

export function getBookByDate(date: string): Book | undefined {
  return books.find((b) => b.date === date);
}

export function getLatestBook(): Book {
  return books.reduce((latest, b) =>
    b.date > latest.date ? b : latest
  );
}
