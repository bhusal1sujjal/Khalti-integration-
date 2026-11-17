"use client";

import { useState } from "react";

const items = [
  { id: "notebook", name: "Everyday notebook", detail: "A tiny checkout for practicing payments.", price: "NPR 150" },
  { id: "coffee", name: "Coffee and a cookie", detail: "A second item to compare order amounts.", price: "NPR 250" },
];

export default function Home() {
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function checkout(productId: string) {
    setBusy(productId); setError("");
    try {
      const response = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Could not start checkout.");
      window.location.assign(data.paymentUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong."); setBusy(null);
    }
  }

  return <main className="page-shell">
    <nav className="topbar"><a className="brand" href="/" aria-label="Khalti Lab home"><span className="brand-mark">k</span> khalti<span className="brand-light">lab</span></a><span className="sandbox-pill"><i /> SANDBOX PRACTICE</span></nav>
    <section className="hero"><div className="eyebrow"><span /> A HANDS-ON PAYMENT PLAYGROUND</div><h1>Checkout, <em>understood.</em></h1><p className="intro">A small, real-world walkthrough of Khalti ePayment. Pick a sample item, complete sandbox checkout, and see how server-side verification works.</p>
      <div className="flow"><div><b>01</b><span>Choose an item</span></div><span className="flow-line"/><div><b>02</b><span>Pay in sandbox</span></div><span className="flow-line"/><div><b>03</b><span>Verify with Khalti</span></div></div>
    </section>
    <section className="shop"><div className="section-heading"><div><div className="eyebrow">THE PRACTICE SHOP</div><h2>Pick something small.</h2></div><span className="currency">Prices in NPR</span></div>
      <div className="product-grid">{items.map((item, index) => <article className="product-card" key={item.id}><div className={`product-art art-${index}`}><span className="art-symbol">{index === 0 ? "▤" : "◒"}</span><span className="art-caption">PAYMENT<br/>PRACTICE / 0{index + 1}</span><span className="art-orb"/></div><div className="product-info"><div><h3>{item.name}</h3><p>{item.detail}</p></div><span className="price">{item.price}</span></div><button className="pay-button" disabled={busy !== null} onClick={() => checkout(item.id)}>{busy === item.id ? <><span className="spinner"/> Connecting to Khalti…</> : <>Pay with Khalti <span>↗</span></>}</button></article>)}</div>
      {error && <p className="error-box" role="alert">{error}</p>}
    </section>
    <aside className="note"><span className="note-icon">i</span><p><strong>Learning mode.</strong> This demo uses a temporary in-memory order store. It is made for local practice; a real shop needs a database, durable orders, and protection against duplicate payment processing.</p></aside>
    <footer><span>MADE TO LEARN · NOT FOR REAL CHARGES</span><a href="https://docs.khalti.com/khalti-epayment/" target="_blank" rel="noreferrer">Khalti ePayment docs ↗</a></footer>
  </main>;
}
