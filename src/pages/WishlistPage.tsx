import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/useCart";
import {
  Heart,
  ShoppingBag,
  Trash2,
  ArrowRight,
  ChevronLeft,
  Star,
  Check,
  Truck,
} from "lucide-react";
import type { Product } from "../types";

export function WishlistPage() {
  const { wishlist, removeFromWishlist, addToCart, cartCount } = useCart();
  const navigate = useNavigate();
  const [selectedSizes, setSelectedSizes] = useState<Record<number, string>>({});
  const [addedItemIds, setAddedItemIds] = useState<Record<number, boolean>>({});

  const handleSizeChange = (productId: number, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const handleMoveToCart = (product: Product) => {
    const size =
      selectedSizes[product.id] ||
      (product.sizes && product.sizes[0]) ||
      "Free Size";

    addToCart(product, size, 1);
    removeFromWishlist(product.id);

    setAddedItemIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1200);
  };

  if (wishlist.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#fafafa] py-16 flex items-center justify-center">
        <div className="mx-auto max-w-md px-4 text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-slate-100 text-slate-400 shadow-sm">
            <Heart size={40} className="stroke-[1.5]" />
          </div>
          <h2 className="mt-6 text-xl font-extrabold text-slate-900 tracking-tight sm:text-2xl">
            Your Wishlist is Empty
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
            Tap the heart icon on any piece you love to save it here for later.
            Keep track of wardrobe essentials and special editions.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-7 py-3 text-xs sm:text-sm font-bold text-white shadow-md transition hover:bg-slate-800 active:scale-95"
            >
              <span>Explore Collection</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] pb-20 pt-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header Bar */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs"
            >
              <ChevronLeft size={15} /> Back
            </button>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Saved Wishlist
              </h1>
              <span className="rounded-full bg-slate-100 px-3 py-0.5 text-xs font-semibold text-slate-600">
                {wishlist.length} item{wishlist.length === 1 ? "" : "s"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/cart"
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-800 shadow-2xs hover:bg-slate-50"
            >
              <ShoppingBag size={14} />
              <span>Bag ({cartCount})</span>
            </Link>
            <Link
              to="/"
              className="flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-800"
            >
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-2 gap-3.5 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {wishlist.map((product) => {
            const currentSize =
              selectedSizes[product.id] ||
              (product.sizes && product.sizes[0]) ||
              "Free Size";
            const isAdded = addedItemIds[product.id];

            return (
              <div
                key={product.id}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xs transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-0.5"
              >
                <div>
                  {/* Product Image */}
                  <div className="relative aspect-4/5 w-full overflow-hidden bg-slate-100">
                    <Link to={`/product/${product.id}`} className="block h-full w-full">
                      <img
                        src={product.images?.[0]}
                        alt={product.title}
                        className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </Link>

                    {/* Remove from Wishlist Button */}
                    <button
                      type="button"
                      onClick={() => removeFromWishlist(product.id)}
                      className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-md transition hover:bg-rose-50 hover:text-rose-600 text-slate-500 active:scale-95"
                      title="Remove from wishlist"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 size={14} />
                    </button>

                    {/* Category Tag */}
                    <div className="absolute bottom-2.5 left-2.5">
                      <span className="rounded-full bg-slate-900/80 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-semibold text-white">
                        {product.category}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-3.5">
                    {/* Rating & Delivery */}
                    <div className="flex items-center gap-1.5 text-xs">
                      <div className="flex items-center gap-1 font-semibold text-slate-800">
                        <Star size={12} className="fill-amber-400 text-amber-400" />
                        <span>{product.rating}</span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        ({product.reviewsCount.toLocaleString()})
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-0.5">
                        <Truck size={11} /> Free Delivery
                      </span>
                    </div>

                    {/* Title */}
                    <Link to={`/product/${product.id}`}>
                      <h3
                        title={product.title}
                        className="mt-1.5 line-clamp-2 text-xs sm:text-sm font-semibold text-slate-800 leading-snug group-hover:text-slate-950 transition-colors"
                      >
                        {product.title}
                      </h3>
                    </Link>

                    {/* Pricing */}
                    <div className="mt-2.5 flex items-baseline gap-2">
                      <span className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
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

                    {/* Size Selector (If multiple sizes available) */}
                    {product.sizes && product.sizes.length > 1 && (
                      <div className="mt-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          Size:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {product.sizes.map((sz) => (
                            <button
                              key={sz}
                              type="button"
                              onClick={() => handleSizeChange(product.id, sz)}
                              className={`rounded-lg border px-2 py-0.5 text-[10px] font-semibold transition ${
                                currentSize === sz
                                  ? "border-slate-900 bg-slate-900 text-white"
                                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
                              }`}
                            >
                              {sz}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Move to Bag Action */}
                <div className="p-3.5 pt-0">
                  <button
                    type="button"
                    onClick={() => handleMoveToCart(product)}
                    className={`flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold tracking-wide transition-all active:scale-98 ${
                      isAdded
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "bg-slate-900 text-white hover:bg-slate-800 shadow-sm"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check size={14} /> Moved to Bag
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={14} /> Move to Bag
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
