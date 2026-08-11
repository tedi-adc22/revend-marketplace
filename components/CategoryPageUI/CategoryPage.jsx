"use client";

import React, { useState } from "react";
import Link from "next/link";
import PriceRangeSlider from "./PriceRangeSlider";

// Mock sample data
const MOCK_ITEMS = [
  {
    id: "1",
    title: "DJI Osmo Action 5 Pro Essential Combo",
    price: "$349.00",
    condition: "Like New",
    location: "Austin, TX",
    lister: "alex_r",
    description:
      "Barely used DJI Osmo Action 5 Pro. Comes with extra battery, protective frame, and original box. Perfect for vloggers and sports recording.",
    images: [
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop",
    ],
    badge: "Urgent",
  },
  {
    id: "2",
    title: "Sony WH-1000XM5 Wireless Headphones",
    price: "$280.00",
    condition: "Excellent",
    location: "Dallas, TX",
    lister: "tech_guru",
    description:
      "Active noise-canceling headphones in pristine condition. Includes hard carrying case, 3.5mm audio cable, and USB-C charging cord.",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop",
    ],
  },
  {
    id: "3",
    title: "Apple iPad Pro 11-inch M2 (256GB, Wi-Fi)",
    price: "$650.00",
    condition: "Good",
    location: "Houston, TX",
    lister: "sarah_m",
    description:
      "Screen has always had a glass protector. Slight cosmetic wear on the back corners, fully functional. Battery health at 94%.",
    images: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop",
    ],
  },
];

export default function CategoryPage({ params }) {
  // Format slug to readable title e.g. "electronics" -> "Electronics"
  const categoryName = params?.category
    ? params.category.charAt(0).toUpperCase() + params.category.slice(1)
    : "Electronics";

  const [viewMode, setViewMode] = useState("list"); // 'list' or 'grid'
  const [selectedSort, setSelectedSort] = useState("Best Match");

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-16 font-sans">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* CATEGORY TITLE & HEADER */}

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

          {/* <button className="px-4 py-2 bg-white hover:bg-gray-100 border border-gray-200/80 rounded-xl text-xs font-semibold text-gray-700 shadow-sm flex items-center gap-2 transition-colors">
            Price Range
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
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button> */}
          <PriceRangeSlider
            min={0}
            max={1000}
            step={10}
            onPriceChange={(range) =>
              console.log("Selected Price Range:", range)
            }
          />

          <button className="px-4 py-2 bg-white hover:bg-gray-100 border border-gray-200/80 rounded-xl text-xs font-semibold text-gray-700 shadow-sm flex items-center gap-2 transition-colors">
            Condition
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
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          <button className="px-4 py-2 bg-white hover:bg-gray-100 border border-gray-200/80 rounded-xl text-xs font-semibold text-gray-700 shadow-sm flex items-center gap-2 transition-colors">
            Location
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
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>

        {/* RESULTS METRICS & SORT TOGGLE BAR */}
        <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
          <p>
            <span className="font-bold text-gray-900">90,139</span> results
          </p>

          <div className="flex items-center gap-4">
            {/* Sort Dropdown */}
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
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="bg-transparent font-bold text-gray-900 focus:outline-none cursor-pointer"
              >
                <option value="Best Match">Best Match</option>
                <option value="Newest">Newest First</option>
                <option value="Price Low">Price: Low to High</option>
                <option value="Price High">Price: High to Low</option>
              </select>
            </div>

            {/* View Mode Toggle (List / Grid) */}
            <div className="flex items-center border border-gray-200 rounded-lg p-0.5 bg-white shadow-sm">
              <button
                onClick={() => setViewMode("list")}
                aria-label="List view"
                className={`p-1.5 rounded-md transition-colors ${viewMode === "list" ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
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
                className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
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
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {MOCK_ITEMS.map((item) => (
            <Link
              key={item.id}
              href={`/item/${item.id}`}
              className="block group bg-white rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              {viewMode === "list" ? (
                /* HORIZONTAL LIST CARD (Matches Mockup) */
                <div className="flex flex-col sm:flex-row items-stretch">
                  {/* Left Column: Image + Core Details */}
                  <div className="sm:w-1/2 p-4 flex gap-4 border-b sm:border-b-0 sm:border-r border-gray-100">
                    {/* Thumbnail Image */}
                    <div className="relative w-36 h-36 shrink-0 rounded-xl bg-gray-100 overflow-hidden border border-gray-100">
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Favorite Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-md rounded-full shadow-sm text-gray-600 hover:text-red-500 transition-colors"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.684a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Metadata */}
                    <div className="flex flex-col justify-between py-0.5">
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 group-hover:text-orange-500 transition-colors line-clamp-1">
                          {item.title}
                        </h3>
                        <p className="text-xl font-black text-gray-900 mt-1">
                          {item.price}
                        </p>
                      </div>

                      <div className="space-y-1">
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
                        <p className="text-xs text-gray-400">
                          Listed by{" "}
                          <span className="font-semibold text-gray-600">
                            @{item.lister}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Extended Description */}
                  <div className="sm:w-1/2 p-4 flex flex-col justify-between bg-gray-50/40">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                          Description
                        </span>
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-full border border-emerald-200/60">
                          {item.condition}
                        </span>
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
                /* GRID CARD ALTERNATIVE */
                <div className="p-4 space-y-3">
                  <div className="relative aspect-[4/3] rounded-xl bg-gray-100 overflow-hidden">
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-lg font-black text-gray-900">
                      {item.price}
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
          ))}
        </div>
      </main>
    </div>
  );
}
