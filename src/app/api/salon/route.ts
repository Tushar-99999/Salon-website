import { NextResponse } from "next/server";
import { getSalonInfo, getServices, getOffers, getGallery } from "@/lib/db";


export async function GET() {
  try {
    const info = getSalonInfo();
    const services = getServices(true); // only active services
    const offers = getOffers(true); // only active and valid (non-expired)
    const gallery = getGallery();

    return NextResponse.json({
      success: true,
      data: {
        info,
        services,
        offers,
        gallery
      }
    });
  } catch (error) {
    console.error("Error fetching salon data:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load salon data" },
      { status: 500 }
    );
  }
}
