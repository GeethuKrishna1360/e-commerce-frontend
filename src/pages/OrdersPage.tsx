import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/useCart";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ArrowRight,
  Copy,
  CheckCheck,
  FileText,
  RotateCcw,
  MapPin,
  ShoppingBag,
} from "lucide-react";
import type { Order } from "../types";

export function OrdersPage() {
  const { orders, addToCart } = useCart();
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  const copyOrderId = (orderId: string) => {
    navigator.clipboard?.writeText(orderId);
    setCopiedOrderId(orderId);
    setTimeout(() => setCopiedOrderId(null), 2000);
  };

  const filteredOrders = orders.filter((order) => {
    if (filterStatus === "all") return true;
    if (filterStatus === "delivered") return order.status === "Delivered";
    if (filterStatus === "active")
      return (
        order.status === "Order Confirmed" ||
        order.status === "Packed" ||
        order.status === "Shipped"
      );
    return true;
  });

  const handleBuyAgain = (order: Order, itemIndex: number = 0) => {
    const item = order.items[itemIndex];
    if (item && item.product) {
      addToCart(item.product, item.size, 1);
      navigate("/cart");
    }
  };

  if (orders.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#fafafa] py-16 flex items-center justify-center">
        <div className="mx-auto max-w-md px-4 text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-slate-100 text-slate-400 shadow-sm">
            <Package size={40} className="stroke-[1.5]" />
          </div>
          <h2 className="mt-6 text-xl font-extrabold text-slate-900 tracking-tight sm:text-2xl">
            No Orders Placed Yet
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
            When you purchase items from e-shop, your order confirmation,
            doorstep tracking, and invoice receipts will appear here.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-7 py-3 text-xs sm:text-sm font-bold text-white shadow-md transition hover:bg-slate-800 active:scale-95"
            >
              <span>Start Shopping</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] pb-20 pt-6">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Header Bar */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs"
            >
              <ChevronLeft size={15} /> Back
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                My Orders
              </h1>
              <p className="text-xs text-slate-500">
                Track shipments, download invoices, and reorder previous items
              </p>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="flex items-center rounded-full border border-slate-200 bg-white p-1 shadow-2xs text-xs font-semibold">
            <button
              onClick={() => setFilterStatus("all")}
              className={`rounded-full px-3.5 py-1.5 transition ${
                filterStatus === "all"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All ({orders.length})
            </button>
            <button
              onClick={() => setFilterStatus("active")}
              className={`rounded-full px-3.5 py-1.5 transition ${
                filterStatus === "active"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              In Transit
            </button>
            <button
              onClick={() => setFilterStatus("delivered")}
              className={`rounded-full px-3.5 py-1.5 transition ${
                filterStatus === "delivered"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Delivered
            </button>
          </div>
        </div>

        {/* Orders Stack */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xs">
              <p className="text-sm font-semibold text-slate-700">
                No orders match the selected filter.
              </p>
              <button
                onClick={() => setFilterStatus("all")}
                className="mt-3 text-xs font-bold text-slate-900 underline"
              >
                View all orders
              </button>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const isDelivered = order.status === "Delivered";
              const isShipped = order.status === "Shipped";

              return (
                <div
                  key={order.orderId}
                  className="rounded-3xl border border-slate-200/80 bg-white shadow-xs overflow-hidden"
                >
                  {/* Order Top Meta Bar */}
                  <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200/70 flex flex-wrap items-center justify-between gap-4 text-xs">
                    <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Order Placed
                        </span>
                        <span className="font-semibold text-slate-800">
                          {order.createdAt}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Total Amount
                        </span>
                        <span className="font-extrabold text-slate-900">
                          ₹{order.totalAmount.toLocaleString("en-IN")}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Reference ID
                        </span>
                        <div className="flex items-center gap-1 font-mono font-bold text-slate-800">
                          <span>{order.orderId}</span>
                          <button
                            onClick={() => copyOrderId(order.orderId)}
                            className="text-slate-400 hover:text-slate-800 p-0.5"
                            title="Copy ID"
                          >
                            {copiedOrderId === order.orderId ? (
                              <CheckCheck size={12} className="text-emerald-600" />
                            ) : (
                              <Copy size={12} />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      {/* Status Badge */}
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                          isDelivered
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80"
                            : isShipped
                            ? "bg-blue-50 text-blue-700 border border-blue-200/80"
                            : "bg-amber-50 text-amber-700 border border-amber-200/80"
                        }`}
                      >
                        {isDelivered ? (
                          <CheckCircle2 size={13} />
                        ) : isShipped ? (
                          <Truck size={13} />
                        ) : (
                          <Clock size={13} />
                        )}
                        <span>{order.status}</span>
                      </span>

                      {/* Download Invoice Button */}
                      <button
                        onClick={() => window.print()}
                        className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                      >
                        <FileText size={13} />
                        <span className="hidden sm:inline">Invoice</span>
                      </button>
                    </div>
                  </div>

                  {/* Order Body */}
                  <div className="p-6">
                    {/* Delivery Timeline Indicator */}
                    <div className="mb-6 rounded-2xl bg-slate-50/60 p-4 border border-slate-100">
                      <div className="flex items-center justify-between text-xs mb-3">
                        <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                          <Truck size={14} className="text-slate-700" />
                          <span>{order.estimatedDelivery}</span>
                        </span>
                        <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                          Mode: {order.paymentMethod.toUpperCase()}
                        </span>
                      </div>

                      {/* Visual progress bar */}
                      <div className="relative h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isDelivered
                              ? "w-full bg-emerald-500"
                              : isShipped
                              ? "w-3/4 bg-blue-500"
                              : "w-1/4 bg-amber-500"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="divide-y divide-slate-100">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                        >
                          <div className="flex items-center gap-4">
                            <img
                              src={
                                item.product?.images?.[0] ||
                                "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80"
                              }
                              alt={item.product?.title || "Item"}
                              className="h-16 w-16 rounded-2xl object-cover object-center shadow-2xs border border-slate-100 shrink-0"
                            />
                            <div>
                              <Link
                                to={`/product/${item.productId}`}
                                className="text-xs sm:text-sm font-bold text-slate-900 hover:underline line-clamp-1"
                              >
                                {item.product?.title || "Curated Product"}
                              </Link>
                              <p className="text-xs text-slate-500 mt-0.5">
                                Option / Size:{" "}
                                <span className="font-semibold text-slate-800">
                                  {item.size}
                                </span>{" "}
                                • Qty:{" "}
                                <span className="font-semibold text-slate-800">
                                  {item.quantity}
                                </span>
                              </p>
                              <p className="text-xs font-extrabold text-slate-900 mt-1">
                                ₹
                                {(
                                  (item.product?.price || 699) * item.quantity
                                ).toLocaleString("en-IN")}
                              </p>
                            </div>
                          </div>

                          {/* Item Action Buttons */}
                          <div className="flex items-center gap-2 self-end sm:self-center">
                            <button
                              type="button"
                              onClick={() => handleBuyAgain(order, idx)}
                              className="flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition active:scale-95"
                            >
                              <ShoppingBag size={13} />
                              <span>Buy Again</span>
                            </button>
                            <Link
                              to={`/product/${item.productId}`}
                              className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                            >
                              <RotateCcw size={12} />
                              <span>View Item</span>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Delivery Destination Footer */}
                    <div className="mt-6 border-t border-slate-100 pt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={13} className="text-slate-400 shrink-0" />
                        <span>
                          Shipped to:{" "}
                          <strong className="text-slate-800">
                            {order.address.fullName}
                          </strong>
                          , {order.address.city} - {order.address.pincode}
                        </span>
                      </div>
                      <span className="text-emerald-700 font-semibold">
                        ✓ 7-Day Doorstep Replacement Guarantee Included
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
