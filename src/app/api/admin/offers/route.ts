import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/apiAuth";
import { getOffers, addOffer, updateOffer, deleteOffer } from "@/lib/db";


export async function GET(req: NextRequest) {
  const session = authenticateRequest(req);
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const offers = getOffers(false); // get all, including expired or disabled
  return NextResponse.json({ success: true, data: offers });
}

export async function POST(req: NextRequest) {
  const session = authenticateRequest(req);
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      title,
      description,
      originalPrice,
      discountedPrice,
      discountBadge,
      image,
      startDate,
      expiryDate,
      isActive,
      terms
    } = body;

    if (!title || originalPrice === undefined || discountedPrice === undefined) {
      return NextResponse.json(
        { success: false, message: "Offer title, original price, and discounted price are required." },
        { status: 400 }
      );
    }

    const calculatedSavings = Number(originalPrice) - Number(discountedPrice);
    const calculatedPercentage = Math.round((calculatedSavings / Number(originalPrice)) * 100);
    const defaultBadge = calculatedPercentage > 0 ? `${calculatedPercentage}% OFF` : `SAVE ₹${calculatedSavings}`;

    const newOffer = addOffer({
      title: title.trim(),
      description: description || "",
      originalPrice: Number(originalPrice),
      discountedPrice: Number(discountedPrice),
      discountBadge: discountBadge?.trim() || defaultBadge,
      image: image || "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80",
      startDate: startDate || new Date().toISOString().split("T")[0],
      expiryDate: expiryDate || "2027-12-31",
      isActive: isActive !== false,
      terms: terms || ""
    });

    return NextResponse.json({
      success: true,
      message: "Offer added successfully!",
      data: newOffer
    });
  } catch (error) {
    console.error("Error creating offer:", error);
    return NextResponse.json({ success: false, message: "Failed to create offer" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = authenticateRequest(req);
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "Offer ID is required" }, { status: 400 });
    }

    if (updates.originalPrice !== undefined) updates.originalPrice = Number(updates.originalPrice);
    if (updates.discountedPrice !== undefined) updates.discountedPrice = Number(updates.discountedPrice);

    const updated = updateOffer(id, updates);
    if (!updated) {
      return NextResponse.json({ success: false, message: "Offer not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Offer updated successfully!",
      data: updated
    });
  } catch (error) {
    console.error("Error updating offer:", error);
    return NextResponse.json({ success: false, message: "Failed to update offer" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = authenticateRequest(req);
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "Offer ID is required" }, { status: 400 });
    }

    const deleted = deleteOffer(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: "Offer not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Offer deleted successfully!"
    });
  } catch (error) {
    console.error("Error deleting offer:", error);
    return NextResponse.json({ success: false, message: "Failed to delete offer" }, { status: 500 });
  }
}
