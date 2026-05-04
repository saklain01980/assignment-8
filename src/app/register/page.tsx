"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp, signIn } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !photoURL) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      const result = await signUp.email({
        email,
        password,
        name,
        image: photoURL,
      });

      if (result.error) {
        toast.error(result.error.message || "Registration failed");
      } else {
        toast.success("Registration successful! Please login.");
        router.push("/login");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Google login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="glass-card p-8 sm:p-10">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2" id="register-title">
              Create an Account
            </h1>
            <p className="text-slate-400 text-sm">
              Join BookNest to start borrowing books
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="search-input !py-2.5"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="search-input !py-2.5"
                required
              />
            </div>

            <div>
              <label htmlFor="photoURL" className="block text-sm font-medium text-slate-300 mb-1.5">
                Photo URL
              </label>
              <input
                type="url"
                id="photoURL"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="search-input !py-2.5"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="search-input !py-2.5"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              id="register-btn"
              className="btn-primary-glow w-full !py-3 mt-2 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-sm text-slate-500">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full py-3 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 hover:border-white/20 transition-all duration-200 flex items-center justify-center gap-3 text-sm font-medium cursor-pointer"
          >
            Continue with Google
          </button>

          <p className="text-center mt-6 text-sm text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors" id="login-link">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
