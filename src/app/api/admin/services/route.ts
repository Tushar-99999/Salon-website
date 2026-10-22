import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/apiAuth";
import {
  getServices,
  addService,
  updateService,
  deleteService,
  reorderServices
} from "@/lib/db";


export async function GET(req: NextRequest) {
  const session = authenticateRequest(req);
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const services = getServices(false); // return all, including hidden
  return NextResponse.json({ success: true, data: services });
}

export async function POST(req: NextRequest) {
  const session = authenticateRequest(req);
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, category, price, duration, description, image, isActive, order, originalPrice } = body;

    if (!name || !price) {
      return NextResponse.json(
        { success: false, message: "Service name and price are required." },
        { status: 400 }
      );
    }

    const currentServices = getServices(false);
    const newService = addService({
      name: name.trim(),
      category: category || "Hair Care & Styling",
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      duration: duration || "30 mins",
      description: description || "",
      image: image || "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80",
      isActive: isActive !== false,
      order: order || currentServices.length + 1
    });

    return NextResponse.json({
      success: true,
      message: "Service added successfully!",
      data: newService
    });
  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json({ success: false, message: "Failed to create service" }, { status: 500 });
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
      return NextResponse.json({ success: false, message: "Service ID is required" }, { status: 400 });
    }

    if (updates.price !== undefined) {
      updates.price = Number(updates.price);
    }
    if (updates.originalPrice !== undefined) {
      updates.originalPrice = updates.originalPrice ? Number(updates.originalPrice) : undefined;
    }

    const updated = updateService(id, updates);
    if (!updated) {
      return NextResponse.json({ success: false, message: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Service updated successfully!",
      data: updated
    });
  } catch (error) {
    console.error("Error updating service:", error);
    return NextResponse.json({ success: false, message: "Failed to update service" }, { status: 500 });
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
      return NextResponse.json({ success: false, message: "Service ID is required" }, { status: 400 });
    }

    const deleted = deleteService(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Service deleted successfully!"
    });
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json({ success: false, message: "Failed to delete service" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = authenticateRequest(req);
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { orderedIds } = body;

    if (!Array.isArray(orderedIds)) {
      return NextResponse.json({ success: false, message: "orderedIds array is required" }, { status: 400 });
    }

    const reordered = reorderServices(orderedIds);
    return NextResponse.json({
      success: true,
      message: "Services reordered successfully!",
      data: reordered
    });
  } catch (error) {
    console.error("Error reordering services:", error);
    return NextResponse.json({ success: false, message: "Failed to reorder services" }, { status: 500 });
  }
}
