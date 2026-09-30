import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

const CART_STORAGE_KEY = "eshop_cart_items";
const WISHLIST_STORAGE_KEY = "eshop_wishlist_items";
const LAST_ORDER_STORAGE_KEY = "eshop_last_order";

export function CartProvider({ children }) {
  // Cart state persisted to localStorage
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist state persisted to localStorage
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Last completed order
  const [lastOrder, setLastOrder] = useState(() => {
    try {
      const saved = localStorage.getItem(LAST_ORDER_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Global search & filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Delivery Pincode checker state
  const [pincode, setPincode] = useState("560001");
  const [deliveryEstimate, setDeliveryEstimate] = useState("Delivery by Friday, 3 Oct | Free Delivery");

  // Toast notification state
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch (e) {
      console.error("Failed to save wishlist to localStorage", e);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      if (lastOrder) {
        localStorage.setItem(LAST_ORDER_STORAGE_KEY, JSON.stringify(lastOrder));
      }
    } catch (e) {
      console.error("Failed to save last order to localStorage", e);
    }
  }, [lastOrder]);

  const addToCart = (product, size = null, quantity = 1) => {
    const chosenSize = size || (product.sizes && product.sizes[0]) || "Free Size";
    const itemKey = `${product.id}-${chosenSize}`;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.id === product.id && item.selectedSize === chosenSize
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      } else {
        return [
          ...prevCart,
          {
            itemKey,
            id: product.id,
            title: product.title,
            category: product.category,
            price: product.price,
            originalPrice: product.originalPrice,
            discountPercent: product.discountPercent,
            image: (product.images && product.images[0]) || "",
            selectedSize: chosenSize,
            quantity: quantity,
            isFreeDelivery: product.isFreeDelivery ?? true,
            supplierName: product.supplierName || "e-shop Verified Seller",
          },
        ];
      }
    });

    showToast(`Added "${product.title.slice(0, 24)}..." (${chosenSize}) to cart`);
  };

  const removeFromCart = (productId, size) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) => !(item.id === productId && item.selectedSize === size)
      )
    );
    showToast("Item removed from your cart");
  };

  const updateQuantity = (productId, size, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === productId && item.selectedSize === size) {
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        showToast("Removed from Wishlist");
        return prev.filter((item) => item.id !== product.id);
      } else {
        showToast("Saved to Wishlist");
        return [...prev, product];
      }
    });
  };

  const isWishlisted = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  const checkPincode = (code) => {
    setPincode(code);
    if (!code || code.length < 6) {
      setDeliveryEstimate("Please enter a valid 6-digit Pincode");
      return false;
    }
    // Realistic estimated mock date (3-5 days out)
    const options = { weekday: "short", day: "numeric", month: "short" };
    const date = new Date();
    date.setDate(date.getDate() + 3);
    const dateStr = date.toLocaleDateString("en-IN", options);
    setDeliveryEstimate(`Delivery by ${dateStr} | FREE Delivery`);
    return true;
  };

  // Calculations
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartOriginalTotal = cart.reduce(
    (acc, item) => acc + item.originalPrice * item.quantity,
    0
  );
  const cartDiscount = cartOriginalTotal - cartTotal;

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartTotal,
        cartOriginalTotal,
        cartDiscount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        wishlist,
        toggleWishlist,
        isWishlisted,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        pincode,
        deliveryEstimate,
        checkPincode,
        lastOrder,
        setLastOrder,
        showToast,
      }}
    >
      {children}
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-lg bg-zinc-900 px-4 py-3 text-sm font-medium text-white shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
          <span className="flex h-2 w-2 rounded-full bg-[#06b6d4]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
