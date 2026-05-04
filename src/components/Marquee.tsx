"use client";

const items = [
  { title: "The Shadow of the Wind", category: "Story" },
  { title: "Clean Code", category: "Tech" },
  { title: "A Brief History of Time", category: "Science" },
  { title: "The Great Gatsby", category: "Story" },
  { title: "The Pragmatic Programmer", category: "Tech" },
  { title: "Cosmos", category: "Science" },
  { title: "1984", category: "Story" },
  { title: "Design Patterns", category: "Tech" },
  { title: "The Gene: An Intimate History", category: "Science" },
  { title: "To Kill a Mockingbird", category: "Story" },
  { title: "You Don't Know JS", category: "Tech" },
  { title: "Sapiens: A Brief History of Humankind", category: "Science" },
];

const categoryColors: Record<string, string> = {
  Story: "text-amber-400",
  Tech: "text-indigo-400",
  Science: "text-emerald-400",
};

export default function Marquee() {
  const marqueeItems = items.map(
    (item) => `📚 New Arrivals: ${item.title} | ${item.category}`
  );
  const content = marqueeItems.join("  ·  ");

  return (
    <div className="relative overflow-hidden py-3 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-amber-600/20 border-y border-white/5">
      <div className="flex whitespace-nowrap animate-marquee">
        {/* First copy */}
        <span className="flex items-center gap-0 shrink-0">
          {items.map((item, i) => (
            <span key={`a-${i}`} className="text-sm font-medium px-4 flex items-center gap-2">
              <span className="text-slate-300">📚 New Arrivals:</span>
              <span className="text-white font-semibold">{item.title}</span>
              <span className="text-slate-500">|</span>
              <span className={`font-medium ${categoryColors[item.category] || "text-slate-400"}`}>
                {item.category}
              </span>
              <span className="text-slate-600 mx-2">·</span>
            </span>
          ))}
        </span>
        {/* Duplicate for seamless loop */}
        <span className="flex items-center gap-0 shrink-0" aria-hidden="true">
          {items.map((item, i) => (
            <span key={`b-${i}`} className="text-sm font-medium px-4 flex items-center gap-2">
              <span className="text-slate-300">📚 New Arrivals:</span>
              <span className="text-white font-semibold">{item.title}</span>
              <span className="text-slate-500">|</span>
              <span className={`font-medium ${categoryColors[item.category] || "text-slate-400"}`}>
                {item.category}
              </span>
              <span className="text-slate-600 mx-2">·</span>
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}
