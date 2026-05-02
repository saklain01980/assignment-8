"use client";

import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Navbar() {
  const { data: session, isPending } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out successfully!");
    router.push("/");
    router.refresh();
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/all-books", label: "All Books" },
    { href: "/my-profile", label: "My Profile" },
  ];

  return (
    <nav className="glass sticky top-0 z-50 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group" id="nav-logo">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-amber-400 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:shadow-indigo-500/30 transition-shadow">
              B
            </div>
            <span className="text-xl font-bold gradient-text hidden sm:block">
              BookNest
            </span>
          </Link>

          {/* Center Navigation - Desktop */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                id={`nav-${link.label.toLowerCase().replace(" ", "-")}`}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Section - Auth */}
          <div className="hidden md:flex items-center gap-3">
            {isPending ? (
              <div className="w-24 h-9 skeleton-shimmer rounded-lg" />
            ) : session?.user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-indigo-300 font-medium">
                  {session.user.name}
                </span>
                <button
                  onClick={handleLogout}
                  id="nav-logout-btn"
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-white/5 text-slate-300 hover:bg-red-500/20 hover:text-red-400 border border-white/10 hover:border-red-500/30 transition-all duration-200 cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                id="nav-login-btn"
                className="btn-primary-glow text-sm !py-2 !px-5"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            id="mobile-menu-btn"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 pt-2 border-t border-white/5 mt-2 animate-fade-in-up">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-white/5 mt-2 pt-2">
                {session?.user ? (
                  <>
                    <div className="px-4 py-2 text-sm text-indigo-300">{session.user.name}</div>
                    <button
                      onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                      className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-lg text-sm font-medium text-indigo-400 hover:bg-indigo-500/10 transition-all"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
