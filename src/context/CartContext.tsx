import {
  createContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { Product, Order } from "../types";
import { mockProducts } from "../data/mockProducts";

export interface CartItemType {
  itemKey: string;
  id: number;
  title: string;
  category: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  image: string;
  selectedSize: string;
  quantity: number;
  isFreeDelivery: boolean;
  supplierName: string;
}

export interface CartContextType {
  cart: CartItemType[];
  cartCount: number;
  cartTotal: number;
  cartOriginalTotal: number;
  cartDiscount: number;
  addToCart: (product: Product, size?: string | null, quantity?: number) => void;
  removeFromCart: (productId: number, size: string) => void;
  updateQuantity: (productId: number, size: string, newQty: number) => void;
  clearCart: () => void;
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  moveToCart: (product: Product, size?: string) => void;
  isWishlisted: (productId: number) => boolean;
  orders: Order[];
  addOrder: (order: Order) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  pincode: string;
  deliveryEstimate: string;
  checkPincode: (code: string) => boolean;
  lastOrder: Order | null;
  setLastOrder: (order: Order | null) => void;
  showToast: (message: string) => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "eshop_cart_items";
const WISHLIST_STORAGE_KEY = "eshop_wishlist_items";
const LAST_ORDER_STORAGE_KEY = "eshop_last_order";
const ORDERS_LIST_STORAGE_KEY = "eshop_orders_list";

// Initial seed orders for realistic order history
const INITIAL_SEED_ORDERS: Order[] = [
  {
    orderId: "ESH-829104",
    createdAt: "26 Sep 2026, 04:30 PM",
    items: [
      {
        id: "1-L",
        productId: 1,
        product: mockProducts[0],
        size: "L",
        quantity: 1,
      },
      {
        id: "11-600 ml",
        productId: 11,
        product: mockProducts[10],
        size: "600 ml",
        quantity: 1,
      },
    ],
    subtotal: 3798,
    discountSavings: 2100,
    totalAmount: 1698,
    paymentMethod: "cod",
    address: {
      fullName: "Priya Sharma",
      phone: "9876543210",
      street: "Flat 402, Sunshine Residency, MG Road",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560001",
    },
    estimatedDelivery: "Delivered on 29 Sep 2026",
    status: "Delivered",
  },
  {
    orderId: "ESH-910482",
    createdAt: "29 Sep 2026, 11:15 AM",
    items: [
      {
        id: "5-UK 9",
        productId: 5,
        product: mockProducts[4],
        size: "UK 9",
        quantity: 1,
      },
    ],
    subtotal: 3599,
    discountSavings: 1800,
    totalAmount: 1799,
    paymentMethod: "upi",
    address: {
      fullName: "Priya Sharma",
      phone: "9876543210",
      street: "Flat 402, Sunshine Residency, MG Road",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560001",
    },
    estimatedDelivery: "Expected by Tomorrow, 1 Oct",
    status: "Shipped",
  },
];

export function CartProvider({ children }: { children: ReactNode }) {
  // Cart state persisted to localStorage
  const [cart, setCart] = useState<CartItemType[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist state persisted to localStorage (initial seed with 2 products if none exist)
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
      return [mockProducts[0], mockProducts[4]]; // Seed with 2 curated favorites
    } catch {
      return [mockProducts[0], mockProducts[4]];
    }
  });

  // Orders list state persisted to localStorage
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_LIST_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_SEED_ORDERS;
    } catch {
      return INITIAL_SEED_ORDERS;
    }
  });

  // Last completed order
  const [lastOrder, setLastOrder] = useState<Order | null>(() => {
    try {
      const saved = localStorage.getItem(LAST_ORDER_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Global search & filter states
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Delivery Pincode checker state
  const [pincode, setPincode] = useState<string>("560001");
  const [deliveryEstimate, setDeliveryEstimate] = useState<string>(
    "Delivery by Friday, 3 Oct | Free Delivery"
  );

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
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
      localStorage.setItem(ORDERS_LIST_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error("Failed to save orders to localStorage", e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      if (lastOrder) {
        localStorage.setItem(LAST_ORDER_STORAGE_KEY, JSON.stringify(lastOrder));
      }
    } catch (e) {
      console.error("Failed to save last order to localStorage", e);
    }
  }, [lastOrder]);

  const addToCart = (
    product: Product,
    size: string | null = null,
    quantity: number = 1
  ) => {
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
            isFreeDelivery: product.fastDelivery ?? true,
            supplierName: "e-shop Verified Direct",
          },
        ];
      }
    });

    showToast(`Added "${product.title.slice(0, 24)}..." (${chosenSize}) to cart`);
  };

  const removeFromCart = (productId: number, size: string) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) => !(item.id === productId && item.selectedSize === size)
      )
    );
    showToast("Item removed from your cart");
  };

  const updateQuantity = (productId: number, size: string, newQty: number) => {
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

  const toggleWishlist = (product: Product) => {
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

  const removeFromWishlist = (productId: number) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
    showToast("Item removed from wishlist");
  };

  const moveToCart = (product: Product, size?: string) => {
    const chosenSize = size || (product.sizes && product.sizes[0]) || "Free Size";
    addToCart(product, chosenSize, 1);
    removeFromWishlist(product.id);
    showToast(`Moved "${product.title.slice(0, 22)}..." to Cart`);
  };

  const isWishlisted = (productId: number): boolean => {
    return wishlist.some((item) => item.id === productId);
  };

  const addOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setLastOrder(newOrder);
  };

  const checkPincode = (code: string): boolean => {
    setPincode(code);
    if (!code || code.length < 6) {
      setDeliveryEstimate("Please enter a valid 6-digit Pincode");
      return false;
    }
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      day: "numeric",
      month: "short",
    };
    const date = new Date();
    date.setDate(date.getDate() + 3);
    const dateStr = date.toLocaleDateString("en-IN", options);
    setDeliveryEstimate(`Delivery by ${dateStr} | FREE Delivery`);
    return true;
  };

  // Calculations
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
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
        removeFromWishlist,
        moveToCart,
        isWishlisted,
        orders,
        addOrder,
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
      {/* Modern Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full bg-slate-900/95 px-5 py-3 text-xs font-semibold text-white shadow-2xl backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 border border-slate-700">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </CartContext.Provider>
  );
}
