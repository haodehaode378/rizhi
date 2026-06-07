export function Header() {
  return (
    <header className="border-b border-gray-800/50 backdrop-blur-sm sticky top-0 z-50 bg-[#0a0a0a]/80">
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3">
          <span className="text-2xl">📖</span>
          <h1 className="text-xl font-bold text-white tracking-tight">
            日知
          </h1>
        </a>
        <nav className="text-sm text-gray-400">
          日知一书，日进一步
        </nav>
      </div>
    </header>
  );
}
