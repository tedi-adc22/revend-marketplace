"use client";

import React, { useState } from "react";
import { notFound } from "next/navigation";
import { MOCK_ITEMS } from "@/lib/MOCK_ITEMS";

export default function ItemListingPage({ item, itemId }) {
  //   const itemId = React.use(params)?.itemId || "1";
  console.log(1232131231, item);
  console.log(1232131231, itemId);

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!item) {
    notFound();
  }

  const images =
    item.images && item.images.length > 0 ? item.images : item.title;

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % item.images.length);
  };

  const prevImage = () => {
    setActiveImageIndex(
      (prev) => (prev - 1 + item.images.length) % item.images.length,
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-16">
      {/* Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
        {/* TOP SECTION: Gallery & Right Information Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Image Gallery (7 Columns) */}
          <div className="lg:col-span-7 flex gap-4">
            {/* Thumbnails list */}
            {item.images.length > 1 && (
              <div className="flex flex-col gap-3 shrink-0">
                {item.images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-16 rounded-xl border-2 overflow-hidden bg-gray-100 transition-all ${
                      activeImageIndex === idx
                        ? "border-black ring-2 ring-black/5"
                        : "border-transparent hover:border-gray-300 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Featured Image Display */}
            <div className="relative flex-1 aspect-[4/3] rounded-2xl bg-gray-100 overflow-hidden border border-gray-200/80 shadow-sm flex items-center justify-center group">
              <img
                src={item.images[activeImageIndex]}
                alt={item.title}
                className="w-full h-full object-contain p-4"
              />

              {/* Photo Counter Badge */}
              <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full pointer-events-none">
                {activeImageIndex + 1} / {item.images.length}
              </div>

              {/* Action Buttons Top-Right */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button
                  aria-label="Favorite item"
                  className="p-2 bg-white/90 backdrop-blur-md rounded-full shadow hover:scale-105 active:scale-95 transition-transform text-gray-700 hover:text-red-500"
                >
                  <svg
                    className="w-5 h-5"
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

              {/* Previous / Next Arrows */}
              <button
                onClick={prevImage}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 backdrop-blur-md shadow-md text-gray-800 hover:bg-white transition-all opacity-0 group-hover:opacity-100"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                onClick={nextImage}
                aria-label="Next image"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 backdrop-blur-md shadow-md text-gray-800 hover:bg-white transition-all opacity-0 group-hover:opacity-100"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* RIGHT: Listing Info Side Cards (5 Columns) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Box 1: Date, Title, Location */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{item.dateListed}</span>
              </div>

              <h1 className="text-xl font-bold text-gray-900 leading-snug">
                {item.title}
              </h1>

              <span className="flex items-center gap-1">
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
              </span>
            </div>

            {/* Box 2: Price & Condition */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                  Price
                </p>
                <p className="text-3xl font-extrabold text-gray-900 mt-0.5">
                  ${item.price}
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
                  Condition
                </p>
                <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-200">
                  {item.condition}
                </span>
              </div>
            </div>

            {/* Box 3: User Profile & Message Button */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-5">
              <div className="flex items-center gap-4">
                <img
                  src={item.seller.avatar}
                  alt={item.seller.name}
                  className="w-14 h-14 rounded-full object-cover border border-gray-200"
                />
                <div className="flex-1">
                  <h3 className="text-base font-bold text-gray-900">
                    {item.seller.username}
                  </h3>
                </div>
              </div>

              {/* MESSAGE BUTTON */}
              {/* <div className="grid grid-cols-2 gap-3 pt-2"> */}
              <button className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2">
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
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                Send Message
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: Description of Listing */}
        <section className="bg-white p-8 rounded-2xl border border-gray-200/80 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
            Description
          </h2>
          <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
            {item.description}
          </div>
        </section>
      </main>
    </div>
  );
}
