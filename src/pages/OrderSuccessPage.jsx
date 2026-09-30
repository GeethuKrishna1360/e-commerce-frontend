import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
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

export function OrderSuccessPage() {
  const { lastOrder } = useCart();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const order = lastOrder || {
    orderId: "ESH-948271",
    orderDate: new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    items: [
      {
        id: 1,
        title: "Embroidered Georgette Anarkali Kurta Set With Dupatta",
        price: 499,
        originalPrice: 1499,
        selectedSize: "M",
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80",
        supplierName: "Royal Ethnic Creations",
      },
    ],
    totalAmount: 499,
    discount: 1000,
    paymentMethod: "Cash on Delivery",
    deliveryAddress: {
      fullName: "Priya Sharma",
      phone: "9876543210",
      houseNo: "Flat 402, Sunshine Residency",
      roadName: "MG Road, Near Brigade Towers",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560001",
    },
    estimatedDelivery: "Delivery by Friday, 3 Oct | Free Delivery",
  };

  const copyOrderId = () => {
    navigator.clipboard?.writeText(order.orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const trackingSteps = [
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
      description: "Courier express dispatch",
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
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-lg shadow-emerald-500/25 animate-in zoom-in-75 duration-300">
            <Check size={32} strokeWidth={2.5} />
          </div>

          <h1 className="mt-5 text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Order Confirmed!
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            Thank you for shopping with e-shop. Your order has been placed directly
            with our verified maker and will be dispatched soon.
          </p>

          {/* Order ID Pill with Copy button */}
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/70 px-4 py-1.5 text-xs font-bold text-indigo-700 shadow-2xs">
            <Sparkles size={13} />
            <span>Order Reference: {order.orderId}</span>
            <button
              onClick={copyOrderId}
              className="ml-1 text-indigo-400 hover:text-indigo-800 transition"
              title="Copy Order ID"
            >
              {copied ? <CheckCheck size={14} className="text-emerald-600" /> : <Copy size={13} />}
            </button>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-7 py-3 text-xs sm:text-sm font-bold text-white shadow-md transition hover:bg-indigo-600 active:scale-95"
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
              <Clock size={16} className="text-indigo-600" />
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
                          ? "border-indigo-600 bg-white text-indigo-600 ring-4 ring-indigo-50"
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
                          ? "border-indigo-600 bg-white text-indigo-600 ring-2 ring-indigo-50"
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
                    src={item.image}
                    alt={item.title}
                    className="h-14 w-14 rounded-2xl object-cover shadow-2xs"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-xs font-bold text-slate-900">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Size: {item.selectedSize} • Qty: {item.quantity}
                    </p>
                    <p className="text-xs font-extrabold text-slate-900 mt-1">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t border-slate-100 pt-3 text-xs space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Total Amount Paid</span>
                <span className="font-extrabold text-slate-900">
                  ₹{order.totalAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-emerald-600">
                <span>Total Savings</span>
                <span className="font-bold">
                  ₹{(order.discount || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Payment Mode</span>
                <span className="font-semibold text-slate-900">
                  {order.paymentMethod}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery Address & Status */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="border-b border-slate-100 pb-3 text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <MapPin size={15} className="text-indigo-600" />
                Shipping Destination
              </h3>
              <div className="mt-3.5 text-xs leading-relaxed text-slate-700 space-y-1">
                <p className="font-bold text-slate-900 text-sm">
                  {order.deliveryAddress.fullName}
                </p>
                <p>{order.deliveryAddress.houseNo}</p>
                <p>{order.deliveryAddress.roadName}</p>
                <p>
                  {order.deliveryAddress.city}, {order.deliveryAddress.state} -{" "}
                  <strong className="text-slate-900">
                    {order.deliveryAddress.pincode}
                  </strong>
                </p>
                <p className="text-slate-400 pt-1">
                  Contact: +91 {order.deliveryAddress.phone}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-indigo-50/70 p-3.5 text-xs text-indigo-900 border border-indigo-100">
              <p className="font-bold flex items-center gap-1.5 text-indigo-700">
                <Truck size={14} /> Estimated Arrival
              </p>
              <p className="mt-1 text-slate-600 text-[11px]">
                {order.estimatedDelivery}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
