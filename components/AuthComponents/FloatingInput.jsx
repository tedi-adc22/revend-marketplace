"use client";

import React from "react";
import { Input } from "@/components/ui/input";

export default function FloatingInput({
  id,
  label,
  value,
  onChange,
  type = "text",
  required = false,
}) {
  return (
    <div className="relative">
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder=" " /* MUST keep a single space here for :placeholder-shown to work */
        className="peer h-14 pt-5 pb-2 px-4 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white text-sm font-semibold focus:border-gray-900 focus:ring-0 transition-all placeholder-transparent"
      />
      <label
        htmlFor={id}
        className="absolute left-4 top-2 text-[10px] font-medium text-gray-500 transition-all 
                   peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 
                   peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-gray-500 pointer-events-none"
      >
        {label}
      </label>
    </div>
  );
}
