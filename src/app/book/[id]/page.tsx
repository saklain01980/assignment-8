"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";

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

export default function BookDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [borrowing, setBorrowing] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    if (!session?.user && !loading) {
      toast.error("Please login to view book details");
      router.push("/login");
      return;
    }
  }, [session, loading, router]);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(`/api/books/${id}`);
        if (res.ok) {
          const data = await res.json();
          setBook(data);
        }
      } catch (error) {
        console.error("Failed to fetch book:", error);
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
          prev
            ? { ...prev, available_quantity: data.availableQuantity }
            : prev
        );
      } else {
        toast.error(data.error || "Failed to borrow book");
      }
    } catch (error) {
      console.error("Borrow error:", error);
      toast.error("Something went wrong");
    } finally {
      setBorrowing(false);
    }
  };

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
          <h2 className="text-2xl font-bold text-white mb-4">Book Not Found</h2>
          <button onClick={() => router.push("/all-books")} className="btn-primary-glow cursor-pointer">
            Back to All Books
          </button>
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
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors cursor-pointer"
          id="back-btn"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Book Cover */}
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

          {/* Book Details */}
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
                  <p className={`text-2xl font-bold ${book.available_quantity > 0 ? "text-green-400" : "text-red-400"}`} id="book-quantity">
                    {book.available_quantity > 0
                      ? `${book.available_quantity} copies left`
                      : "Out of stock"}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${book.available_quantity > 0 ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
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
              className={`w-full py-4 rounded-xl text-lg font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                book.available_quantity > 0
                  ? "btn-primary-glow !w-full"
                  : "bg-slate-700/50 text-slate-500 cursor-not-allowed"
              }`}
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
