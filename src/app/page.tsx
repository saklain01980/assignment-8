"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import BookCard from "@/components/BookCard";
import Marquee from "@/components/Marquee";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";

interface Book {
  _id: string;
  bookId: string;
  title: string;
  author: string;
  description: string;
  category: string;
  available_quantity: number;
  image_url: string;
}

export default function HomePage() {
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        // Try to seed database first
        await fetch("/api/seed");
        // Fetch top 4 books
        const res = await fetch("/api/books?limit=4");
        const data = await res.json();
        setFeaturedBooks(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch books:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  return (
    <div>
      {/* ── Hero Banner ── */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden" id="hero-banner">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 py-20">
          <div className="animate__animated animate__fadeInDown">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-6">
              📚 Welcome to BookNest
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-6 leading-tight animate__animated animate__fadeInUp">
            Find Your Next{" "}
            <span className="gradient-text">Read</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto animate__animated animate__fadeInUp animate__delay-1s">
            Explore a vast collection of books, borrow your favorites, and embark
            on unforgettable literary journeys — all from the comfort of your home.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate__animated animate__fadeInUp animate__delay-1s">
            <Link
              href="/all-books"
              id="hero-browse-btn"
              className="btn-primary-glow text-lg !px-8 !py-3.5 flex items-center gap-2"
            >
              Browse Now
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <a
              href="#how-it-works"
              className="px-8 py-3.5 rounded-xl text-slate-300 border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all duration-200 text-lg"
            >
              Learn More
            </a>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto animate__animated animate__fadeIn animate__delay-2s">
            {[
              { value: "500+", label: "Books" },
              { value: "1.2K", label: "Readers" },
              { value: "3", label: "Categories" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Marquee ── */}
      <Marquee />

      {/* ── Featured Books ── */}
      <section className="py-20 px-4" id="featured-books">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-3">
                Featured Books
              </h2>
              <p className="text-slate-400">
                Handpicked titles from our collection
              </p>
            </div>
            <Link
              href="/all-books"
              className="hidden sm:flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
            >
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="glass-card overflow-hidden">
                  <div className="h-56 skeleton-shimmer" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 skeleton-shimmer w-3/4" />
                    <div className="h-4 skeleton-shimmer w-1/2" />
                    <div className="h-9 skeleton-shimmer w-28 mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredBooks.map((book) => (
                <BookCard
                  key={book._id}
                  bookId={book.bookId}
                  title={book.title}
                  author={book.author}
                  image_url={book.image_url}
                  category={book.category}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── How It Works ── */}
      <HowItWorks />

      {/* ── Testimonials ── */}
      <Testimonials />
    </div>
  );
}
