import { useState, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import { Star, Heart, ShoppingBag, Check } from "lucide-react";
import { useCart } from "../context/useCart";
import type { Product } from "../types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : "Free Size"
  );
  const [showSizePicker, setShowSizePicker] = useState<boolean>(false);
  const [isAddedAnim, setIsAddedAnim] = useState<boolean>(false);

  const isFavorite = isWishlisted(product.id);

  const handleQuickAdd = (e: MouseEvent<HTMLButtonElement>) => {
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

  const handleSizeSelectAndAdd = (
    e: MouseEvent<HTMLButtonElement>,
    size: string
  ) => {
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
            className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* Floating Minimal Wishlist Button */}
          <button
            type="button"
            onClick={(e: MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-md shadow-sm transition hover:bg-white hover:scale-110 active:scale-95"
            aria-label="Add to wishlist"
          >
            <Heart
              size={15}
              className={
                isFavorite
                  ? "fill-rose-500 text-rose-500"
                  : "text-slate-600 hover:text-slate-900"
              }
            />
          </button>

          {/* Category Tag & Discount Badge */}
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5">
            <span className="rounded-full bg-slate-900/80 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-semibold text-white">
              {product.category}
            </span>
            {product.badge && (
              <span className="rounded-full bg-slate-100/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-slate-800 shadow-2xs">
                {product.badge}
              </span>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-3.5">
          {/* Rating and Delivery Row */}
          <div className="flex items-center gap-1.5 text-xs">
            <div className="inline-flex items-center gap-0.5 rounded-md bg-emerald-700 px-1.5 py-0.5 text-[10px] font-bold text-white shadow-2xs">
              <span>{product.rating}</span>
              <Star size={9} className="fill-white text-white" />
            </div>
            <span className="text-[11px] text-slate-400">
              ({product.reviewsCount.toLocaleString()})
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-[11px] font-semibold text-emerald-600">
              Free Delivery
            </span>
          </div>

          {/* Title */}
          <h3
            title={product.title}
            className="mt-1.5 line-clamp-2 text-xs sm:text-sm font-medium text-slate-800 leading-snug group-hover:text-slate-950 transition-colors"
          >
            {product.title}
          </h3>

          {/* Pricing Row */}
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.originalPrice > product.price && (
              <>
                <span className="text-xs text-slate-400 line-through">
                  ₹{product.originalPrice.toLocaleString("en-IN")}
                </span>
                <span className="text-xs font-bold text-emerald-600">
                  {product.discountPercent}% OFF
                </span>
              </>
            )}
          </div>

          {/* Meesho-like Trust Indicator Tags */}
          <div className="mt-2.5 flex items-center gap-2 border-t border-slate-100 pt-2 text-[10px] text-slate-500">
            <span className="inline-flex items-center gap-1 font-medium text-slate-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> COD Available
            </span>
            {product.fastDelivery && (
              <>
                <span className="text-slate-300">•</span>
                <span className="font-medium text-slate-600">⚡ Express Dispatch</span>
              </>
            )}
          </div>
        </div>
      </Link>

      {/* Quick Add Section */}
      <div className="p-3.5 pt-0">
        {/* Interactive Size Selector Popup */}
        {showSizePicker && (
          <div
            className="mb-2.5 rounded-xl border border-slate-200 bg-slate-50/90 p-2.5 text-xs animate-in fade-in zoom-in-95 duration-150"
            onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
          >
            <p className="mb-1.5 text-[11px] font-bold text-slate-900">
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
                      ? "border-slate-900 bg-slate-900 text-white shadow-2xs"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
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
