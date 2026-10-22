"use client";

import React from "react";
import { Phone, MessageCircle, Calendar } from "lucide-react";
import { SalonInfo } from "@/types/salon";

interface FloatingMobileBarProps {
  salonInfo: SalonInfo;
  onOpenBooking: () => void;
}

export default function FloatingMobileBar({ salonInfo, onOpenBooking }: FloatingMobileBarProps) {
  const cleanPhone = (salonInfo.phone || "+919876543210").replace(/[^0-9]/g, "");
  const cleanWhatsapp = (salonInfo.whatsapp || "+919876543210").replace(/[^0-9]/g, "");

  return (
    <div className="md:hidden fixed bottom-3 left-3 right-3 z-40 animate-slideUp">
      <div className="bg-[#121217]/95 backdrop-blur-xl border border-[#d4af37]/30 rounded-2xl p-2 shadow-2xl shadow-black flex items-center justify-between gap-2">
        {/* Call Now */}
        <a
          href={`tel:+${cleanPhone}`}
          className="flex-1 py-2.5 px-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs font-semibold flex items-center justify-center gap-1.5 active:bg-zinc-800 transition-colors"
          title="Call Now"
        >
          <Phone className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>Call</span>
        </a>

        {/* WhatsApp */}
        <a
          href={`https://wa.me/${cleanWhatsapp}`}
          target="_blank"
          rel="noreferrer"
          className="flex-1 py-2.5 px-2 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 active:bg-emerald-900 transition-colors"
          title="WhatsApp Us"
        >
          <MessageCircle className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />
          <span>WhatsApp</span>
        </a>

        {/* Book Appointment CTA */}
        <button
          onClick={onOpenBooking}
          className="flex-[1.5] py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#e5c07b] to-[#d4af37] text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-[#d4af37]/20 active:scale-[0.98] transition-all cursor-pointer"
        >
          <Calendar className="w-3.5 h-3.5 fill-black" />
          <span>Book Slot</span>
        </button>
      </div>
    </div>
  );
}
