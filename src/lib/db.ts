import fs from "fs";
import path from "path";
import {
  SalonDatabase,
  SalonInfo,
  ServiceItem,
  SpecialOfferItem,
  GalleryItem
} from "@/types/salon";
import { initialData } from "@/data/initialData";

// Data file paths
const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "salon_db.json");
const TMP_FALLBACK_FILE = path.join("/tmp", "salon_db.json");

// In-memory cache for fast reads and serverless fallback
let inMemoryDb: SalonDatabase | null = null;

function ensureDirectoryExists(dirPath: string) {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  } catch (err) {
    console.warn(`Could not create directory ${dirPath}, might be on read-only filesystem:`, err);
  }
}

function getWritableDbPath(): string {
  try {
    ensureDirectoryExists(DATA_DIR);
    return DB_FILE;
  } catch {
    return TMP_FALLBACK_FILE;
  }
}

export function getSalonDb(): SalonDatabase {
  if (inMemoryDb) {
    return inMemoryDb;
  }

  const primaryPath = DB_FILE;
  const fallbackPath = TMP_FALLBACK_FILE;

  try {
    if (fs.existsSync(primaryPath)) {
      const raw = fs.readFileSync(primaryPath, "utf-8");
      inMemoryDb = JSON.parse(raw);
      return inMemoryDb!;
    }
  } catch (err) {
    console.warn("Could not read from primary DB file:", err);
  }

  try {
    if (fs.existsSync(fallbackPath)) {
      const raw = fs.readFileSync(fallbackPath, "utf-8");
      inMemoryDb = JSON.parse(raw);
      return inMemoryDb!;
    }
  } catch (err) {
    console.warn("Could not read from fallback DB file:", err);
  }

  // First time initialization: write initial data to disk
  inMemoryDb = JSON.parse(JSON.stringify(initialData));
  saveSalonDb(inMemoryDb!);
  return inMemoryDb!;
}

export function saveSalonDb(data: SalonDatabase): boolean {
  inMemoryDb = data;
  const targetFile = getWritableDbPath();
  const tempFile = `${targetFile}.tmp.${Date.now()}`;

  try {
    const jsonStr = JSON.stringify(data, null, 2);
    fs.writeFileSync(tempFile, jsonStr, "utf-8");
    fs.renameSync(tempFile, targetFile);
    return true;
  } catch (err) {
    console.warn("Could not save to primary path, attempting fallback:", err);
    try {
      const fallbackTemp = `${TMP_FALLBACK_FILE}.tmp.${Date.now()}`;
      fs.writeFileSync(fallbackTemp, JSON.stringify(data, null, 2), "utf-8");
      fs.renameSync(fallbackTemp, TMP_FALLBACK_FILE);
      return true;
    } catch (fallbackErr) {
      console.error("Failed to persist database to disk (persisted in-memory only):", fallbackErr);
      return true;
    }
  }
}

// Helper methods for specific domains

export function getSalonInfo(): SalonInfo {
  const db = getSalonDb();
  return db.info;
}

export function updateSalonInfo(newInfo: Partial<SalonInfo>): SalonInfo {
  const db = getSalonDb();
  db.info = { ...db.info, ...newInfo };
  saveSalonDb(db);
  return db.info;
}

export function getServices(onlyActive = false): ServiceItem[] {
  const db = getSalonDb();
  let items = [...db.services].sort((a, b) => a.order - b.order);
  if (onlyActive) {
    items = items.filter((s) => s.isActive);
  }
  return items;
}

export function addService(item: Omit<ServiceItem, "id">): ServiceItem {
  const db = getSalonDb();
  const newService: ServiceItem = {
    ...item,
    id: `srv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
  };
  db.services.push(newService);
  saveSalonDb(db);
  return newService;
}

export function updateService(id: string, updates: Partial<ServiceItem>): ServiceItem | null {
  const db = getSalonDb();
  const index = db.services.findIndex((s) => s.id === id);
  if (index === -1) return null;
  db.services[index] = { ...db.services[index], ...updates };
  saveSalonDb(db);
  return db.services[index];
}

export function deleteService(id: string): boolean {
  const db = getSalonDb();
  const initialLength = db.services.length;
  db.services = db.services.filter((s) => s.id !== id);
  if (db.services.length !== initialLength) {
    saveSalonDb(db);
    return true;
  }
  return false;
}

export function reorderServices(orderedIds: string[]): ServiceItem[] {
  const db = getSalonDb();
  const map = new Map(db.services.map((s) => [s.id, s]));
  const reordered: ServiceItem[] = [];

  orderedIds.forEach((id, idx) => {
    const s = map.get(id);
    if (s) {
      s.order = idx + 1;
      reordered.push(s);
      map.delete(id);
    }
  });

  // Append any not explicitly listed
  map.forEach((s) => {
    s.order = reordered.length + 1;
    reordered.push(s);
  });

  db.services = reordered;
  saveSalonDb(db);
  return db.services;
}

export function getOffers(onlyValid = false): SpecialOfferItem[] {
  const db = getSalonDb();
  let items = [...db.offers];
  if (onlyValid) {
    items = items.filter((o) => o.isActive);
  }
  return items;
}

export function addOffer(item: Omit<SpecialOfferItem, "id">): SpecialOfferItem {
  const db = getSalonDb();
  const newOffer: SpecialOfferItem = {
    ...item,
    id: `off-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
  };
  db.offers.push(newOffer);
  saveSalonDb(db);
  return newOffer;
}

export function updateOffer(id: string, updates: Partial<SpecialOfferItem>): SpecialOfferItem | null {
  const db = getSalonDb();
  const index = db.offers.findIndex((o) => o.id === id);
  if (index === -1) return null;
  db.offers[index] = { ...db.offers[index], ...updates };
  saveSalonDb(db);
  return db.offers[index];
}

export function deleteOffer(id: string): boolean {
  const db = getSalonDb();
  const initialLen = db.offers.length;
  db.offers = db.offers.filter((o) => o.id !== id);
  if (db.offers.length !== initialLen) {
    saveSalonDb(db);
    return true;
  }
  return false;
}

export function getGallery(): GalleryItem[] {
  const db = getSalonDb();
  return [...db.gallery];
}

export function addGalleryItem(item: Omit<GalleryItem, "id">): GalleryItem {
  const db = getSalonDb();
  const newItem: GalleryItem = {
    ...item,
    id: `gal-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString()
  };
  db.gallery.unshift(newItem);
  saveSalonDb(db);
  return newItem;
}

export function updateGalleryItem(id: string, updates: Partial<GalleryItem>): GalleryItem | null {
  const db = getSalonDb();
  const idx = db.gallery.findIndex((g) => g.id === id);
  if (idx === -1) return null;
  db.gallery[idx] = { ...db.gallery[idx], ...updates };
  saveSalonDb(db);
  return db.gallery[idx];
}

export function deleteGalleryItem(id: string): boolean {
  const db = getSalonDb();
  const initialLen = db.gallery.length;
  db.gallery = db.gallery.filter((g) => g.id !== id);
  if (db.gallery.length !== initialLen) {
    saveSalonDb(db);
    return true;
  }
  return false;
}

export function resetDatabaseToDefault(): SalonDatabase {
  inMemoryDb = JSON.parse(JSON.stringify(initialData));
  saveSalonDb(inMemoryDb!);
  return inMemoryDb!;
}
