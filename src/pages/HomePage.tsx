import {
  useState,
  useMemo,
  useEffect,
  type ChangeEvent,
  type MouseEvent,
} from "react";
import {
  mockProducts,
  CATEGORIES,
  priceRanges,
  ratingOptions,
} from "../data/mockProducts";
import { ProductCard } from "../components/ProductCard";
import { PromoSlider } from "../components/PromoSlider";
import { useCart } from "../context/useCart";
import type { SortOption, Product } from "../types";
import {
  SlidersHorizontal,
  X,
  Truck,
  ArrowUpDown,
  Search,
  ShieldCheck,
  RotateCcw,
  Banknote,
  Flame,
} from "lucide-react";

interface CategoryHighlight {
  name: string;
  image: string;
}

export function HomePage() {
  const { searchQuery, setSearchQuery, selectedCategory, setSelectedCategory } =
    useCart();

  // Filters State
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("all");
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false);
  const [fastDeliveryOnly, setFastDeliveryOnly] = useState<boolean>(false);
  const [codOnly, setCodOnly] = useState<boolean>(false);
  const [minDiscount50, setMinDiscount50] = useState<boolean>(false);

  // Lock background scroll when drawer is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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

  // Modern Category Highlights
  const categoryHighlights: CategoryHighlight[] = [
    {
      name: "Women's Wear",
      image:
        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Men's Wear",
      image:
        "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Footwear",
      image:
        "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Accessories",
      image:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Home & Living",
      image:
        "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Beauty & Wellness",
      image:
        "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Tech & Audio",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80",
    },
  ];

  // Filter & Sort Logic
  const filteredProducts = useMemo<Product[]>(() => {
    let list = [...mockProducts];

    // Category Filter
    if (selectedCategory && selectedCategory !== "All") {
      list = list.filter((p) => p.category === selectedCategory);
    }

    // Search Query Filter
    if (searchQuery.trim()) {
      const normalizedQuery = searchQuery.trim().toLowerCase();
      const queryTokens = normalizedQuery
        .split(/[\s,&/-]+/)
        .map((w) => w.trim())
        .filter((w) => w.length > 0);

      list = list.filter((p) => {
        // Direct match with subcategory if defined
        if (p.subcategory && p.subcategory.toLowerCase() === normalizedQuery) return true;
        if (p.subcategory && queryTokens.some((t) => p.subcategory?.toLowerCase().includes(t))) return true;

        const detailsText = Object.values(p.details).join(" ").toLowerCase();
        const fullContent = `${p.title} ${p.category} ${p.subcategory || ""} ${p.description} ${detailsText}`.toLowerCase();

        // Direct full query substring match
        if (fullContent.includes(normalizedQuery)) return true;

        // Multi-token match with singular/plural word matching
        if (queryTokens.length > 0) {
          return queryTokens.some((token) => {
            if (fullContent.includes(token)) return true;
            if (token.endsWith("s") && token.length > 3) {
              const singular = token.slice(0, -1);
              if (fullContent.includes(singular)) return true;
            }
            return false;
          });
        }

        return false;
      });
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

    // Fast Delivery Filter
    if (fastDeliveryOnly) {
      list = list.filter((p) => p.fastDelivery);
    }

    // Cash on Delivery Filter
    if (codOnly) {
      list = list.filter((p) => p.codAvailable !== false);
    }

    // High Discount (50%+ Off) Filter
    if (minDiscount50) {
      list = list.filter((p) => p.discountPercent >= 50);
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
  }, [
    selectedCategory,
    searchQuery,
    selectedPriceRange,
    minRating,
    sortBy,
    fastDeliveryOnly,
    codOnly,
    minDiscount50,
  ]);

  const handleResetFilters = () => {
    setSelectedCategory("All");
    setSelectedPriceRange("all");
    setMinRating(0);
    setSearchQuery("");
    setSortBy("relevance");
    setFastDeliveryOnly(false);
    setCodOnly(false);
    setMinDiscount50(false);
  };

  const hasActiveFilters =
    selectedCategory !== "All" ||
    selectedPriceRange !== "all" ||
    minRating > 0 ||
    searchQuery.trim() !== "" ||
    fastDeliveryOnly ||
    codOnly ||
    minDiscount50;

  const activeFiltersCount = useMemo<number>(() => {
    let count = 0;
    if (selectedCategory && selectedCategory !== "All") count++;
    if (selectedPriceRange !== "all") count++;
    if (minRating > 0) count++;
    if (fastDeliveryOnly) count++;
    if (codOnly) count++;
    if (minDiscount50) count++;
    return count;
  }, [
    selectedCategory,
    selectedPriceRange,
    minRating,
    fastDeliveryOnly,
    codOnly,
    minDiscount50,
  ]);

  return (
    <div className="min-h-screen bg-[#fafafa] pb-20">
      {/* Compact Sliding Ads Showcase */}
      <PromoSlider />

      {/* Visual Category Discovery Bubbles */}
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            Featured Collections
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
                  setSearchQuery("");
                  const el = document.getElementById("catalog-section");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`group flex shrink-0 items-center gap-3 rounded-2xl border p-2 pr-4 transition-all duration-200 ${
                  isSelected
                    ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                    : "border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-xs text-slate-800"
                }`}
              >
                <div className="h-11 w-11 overflow-hidden rounded-xl bg-slate-100 shrink-0">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="text-left">
                  <span
                    className={`block text-xs font-bold leading-tight ${
                      isSelected ? "text-white" : "text-slate-800"
                    }`}
                  >
                    {cat.name}
                  </span>
                  <span
                    className={`text-[10px] ${
                      isSelected ? "text-slate-300" : "text-slate-400"
                    }`}
                  >
                    Discover &rarr;
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* e-Shop Assured Value Proposition Strip (Meesho Trust Guarantee, Modern Aesthetic) */}
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 rounded-3xl border border-slate-200/80 bg-white p-3.5 sm:p-5 shadow-2xs">
          <div className="flex items-center gap-3 p-1">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-900">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 leading-tight">Manufacturer Prices</p>
              <p className="text-[10px] text-slate-500">Zero middleman markup</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-1">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <Truck size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 leading-tight">100% Free Delivery</p>
              <p className="text-[10px] text-slate-500">On every single order</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-1">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <Banknote size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 leading-tight">Cash on Delivery</p>
              <p className="text-[10px] text-slate-500">Pay when you receive</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-1">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-900">
              <RotateCcw size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 leading-tight">7-Day Easy Returns</p>
              <p className="text-[10px] text-slate-500">Doorstep pickup & refund</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <section id="catalog-section" className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
        {/* Modern Filter & Sort Header Bar */}
        <div className="mb-3 flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {selectedCategory === "All" ? "All Products" : selectedCategory}
            </h2>
            <span className="rounded-full bg-slate-100 px-3 py-0.5 text-xs font-semibold text-slate-600">
              {filteredProducts.length} items
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 sm:justify-end">
            {/* On-Demand Filter Drawer Button */}
            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-all shadow-2xs ${
                activeFiltersCount > 0
                  ? "border-slate-900 bg-slate-900 text-white hover:bg-slate-800"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300"
              }`}
            >
              <SlidersHorizontal
                size={14}
                className={activeFiltersCount > 0 ? "text-emerald-400" : "text-slate-500"}
              />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-emerald-400 px-1 text-[10px] font-black text-slate-950">
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
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setSortBy(e.target.value as SortOption)
                }
                className="rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 shadow-2xs focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
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

        {/* Meesho-Style Fast Discovery Filter Pills Bar */}
        <div className="no-scrollbar mb-4 flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={handleResetFilters}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
              !hasActiveFilters
                ? "bg-slate-900 text-white shadow-2xs"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            All Items
          </button>

          <button
            onClick={() => setCodOnly((prev) => !prev)}
            className={`shrink-0 flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
              codOnly
                ? "bg-emerald-700 text-white shadow-2xs"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Banknote size={13} className={codOnly ? "text-white" : "text-emerald-600"} />
            <span>Cash on Delivery</span>
          </button>

          <button
            onClick={() => setFastDeliveryOnly((prev) => !prev)}
            className={`shrink-0 flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
              fastDeliveryOnly
                ? "bg-slate-900 text-white shadow-2xs"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Truck size={13} className={fastDeliveryOnly ? "text-emerald-400" : "text-slate-500"} />
            <span>⚡ Express Dispatch</span>
          </button>

          <button
            onClick={() => setMinRating((prev) => (prev === 4.0 ? 0 : 4.0))}
            className={`shrink-0 flex items-center gap-1 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
              minRating === 4.0
                ? "bg-slate-900 text-white shadow-2xs"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            <span>★ 4.0+ Rating</span>
          </button>

          <button
            onClick={() =>
              setSelectedPriceRange((prev) => (prev === "under-500" ? "all" : "under-500"))
            }
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
              selectedPriceRange === "under-500"
                ? "bg-slate-900 text-white shadow-2xs"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            Under ₹500
          </button>

          <button
            onClick={() =>
              setSelectedPriceRange((prev) => (prev === "500-1000" ? "all" : "500-1000"))
            }
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
              selectedPriceRange === "500-1000"
                ? "bg-slate-900 text-white shadow-2xs"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            ₹500 - ₹1,000
          </button>

          <button
            onClick={() => setMinDiscount50((prev) => !prev)}
            className={`shrink-0 flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
              minDiscount50
                ? "bg-rose-600 text-white shadow-2xs"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Flame size={13} className={minDiscount50 ? "text-white" : "text-rose-500"} />
            <span>50%+ Off</span>
          </button>
        </div>

        {/* Active Filter Chips Bar */}
        {hasActiveFilters && (
          <div className="mb-6 flex flex-wrap items-center gap-2 px-1">
            <span className="text-xs font-medium text-slate-400">Active:</span>

            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-800">
                Search: "{searchQuery}"
                <button
                  onClick={() => setSearchQuery("")}
                  className="rounded-full p-0.5 hover:bg-slate-200 text-slate-500 hover:text-slate-900"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {selectedCategory !== "All" && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-800">
                Department: {selectedCategory}
                <button
                  onClick={() => setSelectedCategory("All")}
                  className="rounded-full p-0.5 hover:bg-slate-200 text-slate-500 hover:text-slate-900"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {selectedPriceRange !== "all" && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-800">
                Price: {priceRanges.find((r) => r.value === selectedPriceRange)?.label}
                <button
                  onClick={() => setSelectedPriceRange("all")}
                  className="rounded-full p-0.5 hover:bg-slate-200 text-slate-500 hover:text-slate-900"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {minRating > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-800">
                Rating: {minRating}★ & above
                <button
                  onClick={() => setMinRating(0)}
                  className="rounded-full p-0.5 hover:bg-slate-200 text-slate-500 hover:text-slate-900"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {codOnly && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1 text-xs font-semibold">
                Cash on Delivery
                <button
                  onClick={() => setCodOnly(false)}
                  className="rounded-full p-0.5 hover:bg-emerald-100 text-emerald-600"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {fastDeliveryOnly && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-800">
                Express Dispatch
                <button
                  onClick={() => setFastDeliveryOnly(false)}
                  className="rounded-full p-0.5 hover:bg-slate-200 text-slate-500 hover:text-slate-900"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {minDiscount50 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-800 px-3 py-1 text-xs font-semibold">
                50%+ Discount
                <button
                  onClick={() => setMinDiscount50(false)}
                  className="rounded-full p-0.5 hover:bg-rose-100 text-rose-600"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold text-slate-900 hover:underline ml-1"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Full-Width Product Grid */}
        <div>
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200/80 bg-white px-6 py-20 text-center shadow-xs">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                <Search size={32} />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">
                No matching products found
              </h3>
              <p className="mt-1 max-w-sm text-xs text-slate-500">
                Try adjusting your filters, price range, or search query to discover
                pieces in our catalog.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-6 rounded-full bg-slate-900 px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition"
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

      {/* Universal On-Demand Slide-Over Filter Drawer */}
      {isFilterDrawerOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity duration-300"
          onClick={() => setIsFilterDrawerOpen(false)}
        >
          <div
            className="relative flex h-full w-full max-w-sm flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-250 ease-out"
            onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-800">
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
                    className="text-xs font-semibold text-slate-900 hover:underline px-2 py-1"
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
                            ? "border-slate-900 bg-slate-50 font-bold text-slate-950"
                            : "border-slate-200/80 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <input
                            type="radio"
                            name="drawer-price"
                            checked={isSelected}
                            onChange={() => setSelectedPriceRange(r.value)}
                            className="accent-slate-900 h-3.5 w-3.5"
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
                            ? "border-slate-900 bg-slate-50 font-bold text-slate-950"
                            : "border-slate-200/80 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <input
                            type="radio"
                            name="drawer-rating"
                            checked={isSelected}
                            onChange={() => setMinRating(opt.value)}
                            className="accent-slate-900 h-3.5 w-3.5"
                          />
                          <span>{opt.label}</span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Services & Deals */}
              <div className="border-t border-slate-100 pt-5">
                <h4 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Services & Deals
                </h4>
                <div className="space-y-2">
                  <label className="flex items-center justify-between rounded-xl border border-slate-200/80 p-3 cursor-pointer hover:bg-slate-50 transition">
                    <div className="flex items-center gap-2.5">
                      <Banknote size={15} className="text-emerald-700" />
                      <span className="text-xs font-semibold text-slate-800">Cash on Delivery</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={codOnly}
                      onChange={(e) => setCodOnly(e.target.checked)}
                      className="h-4 w-4 rounded accent-slate-900"
                    />
                  </label>
                  <label className="flex items-center justify-between rounded-xl border border-slate-200/80 p-3 cursor-pointer hover:bg-slate-50 transition">
                    <div className="flex items-center gap-2.5">
                      <Truck size={15} className="text-slate-800" />
                      <span className="text-xs font-semibold text-slate-800">⚡ Express Dispatch</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={fastDeliveryOnly}
                      onChange={(e) => setFastDeliveryOnly(e.target.checked)}
                      className="h-4 w-4 rounded accent-slate-900"
                    />
                  </label>
                  <label className="flex items-center justify-between rounded-xl border border-slate-200/80 p-3 cursor-pointer hover:bg-slate-50 transition">
                    <div className="flex items-center gap-2.5">
                      <Flame size={15} className="text-rose-600" />
                      <span className="text-xs font-semibold text-slate-800">50%+ Mega Discount</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={minDiscount50}
                      onChange={(e) => setMinDiscount50(e.target.checked)}
                      className="h-4 w-4 rounded accent-slate-900"
                    />
                  </label>
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
                className="flex-1 rounded-full bg-slate-900 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition"
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
