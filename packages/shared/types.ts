export interface Book {
  slug: string;
  title: string;
  author: string;
  cover: string;
  rating: number;
  genre: string;
  tags: string[];
  difficulty: "easy" | "medium" | "hard";
  readingTime: string;
  targetAudience: string;
  oneLiner: string;
  summary: string;
  review: string;
  quote: string;
  date: string;
}
