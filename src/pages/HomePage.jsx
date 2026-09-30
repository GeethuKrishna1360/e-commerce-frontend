import React, { useState, useMemo } from "react";
import { mockProducts, CATEGORIES } from "../data/mockProducts";
import { ProductCard } from "../components/ProductCard";
import { PromoSlider } from "../components/PromoSlider";
import { useCart } from "../context/CartContext";
import {
  SlidersHorizontal,
  X,
  Truck,
  ArrowUpDown,
  Search,
} from "lucide-react";

export function HomePage() {
  const { searchQuery, setSearchQuery, selectedCategory, setSelectedCategory } =
    useCart();

  // Filters State
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("relevance");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Lock background scroll when drawer is open
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsFilterDrawerOpen(false);
    };
    if (isFilterDrawerOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isFilterDrawerOpen]);

  // Price Range Definitions
  const priceRanges = [
    { label: "All Prices", value: "all" },
    { label: "Under ₹350", value: "under-350", min: 0, max: 350 },
    { label: "₹350 - ₹500", value: "350-500", min: 350, max: 500 },
    { label: "₹500 - ₹700", value: "500-700", min: 500, max: 700 },
    { label: "Above ₹700", value: "above-700", min: 700, max: 99999 },
  ];

  // Rating Filter Definitions
  const ratingOptions = [
    { label: "All Ratings", value: 0 },
    { label: "4.0 ★ & Above", value: 4.0 },
    { label: "4.3 ★ & Above", value: 4.3 },
    { label: "4.5 ★ & Above", value: 4.5 },
  ];

  // Category Visual Circles
  const categoryHighlights = [
    {
      name: "Women Ethnic",
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Western Wear",
      image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Men",
      image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Kids",
      image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Home & Kitchen",
      image: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Beauty & Footwear",
      image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=400&q=80",
    },
  ];

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let list = [...mockProducts];

    // Category Filter
    if (selectedCategory && selectedCategory !== "All") {
      list = list.filter((p) => p.category === selectedCategory);
    }

    // Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.details.Fabric && p.details.Fabric.toLowerCase().includes(q)) ||
          (p.details.Pattern && p.details.Pattern.toLowerCase().includes(q))
      );
    }

    // Price Range Filter
    if (selectedPriceRange !== "all") {
      const range = priceRanges.find((r) => r.value === selectedPriceRange);
      if (range) {
        list = list.filter((p) => p.price >= range.min && p.price <= range.max);
      }
    }

    // Rating Filter
    if (minRating > 0) {
      list = list.filter((p) => p.rating >= minRating);
    }

    // Sort Logic
    if (sortBy === "price-low-high") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high-low") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating-high") {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "discount-high") {
      list.sort((a, b) => b.discountPercent - a.discountPercent);
    }

    return list;
  }, [selectedCategory, searchQuery, selectedPriceRange, minRating, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory("All");
    setSelectedPriceRange("all");
    setMinRating(0);
    setSearchQuery("");
    setSortBy("relevance");
  };

  const hasActiveFilters =
    selectedCategory !== "All" ||
    selectedPriceRange !== "all" ||
    minRating > 0 ||
    searchQuery.trim() !== "";

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory && selectedCategory !== "All") count++;
    if (selectedPriceRange !== "all") count++;
    if (minRating > 0) count++;
    return count;
  }, [selectedCategory, selectedPriceRange, minRating]);

  return (
    <div className="min-h-screen bg-[#fafafa] pb-20">
      {/* Compact Sliding Ads Showcase */}
      <PromoSlider />

      {/* Visual Category Discovery Bubbles */}
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            Featured Departments
          </h2>
          <span className="text-xs text-slate-400">Select to explore</span>
        </div>
        <div className="no-scrollbar flex items-center gap-3 overflow-x-auto pb-2">
          {categoryHighlights.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => {
                  setSelectedCategory(cat.name);
                  const el = document.getElementById("catalog-section");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`group flex shrink-0 items-center gap-3 rounded-2xl border p-2 pr-4 transition-all duration-200 ${
                  isSelected
                    ? "border-indigo-600 bg-indigo-50/70 shadow-sm ring-1 ring-indigo-600"
                    : "border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-xs"
                }`}
              >
                <div className="h-11 w-11 overflow-hidden rounded-xl bg-slate-100 shrink-0">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="text-left">
                  <span
                    className={`block text-xs font-bold leading-tight ${
                      isSelected ? "text-indigo-600" : "text-slate-800"
                    }`}
                  >
                    {cat.name}
                  </span>
                  <span className="text-[10px] text-slate-400">Discover &rarr;</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Main Catalog Section */}
      <section id="catalog-section" className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
        {/* Modern Filter & Sort Header Bar */}
        <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {selectedCategory === "All" ? "All Products" : selectedCategory}
            </h2>
            <span className="rounded-full bg-slate-100 px-3 py-0.5 text-xs font-semibold text-slate-600">
              {filteredProducts.length} items
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 sm:justify-end">
            {/* On-Demand Filter Drawer Button (Visible on ALL devices) */}
            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-all shadow-2xs ${
                activeFiltersCount > 0
                  ? "border-indigo-600 bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300"
              }`}
            >
              <SlidersHorizontal size={14} className={activeFiltersCount > 0 ? "text-indigo-600" : "text-slate-500"} />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Modern Sort Select */}
            <div className="flex items-center gap-2">
              <span className="hidden text-xs text-slate-400 sm:inline flex items-center gap-1 font-medium">
                <ArrowUpDown size={12} /> Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 shadow-2xs focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="relevance">Curated Relevance</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="rating-high">Highest Rated</option>
                <option value="discount-high">Highest Discount</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Chips Bar (Quick Dismiss Without Opening Drawer) */}
        {hasActiveFilters && (
          <div className="mb-6 flex flex-wrap items-center gap-2 px-1">
            <span className="text-xs font-medium text-slate-400">Active:</span>

            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-200/60 px-3 py-1 text-xs font-semibold text-indigo-700">
                Search: "{searchQuery}"
                <button
                  onClick={() => setSearchQuery("")}
                  className="rounded-full p-0.5 hover:bg-indigo-100 text-indigo-500 hover:text-indigo-800"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {selectedCategory !== "All" && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
                Department: {selectedCategory}
                <button
                  onClick={() => setSelectedCategory("All")}
                  className="rounded-full p-0.5 hover:bg-slate-200 text-slate-500 hover:text-slate-800"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {selectedPriceRange !== "all" && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
                Price: {priceRanges.find((r) => r.value === selectedPriceRange)?.label}
                <button
                  onClick={() => setSelectedPriceRange("all")}
                  className="rounded-full p-0.5 hover:bg-slate-200 text-slate-500 hover:text-slate-800"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {minRating > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
                Rating: {minRating}★ & above
                <button
                  onClick={() => setMinRating(0)}
                  className="rounded-full p-0.5 hover:bg-slate-200 text-slate-500 hover:text-slate-800"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline ml-1"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Full-Width Product Grid */}
        <div>
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200/80 bg-white px-6 py-20 text-center shadow-xs">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <Search size={32} />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">
                No matching products found
              </h3>
              <p className="mt-1 max-w-sm text-xs text-slate-500">
                Try adjusting your filters, price range, or search term to discover
                other pieces in our collection.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-6 rounded-full bg-slate-900 px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-600 transition"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3.5 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Universal On-Demand Slide-Over Filter Drawer (Mobile & Desktop) */}
      {isFilterDrawerOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity duration-300"
          onClick={() => setIsFilterDrawerOpen(false)}
        >
          <div
            className="relative flex h-full w-full max-w-sm flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-250 ease-out"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                  <SlidersHorizontal size={16} />
                </div>
                <div>
                  <span className="font-bold text-slate-900 text-sm block">
                    Filter Products
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {filteredProducts.length} items available
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {hasActiveFilters && (
                  <button
                    onClick={handleResetFilters}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline px-2 py-1"
                  >
                    Reset
                  </button>
                )}
                <button
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition"
                  aria-label="Close filters"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Drawer Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              {/* Department */}
              <div>
                <h4 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Department
                </h4>
                <div className="space-y-1">
                  {CATEGORIES.map((cat) => {
                    const isSelected = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs text-left transition-all ${
                          isSelected
                            ? "bg-slate-900 font-bold text-white shadow-xs"
                            : "text-slate-700 hover:bg-slate-100/70"
                        }`}
                      >
                        <span>{cat}</span>
                        {isSelected && <span className="text-[11px] text-emerald-400">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Range */}
              <div className="border-t border-slate-100 pt-5">
                <h4 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Price Range
                </h4>
                <div className="space-y-2">
                  {priceRanges.map((r) => {
                    const isSelected = selectedPriceRange === r.value;
                    return (
                      <label
                        key={r.value}
                        className={`flex cursor-pointer items-center justify-between rounded-xl border p-2.5 text-xs transition ${
                          isSelected
                            ? "border-indigo-600 bg-indigo-50/50 font-bold text-indigo-950"
                            : "border-slate-200/80 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <input
                            type="radio"
                            name="drawer-price"
                            checked={isSelected}
                            onChange={() => setSelectedPriceRange(r.value)}
                            className="accent-indigo-600 h-3.5 w-3.5"
                          />
                          <span>{r.label}</span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Customer Rating */}
              <div className="border-t border-slate-100 pt-5">
                <h4 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Customer Rating
                </h4>
                <div className="space-y-2">
                  {ratingOptions.map((opt) => {
                    const isSelected = minRating === opt.value;
                    return (
                      <label
                        key={opt.value}
                        className={`flex cursor-pointer items-center justify-between rounded-xl border p-2.5 text-xs transition ${
                          isSelected
                            ? "border-indigo-600 bg-indigo-50/50 font-bold text-indigo-950"
                            : "border-slate-200/80 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <input
                            type="radio"
                            name="drawer-rating"
                            checked={isSelected}
                            onChange={() => setMinRating(opt.value)}
                            className="accent-indigo-600 h-3.5 w-3.5"
                          />
                          <span>{opt.label}</span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Zero Delivery Promise */}
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3.5 text-xs text-emerald-800">
                <p className="font-bold flex items-center gap-1.5 text-emerald-700">
                  <Truck size={14} /> Zero Delivery Fees & Easy Returns
                </p>
                <p className="mt-1 text-[11px] text-emerald-600">
                  Free nationwide shipping on every order with 7-day doorstep returns.
                </p>
              </div>
            </div>

            {/* Sticky Drawer Footer */}
            <div className="border-t border-slate-100 bg-slate-50/80 p-4 flex items-center gap-3">
              <button
                onClick={handleResetFilters}
                className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                Reset
              </button>
              <button
                onClick={() => setIsFilterDrawerOpen(false)}
                className="flex-1 rounded-full bg-slate-900 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-600 transition"
              >
                Show {filteredProducts.length} Product{filteredProducts.length === 1 ? "" : "s"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
