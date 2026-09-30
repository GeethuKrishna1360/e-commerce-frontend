import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Star, Heart, ShoppingBag, Check } from "lucide-react";
import { useCart } from "../context/CartContext";

export function ProductCard({ product }) {
  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const [selectedSize, setSelectedSize] = useState(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : "Free Size"
  );
  const [showSizePicker, setShowSizePicker] = useState(false);
  const [isAddedAnim, setIsAddedAnim] = useState(false);

  const isFavorite = isWishlisted(product.id);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.sizes && product.sizes.length > 1 && !showSizePicker) {
      setShowSizePicker(true);
      return;
    }

    addToCart(product, selectedSize, 1);
    setIsAddedAnim(true);
    setShowSizePicker(false);
    setTimeout(() => setIsAddedAnim(false), 1200);
  };

  const handleSizeSelectAndAdd = (e, size) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedSize(size);
    addToCart(product, size, 1);
    setIsAddedAnim(true);
    setShowSizePicker(false);
    setTimeout(() => setIsAddedAnim(false), 1200);
  };

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-0.5">
      <Link to={`/product/${product.id}`} className="block flex-1">
        {/* Product Image Container */}
        <div className="relative aspect-4/5 w-full overflow-hidden bg-slate-100">
          <img
            src={product.images && product.images[0]}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* Floating Glassmorphic Wishlist Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/85 backdrop-blur-md shadow-sm transition hover:bg-white hover:scale-110 active:scale-95"
            aria-label="Add to wishlist"
          >
            <Heart
              size={16}
              className={
                isFavorite
                  ? "fill-rose-500 text-rose-500"
                  : "text-slate-600 hover:text-slate-900"
              }
            />
          </button>

          {/* Category Tag & Free Delivery Badge */}
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5">
            <span className="rounded-full bg-slate-900/75 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-semibold text-white">
              {product.category}
            </span>
            {product.discountPercent >= 65 && (
              <span className="rounded-full bg-emerald-500/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white shadow-2xs">
                {product.discountPercent}% OFF
              </span>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-3.5">
          {/* Rating Row */}
          <div className="flex items-center gap-1.5 text-xs">
            <div className="flex items-center gap-1 font-semibold text-slate-800">
              <Star size={12} className="fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
            </div>
            <span className="text-[11px] text-slate-400">
              ({product.reviewsCount.toLocaleString()})
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-[11px] font-medium text-emerald-600">
              Free Delivery
            </span>
          </div>

          {/* Title */}
          <h3
            title={product.title}
            className="mt-1.5 line-clamp-2 text-xs sm:text-sm font-medium text-slate-800 leading-snug group-hover:text-indigo-600 transition-colors"
          >
            {product.title}
          </h3>

          {/* Pricing Row */}
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
              ₹{product.price}
            </span>
            <span className="text-xs text-slate-400 line-through">
              ₹{product.originalPrice}
            </span>
          </div>
        </div>
      </Link>

      {/* Quick Add Section */}
      <div className="p-3.5 pt-0">
        {/* Interactive Size Selector Popup */}
        {showSizePicker && (
          <div
            className="mb-2.5 rounded-xl border border-indigo-100 bg-indigo-50/60 p-2.5 text-xs animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-1.5 text-[11px] font-bold text-indigo-900">
              Select Size:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {product.sizes.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={(e) => handleSizeSelectAndAdd(e, sz)}
                  className={`rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition ${
                    selectedSize === sz
                      ? "border-indigo-600 bg-indigo-600 text-white shadow-2xs"
                      : "border-slate-200 bg-white text-slate-700 hover:border-indigo-300"
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handleQuickAdd}
          className={`flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold tracking-wide transition-all duration-200 ${
            isAddedAnim
              ? "bg-emerald-600 text-white shadow-sm"
              : "border border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-900 hover:text-white hover:border-slate-900 active:scale-[0.98]"
          }`}
        >
          {isAddedAnim ? (
            <>
              <Check size={14} /> Added to Cart
            </>
          ) : (
            <>
              <ShoppingBag size={14} /> Quick Add
            </>
          )}
        </button>
      </div>
    </div>
  );
}
