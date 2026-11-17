"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, Github, Loader2 } from "lucide-react";

const REPO_URL = "https://github.com/bhusal1sujjal/Khalti-integration-";
const PORTFOLIO_URL = "https://sujjalbhusal.com.np";

const products = [
  {
    id: "notebook",
    number: "01",
    name: "Try a payment",
    description: "A small test order to walk through the checkout flow.",
    amount: "NPR 150",
    note: "Practice checkout",
  },
  {
    id: "coffee",
    number: "02",
    name: "Mo:Mo & coffee",
    description: "A plate of Mo:Mo and a cup of coffee for the person building this demo.",
    amount: "NPR 500",
    note: "A little support",
  },
];

export default function Home() {
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [logoUnavailable, setLogoUnavailable] = useState(false);

  async function checkout(productId: string) {
    setBusy(productId);
    setError("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error ?? "Could not start checkout.");
      window.location.assign(data.paymentUrl);
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Something went wrong. Please try again.");
      setBusy(null);
    }
  }

  return (
    <main className="site-shell">
      <nav className="topbar" aria-label="Main navigation">
        <a className="brand" href="/" aria-label="KhaltiPayment home">
          {logoUnavailable ? (
            <span className="brand-mark" aria-hidden="true">K</span>
          ) : (
            <Image className="brand-logo" src="/assets/logo.png" alt="" width={30} height={30} onError={() => setLogoUnavailable(true)} />
          )}
          <span>Khalti<span className="brand-payment">Payment</span></span>
        </a>
        <div className="nav-actions">
          <span className="sandbox-badge"><i /> Sandbox</span>
          <a className="github-link" href={REPO_URL} target="_blank" rel="noreferrer" aria-label="Open the KhaltiPayment GitHub repository" title="View source on GitHub">
            <Github size={18} strokeWidth={1.8} aria-hidden="true" />
            <span>View project</span>
          </a>
        </div>
      </nav>

      <section className="hero">
        <div className="eyebrow"><span className="eyebrow-dot" /> A small Khalti checkout demo</div>
        <h1>Try a payment.<br /><em>See how it works.</em></h1>
        <p className="hero-description">Choose one of the sample orders and continue to Khalti’s test checkout. The app then verifies the payment on the server.</p>
        <div className="hero-meta"><span className="hero-meta-dot" /> Test mode <span className="meta-separator">/</span> No real charge
        </div>
      </section>

      <section className="checkout-section" id="payment-options">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Sample orders</p>
            <h2>Pick one to get started</h2>
          </div>
          <span className="currency-note">Amounts in NPR</span>
        </div>

        <div className="payment-grid">
          {products.map((product) => (
            <article className="payment-card" key={product.id}>
              <div className="card-topline"><span className="card-number">{product.number}</span><span className="card-note">{product.note}</span></div>
              <div className="payment-card-info">
                <div className="card-copy"><h3>{product.name}</h3><p>{product.description}</p></div>
                <span className="product-price">{product.amount}</span>
              </div>
              <button className="checkout-button" disabled={busy !== null} onClick={() => checkout(product.id)}>
                {busy === product.id ? <><Loader2 className="loading-spinner" size={16} aria-hidden="true" /> Opening Khalti…</> : <>Continue to Khalti <ArrowRight size={17} aria-hidden="true" /></>}
              </button>
            </article>
          ))}
        </div>
        {error && <p className="error-message" role="alert">{error}</p>}
      </section>

      <section className="how-section" aria-labelledby="how-title">
        <div className="how-heading">
          <p className="section-kicker">A quick walkthrough</p>
          <h2 id="how-title">What happens after you click?</h2>
          <p className="how-intro">The payment flow has three parts. This project is set up so you can follow each one in the code.</p>
        </div>
        <ol className="steps-list">
          <li><span className="step-number">1</span><div><h3>Your app starts an order</h3><p>The checkout button sends the selected product to <code>POST /api/checkout</code>. The server creates the payment request with Khalti using your secret key.</p></div></li>
          <li><span className="step-number">2</span><div><h3>You complete test checkout</h3><p>Khalti hosts the payment screen. Use the test account details provided by Khalti’s sandbox, then return to this demo.</p></div></li>
          <li><span className="step-number">3</span><div><h3>The server verifies the result</h3><p>After Khalti redirects back, the app checks the payment with Khalti before showing the result. A redirect alone does not count as proof of payment.</p></div></li>
        </ol>
        <div className="code-map"><span>Where to look in the project</span><p><code>app/api/checkout/route.ts</code><i>starts payment</i><b>→</b><code>app/api/verify/route.ts</code><i>confirms payment</i><b>→</b><code>app/payment/result/page.tsx</code><i>shows outcome</i></p></div>
      </section>

      <footer className="site-footer">
        <div className="footer-author">
          <span>Built by <a href={PORTFOLIO_URL} target="_blank" rel="noreferrer">Sujjal Bhusal <span aria-hidden="true">↗</span></a></span>
          <small>Made to learn the payment checkout</small>
        </div>
        <a className="footer-docs" href="https://docs.khalti.com/khalti-epayment/" target="_blank" rel="noreferrer">Khalti ePayment Docs <ArrowRight size={16} aria-hidden="true" /></a>
      </footer>
    </main>
  );
}
