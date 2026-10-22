"use client";

import React, { useState, useMemo } from "react";
import { Sparkles, Clock, Calendar, Search } from "lucide-react";
import { ServiceItem } from "@/types/salon";

interface ServicesSectionProps {
  services: ServiceItem[];
  onBookService: (service: ServiceItem) => void;
}

export default function ServicesSection({ services, onBookService }: ServicesSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = [
    "All",
    "Hair Care & Styling",
    "Skin & Facials",
    "Men's Grooming",
    "Bridal & Makeup",
    "Spa & Massage"
  ];

  const filteredServices = useMemo(() => {
    return services.filter((srv) => {
      // Must be active
      if (!srv.isActive) return false;

      // Category filter
      const matchesCategory =
        activeCategory === "All" || srv.category.toLowerCase() === activeCategory.toLowerCase();

      // Search query
      const matchesSearch =
        !searchQuery.trim() ||
        srv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        srv.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [services, activeCategory, searchQuery]);

  return (
    <section id="services" className="py-24 px-4 sm:px-6 lg:px-8 relative bg-[#0b0b0e]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-[#d4af37] text-xs font-semibold uppercase tracking-[0.25em] mb-2.5">
            <Sparkles className="w-4 h-4" />
            <span>Master Crafted Menu</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Services & Price List
          </h2>
          <p className="mt-3.5 text-zinc-400 text-sm sm:text-base font-light">
            Transparent pricing in Indian Rupees (₹) with uncompromised salon luxury. All services include complimentary hair and skin analysis.
          </p>
        </div>

        {/* Filter Categories Bar & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 md:pb-0 scrollbar-none">
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

          {/* Quick Search Input */}
          <div className="relative w-full md:w-64 shrink-0">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search haircut, facial..."
              className="w-full bg-[#141419] border border-zinc-800 focus:border-[#d4af37] rounded-xl pl-9 pr-3.5 py-2 text-xs sm:text-sm text-white placeholder-zinc-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-16 bg-[#121216]/50 rounded-2xl border border-zinc-800">
            <p className="text-zinc-400 text-sm">No services found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="group relative rounded-2xl bg-[#141418] border border-zinc-800/80 hover:border-[#d4af37]/50 hover:shadow-xl hover:shadow-[#d4af37]/10 transition-all duration-300 flex flex-col overflow-hidden"
              >
                {/* Service Image */}
                <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-zinc-900">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141418] via-[#141418]/30 to-transparent" />

                  {/* Category Pill */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-[#f3e5ab] text-[10px] uppercase tracking-wider font-semibold border border-white/10">
                    {service.category}
                  </span>

                  {/* Popular Badge */}
                  {service.isPopular && (
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-black text-[10px] uppercase tracking-wider font-bold shadow-md">
                      Client Favorite
                    </span>
                  )}
                </div>

                {/* Service Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-serif-luxury text-lg sm:text-xl font-bold text-white group-hover:text-[#d4af37] transition-colors">
                        {service.name}
                      </h3>
                      {/* Price Badge */}
                      <div className="text-right shrink-0">
                        <div className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#d4af37]">
                          ₹{service.price}
                        </div>
                        {service.originalPrice && service.originalPrice > service.price && (
                          <div className="text-xs text-zinc-500 line-through">
                            ₹{service.originalPrice}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="flex items-center gap-1.5 text-zinc-400 text-xs mt-1.5 mb-3">
                      <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>{service.duration || "30 mins"}</span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-zinc-400 font-light leading-relaxed line-clamp-3">
                      {service.description}
                    </p>
                  </div>

                  {/* Action Button */}
                  <div className="mt-5 pt-4 border-t border-zinc-800/60 flex items-center justify-between gap-3">
                    <span className="text-[11px] text-zinc-500">Instant WhatsApp Booking</span>
                    <button
                      onClick={() => onBookService(service)}
                      className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-[#d4af37] hover:bg-[#e5c07b] active:scale-[0.98] transition-all flex items-center gap-1.5 shadow-sm shadow-[#d4af37]/20 cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5 fill-black" />
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
