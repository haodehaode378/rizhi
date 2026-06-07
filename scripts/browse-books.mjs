import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";

const SITES = [
  {
    name: "standardebooks",
    url: "https://standardebooks.org/ebooks/?sort=newest&view=grid&per-page=12",
    label: "Standard Ebooks - 最新公共领域经典",
  },
  {
    name: "gutenberg-popular",
    url: "https://www.gutenberg.org/browse/scores/top",
    label: "Project Gutenberg - 热门排行",
  },
  {
    name: "manybooks-trending",
    url: "https://manybooks.net/categories",
    label: "ManyBooks - 分类浏览",
  },
  {
    name: "planet-ebook",
    url: "https://www.planetebook.com/free-ebooks/",
    label: "Planet eBook - 经典文学",
  },
  {
    name: "openlibrary-trending",
    url: "https://openlibrary.org/trending/daily",
    label: "Open Library - 每日热门",
  },
];

const outDir = join(process.cwd(), "scripts", "screenshots");
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  locale: "en-US",
});

const results = [];

for (const site of SITES) {
  console.log(`\n>>> Visiting: ${site.label}`);
  console.log(`    URL: ${site.url}`);
  const page = await context.newPage();
  try {
    await page.goto(site.url, { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(3000);

    const screenshotPath = join(outDir, `${site.name}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log(`    Screenshot: ${screenshotPath}`);

    const title = await page.title();
    results.push({ ...site, pageTitle: title, screenshot: screenshotPath });
  } catch (err) {
    console.log(`    ERROR: ${err.message}`);
    results.push({ ...site, error: err.message });
  } finally {
    await page.close();
  }
}

await browser.close();

writeFileSync(
  join(outDir, "results.json"),
  JSON.stringify(results, null, 2)
);
console.log("\nDone! Results saved to scripts/screenshots/results.json");
