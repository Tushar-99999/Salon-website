"use client";

import React, { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import { X, Printer, Download, Sparkles, Scissors, QrCode as QrIcon } from "lucide-react";
import { SalonInfo } from "@/types/salon";

interface PrintableQrStandProps {
  isOpen: boolean;
  onClose: () => void;
  salonInfo: SalonInfo;
}

export default function PrintableQrStand({ isOpen, onClose, salonInfo }: PrintableQrStandProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [siteUrl, setSiteUrl] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentUrl = salonInfo.websiteUrl || window.location.origin;
      setSiteUrl(currentUrl);

      QRCode.toDataURL(currentUrl, {
        width: 400,
        margin: 2,
        color: {
          dark: "#0b0b0e",
          light: "#ffffff"
        }
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error("QR Code generation error:", err));
    }
  }, [isOpen, salonInfo.websiteUrl]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.download = `${salonInfo.name.toLowerCase().replace(/\s+/g, "-")}-qr-code.png`;
    link.href = qrDataUrl;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-xl bg-[#141419] border border-[#d4af37]/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="p-4 px-6 bg-[#1a1a22] border-b border-zinc-800 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <QrIcon className="w-5 h-5 text-[#d4af37]" />
            <h3 className="text-lg font-serif-luxury font-bold text-white">
              Salon Tabletop QR Code Stand
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Card Area */}
        <div className="p-6 overflow-y-auto flex flex-col items-center">
          <div
            id="printable-qr-stand"
            className="w-full max-w-sm bg-gradient-to-b from-[#18181f] via-[#101014] to-[#18181f] border-2 border-[#d4af37] rounded-3xl p-8 text-center shadow-2xl flex flex-col items-center text-white"
          >
            {/* Salon Logo Badge */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#d4af37] to-[#aa7c11] p-[2px] shadow-lg shadow-[#d4af37]/30 mb-4">
              <div className="w-full h-full bg-[#101014] rounded-[14px] flex items-center justify-center">
                <Scissors className="w-7 h-7 text-[#d4af37]" />
              </div>
            </div>

            <div className="text-xs uppercase tracking-[0.25em] text-[#d4af37] font-semibold mb-1">
              Welcome To
            </div>
            <h2 className="font-serif-luxury text-3xl font-bold tracking-wide text-white mb-2">
              {salonInfo.name}
            </h2>
            <p className="text-xs text-zinc-400 font-light mb-6 px-4">
              Luxury Unisex Hair, Skin & Bridal Artistry
            </p>

            {/* High-Resolution QR Box */}
            <div className="p-4 bg-white rounded-2xl shadow-xl shadow-black/80 border-4 border-[#d4af37]/40 mb-5">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`${salonInfo.name} QR Code`}
                  className="w-52 h-52 object-contain"
                />
              ) : (
                <div className="w-52 h-52 flex items-center justify-center text-zinc-800 text-xs">
                  Generating QR...
                </div>
              )}
            </div>

            {/* Scan Callout */}
            <div className="bg-[#d4af37]/15 border border-[#d4af37]/40 rounded-xl py-3 px-4 w-full">
              <p className="text-sm font-serif-luxury font-bold text-[#f3e5ab] leading-snug">
                Scan to Explore Our Services, Prices & Special Offers
              </p>
              <p className="text-[11px] text-zinc-400 mt-1">
                Book instantly via WhatsApp • View Today&apos;s Deals
              </p>
            </div>

            <div className="mt-5 text-[11px] text-zinc-400">
              {salonInfo.address}, {salonInfo.city}
            </div>
          </div>
        </div>

        {/* Action Buttons in Modal Footer */}
        <div className="p-4 px-6 bg-[#16161c] border-t border-zinc-800 flex items-center justify-end gap-3 no-print">
          <button
            onClick={handleDownload}
            className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#d4af37]" />
            Download QR PNG
          </button>

          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#e5c07b] to-[#d4af37] text-black text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md shadow-[#d4af37]/20 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4 fill-black" />
            Print Table Stand Card
          </button>
        </div>
      </div>
    </div>
  );
}
