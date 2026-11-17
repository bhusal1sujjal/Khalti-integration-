import { NextResponse } from "next/server";
import { getOrder, products } from "@/lib/orders";

export async function POST(request: Request) {
  const secretKey = process.env.KHALTI_SECRET_KEY;
  if (!secretKey) return NextResponse.json({ error: "Khalti is not configured." }, { status: 500 });
  let body: { pidx?: string; orderId?: string };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const pidx = body.pidx?.trim();
  const orderId = body.orderId?.trim();
  if (!pidx || !orderId) return NextResponse.json({ error: "Missing payment details." }, { status: 400 });

  const order = getOrder(orderId);
  if (!order || order.pidx !== pidx) return NextResponse.json({ error: "This payment does not match a pending practice order." }, { status: 400 });
  try {
    const response = await fetch("https://dev.khalti.com/api/v2/epayment/lookup/", {
      method: "POST",
      headers: { Authorization: `Key ${secretKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ pidx }),
    });
    const data = await response.json();
    if (!response.ok) {
      console.error("Khalti lookup failed", data);
      return NextResponse.json({ error: "Khalti could not verify this payment." }, { status: 502 });
    }
    const product = products[order.productId];
    // The documented lookup response includes pidx, total_amount, status and
    // transaction_id (not purchase_order_id), so tie the pidx to our order in
    // the local store and compare the verified amount against its product.
    if (data.pidx !== pidx || data.total_amount !== product.amount) {
      return NextResponse.json({ status: "failed", message: "The returned payment details did not match this order." }, { status: 400 });
    }
    if (data.status !== "Completed" || data.refunded) {
      return NextResponse.json({ status: "pending", message: `Khalti reports: ${data.status ?? "Unknown"}.` });
    }
    return NextResponse.json({ status: "completed", message: `Verified: ${product.name} was paid successfully.` });
  } catch (error) {
    console.error("Khalti lookup request failed", error);
    return NextResponse.json({ error: "Could not reach Khalti to verify payment." }, { status: 502 });
  }
}
