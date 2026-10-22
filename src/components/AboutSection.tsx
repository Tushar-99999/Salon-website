"use client";

import React from "react";
import { Sparkles, Users, Award, ShieldCheck, HeartHandshake, CheckCircle } from "lucide-react";
import { SalonInfo } from "@/types/salon";

interface AboutSectionProps {
  salonInfo: SalonInfo;
  onOpenBooking: () => void;
}

export default function AboutSection({ salonInfo, onOpenBooking }: AboutSectionProps) {
  const features = [
    {
      title: "Services for Men & Women",
      description: "Dedicated styling zones tailored for men's sharp fades & beard crafting, and women's exquisite hair restyling & skin therapies."
    },
    {
      title: "Certified Master Stylists",
      description: "Trained under top international hair and skin academies with over 8+ years average master craftsmanship."
    },
    {
      title: "100% Genuine Luxury Products",
      description: "We use only authentic salon-grade formulations from L'Oréal Professionnel, Kérastase Paris, MAC Cosmetics, and Dyson."
    },
    {
      title: "Sanitized & Hygienic Ambiance",
      description: "Every scissor, razor, and comb is UV-sanitized. Disposable capes and single-use facial kits ensure absolute safety."
    },
    {
      title: "Transparent & Affordable Pricing",
      description: "No hidden fees. Every service price is clearly listed so you enjoy royal luxury without unexpected surprises."
    },
    {
      title: "Relaxing VIP Comfort",
      description: "Ergonomic leather chairs, soothing aromatherapy, complimentary refreshments, and quiet private facial booths."
    }
  ];

  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 relative bg-[#0e0e12] overflow-hidden">
      {/* Decorative Gold Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Visual Photography Collage */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Primary Image */}
              <div className="relative rounded-2xl overflow-hidden border border-[#d4af37]/30 shadow-2xl shadow-black/80 aspect-[4/5]">
                <img
                  src={salonInfo.aboutImage1 || "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80"}
                  alt="Stylist at work in ABCD Salon"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/10">
                  <div className="flex items-center gap-2 text-[#d4af37] font-semibold text-xs uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    <span>Certified Hair & Skin Masters</span>
                  </div>
                  <div className="text-white text-sm font-medium mt-0.5">
                    Personalized consultation before every treatment
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -top-4 -right-4 sm:-right-6 p-4 rounded-2xl bg-gradient-to-br from-[#1c1c24] to-[#121216] border border-[#d4af37]/40 shadow-xl backdrop-blur-md flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#d4af37]/20 flex items-center justify-center text-[#d4af37]">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-serif-luxury font-bold text-white">{salonInfo.yearsOfExcellence || "8+"}</div>
                  <div className="text-[11px] uppercase tracking-wider text-zinc-400">Years of Luxury</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: About Content & Highlights */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Tagline */}
            <div className="inline-flex items-center gap-2 text-[#d4af37] text-xs font-semibold uppercase tracking-[0.2em] mb-3">
              <Sparkles className="w-4 h-4" />
              <span>About {salonInfo.name}</span>
            </div>

            {/* Title */}
            <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              {salonInfo.aboutTitle || "A Decade of Hair & Skin Artistry"}
            </h2>

            {/* Paragraph Description */}
            <p className="mt-5 text-base sm:text-lg text-zinc-300 leading-relaxed font-light">
              {salonInfo.description || salonInfo.aboutStory}
            </p>

            {/* Feature Highlights Grid */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[#14141a]/60 border border-zinc-800/80 hover:border-[#d4af37]/40 transition-colors duration-200"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-[#d4af37] shrink-0 mt-1" />
                    <div>
                      <h4 className="text-sm font-semibold text-white tracking-wide">{item.title}</h4>
                      <p className="text-xs text-zinc-400 mt-1 leading-normal font-light">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Counter Stats */}
            <div className="mt-8 pt-6 border-t border-zinc-800/80 grid grid-cols-3 gap-4">
              <div>
                <div className="text-2xl sm:text-3xl font-serif-luxury font-bold text-white">
                  {salonInfo.happyClients || "15,000+"}
                </div>
                <div className="text-xs text-zinc-400 uppercase tracking-wider mt-0.5">Happy Clients</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-serif-luxury font-bold text-white">
                  {salonInfo.expertStylists || "12"}
                </div>
                <div className="text-xs text-zinc-400 uppercase tracking-wider mt-0.5">Expert Stylists</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#d4af37]">
                  {salonInfo.rating || "4.9★"}
                </div>
                <div className="text-xs text-zinc-400 uppercase tracking-wider mt-0.5">Google Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
