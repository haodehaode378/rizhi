import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "每日一本好书",
  description: "每天推荐一本值得阅读的好书",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
