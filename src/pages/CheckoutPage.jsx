import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  MapPin,
  CreditCard,
  Lock,
  ShieldCheck,
  ChevronLeft,
  Banknote,
  Smartphone,
  Building,
  CheckCircle2,
} from "lucide-react";

export function CheckoutPage() {
  const {
    cart,
    cartCount,
    cartTotal,
    cartOriginalTotal,
    cartDiscount,
    clearCart,
    setLastOrder,
    deliveryEstimate,
  } = useCart();

  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <h2 className="text-xl font-bold text-slate-800">Your Cart is Empty</h2>
        <p className="mt-2 text-xs text-slate-500">
          Please add items to your cart before proceeding to checkout.
        </p>
        <Link
          to="/"
          className="mt-6 rounded-full bg-slate-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-indigo-600 transition"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  // Address Form State
  const [formData, setFormData] = useState({
    fullName: "Priya Sharma",
    phone: "9876543210",
    pincode: "560001",
    houseNo: "Flat 402, Sunshine Residency",
    roadName: "MG Road, Near Brigade Towers",
    city: "Bengaluru",
    state: "Karnataka",
  });

  const [formErrors, setFormErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = "Full Name is required";
    if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone.trim())) {
      errors.phone = "Enter a valid 10-digit mobile number";
    }
    if (!formData.pincode.trim() || !/^\d{6}$/.test(formData.pincode.trim())) {
      errors.pincode = "Enter a valid 6-digit Pincode";
    }
    if (!formData.houseNo.trim()) errors.houseNo = "House / Flat number is required";
    if (!formData.roadName.trim()) errors.roadName = "Street or Colony is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.state.trim()) errors.state = "State is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      window.scrollTo({ top: 120, behavior: "smooth" });
      return;
    }

    setIsPlacingOrder(true);

    // Simulate 1-second order processing loader
    setTimeout(() => {
      const generatedOrderId = `ESH-${Math.floor(100000 + Math.random() * 900000)}`;

      const orderPayload = {
        orderId: generatedOrderId,
        orderDate: new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        items: [...cart],
        cartCount,
        totalAmount: cartTotal,
        originalTotal: cartOriginalTotal,
        discount: cartDiscount,
        deliveryFee: 0,
        paymentMethod:
          paymentMethod === "cod"
            ? "Cash on Delivery"
            : paymentMethod === "upi"
            ? "UPI"
            : paymentMethod === "card"
            ? "Card"
            : "Netbanking",
        deliveryAddress: { ...formData },
        estimatedDelivery: deliveryEstimate || "Delivery within 3-4 Business Days",
      };

      setLastOrder(orderPayload);
      clearCart();
      setIsPlacingOrder(false);
      navigate("/order-success");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] pb-20 pt-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between border-b border-slate-200/80 pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/cart")}
              className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs"
            >
              <ChevronLeft size={15} /> Back to Bag
            </button>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Express Checkout
            </h1>
          </div>

          {/* Stepper Indicator */}
          <div className="hidden sm:flex items-center gap-3 text-xs font-bold">
            <span className="flex items-center gap-1.5 rounded-full bg-slate-900 text-white px-3 py-1">
              <span>1</span> Address
            </span>
            <span className="text-slate-300">&rarr;</span>
            <span className="flex items-center gap-1.5 rounded-full bg-indigo-50 text-indigo-700 px-3 py-1">
              <span>2</span> Payment
            </span>
            <span className="text-slate-300">&rarr;</span>
            <span className="text-slate-400">3. Confirmation</span>
          </div>
        </div>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* LEFT: Address & Payment Methods (7 Cols) */}
            <div className="space-y-6 lg:col-span-7">
              {/* SECTION 1: Delivery Address */}
              <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-xs">
                <div className="flex items-center gap-2.5 text-sm font-bold text-slate-900">
                  <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-slate-900 text-xs font-bold text-white">
                    1
                  </div>
                  <MapPin size={17} className="text-indigo-600" />
                  <span>Delivery Address</span>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Full Name */}
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="e.g. Priya Sharma"
                      className={`mt-1.5 w-full rounded-xl border px-3.5 py-2.5 text-xs text-slate-800 transition focus:outline-none ${
                        formErrors.fullName
                          ? "border-red-500 focus:border-red-500"
                          : "border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                      }`}
                    />
                    {formErrors.fullName && (
                      <p className="mt-1 text-[11px] text-red-500 font-medium">
                        {formErrors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Mobile Number */}
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      maxLength={10}
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="10-digit mobile number"
                      className={`mt-1.5 w-full rounded-xl border px-3.5 py-2.5 text-xs text-slate-800 transition focus:outline-none ${
                        formErrors.phone
                          ? "border-red-500 focus:border-red-500"
                          : "border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                      }`}
                    />
                    {formErrors.phone && (
                      <p className="mt-1 text-[11px] text-red-500 font-medium">
                        {formErrors.phone}
                      </p>
                    )}
                  </div>

                  {/* House / Flat / Building */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700">
                      House / Flat / Apartment No. *
                    </label>
                    <input
                      type="text"
                      name="houseNo"
                      value={formData.houseNo}
                      onChange={handleInputChange}
                      placeholder="e.g. Flat 402, Sunshine Residency"
                      className={`mt-1.5 w-full rounded-xl border px-3.5 py-2.5 text-xs text-slate-800 transition focus:outline-none ${
                        formErrors.houseNo
                          ? "border-red-500 focus:border-red-500"
                          : "border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                      }`}
                    />
                    {formErrors.houseNo && (
                      <p className="mt-1 text-[11px] text-red-500 font-medium">
                        {formErrors.houseNo}
                      </p>
                    )}
                  </div>

                  {/* Road / Area / Colony */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700">
                      Street / Area / Landmark *
                    </label>
                    <input
                      type="text"
                      name="roadName"
                      value={formData.roadName}
                      onChange={handleInputChange}
                      placeholder="e.g. Near Brigade Towers, MG Road"
                      className={`mt-1.5 w-full rounded-xl border px-3.5 py-2.5 text-xs text-slate-800 transition focus:outline-none ${
                        formErrors.roadName
                          ? "border-red-500 focus:border-red-500"
                          : "border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                      }`}
                    />
                    {formErrors.roadName && (
                      <p className="mt-1 text-[11px] text-red-500 font-medium">
                        {formErrors.roadName}
                      </p>
                    )}
                  </div>

                  {/* Pincode */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      maxLength={6}
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder="6 digits"
                      className={`mt-1.5 w-full rounded-xl border px-3.5 py-2.5 text-xs text-slate-800 transition focus:outline-none ${
                        formErrors.pincode
                          ? "border-red-500 focus:border-red-500"
                          : "border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                      }`}
                    />
                    {formErrors.pincode && (
                      <p className="mt-1 text-[11px] text-red-500 font-medium">
                        {formErrors.pincode}
                      </p>
                    )}
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="e.g. Bengaluru"
                      className={`mt-1.5 w-full rounded-xl border px-3.5 py-2.5 text-xs text-slate-800 transition focus:outline-none ${
                        formErrors.city
                          ? "border-red-500 focus:border-red-500"
                          : "border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                      }`}
                    />
                    {formErrors.city && (
                      <p className="mt-1 text-[11px] text-red-500 font-medium">
                        {formErrors.city}
                      </p>
                    )}
                  </div>

                  {/* State */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="e.g. Karnataka"
                      className={`mt-1.5 w-full rounded-xl border px-3.5 py-2.5 text-xs text-slate-800 transition focus:outline-none ${
                        formErrors.state
                          ? "border-red-500 focus:border-red-500"
                          : "border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                      }`}
                    />
                    {formErrors.state && (
                      <p className="mt-1 text-[11px] text-red-500 font-medium">
                        {formErrors.state}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION 2: Payment Method */}
              <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-xs">
                <div className="flex items-center gap-2.5 text-sm font-bold text-slate-900">
                  <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-slate-900 text-xs font-bold text-white">
                    2
                  </div>
                  <CreditCard size={17} className="text-indigo-600" />
                  <span>Payment Method</span>
                </div>

                <div className="mt-5 space-y-3">
                  {/* Option 1: Cash on Delivery */}
                  <label
                    className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all ${
                      paymentMethod === "cod"
                        ? "border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-500 shadow-xs"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={paymentMethod === "cod"}
                        onChange={() => setPaymentMethod("cod")}
                        className="accent-emerald-600 h-4 w-4"
                      />
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                          <Banknote size={18} />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-slate-900">
                            Cash on Delivery (COD)
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Pay in cash or scan QR when delivered
                          </p>
                        </div>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-800">
                      Recommended
                    </span>
                  </label>

                  {/* Option 2: UPI */}
                  <label
                    className={`relative flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all ${
                      paymentMethod === "upi"
                        ? "border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600 shadow-xs"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <input
                        type="radio"
                        name="payment"
                        value="upi"
                        checked={paymentMethod === "upi"}
                        onChange={() => setPaymentMethod("upi")}
                        className="accent-indigo-600 h-4 w-4"
                      />
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                          <Smartphone size={18} />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-slate-900">
                            UPI (Google Pay, PhonePe, Paytm)
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Instant scan and pay
                          </p>
                        </div>
                      </div>
                    </div>
                    <span className="rounded-full bg-amber-50 border border-amber-200/60 px-3 py-1 text-[10px] font-bold text-amber-800">
                      Online payments via Razorpay coming soon
                    </span>
                  </label>

                  {/* Option 3: Card */}
                  <label
                    className={`relative flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all ${
                      paymentMethod === "card"
                        ? "border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600 shadow-xs"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        checked={paymentMethod === "card"}
                        onChange={() => setPaymentMethod("card")}
                        className="accent-indigo-600 h-4 w-4"
                      />
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                          <CreditCard size={18} />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-slate-900">
                            Credit or Debit Card
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Visa, MasterCard, RuPay
                          </p>
                        </div>
                      </div>
                    </div>
                    <span className="rounded-full bg-amber-50 border border-amber-200/60 px-3 py-1 text-[10px] font-bold text-amber-800">
                      Online payments via Razorpay coming soon
                    </span>
                  </label>

                  {/* Option 4: Netbanking */}
                  <label
                    className={`relative flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all ${
                      paymentMethod === "netbanking"
                        ? "border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600 shadow-xs"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <input
                        type="radio"
                        name="payment"
                        value="netbanking"
                        checked={paymentMethod === "netbanking"}
                        onChange={() => setPaymentMethod("netbanking")}
                        className="accent-indigo-600 h-4 w-4"
                      />
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                          <Building size={18} />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-slate-900">
                            Netbanking
                          </p>
                          <p className="text-[11px] text-slate-500">
                            All major Indian banks
                          </p>
                        </div>
                      </div>
                    </div>
                    <span className="rounded-full bg-amber-50 border border-amber-200/60 px-3 py-1 text-[10px] font-bold text-amber-800">
                      Online payments via Razorpay coming soon
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* RIGHT: Order Summary & Place Order CTA (5 Cols) */}
            <div className="space-y-4 lg:col-span-5">
              <div className="sticky top-28 space-y-4">
                <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-xs">
                  <h3 className="border-b border-slate-100 pb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                    Order Items ({cartCount})
                  </h3>

                  {/* Thumbnail List */}
                  <div className="max-h-52 overflow-y-auto divide-y divide-slate-100 py-2">
                    {cart.map((item) => (
                      <div key={item.itemKey} className="flex items-center gap-3 py-2.5">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-12 w-12 rounded-xl object-cover shadow-2xs"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-xs font-bold text-slate-800">
                            {item.title}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Size: {item.selectedSize} • Qty: {item.quantity}
                          </p>
                        </div>
                        <span className="text-xs font-bold text-slate-900">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Calculations */}
                  <div className="mt-3 space-y-2 border-t border-slate-100 pt-3 text-xs sm:text-sm">
                    <div className="flex justify-between text-slate-600">
                      <span>Total MRP</span>
                      <span>₹{cartOriginalTotal.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between text-slate-600">
                      <span>Direct Factory Savings</span>
                      <span className="font-bold text-emerald-600">
                        - ₹{cartDiscount.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between text-slate-600">
                      <span>Express Shipping</span>
                      <span className="font-bold text-emerald-600 uppercase text-xs">
                        FREE
                      </span>
                    </div>

                    <div className="border-t border-slate-200 pt-3">
                      <div className="flex justify-between text-base font-extrabold text-slate-900">
                        <span>Total Payable</span>
                        <span>₹{cartTotal.toLocaleString()}</span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-emerald-600 font-semibold">
                        You save ₹{cartDiscount.toLocaleString()} on this order
                      </p>
                    </div>
                  </div>

                  {/* Place Order CTA Button */}
                  <div className="mt-6">
                    <button
                      type="submit"
                      disabled={isPlacingOrder}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 py-3.5 text-xs sm:text-sm font-bold text-white shadow-md transition hover:bg-indigo-600 active:scale-98 disabled:opacity-75"
                    >
                      {isPlacingOrder ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          <span>Processing Your Order...</span>
                        </>
                      ) : (
                        <>
                          <Lock size={15} />
                          <span>Place Order • ₹{cartTotal.toLocaleString()}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Safe info */}
                <div className="rounded-3xl border border-slate-200/80 bg-white p-4 text-xs text-slate-600 shadow-2xs">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck size={18} className="text-emerald-600" />
                    <span className="font-medium">256-bit Encrypted Checkout • Doorstep Cash or UPI</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
