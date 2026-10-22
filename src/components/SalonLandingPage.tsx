"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import SpecialOffersSection from "@/components/SpecialOffersSection";
import GallerySection from "@/components/GallerySection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import FloatingMobileBar from "@/components/FloatingMobileBar";
import BookingModal from "@/components/BookingModal";
import PrintableQrStand from "@/components/PrintableQrStand";
import { SalonInfo, ServiceItem, SpecialOfferItem, GalleryItem } from "@/types/salon";

interface SalonLandingPageProps {
  initialInfo: SalonInfo;
  initialServices: ServiceItem[];
  initialOffers: SpecialOfferItem[];
  initialGallery: GalleryItem[];
}

export default function SalonLandingPage({
  initialInfo,
  initialServices,
  initialOffers,
  initialGallery
}: SalonLandingPageProps) {
  const [salonInfo, setSalonInfo] = useState<SalonInfo>(initialInfo);
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [offers, setOffers] = useState<SpecialOfferItem[]>(initialOffers);
  const [gallery, setGallery] = useState<GalleryItem[]>(initialGallery);

  // Sync state and browser tab title whenever salonInfo changes
  React.useEffect(() => {
    setSalonInfo(initialInfo);
    setServices(initialServices);
    setOffers(initialOffers);
    setGallery(initialGallery);
    if (initialInfo?.name) {
      document.title = `${initialInfo.name} | Luxury Hair, Skin & Bridal Salon`;
    }
  }, [initialInfo, initialServices, initialOffers, initialGallery]);

  React.useEffect(() => {
    if (salonInfo?.name) {
      document.title = `${salonInfo.name} | Luxury Hair, Skin & Bridal Salon`;
    }
  }, [salonInfo?.name]);

  // Also fetch live data on mount to guarantee fresh prices
  React.useEffect(() => {
    fetch("/api/salon", { cache: "no-store" })
      .then((res) => res.json())
      .then((result) => {
        if (result.success && result.data) {
          if (result.data.info) setSalonInfo(result.data.info);
          if (result.data.services) setServices(result.data.services);
          if (result.data.offers) setOffers(result.data.offers);
          if (result.data.gallery) setGallery(result.data.gallery);
        }
      })
      .catch((err) => console.error("Error refreshing salon data:", err));
  }, []);

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [preselectedBookingItem, setPreselectedBookingItem] = useState<{
    name: string;
    price?: number;
  } | null>(null);

  const handleOpenBooking = () => {
    setPreselectedBookingItem(null);
    setIsBookingOpen(true);
  };

  const handleBookService = (service: ServiceItem) => {
    setPreselectedBookingItem({
      name: `${service.name} (₹${service.price})`,
      price: service.price
    });
    setIsBookingOpen(true);
  };

  const handleBookOffer = (offer: SpecialOfferItem) => {
    setPreselectedBookingItem({
      name: `${offer.title} (Deal ₹${offer.discountedPrice})`,
      price: offer.discountedPrice
    });
    setIsBookingOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-[#0b0b0e] text-[#f3f3f5] selection:bg-[#d4af37] selection:text-black">
      {/* Sticky Navigation */}
      <Navbar salonInfo={salonInfo} onOpenBooking={handleOpenBooking} />

      {/* Main Single Scrolling Page Content */}
      <main>
        {/* Hero Section */}
        <HeroSection
          salonInfo={salonInfo}
          offers={offers}
          onOpenBooking={handleOpenBooking}
        />

        {/* About Section */}
        <AboutSection
          salonInfo={salonInfo}
          onOpenBooking={handleOpenBooking}
        />

        {/* Services & Price List */}
        <ServicesSection
          services={services}
          onBookService={handleBookService}
        />

        {/* Today's Special Offers & Deals */}
        <SpecialOffersSection
          offers={offers}
          onBookOffer={handleBookOffer}
        />

        {/* Photo Gallery with Lightbox */}
        <GallerySection gallery={gallery} />

        {/* Contact, Address & Google Map */}
        <ContactSection salonInfo={salonInfo} />
      </main>

      {/* Professional Footer */}
      <Footer
        salonInfo={salonInfo}
        onOpenBooking={handleOpenBooking}
        onOpenQrModal={() => setIsQrModalOpen(true)}
      />

      {/* Floating Action Dock for Mobile Devices */}
      <FloatingMobileBar
        salonInfo={salonInfo}
        onOpenBooking={handleOpenBooking}
      />

      {/* WhatsApp Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        salonInfo={salonInfo}
        services={services}
        offers={offers}
        preselectedItem={preselectedBookingItem}
      />

      {/* Printable QR Code Table Stand Modal */}
      <PrintableQrStand
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        salonInfo={salonInfo}
      />
    </div>
  );
}
