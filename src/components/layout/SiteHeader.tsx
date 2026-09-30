import { Menu, Search, ShoppingBag } from "lucide-react";

type SiteHeaderProps = {
  cartCount: number;
};

export function SiteHeader({ cartCount }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-[#e4e3dc] bg-[#f6f5f1]/95 backdrop-blur">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">
        <button
          className="flex h-10 w-10 items-center justify-center sm:hidden"
          type="button"
          aria-label="Open menu"
        >
          <Menu size={21} strokeWidth={1.6} />
        </button>
        <a
          className="absolute left-1/2 -translate-x-1/2 font-display text-[21px] font-semibold tracking-wide sm:static sm:translate-x-0 sm:text-2xl"
          href="#top"
        >
          Form <span className="text-[#a7653e]">&</span> Field
        </a>
        <nav
          className="hidden items-center gap-8 sm:flex"
          aria-label="Main navigation"
        >
          <a
            className="text-sm text-[#4f5c53] transition-colors hover:text-[#a7653e]"
            href="#shop"
          >
            Shop
          </a>
          <a
            className="text-sm text-[#4f5c53] transition-colors hover:text-[#a7653e]"
            href="#shop"
          >
            Our edit
          </a>
          <a
            className="text-sm text-[#4f5c53] transition-colors hover:text-[#a7653e]"
            href="#story"
          >
            Our story
          </a>
        </nav>
        <div className="flex items-center gap-1">
          <button
            className="hidden h-10 w-10 items-center justify-center sm:flex"
            type="button"
            aria-label="Search"
          >
            <Search size={19} strokeWidth={1.6} />
          </button>
          <button
            className="relative flex h-10 w-10 items-center justify-center"
            type="button"
            aria-label={`Shopping bag, ${cartCount} items`}
          >
            <ShoppingBag size={19} strokeWidth={1.6} />
            <span className="absolute right-0 top-0 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#a7653e] px-1 text-[9px] font-semibold text-white">
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
