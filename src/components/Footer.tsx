"use client";

import React from "react";
import Link from "next/link";
import { Scissors, Phone, MapPin, Lock, QrCode } from "lucide-react";
import {
  InstagramIcon,
  FacebookIcon,
  YoutubeIcon,
  WhatsAppIcon
} from "@/components/SocialIcons";
import { SalonInfo } from "@/types/salon";

interface FooterProps {
  salonInfo: SalonInfo;
  onOpenBooking: () => void;
  onOpenQrModal?: () => void;
}

export default function Footer({ salonInfo, onOpenBooking, onOpenQrModal }: FooterProps) {
  const cleanPhone = (salonInfo.phone || "+919876543210").replace(/[^0-9]/g, "");
  const cleanWhatsapp = (salonInfo.whatsapp || "+919876543210").replace(/[^0-9]/g, "");

  const socialLinks = [
    {
      name: "Instagram",
      url: salonInfo.instagram,
      icon: InstagramIcon,
      color: "hover:text-pink-400 hover:border-pink-500/40"
    },
    {
      name: "Facebook",
      url: salonInfo.facebook,
      icon: FacebookIcon,
      color: "hover:text-blue-400 hover:border-blue-500/40"
    },
    {
      name: "YouTube",
      url: salonInfo.youtube,
      icon: YoutubeIcon,
      color: "hover:text-red-400 hover:border-red-500/40"
    },
    {
      name: "WhatsApp",
      url: `https://wa.me/${cleanWhatsapp}`,
      icon: WhatsAppIcon,
      color: "hover:text-emerald-400 hover:border-emerald-500/40"
    }
  ].filter((s) => Boolean(s.url && s.url.trim()));

  return (
    <footer className="bg-[#09090c] border-t border-zinc-800/80 pt-16 pb-24 md:pb-12 px-4 sm:px-6 lg:px-8 text-zinc-400 relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-zinc-800/80">
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-4">
            <Link href="#home" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#aa7c11] p-[1.5px] shadow-md shadow-[#d4af37]/20">
                <div className="w-full h-full bg-[#101014] rounded-[10px] flex items-center justify-center">
                  <Scissors className="w-5 h-5 text-[#d4af37]" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-serif-luxury text-2xl font-bold tracking-wider text-white">
                  {salonInfo.name}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#d4af37] font-semibold">
                  Luxury Unisex Salon
                </span>
              </div>
            </Link>

            <p className="mt-4 text-xs sm:text-sm text-zinc-400 leading-relaxed font-light">
              {salonInfo.shortIntro ||
                "Step into ABCD Salon for an unparalleled indulgence in hair artistry, rejuvenating skincare, and bespoke bridal transformations."}
            </p>

            {/* Social Media Links */}
            {socialLinks.length > 0 && (
              <div className="mt-6 flex items-center gap-3">
                {socialLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.name}
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={item.name}
                      className={`w-10 h-10 rounded-xl bg-[#141419] border border-zinc-800 text-zinc-400 flex items-center justify-center transition-all ${item.color}`}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="font-serif-luxury text-sm font-bold text-white uppercase tracking-wider mb-4">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <a href="#home" className="hover:text-[#d4af37] transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-[#d4af37] transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#d4af37] transition-colors">
                  Services Menu
                </a>
              </li>
              <li>
                <a href="#offers" className="hover:text-[#d4af37] transition-colors">
                  Today&apos;s Offers
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-[#d4af37] transition-colors">
                  Photo Gallery
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#d4af37] transition-colors">
                  Contact & Map
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Services Summary */}
          <div className="lg:col-span-3">
            <h4 className="font-serif-luxury text-sm font-bold text-white uppercase tracking-wider mb-4">
              Popular Services
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li className="flex items-center justify-between text-zinc-300">
                <span>Men&apos;s Precision Haircut</span>
                <span className="text-[#d4af37] font-semibold">₹150</span>
              </li>
              <li className="flex items-center justify-between text-zinc-300">
                <span>Women&apos;s Restyle & Blowdry</span>
                <span className="text-[#d4af37] font-semibold">₹400</span>
              </li>
              <li className="flex items-center justify-between text-zinc-300">
                <span>Luxury Kérastase Hair Spa</span>
                <span className="text-[#d4af37] font-semibold">₹699</span>
              </li>
              <li className="flex items-center justify-between text-zinc-300">
                <span>Hydra Gold Brightening Facial</span>
                <span className="text-[#d4af37] font-semibold">₹799</span>
              </li>
              <li className="flex items-center justify-between text-zinc-300">
                <span>Royal HD Bridal Makeover</span>
                <span className="text-[#d4af37] font-semibold">₹4,999</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Timings & QR Stand */}
          <div className="lg:col-span-3">
            <h4 className="font-serif-luxury text-sm font-bold text-white uppercase tracking-wider mb-4">
              Visiting Hours
            </h4>
            <div className="space-y-2 text-xs sm:text-sm">
              <p className="text-zinc-300">
                <span className="font-medium text-white">{salonInfo.openingHours}</span>
              </p>
              <p className="text-amber-400/90 text-xs">
                Weekly Closed: {salonInfo.closedDay}
              </p>
              <p className="text-zinc-400 text-xs mt-3 flex items-start gap-1.5">
                <MapPin className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <span>{salonInfo.address}, {salonInfo.city}</span>
              </p>
            </div>

            {onOpenQrModal && (
              <button
                onClick={onOpenQrModal}
                className="mt-5 w-full py-2.5 px-3 rounded-xl bg-zinc-900 border border-zinc-700/80 hover:border-[#d4af37] text-zinc-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-[#d4af37]" />
                <span>Salon Table QR Code</span>
              </button>
            )}
          </div>
        </div>

        {/* Bottom Copyright & Admin Link */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div>
            © {new Date().getFullYear()} {salonInfo.name}. All Rights Reserved. Mumbai, India.
          </div>

          <div className="flex items-center gap-5">
            <a href="#home" className="hover:text-zinc-400 transition-colors">
              Back to Top ↑
            </a>
            <span className="text-zinc-700">•</span>
            {/* Admin Dashboard Login Link */}
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-[#d4af37] transition-colors font-medium"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
