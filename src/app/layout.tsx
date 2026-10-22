import type { Metadata, Viewport } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap"
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans-body",
  display: "swap"
});

export const viewport: Viewport = {
  themeColor: "#0b0b0e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5
};

export const metadata: Metadata = {
  metadataBase: new URL("https://abcdsalon.vercel.app"),
  title: "ABCD Salon | Luxury Hair, Skin & Bridal Salon in Mumbai",
  description:
    "Experience luxury hair styling, rejuvenating skin facials, beard grooming, and bespoke bridal beauty at ABCD Salon, Bandra West, Mumbai. Book instantly via WhatsApp.",
  keywords: [
    "salon in mumbai",
    "hair salon bandra",
    "bridal makeup mumbai",
    "luxury salon india",
    "haircut for men",
    "hair styling women",
    "hair spa bandra",
    "best salon bandra linking road",
    "ABCD Salon"
  ],
  authors: [{ name: "ABCD Salon" }],
  openGraph: {
    title: "ABCD Salon | Your Beauty, Our Passion",
    description:
      "Premier unisex luxury salon for master haircuts, hair spa, skin therapies, and royal bridal makeup. Book appointments instantly on WhatsApp.",
    url: "https://abcdsalon.vercel.app",
    siteName: "ABCD Salon",
    images: [
      {
        url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&h=630&q=80",
        width: 1200,
        height: 630,
        alt: "ABCD Salon - Luxury Hair, Skin & Bridal"
      }
    ],
    locale: "en_IN",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "ABCD Salon | Luxury Hair, Skin & Bridal",
    description: "Book appointments instantly via WhatsApp. Experience royal beauty care.",
    images: ["https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&h=630&q=80"]
  },
  alternates: {
    canonical: "/"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${plusJakarta.variable} scroll-smooth`}
    >
      <body className="min-h-screen bg-[#0b0b0e] text-[#f3f3f5] antialiased flex flex-col font-sans-body">
        {children}
      </body>
    </html>
  );
}
