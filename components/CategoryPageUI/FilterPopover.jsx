"use client";

import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function FilterPopover({
  label = "Filter",
  selectedValue = "All",
  options = [],
  onSelect,
  displayKey = (option) => option,
  valueKey = (option) => option,
}) {
  const [open, setOpen] = useState(false);

  const handleSelect = (val) => {
    onSelect(val);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="shrink-0 px-3 sm:px-4 py-2 bg-white hover:bg-gray-100 border border-gray-200/80 rounded-xl text-xs font-semibold text-gray-700 shadow-sm flex items-center gap-1.5 sm:gap-2 transition-colors cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
        <span>
          {label}: {selectedValue}
        </span>
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
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </PopoverTrigger>

      <PopoverContent
        className="w-[min(18rem,calc(100vw_-_2rem))] p-4 space-y-3 rounded-2xl bg-white shadow-xl border border-gray-100"
        align="start"
      >
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <h4 className="font-bold text-sm text-gray-900">{label}</h4>
          <button
            onClick={() => setOpen(false)}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-1.5 pt-1">
          {options.map((option) => {
            const val = valueKey(option);
            const disp = displayKey(option);
            const isSelected = selectedValue === val;

            return (
              <label
                key={val}
                onClick={() => handleSelect(val)}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors text-xs font-medium text-gray-800"
              >
                <input
                  type="radio"
                  name={`filter-${label}`}
                  checked={isSelected}
                  onChange={() => {}}
                  className="w-4 h-4 text-orange-500 focus:ring-orange-500 border-gray-300 accent-orange-500 cursor-pointer"
                />
                <span>{disp}</span>
              </label>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
