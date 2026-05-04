"use client";

interface CategorySidebarProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategorySidebar({
  categories,
  activeCategory,
  onCategoryChange,
}: CategorySidebarProps) {
  const categoryIcons: Record<string, string> = {
    All: "📚",
    Story: "📖",
    Tech: "💻",
    Science: "🔬",
  };

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="glass-card p-5 sticky top-24">
        <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Categories
        </h3>
        <div className="flex flex-row lg:flex-col gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              id={`category-btn-${cat.toLowerCase()}`}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer w-full text-left ${
                activeCategory === cat
                  ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-lg shadow-indigo-500/10"
                  : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <span>{categoryIcons[cat] || "📁"}</span>
              {cat}
              {activeCategory === cat && (
                <span className="ml-auto w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              )}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
