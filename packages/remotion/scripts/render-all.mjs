import { readFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..", "..");
const BOOKS_PATH = join(ROOT, "packages/shared/data/books.json");
const OUT_DIR = join(ROOT, "packages/remotion/out");

const books = JSON.parse(readFileSync(BOOKS_PATH, "utf8"));

const TEMPLATES = [
  { id: "BookCard", suffix: "card" },
  { id: "QuoteCard", suffix: "quote" },
];

const args = process.argv.slice(2);
const targetDate = args.find((a) => a.startsWith("--date="))?.split("=")[1];
const targetSlug = args.find((a) => a.startsWith("--slug="))?.split("=")[1];
const templateArg = args.find((a) => a.startsWith("--template="))?.split("=")[1];

const toRender = targetSlug
  ? books.filter((b) => b.slug === targetSlug)
  : targetDate
    ? books.filter((b) => b.date === targetDate)
    : books;

const templates = templateArg
  ? TEMPLATES.filter((t) => t.id === templateArg)
  : TEMPLATES;

if (toRender.length === 0) {
  console.log("No books to render.");
  process.exit(0);
}

console.log(`Rendering ${toRender.length} book(s) × ${templates.length} template(s)...`);

for (const book of toRender) {
  const dateDir = join(OUT_DIR, book.date);
  mkdirSync(dateDir, { recursive: true });

  for (const tpl of templates) {
    const outFile = join(dateDir, `${book.slug}-${tpl.suffix}.mp4`);
    console.log(`  ${tpl.id} → ${book.slug} → ${outFile}`);

    try {
      execSync(
        `npx remotion render src/index.ts ${tpl.id} ${outFile} --props=${JSON.stringify(JSON.stringify({ slug: book.slug }))}`,
        { cwd: join(ROOT, "packages/remotion"), stdio: "inherit" }
      );
      console.log(`  ✓ ${outFile}`);
    } catch (err) {
      console.error(`  ✗ Failed: ${err.message}`);
    }
  }
}

console.log("Done!");
