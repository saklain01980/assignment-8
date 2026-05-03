"use client";

export default function Marquee() {
  const items = [
    "📚 New Arrivals: The Shadow of the Wind",
    "⭐ Special Discount on Memberships",
    "🎉 Free Reading Week: May 1-7",
    "📖 New Arrivals: Clean Code",
    "🏆 Best Seller: A Brief History of Time",
    "💡 Join our Book Club Today",
    "📚 New Arrivals: The Great Gatsby",
    "🔥 Trending: Sapiens by Yuval Noah Harari",
  ];

  const marqueeContent = items.join("  ·  ");

  return (
    <div className="relative overflow-hidden py-3 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-amber-600/20 border-y border-white/5">
      <div className="flex whitespace-nowrap animate-marquee">
        <span className="text-sm text-slate-300 font-medium px-4">
          {marqueeContent}
        </span>
        <span className="text-sm text-slate-300 font-medium px-4">
          {marqueeContent}
        </span>
      </div>
    </div>
  );
}
