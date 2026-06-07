import "./globals.css";

export const metadata = {
  title: "日知 CMS",
  description: "日知 — 管理后台",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
