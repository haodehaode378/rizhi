"use client";

import { useState } from "react";

export function ShareButton({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const fullUrl = url.startsWith("http") ? url : `${window.location.origin}${url}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: `${title} — 日知`, url: fullUrl });
        return;
      } catch {}
    }

    await navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleShare}
      className="text-sm text-gray-400 hover:text-amber-400 transition-colors border border-gray-800 hover:border-amber-500/30 px-4 py-2 rounded-lg"
    >
      {copied ? "已复制链接" : "分享"}
    </button>
  );
}
