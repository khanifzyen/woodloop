import { NextRequest, NextResponse } from "next/server";
import { createSnapTransaction, isMidtransConfigured } from "@/lib/midtrans";
import { getPB } from "@/lib/pocketbase/client";

/**
 * POST /api/midtrans/snap
 *
 * Generate a Midtrans Snap token for an order.
 * Supports both raw_timber_orders (Generator→Supplier) and orders (Buyer→Converter).
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
    pb.autoCancellation(false);

    // Try raw_timber_orders first (Generator → Supplier), fall back to orders (Buyer → Converter)
    let order: Record<string, unknown> | null = null;
    let collectionName = "raw_timber_orders";

    try {
      order = await pb.collection("raw_timber_orders").getOne(orderId, {
        expand: "buyer,seller",
        requestKey: null,
      }) as unknown as Record<string, unknown>;
    } catch {
      // Not found in raw_timber_orders, try orders
      try {
        order = await pb.collection("orders").getOne(orderId, {
          expand: "buyer,product",
          requestKey: null,
        }) as unknown as Record<string, unknown>;
        collectionName = "orders";
      } catch {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }
    }

    const orderData = order;
    const buyerExpanded = orderData.expand as Record<string, unknown> | undefined;
    const buyer = buyerExpanded?.buyer as Record<string, unknown> | undefined;

    const buyerName = (buyer?.name as string) || "Buyer";
    const buyerEmail = (buyer?.email as string) || "";
    const buyerPhone = (buyer?.phone as string) || "";

    const itemName = collectionName === "orders"
      ? ((buyerExpanded?.product as Record<string, unknown> | undefined)?.name as string) || `Order ${orderData.id}`
      : `Order ${orderData.id}`;

    const result = await createSnapTransaction({
      orderId: orderData.id as string,
      grossAmount: orderData.total_price as number,
      customerName: buyerName,
      customerEmail: buyerEmail,
      customerPhone: buyerPhone,
      items: [
        { id: orderData.id as string, name: itemName, price: orderData.total_price as number, quantity: 1 },
      ],
    });

    // Save snap_token and redirect_url on the order
    await pb.collection(collectionName).update(orderData.id as string, {
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
