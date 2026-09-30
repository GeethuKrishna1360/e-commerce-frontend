import { useEffect, useState, type ComponentType } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/useCart";
import {
  Check,
  Package,
  Truck,
  Home,
  ShoppingBag,
  FileText,
  Sparkles,
  MapPin,
  Clock,
  Copy,
  CheckCheck,
} from "lucide-react";

interface TrackingStep {
  title: string;
  description: string;
  status: "completed" | "current" | "upcoming";
  time: string;
  icon: ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
}

export function OrderSuccessPage() {
  const { lastOrder } = useCart();
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const order = lastOrder || {
    orderId: "ESH-948271",
    createdAt: new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    items: [
      {
        id: "1-M",
        productId: 1,
        product: {
          id: 1,
          title: "Minimalist Heavyweight Cotton Oversized Tee",
          category: "Apparel",
          price: 699,
          originalPrice: 1499,
          discountPercent: 53,
          rating: 4.6,
          reviewsCount: 1420,
          images: [
            "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
          ],
          details: {},
          sizes: ["M"],
          description: "",
          inStock: true,
          fastDelivery: true,
        },
        size: "M",
        quantity: 1,
      },
    ],
    totalAmount: 699,
    subtotal: 1499,
    discountSavings: 800,
    paymentMethod: "cod" as const,
    address: {
      fullName: "Priya Sharma",
      phone: "9876543210",
      street: "Flat 402, Sunshine Residency, MG Road",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560001",
    },
    estimatedDelivery: "Delivery within 3-4 Business Days | Free Delivery",
    status: "Order Confirmed" as const,
  };

  const copyOrderId = () => {
    navigator.clipboard?.writeText(order.orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const trackingSteps: TrackingStep[] = [
    {
      title: "Order Confirmed",
      description: "Direct to maker",
      status: "completed",
      time: "Just now",
      icon: Check,
    },
    {
      title: "Quality Check & Pack",
      description: "Inspected at workshop",
      status: "current",
      time: "Tomorrow",
      icon: Package,
    },
    {
      title: "In Transit",
      description: "Express courier dispatch",
      status: "upcoming",
      time: "In 2 days",
      icon: Truck,
    },
    {
      title: "Doorstep Delivery",
      description: "Arrives at your address",
      status: "upcoming",
      time: order.estimatedDelivery.split("|")[0] || "3-4 days",
      icon: Home,
    },
  ];

  const handleDownloadInvoice = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#fafafa] pb-20 pt-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Celebratory Hero Header */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-8 sm:p-10 text-center shadow-xs">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-900 text-white shadow-md animate-in zoom-in-75 duration-300">
            <Check size={32} strokeWidth={2.5} className="text-emerald-400" />
          </div>

          <h1 className="mt-5 text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Order Confirmed!
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            Thank you for shopping with e-shop. Your order has been placed directly
            with our verified maker and will be dispatched soon.
          </p>

          {/* Order ID Pill with Copy button */}
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs font-bold text-slate-800 shadow-2xs">
            <Sparkles size={13} className="text-emerald-500" />
            <span>Order Reference: {order.orderId}</span>
            <button
              onClick={copyOrderId}
              className="ml-1 text-slate-400 hover:text-slate-800 transition"
              title="Copy Order ID"
            >
              {copied ? (
                <CheckCheck size={14} className="text-emerald-600" />
              ) : (
                <Copy size={13} />
              )}
            </button>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-7 py-3 text-xs sm:text-sm font-bold text-white shadow-md transition hover:bg-slate-800 active:scale-95"
            >
              <ShoppingBag size={15} />
              <span>Continue Shopping</span>
            </Link>
            <button
              onClick={handleDownloadInvoice}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-50 active:scale-95"
            >
              <FileText size={15} />
              <span>Download Invoice</span>
            </button>
          </div>
        </div>

        {/* 4-Step Visual Delivery Tracking Timeline */}
        <div className="mt-6 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock size={16} className="text-slate-700" />
              Delivery Progress
            </h2>
            <span className="text-xs font-semibold text-emerald-600">
              {order.estimatedDelivery}
            </span>
          </div>

          <div className="mt-6 relative">
            {/* Desktop Horizontal Stepper */}
            <div className="hidden sm:grid sm:grid-cols-4 gap-4 relative">
              {/* Connector line */}
              <div className="absolute top-5 left-10 right-10 h-0.5 bg-slate-100 z-0">
                <div className="h-full bg-emerald-500 w-1/4" />
              </div>

              {trackingSteps.map((step, idx) => {
                const IconComponent = step.icon;
                const isDone = step.status === "completed";
                const isCurrent = step.status === "current";

                return (
                  <div key={idx} className="relative z-10 flex flex-col items-center text-center">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-2xl border-2 transition ${
                        isDone
                          ? "border-emerald-500 bg-emerald-500 text-white shadow-xs"
                          : isCurrent
                          ? "border-slate-900 bg-white text-slate-900 ring-4 ring-slate-100"
                          : "border-slate-200 bg-white text-slate-400"
                      }`}
                    >
                      <IconComponent size={16} />
                    </div>
                    <span
                      className={`mt-3 text-xs font-bold ${
                        isDone || isCurrent ? "text-slate-900" : "text-slate-400"
                      }`}
                    >
                      {step.title}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-0.5">
                      {step.time}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Mobile Vertical Stepper */}
            <div className="sm:hidden space-y-6 border-l-2 border-emerald-500 ml-4 pl-4">
              {trackingSteps.map((step, idx) => {
                const IconComponent = step.icon;
                const isDone = step.status === "completed";
                const isCurrent = step.status === "current";

                return (
                  <div key={idx} className="relative flex items-start gap-3.5">
                    <div
                      className={`-ml-[25px] flex h-8 w-8 items-center justify-center rounded-xl border-2 ${
                        isDone
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : isCurrent
                          ? "border-slate-900 bg-white text-slate-900 ring-2 ring-slate-100"
                          : "border-slate-200 bg-white text-slate-400"
                      }`}
                    >
                      <IconComponent size={14} />
                    </div>
                    <div>
                      <p
                        className={`text-xs font-bold ${
                          isDone || isCurrent ? "text-slate-900" : "text-slate-400"
                        }`}
                      >
                        {step.title}
                      </p>
                      <p className="text-[11px] text-slate-500">{step.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Details & Summary Card */}
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Purchased Items List */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-xs">
            <h3 className="border-b border-slate-100 pb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
              Purchased Items ({order.items.length})
            </h3>
            <div className="divide-y divide-slate-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3.5 py-3">
                  <img
                    src={item.product?.images?.[0] || ""}
                    alt={item.product?.title || "Product"}
                    className="h-14 w-14 rounded-2xl object-cover shadow-2xs"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-xs font-bold text-slate-900">
                      {item.product?.title}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Size: {item.size} • Qty: {item.quantity}
                    </p>
                    <p className="text-xs font-extrabold text-slate-900 mt-1">
                      ₹{((item.product?.price || 0) * item.quantity).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t border-slate-100 pt-3 text-xs space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Total Amount Paid</span>
                <span className="font-extrabold text-slate-900">
                  ₹{order.totalAmount.toLocaleString("en-IN")}
                </span>
              </div>
              {order.discountSavings > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Total Savings</span>
                  <span className="font-bold">
                    ₹{order.discountSavings.toLocaleString("en-IN")}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Payment Mode</span>
                <span className="font-semibold text-slate-900 uppercase">
                  {order.paymentMethod}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery Address & Status */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="border-b border-slate-100 pb-3 text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <MapPin size={15} className="text-slate-700" />
                Shipping Destination
              </h3>
              <div className="mt-3.5 text-xs leading-relaxed text-slate-700 space-y-1">
                <p className="font-bold text-slate-900 text-sm">
                  {order.address.fullName}
                </p>
                <p>{order.address.street}</p>
                <p>
                  {order.address.city}, {order.address.state} -{" "}
                  <strong className="text-slate-900">
                    {order.address.pincode}
                  </strong>
                </p>
                <p className="text-slate-400 pt-1">
                  Contact: +91 {order.address.phone}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-slate-50 p-3.5 text-xs text-slate-800 border border-slate-200">
              <p className="font-bold flex items-center gap-1.5 text-slate-900">
                <Truck size={14} className="text-emerald-600" /> Estimated Arrival
              </p>
              <p className="mt-1 text-slate-500 text-[11px]">
                {order.estimatedDelivery}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
