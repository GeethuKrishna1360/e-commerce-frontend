import { useState, useEffect, type MouseEvent } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Copy,
  Check,
  Tag,
  ArrowRight,
} from "lucide-react";
import { useCart } from "../context/useCart";

interface PromoSlide {
  id: number;
  tag: string;
  title: string;
  subtitle: string;
  code: string;
  discountHighlight: string;
  categoryTarget: string;
  gradient: string;
  accentColor: string;
  image: string;
}

const SLIDES: PromoSlide[] = [
  {
    id: 1,
    tag: "FESTIVE & CONTEMPORARY EDIT",
    title: "Up to 55% Off Women's & Men's Styles",
    subtitle: "Embroidered kurta sets, festive sarees, oversized tees & relaxed shirts",
    code: "STYLE50",
    discountHighlight: "50% OFF",
    categoryTarget: "Women's Wear",
    gradient: "from-slate-900 via-slate-800 to-slate-900",
    accentColor: "text-emerald-400",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 2,
    tag: "FOOTWEAR SPOTLIGHT",
    title: "Minimalist Leather Sneakers & Suede Loafers",
    subtitle: "Handcrafted silhouettes built with Ortho-Foam cushioning",
    code: "STEP20",
    discountHighlight: "EXTRA 20%",
    categoryTarget: "Footwear",
    gradient: "from-zinc-900 via-stone-900 to-zinc-900",
    accentColor: "text-amber-400",
    image:
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 3,
    tag: "WELCOME OFFER",
    title: "Flat ₹250 Off On Your First Order",
    subtitle: "Enjoy free nationwide express delivery with no minimum spend",
    code: "WELCOME250",
    discountHighlight: "FLAT ₹250",
    categoryTarget: "All",
    gradient: "from-slate-950 via-slate-900 to-zinc-900",
    accentColor: "text-emerald-400",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 4,
    tag: "HOME & LIVING",
    title: "Artisan Ceramic Pour-Over & Washed Bedding",
    subtitle: "Clean stoneware aesthetics & natural French flax linen",
    code: "LIVING30",
    discountHighlight: "30% OFF",
    categoryTarget: "Home & Living",
    gradient: "from-stone-900 via-neutral-900 to-slate-900",
    accentColor: "text-teal-400",
    image:
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=700&q=80",
  },
];

export function PromoSlider() {
  const { setSelectedCategory, setSearchQuery, showToast } = useCart();
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Auto-advance slider every 4.5 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handlePrev = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const handleNext = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  };

  const handleCopyCode = (
    e: MouseEvent<HTMLDivElement>,
    code: string
  ) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    showToast(`Promo code "${code}" copied to clipboard!`);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleSlideClick = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery("");
    const catalogEl = document.getElementById("catalog-section");
    catalogEl?.scrollIntoView({ behavior: "smooth" });
  };

  const activeSlide = SLIDES[currentSlide];

  return (
    <section className="mx-auto max-w-7xl px-4 pt-4 sm:px-6">
      <div
        className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-900 shadow-sm transition-all"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Compact Banner Container */}
        <div
          onClick={() => handleSlideClick(activeSlide.categoryTarget)}
          className={`cursor-pointer relative flex h-[150px] sm:h-[160px] md:h-[170px] w-full items-center justify-between overflow-hidden bg-gradient-to-r ${activeSlide.gradient} px-5 sm:px-8 text-white transition-all duration-500`}
        >
          {/* Subtle Ambient Background Light */}
          <div className="pointer-events-none absolute -left-10 -top-10 h-44 w-44 rounded-full bg-slate-500/10 blur-2xl" />
          <div className="pointer-events-none absolute right-32 -bottom-10 h-44 w-44 rounded-full bg-emerald-500/10 blur-2xl" />

          {/* Left Text & Code Box */}
          <div className="relative z-10 max-w-lg space-y-1.5 sm:space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 border border-white/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                <Sparkles size={11} className={activeSlide.accentColor} />
                {activeSlide.tag}
              </span>
              <span className="rounded-full bg-emerald-400 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-slate-950">
                {activeSlide.discountHighlight}
              </span>
            </div>

            <h3 className="text-base sm:text-lg md:text-xl font-extrabold tracking-tight text-white leading-tight font-sans line-clamp-1">
              {activeSlide.title}
            </h3>

            <p className="hidden text-xs text-slate-300 sm:line-clamp-1">
              {activeSlide.subtitle}
            </p>

            {/* Discount Code Pill with Copy Action */}
            <div className="flex flex-wrap items-center gap-2.5 pt-0.5">
              <div
                onClick={(e: React.MouseEvent<HTMLDivElement>) =>
                  handleCopyCode(e, activeSlide.code)
                }
                className="group/code flex items-center gap-1.5 rounded-lg border border-dashed border-white/30 bg-white/10 px-2.5 py-1 text-[11px] font-mono font-bold text-white transition hover:bg-white/20 active:scale-95"
                title="Click to copy code"
              >
                <Tag size={12} className="text-emerald-400" />
                <span>CODE: {activeSlide.code}</span>
                {copiedCode === activeSlide.code ? (
                  <Check size={12} className="text-emerald-400" />
                ) : (
                  <Copy size={11} className="text-slate-300 group-hover/code:text-white" />
                )}
              </div>

              <button
                type="button"
                className="flex items-center gap-1 rounded-lg bg-white px-3 py-1 text-[11px] font-bold text-slate-900 shadow-xs hover:bg-slate-100 transition active:scale-95"
              >
                <span>Shop Now</span>
                <ArrowRight size={11} />
              </button>
            </div>
          </div>

          {/* Right Preview Image with Soft Gradient Mask */}
          <div className="relative h-full w-1/3 min-w-[140px] max-w-[260px] overflow-hidden sm:w-2/5">
            <div className="absolute inset-0 z-10 bg-gradient-to-r from-slate-900/90 via-transparent to-transparent" />
            <img
              src={activeSlide.image}
              alt={activeSlide.title}
              className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>
        </div>

        {/* Previous & Next Control Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-xs transition hover:bg-black/70 opacity-0 group-hover:opacity-100 z-20"
          aria-label="Previous slide"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-xs transition hover:bg-black/70 opacity-0 group-hover:opacity-100 z-20"
          aria-label="Next slide"
        >
          <ChevronRight size={16} />
        </button>

        {/* Slide Indicator Dots */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
          {SLIDES.map((s, idx) => (
            <button
              key={s.id}
              onClick={(e: MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                setCurrentSlide(idx);
              }}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentSlide === idx
                  ? "w-5 bg-white"
                  : "w-1.5 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
