"use client";

import React from "react";
import { Sparkles, Calendar, Tag, ArrowRight, Clock, Flame } from "lucide-react";
import { SpecialOfferItem } from "@/types/salon";

interface SpecialOffersSectionProps {
  offers: SpecialOfferItem[];
  onBookOffer: (offer: SpecialOfferItem) => void;
}

export default function SpecialOffersSection({ offers, onBookOffer }: SpecialOffersSectionProps) {
  // Filter active and non-expired offers
  const today = new Date().toISOString().split("T")[0];
  const validOffers = offers.filter(
    (offer) => offer.isActive && (!offer.expiryDate || offer.expiryDate >= today)
  );

  if (validOffers.length === 0) {
    return null; // hide section if no valid offers
  }

  return (
    <section id="offers" className="py-24 px-4 sm:px-6 lg:px-8 relative bg-[#0e0e12] overflow-hidden">
      {/* Decorative Golden Ambient Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#d4af37]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#f3e5ab] text-xs font-semibold uppercase tracking-[0.2em] mb-3">
            <Flame className="w-4 h-4 text-[#d4af37]" />
            <span>Limited Period Specials</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Today&apos;s Offers & Exclusive Deals
          </h2>
          <p className="mt-3.5 text-zinc-400 text-sm sm:text-base font-light">
            Indulge in high-end salon treatments with special package rates. Limited appointment slots available daily.
          </p>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {validOffers.map((offer) => {
            const savings = offer.originalPrice - offer.discountedPrice;
            const savingsPercent = Math.round((savings / offer.originalPrice) * 100);

            return (
              <div
                key={offer.id}
                className="group relative rounded-2xl bg-[#141419] border border-[#d4af37]/30 hover:border-[#d4af37] shadow-xl hover:shadow-2xl hover:shadow-[#d4af37]/15 transition-all duration-300 flex flex-col overflow-hidden"
              >
                {/* Offer Banner Image */}
                <div className="relative h-48 w-full overflow-hidden bg-zinc-900">
                  <img
                    src={offer.image}
                    alt={offer.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141419] via-transparent to-transparent" />

                  {/* Savings Badge */}
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-lg bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    <span>{offer.discountBadge || `SAVE ${savingsPercent}%`}</span>
                  </div>
                </div>

                {/* Offer Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Title */}
                    <h3 className="font-serif-luxury text-lg font-bold text-white group-hover:text-[#d4af37] transition-colors leading-snug">
                      {offer.title}
                    </h3>

                    {/* Price Row */}
                    <div className="mt-3 flex items-baseline gap-2.5">
                      <span className="font-serif-luxury text-2xl font-bold text-[#d4af37]">
                        ₹{offer.discountedPrice}
                      </span>
                      <span className="text-sm text-zinc-500 line-through">
                        ₹{offer.originalPrice}
                      </span>
                      {savings > 0 && (
                        <span className="text-xs text-emerald-400 font-medium">
                          (Save ₹{savings})
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="mt-3 text-xs text-zinc-400 font-light leading-relaxed line-clamp-3">
                      {offer.description}
                    </p>

                    {/* Expiry / Validity Date */}
                    {offer.expiryDate && (
                      <div className="mt-4 flex items-center gap-1.5 text-[11px] text-amber-200/80 bg-amber-950/30 px-2.5 py-1 rounded-lg border border-amber-900/40">
                        <Clock className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                        <span>Valid till: {new Date(offer.expiryDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                      </div>
                    )}
                  </div>

                  {/* Book Button */}
                  <div className="mt-6 pt-4 border-t border-zinc-800">
                    <button
                      onClick={() => onBookOffer(offer)}
                      className="w-full py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-black bg-gradient-to-r from-[#e5c07b] to-[#d4af37] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-md shadow-[#d4af37]/20 cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5 fill-black" />
                      Claim Offer via WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
