"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type Result = { status: "completed" | "pending" | "failed"; message: string };

function PaymentResultContent() {
  const params = useSearchParams();
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const pidx = params.get("pidx");
    const orderId = params.get("orderId");
    if (!pidx || !orderId) { setResult({ status: "failed", message: "No Khalti payment details were returned. You can go back and try again." }); setLoading(false); return; }
    fetch("/api/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pidx, orderId }) })
      .then(async response => { const data = await response.json(); if (!response.ok && !data.status) throw new Error(data.error ?? "Could not verify this payment."); return data as Result; })
      .then(setResult).catch(error => setResult({ status: "failed", message: error instanceof Error ? error.message : "Payment verification failed." })).finally(() => setLoading(false));
  }, [params]);

  const state = loading ? "checking" : result?.status ?? "failed";
  return <main className="result-shell"><a className="brand" href="/"><span className="brand-mark">k</span> khalti<span className="brand-light">lab</span></a><section className={`result-card state-${state}`}><div className="result-icon">{loading ? <span className="spinner dark"/> : state === "completed" ? "✓" : state === "pending" ? "…" : "!"}</div><div className="eyebrow">{loading ? "ONE MOMENT" : state === "completed" ? "PAYMENT VERIFIED" : state === "pending" ? "PAYMENT PENDING" : "PAYMENT NOT VERIFIED"}</div><h1>{loading ? "Checking with Khalti" : state === "completed" ? "That went through." : state === "pending" ? "Still in progress." : "Could not confirm."}</h1><p>{loading ? "We’re checking the payment directly with Khalti. This usually takes just a moment." : result?.message}</p><a className="back-button" href="/">Back to the practice shop <span>→</span></a><small>We verify the payment on the server. The browser’s success message alone is never trusted.</small></section></main>;
}

export default function PaymentResult() {
  return <Suspense fallback={<main className="result-shell"><p>Loading payment details…</p></main>}><PaymentResultContent /></Suspense>;
}
