"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Scissors,
  Settings,
  ListOrdered,
  Tag,
  Image as ImageIcon,
  FileText,
  Shield,
  QrCode,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  Upload,
  ExternalLink,
  Save,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowUp,
  ArrowDown,
  Printer,
  Sparkles,
  Phone,
  MessageCircle,
  MapPin,
  RefreshCw,
  Search
} from "lucide-react";
import QRCode from "qrcode";
import {
  SalonInfo,
  ServiceItem,
  SpecialOfferItem,
  GalleryItem,
  GalleryCategory
} from "@/types/salon";

type AdminTab =
  | "overview"
  | "settings"
  | "services"
  | "offers"
  | "gallery"
  | "content"
  | "qr"
  | "security";

export default function AdminDashboardPage() {
  const router = useRouter();

  // State
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Data
  const [info, setInfo] = useState<SalonInfo | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [offers, setOffers] = useState<SpecialOfferItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);

  // Modals
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<SpecialOfferItem | null>(null);

  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [newGalleryTitle, setNewGalleryTitle] = useState("");
  const [newGalleryCategory, setNewGalleryCategory] = useState<GalleryCategory>("Men's Haircuts");
  const [newGalleryImage, setNewGalleryImage] = useState("");
  const [newGalleryDescription, setNewGalleryDescription] = useState("");

  // Security Credentials state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // QR Code State
  const [adminQrUrl, setAdminQrUrl] = useState("");

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Check auth and fetch data on mount
  useEffect(() => {
    async function loadData() {
      try {
        const authRes = await fetch("/api/auth/me");
        if (!authRes.ok) {
          router.push("/admin/login");
          return;
        }

        const [infoRes, servicesRes, offersRes, galleryRes] = await Promise.all([
          fetch("/api/admin/info"),
          fetch("/api/admin/services"),
          fetch("/api/admin/offers"),
          fetch("/api/admin/gallery")
        ]);

        if (infoRes.ok) {
          const d = await infoRes.json();
          setInfo(d.data);
          // generate QR
          if (typeof window !== "undefined") {
            const url = d.data.websiteUrl || window.location.origin;
            QRCode.toDataURL(url, { width: 350, margin: 2 }).then(setAdminQrUrl);
          }
        }
        if (servicesRes.ok) {
          const d = await servicesRes.json();
          setServices(d.data);
        }
        if (offersRes.ok) {
          const d = await offersRes.json();
          setOffers(d.data);
        }
        if (galleryRes.ok) {
          const d = await galleryRes.json();
          setGallery(d.data);
        }
      } catch (err) {
        console.error("Dashboard load error:", err);
        showToast("error", "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
    } catch {
      router.push("/admin/login");
    }
  };

  // Upload helper for file inputs
  const handleFileUpload = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return data.url;
      } else {
        showToast("error", data.message || "Upload failed");
        return null;
      }
    } catch {
      showToast("error", "Error uploading image");
      return null;
    }
  };

  // 1. Save Business Settings / Website Content
  const handleSaveInfo = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!info) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/info", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(info)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setInfo(data.data);
        showToast("success", "Salon information saved successfully!");
      } else {
        showToast("error", data.message || "Failed to save information");
      }
    } catch {
      showToast("error", "Network error saving information");
    } finally {
      setSaving(false);
    }
  };

  // 2. Services Management
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    setSaving(true);

    try {
      const isNew = !editingService.id;
      const url = "/api/admin/services";
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingService)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (isNew) {
          setServices([...services, data.data]);
          showToast("success", "Service added successfully!");
        } else {
          setServices(services.map((s) => (s.id === data.data.id ? data.data : s)));
          showToast("success", "Service updated successfully!");
        }
        setServiceModalOpen(false);
        setEditingService(null);
      } else {
        showToast("error", data.message || "Failed to save service");
      }
    } catch {
      showToast("error", "Error saving service");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleServiceActive = async (service: ServiceItem) => {
    try {
      const updated = { ...service, isActive: !service.isActive };
      const res = await fetch("/api/admin/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        setServices(services.map((s) => (s.id === service.id ? updated : s)));
        showToast("success", `${service.name} is now ${updated.isActive ? "Visible" : "Hidden"}`);
      }
    } catch {
      showToast("error", "Failed to toggle service status");
    }
  };

  const handleDeleteService = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the service "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/services?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setServices(services.filter((s) => s.id !== id));
        showToast("success", "Service deleted successfully!");
      }
    } catch {
      showToast("error", "Failed to delete service");
    }
  };

  const handleMoveService = async (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= services.length) return;

    const newServices = [...services];
    const [moved] = newServices.splice(index, 1);
    newServices.splice(targetIdx, 0, moved);

    setServices(newServices);

    try {
      await fetch("/api/admin/services", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds: newServices.map((s) => s.id) })
      });
    } catch {
      console.error("Failed to persist order");
    }
  };

  // 3. Offers Management
  const handleSaveOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOffer) return;
    setSaving(true);

    try {
      const isNew = !editingOffer.id;
      const url = "/api/admin/offers";
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingOffer)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (isNew) {
          setOffers([...offers, data.data]);
          showToast("success", "Deal created successfully!");
        } else {
          setOffers(offers.map((o) => (o.id === data.data.id ? data.data : o)));
          showToast("success", "Deal updated successfully!");
        }
        setOfferModalOpen(false);
        setEditingOffer(null);
      } else {
        showToast("error", data.message || "Failed to save offer");
      }
    } catch {
      showToast("error", "Error saving offer");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleOfferActive = async (offer: SpecialOfferItem) => {
    try {
      const updated = { ...offer, isActive: !offer.isActive };
      const res = await fetch("/api/admin/offers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        setOffers(offers.map((o) => (o.id === offer.id ? updated : o)));
        showToast("success", `${offer.title} is now ${updated.isActive ? "Active" : "Disabled"}`);
      }
    } catch {
      showToast("error", "Failed to update deal status");
    }
  };

  const handleDeleteOffer = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete the offer "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/offers?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setOffers(offers.filter((o) => o.id !== id));
        showToast("success", "Offer deleted successfully!");
      }
    } catch {
      showToast("error", "Failed to delete offer");
    }
  };

  // 4. Gallery Management
  const handleAddGalleryPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryTitle || !newGalleryImage) {
      showToast("error", "Please provide a title and image");
      return;
    }
    setSaving(true);

    try {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newGalleryTitle,
          category: newGalleryCategory,
          imageUrl: newGalleryImage,
          description: newGalleryDescription
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setGallery([data.data, ...gallery]);
        showToast("success", "Photo added to gallery successfully!");
        setGalleryModalOpen(false);
        setNewGalleryTitle("");
        setNewGalleryImage("");
        setNewGalleryDescription("");
      } else {
        showToast("error", data.message || "Failed to add photo");
      }
    } catch {
      showToast("error", "Error adding photo");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteGallery = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete photo "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/gallery?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setGallery(gallery.filter((g) => g.id !== id));
        showToast("success", "Photo removed from gallery!");
      }
    } catch {
      showToast("error", "Failed to delete photo");
    }
  };

  // 5. Security / Change Credentials
  const handleChangeCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      showToast("error", "Current password is required");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/auth/change-credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newUsername: newUsername.trim() || undefined,
          newPassword: newPassword || undefined
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast("success", "Admin credentials updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setNewUsername("");
      } else {
        showToast("error", data.message || "Failed to update credentials");
      }
    } catch {
      showToast("error", "Network error updating credentials");
    } finally {
      setSaving(false);
    }
  };

  // 6. Reset Database to Default Sample Data
  const handleResetData = async () => {
    if (
      !confirm(
        "Warning: This will reset all services, offers, and salon info back to initial default values. Continue?"
      )
    ) {
      return;
    }

    try {
      const res = await fetch("/api/admin/reset", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.success) {
        setInfo(data.data.info);
        setServices(data.data.services);
        setOffers(data.data.offers);
        setGallery(data.data.gallery);
        showToast("success", "Database restored to sample data!");
      }
    } catch {
      showToast("error", "Failed to reset database");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0b0e] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-[#d4af37]/20 border border-[#d4af37] flex items-center justify-center mx-auto mb-3 animate-spin">
            <Scissors className="w-6 h-6 text-[#d4af37]" />
          </div>
          <p className="text-sm text-zinc-400 font-medium">Loading ABCD Salon Admin...</p>
        </div>
      </div>
    );
  }

  const activeServicesCount = services.filter((s) => s.isActive).length;
  const activeOffersCount = offers.filter((o) => o.isActive).length;

  return (
    <div className="min-h-screen bg-[#09090c] text-zinc-100 flex flex-col md:flex-row">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl border shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-slideDown ${
            toast.type === "success"
              ? "bg-emerald-950/90 border-emerald-500/50 text-emerald-200"
              : "bg-red-950/90 border-red-500/50 text-red-200"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Admin Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#111116] border-r border-zinc-800 shrink-0 flex flex-col justify-between">
        <div>
          {/* Logo / Brand Header */}
          <div className="p-5 border-b border-zinc-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#aa7c11] p-[1.5px]">
                <div className="w-full h-full bg-[#101014] rounded-[9px] flex items-center justify-center">
                  <Scissors className="w-4 h-4 text-[#d4af37]" />
                </div>
              </div>
              <div>
                <h2 className="font-serif-luxury font-bold text-white text-base leading-tight">
                  {info?.name || "ABCD Salon"}
                </h2>
                <span className="text-[10px] uppercase tracking-widest text-[#d4af37] font-semibold">
                  Admin Panel
                </span>
              </div>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="p-3 space-y-1">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "overview"
                  ? "bg-[#d4af37] text-black font-bold shadow-md shadow-[#d4af37]/20"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
              }`}
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab("services")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "services"
                  ? "bg-[#d4af37] text-black font-bold shadow-md shadow-[#d4af37]/20"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <ListOrdered className="w-4 h-4 shrink-0" />
                <span>Services & Prices</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                {services.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("offers")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "offers"
                  ? "bg-[#d4af37] text-black font-bold shadow-md shadow-[#d4af37]/20"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <Tag className="w-4 h-4 shrink-0" />
                <span>Deals & Offers</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                {offers.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("gallery")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "gallery"
                  ? "bg-[#d4af37] text-black font-bold shadow-md shadow-[#d4af37]/20"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <ImageIcon className="w-4 h-4 shrink-0" />
                <span>Photo Gallery</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                {gallery.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "settings"
                  ? "bg-[#d4af37] text-black font-bold shadow-md shadow-[#d4af37]/20"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
              }`}
            >
              <Settings className="w-4 h-4 shrink-0" />
              <span>Business Settings</span>
            </button>

            <button
              onClick={() => setActiveTab("content")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "content"
                  ? "bg-[#d4af37] text-black font-bold shadow-md shadow-[#d4af37]/20"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
              }`}
            >
              <FileText className="w-4 h-4 shrink-0" />
              <span>Website Content</span>
            </button>

            <button
              onClick={() => setActiveTab("qr")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "qr"
                  ? "bg-[#d4af37] text-black font-bold shadow-md shadow-[#d4af37]/20"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
              }`}
            >
              <QrCode className="w-4 h-4 shrink-0" />
              <span>Print Table QR Stand</span>
            </button>

            <button
              onClick={() => setActiveTab("security")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "security"
                  ? "bg-[#d4af37] text-black font-bold shadow-md shadow-[#d4af37]/20"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
              }`}
            >
              <Shield className="w-4 h-4 shrink-0" />
              <span>Security & Password</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-zinc-800/80 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="w-full py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold flex items-center justify-center gap-2 border border-zinc-800"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>View Public Website</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full py-2 px-3 rounded-xl bg-red-950/30 hover:bg-red-900/40 text-red-300 text-xs font-semibold flex items-center justify-center gap-2 border border-red-900/30 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Body */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-h-screen">
        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-serif-luxury font-bold text-white">
                Welcome back, Salon Owner!
              </h1>
              <p className="text-xs text-zinc-400 mt-0.5">
                Manage your services, change prices, launch special discount deals, and update salon details without code.
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-[#141419] border border-zinc-800 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-[#d4af37]/10 text-[#d4af37]">
                  <ListOrdered className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-serif-luxury font-bold text-white">{services.length}</div>
                  <div className="text-xs text-zinc-400 font-medium">{activeServicesCount} Active Services</div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#141419] border border-zinc-800 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
                  <Tag className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-serif-luxury font-bold text-white">{offers.length}</div>
                  <div className="text-xs text-zinc-400 font-medium">{activeOffersCount} Active Deals</div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#141419] border border-zinc-800 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-pink-500/10 text-pink-400">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-serif-luxury font-bold text-white">{gallery.length}</div>
                  <div className="text-xs text-zinc-400 font-medium">Gallery Photographs</div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#141419] border border-zinc-800 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white uppercase tracking-wider">WhatsApp Ready</div>
                  <div className="text-xs text-emerald-400 font-medium mt-0.5">{info?.whatsapp}</div>
                </div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="p-6 rounded-2xl bg-[#141419] border border-zinc-800">
              <h3 className="font-serif-luxury text-lg font-bold text-white mb-3">
                Quick Actions
              </h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    setEditingService({
                      id: "",
                      name: "",
                      category: "Hair Care & Styling",
                      price: 250,
                      duration: "30 mins",
                      description: "",
                      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80",
                      isActive: true,
                      order: services.length + 1
                    });
                    setServiceModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#d4af37] text-black text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-[#e5c07b] cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Service</span>
                </button>

                <button
                  onClick={() => {
                    setEditingOffer({
                      id: "",
                      title: "",
                      description: "",
                      originalPrice: 500,
                      discountedPrice: 399,
                      discountBadge: "20% OFF",
                      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80",
                      startDate: new Date().toISOString().split("T")[0],
                      expiryDate: "2027-12-31",
                      isActive: true
                    });
                    setOfferModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#d4af37]" />
                  <span>Create Special Deal</span>
                </button>

                <button
                  onClick={() => setGalleryModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-[#d4af37]" />
                  <span>Upload Gallery Photo</span>
                </button>
              </div>
            </div>

            {/* Live Website Preview Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-[#1c1a14] via-[#16161c] to-[#1c1a14] border border-[#d4af37]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-serif-luxury text-base font-bold text-white">
                  Live Public Website
                </h4>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Any changes you save in this dashboard appear immediately on your live website.
                </p>
              </div>
              <Link
                href="/"
                target="_blank"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#e5c07b] to-[#d4af37] text-black text-xs font-bold uppercase tracking-wider flex items-center gap-2 shrink-0 shadow-md shadow-[#d4af37]/20"
              >
                <span>Preview Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* TAB 2: SERVICES & PRICE LIST */}
        {activeTab === "services" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-serif-luxury font-bold text-white">
                  Manage Services & Price List
                </h1>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Change prices (₹), add new treatments, hide temporary unavailable services, and reorder.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingService({
                    id: "",
                    name: "",
                    category: "Hair Care & Styling",
                    price: 250,
                    duration: "30 mins",
                    description: "",
                    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80",
                    isActive: true,
                    order: services.length + 1
                  });
                  setServiceModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-[#d4af37] text-black text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-[#e5c07b] shadow-md shadow-[#d4af37]/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Service</span>
              </button>
            </div>

            {/* Services Table / Cards */}
            <div className="bg-[#141419] border border-zinc-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#1a1a22] text-zinc-400 uppercase tracking-wider font-semibold border-b border-zinc-800">
                    <tr>
                      <th className="py-3 px-4">Order</th>
                      <th className="py-3 px-4">Service</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Price (₹)</th>
                      <th className="py-3 px-4">Duration</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/80">
                    {services.map((service, idx) => (
                      <tr key={service.id} className="hover:bg-zinc-800/30 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleMoveService(idx, "up")}
                              disabled={idx === 0}
                              className="p-1 text-zinc-500 hover:text-white disabled:opacity-20 cursor-pointer"
                              title="Move Up"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleMoveService(idx, "down")}
                              disabled={idx === services.length - 1}
                              className="p-1 text-zinc-500 hover:text-white disabled:opacity-20 cursor-pointer"
                              title="Move Down"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={service.image}
                              alt={service.name}
                              className="w-10 h-10 rounded-lg object-cover bg-zinc-800 shrink-0"
                            />
                            <div>
                              <div className="font-semibold text-white text-sm">{service.name}</div>
                              <div className="text-zinc-500 line-clamp-1 max-w-xs">{service.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-zinc-300">
                          <span className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] uppercase font-medium">
                            {service.category}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-serif-luxury font-bold text-base text-[#d4af37]">
                            ₹{service.price}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-zinc-400">{service.duration}</td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleToggleServiceActive(service)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-pointer ${
                              service.isActive
                                ? "bg-emerald-950/60 text-emerald-300 border border-emerald-800/50"
                                : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                            }`}
                          >
                            {service.isActive ? "Visible" : "Hidden"}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingService(service);
                                setServiceModalOpen(true);
                              }}
                              className="p-1.5 text-zinc-400 hover:text-white rounded-lg bg-zinc-800/60 hover:bg-zinc-700 cursor-pointer"
                              title="Edit Service"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteService(service.id, service.name)}
                              className="p-1.5 text-red-400 hover:text-red-300 rounded-lg bg-red-950/30 hover:bg-red-900/50 cursor-pointer"
                              title="Delete Service"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DEALS & OFFERS */}
        {activeTab === "offers" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-serif-luxury font-bold text-white">
                  Manage Special Offers & Combos
                </h1>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Launch discount packages, set expiry dates, and upload promotional banners.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingOffer({
                    id: "",
                    title: "",
                    description: "",
                    originalPrice: 500,
                    discountedPrice: 399,
                    discountBadge: "20% OFF",
                    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80",
                    startDate: new Date().toISOString().split("T")[0],
                    expiryDate: "2027-12-31",
                    isActive: true
                  });
                  setOfferModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-[#d4af37] text-black text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-[#e5c07b] shadow-md shadow-[#d4af37]/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Deal</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offers.map((offer) => {
                const today = new Date().toISOString().split("T")[0];
                const isExpired = offer.expiryDate && offer.expiryDate < today;

                return (
                  <div
                    key={offer.id}
                    className="p-5 rounded-2xl bg-[#141419] border border-zinc-800 flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-40 rounded-xl overflow-hidden mb-3 bg-zinc-900">
                        <img
                          src={offer.image}
                          alt={offer.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-md bg-red-600 text-white font-bold text-[10px] uppercase">
                          {offer.discountBadge}
                        </span>
                      </div>

                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-serif-luxury font-bold text-white text-base">
                          {offer.title}
                        </h3>
                        <div className="text-right">
                          <div className="font-serif-luxury font-bold text-[#d4af37] text-lg">
                            ₹{offer.discountedPrice}
                          </div>
                          <div className="text-xs text-zinc-500 line-through">
                            ₹{offer.originalPrice}
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-zinc-400 mt-2 line-clamp-2">{offer.description}</p>

                      <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-500">
                        <span>Expires: {offer.expiryDate || "Ongoing"}</span>
                        {isExpired ? (
                          <span className="text-red-400 font-semibold">Expired</span>
                        ) : (
                          <span className="text-emerald-400 font-semibold">Active</span>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                      <button
                        onClick={() => handleToggleOfferActive(offer)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                          offer.isActive
                            ? "bg-emerald-950/60 text-emerald-300 border border-emerald-800/50"
                            : "bg-zinc-800 text-zinc-400"
                        }`}
                      >
                        {offer.isActive ? "Active" : "Disabled"}
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingOffer(offer);
                            setOfferModalOpen(true);
                          }}
                          className="p-1.5 text-zinc-400 hover:text-white rounded-lg bg-zinc-800 cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteOffer(offer.id, offer.title)}
                          className="p-1.5 text-red-400 hover:text-red-300 rounded-lg bg-red-950/30 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: PHOTO GALLERY */}
        {activeTab === "gallery" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-serif-luxury font-bold text-white">
                  Manage Photo Gallery
                </h1>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Upload high quality photographs of your salon work, interior, haircuts, and bridal makeovers.
                </p>
              </div>
              <button
                onClick={() => setGalleryModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-[#d4af37] text-black text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-[#e5c07b] shadow-md shadow-[#d4af37]/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Upload Photo</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {gallery.map((item) => (
                <div
                  key={item.id}
                  className="group relative rounded-2xl overflow-hidden bg-[#141419] border border-zinc-800 aspect-[4/3] flex flex-col justify-end p-4"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                  <div className="relative z-10">
                    <span className="px-2 py-0.5 rounded bg-[#d4af37]/20 text-[#f3e5ab] text-[10px] uppercase font-semibold">
                      {item.category}
                    </span>
                    <h4 className="font-serif-luxury font-bold text-white text-sm mt-1">
                      {item.title}
                    </h4>

                    <button
                      onClick={() => handleDeleteGallery(item.id, item.title)}
                      className="mt-2 text-xs text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: BUSINESS SETTINGS */}
        {activeTab === "settings" && info && (
          <form onSubmit={handleSaveInfo} className="space-y-6 max-w-4xl">
            <div>
              <h1 className="text-2xl font-serif-luxury font-bold text-white">
                Salon Business Settings
              </h1>
              <p className="text-xs text-zinc-400 mt-0.5">
                Update salon name, phone numbers, WhatsApp booking number, working hours, and address.
              </p>
            </div>

            <div className="bg-[#141419] border border-zinc-800 rounded-2xl p-6 space-y-4">
              <h3 className="font-serif-luxury text-base font-bold text-[#d4af37] border-b border-zinc-800 pb-2">
                1. Core Contact Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                    Salon Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={info.name}
                    onChange={(e) => setInfo({ ...info, name: e.target.value })}
                    className="w-full bg-[#0b0b0e] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                    Salon Tagline
                  </label>
                  <input
                    type="text"
                    value={info.tagline}
                    onChange={(e) => setInfo({ ...info, tagline: e.target.value })}
                    className="w-full bg-[#0b0b0e] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                    Phone Calling Number (for Call Now button) *
                  </label>
                  <input
                    type="text"
                    required
                    value={info.phone}
                    onChange={(e) => setInfo({ ...info, phone: e.target.value })}
                    className="w-full bg-[#0b0b0e] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                    WhatsApp Booking Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={info.whatsapp}
                    onChange={(e) => setInfo({ ...info, whatsapp: e.target.value })}
                    className="w-full bg-[#0b0b0e] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                    Business Email
                  </label>
                  <input
                    type="email"
                    value={info.email}
                    onChange={(e) => setInfo({ ...info, email: e.target.value })}
                    className="w-full bg-[#0b0b0e] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                    Live Website URL (Used in QR Code Stand)
                  </label>
                  <input
                    type="url"
                    value={info.websiteUrl}
                    onChange={(e) => setInfo({ ...info, websiteUrl: e.target.value })}
                    placeholder="https://your-salon.vercel.app"
                    className="w-full bg-[#0b0b0e] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>
            </div>

            {/* Address & Timings */}
            <div className="bg-[#141419] border border-zinc-800 rounded-2xl p-6 space-y-4">
              <h3 className="font-serif-luxury text-base font-bold text-[#d4af37] border-b border-zinc-800 pb-2">
                2. Location & Operating Hours
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={info.address}
                    onChange={(e) => setInfo({ ...info, address: e.target.value })}
                    className="w-full bg-[#0b0b0e] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={info.city}
                    onChange={(e) => setInfo({ ...info, city: e.target.value })}
                    className="w-full bg-[#0b0b0e] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                    State & Pincode
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={info.state}
                      onChange={(e) => setInfo({ ...info, state: e.target.value })}
                      placeholder="State"
                      className="w-full bg-[#0b0b0e] border border-zinc-700 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-[#d4af37]"
                    />
                    <input
                      type="text"
                      value={info.pincode}
                      onChange={(e) => setInfo({ ...info, pincode: e.target.value })}
                      placeholder="Pincode"
                      className="w-full bg-[#0b0b0e] border border-zinc-700 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                    Opening Hours
                  </label>
                  <input
                    type="text"
                    value={info.openingHours}
                    onChange={(e) => setInfo({ ...info, openingHours: e.target.value })}
                    className="w-full bg-[#0b0b0e] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                    Weekly Closed Day
                  </label>
                  <input
                    type="text"
                    value={info.closedDay}
                    onChange={(e) => setInfo({ ...info, closedDay: e.target.value })}
                    className="w-full bg-[#0b0b0e] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                    Google Maps Directions Link
                  </label>
                  <input
                    type="url"
                    value={info.googleMapsUrl}
                    onChange={(e) => setInfo({ ...info, googleMapsUrl: e.target.value })}
                    className="w-full bg-[#0b0b0e] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="bg-[#141419] border border-zinc-800 rounded-2xl p-6 space-y-4">
              <h3 className="font-serif-luxury text-base font-bold text-[#d4af37] border-b border-zinc-800 pb-2">
                3. Social Media Links
              </h3>
              <p className="text-xs text-zinc-400">Leave blank any social platform you do not use.</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    value={info.instagram}
                    onChange={(e) => setInfo({ ...info, instagram: e.target.value })}
                    placeholder="https://instagram.com/..."
                    className="w-full bg-[#0b0b0e] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                    Facebook URL
                  </label>
                  <input
                    type="url"
                    value={info.facebook}
                    onChange={(e) => setInfo({ ...info, facebook: e.target.value })}
                    placeholder="https://facebook.com/..."
                    className="w-full bg-[#0b0b0e] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                    YouTube URL
                  </label>
                  <input
                    type="url"
                    value={info.youtube}
                    onChange={(e) => setInfo({ ...info, youtube: e.target.value })}
                    placeholder="https://youtube.com/..."
                    className="w-full bg-[#0b0b0e] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#e5c07b] to-[#d4af37] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all shadow-md shadow-[#d4af37]/20 disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-4 h-4 fill-black" />
              <span>{saving ? "Saving Changes..." : "Save Business Settings"}</span>
            </button>
          </form>
        )}

        {/* TAB 6: WEBSITE CONTENT */}
        {activeTab === "content" && info && (
          <form onSubmit={handleSaveInfo} className="space-y-6 max-w-4xl">
            <div>
              <h1 className="text-2xl font-serif-luxury font-bold text-white">
                Website Content & Messages
              </h1>
              <p className="text-xs text-zinc-400 mt-0.5">
                Update hero headlines, about story, promotional ticker message, and hero image.
              </p>
            </div>

            {/* Announcement Banner */}
            <div className="bg-[#141419] border border-zinc-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif-luxury text-base font-bold text-[#d4af37]">
                  Top Announcement Ticker
                </h3>
                <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={info.showAnnouncement}
                    onChange={(e) => setInfo({ ...info, showAnnouncement: e.target.checked })}
                    className="w-4 h-4 rounded text-[#d4af37] bg-zinc-900 border-zinc-700"
                  />
                  <span>Show Banner on Website</span>
                </label>
              </div>

              <input
                type="text"
                value={info.announcementBanner}
                onChange={(e) => setInfo({ ...info, announcementBanner: e.target.value })}
                placeholder="e.g. ✨ Festive Special: Flat 20% OFF on all Hair Spa sessions this week!"
                className="w-full bg-[#0b0b0e] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-[#d4af37]"
              />
            </div>

            {/* Hero Section Content */}
            <div className="bg-[#141419] border border-zinc-800 rounded-2xl p-6 space-y-4">
              <h3 className="font-serif-luxury text-base font-bold text-[#d4af37] border-b border-zinc-800 pb-2">
                Hero Banner Content
              </h3>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                  Main Headline *
                </label>
                <input
                  type="text"
                  required
                  value={info.heroHeadline}
                  onChange={(e) => setInfo({ ...info, heroHeadline: e.target.value })}
                  className="w-full bg-[#0b0b0e] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                  Subheadline / Introduction
                </label>
                <textarea
                  rows={3}
                  value={info.heroSubheadline}
                  onChange={(e) => setInfo({ ...info, heroSubheadline: e.target.value })}
                  className="w-full bg-[#0b0b0e] border border-zinc-700 rounded-xl px-3.5 py-2 text-white text-sm outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                  Hero Background Image (URL or Upload File)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={info.heroImage}
                    onChange={(e) => setInfo({ ...info, heroImage: e.target.value })}
                    className="flex-1 bg-[#0b0b0e] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-[#d4af37]"
                  />
                  <label className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shrink-0">
                    <Upload className="w-4 h-4 text-[#d4af37]" />
                    <span>Upload File</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await handleFileUpload(file);
                          if (url) setInfo({ ...info, heroImage: url });
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* About Story */}
            <div className="bg-[#141419] border border-zinc-800 rounded-2xl p-6 space-y-4">
              <h3 className="font-serif-luxury text-base font-bold text-[#d4af37] border-b border-zinc-800 pb-2">
                About Salon Section
              </h3>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                  About Heading
                </label>
                <input
                  type="text"
                  value={info.aboutTitle}
                  onChange={(e) => setInfo({ ...info, aboutTitle: e.target.value })}
                  className="w-full bg-[#0b0b0e] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                  About Story / Description
                </label>
                <textarea
                  rows={4}
                  value={info.description}
                  onChange={(e) => setInfo({ ...info, description: e.target.value })}
                  className="w-full bg-[#0b0b0e] border border-zinc-700 rounded-xl px-3.5 py-2 text-white text-sm outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 uppercase mb-1">
                    Years Excellence
                  </label>
                  <input
                    type="text"
                    value={info.yearsOfExcellence}
                    onChange={(e) => setInfo({ ...info, yearsOfExcellence: e.target.value })}
                    className="w-full bg-[#0b0b0e] border border-zinc-700 rounded-xl px-3 py-2 text-white text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 uppercase mb-1">
                    Happy Clients
                  </label>
                  <input
                    type="text"
                    value={info.happyClients}
                    onChange={(e) => setInfo({ ...info, happyClients: e.target.value })}
                    className="w-full bg-[#0b0b0e] border border-zinc-700 rounded-xl px-3 py-2 text-white text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 uppercase mb-1">
                    Expert Stylists
                  </label>
                  <input
                    type="text"
                    value={info.expertStylists}
                    onChange={(e) => setInfo({ ...info, expertStylists: e.target.value })}
                    className="w-full bg-[#0b0b0e] border border-zinc-700 rounded-xl px-3 py-2 text-white text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 uppercase mb-1">
                    Google Rating
                  </label>
                  <input
                    type="text"
                    value={info.rating}
                    onChange={(e) => setInfo({ ...info, rating: e.target.value })}
                    className="w-full bg-[#0b0b0e] border border-zinc-700 rounded-xl px-3 py-2 text-white text-xs outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#e5c07b] to-[#d4af37] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all shadow-md shadow-[#d4af37]/20 disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-4 h-4 fill-black" />
              <span>{saving ? "Saving Changes..." : "Save Website Content"}</span>
            </button>
          </form>
        )}

        {/* TAB 7: PRINTABLE QR STAND */}
        {activeTab === "qr" && info && (
          <div className="space-y-6 max-w-xl">
            <div>
              <h1 className="text-2xl font-serif-luxury font-bold text-white">
                Salon Tabletop QR Code Display
              </h1>
              <p className="text-xs text-zinc-400 mt-0.5">
                Print this card and place it on your styling mirrors and reception counter so customers can scan it.
              </p>
            </div>

            <div className="bg-[#141419] border border-zinc-800 rounded-2xl p-6 flex flex-col items-center">
              <div className="w-full max-w-sm bg-gradient-to-b from-[#18181f] via-[#101014] to-[#18181f] border-2 border-[#d4af37] rounded-3xl p-6 text-center shadow-2xl text-white">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#aa7c11] p-[1.5px] mx-auto mb-3">
                  <div className="w-full h-full bg-[#101014] rounded-[10px] flex items-center justify-center">
                    <Scissors className="w-6 h-6 text-[#d4af37]" />
                  </div>
                </div>

                <div className="text-[10px] uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
                  Welcome To
                </div>
                <h2 className="font-serif-luxury text-2xl font-bold tracking-wide text-white mb-3">
                  {info.name}
                </h2>

                <div className="p-3 bg-white rounded-xl shadow-xl border-2 border-[#d4af37]/40 mb-4 inline-block">
                  {adminQrUrl ? (
                    <img src={adminQrUrl} alt="QR Code" className="w-44 h-44 object-contain" />
                  ) : (
                    <div className="w-44 h-44 flex items-center justify-center text-zinc-900 text-xs">
                      Loading QR...
                    </div>
                  )}
                </div>

                <div className="bg-[#d4af37]/15 border border-[#d4af37]/40 rounded-xl py-2 px-3">
                  <p className="text-xs font-serif-luxury font-bold text-[#f3e5ab]">
                    Scan to Explore Our Services, Prices & Special Offers
                  </p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    Book instantly via WhatsApp
                  </p>
                </div>

                <div className="mt-3 text-[10px] text-zinc-500">{info.address}</div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#e5c07b] to-[#d4af37] text-black text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md shadow-[#d4af37]/20"
                >
                  <Printer className="w-4 h-4 fill-black" />
                  <span>Print Display Stand</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: SECURITY & PASSWORD */}
        {activeTab === "security" && (
          <div className="space-y-6 max-w-xl">
            <div>
              <h1 className="text-2xl font-serif-luxury font-bold text-white">
                Admin Security & Credentials
              </h1>
              <p className="text-xs text-zinc-400 mt-0.5">
                Change your admin username and password. Keep these credentials confidential.
              </p>
            </div>

            <form onSubmit={handleChangeCredentials} className="bg-[#141419] border border-zinc-800 rounded-2xl p-6 space-y-4">
              <h3 className="font-serif-luxury text-base font-bold text-[#d4af37] border-b border-zinc-800 pb-2">
                Update Admin Login
              </h3>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                  Current Password *
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password to verify"
                  className="w-full bg-[#0b0b0e] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                  New Username (Optional)
                </label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="Leave blank to keep current"
                  className="w-full bg-[#0b0b0e] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                  New Password (Min 6 characters)
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Leave blank to keep current"
                  className="w-full bg-[#0b0b0e] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-[#d4af37]"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#e5c07b] to-[#d4af37] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all shadow-md shadow-[#d4af37]/20 disabled:opacity-50 cursor-pointer"
              >
                <Save className="w-4 h-4 fill-black" />
                <span>Save New Credentials</span>
              </button>
            </form>

            {/* Reset Database Box */}
            <div className="bg-[#141419] border border-red-900/40 rounded-2xl p-6 space-y-3">
              <h3 className="font-serif-luxury text-base font-bold text-red-400">
                Danger Zone: Restore Initial Sample Data
              </h3>
              <p className="text-xs text-zinc-400">
                If you ever want to reset all services, offers, and photos back to the original demo configuration:
              </p>
              <button
                type="button"
                onClick={handleResetData}
                className="py-2.5 px-4 rounded-xl bg-red-950/40 hover:bg-red-900/50 border border-red-900/60 text-red-300 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset to Default Demo Values</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* SERVICE EDIT/ADD MODAL */}
      {serviceModalOpen && editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#141419] border border-[#d4af37]/30 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="font-serif-luxury text-lg font-bold text-white">
                {editingService.id ? "Edit Service" : "Add New Service"}
              </h3>
              <button
                onClick={() => setServiceModalOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveService} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                  Service Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingService.name}
                  onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                  placeholder="e.g. Men's Haircut"
                  className="w-full bg-[#0b0b0e] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                    Category *
                  </label>
                  <select
                    value={editingService.category}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        category: e.target.value as ServiceItem["category"]
                      })
                    }
                    className="w-full bg-[#0b0b0e] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-[#d4af37]"
                  >
                    <option value="Hair Care & Styling">Hair Care & Styling</option>
                    <option value="Skin & Facials">Skin & Facials</option>
                    <option value="Men's Grooming">Men&apos;s Grooming</option>
                    <option value="Bridal & Makeup">Bridal & Makeup</option>
                    <option value="Spa & Massage">Spa & Massage</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                    Price in Rupees (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={editingService.price}
                    onChange={(e) =>
                      setEditingService({ ...editingService, price: Number(e.target.value) })
                    }
                    className="w-full bg-[#0b0b0e] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                    Original Price (Optional strikethrough)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editingService.originalPrice || ""}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        originalPrice: e.target.value ? Number(e.target.value) : undefined
                      })
                    }
                    placeholder="e.g. 200"
                    className="w-full bg-[#0b0b0e] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={editingService.duration}
                    onChange={(e) =>
                      setEditingService({ ...editingService, duration: e.target.value })
                    }
                    placeholder="e.g. 30 mins"
                    className="w-full bg-[#0b0b0e] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                  Service Description
                </label>
                <textarea
                  rows={2}
                  value={editingService.description}
                  onChange={(e) =>
                    setEditingService({ ...editingService, description: e.target.value })
                  }
                  placeholder="Short description of what the service includes..."
                  className="w-full bg-[#0b0b0e] border border-zinc-700 rounded-xl px-3.5 py-2 text-white text-sm outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                  Service Image (URL or Upload File)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingService.image}
                    onChange={(e) =>
                      setEditingService({ ...editingService, image: e.target.value })
                    }
                    className="flex-1 bg-[#0b0b0e] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-[#d4af37]"
                  />
                  <label className="px-3.5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shrink-0">
                    <Upload className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await handleFileUpload(file);
                          if (url) setEditingService({ ...editingService, image: url });
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingService.isActive}
                    onChange={(e) =>
                      setEditingService({ ...editingService, isActive: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-[#d4af37] bg-zinc-900 border-zinc-700"
                  />
                  <span>Active (Visible on public menu)</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingService.isPopular}
                    onChange={(e) =>
                      setEditingService({ ...editingService, isPopular: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-[#d4af37] bg-zinc-900 border-zinc-700"
                  />
                  <span>Highlight as &apos;Client Favorite&apos;</span>
                </label>
              </div>

              <div className="pt-4 border-t border-zinc-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setServiceModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#e5c07b] to-[#d4af37] text-black text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5 fill-black" />
                  <span>{saving ? "Saving..." : "Save Service"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SPECIAL OFFER EDIT/ADD MODAL */}
      {offerModalOpen && editingOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#141419] border border-[#d4af37]/30 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="font-serif-luxury text-lg font-bold text-white">
                {editingOffer.id ? "Edit Deal" : "Create New Deal"}
              </h3>
              <button
                onClick={() => setOfferModalOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveOffer} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                  Offer Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingOffer.title}
                  onChange={(e) => setEditingOffer({ ...editingOffer, title: e.target.value })}
                  placeholder="e.g. Haircut + Beard Grooming Combo"
                  className="w-full bg-[#0b0b0e] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                    Original Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={editingOffer.originalPrice}
                    onChange={(e) =>
                      setEditingOffer({ ...editingOffer, originalPrice: Number(e.target.value) })
                    }
                    className="w-full bg-[#0b0b0e] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                    Discounted Deal Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={editingOffer.discountedPrice}
                    onChange={(e) =>
                      setEditingOffer({ ...editingOffer, discountedPrice: Number(e.target.value) })
                    }
                    className="w-full bg-[#0b0b0e] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                  Discount Badge (e.g. 20% OFF or SAVE ₹699)
                </label>
                <input
                  type="text"
                  value={editingOffer.discountBadge}
                  onChange={(e) =>
                    setEditingOffer({ ...editingOffer, discountBadge: e.target.value })
                  }
                  placeholder="e.g. SAVE 20%"
                  className="w-full bg-[#0b0b0e] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                  Offer Description
                </label>
                <textarea
                  rows={2}
                  value={editingOffer.description}
                  onChange={(e) =>
                    setEditingOffer({ ...editingOffer, description: e.target.value })
                  }
                  placeholder="Details of what the customer receives in this deal..."
                  className="w-full bg-[#0b0b0e] border border-zinc-700 rounded-xl px-3.5 py-2 text-white text-sm outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={editingOffer.startDate}
                    onChange={(e) =>
                      setEditingOffer({ ...editingOffer, startDate: e.target.value })
                    }
                    className="w-full bg-[#0b0b0e] border border-zinc-700 rounded-xl px-3 py-2 text-white text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                    Expiry Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={editingOffer.expiryDate}
                    onChange={(e) =>
                      setEditingOffer({ ...editingOffer, expiryDate: e.target.value })
                    }
                    className="w-full bg-[#0b0b0e] border border-zinc-700 rounded-xl px-3 py-2 text-white text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                  Offer Banner Image (URL or Upload File)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingOffer.image}
                    onChange={(e) => setEditingOffer({ ...editingOffer, image: e.target.value })}
                    className="flex-1 bg-[#0b0b0e] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-[#d4af37]"
                  />
                  <label className="px-3.5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shrink-0">
                    <Upload className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await handleFileUpload(file);
                          if (url) setEditingOffer({ ...editingOffer, image: url });
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingOffer.isActive}
                    onChange={(e) =>
                      setEditingOffer({ ...editingOffer, isActive: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-[#d4af37] bg-zinc-900 border-zinc-700"
                  />
                  <span>Active (Visible on public deals section)</span>
                </label>
              </div>

              <div className="pt-4 border-t border-zinc-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setOfferModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#e5c07b] to-[#d4af37] text-black text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5 fill-black" />
                  <span>{saving ? "Saving..." : "Save Deal"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GALLERY UPLOAD MODAL */}
      {galleryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#141419] border border-[#d4af37]/30 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="font-serif-luxury text-lg font-bold text-white">
                Upload Gallery Photo
              </h3>
              <button
                onClick={() => setGalleryModalOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddGalleryPhoto} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                  Photo Title / Caption *
                </label>
                <input
                  type="text"
                  required
                  value={newGalleryTitle}
                  onChange={(e) => setNewGalleryTitle(e.target.value)}
                  placeholder="e.g. Royal HD Bridal Glow"
                  className="w-full bg-[#0b0b0e] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                  Category *
                </label>
                <select
                  value={newGalleryCategory}
                  onChange={(e) => setNewGalleryCategory(e.target.value as GalleryCategory)}
                  className="w-full bg-[#0b0b0e] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-[#d4af37]"
                >
                  <option value="Men's Haircuts">Men&apos;s Haircuts</option>
                  <option value="Women's Hairstyles">Women&apos;s Hairstyles</option>
                  <option value="Bridal Makeup">Bridal Makeup</option>
                  <option value="Hair Coloring">Hair Coloring</option>
                  <option value="Salon Interior">Salon Interior</option>
                  <option value="Before and After">Before and After</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                  Image (URL or Upload File) *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={newGalleryImage}
                    onChange={(e) => setNewGalleryImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 bg-[#0b0b0e] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-[#d4af37]"
                  />
                  <label className="px-3.5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shrink-0">
                    <Upload className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await handleFileUpload(file);
                          if (url) setNewGalleryImage(url);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              {newGalleryImage && (
                <div className="h-44 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900">
                  <img
                    src={newGalleryImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  value={newGalleryDescription}
                  onChange={(e) => setNewGalleryDescription(e.target.value)}
                  placeholder="Brief note about the styling technique..."
                  className="w-full bg-[#0b0b0e] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="pt-4 border-t border-zinc-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setGalleryModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#e5c07b] to-[#d4af37] text-black text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5 fill-black" />
                  <span>{saving ? "Uploading..." : "Add to Gallery"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
