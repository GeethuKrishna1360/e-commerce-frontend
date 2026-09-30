import React from "react";
import { Link } from "react-router-dom";
import {
  Smartphone,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useCart } from "../context/CartContext";

export function Footer() {
  const { setSelectedCategory } = useCart();

  const handleCategoryNav = (cat) => {
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
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#4f46e5] text-white shadow-xs">
                <Truck size={22} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Free Delivery</h4>
                <p className="mt-1 text-xs text-slate-500">
                  Zero delivery charges across 28,000+ Indian pincodes.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#059669] text-white shadow-xs">
                <Sparkles size={22} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Lowest Prices</h4>
                <p className="mt-1 text-xs text-slate-500">
                  Direct sourcing from wholesalers and manufacturers.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-600 text-white shadow-xs">
                <RotateCcw size={22} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">7-Day Easy Returns</h4>
                <p className="mt-1 text-xs text-slate-500">
                  Instant refunds and doorstep pickup without questions.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white shadow-xs">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">100% Safe Payments</h4>
                <p className="mt-1 text-xs text-slate-500">
                  COD & upcoming Razorpay secure online gateways.
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
              <span className="text-3xl font-extrabold tracking-tight font-sans">
                <span className="text-[#4f46e5]">e</span>
                <span className="text-slate-900">-shop</span>
              </span>
              <span className="h-2.5 w-2.5 rounded-full bg-[#06b6d4]" />
            </Link>
            <p className="mt-3 text-xs text-slate-500 leading-relaxed max-w-sm">
              e-shop is your favourite one-stop online shopping destination
              for trendy fashion, electronics, and home essentials at
              unbeatable factory prices.
            </p>

            <div className="mt-5">
              <p className="text-xs font-bold text-slate-900">Shop on the App</p>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-100 cursor-pointer">
                  <Smartphone size={16} className="text-[#4f46e5]" />
                  <span>Google Play</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-100 cursor-pointer">
                  <Smartphone size={16} className="text-[#4f46e5]" />
                  <span>App Store</span>
                </div>
              </div>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Top Categories
            </h5>
            <ul className="mt-3 space-y-2 text-xs text-slate-600">
              <li>
                <button
                  onClick={() => handleCategoryNav("Women Ethnic")}
                  className="hover:text-[#4f46e5]"
                >
                  Women Ethnic Wear
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryNav("Western Wear")}
                  className="hover:text-[#4f46e5]"
                >
                  Western Wear
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryNav("Men")}
                  className="hover:text-[#4f46e5]"
                >
                  Men's Fashion
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryNav("Kids")}
                  className="hover:text-[#4f46e5]"
                >
                  Kids & Baby Wear
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryNav("Home & Kitchen")}
                  className="hover:text-[#4f46e5]"
                >
                  Home & Kitchen
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryNav("Beauty & Footwear")}
                  className="hover:text-[#4f46e5]"
                >
                  Beauty & Footwear
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
                <Link to="/" className="hover:text-[#4f46e5]">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-[#4f46e5]">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-[#4f46e5]">
                  Become a Seller
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-[#4f46e5]">
                  Our Tech Blog
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-[#4f46e5]">
                  Hall of Fame
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
                <Link to="/" className="hover:text-[#4f46e5]">
                  Customer Care
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-[#4f46e5]">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-[#4f46e5]">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-[#4f46e5]">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-[#4f46e5]">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-10 border-t border-slate-100 pt-6 text-center text-xs text-slate-400">
          <p>© 2026 e-shop. Built with React, Tailwind CSS, and Lucide icons.</p>
        </div>
      </div>
    </footer>
  );
}
