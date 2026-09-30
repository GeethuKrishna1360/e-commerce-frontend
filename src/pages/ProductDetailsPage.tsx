import {
  useState,
  useEffect,
  type FormEvent,
  type ChangeEvent,
} from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { mockProducts } from "../data/mockProducts";
import { useCart } from "../context/useCart";
import { ProductCard } from "../components/ProductCard";
import type { Product } from "../types";
import {
  Star,
  Heart,
  Truck,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  MapPin,
  ShoppingBag,
  Zap,
  Share2,
} from "lucide-react";

export function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    addToCart,
    toggleWishlist,
    isWishlisted,
    pincode,
    deliveryEstimate,
    checkPincode,
    showToast,
  } = useCart();

  const product = mockProducts.find((p) => p.id === Number(id));

  // State hooks
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [inputPincode, setInputPincode] = useState<string>(pincode || "560001");
  const [pincodeSuccessMsg, setPincodeSuccessMsg] = useState<string>("");
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isFollowingSupplier, setIsFollowingSupplier] = useState<boolean>(false);

  // Set initial selected size when product changes
  useEffect(() => {
    if (product && product.sizes && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0]);
    }
    setSelectedImageIndex(0);
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id, product]);

  if (!product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <h2 className="text-xl font-bold text-slate-900">Product Not Found</h2>
        <p className="mt-2 text-xs text-slate-500">
          The product you are looking for does not exist or may have been removed.
        </p>
        <Link
          to="/"
          className="mt-6 rounded-full bg-slate-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  const isFavorite = isWishlisted(product.id);

  // Handle Pincode Check
  const handleCheckPincode = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputPincode.trim().length === 6) {
      checkPincode(inputPincode);
      setPincodeSuccessMsg(`Eligible for Free Doorstep Delivery to ${inputPincode}`);
    } else {
      setPincodeSuccessMsg("Please enter a valid 6-digit Pincode");
    }
  };

  const handleAddToCart = () => {
    addToCart(product, selectedSize, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, quantity);
    navigate("/checkout");
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Recommended products in the same category
  const similarProducts: Product[] = mockProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-[#fafafa] pb-20">
      {/* Modern Breadcrumb */}
      <div className="border-b border-slate-200/60 bg-white/60 backdrop-blur-xs">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 text-xs text-slate-500 sm:px-6">
          <Link to="/" className="hover:text-slate-900 transition">
            Home
          </Link>
          <ChevronRight size={13} className="text-slate-300" />
          <Link to="/" className="hover:text-slate-900 transition">
            {product.category}
          </Link>
          <ChevronRight size={13} className="text-slate-300" />
          <span className="truncate max-w-[220px] sm:max-w-md text-slate-800 font-semibold">
            {product.title}
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* LEFT: Image Gallery Showcase (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 space-y-4">
              {/* Main Image */}
              <div className="relative aspect-4/5 w-full overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
                <img
                  src={product.images[selectedImageIndex] || product.images[0]}
                  alt={product.title}
                  className="h-full w-full object-cover object-center"
                />

                {/* Floating Actions */}
                <div className="absolute right-3.5 top-3.5 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => toggleWishlist(product)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-md transition hover:scale-110 active:scale-95"
                    aria-label="Wishlist toggle"
                  >
                    <Heart
                      size={18}
                      className={
                        isFavorite
                          ? "fill-rose-500 text-rose-500"
                          : "text-slate-700 hover:text-slate-900"
                      }
                    />
                  </button>
                  <button
                    type="button"
                    onClick={handleShare}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-md transition hover:scale-110 active:scale-95"
                    aria-label="Share product link"
                  >
                    <Share2 size={16} className="text-slate-700 hover:text-slate-900" />
                  </button>
                </div>

                {isCopied && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-slate-900/90 backdrop-blur-xs px-4 py-1.5 text-xs font-semibold text-white shadow-md">
                    Link copied to clipboard!
                  </div>
                )}
              </div>

              {/* Clickable Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto pb-1">
                  {product.images.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative aspect-square w-20 shrink-0 overflow-hidden rounded-2xl border-2 transition-all ${
                        selectedImageIndex === idx
                          ? "border-slate-900 ring-2 ring-slate-900/20 shadow-xs"
                          : "border-slate-200/80 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`Thumbnail ${idx + 1}`}
                        className="h-full w-full object-cover object-center"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* CTAs */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white py-3.5 text-xs sm:text-sm font-bold text-slate-800 shadow-2xs transition hover:bg-slate-50 hover:border-slate-400 active:scale-98"
                >
                  <ShoppingBag size={17} />
                  <span>Add to Cart</span>
                </button>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="flex items-center justify-center gap-2 rounded-full bg-slate-900 py-3.5 text-xs sm:text-sm font-bold text-white shadow-md transition hover:bg-slate-800 active:scale-98"
                >
                  <Zap size={17} />
                  <span>Buy Now</span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Product Specs & Options (7 Cols) */}
          <div className="space-y-6 lg:col-span-7">
            {/* 1. Header Information */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-800">
                  {product.category}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-emerald-600 font-semibold">
                  In Stock & Ready to Ship
                </span>
              </div>

              <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                {product.title}
              </h1>

              {/* Rating and Delivery Badge */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <div className="inline-flex items-center gap-1 rounded-md bg-emerald-700 px-2 py-0.5 text-xs font-bold text-white shadow-2xs">
                  <span>{product.rating}</span>
                  <Star size={11} className="fill-white text-white" />
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  {product.reviewsCount?.toLocaleString()} Ratings, {Math.round(product.reviewsCount * 0.22)} Reviews
                </span>
                <span className="text-slate-300">•</span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                  <Truck size={13} /> Free Delivery
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-medium text-slate-600">
                  COD Available
                </span>
              </div>

              {/* Pricing breakdown */}
              <div className="flex items-baseline gap-3 pt-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-base text-slate-400 line-through">
                      ₹{product.originalPrice.toLocaleString("en-IN")}
                    </span>
                    <span className="rounded-full bg-emerald-50 border border-emerald-200/60 px-3 py-1 text-xs font-bold text-emerald-700">
                      Save {product.discountPercent}%
                    </span>
                  </>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                All taxes & customs duties included. Free delivery nationwide.
              </p>
            </div>

            {/* 2. Size & Quantity Selection */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Select Size / Option
                </h3>
                <span className="text-xs font-semibold text-slate-700 hover:underline cursor-pointer">
                  Size Guide & Measurements
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`rounded-2xl border px-5 py-2.5 text-xs font-bold transition-all ${
                      selectedSize === sz
                        ? "border-slate-900 bg-slate-900 text-white shadow-xs"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4 border-t border-slate-100 pt-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Quantity
                </span>
                <div className="flex items-center rounded-full border border-slate-200 bg-slate-50 p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold text-slate-600 hover:bg-white hover:text-black transition"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-slate-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold text-slate-600 hover:bg-white hover:text-black transition"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Delivery Pincode Checker */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                <MapPin size={15} className="text-slate-700" />
                <span>Estimated Delivery & COD Availability</span>
              </div>

              <form onSubmit={handleCheckPincode} className="flex max-w-sm gap-2 pt-1">
                <input
                  type="text"
                  maxLength={6}
                  value={inputPincode}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setInputPincode(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="Enter 6-digit Pincode"
                  className="w-full rounded-full border border-slate-200 px-4 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-800/20"
                />
                <button
                  type="submit"
                  className="rounded-full bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800 transition active:scale-95"
                >
                  Verify
                </button>
              </form>

              <div className="space-y-1.5 pt-1 text-xs">
                <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                  <CheckCircle2 size={15} />
                  <span>{deliveryEstimate}</span>
                </div>
                {pincodeSuccessMsg && (
                  <p className="text-[11px] text-slate-500">{pincodeSuccessMsg}</p>
                )}
                <div className="flex items-center gap-3 text-slate-500 pt-1 text-[11px]">
                  <span>✓ Cash on Delivery Available</span>
                  <span>•</span>
                  <span>✓ 7-Day Easy Returns</span>
                </div>
              </div>
            </div>

            {/* 4. Specifications */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Product Details & Specifications
              </h3>
              <p className="text-xs leading-relaxed text-slate-600">
                {product.description}
              </p>

              <div className="grid grid-cols-2 gap-y-3 gap-x-4 border-t border-slate-100 pt-4 text-xs">
                {Object.entries(product.details || {}).map(([key, val]) => (
                  <div key={key}>
                    <span className="text-slate-400 block text-[11px]">{key}</span>
                    <span className="font-semibold text-slate-800">{val}</span>
                  </div>
                ))}
                <div>
                  <span className="text-slate-400 block text-[11px]">Curated By</span>
                  <span className="font-semibold text-slate-900">
                    e-shop Verified Direct
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Doorstep Guarantee</span>
                  <span className="font-semibold text-emerald-600">
                    7 Days Return & Replacement
                  </span>
                </div>
              </div>
            </div>

            {/* 5. Trust Assurances */}
            <div className="grid grid-cols-3 gap-3 rounded-3xl border border-slate-200/80 bg-white p-5 text-center shadow-xs">
              <div className="flex flex-col items-center">
                <ShieldCheck size={22} className="text-slate-900" />
                <span className="mt-1.5 text-xs font-bold text-slate-800">Direct Prices</span>
                <span className="text-[10px] text-slate-400">Zero Middleman Markup</span>
              </div>
              <div className="flex flex-col items-center border-x border-slate-100">
                <Truck size={22} className="text-emerald-600" />
                <span className="mt-1.5 text-xs font-bold text-slate-800">100% Free Shipping</span>
                <span className="text-[10px] text-slate-400">Nationwide Express</span>
              </div>
              <div className="flex flex-col items-center">
                <RotateCcw size={22} className="text-cyan-600" />
                <span className="mt-1.5 text-xs font-bold text-slate-800">7-Day Returns</span>
                <span className="text-[10px] text-slate-400">Doorstep Pickup</span>
              </div>
            </div>

            {/* 6. Supplier / Seller Hub Information (Meesho Trademark Feature) */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Sold By / Supplier Profile
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                  <ShieldCheck size={12} /> Verified Manufacturer
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white font-bold text-base shadow-sm">
                    {(product.supplier?.name || "ES").slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {product.supplier?.name || "Apex Urban Loom"}
                    </h4>
                    <div className="mt-1 flex items-center gap-2 text-xs">
                      <div className="inline-flex items-center gap-1 rounded-md bg-emerald-700 px-1.5 py-0.5 text-[10px] font-bold text-white shadow-2xs">
                        <span>{product.supplier?.rating || 4.6}</span>
                        <Star size={9} className="fill-white text-white" />
                      </div>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500 font-medium">
                        {product.supplier?.followers || "24.5k"} Followers
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsFollowingSupplier((prev) => !prev);
                      showToast(
                        isFollowingSupplier
                          ? `Unfollowed ${product.supplier?.name || "Supplier"}`
                          : `Following ${product.supplier?.name || "Supplier"} for updates & new drops!`
                      );
                    }}
                    className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                      isFollowingSupplier
                        ? "border border-slate-300 bg-slate-100 text-slate-800"
                        : "border border-slate-900 bg-slate-900 text-white hover:bg-slate-800 shadow-2xs"
                    }`}
                  >
                    {isFollowingSupplier ? "Following ✓" : "+ Follow Shop"}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 rounded-2xl bg-slate-50/80 p-3 text-center text-xs">
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-semibold">Catalog</span>
                  <span className="font-bold text-slate-800">
                    {product.supplier?.productsCount || 128} Products
                  </span>
                </div>
                <div className="border-x border-slate-200/80">
                  <span className="block text-[10px] text-slate-400 uppercase font-semibold">Speed</span>
                  <span className="font-bold text-emerald-700">
                    98% On-Time
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-semibold">Quality</span>
                  <span className="font-bold text-slate-800">e-Shop Assured</span>
                </div>
              </div>
            </div>

            {/* 7. Customer Ratings & Real Reviews Breakdown */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Customer Ratings & Reviews
                </h3>
                <span className="text-xs font-semibold text-emerald-700">
                  100% Verified Purchases
                </span>
              </div>

              {/* Score and Bar Distribution */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                <div className="sm:col-span-4 text-center sm:text-left border-b sm:border-b-0 sm:border-r border-slate-100 pb-4 sm:pb-0 sm:pr-4">
                  <div className="inline-flex items-center gap-1.5 rounded-2xl bg-emerald-700 px-4 py-2 text-2xl font-black text-white shadow-xs">
                    <span>{product.rating}</span>
                    <Star size={20} className="fill-white text-white" />
                  </div>
                  <p className="mt-2 text-xs font-bold text-slate-900">
                    Excellent Customer Rating
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Based on {product.reviewsCount?.toLocaleString()} verified customer ratings
                  </p>
                </div>

                <div className="sm:col-span-8 space-y-1.5 text-xs">
                  {[
                    { stars: 5, pct: "68%" },
                    { stars: 4, pct: "20%" },
                    { stars: 3, pct: "7%" },
                    { stars: 2, pct: "3%" },
                    { stars: 1, pct: "2%" },
                  ].map((row) => (
                    <div key={row.stars} className="flex items-center gap-2">
                      <span className="w-6 font-semibold text-slate-600">{row.stars} ★</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-emerald-600"
                          style={{ width: row.pct }}
                        />
                      </div>
                      <span className="w-10 text-right text-[11px] text-slate-400">{row.pct}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verified Customer Reviews List */}
              <div className="space-y-3 border-t border-slate-100 pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Recent Verified Reviews
                </h4>
                {(product.reviews || []).map((rev) => (
                  <div
                    key={rev.id}
                    className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="inline-flex items-center gap-0.5 rounded-md bg-emerald-700 px-1.5 py-0.5 text-[10px] font-bold text-white">
                          <span>{rev.rating}</span>
                          <Star size={9} className="fill-white text-white" />
                        </div>
                        <span className="font-bold text-slate-900">{rev.userName}</span>
                        <span className="rounded-full bg-emerald-100/70 text-emerald-800 text-[10px] px-2 py-0.5 font-semibold">
                          Verified Purchase
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">{rev.date}</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{rev.comment}</p>
                    <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                      <span>Helpful ({rev.helpfulCount})</span>
                      <span className="text-slate-500 font-medium">e-Shop Direct Buyer</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <section className="mt-16 border-t border-slate-200/80 pt-10">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  You May Also Like
                </h2>
                <p className="text-xs text-slate-500">
                  Handpicked matching items from our {product.category} collection
                </p>
              </div>
              <Link
                to="/"
                className="text-xs font-semibold text-slate-900 hover:underline"
              >
                Browse All &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-5">
              {similarProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
