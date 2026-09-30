import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  ShoppingBag,
  User,
  Heart,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Package,
} from "lucide-react";
import { useCart } from "../context/CartContext";

export function Navbar() {
  const { cartCount, wishlist, searchQuery, setSearchQuery } = useCart();
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileRef = useRef(null);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Keep local search input synced with context search query
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  // Debounced search update
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localSearch);
    }, 200);

    return () => clearTimeout(timer);
  }, [localSearch, setSearchQuery]);

  // Keyboard shortcut '/' to focus search
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "/" && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    if (location.pathname !== "/") {
      navigate("/");
    }
  };

  const clearSearch = () => {
    setLocalSearch("");
    setSearchQuery("");
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      {/* Main Navigation Row */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Left: Mobile Toggle + Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 sm:hidden"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200">
              <Sparkles size={18} />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold tracking-tight text-xl text-slate-900 font-sans leading-none">
                e<span className="text-indigo-600">.</span>shop
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">
                Curated Living
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative hidden flex-1 max-w-lg lg:max-w-xl sm:flex"
        >
          <div className="relative w-full">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <Search size={16} />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search products, materials, styles (press '/' to focus)..."
              className="w-full rounded-full border border-slate-200 bg-slate-50/80 py-2 pl-9 pr-14 text-xs font-medium text-slate-800 placeholder-slate-400 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
            />
            {localSearch ? (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600"
              >
                <X size={15} />
              </button>
            ) : (
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-[10px] font-bold text-slate-400">
                <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 shadow-2xs">
                  /
                </kbd>
              </span>
            )}
          </div>
        </form>

        {/* Right: Actions (Wishlist, Profile, Cart) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Wishlist Icon */}
          <Link
            to="/"
            onClick={() => {
              if (wishlist.length > 0) {
                // If wishlist has items, toast reminder or scroll
              }
            }}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="Wishlist"
          >
            <Heart size={19} />
            {wishlist.length > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-xs">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              aria-label="User Account"
            >
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                <User size={13} />
              </div>
              <span className="hidden sm:inline">Account</span>
              <ChevronDown size={13} className="text-slate-400" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                <div className="rounded-xl bg-slate-50 p-3 mb-1">
                  <p className="text-[11px] font-medium text-slate-500">Welcome to e-shop</p>
                  <p className="text-xs font-bold text-slate-900 mt-0.5">Valued Customer</p>
                </div>
                <div className="space-y-0.5 text-xs font-medium text-slate-700">
                  <Link
                    to="/"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-indigo-50 hover:text-indigo-600 transition"
                  >
                    <Package size={15} />
                    <span>My Orders</span>
                  </Link>
                  <Link
                    to="/"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-indigo-50 hover:text-indigo-600 transition"
                  >
                    <div className="flex items-center gap-2">
                      <Heart size={15} />
                      <span>Saved Wishlist</span>
                    </div>
                    {wishlist.length > 0 && (
                      <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-600">
                        {wishlist.length}
                      </span>
                    )}
                  </Link>
                  <div className="border-t border-slate-100 my-1" />
                  <button
                    onClick={() => setIsProfileOpen(false)}
                    className="w-full text-left rounded-lg px-3 py-2 text-[11px] text-slate-500 hover:text-slate-800"
                  >
                    Customer Support & FAQ
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Cart Pill Button */}
          <Link
            to="/cart"
            className="flex items-center gap-2 rounded-full bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-600 active:scale-95"
            aria-label={`Shopping bag with ${cartCount} items`}
          >
            <div className="relative">
              <ShoppingBag size={15} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-cyan-400 px-1 text-[9px] font-black text-slate-950">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline">Cart</span>
          </Link>
        </div>
      </div>

      {/* Mobile Search Bar Row */}
      <div className="px-4 pb-3 sm:hidden">
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Search size={15} />
          </div>
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-full border border-slate-200 bg-slate-100/70 py-2 pl-9 pr-9 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none"
          />
          {localSearch && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400"
            >
              <X size={14} />
            </button>
          )}
        </form>
      </div>

      {/* Mobile drawer */}
      {isMobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 py-3 sm:hidden animate-in slide-in-from-top-2">
          <div className="flex flex-col gap-2 text-xs font-medium text-slate-700">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 hover:bg-slate-100"
            >
              Explore Catalog
            </Link>
            <Link
              to="/cart"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-slate-100"
            >
              <span>View Cart</span>
              <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-bold text-white">
                {cartCount} items
              </span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
