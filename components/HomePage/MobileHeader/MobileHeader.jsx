"use client";
import Link from "next/link";
import { useState } from "react";
import { Search, User, Menu, ChevronRight, ChevronLeft } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { CATEGORIES } from "@/lib/constants/categories";

// NOT IMPLEMENTED
const HELP_LINKS = [
  { label: "How it works", href: "/help/how-it-works" },
  { label: "Contact us", href: "/help/contact" },
];

const CATEGORY_LINKS = CATEGORIES.map((c) => ({
  label: c.label,
  href: `/category/${c.value}`,
  highlight: c.value === "Sell",
}));

// Top-level menu side sheet -  items with `children` open a sub-list
const MENU = [
  { key: "categories", label: "Categories", children: CATEGORY_LINKS },
  { key: "help", label: "Help", children: HELP_LINKS },
];

const iconBtn = "p-2.5 rounded-full hover:bg-gray-100 transition-colors";
const rowClass =
  "flex w-full items-center justify-between px-4 py-3.5 text-sm text-gray-800 border-b border-gray-100 hover:bg-gray-50 transition-colors";

export default function MobileHeader({ user, onSearch }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [view, setView] = useState("main"); // "main" | "categories" | "help"

  const closeMenu = () => setMenuOpen(false);
  const openMenu = () => {
    setView("main"); // always start at the top level
    setMenuOpen(true);
  };

  const activeSection = MENU.find((m) => m.key === view);

  return (
    <div className="md:hidden">
      {/* Top row */}
      <div className="flex items-center justify-between h-14 px-4">
        <Link href="/" className="text-3xl font-bold tracking-tight">
          <span className="text-blue-500">Re</span>
          <span className="text-gray-600">vend</span>
        </Link>

        <div className="flex items-center">
          <button
            type="button"
            aria-label="Search"
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((o) => !o)}
            className={iconBtn}
          >
            <Search className="w-6 h-6" />
          </button>

          <Link
            href={user ? "/account" : "/signin"}
            aria-label={user ? "My account" : "Sign in"}
            className={iconBtn}
          >
            <User className="w-6 h-6" />
          </Link>

          <button
            type="button"
            aria-label="Open menu"
            onClick={openMenu}
            className={iconBtn}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Search row */}
      {searchOpen && (
        <form
          onSubmit={(e) => {
            onSearch(e);
            setSearchOpen(false);
          }}
          className="px-4 pb-3"
        >
          <input
            type="text"
            name="search"
            autoFocus
            placeholder="Search for anything..."
            className="w-full px-5 py-2 text-sm border bg-amber-50 border-gray-600 rounded-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </form>
      )}

      {/* Sheet menu */}
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="right" className="gap-0 p-0">
          <SheetHeader className="border-b border-gray-200">
            <SheetTitle>
              {activeSection ? activeSection.label : "Menu"}
            </SheetTitle>
            <SheetDescription className="sr-only">
              Site navigation
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto">
            {view === "main" ? (
              <>
                {MENU.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setView(item.key)}
                    className={rowClass}
                  >
                    {item.label}
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                ))}
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setView("main")}
                  className="flex items-center gap-1 px-4 py-3 text-sm text-gray-500 hover:text-gray-800"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
                {activeSection.children.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className={`${rowClass} ${
                      link.highlight ? "font-bold text-orange-600" : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </>
            )}
          </div>

          {/* Account footer */}
          <div className="border-t border-gray-200 p-4 text-sm font-medium">
            {user ? (
              <Link href="/account" onClick={closeMenu}>
                My Account
              </Link>
            ) : (
              <div className="flex gap-4">
                <Link href="/signin" onClick={closeMenu}>
                  Sign in
                </Link>
                <Link href="/register" onClick={closeMenu}>
                  Register
                </Link>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
