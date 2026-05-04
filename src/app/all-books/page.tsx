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

// Static fallback data
const ALL_BOOKS: Book[] = [
  { _id: "1", bookId: "1", title: "The Shadow of the Wind", author: "Carlos Ruiz Zafón", description: "A young boy discovers a mysterious book.", category: "Story", available_quantity: 5, image_url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop" },
  { _id: "2", bookId: "2", title: "Clean Code", author: "Robert C. Martin", description: "A handbook of agile software craftsmanship.", category: "Tech", available_quantity: 3, image_url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=600&fit=crop" },
  { _id: "3", bookId: "3", title: "A Brief History of Time", author: "Stephen Hawking", description: "An exploration of the universe's most profound mysteries.", category: "Science", available_quantity: 7, image_url: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=600&fit=crop" },
  { _id: "4", bookId: "4", title: "The Great Gatsby", author: "F. Scott Fitzgerald", description: "A classic novel exploring the American Dream.", category: "Story", available_quantity: 4, image_url: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop" },
  { _id: "5", bookId: "5", title: "The Pragmatic Programmer", author: "David Thomas & Andrew Hunt", description: "From journeyman to master.", category: "Tech", available_quantity: 6, image_url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=600&fit=crop" },
  { _id: "6", bookId: "6", title: "Cosmos", author: "Carl Sagan", description: "A journey through space and time.", category: "Science", available_quantity: 8, image_url: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=600&fit=crop" },
  { _id: "7", bookId: "7", title: "1984", author: "George Orwell", description: "A dystopian masterpiece.", category: "Story", available_quantity: 2, image_url: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=600&fit=crop" },
  { _id: "8", bookId: "8", title: "Design Patterns", author: "Gang of Four", description: "The definitive guide to reusable OO software design.", category: "Tech", available_quantity: 4, image_url: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=400&h=600&fit=crop" },
  { _id: "9", bookId: "9", title: "The Gene: An Intimate History", author: "Siddhartha Mukherjee", description: "A sweeping exploration of the science of genetics.", category: "Science", available_quantity: 5, image_url: "https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?w=400&h=600&fit=crop" },
  { _id: "10", bookId: "10", title: "To Kill a Mockingbird", author: "Harper Lee", description: "A story of racial injustice and moral growth.", category: "Story", available_quantity: 6, image_url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop" },
  { _id: "11", bookId: "11", title: "You Don't Know JS", author: "Kyle Simpson", description: "A deep dive into core JavaScript mechanisms.", category: "Tech", available_quantity: 9, image_url: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=600&fit=crop" },
  { _id: "12", bookId: "12", title: "Sapiens: A Brief History of Humankind", author: "Yuval Noah Harari", description: "A groundbreaking narrative of human history.", category: "Science", available_quantity: 3, image_url: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400&h=600&fit=crop" },
];

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
      const fetchedBooks = Array.isArray(data) ? data : [];

      if (fetchedBooks.length > 0) {
        setBooks(fetchedBooks);
      } else {
        // Fall back to static data with client-side filtering
        let filtered = ALL_BOOKS;
        if (activeCategory !== "All") {
          filtered = filtered.filter((b) => b.category === activeCategory);
        }
        if (search) {
          filtered = filtered.filter((b) =>
            b.title.toLowerCase().includes(search.toLowerCase())
          );
        }
        setBooks(filtered);
      }
    } catch {
      // Fallback to static data with client-side filtering
      let filtered = ALL_BOOKS;
      if (activeCategory !== "All") {
        filtered = filtered.filter((b) => b.category === activeCategory);
      }
      if (search) {
        filtered = filtered.filter((b) =>
          b.title.toLowerCase().includes(search.toLowerCase())
        );
      }
      setBooks(filtered);
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
