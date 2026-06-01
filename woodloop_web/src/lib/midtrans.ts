/**
 * Midtrans configuration and helper functions.
 *
 * Requires environment variables:
 *   MIDTRANS_SERVER_KEY   – Server key from Midtrans dashboard
 *   MIDTRANS_CLIENT_KEY   – Client key for Snap popup
 *   MIDTRANS_IS_PRODUCTION – "true" for production, anything else for sandbox
 */

const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
const clientKey = process.env.MIDTRANS_CLIENT_KEY || "";
const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";

/**
 * Create a Snap transaction and return the token + redirect URL.
 */
export async function createSnapTransaction(params: {
  orderId: string;
  grossAmount: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items?: { id: string; name: string; price: number; quantity: number }[];
}) {
  const midtrans = await import("midtrans-client");
  const Snap = midtrans.Snap;

  const snap = new Snap({
    isProduction,
    serverKey,
    clientKey,
  });

  const parameter = {
    transaction_details: {
      order_id: params.orderId,
      gross_amount: params.grossAmount,
    },
    customer_details: {
      first_name: params.customerName,
      email: params.customerEmail,
      phone: params.customerPhone || "",
    },
    item_details: params.items?.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    })) || [
      { id: params.orderId, name: `Order ${params.orderId}`, price: params.grossAmount, quantity: 1 },
    ],
  };

  const transaction = await snap.createTransaction(parameter);
  return {
    token: transaction.token,
    redirect_url: transaction.redirect_url,
  };
}

/** Check if Midtrans has been configured with a server key. */
export function isMidtransConfigured(): boolean {
  return !!serverKey;
}

/** Get the client key for the Snap popup (safe to expose). */
export function getMidtransClientKey(): string {
  return clientKey;
}
