import React from "react";
import { getSalonInfo, getServices, getOffers, getGallery } from "@/lib/db";
import SalonLandingPage from "@/components/SalonLandingPage";
export const dynamic = "force-dynamic";
export const revalidate = 0;
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const info = getSalonInfo();
  return {
    title: `${info.name} | Luxury Hair, Skin & Bridal Salon`,
    description: info.description || info.shortIntro,
    openGraph: {
      title: `${info.name} | ${info.tagline || "Your Beauty, Our Passion"}`,
      description: info.shortIntro || info.description,
    }
  };
}

export default async function HomePage() {
  const info = getSalonInfo();
  const services = getServices(true);
  const offers = getOffers(true);
  const gallery = getGallery();

  // Structured Data Schema for Local Business (Google Search Rich Results)
  const schemaData = {
    "@context": "https://schema.org",
    "@type": ["HairSalon", "BeautySalon"],
    name: info.name,
    image: info.heroImage,
    url: info.websiteUrl || "https://abcdsalon.vercel.app",
    telephone: info.phone,
    priceRange: "₹₹",
    description: info.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: info.address,
      addressLocality: info.city,
      addressRegion: info.state,
      postalCode: info.pincode,
      addressCountry: "IN"
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 19.0628,
      longitude: 72.8315
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "09:30",
        closes: "21:00"
      }
    ],
    sameAs: [info.instagram, info.facebook, info.youtube].filter(Boolean)
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <SalonLandingPage
        initialInfo={info}
        initialServices={services}
        initialOffers={offers}
        initialGallery={gallery}
      />
    </>
  );
}
