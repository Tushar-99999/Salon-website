# ✨ ABCD Salon — Luxury Unisex Salon Website & Admin Portal

A complete, production-ready, luxury single-page salon website built for real salon businesses in India. Features a full, beginner-friendly Admin Dashboard at `/admin` so salon owners can change prices, add/remove services, launch promotional deals, upload photos, and update business contact details **without touching code**.

---

## 🌟 Key Features

### 1. Public Website (`/`)
- **Luxury Theme**: High-end Obsidian Black (`#0B0B0C`), Champagne Gold (`#D4AF37`), Soft Cream, and White palette with elegant typography (*Playfair Display* & *Plus Jakarta Sans*).
- **Hero Section**: Headline (*"Your Beauty, Our Passion."*), booking buttons, live opening hours, Google reviews badge (4.9★), and genuine products certificate (L'Oréal & Dyson).
- **About Section**: Brand story, 8+ years experience, expert stylists, hygiene standards, and luxury environment.
- **Services & Price List**: Transparent pricing in Indian Rupees (₹), category filter tabs (*Hair Care & Styling*, *Skin & Facials*, *Men's Grooming*, *Bridal & Makeup*, *Spa & Massage*), live search bar, and "Book Now" buttons that pre-select services.
- **Special Offers & Deals**: Limited-time combo deals (Haircut + Beard ₹199, Hair Spa 20% Off, Bridal 15% Off, Weekend Beauty Combo ₹999) with automated expiration date filtering.
- **Photo Gallery**: Category filters (*Men's Haircuts*, *Women's Hairstyles*, *Bridal Makeup*, *Hair Coloring*, *Salon Interior*, *Before & After*) with an interactive Fullscreen Lightbox Zoom Modal.
- **Instant WhatsApp Booking**: Generates a pre-filled WhatsApp appointment message to the salon's phone number without requiring online payments.
- **Contact & Map**: Complete address, Google Maps directions link, interactive map embed, and phone dialer button.
- **Floating Mobile Dock**: Convenient sticky buttons for Call Now, WhatsApp, and Book Appointment.
- **Tabletop QR Stand**: Instant generator for counter acrylic display cards: *"Scan to Explore Our Services, Prices & Special Offers — ABCD Salon"*.

### 2. Admin Dashboard (`/admin`)
- **Secure Authentication**: Protected routes with HTTP-only cookies and PBKDF2 cryptographic hashing.
- **Overview Tab**: Live statistics (Total Services, Active Deals, Gallery Photos, WhatsApp Status) and Quick Actions.
- **Services & Prices**: Add, edit, change prices (₹), upload service images, hide/show temporarily unavailable services, and reorder.
- **Deals & Offers**: Create discount deals, original and discounted prices, discount badges, start/expiry validity dates, and toggle active.
- **Photo Gallery**: Upload new pictures, select category, edit captions, and delete images.
- **Business Settings**: Edit salon name, contact phone, WhatsApp number, email, address, city, state, pincode, hours, and social media links (Instagram, Facebook, YouTube).
- **Website Content**: Customize hero headline, intro text, background image, and announcement ticker.
- **Printable QR Stand**: Preview and 1-click print high-resolution customer table display stands.
- **Security**: Change admin username and password anytime.

---

## 🚀 Quick Start (Local Setup)

### Prerequisites
- Node.js (version 18 or higher installed)
- npm (comes bundled with Node.js)

### Steps to Run Locally

1. **Open Terminal in Project Directory**:
   ```bash
   cd "Salon website demo"
   ```

2. **Install Dependencies** (if not already installed):
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

4. **View Website**:
   Open [http://localhost:3000](http://localhost:3000) in your web browser.

5. **Open Admin Dashboard**:
   Open [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

---

## 🔐 Default Admin Credentials

- **Login URL**: `/admin/login`
- **Default Username**: `admin`
- **Default Password**: `admin123`

> 💡 **Tip for Salon Owners**: After your first login, navigate to the **Security & Password** tab in the admin dashboard to set your own custom password!

---

## 🗄️ Database & Storage Architecture

1. **Built-in Local JSON Database (`data/salon_db.json`)**:
   - Works immediately out of the box with zero external configuration.
   - Saves all edits with atomic file writes so data persists permanently across page reloads and restarts.
   - Includes fallback to `/tmp` in serverless environments.

2. **Optional Cloud Supabase Database**:
   - If deploying to Vercel or other cloud hosts with read-only file systems, you can seamlessly connect Supabase.
   - Run the provided `supabase_schema.sql` file in your Supabase SQL Editor.
   - Add these environment variables in your Vercel project settings:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
     SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
     ```

---

## ☁️ Deployment Instructions (Deploy to Vercel)

1. **Push Code to GitHub**:
   ```bash
   git add .
   git commit -m "Complete ABCD Salon website with admin dashboard"
   git branch -M main
   # Link to your remote GitHub repository
   git remote add origin https://github.com/your-username/abcd-salon.git
   git push -u origin main
   ```

2. **Deploy with 1-Click on Vercel**:
   - Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
   - Select your `abcd-salon` repository.
   - Leave the Framework Preset as **Next.js**.
   - Click **Deploy**.
   - Your live website will be accessible via a secure HTTPS domain (e.g. `https://abcd-salon.vercel.app`) in under 2 minutes!

---

## 🔍 Google Search & SEO Integration

This website includes:
- Semantic HTML5 headings and descriptions.
- **Schema.org** structured JSON-LD data for `HairSalon` and `BeautySalon` (specifying address, geo coordinates, opening hours, phone number, and price range `₹₹`).
- Dynamic XML Sitemap at `/sitemap.xml`.
- Search engine crawler directives at `/robots.txt`.
- Open Graph and Twitter Card tags for WhatsApp link previews.

### Submitting to Google:
1. Go to [Google Search Console](https://search.google.com/search-console).
2. Add your deployed domain (e.g. `https://your-salon.vercel.app`).
3. Verify ownership via DNS TXT record or HTML tag.
4. Under **Sitemaps**, enter `https://your-salon.vercel.app/sitemap.xml` and click **Submit**.
5. Claim and optimize your **Google Business Profile (Google Maps)**, and set your website link to your live URL.

---

## 📱 Tabletop QR Code Stand

1. Open `/admin` and click **"Print Table QR Stand"** (or click the button in the website footer).
2. The system dynamically generates an acrylic counter display card saying:
   > *"Scan to Explore Our Services, Prices & Special Offers — ABCD Salon"*
3. Click **"Print Display Stand"** to print directly onto A5/A6 photo paper or cardstock for your styling mirrors and reception desk.
4. Click **"Download QR PNG"** if you want to send the raw QR image to a signage printing shop.
