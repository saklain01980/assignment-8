"use client";

import Image from "next/image";
import Link from "next/link";

interface BookCardProps {
  bookId: string;
  title: string;
  author: string;
  image_url: string;
  category?: string;
}

export default function BookCard({ bookId, title, author, image_url, category }: BookCardProps) {
  return (
    <div className="glass-card overflow-hidden group" id={`book-card-${bookId}`}>
      <div className="relative h-56 overflow-hidden">
        <Image
          src={image_url}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        {category && (
          <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/80 text-white backdrop-blur-sm">
            {category}
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-white mb-1 line-clamp-1 group-hover:text-indigo-300 transition-colors">
          {title}
        </h3>
        <p className="text-slate-400 text-sm mb-4">by {author}</p>
        <Link
          href={`/book/${bookId}`}
          id={`view-details-${bookId}`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500/10 text-indigo-400 text-sm font-medium border border-indigo-500/20 hover:bg-indigo-500/20 hover:border-indigo-500/40 transition-all duration-200"
        >
          View Details
          <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
