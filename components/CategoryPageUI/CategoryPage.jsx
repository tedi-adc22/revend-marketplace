"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import PriceRangeSlider from "./PriceRangeSlider";
import { CATEGORIES } from "@/lib/constants/categories";
import { getVisiblePages } from "@/lib/utils";

const formatViews = (count = 0) => {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return count.toString();
};

export default function CategoryPage({
  category,
  initialListings = [],
  currentPage = 1,
  totalPages = 1,
  totalResults = 0,
  maxPrice,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [viewMode, setViewMode] = useState("list");

  const categoryName =
    CATEGORIES.find((c) => c.value === category)?.label || "All Listings";

  const updateUrlParams = (updates, resetPage = true) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (
        value !== null &&
        value !== undefined &&
        value !== "" &&
        value !== "All"
      ) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    if (resetPage) {
      params.set("page", "1");
    }

    router.push(`${pathname}?${params.toString()}`);
  };
  const currentSort = searchParams.get("sort") || "Newest";
  const currentCondition = searchParams.get("condition") || "All";

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-16 font-sans">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            {categoryName}
          </h1>
        </div>

        {/* FILTERS BAR */}
        <div className="flex flex-wrap items-center gap-3 py-3 border-y border-gray-200">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 mr-1">
            Filters:
          </span>

          <PriceRangeSlider
            key={category}
            min={0}
            max={maxPrice}
            step={10}
            onPriceChange={(range) => {
              updateUrlParams({ minPrice: range[0], maxPrice: range[1] });
            }}
          />

          <select
            value={currentCondition}
            onChange={(e) => updateUrlParams({ condition: e.target.value })}
            className="px-4 py-2 bg-white hover:bg-gray-100 border border-gray-200/80 rounded-xl text-xs font-semibold text-gray-700 shadow-sm transition-colors cursor-pointer focus:outline-none"
          >
            <option value="All">Condition: All</option>
            <option value="New">New</option>
            <option value="Used - Like New">Used - Like New</option>
            <option value="Used - Good">Used - Good</option>
            <option value="Used - Fair">Used - Fair</option>
          </select>
        </div>

        {/* RESULTS METRICS & SORT TOGGLE BAR */}
        <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
          <p>
            <span className="font-bold text-gray-900">{totalResults}</span>{" "}
            results
          </p>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 cursor-pointer">
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                />
              </svg>
              <span>Sort:</span>
              <select
                value={currentSort}
                onChange={(e) => updateUrlParams({ sort: e.target.value })}
                className="bg-transparent font-bold text-gray-900 focus:outline-none cursor-pointer"
              >
                <option value="Newest">Newest First</option>
                <option value="Most Popular">Most Popular</option>
                <option value="Price Low">Price: Low to High</option>
                <option value="Price High">Price: High to Low</option>
              </select>
            </div>

            <div className="flex items-center border border-gray-200 rounded-lg p-0.5 bg-white shadow-sm">
              <button
                onClick={() => setViewMode("list")}
                aria-label="List view"
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === "list"
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-400 hover:text-gray-600"
                }`}
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
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === "grid"
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-400 hover:text-gray-600"
                }`}
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
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* LISTINGS CONTAINER */}
        {initialListings.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
            No active listings found for this selection.
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6"
                : "space-y-4"
            }
          >
            {initialListings.map((item) => {
              const imageSrc =
                Array.isArray(item.images) && item.images.length > 0
                  ? item.images[0]
                  : "/placeholder.png";
              const sellerName = item.seller?.username || "Verified Seller";
              const viewCount = item.weekly_view_count || item.view_count || 0;

              return (
                <Link
                  key={item.id}
                  href={`/item/${item.id}`}
                  className="block group bg-white rounded-lg border border-gray-200/80 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                >
                  {viewMode === "list" ? (
                    <div className="flex flex-col sm:flex-row items-stretch">
                      <div className="sm:w-1/2 p-4 flex gap-4 border-b sm:border-b-0 sm:border-r border-gray-100">
                        <div className="relative w-48 h-36 shrink-0 rounded-md bg-gray-100 overflow-hidden border border-gray-100">
                          <img
                            src={imageSrc}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        <div className="flex flex-col justify-between py-0.5">
                          <div>
                            <h3 className="text-sm font-bold text-gray-900 group-hover:text-orange-500 transition-colors line-clamp-1">
                              {item.title}
                            </h3>
                            <p className="text-xl font-black text-gray-900 mt-1">
                              €{Number(item.price).toFixed(2)}
                            </p>
                          </div>

                          <div className="space-y-1">
                            {item.location && (
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <svg
                                  className="w-3.5 h-3.5 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                </svg>
                                {item.location}
                              </div>
                            )}
                            <div className="flex items-center gap-3 text-xs text-gray-400">
                              <p>
                                Listed by{" "}
                                <span className="font-semibold text-gray-600">
                                  {sellerName}
                                </span>
                              </p>
                              {viewCount > 0 && (
                                <span className="flex items-center gap-1 text-gray-500 font-medium">
                                  <svg
                                    className="w-3.5 h-3.5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    />
                                  </svg>
                                  {formatViews(viewCount)} views
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="sm:w-1/2 p-4 flex flex-col justify-between bg-gray-50/40">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                              Description
                            </span>
                            {item.condition && (
                              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-full border border-emerald-200/60">
                                {item.condition}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                            {item.description}
                          </p>
                        </div>

                        <div className="pt-3 text-right">
                          <span className="text-xs font-bold text-orange-500 group-hover:underline">
                            View Details &rarr;
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 space-y-3">
                      <div className="relative aspect-[4/3] rounded-xl bg-gray-100 overflow-hidden">
                        <img
                          src={imageSrc}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-lg font-black text-gray-900">
                          €{Number(item.price).toFixed(2)}
                        </p>
                        <h3 className="text-sm font-bold text-gray-800 line-clamp-1">
                          {item.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {item.location}
                        </p>
                      </div>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        )}

        {/* PAGINATION CONTROLS */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 pt-6 mt-8">
            <p className="text-xs text-gray-500 font-medium">
              Page{" "}
              <span className="font-bold text-gray-900">{currentPage}</span> of{" "}
              <span className="font-bold text-gray-900">{totalPages}</span>
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  updateUrlParams({ page: String(currentPage - 1) }, false)
                }
                disabled={currentPage <= 1}
                className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                &larr; Previous
              </button>

              <div className="flex items-center gap-1">
                {getVisiblePages(currentPage, totalPages).map((p, idx) =>
                  p === "..." ? (
                    <span
                      key={`dots-${idx}`}
                      className="px-2 text-gray-400 text-xs"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() =>
                        updateUrlParams({ page: String(p) }, false)
                      }
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        p === currentPage
                          ? "bg-gray-900 text-white"
                          : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {p}
                    </button>
                  ),
                )}
              </div>

              <button
                onClick={() =>
                  updateUrlParams({ page: String(currentPage + 1) }, false)
                }
                disabled={currentPage >= totalPages}
                className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next &rarr;
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
