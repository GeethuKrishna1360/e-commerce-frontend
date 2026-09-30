import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/useCart";
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  Truck,
  Sparkles,
  ChevronLeft,
  Briefcase,
} from "lucide-react";

export function CartPage() {
  const {
    cart,
    cartCount,
    cartTotal,
    cartOriginalTotal,
    cartDiscount,
    updateQuantity,
    removeFromCart,
  } = useCart();

  const navigate = useNavigate();
  const [isReselling, setIsReselling] = useState<boolean>(false);
  const [customerTargetPrice, setCustomerTargetPrice] = useState<number>(cartTotal + 250);

  useEffect(() => {
    setCustomerTargetPrice(cartTotal + 250);
  }, [cartTotal]);

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#fafafa] py-16 flex items-center justify-center">
        <div className="mx-auto max-w-md px-4 text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-slate-100 text-slate-700 shadow-sm">
            <ShoppingBag size={40} />
          </div>
          <h2 className="mt-6 text-xl font-extrabold text-slate-900 tracking-tight sm:text-2xl">
            Your Cart is Empty
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
            Explore our curated catalog of wardrobe essentials, footwear,
            and functional home pieces with complimentary express delivery.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-7 py-3 text-xs sm:text-sm font-bold text-white shadow-md transition hover:bg-slate-800 active:scale-95"
            >
              <Sparkles size={16} />
              <span>Explore Collection</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] pb-20 pt-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs"
            >
              <ChevronLeft size={15} /> Back
            </button>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Shopping Bag ({cartCount})
            </h1>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 px-3.5 py-1 text-xs text-emerald-700 font-semibold">
            <Truck size={14} /> 100% Free Nationwide Delivery Applied
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* LEFT: Items List (7 cols) */}
          <div className="space-y-4 lg:col-span-7">
            {cart.map((item) => (
              <div
                key={item.itemKey}
                className="flex flex-col gap-4 rounded-3xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs transition-all sm:flex-row sm:items-center"
              >
                {/* Thumbnail */}
                <Link
                  to={`/product/${item.id}`}
                  className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-2xl bg-slate-100 sm:w-28"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover object-center"
                  />
                </Link>

                {/* Details */}
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <Link
                        to={`/product/${item.id}`}
                        className="text-xs sm:text-sm font-bold text-slate-800 hover:text-slate-950 line-clamp-2 transition-colors"
                      >
                        {item.title}
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.id, item.selectedSize)}
                        className="text-slate-400 hover:text-rose-500 transition p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-500">
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 font-semibold text-slate-700">
                        Size: {item.selectedSize}
                      </span>
                      <span>•</span>
                      <span>{item.supplierName}</span>
                    </div>

                    {/* Price and discount */}
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                      {item.originalPrice > item.price && (
                        <>
                          <span className="text-xs text-slate-400 line-through">
                            ₹{(item.originalPrice * item.quantity).toLocaleString("en-IN")}
                          </span>
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                            Save {item.discountPercent}%
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Quantity Controller & Free Express Delivery */}
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-medium">Quantity:</span>
                      <div className="flex items-center rounded-full border border-slate-200 bg-slate-50 p-0.5">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.selectedSize,
                              item.quantity - 1
                            )
                          }
                          className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-slate-600 hover:bg-white hover:text-black transition"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.selectedSize,
                              item.quantity + 1
                            )
                          }
                          className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-slate-600 hover:bg-white hover:text-black transition"
                        >
                          <Plus size={11} />
                        </button>
                      </div>
                    </div>

                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <Truck size={12} /> Free Express Delivery
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Shopping Assurance Info */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 text-xs text-slate-600 shadow-2xs">
              <div className="flex items-center gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <p className="font-bold text-slate-900">
                    e-shop Safe & Direct Guarantee
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    100% Payment Protection, direct sourcing, and hassle-free 7-day doorstep returns.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Price Breakdown & CTA Card (5 cols) */}
          <div className="space-y-4 lg:col-span-5">
            <div className="sticky top-28 space-y-4">
              {/* Savings Announcement Banner */}
              {cartDiscount > 0 && (
                <div className="rounded-3xl bg-emerald-50/70 border border-emerald-200/80 p-4 text-emerald-950 shadow-2xs">
                  <div className="flex items-center gap-2.5 font-bold text-xs sm:text-sm text-emerald-900">
                    <Sparkles size={17} className="text-emerald-600" />
                    <span>You're saving ₹{cartDiscount.toLocaleString("en-IN")} on this order!</span>
                  </div>
                </div>
              )}

              {/* Meesho Signature: Reselling Margin Card */}
              <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
                      <Briefcase size={17} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        Reselling this order?
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Add customer price & earn cash margin
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={isReselling}
                      onChange={(e) => setIsReselling(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="h-5 w-9 rounded-full bg-slate-200 peer-checked:bg-emerald-600 transition-colors after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full"></div>
                  </label>
                </div>

                {isReselling && (
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-3 animate-in fade-in duration-200 text-xs">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Cash to collect from customer (₹)
                      </label>
                      <input
                        type="number"
                        min={cartTotal}
                        value={customerTargetPrice}
                        onChange={(e) => setCustomerTargetPrice(Number(e.target.value))}
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-900 focus:border-slate-900 focus:outline-none"
                        placeholder={`Min: ₹${cartTotal}`}
                      />
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-emerald-50/80 p-2.5 text-xs text-emerald-800">
                      <span className="font-medium">Your Profit Margin:</span>
                      <span className="font-extrabold text-sm text-emerald-700">
                        ₹{Math.max(0, customerTargetPrice - cartTotal).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400">
                      The margin will be transferred directly to your bank account after delivery.
                    </p>
                  </div>
                )}
              </div>

              {/* Price Details Card */}
              <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-xs">
                <h3 className="border-b border-slate-100 pb-3 text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Order Summary
                </h3>

                <div className="mt-4 space-y-3 text-xs sm:text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal MRP ({cartCount} items)</span>
                    <span>₹{cartOriginalTotal.toLocaleString("en-IN")}</span>
                  </div>

                  {cartDiscount > 0 && (
                    <div className="flex justify-between text-slate-600">
                      <span>Direct Savings</span>
                      <span className="font-bold text-emerald-600">
                        - ₹{cartDiscount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-600">
                    <span>Estimated Shipping</span>
                    <span className="font-bold text-emerald-600 uppercase text-xs">
                      FREE
                    </span>
                  </div>

                  <div className="border-t border-slate-200 pt-4">
                    <div className="flex justify-between text-base font-extrabold text-slate-900">
                      <span>Total Amount</span>
                      <span>₹{cartTotal.toLocaleString("en-IN")}</span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-400">
                      Inclusive of all taxes, duties, and express handling
                    </p>
                  </div>
                </div>

                {/* Checkout CTA */}
                <div className="mt-6">
                  <button
                    onClick={() => navigate("/checkout")}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 py-3.5 text-xs sm:text-sm font-bold text-white shadow-md transition hover:bg-slate-800 active:scale-98"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-3 text-[11px] text-slate-400 font-medium">
                <span>256-Bit Encrypted</span>
                <span>•</span>
                <span>COD Available</span>
                <span>•</span>
                <span>Doorstep Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
