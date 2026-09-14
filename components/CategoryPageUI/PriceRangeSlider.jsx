"use client";

import React, { useState } from "react";
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export default function PriceRangeSlider({
  min = 0,
  max = 1000,
  step = 10,
  onPriceChange,
}) {
  const [priceRange, setPriceRange] = useState([min, max]);

  const handleValueChange = (newValues) => {
    setPriceRange(newValues);
    if (onPriceChange) {
      onPriceChange(newValues);
    }
  };

  return (
    <Popover>
      <PopoverTrigger>
        {/* Changed from <button> to <div> so Radix converts it to the single trigger element without nesting buttons */}
        <div
          role="button"
          tabIndex={0}
          className="px-4 py-2 bg-white hover:bg-gray-100 border border-gray-200/80 rounded-xl text-xs font-semibold text-gray-700 shadow-sm flex items-center gap-2 transition-colors cursor-pointer select-none"
        >
          <span>
            Price: €{priceRange[0]} - €{priceRange[1]}
          </span>
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
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-4 space-y-4 rounded-2xl" align="start">
        <div className="space-y-1">
          <h4 className="font-bold text-sm text-gray-900">Price Range</h4>
          <p className="text-xs text-gray-500">
            Select minimum and maximum price
          </p>
        </div>

        {/* Dual Handle Slider */}
        <Slider
          value={priceRange}
          min={min}
          max={max}
          step={step}
          onValueChange={handleValueChange}
          className="my-4"
        />

        {/* Formatted Dollar Value Display */}
        <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
          <span className="px-2.5 py-1 bg-gray-100 rounded-lg border border-gray-200/60">
            Min: €{priceRange[0]}
          </span>
          <span className="px-2.5 py-1 bg-gray-100 rounded-lg border border-gray-200/60">
            Max: €{priceRange[1]}
          </span>
        </div>

        <div className="flex justify-end gap-2 pt-1 border-t border-gray-100">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs"
            onClick={() => handleValueChange([min, max])}
          >
            Reset
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
