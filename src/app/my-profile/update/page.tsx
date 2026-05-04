"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function UpdateProfilePage() {
  const { data: session, isPending } = useSession();
  const [name, setName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session?.user) {
      toast.error("Please login to update your profile");
      router.push("/login");
      return;
    }

    if (session?.user) {
      setName(session.user.name);
      setPhotoURL(session.user.image || "");
    }
  }, [session, isPending, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !photoURL) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const result = await authClient.updateUser({
        name: name,
        image: photoURL,
      });

      if (result.error) {
        toast.error(result.error.message || "Failed to update profile");
      } else {
        toast.success("Profile updated successfully!");
        router.push("/my-profile");
        router.refresh();
      }
    } catch (error) {
      console.error("Update profile error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!session?.user) return null;

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Profile
        </button>

        <div className="glass-card p-8 sm:p-10">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2" id="update-profile-title">
              Update Information
            </h1>
            <p className="text-slate-400 text-sm">
              Change your profile name and photo
            </p>
          </div>

          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="search-input"
                required
              />
            </div>

            <div>
              <label htmlFor="photoURL" className="block text-sm font-medium text-slate-300 mb-2">
                Photo URL
              </label>
              <input
                type="url"
                id="photoURL"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="search-input"
                required
              />
              {photoURL && (
                <div className="mt-4 flex justify-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-indigo-500/30">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photoURL}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(name);
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              id="update-btn"
              className="btn-primary-glow w-full !py-3 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Information"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
