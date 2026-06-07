import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || "https://rizhi.dev"),
  title: {
    default: "日知 — 日知一书，日进一步",
    template: "%s | 日知",
  },
  description: "每天 AI 精选一本值得阅读的好书，附带深度书评和金句。日知一书，日进一步。",
  keywords: ["读书", "书评", "每日推荐", "好书推荐", "阅读", "AI选书", "书单"],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "日知",
    title: "日知 — 日知一书，日进一步",
    description: "每天 AI 精选一本值得阅读的好书",
  },
  twitter: {
    card: "summary_large_image",
    title: "日知 — 日知一书，日进一步",
    description: "每天 AI 精选一本值得阅读的好书",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="alternate" type="application/rss+xml" title="日知 RSS" href="/feed.xml" />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
