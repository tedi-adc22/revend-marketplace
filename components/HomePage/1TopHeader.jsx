"use client";
import Link from "next/link";

export default function TopHeader() {
  return (
    <header className="sticky top-0 z-50  bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        {/* <a
          href="#"
          className="text-4xl font-bold tracking-tight text-blue-500 shrink-0"
        >
          Revend
        </a> */}
        <Link
          href="/"
          className="text-4xl font-bold tracking-tight text-blue-500 shrink-0"
        >
          <span className="text-blue-500 ">Re</span>
          <span className="text-gray-600">vend</span>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-3xl ">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search for anything..."
              className="w-full pl-5 pr-21 py-2 text-sm border bg-amber-50 border-gray-600 rounded-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
            <button className="absolute right-1 p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full transition-colors flex items-center justify-center w-8 h-8">
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
        </div>

        {/* Right Actions: Sign In & Cart */}
        <div className="flex items-center space-x-6 text-sm font-medium shrink-0">
          <a href="#" className="hover:text-blue-600 transition-colors">
            Sign in
          </a>

          <a
            href="#"
            className="relative p-1 text-gray-700 hover:text-black transition-colors"
            aria-label="Cart"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
              />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}
