"use client";

import React, { useState, useEffect, useMemo } from "react";
import QRCode from "qrcode";
import {
  X,
  Calendar,
  Clock,
  User,
  Phone,
  Sparkles,
  MessageCircle,
  CheckCircle2,
  CreditCard,
  QrCode as QrIcon,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
  Wallet
} from "lucide-react";
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
  const [paymentMethod, setPaymentMethod] = useState<"salon" | "upi">("salon");
  const [transactionId, setTransactionId] = useState("");
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [upiQrDataUrl, setUpiQrDataUrl] = useState<string>("");
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

  // Calculate current price for payment
  const currentPrice = useMemo(() => {
    if (preselectedItem?.price) return preselectedItem.price;

    // Check offers first
    const foundOffer = offers.find((o) => selectedItem.includes(o.title));
    if (foundOffer) return foundOffer.discountedPrice;

    // Check services
    const foundService = services.find((s) => selectedItem.includes(s.name));
    if (foundService) return foundService.price;

    return 250;
  }, [selectedItem, preselectedItem, offers, services]);

  const payableAmount = useMemo(() => {
    if (salonInfo.advanceDepositAmount && salonInfo.advanceDepositAmount > 0) {
      return Math.min(salonInfo.advanceDepositAmount, currentPrice);
    }
    return currentPrice;
  }, [salonInfo.advanceDepositAmount, currentPrice]);

  // Generate UPI string & QR
  const upiId = salonInfo.upiId || "abcdsalon@okhdfcbank";
  const upiUrl = useMemo(() => {
    const cleanUpi = upiId.trim();
    const cleanSalonName = salonInfo.name.replace(/[^a-zA-Z0-9 ]/g, "");
    return `upi://pay?pa=${cleanUpi}&pn=${encodeURIComponent(cleanSalonName)}&am=${payableAmount}&cu=INR&tn=${encodeURIComponent(`Booking for ${name || "Client"}`)}`;
  }, [upiId, salonInfo.name, payableAmount, name]);

  useEffect(() => {
    if (paymentMethod === "upi" && isOpen) {
      QRCode.toDataURL(upiUrl, {
        width: 280,
        margin: 2,
        color: { dark: "#0b0b0e", light: "#ffffff" }
      })
        .then((url) => setUpiQrDataUrl(url))
        .catch((err) => console.error("Error generating UPI QR:", err));
    }
  }, [upiUrl, paymentMethod, isOpen]);

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

  const handleCopyUpi = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(upiId);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2500);
    }
  };

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

    const paymentText =
      paymentMethod === "upi"
        ? [
            `💳 *Payment Method:* Online UPI (GPay / PhonePe / Paytm)`,
            `💵 *Amount Paid:* ₹${payableAmount}`,
            transactionId.trim()
              ? `🧾 *UPI Ref / UTR No:* ${transactionId.trim()}`
              : `🧾 *Payment Status:* Paid via UPI (Screenshot attached)`
          ]
        : [`💳 *Payment Method:* Pay at Salon (Cash / Card after treatment)`];

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
      ...paymentText,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-lg bg-[#141418] border border-[#d4af37]/30 rounded-2xl shadow-2xl shadow-black overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-6 py-4 bg-gradient-to-r from-[#1c1c24] via-[#16161c] to-[#1c1c24] border-b border-[#d4af37]/20 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#d4af37]" />
              <span className="text-[10px] uppercase tracking-widest text-[#d4af37] font-semibold">
                Instant Appointment
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-serif-luxury font-bold text-white mt-0.5">
              Book at {salonInfo.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleBookingSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 bg-red-950/60 border border-red-500/40 text-red-200 text-xs rounded-lg">
              {error}
            </div>
          )}

          {/* Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-medium text-zinc-300 uppercase tracking-wider mb-1.5">
                Your Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#d4af37] absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-[#0b0b0e] border border-zinc-700 focus:border-[#d4af37] rounded-xl pl-9 pr-3 py-2.5 text-white placeholder-zinc-500 text-xs sm:text-sm outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-zinc-300 uppercase tracking-wider mb-1.5">
                Mobile / WhatsApp *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#d4af37] absolute left-3 top-3" />
                <input
                  type="tel"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="e.g. 98765 43210"
                  className="w-full bg-[#0b0b0e] border border-zinc-700 focus:border-[#d4af37] rounded-xl pl-9 pr-3 py-2.5 text-white placeholder-zinc-500 text-xs sm:text-sm outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Service / Offer Dropdown */}
          <div>
            <label className="block text-[11px] font-medium text-zinc-300 uppercase tracking-wider mb-1.5">
              Selected Service or Deal *
            </label>
            <select
              value={selectedItem}
              onChange={(e) => setSelectedItem(e.target.value)}
              className="w-full bg-[#0b0b0e] border border-zinc-700 focus:border-[#d4af37] rounded-xl px-3 py-2.5 text-white text-xs sm:text-sm outline-none transition-all"
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
              <label className="block text-[11px] font-medium text-zinc-300 uppercase tracking-wider mb-1.5">
                Preferred Date *
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-[#d4af37] absolute left-3 top-3" />
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split("T")[0]}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-[#0b0b0e] border border-zinc-700 focus:border-[#d4af37] rounded-xl pl-9 pr-3 py-2 text-white text-xs sm:text-sm outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-zinc-300 uppercase tracking-wider mb-1.5">
                Preferred Time *
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-[#d4af37] absolute left-3 top-3" />
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full bg-[#0b0b0e] border border-zinc-700 focus:border-[#d4af37] rounded-xl pl-9 pr-3 py-2 text-white text-xs sm:text-sm outline-none"
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

          {/* PAYMENT METHOD SELECTION */}
          {salonInfo.enableOnlinePayment !== false && (
            <div className="pt-2">
              <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                Choose Payment Option
              </label>
              <div className="grid grid-cols-2 gap-3">
                {/* Option 1: Pay at Salon */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("salon")}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    paymentMethod === "salon"
                      ? "bg-[#1c1c24] border-[#d4af37] shadow-md shadow-[#d4af37]/10"
                      : "bg-[#0b0b0e] border-zinc-800 text-zinc-400 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Wallet className={`w-4 h-4 ${paymentMethod === "salon" ? "text-[#d4af37]" : "text-zinc-500"}`} />
                    {paymentMethod === "salon" && (
                      <Check className="w-3.5 h-3.5 text-[#d4af37]" />
                    )}
                  </div>
                  <div className="font-semibold text-xs text-white">Pay at Salon</div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">Cash / Card after service</div>
                </button>

                {/* Option 2: Pay Online UPI */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("upi")}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    paymentMethod === "upi"
                      ? "bg-[#1c1c24] border-[#d4af37] shadow-md shadow-[#d4af37]/10"
                      : "bg-[#0b0b0e] border-zinc-800 text-zinc-400 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <QrIcon className={`w-4 h-4 ${paymentMethod === "upi" ? "text-[#d4af37]" : "text-zinc-500"}`} />
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 font-bold">
                        Fast UPI
                      </span>
                    </div>
                    {paymentMethod === "upi" && (
                      <Check className="w-3.5 h-3.5 text-[#d4af37]" />
                    )}
                  </div>
                  <div className="font-semibold text-xs text-white">Pay Online (UPI)</div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">GPay • PhonePe • Paytm</div>
                </button>
              </div>

              {/* UPI PAYMENT CARD (If UPI selected) */}
              {paymentMethod === "upi" && (
                <div className="mt-3 p-4 rounded-xl bg-gradient-to-b from-[#181820] to-[#121217] border border-[#d4af37]/40 space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-[#d4af37] font-semibold">
                        Instant UPI Payment
                      </div>
                      <div className="text-xs text-zinc-300">
                        {salonInfo.advanceDepositAmount && salonInfo.advanceDepositAmount > 0
                          ? "Slot Advance Deposit"
                          : "Total Service Amount"}
                      </div>
                    </div>
                    <div className="font-serif-luxury font-bold text-xl text-[#d4af37]">
                      ₹{payableAmount}
                    </div>
                  </div>

                  {/* QR Code and Direct App Link */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 pt-1 pb-1">
                    {/* QR Code */}
                    <div className="p-2 bg-white rounded-xl shadow-lg border border-[#d4af37]/40 shrink-0">
                      {upiQrDataUrl ? (
                        <img
                          src={upiQrDataUrl}
                          alt="UPI Payment QR"
                          className="w-28 h-28 object-contain"
                        />
                      ) : (
                        <div className="w-28 h-28 flex items-center justify-center text-black text-[10px]">
                          Generating QR...
                        </div>
                      )}
                    </div>

                    <div className="flex-1 text-center sm:text-left space-y-2 w-full">
                      <p className="text-[11px] text-zinc-300 font-light leading-snug">
                        Scan with <strong className="text-white">Google Pay, PhonePe, Paytm</strong> or click below to launch your UPI app:
                      </p>

                      {/* Mobile UPI Direct App Launcher */}
                      <a
                        href={upiUrl}
                        className="inline-flex w-full py-2 px-3 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider items-center justify-center gap-1.5 shadow-md"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Pay via UPI App (GPay/PhonePe)</span>
                      </a>

                      {/* UPI ID with copy button */}
                      <div className="flex items-center justify-between bg-black/40 border border-zinc-800 rounded-lg px-2.5 py-1 text-xs">
                        <span className="font-mono text-zinc-300 text-[11px] truncate">
                          {upiId}
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyUpi}
                          className="text-[#d4af37] hover:text-white flex items-center gap-1 text-[10px] shrink-0 ml-2 cursor-pointer"
                        >
                          {copiedUpi ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy UPI</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Optional UTR / Reference */}
                  <div>
                    <label className="block text-[10px] font-medium text-zinc-400 uppercase tracking-wider mb-1">
                      UPI Ref / UTR Number (Optional, or share screenshot on WhatsApp)
                    </label>
                    <input
                      type="text"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder="e.g. 412389123812 or GPay Trans ID"
                      className="w-full bg-[#0b0b0e] border border-zinc-700 focus:border-[#d4af37] rounded-lg px-3 py-1.5 text-white placeholder-zinc-500 text-xs outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-[11px] font-medium text-zinc-300 uppercase tracking-wider mb-1">
              Special Requests / Stylist Preference (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Prefer Senior Stylist, hair wash first, etc."
              className="w-full bg-[#0b0b0e] border border-zinc-700 focus:border-[#d4af37] rounded-xl px-3 py-2 text-white placeholder-zinc-500 text-xs outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl font-bold text-black bg-gradient-to-r from-[#e5c07b] via-[#d4af37] to-[#aa7c11] hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#d4af37]/20 uppercase tracking-wider text-xs sm:text-sm cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-black" />
            <span>
              {paymentMethod === "upi"
                ? "Confirm & Send Paid Booking via WhatsApp"
                : "Send Booking Request via WhatsApp"}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
