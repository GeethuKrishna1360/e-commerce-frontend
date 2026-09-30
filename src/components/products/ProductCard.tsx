import { useState } from "react";
import { Heart, Plus } from "lucide-react";
import type { Product } from "../../types/product";

type ProductCardProps = {
  product: Product;
  onAdd: () => void;
};

export function ProductCard({ product, onAdd }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <article className="group min-w-0">
      <div className="relative aspect-[4/5] overflow-hidden bg-[#e9e7df]">
        <img
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          src={product.image}
          alt={product.name}
          loading="lazy"
        />
        {product.label && (
          <span className="absolute left-3 top-3 bg-[#f6f5f1] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.13em] text-[#23382f] sm:left-4 sm:top-4">
            {product.label}
          </span>
        )}
        <button
          className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center bg-[#f6f5f1]/90 transition-colors hover:text-[#a7653e] sm:right-3 sm:top-3"
          type="button"
          aria-label={
            isFavorite
              ? `Remove ${product.name} from favorites`
              : `Add ${product.name} to favorites`
          }
          aria-pressed={isFavorite}
          onClick={() => setIsFavorite((favorite) => !favorite)}
        >
          <Heart
            size={17}
            strokeWidth={1.6}
            fill={isFavorite ? "currentColor" : "none"}
          />
        </button>
        <button
          className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center bg-[#f6f5f1] text-[#23382f] transition-colors hover:bg-[#23382f] hover:text-white sm:bottom-4 sm:right-4"
          type="button"
          aria-label={`Add ${product.name} to bag`}
          onClick={onAdd}
        >
          <Plus size={19} strokeWidth={1.6} />
        </button>
      </div>
      <div className="flex items-start justify-between gap-2 pt-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[#28372e] sm:text-base">
            {product.name}
          </p>
          <p className="mt-1 text-xs text-[#778078]">{product.category}</p>
        </div>
        <p className="shrink-0 pt-0.5 text-sm font-medium">${product.price}</p>
      </div>
    </article>
  );
}
