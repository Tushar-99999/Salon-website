export interface SalonInfo {
  name: string;
  tagline: string;
  shortIntro: string;
  description: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  whatsapp: string;
  email: string;
  openingHours: string;
  closedDay: string;
  googleMapsUrl: string;
  googleMapsEmbed: string;
  instagram: string;
  facebook: string;
  youtube: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroImage: string;
  announcementBanner: string;
  showAnnouncement: boolean;
  aboutTitle: string;
  aboutStory: string;
  aboutImage1: string;
  aboutImage2: string;
  yearsOfExcellence: string;
  happyClients: string;
  expertStylists: string;
  rating: string;
  websiteUrl: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  category: "Hair Care & Styling" | "Skin & Facials" | "Men's Grooming" | "Bridal & Makeup" | "Spa & Massage";
  price: number;
  originalPrice?: number;
  duration: string;
  description: string;
  image: string;
  isActive: boolean;
  isPopular?: boolean;
  order: number;
}

export interface SpecialOfferItem {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  discountBadge: string;
  image: string;
  startDate: string; // YYYY-MM-DD
  expiryDate: string; // YYYY-MM-DD
  isActive: boolean;
  terms?: string;
}

export type GalleryCategory =
  | "All"
  | "Men's Haircuts"
  | "Women's Hairstyles"
  | "Bridal Makeup"
  | "Hair Coloring"
  | "Salon Interior"
  | "Before and After";

export interface GalleryItem {
  id: string;
  title: string;
  category: "Men's Haircuts" | "Women's Hairstyles" | "Bridal Makeup" | "Hair Coloring" | "Salon Interior" | "Before and After";
  imageUrl: string;
  description?: string;
  createdAt?: string;
}

export interface SalonDatabase {
  info: SalonInfo;
  services: ServiceItem[];
  offers: SpecialOfferItem[];
  gallery: GalleryItem[];
  admin: {
    username: string;
    passwordHash: string;
    salt: string;
  };
}
