import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/useCart";
import type { ShippingAddress, PaymentMethod, Order } from "../types";
import {
  MapPin,
  CreditCard,
  Lock,
  ShieldCheck,
  ChevronLeft,
  Banknote,
  Smartphone,
  Building,
} from "lucide-react";

export function CheckoutPage() {
  const {
    cart,
    cartCount,
    cartTotal,
    cartOriginalTotal,
    cartDiscount,
    clearCart,
    addOrder,
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
          className="mt-6 rounded-full bg-slate-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  // Address Form State
  const [formData, setFormData] = useState<ShippingAddress>({
    fullName: "Priya Sharma",
    phone: "9876543210",
    pincode: "560001",
    street: "Flat 402, Sunshine Residency, MG Road",
    city: "Bengaluru",
    state: "Karnataka",
    landmark: "Near Brigade Towers",
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ShippingAddress, string>>>({});
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [isPlacingOrder, setIsPlacingOrder] = useState<boolean>(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof ShippingAddress]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof ShippingAddress, string>> = {};
    if (!formData.fullName.trim()) errors.fullName = "Full Name is required";
    if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone.trim())) {
      errors.phone = "Enter a valid 10-digit mobile number";
    }
    if (!formData.pincode.trim() || !/^\d{6}$/.test(formData.pincode.trim())) {
      errors.pincode = "Enter a valid 6-digit Pincode";
    }
    if (!formData.street.trim()) errors.street = "Street address is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.state.trim()) errors.state = "State is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      window.scrollTo({ top: 120, behavior: "smooth" });
      return;
    }

    setIsPlacingOrder(true);

    // Simulate 1-second order processing loader
    setTimeout(() => {
      const generatedOrderId = `ESH-${Math.floor(100000 + Math.random() * 900000)}`;

      const orderPayload: Order = {
        orderId: generatedOrderId,
        createdAt: new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        items: cart.map((item) => ({
          id: item.itemKey,
          productId: item.id,
          product: {
            id: item.id,
            title: item.title,
            category: item.category,
            price: item.price,
            originalPrice: item.originalPrice,
            discountPercent: item.discountPercent,
            rating: 4.8,
            reviewsCount: 120,
            images: [item.image],
            details: {},
            sizes: [item.selectedSize],
            description: "",
            inStock: true,
            fastDelivery: item.isFreeDelivery,
          },
          size: item.selectedSize,
          quantity: item.quantity,
        })),
        totalAmount: cartTotal,
        subtotal: cartOriginalTotal,
        discountSavings: cartDiscount,
        paymentMethod: paymentMethod,
        address: { ...formData },
        estimatedDelivery: deliveryEstimate || "Delivery within 3-4 Business Days",
        status: "Order Confirmed",
      };

      addOrder(orderPayload);
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
            <span className="flex items-center gap-1.5 rounded-full bg-slate-200 text-slate-800 px-3 py-1">
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
                  <MapPin size={17} className="text-slate-700" />
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
                          : "border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
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
                          : "border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                      }`}
                    />
                    {formErrors.phone && (
                      <p className="mt-1 text-[11px] text-red-500 font-medium">
                        {formErrors.phone}
                      </p>
                    )}
                  </div>

                  {/* Street / Building Address */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700">
                      Street Address / Flat / Building *
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      placeholder="e.g. Flat 402, Sunshine Residency, MG Road"
                      className={`mt-1.5 w-full rounded-xl border px-3.5 py-2.5 text-xs text-slate-800 transition focus:outline-none ${
                        formErrors.street
                          ? "border-red-500 focus:border-red-500"
                          : "border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                      }`}
                    />
                    {formErrors.street && (
                      <p className="mt-1 text-[11px] text-red-500 font-medium">
                        {formErrors.street}
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
                          : "border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
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
                          : "border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
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
                          : "border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
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
                  <CreditCard size={17} className="text-slate-700" />
                  <span>Payment Method</span>
                </div>

                <div className="mt-5 space-y-3">
                  {/* Option 1: Cash on Delivery */}
                  <label
                    className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all ${
                      paymentMethod === "cod"
                        ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900 shadow-xs"
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
                        className="accent-slate-900 h-4 w-4"
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
                            Pay upon delivery via cash or QR scan
                          </p>
                        </div>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-800">
                      Available
                    </span>
                  </label>

                  {/* Option 2: UPI */}
                  <label
                    className={`relative flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all ${
                      paymentMethod === "upi"
                        ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900 shadow-xs"
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
                        className="accent-slate-900 h-4 w-4"
                      />
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
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
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold text-slate-600">
                      Gateway Ready
                    </span>
                  </label>

                  {/* Option 3: Card */}
                  <label
                    className={`relative flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all ${
                      paymentMethod === "card"
                        ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900 shadow-xs"
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
                        className="accent-slate-900 h-4 w-4"
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
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold text-slate-600">
                      Gateway Ready
                    </span>
                  </label>

                  {/* Option 4: Netbanking */}
                  <label
                    className={`relative flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all ${
                      paymentMethod === "netbanking"
                        ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900 shadow-xs"
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
                        className="accent-slate-900 h-4 w-4"
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
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold text-slate-600">
                      Gateway Ready
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
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Calculations */}
                  <div className="mt-3 space-y-2 border-t border-slate-100 pt-3 text-xs sm:text-sm">
                    <div className="flex justify-between text-slate-600">
                      <span>Total MRP</span>
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
                      <span>Express Shipping</span>
                      <span className="font-bold text-emerald-600 uppercase text-xs">
                        FREE
                      </span>
                    </div>

                    <div className="border-t border-slate-200 pt-3">
                      <div className="flex justify-between text-base font-extrabold text-slate-900">
                        <span>Total Payable</span>
                        <span>₹{cartTotal.toLocaleString("en-IN")}</span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-emerald-600 font-semibold">
                        You save ₹{cartDiscount.toLocaleString("en-IN")} on this order
                      </p>
                    </div>
                  </div>

                  {/* Place Order CTA Button */}
                  <div className="mt-6">
                    <button
                      type="submit"
                      disabled={isPlacingOrder}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 py-3.5 text-xs sm:text-sm font-bold text-white shadow-md transition hover:bg-slate-800 active:scale-98 disabled:opacity-75"
                    >
                      {isPlacingOrder ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          <span>Processing Your Order...</span>
                        </>
                      ) : (
                        <>
                          <Lock size={15} />
                          <span>Place Order • ₹{cartTotal.toLocaleString("en-IN")}</span>
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
