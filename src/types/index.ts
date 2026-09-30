export interface SupplierInfo {
  name: string;
  rating: number;
  followers: string;
  productsCount: number;
  verified: boolean;
  dispatchRate: string;
}

export interface ProductReview {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
}

export interface Product {
  id: number;
  title: string;
  category: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewsCount: number;
  images: string[];
  details: Record<string, string>;
  sizes: string[];
  description: string;
  inStock: boolean;
  fastDelivery: boolean;
  badge?: string;
  subcategory?: string;
  supplier?: SupplierInfo;
  reviews?: ProductReview[];
  codAvailable?: boolean;
}

export interface CartItem {
  id: string; // Composite unique key: `${product.id}-${size}`
  productId: number;
  product: Product;
  size: string;
  quantity: number;
}

export interface PriceRangeOption {
  label: string;
  value: string;
  min: number;
  max: number;
}

export interface RatingOption {
  label: string;
  value: number;
}

export type SortOption =
  | "relevance"
  | "price-low-high"
  | "price-high-low"
  | "rating-high"
  | "discount-high";

export interface ShippingAddress {
  fullName: string;
  phone: string;
  pincode: string;
  street: string;
  city: string;
  state: string;
  landmark?: string;
}

export type PaymentMethod = "cod" | "upi" | "card" | "netbanking";

export interface Order {
  orderId: string;
  items: CartItem[];
  address: ShippingAddress;
  paymentMethod: PaymentMethod;
  subtotal: number;
  discountSavings: number;
  totalAmount: number;
  estimatedDelivery: string;
  createdAt: string;
  status: "Order Confirmed" | "Packed" | "Shipped" | "Delivered";
}
