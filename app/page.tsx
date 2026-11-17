"use client";

import { useEffect, useState } from "react";

const REPO = "bhusal1sujjal/Khalti-integration-";
const REPO_URL = `https://github.com/${REPO}`;
const PORTFOLIO_URL = "https://sujjalbhusal.com.np";

const products = [
  {
    id: "notebook",
    name: "Payment practice",
    description: "Learn the checkout flow with a small sandbox order.",
    amount: "NPR 150",
    kind: "Sandbox practice",
    art: "practice",
  },
  {
    id: "coffee",
    name: "Mo:Mo & coffee for Sujjal",
    description: "Buy me a plate of Mo:Mo and a cup of coffee.",
    amount: "NPR 500",
    kind: "Support the builder",
    art: "momo",
  },
];

function GithubIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.1c-3.1.67-3.76-1.31-3.76-1.31-.5-1.28-1.24-1.62-1.24-1.62-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15 1 .1.76 2.22 4.42 1.57.1-.72.39-1.22.7-1.5-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.21 1.15-2.99-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.05 1.14a10.6 10.6 0 0 1 5.55 0c2.11-1.43 3.04-1.14 3.04-1.14.61 1.54.23 2.68.12 2.96.71.78 1.14 1.77 1.14 2.99 0 4.29-2.61 5.23-5.1 5.51.4.35.76 1.02.76 2.06v3.05c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" />
    </svg>
  );
}

function StarIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"}>
      <path d="m12 3 2.78 5.63 6.22.9-4.5 4.39 1.06 6.2L12 17.2l-5.56 2.92 1.06-6.2L3 9.53l6.22-.9L12 3Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GithubStars({ repo, stargazersCount }: { repo: string; stargazersCount: number }) {
  const count = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(stargazersCount);

  return (
    <a
      className="github-stars-link"
      href={`https://github.com/${repo}`}
      target="_blank"
      rel="noreferrer"
      aria-label={`${stargazersCount.toLocaleString()} GitHub stars`}
      title={`${stargazersCount.toLocaleString()} stars on GitHub`}
    >
      <GithubIcon />
      <StarIcon />
      <span>{count}</span>
    </a>
  );
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
      <path d="M4.2 10h11.3m-4.5-4.5 4.5 4.5-4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Home() {
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [starCount, setStarCount] = useState<number | null>(null);
  const [starCountUnavailable, setStarCountUnavailable] = useState(false);

  useEffect(() => {
    let mounted = true;

    fetch(`https://api.github.com/repos/${REPO}`, {
      headers: { Accept: "application/vnd.github+json" },
    })
      .then((response) => {
        if (!response.ok) throw new Error("GitHub star count is unavailable");
        return response.json();
      })
      .then((repository: { stargazers_count?: number }) => {
        if (mounted && typeof repository.stargazers_count === "number") {
          setStarCount(repository.stargazers_count);
        }
      })
      .catch(() => {
        if (mounted) setStarCountUnavailable(true);
      });

    return () => { mounted = false; };
  }, []);

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
          <span className="brand-mark">K</span>
          <span>Khalti<span className="brand-payment">Payment</span></span>
        </a>

        <div className="nav-actions">
          <span className="sandbox-badge"><i /> Sandbox</span>
          <span className="nav-group-divider" aria-hidden="true" />
          {starCount !== null ? (
            <GithubStars repo={REPO} stargazersCount={starCount} />
          ) : (
            <a className="github-stars-fallback" href={REPO_URL} target="_blank" rel="noreferrer" aria-label="View GitHub repository and star count">
              <GithubIcon /><span>{starCountUnavailable ? "—" : "…"}</span>
            </a>
          )}
          <span className="nav-divider" aria-hidden="true" />
          <a className="star-cta" href={`${REPO_URL}/star`} target="_blank" rel="noreferrer" aria-label="Star KhaltiPayment on GitHub" title="Star this repository">
            <StarIcon filled /><span>Star</span>
          </a>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot" /> A friendly payment playground</div>
          <h1>Learn Khalti checkout<br /><em>one step at a time.</em></h1>
          <p className="hero-description">Explore a simple payment flow, try a sandbox checkout, and see how the server verifies a transaction with Khalti.</p>
          <a className="hero-button" href="#payment-options">Explore payment options <ArrowIcon /></a>
          <div className="hero-caption"><span className="caption-check">✓</span> Sandbox practice · No real charges</div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="hero-glow" />
          <div className="payment-receipt">
            <div className="receipt-topline"><span /><span /><span /><small>PAYMENT CHECKOUT</small></div>
            <div className="receipt-brand"><span className="receipt-brand-mark">K</span>KhaltiPayment</div>
            <div className="receipt-divider" />
            <div className="receipt-detail"><span>Payment practice</span><b>NPR 150</b></div>
            <div className="receipt-detail muted"><span>Payment method</span><span>Khalti</span></div>
            <div className="receipt-divider" />
            <div className="receipt-total"><span>Total</span><b>NPR 150</b></div>
            <div className="receipt-confirm"><span>✓</span> Verified securely</div>
          </div>
          <span className="float-tag tag-initiate"><i>01</i> Initiate</span>
          <span className="float-tag tag-verify"><i>02</i> Verify</span>
          <span className="visual-sparkle">✳</span>
        </div>
      </section>

      <section className="flow-strip" aria-label="How the checkout works">
        <div className="flow-step"><span>01</span><div><b>Choose</b><small>Select a checkout</small></div></div>
        <i className="flow-line" />
        <div className="flow-step"><span>02</span><div><b>Pay</b><small>Continue to Khalti</small></div></div>
        <i className="flow-line" />
        <div className="flow-step"><span>03</span><div><b>Verify</b><small>Confirm on the server</small></div></div>
      </section>

      <section className="payments-section" id="payment-options">
        <div className="section-heading">
          <div><div className="eyebrow">Choose your checkout</div><h2>Payment practice &amp; a little treat.</h2><p>Both options use the same secure Khalti checkout flow.</p></div>
          <span className="currency-note">All prices in NPR <i>·</i> Sandbox</span>
        </div>

        <div className="payment-grid">
          {products.map((product, index) => (
            <article className={`payment-card card-${product.art}`} key={product.id}>
              <div className={`payment-art art-${product.art}`}>
                <span className="art-index">0{index + 1} / 02</span>
                <span className="art-label">{product.kind}</span>
                {product.art === "practice" ? (
                  <div className="practice-object" aria-hidden="true"><span className="practice-spine" /><i /><i /><i /><b>K</b></div>
                ) : (
                  <div className="momo-object" aria-hidden="true"><span className="steam">〰</span><span className="momo-plate"><i /><i /><i /><i /><i /></span><span className="coffee-cup"><i /></span></div>
                )}
                <span className="art-orbit" />
                <span className="art-sparkle">✳</span>
              </div>
              <div className="payment-card-info">
                <div className="card-copy"><span className="card-kind">{product.kind}</span><h3>{product.name}</h3><p>{product.description}</p></div>
                <span className="product-price">{product.amount}</span>
              </div>
              <button className="checkout-button" disabled={busy !== null} onClick={() => checkout(product.id)}>
                {busy === product.id ? <><span className="loading-spinner" /> Connecting to Khalti…</> : <>Pay with Khalti <ArrowIcon /></>}
              </button>
            </article>
          ))}
        </div>
        {error && <p className="error-message" role="alert">{error}</p>}
      </section>

      <aside className="learning-callout">
        <span className="callout-icon">i</span>
        <p><b>Built for learning.</b> This demo stores orders temporarily in memory. Real shops need a database and safeguards against duplicate payments.</p>
        <a href="https://docs.khalti.com/khalti-epayment/" target="_blank" rel="noreferrer">Integration guide <ArrowIcon /></a>
      </aside>

      <footer className="site-footer">
        <div className="footer-author">
          <span>Built by <a href={PORTFOLIO_URL} target="_blank" rel="noreferrer">Sujjal Bhusal <span aria-hidden="true">↗</span></a></span>
          <small>Made for you to learn the payment checkout</small>
        </div>
        <a className="footer-docs" href="https://docs.khalti.com/khalti-epayment/" target="_blank" rel="noreferrer">Khalti ePayment Docs <ArrowIcon /></a>
      </footer>
    </main>
  );
}
