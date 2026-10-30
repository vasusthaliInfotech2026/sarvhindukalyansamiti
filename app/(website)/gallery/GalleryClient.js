"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { GALLERY } from "@/lib/data";

// Sabhi categories ke liye apni alag-alag images ke path yahan dalein
const ALBUM_IMAGES = {
  "अन्न सेवा": [
    "/images/gallery/food-charity.webp",
    "/images/gallery/food-charity-2.webp",
    "/images/gallery/food-charity-3.webp",
  ],
  "चिकित्सा शिविर": [
    "/images/gallery/medical.webp",
    "/images/gallery/medical-2.webp",
    "/images/gallery/medical-3.webp",
  ],
  "रक्तदान": [
    "/images/gallery/blood-donation.webp",
    "/images/gallery/blood-donation-2.webp",
    "/images/gallery/blood-donation-3.webp",
  ],
  "कपड़े वितरण": [
    "/images/gallery/clothes-donation.webp",
    "/images/gallery/clothes-donation-2.webp",
    "/images/gallery/clothes-donation-3.webp",
  ],
  "शिक्षा सहायता": [
    "/images/gallery/education.webp",
    "/images/gallery/education-2.webp",
    "/images/gallery/education-3.webp",
  ],
  "अनाथ/बाल सहायता": [
    "/images/gallery/orphans.webp",
    "/images/gallery/orphans-2.webp",
    "/images/gallery/orphans-3.webp",
  ],
  "मंदिर सेवा": [
    "/images/gallery/temple.webp",
    "/images/gallery/temple-2.webp",
    "/images/gallery/temple-3.webp",
  ],
  "आपदा राहत": [
    "/images/gallery/disaster.webp",
    "/images/gallery/disaster-2.webp",
    "/images/gallery/disaster-3.webp",
  ],
};

const DEFAULT_IMAGES = [
  "/images/gallery/dummy.png",
  "/images/gallery/dummy.png",
  "/images/gallery/dummy.png",
];

/* ==========================================
   1. INFINITE LOOP AUTOPLAY SLIDER COMPONENT
========================================== */
function AutoImageSlider({ images, title, onImageClick }) {
  const hasMultiple = images.length > 1;

  // Seamless infinite loop ke liye first aur last slide ka clone banaya gaya hai
  const extendedImages = hasMultiple
    ? [images[images.length - 1], ...images, images[0]]
    : images;

  const [current, setCurrent] = useState(hasMultiple ? 1 : 0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  // Asli image ka index (0 se images.length - 1 tak)
  const realIndex = !hasMultiple
    ? 0
    : current === 0
    ? images.length - 1
    : current === images.length + 1
    ? 0
    : current - 1;

  const nextSlide = useCallback(() => {
    if (!hasMultiple) return;
    setIsTransitioning(true);
    setCurrent((prev) => (prev >= images.length + 1 ? prev : prev + 1));
  }, [hasMultiple, images.length]);

  const prevSlide = (e) => {
    e.stopPropagation();
    if (!hasMultiple) return;
    setIsTransitioning(true);
    setCurrent((prev) => (prev <= 0 ? prev : prev - 1));
  };

  const handleNextClick = (e) => {
    e.stopPropagation();
    nextSlide();
  };

  // Autoplay: har 3 second mein aage slide hoga
  useEffect(() => {
    if (!hasMultiple || isPaused) return;
    const timer = setInterval(nextSlide, 3000);
    return () => clearInterval(timer);
  }, [hasMultiple, isPaused, nextSlide]);

  // Jab clone slide par pahuche to bina jhatke ke asli slide par reset karein
  const handleTransitionEnd = (e) => {
    if (e.target !== e.currentTarget || !hasMultiple) return;
    if (current === images.length + 1) {
      setIsTransitioning(false);
      setCurrent(1);
    } else if (current === 0) {
      setIsTransitioning(false);
      setCurrent(images.length);
    }
  };

  // Fallback reset (agar browser tab background mein ho)
  useEffect(() => {
    if (!hasMultiple) return;
    if (current === images.length + 1) {
      const t = setTimeout(() => {
        setIsTransitioning(false);
        setCurrent(1);
      }, 720);
      return () => clearTimeout(t);
    }
    if (current === 0) {
      const t = setTimeout(() => {
        setIsTransitioning(false);
        setCurrent(images.length);
      }, 720);
      return () => clearTimeout(t);
    }
  }, [current, hasMultiple, images.length]);

  return (
    <div
      className="relative h-52 w-full overflow-hidden bg-navy select-none cursor-zoom-in"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onClick={() => onImageClick(realIndex)}
    >
      {/* Infinite Sliding Track */}
      <div
        onTransitionEnd={handleTransitionEnd}
        className={`flex h-full w-full ${
          isTransitioning
            ? "transition-transform duration-700 ease-in-out"
            : "transition-none"
        }`}
        style={{ transform: `translate3d(-${current * 100}%, 0, 0)` }}
      >
        {extendedImages.map((src, idx) => (
          <div
            key={idx}
            className="relative h-full w-full min-w-full flex-shrink-0 overflow-hidden"
          >
            <Image
              src={src}
              alt={`${title} - slide ${idx}`}
              fill
              sizes="(max-width: 768px) 100vw, 450px"
              className="!h-full !w-full !max-w-none object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        ))}
      </div>

      {/* Left / Right Buttons aur Dots */}
      {hasMultiple && (
        <>
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous image"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition hover:bg-saffron md:opacity-0 md:group-hover:opacity-100"
          >
            ❮
          </button>
          <button
            type="button"
            onClick={handleNextClick}
            aria-label="Next image"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition hover:bg-saffron md:opacity-0 md:group-hover:opacity-100"
          >
            ❯
          </button>

          {/* Bottom Dots */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex gap-1.5 rounded-full bg-black/35 px-2.5 py-1 backdrop-blur-sm">
            {images.map((_, idx) => (
              <span
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsTransitioning(true);
                  setCurrent(idx + 1);
                }}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  realIndex === idx ? "w-5 bg-saffron" : "w-2 bg-white/70"
                }`}
              />
            ))}
          </div>
        </>
      )}

     
    </div>
  );
}

/* ==========================================
   2. MAIN GALLERY CLIENT COMPONENT
========================================== */
export default function GalleryClient() {
  const [cat, setCat] = useState("सभी");

  // Fullscreen Lightbox State
  const [lightbox, setLightbox] = useState({
    isOpen: false,
    images: [],
    index: 0,
    title: "",
  });
  const [isZoomed, setIsZoomed] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);

  const list = cat === "सभी" ? GALLERY : GALLERY.filter((g) => g.cat === cat);

  const openLightbox = (images, index, title) => {
    setLightbox({ isOpen: true, images, index, title });
    setIsZoomed(false);
  };

  const closeLightbox = useCallback(() => {
    setLightbox((prev) => ({ ...prev, isOpen: false }));
    setIsZoomed(false);
  }, []);

  const nextLightboxImage = useCallback((e) => {
    if (e) e.stopPropagation();
    setIsZoomed(false);
    setLightbox((prev) => ({
      ...prev,
      index: (prev.index + 1) % prev.images.length,
    }));
  }, []);

  const prevLightboxImage = useCallback((e) => {
    if (e) e.stopPropagation();
    setIsZoomed(false);
    setLightbox((prev) => ({
      ...prev,
      index: (prev.index - 1 + prev.images.length) % prev.images.length,
    }));
  }, []);

  // Keyboard Navigation
  useEffect(() => {
    if (!lightbox.isOpen) return;

    document.body.style.overflow = "hidden";
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextLightboxImage();
      if (e.key === "ArrowLeft") prevLightboxImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightbox.isOpen, closeLightbox, nextLightboxImage, prevLightboxImage]);

  // Mobile Swipe Support
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 50) nextLightboxImage();
    if (diff < -50) prevLightboxImage();
    setTouchStartX(null);
  };

  return (
    <>
      {/* Category Filter Buttons */}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {["सभी", ...GALLERY.map((g) => g.cat)].map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`rounded-full border-2 px-4 py-1.5 text-sm font-semibold transition ${
              cat === c
                ? "border-saffron bg-saffron text-white"
                : "border-saffron/40 hover:bg-sandal"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Gallery Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((g) => {
          const cardImages =
            g.images?.length > 0
              ? g.images
              : ALBUM_IMAGES[g.cat] || DEFAULT_IMAGES;

          return (
            <div
              key={g.cat}
              className="card card-hover group animate-rise flex flex-col overflow-hidden !p-0"
            >
              <AutoImageSlider
                images={cardImages}
                title={g.title}
                onImageClick={(idx) => openLightbox(cardImages, idx, g.title)}
              />

              <div className="p-5">
                <h3 className="font-head text-xl text-navy">{g.title}</h3>
                <p className="text-sm font-semibold text-saffron-deep">
                  {g.date} · 📍 {g.place}
                </p>
                {/* <p className="mt-1 text-navy/75">{g.desc}</p> */}
              </div>
            </div>
          );
        })}
      </div>

      {/* ==========================================
          3. FULL-SCREEN ZOOM LIGHTBOX MODAL
      ========================================== */}
      {lightbox.isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/95 p-2 sm:p-6 backdrop-blur-md select-none"
          onClick={closeLightbox}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Top Bar */}
          <div
            className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent px-4 py-4 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <h4 className="font-head text-base sm:text-lg font-semibold">
                {lightbox.title}
              </h4>
              <p className="text-xs sm:text-sm text-white/75">
                Photo {lightbox.index + 1} / {lightbox.images.length}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsZoomed((z) => !z)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-lg text-white transition hover:bg-saffron"
              >
                {isZoomed ? "➖" : "➕"}
              </button>

              <button
                type="button"
                onClick={closeLightbox}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-xl font-bold text-white transition hover:bg-red-600"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Left Arrow Button */}
          {lightbox.images.length > 1 && (
            <button
              type="button"
              onClick={prevLightboxImage}
              aria-label="Previous Slide"
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-black/60 border border-white/25 text-xl sm:text-2xl text-white shadow-lg backdrop-blur-md transition hover:scale-110 hover:bg-saffron active:scale-95"
            >
              ❮
            </button>
          )}

          {/* Fullscreen Image */}
          <div
            className="relative flex h-[75vh] sm:h-[82vh] w-full max-w-6xl items-center justify-center overflow-hidden"
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomed((z) => !z);
            }}
          >
            <div
              className={`relative h-full w-full transition-transform duration-500 ease-out ${
                isZoomed
                  ? "scale-150 cursor-zoom-out"
                  : "scale-100 cursor-zoom-in"
              }`}
            >
              <Image
                src={lightbox.images[lightbox.index]}
                alt={`${lightbox.title} fullscreen`}
                fill
                sizes="100vw"
                priority
                className="object-contain"
              />
            </div>
          </div>

          {/* Right Arrow Button */}
          {lightbox.images.length > 1 && (
            <button
              type="button"
              onClick={nextLightboxImage}
              aria-label="Next Slide"
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-black/60 border border-white/25 text-xl sm:text-2xl text-white shadow-lg backdrop-blur-md transition hover:scale-110 hover:bg-saffron active:scale-95"
            >
              ❯
            </button>
          )}

          {/* Bottom Dots */}
          {lightbox.images.length > 1 && (
            <div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2 rounded-full bg-black/50 px-4 py-2 backdrop-blur-md"
              onClick={(e) => e.stopPropagation()}
            >
              {lightbox.images.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setIsZoomed(false);
                    setLightbox((prev) => ({ ...prev, index: idx }));
                  }}
                  className={`h-2.5 rounded-full transition-all ${
                    lightbox.index === idx
                      ? "w-7 bg-saffron"
                      : "w-2.5 bg-white/50 hover:bg-white"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}