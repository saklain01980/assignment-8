"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";
import Link from "next/link";

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

// Fallback static book data
const STATIC_BOOKS: Record<string, Book> = {
  "1": { _id: "1", bookId: "1", title: "The Shadow of the Wind", author: "Carlos Ruiz Zafón", description: "A young boy discovers a mysterious book that leads him into a labyrinth of intrigue and secrets in post-war Barcelona. A gripping tale of love, loss, and the power of literature.", category: "Story", available_quantity: 5, image_url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop" },
  "2": { _id: "2", bookId: "2", title: "Clean Code", author: "Robert C. Martin", description: "A handbook of agile software craftsmanship that teaches developers how to write code that is clean, maintainable, and efficient. A must-read for every programmer.", category: "Tech", available_quantity: 3, image_url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=600&fit=crop" },
  "3": { _id: "3", bookId: "3", title: "A Brief History of Time", author: "Stephen Hawking", description: "An exploration of the universe's most profound mysteries, from black holes to the Big Bang. Hawking makes complex physics accessible and fascinating for all readers.", category: "Science", available_quantity: 7, image_url: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=600&fit=crop" },
  "4": { _id: "4", bookId: "4", title: "The Great Gatsby", author: "F. Scott Fitzgerald", description: "Set in the Jazz Age, this classic novel explores themes of wealth, idealism, and the American Dream through the eyes of the enigmatic Jay Gatsby.", category: "Story", available_quantity: 4, image_url: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop" },
  "5": { _id: "5", bookId: "5", title: "The Pragmatic Programmer", author: "David Thomas & Andrew Hunt", description: "From journeyman to master — this book examines the core processes of software development and offers practical advice for becoming a better programmer.", category: "Tech", available_quantity: 6, image_url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=600&fit=crop" },
  "6": { _id: "6", bookId: "6", title: "Cosmos", author: "Carl Sagan", description: "A journey through space and time that explores the evolution of the universe, the origins of life, and humanity's place among the stars.", category: "Science", available_quantity: 8, image_url: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=600&fit=crop" },
  "7": { _id: "7", bookId: "7", title: "1984", author: "George Orwell", description: "A dystopian masterpiece set in a totalitarian society where Big Brother watches everything. A chilling warning about the dangers of government overreach.", category: "Story", available_quantity: 2, image_url: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=600&fit=crop" },
  "8": { _id: "8", bookId: "8", title: "Design Patterns", author: "Gang of Four", description: "The definitive guide to reusable object-oriented software design patterns. Essential reading for software architects and senior developers.", category: "Tech", available_quantity: 4, image_url: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=400&h=600&fit=crop" },
  "9": { _id: "9", bookId: "9", title: "The Gene: An Intimate History", author: "Siddhartha Mukherjee", description: "A sweeping exploration of the science of genetics, from Mendel's garden to CRISPR technology. A story of discovery, power, and the future of humanity.", category: "Science", available_quantity: 5, image_url: "https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?w=400&h=600&fit=crop" },
  "10": { _id: "10", bookId: "10", title: "To Kill a Mockingbird", author: "Harper Lee", description: "A powerful story of racial injustice and moral growth in the American South, told through the innocent eyes of young Scout Finch.", category: "Story", available_quantity: 6, image_url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop" },
  "11": { _id: "11", bookId: "11", title: "You Don't Know JS", author: "Kyle Simpson", description: "A deep dive into the core mechanisms of JavaScript. This series challenges assumptions and helps developers truly understand the language they use daily.", category: "Tech", available_quantity: 9, image_url: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=600&fit=crop" },
  "12": { _id: "12", bookId: "12", title: "Sapiens: A Brief History of Humankind", author: "Yuval Noah Harari", description: "A groundbreaking narrative of human history, from the emergence of Homo sapiens in Africa to the revolutions that shaped our modern world.", category: "Science", available_quantity: 3, image_url: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400&h=600&fit=crop" },
};

export default function BookDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [borrowing, setBorrowing] = useState(false);
  const { data: session, isPending } = useSession();
  const router = useRouter();

  // Redirect unauthenticated users
  useEffect(() => {
    if (!isPending && !session?.user) {
      toast.error("Please login to view book details");
      router.push("/login");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (!id) return;
    const fetchBook = async () => {
      try {
        const res = await fetch(`/api/books/${id}`);
        if (res.ok) {
          const data = await res.json();
          setBook(data);
        } else {
          // Fallback to static data
          setBook(STATIC_BOOKS[id] || null);
        }
      } catch {
        // Fallback to static data
        setBook(STATIC_BOOKS[id] || null);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleBorrow = async () => {
    if (!session?.user) {
      toast.error("Please login to borrow books");
      router.push("/login");
      return;
    }

    if (!book || book.available_quantity <= 0) {
      toast.error("This book is not available for borrowing");
      return;
    }

    setBorrowing(true);
    try {
      const res = await fetch("/api/books/borrow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.id,
          userName: session.user.name,
          userEmail: session.user.email,
          bookId: book.bookId,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Book borrowed successfully! 📚");
        setBook((prev) =>
          prev ? { ...prev, available_quantity: data.availableQuantity } : prev
        );
      } else {
        toast.error(data.error || "Failed to borrow book");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setBorrowing(false);
    }
  };

  // Show spinner while auth is loading
  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!session?.user) return null;

  if (loading) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="h-[500px] skeleton-shimmer rounded-2xl" />
            <div className="space-y-6">
              <div className="h-10 skeleton-shimmer w-3/4" />
              <div className="h-6 skeleton-shimmer w-1/2" />
              <div className="h-32 skeleton-shimmer" />
              <div className="h-12 skeleton-shimmer w-48" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Book Not Found</h2>
          <Link href="/all-books" className="btn-primary-glow cursor-pointer">
            Back to All Books
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors cursor-pointer group"
          id="back-btn"
        >
          <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Book Cover — left side */}
          <div className="relative">
            <div className="relative h-[500px] rounded-2xl overflow-hidden glass-card group">
              <Image
                src={book.image_url}
                alt={book.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
            {/* Category Badge */}
            <span className="absolute top-4 right-4 px-4 py-2 rounded-full text-sm font-semibold bg-indigo-500/80 text-white backdrop-blur-sm">
              {book.category}
            </span>
          </div>

          {/* Book Details — right side */}
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl font-black text-white mb-3" id="book-title">
              {book.title}
            </h1>
            <p className="text-lg text-indigo-400 font-medium mb-6" id="book-author">
              by {book.author}
            </p>

            <div className="glass-card p-6 mb-6">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Description
              </h3>
              <p className="text-slate-300 leading-relaxed" id="book-description">
                {book.description}
              </p>
            </div>

            {/* Availability */}
            <div className="glass-card p-6 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Availability
                  </h3>
                  <p
                    className={`text-2xl font-bold ${book.available_quantity > 0 ? "text-green-400" : "text-red-400"}`}
                    id="book-quantity"
                  >
                    {book.available_quantity > 0
                      ? `${book.available_quantity} copies left`
                      : "Out of stock"}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    book.available_quantity > 0
                      ? "bg-green-500/10 text-green-400"
                      : "bg-red-500/10 text-red-400"
                  }`}
                >
                  {book.available_quantity > 0 ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
              </div>
            </div>

            {/* Borrow Button */}
            <button
              onClick={handleBorrow}
              disabled={borrowing || book.available_quantity <= 0}
              id="borrow-btn"
              className={`w-full py-4 rounded-xl text-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                book.available_quantity > 0
                  ? "btn-primary-glow !w-full cursor-pointer"
                  : "bg-slate-700/50 text-slate-500 cursor-not-allowed"
              } disabled:opacity-60`}
            >
              {borrowing ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Borrowing...
                </>
              ) : book.available_quantity > 0 ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Borrow This Book
                </>
              ) : (
                "Not Available"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
