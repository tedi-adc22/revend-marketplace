"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";

function MessageButton({ className = "" }) {
  return (
    <button
      type="button"
      className={`min-w-0 py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm rounded-xl transition-colors shadow-sm items-center justify-center gap-2 ${className}`}
    >
      <svg
        className="w-4 h-4 shrink-0"
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
      <span className="truncate">Send Message: Down for maintenance</span>
    </button>
  );
}

export default function ItemListingPage({ item }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const touchStartX = useRef(null);

  if (!item) {
    notFound();
  }

  const images =
    Array.isArray(item.images) && item.images.length > 0 ? item.images : [];

  const nextImage = () => {
    if (images.length <= 1) return;
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    if (images.length <= 1) return;
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Swipe left/right on the main image (phones only)
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 50) return; // ignore taps and tiny movements
    if (delta < 0) nextImage();
    else prevImage();
  };

  const formattedDate = item.created_at
    ? new Date(item.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div className="min-h-[calc(100dvh-3.5rem)] md:min-h-[calc(100dvh-4rem)] bg-gray-50 text-gray-900 pb-10 sm:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-4 sm:space-y-8">
        {/* TOP SECTION: Gallery & Right Information Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-start">
          {/* LEFT: Image Gallery
              Phones: main image on top, thumbnails in a row below.
              lg: thumbnails column on the left, like before. */}
          <div className="lg:col-span-7 flex flex-col-reverse lg:flex-row gap-3 lg:gap-4">
            {/* Thumbnails list */}
            {images.length > 1 && (
              <div className="flex lg:flex-col gap-2 lg:gap-3 shrink-0 overflow-x-auto lg:overflow-visible -mx-4 px-4 lg:mx-0 lg:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    aria-label={`Show image ${idx + 1}`}
                    className={`relative w-16 h-16 shrink-0 rounded-xl border-2 overflow-hidden bg-gray-100 transition-all ${
                      activeImageIndex === idx
                        ? "border-black ring-2 ring-black/5 opacity-100"
                        : "border-transparent hover:border-gray-300 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={imgUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Featured Image Display */}
            <div
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="relative w-full min-w-0 lg:flex-1 aspect-square sm:aspect-[4/3] touch-pan-y rounded-2xl bg-gray-100 overflow-hidden border border-gray-200/80 shadow-sm flex items-center justify-center group"
            >
              {images.length > 0 ? (
                <Image
                  src={images[activeImageIndex]}
                  alt={item.title}
                  fill
                  preload
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-contain"
                />
              ) : (
                <div className="text-gray-400 font-medium text-sm">
                  No images available
                </div>
              )}

              {/* Photo Counter Badge */}
              {images.length > 0 && (
                <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full pointer-events-none z-10">
                  {activeImageIndex + 1} / {images.length}
                </div>
              )}

              {/* Favorite Button Top-Right */}
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-2 z-10">
                <button
                  type="button"
                  aria-label="Favorite item"
                  className="p-2.5 bg-white/90 backdrop-blur-md rounded-full shadow hover:scale-105 active:scale-95 transition-transform text-gray-700 hover:text-red-500"
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

              {/* Navigation Arrows: always visible on touch devices,
                  shown on hover on devices with a mouse */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevImage}
                    aria-label="Previous image"
                    className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 backdrop-blur-md shadow-md text-gray-800 hover:bg-white transition-all z-10 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100"
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
                    type="button"
                    onClick={nextImage}
                    aria-label="Next image"
                    className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 backdrop-blur-md shadow-md text-gray-800 hover:bg-white transition-all z-10 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100"
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
                </>
              )}
            </div>
          </div>

          {/* RIGHT: Listing Info Side Cards (5 Columns) */}
          <div className="lg:col-span-5 space-y-3 lg:space-y-4">
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-3">
              {formattedDate && (
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Posted on {formattedDate}</span>
                </div>
              )}

              <h1 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug break-words">
                {item.title}
              </h1>

              {item.location && (
                <span className="flex items-center gap-1 text-sm text-gray-600">
                  <svg
                    className="w-4 h-4 text-gray-400 shrink-0"
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
                  <span className="min-w-0 break-words">{item.location}</span>
                </span>
              )}
            </div>

            {/* Box 2: Price & Condition */}
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-200/80 shadow-sm flex items-center justify-between gap-3">
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                  Price
                </p>
                <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-0.5">
                  €{Number(item.price || 0).toFixed(2)}
                </p>
              </div>

              {item.condition && (
                <div className="text-right">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
                    Condition
                  </p>
                  <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-200">
                    {item.condition}
                  </span>
                </div>
              )}
            </div>

            {/* Box 3: Seller Details & Actions */}
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-4 lg:space-y-5">
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-lg overflow-hidden border border-gray-200 shrink-0">
                  {item.seller?.avatar ? (
                    <Image
                      src={item.seller.avatar}
                      alt={item.seller.username || "Seller"}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  ) : (
                    <span>
                      {(item.seller?.username || "S").charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-gray-900 truncate">
                    {item.seller?.username || "Verified Seller"}
                  </h3>
                  <p className="text-xs text-gray-500">Marketplace Member</p>
                </div>
              </div>

              <MessageButton className="flex w-full" />
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: Description */}
        <section className="bg-white p-4 sm:p-8 rounded-2xl border border-gray-200/80 shadow-sm space-y-3 sm:space-y-4">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
            Description
          </h2>
          <div className="text-sm text-gray-700 whitespace-pre-line break-words leading-relaxed">
            {item.description || "No description provided."}
          </div>
        </section>
      </div>

      {/* MOBILE STICKY ACTION BAR */}
      {/* <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-gray-200 bg-white px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <p className="shrink-0 text-xl font-extrabold text-gray-900">
          €{Number(item.price || 0).toFixed(2)}
        </p>
        <MessageButton className="flex flex-1" />
      </div> */}
    </div>
  );
}
