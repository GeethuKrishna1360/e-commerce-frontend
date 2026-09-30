import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CATEGORY_NAV_ITEMS } from "../data/mockProducts";
import { useCart } from "../context/CartContext";
import { ChevronDown, Compass } from "lucide-react";

export function CategoryBar() {
  const { selectedCategory, setSelectedCategory, setSearchQuery } = useCart();
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
    setSearchQuery("");
    if (location.pathname !== "/") {
      navigate("/");
    }
  };

  const handleSubcategoryClick = (categoryName, subcategory) => {
    setSelectedCategory(categoryName);
    setSearchQuery(subcategory);
    if (location.pathname !== "/") {
      navigate("/");
    }
    setHoveredCategory(null);
  };

  return (
    <div className="relative border-b border-slate-200/60 bg-white/70 backdrop-blur-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Horizontal Navigation List */}
        <nav className="no-scrollbar flex w-full items-center gap-1.5 overflow-x-auto py-2">
          {/* "All" button */}
          <button
            onClick={() => handleCategoryClick("All")}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-all ${
              selectedCategory === "All"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
            }`}
          >
            <Compass size={13} className={selectedCategory === "All" ? "text-cyan-400" : "text-slate-400"} />
            <span>All Departments</span>
          </button>

          {/* Category Items */}
          {CATEGORY_NAV_ITEMS.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            const isHovered = hoveredCategory === cat.name;

            return (
              <div
                key={cat.name}
                className="relative shrink-0"
                onMouseEnter={() => setHoveredCategory(cat.name)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <button
                  onClick={() => handleCategoryClick(cat.name)}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                    isSelected
                      ? "bg-indigo-600 text-white font-semibold shadow-xs shadow-indigo-600/20"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                  }`}
                >
                  <span>{cat.name}</span>
                  <ChevronDown
                    size={12}
                    className={`transition-transform duration-200 ${
                      isHovered ? "rotate-180 opacity-100" : "opacity-50"
                    }`}
                  />
                </button>

                {/* Subcategory Floating Menu */}
                {isHovered && (
                  <div className="absolute left-0 top-full z-50 mt-1 min-w-[220px] rounded-2xl border border-slate-100 bg-white p-2 shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                      Top in {cat.name}
                    </div>
                    <div className="mt-1 space-y-0.5">
                      {cat.subcategories.map((sub) => (
                        <button
                          key={sub}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSubcategoryClick(cat.name, sub);
                          }}
                          className="flex w-full items-center justify-between rounded-xl px-3 py-1.5 text-left text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
                        >
                          <span>{sub}</span>
                        </button>
                      ))}
                    </div>
                    <div className="border-t border-slate-100 mt-2 pt-1.5 px-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCategoryClick(cat.name);
                        }}
                        className="w-full text-center rounded-lg py-1.5 text-[11px] font-semibold text-indigo-600 hover:bg-indigo-50 transition"
                      >
                        Explore All {cat.name} &rarr;
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
