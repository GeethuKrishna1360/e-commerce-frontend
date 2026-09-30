import { Link } from "react-router-dom";
import {
  Smartphone,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useCart } from "../context/useCart";

export function Footer() {
  const { setSelectedCategory } = useCart();

  const handleCategoryNav = (cat: string) => {
    setSelectedCategory(cat);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-slate-200 bg-white text-slate-700">
      {/* Top Banner section */}
      <div className="border-b border-slate-100 bg-[#f8fafc] py-8 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-start gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white shadow-xs">
                <Truck size={20} className="text-emerald-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Free Express Delivery</h4>
                <p className="mt-1 text-xs text-slate-500">
                  Zero shipping charges across 28,000+ Indian postal codes.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white shadow-xs">
                <Sparkles size={20} className="text-amber-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Curated Quality</h4>
                <p className="mt-1 text-xs text-slate-500">
                  Direct sourcing and authentic manufacturer warranties.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white shadow-xs">
                <RotateCcw size={20} className="text-cyan-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">7-Day Easy Returns</h4>
                <p className="mt-1 text-xs text-slate-500">
                  Instant refunds and doorstep pickup without hassle.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white shadow-xs">
                <ShieldCheck size={20} className="text-emerald-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Secure Payments</h4>
                <p className="mt-1 text-xs text-slate-500">
                  Cash on Delivery & encrypted 256-bit online checkouts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          {/* Col 1: Brand & App Download */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-1.5">
              <span className="text-2xl font-extrabold tracking-tight font-sans text-slate-900">
                e<span className="text-emerald-500">.</span>shop
              </span>
            </Link>
            <p className="mt-3 text-xs text-slate-500 leading-relaxed max-w-sm">
              e-shop is a modern digital storefront bringing you high-quality
              wardrobe staples, functional home living, and engineered audio gear.
            </p>

            <div className="mt-5">
              <p className="text-xs font-bold text-slate-900">Experience on Mobile</p>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-100 cursor-pointer">
                  <Smartphone size={16} className="text-slate-900" />
                  <span>Google Play</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-100 cursor-pointer">
                  <Smartphone size={16} className="text-slate-900" />
                  <span>App Store</span>
                </div>
              </div>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Departments
            </h5>
            <ul className="mt-3 space-y-2 text-xs text-slate-600">
              <li>
                <button
                  onClick={() => handleCategoryNav("Women's Wear")}
                  className="hover:text-slate-900"
                >
                  Women's Wear
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryNav("Men's Wear")}
                  className="hover:text-slate-900"
                >
                  Men's Wear
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryNav("Footwear")}
                  className="hover:text-slate-900"
                >
                  Footwear
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryNav("Accessories")}
                  className="hover:text-slate-900"
                >
                  Accessories
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryNav("Home & Living")}
                  className="hover:text-slate-900"
                >
                  Home & Living
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryNav("Tech & Audio")}
                  className="hover:text-slate-900"
                >
                  Tech & Audio
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryNav("Beauty & Wellness")}
                  className="hover:text-slate-900"
                >
                  Beauty & Wellness
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Company */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Company
            </h5>
            <ul className="mt-3 space-y-2 text-xs text-slate-600">
              <li>
                <Link to="/" className="hover:text-slate-900">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-slate-900">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-slate-900">
                  Become a Partner
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-slate-900">
                  Sustainability
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-slate-900">
                  Press & Media
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Help & Legal */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Help & Support
            </h5>
            <ul className="mt-3 space-y-2 text-xs text-slate-600">
              <li>
                <Link to="/" className="hover:text-slate-900">
                  Customer Care
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-slate-900">
                  Shipping & Tracking
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-slate-900">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-slate-900">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-slate-900">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-10 border-t border-slate-100 pt-6 text-center text-xs text-slate-400">
          <p>© 2026 e-shop. Modern Living & Contemporary Goods.</p>
        </div>
      </div>
    </footer>
  );
}
