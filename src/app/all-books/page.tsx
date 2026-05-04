"use client";

import { useState, useEffect, useCallback } from "react";
import BookCard from "@/components/BookCard";
import CategorySidebar from "@/components/CategorySidebar";

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

const categories = ["All", "Story", "Tech", "Science"];

export default function AllBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (activeCategory !== "All") params.set("category", activeCategory);

      const res = await fetch(`/api/books?${params.toString()}`);
      const data = await res.json();
      setBooks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch books:", error);
    } finally {
      setLoading(false);
    }
  }, [search, activeCategory]);

  useEffect(() => {
    const debounce = setTimeout(fetchBooks, 300);
    return () => clearTimeout(debounce);
  }, [fetchBooks]);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-black text-white mb-4">
            All <span className="gradient-text">Books</span>
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto">
            Explore our complete collection. Search by title or filter by category.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search books by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input !pl-12 !py-4 text-lg"
              id="search-books-input"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <CategorySidebar
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          {/* Books Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
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
            ) : books.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No books found</h3>
                <p className="text-slate-400">Try adjusting your search or category filter</p>
              </div>
            ) : (
              <>
                <p className="text-slate-500 text-sm mb-4">
                  Showing {books.length} book{books.length !== 1 && "s"}
                  {activeCategory !== "All" && ` in ${activeCategory}`}
                  {search && ` matching "${search}"`}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {books.map((book) => (
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
