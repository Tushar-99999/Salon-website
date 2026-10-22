"use client";

import React from "react";
import {
  Sparkles,
  MapPin,
  Phone,
  MessageCircle,
  Mail,
  Clock,
  CalendarX,
  Navigation,
  ExternalLink
} from "lucide-react";
import { SalonInfo } from "@/types/salon";

interface ContactSectionProps {
  salonInfo: SalonInfo;
}

export default function ContactSection({ salonInfo }: ContactSectionProps) {
  const cleanPhone = (salonInfo.phone || "+919876543210").replace(/[^0-9]/g, "");
  const cleanWhatsapp = (salonInfo.whatsapp || "+919876543210").replace(/[^0-9]/g, "");

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 relative bg-[#0e0e12]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-[#d4af37] text-xs font-semibold uppercase tracking-[0.25em] mb-2.5">
            <Sparkles className="w-4 h-4" />
            <span>Visit Us In Person</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Contact & Location
          </h2>
          <p className="mt-3.5 text-zinc-400 text-sm sm:text-base font-light">
            Conveniently situated in Bandra West, Mumbai with valet parking assistance and comfortable air-conditioned waiting lounge.
          </p>
        </div>

        {/* Contact Cards & Map Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Details Cards */}
          <div className="lg:col-span-5 space-y-4">
            {/* Address Card */}
            <div className="p-6 rounded-2xl bg-[#141419] border border-zinc-800 hover:border-[#d4af37]/40 transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-[#d4af37]/10 text-[#d4af37] shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-serif-luxury text-lg font-bold text-white">Our Address</h3>
                  <p className="text-sm text-zinc-300 mt-1.5 font-light leading-relaxed">
                    {salonInfo.address}, {salonInfo.city}, {salonInfo.state} - {salonInfo.pincode}
                  </p>
                  <a
                    href={salonInfo.googleMapsUrl || "https://maps.google.com"}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#d4af37] hover:underline mt-3"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Get Directions on Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Timings Card */}
            <div className="p-6 rounded-2xl bg-[#141419] border border-zinc-800 hover:border-[#d4af37]/40 transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-[#d4af37]/10 text-[#d4af37] shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-serif-luxury text-lg font-bold text-white">Hours & Schedule</h3>
                  <div className="mt-2 space-y-1.5 text-sm">
                    <div className="flex items-center justify-between text-zinc-300">
                      <span>Working Hours:</span>
                      <strong className="text-white font-medium">{salonInfo.openingHours}</strong>
                    </div>
                    <div className="flex items-center justify-between text-zinc-400">
                      <span>Weekly Closed Day:</span>
                      <span className="text-amber-400 font-medium">{salonInfo.closedDay}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1a1914] to-[#141419] border border-[#d4af37]/30 shadow-xl">
              <h3 className="font-serif-luxury text-lg font-bold text-white mb-4">
                Connect Directly
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`tel:+${cleanPhone}`}
                  className="py-3 px-4 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 text-white font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all hover:border-[#d4af37]"
                >
                  <Phone className="w-4 h-4 text-[#d4af37]" />
                  Call Now
                </a>
                <a
                  href={`https://wa.me/${cleanWhatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-950"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  WhatsApp
                </a>
              </div>

              {salonInfo.email && (
                <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center gap-2 text-xs text-zinc-400">
                  <Mail className="w-4 h-4 text-[#d4af37]" />
                  <a href={`mailto:${salonInfo.email}`} className="hover:text-white transition-colors">
                    {salonInfo.email}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Google Maps Embed */}
          <div className="lg:col-span-7 h-[420px] lg:h-[480px] rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl relative bg-zinc-900">
            <iframe
              src={
                salonInfo.googleMapsEmbed ||
                "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.441235128678!2d72.83151837583696!3d19.062846182141566!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c91130392c07%3A0x2863773e37d5f07b!2sLinking%20Rd%2C%20Bandra%20West%2C%20Mumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              }
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="ABCD Salon Google Maps Location"
              className="w-full h-full grayscale-[40%] contrast-[1.15]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
