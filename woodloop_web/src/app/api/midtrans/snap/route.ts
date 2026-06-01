import { NextRequest, NextResponse } from "next/server";
import { createSnapTransaction, isMidtransConfigured } from "@/lib/midtrans";
import { getPB } from "@/lib/pocketbase/client";

/**
 * POST /api/midtrans/snap
 *
 * Generate a Midtrans Snap token for a raw_timber_order.
 *
 * Body: { orderId: string }
 */
export async function POST(request: NextRequest) {
  if (!isMidtransConfigured()) {
    return NextResponse.json(
      { error: "Midtrans not configured" },
      { status: 503 }
    );
  }

  try {
    const { orderId } = await request.json();
    if (!orderId) {
      return NextResponse.json({ error: "orderId is required" }, { status: 400 });
    }

    const pb = getPB();
    const order = await pb.collection("raw_timber_orders").getOne(orderId, {
      expand: "buyer,seller",
      requestKey: null,
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const buyerName = order.expand?.buyer?.name || "Buyer";
    const buyerEmail = order.expand?.buyer?.email || "";
    const buyerPhone = order.expand?.buyer?.phone || "";

    const result = await createSnapTransaction({
      orderId: order.id,
      grossAmount: order.total_price,
      customerName: buyerName,
      customerEmail: buyerEmail,
      customerPhone: buyerPhone,
    });

    // Save snap_token and redirect_url on the order
    await pb.collection("raw_timber_orders").update(order.id, {
      snap_token: result.token,
      snap_redirect_url: result.redirect_url,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Midtrans snap error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create snap transaction" },
      { status: 500 }
    );
  }
}
