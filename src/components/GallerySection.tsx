"use client";

import React, { useState, useMemo } from "react";
import { Sparkles, Maximize2, X, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { GalleryItem, GalleryCategory } from "@/types/salon";

interface GallerySectionProps {
  gallery: GalleryItem[];
}

export default function GallerySection({ gallery }: GallerySectionProps) {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories: GalleryCategory[] = [
    "All",
    "Men's Haircuts",
    "Women's Hairstyles",
    "Bridal Makeup",
    "Hair Coloring",
    "Salon Interior",
    "Before and After"
  ];

  const filteredGallery = useMemo(() => {
    if (activeCategory === "All") return gallery;
    return gallery.filter((item) => item.category === activeCategory);
  }, [gallery, activeCategory]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextLightbox = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % filteredGallery.length);
  };

  const prevLightbox = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + filteredGallery.length) % filteredGallery.length);
  };

  return (
    <section id="gallery" className="py-24 px-4 sm:px-6 lg:px-8 relative bg-[#0b0b0e]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-[#d4af37] text-xs font-semibold uppercase tracking-[0.25em] mb-2.5">
            <Sparkles className="w-4 h-4" />
            <span>Visual Showcase</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Our Salon Photo Gallery
          </h2>
          <p className="mt-3.5 text-zinc-400 text-sm sm:text-base font-light">
            Real client transformations, precision fades, royal bridal looks, and a glimpse into our serene luxury space.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium tracking-wide whitespace-nowrap transition-all duration-200 cursor-pointer ${
                activeCategory === cat
                  ? "bg-[#d4af37] text-black font-semibold shadow-md shadow-[#d4af37]/20"
                  : "bg-[#141419] text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Image Grid */}
        {filteredGallery.length === 0 ? (
          <div className="text-center py-16 bg-[#121216]/50 rounded-2xl border border-zinc-800">
            <p className="text-zinc-400 text-sm">No photos in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGallery.map((item, index) => (
              <div
                key={item.id}
                onClick={() => openLightbox(index)}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-zinc-900 border border-zinc-800 hover:border-[#d4af37]/50 transition-all duration-300 cursor-pointer shadow-lg"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />

                {/* Hover Zoom Icon */}
                <div className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-white/20">
                  <Maximize2 className="w-4 h-4 text-[#d4af37]" />
                </div>

                {/* Category Badge & Caption */}
                <div className="absolute bottom-4 left-4 right-4 transition-transform duration-300 group-hover:-translate-y-1">
                  <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#d4af37]/20 border border-[#d4af37]/30 text-[#f3e5ab] text-[10px] uppercase tracking-wider font-semibold mb-1">
                    {item.category}
                  </span>
                  <h3 className="font-serif-luxury text-base font-bold text-white leading-tight">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-xs text-zinc-300 font-light mt-0.5 line-clamp-1">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Enlargement Modal */}
      {lightboxIndex !== null && filteredGallery[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-fadeIn"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 p-3 rounded-full bg-zinc-800/80 text-white hover:bg-zinc-700 transition-colors z-50 cursor-pointer"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevLightbox();
            }}
            className="absolute left-4 sm:left-8 p-3 rounded-full bg-zinc-800/80 text-white hover:bg-[#d4af37] hover:text-black transition-colors z-50 cursor-pointer"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextLightbox();
            }}
            className="absolute right-4 sm:right-8 p-3 rounded-full bg-zinc-800/80 text-white hover:bg-[#d4af37] hover:text-black transition-colors z-50 cursor-pointer"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Main Modal Image & Caption */}
          <div
            className="max-w-4xl w-full flex flex-col items-center max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative rounded-2xl overflow-hidden border border-[#d4af37]/30 shadow-2xl shadow-black max-h-[75vh]">
              <img
                src={filteredGallery[lightboxIndex].imageUrl}
                alt={filteredGallery[lightboxIndex].title}
                className="max-h-[75vh] w-auto object-contain mx-auto"
              />
            </div>
            <div className="text-center mt-4">
              <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
                {filteredGallery[lightboxIndex].category}
              </span>
              <h3 className="font-serif-luxury text-xl font-bold text-white mt-0.5">
                {filteredGallery[lightboxIndex].title}
              </h3>
              {filteredGallery[lightboxIndex].description && (
                <p className="text-sm text-zinc-400 mt-1 max-w-lg mx-auto">
                  {filteredGallery[lightboxIndex].description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
