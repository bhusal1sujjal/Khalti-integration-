import { NextResponse } from "next/server";
import { attachPidx, createOrder, products, type ProductId } from "@/lib/orders";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const secretKey = process.env.KHALTI_SECRET_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!secretKey || !siteUrl) {
    return NextResponse.json({ error: "Set KHALTI_SECRET_KEY and NEXT_PUBLIC_SITE_URL in .env.local." }, { status: 500 });
  }

  let body: { productId?: string };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const productId = body.productId as ProductId;
  if (!Object.hasOwn(products, productId)) return NextResponse.json({ error: "Choose a valid practice item." }, { status: 400 });

  const product = products[productId];
  const orderId = createOrder(productId);
  const baseUrl = siteUrl.replace(/\/$/, "");
  try {
    const response = await fetch("https://dev.khalti.com/api/v2/epayment/initiate/", {
      method: "POST",
      headers: { Authorization: `Key ${secretKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        return_url: `${baseUrl}/payment/result?orderId=${encodeURIComponent(orderId)}`,
        website_url: baseUrl,
        amount: product.amount,
        purchase_order_id: orderId,
        purchase_order_name: product.name,
      }),
    });
    const data = await response.json();
    if (!response.ok || !data.payment_url || !data.pidx) {
      console.error("Khalti initiation failed", data);
      return NextResponse.json({ error: "Khalti could not start checkout. Check your sandbox key and try again." }, { status: 502 });
    }
    attachPidx(orderId, data.pidx);
    return NextResponse.json({ paymentUrl: data.payment_url });
  } catch (error) {
    console.error("Khalti request failed", error);
    return NextResponse.json({ error: "Could not reach Khalti. Try again." }, { status: 502 });
  }
}
