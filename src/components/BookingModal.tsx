"use client";

import React, { useState, useEffect } from "react";
import { X, Calendar, Clock, User, Phone, Sparkles, MessageCircle, CheckCircle2 } from "lucide-react";
import { ServiceItem, SpecialOfferItem, SalonInfo } from "@/types/salon";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  salonInfo: SalonInfo;
  services: ServiceItem[];
  offers: SpecialOfferItem[];
  preselectedItem?: { name: string; price?: number } | null;
}

export default function BookingModal({
  isOpen,
  onClose,
  salonInfo,
  services,
  offers,
  preselectedItem
}: BookingModalProps) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("11:00 AM");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  // Set default date to today
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setDate(today);
  }, []);

  // Update selected item when preselectedItem changes
  useEffect(() => {
    if (preselectedItem?.name) {
      setSelectedItem(preselectedItem.name);
    } else if (services.length > 0 && !selectedItem) {
      setSelectedItem(services[0].name);
    }
  }, [preselectedItem, services, selectedItem]);

  if (!isOpen) return null;

  const timeSlots = [
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:30 PM",
    "02:30 PM",
    "03:30 PM",
    "04:30 PM",
    "05:30 PM",
    "06:30 PM",
    "07:30 PM",
    "08:00 PM"
  ];

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    const cleanMobile = mobile.replace(/[^0-9]/g, "");
    if (cleanMobile.length < 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    if (!selectedItem) {
      setError("Please select a service or special offer");
      return;
    }

    if (!date) {
      setError("Please select a preferred date");
      return;
    }

    // Format WhatsApp prefilled message
    const formattedDate = new Date(date).toLocaleDateString("en-IN", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric"
    });

    const messageLines = [
      `✨ *APPOINTMENT REQUEST — ${salonInfo.name}* ✨`,
      ``,
      `Hello ${salonInfo.name}, I would like to book an appointment:`,
      ``,
      `👤 *Customer Name:* ${name.trim()}`,
      `📱 *Mobile Number:* ${mobile.trim()}`,
      `💇 *Service / Deal:* ${selectedItem}`,
      `📅 *Preferred Date:* ${formattedDate}`,
      `⏰ *Preferred Time:* ${timeSlot}`,
      notes.trim() ? `📝 *Special Requests / Notes:* ${notes.trim()}` : "",
      ``,
      `Please confirm availability. Thank you!`
    ].filter(Boolean);

    const messageText = messageLines.join("\n");
    const rawSalonNumber = salonInfo.whatsapp || salonInfo.phone || "+919876543210";
    const cleanSalonNumber = rawSalonNumber.replace(/[^0-9]/g, "");

    // WhatsApp URL
    const whatsappUrl = `https://wa.me/${cleanSalonNumber}?text=${encodeURIComponent(messageText)}`;

    // Open WhatsApp
    window.open(whatsappUrl, "_blank");

    // Close modal
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-lg bg-[#141418] border border-[#d4af37]/30 rounded-2xl shadow-2xl shadow-black overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-[#1c1c24] via-[#16161c] to-[#1c1c24] border-b border-[#d4af37]/20 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#d4af37]" />
              <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
                Instant Appointment
              </span>
            </div>
            <h3 className="text-xl font-serif-luxury font-bold text-white mt-1">
              Book at {salonInfo.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleBookingSubmit} className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 bg-red-950/60 border border-red-500/40 text-red-200 text-sm rounded-lg">
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 uppercase tracking-wider mb-1.5">
              Your Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#d4af37] absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full bg-[#0b0b0e] border border-zinc-700 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-zinc-500 text-sm outline-none transition-all"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 uppercase tracking-wider mb-1.5">
              Mobile / WhatsApp Number *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#d4af37] absolute left-3.5 top-3.5" />
              <input
                type="tel"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="e.g. 98765 43210"
                className="w-full bg-[#0b0b0e] border border-zinc-700 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-zinc-500 text-sm outline-none transition-all"
              />
            </div>
          </div>

          {/* Service / Offer Dropdown */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 uppercase tracking-wider mb-1.5">
              Selected Service or Deal *
            </label>
            <select
              value={selectedItem}
              onChange={(e) => setSelectedItem(e.target.value)}
              className="w-full bg-[#0b0b0e] border border-zinc-700 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] rounded-xl px-3.5 py-2.5 text-white text-sm outline-none transition-all"
            >
              <optgroup label="✨ Special Offers & Combos">
                {offers.map((offer) => (
                  <option key={offer.id} value={`${offer.title} (Deal ₹${offer.discountedPrice})`}>
                    {offer.title} — ₹{offer.discountedPrice} ({offer.discountBadge})
                  </option>
                ))}
              </optgroup>
              <optgroup label="💇 Salon Services">
                {services.map((service) => (
                  <option key={service.id} value={`${service.name} (₹${service.price})`}>
                    {service.name} — ₹{service.price} ({service.duration})
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Date & Time Slot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-medium text-zinc-300 uppercase tracking-wider mb-1.5">
                Preferred Date *
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-[#d4af37] absolute left-3.5 top-3.5" />
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split("T")[0]}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-[#0b0b0e] border border-zinc-700 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] rounded-xl pl-10 pr-3 py-2.5 text-white text-sm outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 uppercase tracking-wider mb-1.5">
                Preferred Time *
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-[#d4af37] absolute left-3.5 top-3.5" />
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full bg-[#0b0b0e] border border-zinc-700 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] rounded-xl pl-10 pr-3 py-2.5 text-white text-sm outline-none transition-all"
                >
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Optional Notes */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 uppercase tracking-wider mb-1.5">
              Special Requests / Stylist Preference (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Prefer Senior Stylist, hair wash first, etc."
              className="w-full bg-[#0b0b0e] border border-zinc-700 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] rounded-xl px-3.5 py-2 text-white placeholder-zinc-500 text-sm outline-none transition-all"
            />
          </div>

          {/* Notice */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/25 text-zinc-300 text-xs">
            <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
            <p>
              Clicking below will format your booking and open WhatsApp. The salon owner will confirm your appointment based on slot availability.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl font-bold text-black bg-gradient-to-r from-[#e5c07b] via-[#d4af37] to-[#aa7c11] hover:brightness-110 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2.5 shadow-lg shadow-[#d4af37]/20 uppercase tracking-wider text-sm cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 fill-black" />
            Send Booking Request via WhatsApp
          </button>
        </form>
      </div>
    </div>
  );
}
