"use client";

import { useState } from "react";
import Link from "next/link";

export default function SettingsPage() {
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState("");

  async function handleGenerate() {
    setGenerating(true);
    setResult("");

    const res = await fetch("/api/generate", { method: "POST" });
    const data = await res.json();

    if (res.ok) {
      setResult(`成功：${data.title} (${data.author})`);
    } else {
      setResult(`失败：${data.error}`);
    }
    setGenerating(false);
  }

  return (
    <div className="min-h-screen p-8 max-w-3xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-white">设置</h1>
        <nav className="flex gap-4 text-sm mt-4">
          <Link href="/" className="text-gray-400 hover:text-white">仪表盘</Link>
          <Link href="/books" className="text-gray-400 hover:text-white">书籍管理</Link>
          <Link href="/settings" className="text-amber-400 hover:text-amber-300">设置</Link>
        </nav>
      </header>

      <div className="space-y-6">
        {/* Manual Generate */}
        <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-2">手动生成</h2>
          <p className="text-gray-500 text-sm mb-4">
            点击按钮，AI 将自动选择一本新书并生成推荐内容。
          </p>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-medium px-6 py-2.5 rounded-lg transition-colors text-sm"
          >
            {generating ? "生成中..." : "立即生成一本书"}
          </button>
          {result && (
            <p className={`mt-3 text-sm ${result.startsWith("成功") ? "text-emerald-400" : "text-red-400"}`}>
              {result}
            </p>
          )}
        </section>

        {/* Config Info */}
        <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-2">配置说明</h2>
          <div className="text-gray-400 text-sm space-y-2">
            <p>AI API 配置通过服务器 <code className="text-amber-400">.env</code> 文件管理：</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><code>AI_BASE_URL</code> — API 地址</li>
              <li><code>AI_API_KEY</code> — API 密钥</li>
              <li><code>AI_MODEL</code> — 模型名称</li>
              <li><code>CMS_PASSWORD</code> — 后台登录密码</li>
              <li><code>SITE_URL</code> — 网站地址</li>
            </ul>
            <p className="mt-3">定时任务通过 Docker cron 自动执行，每天 00:30 生成一本新书。</p>
          </div>
        </section>
      </div>
    </div>
  );
}
