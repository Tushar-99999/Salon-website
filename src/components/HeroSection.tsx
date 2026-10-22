"use client";

import React from "react";
import { Sparkles, Calendar, Phone, ArrowDown, Clock, ShieldCheck, Star } from "lucide-react";
import { SalonInfo, SpecialOfferItem } from "@/types/salon";

interface HeroSectionProps {
  salonInfo: SalonInfo;
  offers: SpecialOfferItem[];
  onOpenBooking: () => void;
}

export default function HeroSection({ salonInfo, offers, onOpenBooking }: HeroSectionProps) {
  const cleanPhone = (salonInfo.phone || "+919876543210").replace(/[^0-9]/g, "");
  const featuredOffer = offers.length > 0 ? offers[0] : null;

  return (
    <section
      id="home"
      className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Background Salon Image with Luxury Gradients */}
      <div className="absolute inset-0 z-0">
        <img
          src={salonInfo.heroImage || "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1920&q=80"}
          alt="ABCD Salon Interior"
          className="w-full h-full object-cover object-center filter brightness-[0.35] scale-105 transition-transform duration-1000 ease-out"
        />
        {/* Obsidian & Gold Ambient Glow Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0e] via-[#0b0b0e]/70 to-[#0b0b0e]/90" />
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-[#d4af37]/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-[#aa7c11]/15 rounded-full blur-[140px] pointer-events-none" />
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Salon Crown Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#d4af37]/20 via-[#d4af37]/10 to-[#d4af37]/20 border border-[#d4af37]/40 mb-6 backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-[#d4af37]" />
          <span className="text-xs uppercase tracking-[0.25em] text-[#f3e5ab] font-semibold">
            {salonInfo.name} — Premium Unisex Salon
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
          <span className="text-xs text-zinc-300 font-medium">Bandra, Mumbai</span>
        </div>

        {/* Main Headline */}
        <h1 className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white max-w-4xl leading-[1.12]">
          {salonInfo.heroHeadline || "Your Beauty, Our Passion."}
        </h1>

        {/* Subtitle / Intro */}
        <p className="mt-6 text-base sm:text-lg md:text-xl text-zinc-300 max-w-2xl font-light leading-relaxed">
          {salonInfo.heroSubheadline ||
            "Experience luxury hair styling, rejuvenating skin therapies, and bespoke bridal beauty crafted by certified master artists."}
        </p>

        {/* Action CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5 sm:gap-4 w-full max-w-md sm:max-w-none">
          {/* Primary Book Appointment */}
          <button
            onClick={onOpenBooking}
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm tracking-widest uppercase text-black bg-gradient-to-r from-[#e5c07b] via-[#d4af37] to-[#aa7c11] hover:brightness-110 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2.5 shadow-xl shadow-[#d4af37]/25 cursor-pointer"
          >
            <Calendar className="w-4 h-4 fill-black" />
            Book Appointment
          </button>

          {/* Secondary Call Now */}
          <a
            href={`tel:+${cleanPhone}`}
            className="w-full sm:w-auto px-7 py-4 rounded-xl font-semibold text-sm tracking-wider uppercase text-zinc-100 bg-[#141419]/90 hover:bg-zinc-800 border border-zinc-700/80 hover:border-[#d4af37] transition-all duration-200 flex items-center justify-center gap-2.5 backdrop-blur-md"
          >
            <Phone className="w-4 h-4 text-[#d4af37]" />
            Call Now
          </a>

          {/* Tertiary View Services */}
          <a
            href="#services"
            className="w-full sm:w-auto px-7 py-4 rounded-xl font-semibold text-sm tracking-wider uppercase text-zinc-300 hover:text-white bg-transparent hover:bg-white/5 border border-zinc-800 hover:border-zinc-700 transition-all duration-200 flex items-center justify-center gap-2"
          >
            View Services
            <ArrowDown className="w-3.5 h-3.5 text-[#d4af37]" />
          </a>
        </div>

        {/* Salon Opening Hours & Highlights Strip */}
        <div className="mt-12 w-full max-w-3xl grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Opening Hours */}
          <div className="p-3.5 rounded-xl bg-[#121216]/80 border border-zinc-800 backdrop-blur-md flex items-center gap-3 text-left">
            <div className="p-2.5 rounded-lg bg-[#d4af37]/10 text-[#d4af37]">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">Opening Hours</div>
              <div className="text-xs font-medium text-white">{salonInfo.openingHours}</div>
              <div className="text-[10px] text-zinc-500">Weekly Off: {salonInfo.closedDay}</div>
            </div>
          </div>

          {/* Ratings & Trust */}
          <div className="p-3.5 rounded-xl bg-[#121216]/80 border border-zinc-800 backdrop-blur-md flex items-center gap-3 text-left">
            <div className="p-2.5 rounded-lg bg-[#d4af37]/10 text-[#d4af37]">
              <Star className="w-5 h-5 fill-[#d4af37]" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">Google Reviews</div>
              <div className="text-xs font-medium text-white">{salonInfo.rating} Rating (1,500+ Reviews)</div>
              <div className="text-[10px] text-zinc-500">{salonInfo.happyClients} Happy Clients</div>
            </div>
          </div>

          {/* Hygiene & Genuine Products */}
          <div className="p-3.5 rounded-xl bg-[#121216]/80 border border-zinc-800 backdrop-blur-md flex items-center gap-3 text-left">
            <div className="p-2.5 rounded-lg bg-[#d4af37]/10 text-[#d4af37]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">Hygiene Certified</div>
              <div className="text-xs font-medium text-white">100% Sanitized Tools</div>
              <div className="text-[10px] text-zinc-500">L&apos;Oréal & Dyson Salon</div>
            </div>
          </div>
        </div>

        {/* Featured Deal Callout (if available) */}
        {featuredOffer && (
          <a
            href="#offers"
            className="mt-6 inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-xs text-[#f3e5ab] hover:bg-[#d4af37]/20 transition-all group"
          >
            <span className="px-2 py-0.5 rounded-full bg-[#d4af37] text-black font-bold text-[10px] uppercase">
              Today&apos;s Deal
            </span>
            <span>
              {featuredOffer.title} at only <strong className="text-white">₹{featuredOffer.discountedPrice}</strong>
            </span>
            <span className="text-[#d4af37] group-hover:translate-x-1 transition-transform">→</span>
          </a>
        )}
      </div>
    </section>
  );
}
