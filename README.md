<p align="center">
  <img src="public/assets/logo.png" alt="KhaltiPayment logo" width="120" />
</p>


This is a learning project for practicing Khalti's ePayment flow with a Next.js App Router app. It offers two sample checkouts: a small NPR 150 practice order and a NPR 500 Mo:Mo and coffee order.

The project sends the selected product to the server, starts a payment with Khalti's test API, returns to the app, and checks the result with Khalti before showing a successful payment. It is intended for sandbox practice and learning. It is not a production shop.

## Project structure

```text
khalti-practice/
├── app/
│   ├── api/
│   │   ├── checkout/
│   │   │   └── route.ts              # Creates the order and starts Khalti checkout
│   │   └── verify/
│   │       └── route.ts              # Verifies the payment with Khalti's lookup API
│   ├── payment/
│   │   └── result/
│   │       └── page.tsx              # Reads Khalti's return details and displays the result
│   ├── globals.css                   # Global styles and responsive page layout
│   ├── layout.tsx                    # Root layout, page metadata, and global CSS import
│   ├── page.tsx                      # Home page, sample orders, and checkout buttons
│   └── styles.d.ts                   # TypeScript declaration for CSS side-effect imports
├── lib/
│   └── orders.ts                     # Sample products and temporary in-memory order store
├── public/
│   └── assets/
│       └── logo.png                  # Navbar logo served at /assets/logo.png
├── .env.example                      # Safe template for required environment variables
├── .env.local                         # Your private local keys; do not commit this file
├── .gitignore                         # Files Git should leave out of the repository
├── next.config.mjs                    # Next.js configuration
├── package.json                       # Project scripts and dependencies
├── package-lock.json                  # Exact dependency versions installed by npm
├── postcss.config.mjs                 # PostCSS configuration used by Tailwind CSS
└── tsconfig.json                      # TypeScript settings and the @/* import alias
```

`.next/` and `node_modules/` are generated locally when you run the app and install dependencies. They should not be committed to Git.

## Run it locally

### 1. Install Node.js

Install a current LTS version of [Node.js](https://nodejs.org/). npm is included with Node.js.

### 2. Install the project packages

From the project folder, run:

```bash
npm install
npm install lucide-react@0.468.0
```

This project uses Lucide icons. Version `0.468.0` includes the GitHub brand icon used in the navbar.

### 3. Add your Khalti sandbox key

Copy `.env.example` to `.env.local` and fill in your Khalti test secret key:

```dotenv
KHALTI_SECRET_KEY=your_test_secret_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3100
```

Get test credentials from [Khalti's test portal](https://test-admin.khalti.com/) and follow the [Khalti getting started guide](https://docs.khalti.com/getting-started/). Keep the real value of `KHALTI_SECRET_KEY` private. Do not add `NEXT_PUBLIC_` to that variable name or commit `.env.local`.

### 4. Start the app

```bash
npm run dev -- --port 3100
```

Open [http://localhost:3100](http://localhost:3100). If you choose another port, update `NEXT_PUBLIC_SITE_URL` in `.env.local` to use that port, then restart the dev server.

## How the payment flow works

1. Select a sample order on the home page. The browser sends only its product ID to `POST /api/checkout`.
2. `app/api/checkout/route.ts` looks up the price on the server and calls Khalti's `epayment/initiate` endpoint with the private key. Khalti responds with a payment URL and a `pidx`.
3. The browser redirects to Khalti's hosted test checkout. Complete or cancel the test payment there.
4. Khalti returns the browser to `/payment/result` with payment details.
5. `app/payment/result/page.tsx` sends the returned `pidx` and the local order ID to `POST /api/verify`.
6. `app/api/verify/route.ts` calls Khalti's `epayment/lookup` endpoint. The app checks the payment reference, amount, and status before showing a completed result.

A return URL by itself does not prove that a payment succeeded. The server-side lookup is the confirmation step.

## Learning notes and limitations

- Prices are defined on the server in `lib/orders.ts` and converted to paisa for Khalti (NPR 150 is 15,000 paisa; NPR 500 is 50,000 paisa). The browser cannot choose the amount.
- Orders are stored in memory for this practice app. They disappear when the server restarts and are not shared across multiple app instances.
- A real payment service needs a persistent database, durable order records, idempotent payment processing, and production credentials and deployment settings.
- Use Khalti's test environment while learning. Do not use this demo to collect real customer payments.

## Useful links

- [Live preview](https://khalti-integration.vercel.app/)
- [Khalti ePayment documentation](https://docs.khalti.com/khalti-epayment/)
- [Khalti getting started and test credentials](https://docs.khalti.com/getting-started/)
- [Khalti test portal](https://test-admin.khalti.com/)
- [GitHub repository](https://github.com/bhusal1sujjal/Khalti-integration-)

## Built by

**Sujjal Bhusal** · [Portfolio](https://sujjalbhusal.com.np) · [GitHub: @bhusal1sujjal](https://github.com/bhusal1sujjal)
