/**
 * POST /api/midtrans/notification
 *
 * Midtrans payment notification webhook.
 * Called by Midtrans after a payment is completed/cancelled/failed.
 * Supports both raw_timber_orders and orders collections.
 *
 * Body (sent by Midtrans): { transaction_status, order_id, ... }
 */
import { NextRequest, NextResponse } from "next/server";

async function tryFindAndUpdateOrder(pb: ReturnType<typeof import("@/lib/pocketbase/client")["getPB"]>, orderId: string, newStatus: string, paymentType: string) {
  // Try raw_timber_orders first
  try {
    const order = await pb.collection("raw_timber_orders").getOne(orderId, { requestKey: null });
    if (order) {
      await pb.collection("raw_timber_orders").update(orderId, {
        status: newStatus,
        payment_method: paymentType || order.payment_method,
      });
      console.log(`Midtrans notification: raw_timber_orders ${orderId} → ${newStatus}`);
      return true;
    }
  } catch {
    // Not found in raw_timber_orders, try orders
  }

  try {
    const order = await pb.collection("orders").getOne(orderId, { requestKey: null });
    if (order) {
      await pb.collection("orders").update(orderId, {
        status: newStatus,
        payment_method: paymentType || order.payment_method,
      });
      console.log(`Midtrans notification: orders ${orderId} → ${newStatus}`);
      return true;
    }
  } catch {
    // Not found in either
  }

  return false;
}

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
        console.log(`Midtrans notification: Order ${order_id} refunded`);
        break;
    }

    if (newStatus) {
      const found = await tryFindAndUpdateOrder(pb, order_id, newStatus, body.payment_type || "");

      if (!found) {
        console.error(`Midtrans notification: Order ${order_id} not found in any collection`);
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }
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
