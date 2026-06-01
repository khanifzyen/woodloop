/**
 * POST /api/midtrans/notification
 *
 * Midtrans payment notification webhook.
 * Called by Midtrans after a payment is completed/cancelled/failed.
 *
 * Body (sent by Midtrans): { transaction_status, order_id, ... }
 */
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { transaction_status, order_id } = body;

    if (!order_id) {
      return NextResponse.json({ error: "Missing order_id" }, { status: 400 });
    }

    const { getPB } = await import("@/lib/pocketbase/client");
    const pb = getPB();
    pb.autoCancellation(false);

    // Fetch the order
    const order = await pb.collection("raw_timber_orders").getOne(order_id, {
      requestKey: null,
    });

    if (!order) {
      console.error(`Midtrans notification: Order ${order_id} not found`);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Map Midtrans transaction status to our order status
    let newStatus: string | null = null;

    switch (transaction_status) {
      case "capture":
      case "settlement":
        newStatus = "paid";
        break;
      case "pending":
        newStatus = "payment_pending";
        break;
      case "deny":
      case "cancel":
      case "expire":
        newStatus = "cancelled";
        break;
      case "refund":
      case "partial_refund":
        // Keep current status, log it
        console.log(`Midtrans notification: Order ${order_id} refunded`);
        break;
    }

    if (newStatus) {
      await pb.collection("raw_timber_orders").update(order_id, {
        status: newStatus,
        payment_method: body.payment_type || order.payment_method,
      });

      console.log(`Midtrans notification: Order ${order_id} → ${newStatus}`);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Midtrans notification error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal error" },
      { status: 500 }
    );
  }
}
