import { books } from "@daily-book/shared";

export async function GET() {
  const base = process.env.SITE_URL || "https://rizhi.dev";
  const sorted = [...books].sort((a, b) => b.date.localeCompare(a.date));

  const items = sorted
    .map(
      (b) => `
    <item>
      <title><![CDATA[${b.title}]]></title>
      <link>${base}/book/${b.slug}</link>
      <guid isPermaLink="true">${base}/book/${b.slug}</guid>
      <pubDate>${new Date(b.date + "T00:00:00+08:00").toUTCString()}</pubDate>
      <description><![CDATA[${b.oneLiner || b.summary}]]></description>
      <category>${b.genre}</category>
    </item>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>日知 — 日知一书，日进一步</title>
    <link>${base}</link>
    <description>每天 AI 精选一本值得阅读的好书</description>
    <language>zh-cn</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${base}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
