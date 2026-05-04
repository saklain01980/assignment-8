"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";

interface BorrowRecord {
  _id: string;
  bookId: string;
  bookTitle: string;
  borrowDate: string;
  status: string;
}

export default function MyProfilePage() {
  const { data: session, isPending } = useSession();
  const [borrows, setBorrows] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session?.user) {
      toast.error("Please login to view your profile");
      router.push("/login");
      return;
    }

    const fetchBorrows = async () => {
      if (!session?.user?.id) return;
      try {
        const res = await fetch(`/api/books/borrow?userId=${session.user.id}`);
        if (res.ok) {
          const data = await res.json();
          setBorrows(data);
        }
      } catch (error) {
        console.error("Failed to fetch borrow history:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchBorrows();
    }
  }, [session, isPending, router]);

  if (isPending || (loading && session?.user)) {
    return (
      <div className="min-h-screen py-12 px-4 flex justify-center">
        <div className="max-w-4xl w-full">
          <div className="glass-card p-8 mb-8 flex items-center gap-6">
            <div className="w-24 h-24 rounded-full skeleton-shimmer" />
            <div className="space-y-4 flex-1">
              <div className="h-8 skeleton-shimmer w-1/3" />
              <div className="h-4 skeleton-shimmer w-1/4" />
            </div>
          </div>
          <div className="h-64 skeleton-shimmer rounded-xl" />
        </div>
      </div>
    );
  }

  if (!session?.user) return null;

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8" id="profile-title">
          My Profile
        </h1>

        {/* Profile Card */}
        <div className="glass-card p-8 mb-10 flex flex-col sm:flex-row items-center gap-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10" />
          
          <div className="relative z-10 shrink-0">
            {session.user.image ? (
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-500/30">
                <Image
                  src={session.user.image}
                  alt={session.user.name}
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                />
              </div>
            ) : (
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold border-4 border-indigo-500/30">
                {session.user.name.charAt(0)}
              </div>
            )}
          </div>

          <div className="relative z-10 flex-1 text-center sm:text-left">
            <h2 className="text-3xl font-bold text-white mb-2" id="profile-name">
              {session.user.name}
            </h2>
            <p className="text-slate-400 mb-6 flex items-center justify-center sm:justify-start gap-2" id="profile-email">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {session.user.email}
            </p>
            <Link
              href="/my-profile/update"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 font-medium border border-indigo-500/20 hover:bg-indigo-500/20 transition-all cursor-pointer"
            >
              Update Information
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Borrow History */}
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          My Borrowed Books
        </h3>
        
        <div className="glass-card overflow-hidden">
          {borrows.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <p className="text-slate-400 mb-4">You haven&apos;t borrowed any books yet.</p>
              <Link href="/all-books" className="text-indigo-400 hover:text-indigo-300 font-medium">
                Browse Books
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/5">
                    <th className="px-6 py-4 text-sm font-semibold text-slate-300">Book Title</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-300">Borrow Date</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-300">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {borrows.map((borrow) => (
                    <tr key={borrow._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <Link href={`/book/${borrow.bookId}`} className="text-white font-medium hover:text-indigo-400 transition-colors">
                          {borrow.bookTitle}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-sm">
                        {new Date(borrow.borrowDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                          {borrow.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
