"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Scissors, Menu, X, Phone, MessageCircle, Sparkles, Clock } from "lucide-react";
import { SalonInfo } from "@/types/salon";

interface NavbarProps {
  salonInfo: SalonInfo;
  onOpenBooking: () => void;
}

export default function Navbar({ salonInfo, onOpenBooking }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Prices", href: "#prices" },
    { name: "Offers", href: "#offers" },
    { name: "Gallery", href: "#gallery" },
    { name: "Contact", href: "#contact" }
  ];

  const cleanPhone = (salonInfo.phone || "+919876543210").replace(/[^0-9]/g, "");
  const cleanWhatsapp = (salonInfo.whatsapp || "+919876543210").replace(/[^0-9]/g, "");

  return (
    <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-300">
      {/* Top Announcement Bar (if enabled) */}
      {salonInfo.showAnnouncement && salonInfo.announcementBanner && (
        <div className="bg-gradient-to-r from-[#201c12] via-[#2d2514] to-[#201c12] border-b border-[#d4af37]/30 py-1.5 px-4 text-xs text-[#f3e5ab] text-center font-medium flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#d4af37] shrink-0 animate-pulse" />
          <span className="truncate max-w-4xl">{salonInfo.announcementBanner}</span>
        </div>
      )}

      {/* Main Navigation Bar */}
      <nav
        className={`transition-all duration-300 px-4 sm:px-6 lg:px-8 ${
          isScrolled
            ? "glass-nav py-3.5 shadow-xl shadow-black/60"
            : "bg-[#0b0b0e]/70 backdrop-blur-md py-4 border-b border-white/5"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="#home" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#aa7c11] p-[1.5px] shadow-lg shadow-[#d4af37]/20 transition-transform duration-300 group-hover:scale-105">
              <div className="w-full h-full bg-[#101014] rounded-[10px] flex items-center justify-center">
                <Scissors className="w-5 h-5 text-[#d4af37] group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-serif-luxury text-xl sm:text-2xl font-bold tracking-wider text-white group-hover:text-[#d4af37] transition-colors">
                {salonInfo.name}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#d4af37]/80 -mt-0.5 font-semibold">
                Luxury Unisex Salon
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-zinc-300 hover:text-[#d4af37] transition-colors tracking-wide relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#d4af37] hover:after:w-full after:transition-all after:duration-300"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Action CTAs Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={`tel:+${cleanPhone}`}
              className="p-2.5 text-zinc-300 hover:text-white hover:bg-white/5 rounded-xl border border-zinc-800 transition-colors"
              title="Call Salon"
            >
              <Phone className="w-4 h-4 text-[#d4af37]" />
            </a>

            <button
              onClick={onOpenBooking}
              className="px-5 py-2.5 rounded-xl font-semibold text-xs tracking-wider uppercase text-black bg-gradient-to-r from-[#e5c07b] via-[#d4af37] to-[#aa7c11] hover:brightness-110 active:scale-[0.98] transition-all shadow-md shadow-[#d4af37]/20 flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 fill-black" />
              Book Now
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onOpenBooking}
              className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase text-black bg-[#d4af37] hover:bg-[#e5c07b] transition-colors"
            >
              Book
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-zinc-300 hover:text-white rounded-lg bg-zinc-900 border border-zinc-800"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[65px] bg-[#0e0e12]/95 backdrop-blur-xl border-b border-[#d4af37]/20 p-6 shadow-2xl transition-all duration-300 animate-fadeIn">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-serif-luxury font-medium text-zinc-200 hover:text-[#d4af37] border-b border-zinc-800/60 pb-2 flex items-center justify-between"
              >
                <span>{link.name}</span>
                <span className="text-zinc-600 text-xs">›</span>
              </a>
            ))}

            <div className="pt-2 flex flex-col gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full py-3 rounded-xl font-bold text-center text-black bg-gradient-to-r from-[#e5c07b] to-[#d4af37] uppercase tracking-wider text-sm flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 fill-black" />
                Book via WhatsApp
              </button>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`tel:+${cleanPhone}`}
                  className="py-2.5 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs font-semibold flex items-center justify-center gap-2 hover:border-[#d4af37]"
                >
                  <Phone className="w-3.5 h-3.5 text-[#d4af37]" />
                  Call Now
                </a>
                <a
                  href={`https://wa.me/${cleanWhatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-green-950/40 border border-green-800/60 text-green-300 text-xs font-semibold flex items-center justify-center gap-2 hover:bg-green-900/40"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-green-400" />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
