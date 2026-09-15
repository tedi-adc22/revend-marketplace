"use client";
import Link from "next/link";
import { signOutAction } from "@/lib/actions/users";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import toast from "react-hot-toast";

export default function TopHeader({ user }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleClickSignOutButton = () => {
    startTransition(async () => {
      const { errorMessage } = await signOutAction();

      if (errorMessage) {
        toast.error(errorMessage);
      } else {
        router.push("/");
        toast.success("Successfully signed out");
      }
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.elements.search.value.trim();
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50  bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="text-4xl font-bold tracking-tight text-blue-500 shrink-0"
        >
          <span className="text-blue-500 ">Re</span>
          <span className="text-gray-600">vend</span>
        </Link>

        {/* Search Bar */}

        <form onSubmit={handleSearch} className="flex-1 max-w-3xl">
          <div className="relative flex items-center">
            <input
              type="text"
              name="search"
              placeholder="Search for anything..."
              className="w-full pl-5 pr-21 py-2 text-sm border bg-amber-50 border-gray-600 rounded-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
            <button
              type="submit"
              className="absolute right-1 p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full transition-colors flex items-center justify-center w-8 h-8"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </form>

        {/* Right Actions: Sign In & Cart */}
        <div className="flex items-center space-x-2 text-sm font-medium shrink-0">
          {user ? (
            <>
              <Link
                href="/account"
                className="hover:text-blue-600 transition-colors font-semibold"
              >
                My Account
              </Link>

              <button
                onClick={handleClickSignOutButton}
                className="hover:text-blue-600 transition-colors"
                disabled={isPending}
              >
                {isPending ? <Loader2 className="animate-spin" /> : "Sign Out"}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/signin"
                className="hover:text-blue-600 transition-colors"
              >
                Sign in
              </Link>
              <span>or</span>
              <Link
                href="/register"
                className="hover:text-blue-600 transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
