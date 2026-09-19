"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import PriceRangeSlider from "./PriceRangeSlider";
import { CATEGORIES } from "@/lib/constants/categories";
import { getVisiblePages } from "@/lib/utils";
import { CONDITIONS } from "@/lib/constants/conditions";
import FilterPopover from "./FilterPopover";

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
  searchQuery,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [viewMode, setViewMode] = useState("list");

  const categoryName = searchQuery
    ? `Results for "${searchQuery}"`
    : CATEGORIES.find((c) => c.value === category)?.label || "All Listings";

  const SORT_OPTIONS = [
    { value: "Newest", label: "Newest First" },
    { value: "Most Popular", label: "Most Popular" },
    { value: "Price Low", label: "Price: Low to High" },
    { value: "Price High", label: "Price: High to Low" },
  ];

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
  const minPriceParam = Number(searchParams.get("minPrice")) || 0;
  const maxPriceParam = Number(searchParams.get("maxPrice")) || maxPrice;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-xl sm:text-3xl font-black text-gray-900 tracking-tight">
            {categoryName}
          </h1>
        </div>

        {/* FILTERS BAR */}
        <div className="flex items-center gap-2 sm:gap-3 py-3 border-y border-gray-200 overflow-x-auto no-scrollbar whitespace-nowrap">
          <span className="hidden sm:flex text-xs font-bold uppercase tracking-wider text-gray-400 shrink-0">
            Filters:
          </span>

          <PriceRangeSlider
            key={category}
            min={0}
            max={maxPrice}
            initialMin={minPriceParam ? Number(minPriceParam) : null}
            initialMax={maxPriceParam ? Number(maxPriceParam) : null}
            step={10}
            onPriceChange={(range) => {
              updateUrlParams({ minPrice: range[0], maxPrice: range[1] });
            }}
          />

          <FilterPopover
            label="Condition"
            selectedValue={currentCondition}
            options={["All", ...CONDITIONS]}
            onSelect={(selected) => updateUrlParams({ condition: selected })}
          />
        </div>

        {/* RESULTS METRICS & SORT BAR */}
        <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
          <p>
            <span className="font-bold text-gray-900">{totalResults}</span>{" "}
            results
          </p>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-1 cursor-pointer">
              {/* <svg
                className="w-4 h-4 text-gray-500 shrink-0"
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
              </svg> */}
              {/* <span className="hidden sm:flex">Sort:</span> */}
              {/* <select
                value={currentSort}
                onChange={(e) => updateUrlParams({ sort: e.target.value })}
                className="bg-transparent font-bold text-gray-900 focus:outline-none cursor-pointer text-xs"
              >
                <option value="Newest">Newest First</option>
                <option value="Most Popular">Most Popular</option>
                <option value="Price Low">Price: Low to High</option>
                <option value="Price High">Price: High to Low</option>
              </select> */}
            </div>

            {/* VIEW MODE SWITCHER: Hidden on mobile (< sm breakpoint) */}
            <div className="hidden sm:flex items-center border border-gray-200 rounded-lg p-0.5 bg-white shadow-sm">
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
          <div className="bg-white rounded-xl border border-gray-200 p-8 sm:p-12 text-center text-gray-500 text-sm">
            No active listings found for this selection.
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6"
                : "space-y-3 sm:space-y-4"
            }
          >
            {initialListings.map((item, index) => {
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
                  className="block group bg-white rounded-xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                >
                  {viewMode === "list" ? (
                    <div className="flex flex-col sm:flex-row items-stretch">
                      {/* Top / Left section */}
                      <div className="sm:w-1/2 p-3 sm:p-4 flex gap-3.5 sm:gap-4 sm:border-r border-gray-100">
                        <div className="relative w-36 h-36 sm:w-48 sm:h-36 shrink-0 rounded-lg bg-gray-100 overflow-hidden border border-gray-100">
                          <Image
                            src={imageSrc}
                            alt={item.title}
                            fill
                            sizes="(max-width: 640px) 144px, 192px"
                            priority={index < 4}
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {/* Mobile: condition badge sits on the image so the title gets the full width, might change */}
                          {item.condition && (
                            <span className="sm:hidden absolute bottom-1.5 left-1.5 px-2 py-0.5 bg-white/90 backdrop-blur-sm text-emerald-700 text-[11px] font-bold rounded-full shadow-sm">
                              {item.condition}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-col justify-between py-0.5 min-w-0 flex-1">
                          <div className="space-y-1">
                            <h3 className="text-[15px] sm:text-sm font-semibold sm:font-bold text-gray-900 leading-snug group-hover:text-orange-500 transition-colors line-clamp-2 sm:line-clamp-1">
                              {item.title}
                            </h3>
                            <p className="text-xl font-black text-gray-900">
                              €{Number(item.price).toFixed(2)}
                            </p>
                          </div>

                          <div className="space-y-1 mt-2">
                            {item.location && (
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <svg
                                  className="w-3.5 h-3.5 text-gray-400 shrink-0"
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
                                <span className="truncate">
                                  {item.location}
                                </span>
                              </div>
                            )}
                            <div className=" flex items-center gap-2 sm:gap-3 text-xs text-gray-400">
                              <p className="truncate">
                                By{" "}
                                <span className="font-semibold text-gray-600">
                                  {sellerName}
                                </span>
                              </p>
                              {viewCount > 0 && (
                                <span className="hidden sm:flex items-center gap-1 text-gray-500 font-medium">
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

                      {/* DESCRIPTION BOX: Hidden on mobile (hidden sm:flex) */}
                      <div className="hidden sm:flex sm:w-1/2 p-4 flex-col justify-between bg-gray-50/40">
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
                    /* GRID VIEW (Desktop fallback) */
                    <div className="p-2.5 sm:p-4 space-y-2 sm:space-y-3">
                      <div className="relative aspect-[4/3] rounded-lg sm:rounded-xl bg-gray-100 overflow-hidden">
                        <Image
                          src={imageSrc}
                          alt={item.title}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                          priority={index < 4}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-base sm:text-lg font-black text-gray-900">
                          €{Number(item.price).toFixed(2)}
                        </p>
                        <h3 className="text-xs sm:text-sm font-bold text-gray-800 line-clamp-1">
                          {item.title}
                        </h3>
                        <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5 truncate">
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
          <div className="flex items-center justify-between border-t border-gray-200 pt-4 sm:pt-6 mt-6 sm:mt-8">
            <p className="text-xs text-gray-500 font-medium">
              Page{" "}
              <span className="font-bold text-gray-900">{currentPage}</span> of{" "}
              <span className="font-bold text-gray-900">{totalPages}</span>
            </p>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() =>
                  updateUrlParams({ page: String(currentPage - 1) }, false)
                }
                disabled={currentPage <= 1}
                className="px-2.5 sm:px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                &larr; Prev
              </button>

              <div className="hidden sm:flex items-center gap-1">
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
                className="px-2.5 sm:px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next &rarr;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
