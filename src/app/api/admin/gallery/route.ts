import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/apiAuth";
import { getGallery, addGalleryItem, updateGalleryItem, deleteGalleryItem } from "@/lib/db";


export async function GET(req: NextRequest) {
  const session = authenticateRequest(req);
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const gallery = getGallery();
  return NextResponse.json({ success: true, data: gallery });
}

export async function POST(req: NextRequest) {
  const session = authenticateRequest(req);
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, category, imageUrl, description } = body;

    if (!title || !imageUrl) {
      return NextResponse.json(
        { success: false, message: "Title and Image URL are required." },
        { status: 400 }
      );
    }

    const newItem = addGalleryItem({
      title: title.trim(),
      category: category || "Salon Interior",
      imageUrl: imageUrl.trim(),
      description: description || ""
    });

    return NextResponse.json({
      success: true,
      message: "Photo added to gallery successfully!",
      data: newItem
    });
  } catch (error) {
    console.error("Error adding gallery item:", error);
    return NextResponse.json({ success: false, message: "Failed to add photo" }, { status: 500 });
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
      return NextResponse.json({ success: false, message: "Gallery ID is required" }, { status: 400 });
    }

    const updated = updateGalleryItem(id, updates);
    if (!updated) {
      return NextResponse.json({ success: false, message: "Photo not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Gallery photo updated successfully!",
      data: updated
    });
  } catch (error) {
    console.error("Error updating gallery photo:", error);
    return NextResponse.json({ success: false, message: "Failed to update photo" }, { status: 500 });
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
      return NextResponse.json({ success: false, message: "Photo ID is required" }, { status: 400 });
    }

    const deleted = deleteGalleryItem(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: "Photo not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Photo deleted from gallery successfully!"
    });
  } catch (error) {
    console.error("Error deleting gallery photo:", error);
    return NextResponse.json({ success: false, message: "Failed to delete photo" }, { status: 500 });
  }
}
