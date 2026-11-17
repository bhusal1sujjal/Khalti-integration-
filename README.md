<p align="center">
  <img src="public/assets/logo.png" alt="KhaltiPayment logo" width="96" />
</p>

<h1 align="center">Khalti Payment Practice</h1>

<p align="center">
  A hands-on Next.js project for learning Khalti sandbox checkout and server-side payment verification.
</p>

<p align="center">
  <a href="https://khalti-integration.vercel.app/">Live preview</a>
  &nbsp;·&nbsp;
  <a href="https://docs.khalti.com/khalti-epayment/">Khalti ePayment docs</a>
  &nbsp;·&nbsp;
  <a href="https://github.com/bhusal1sujjal/Khalti-integration-">Source code</a>
</p>

---

## About

Khalti Payment Practice is a small learning shop built with the Next.js App Router. It lets you try two sample orders—NPR 150 for payment practice and NPR 500 for Mo:Mo and coffee—and follow what happens from checkout to server verification.

The app sends the selected product to its server, starts a payment with Khalti's test API, and checks the returned payment reference with Khalti before showing the result. It is for learning in test mode; it is not a production payment service.

## At a glance

| | |
|---|---|
| **Live demo** | [khalti-integration.vercel.app](https://khalti-integration.vercel.app/) |
| **Payment provider** | Khalti ePayment, test environment |
| **Framework** | Next.js App Router |
| **Language** | TypeScript |
| **Sample amounts** | NPR 150 and NPR 500 |
| **Maintainer** | [Sujjal Bhusal](https://sujjalbhusal.com.np)

## Features

- Starts a Khalti test checkout from a server route.
- Keeps product prices on the server and sends amounts in paisa.
- Verifies the returned payment reference with Khalti's lookup API.
- Shows completed, pending, and failed payment results.
- Includes responsive layouts and a small walkthrough of the payment flow.

## Project structure

```text
khalti-practice/
├── app/
│   ├── api/
│   │   ├── checkout/
│   │   │   └── route.ts              # Validates an item and starts Khalti checkout
│   │   └── verify/
│   │       └── route.ts              # Checks payment status with Khalti lookup
│   ├── payment/
│   │   └── result/
│   │       └── page.tsx              # Verifies the return and displays its result
│   ├── globals.css                   # Global styles and responsive layouts
│   ├── layout.tsx                    # Root HTML layout, metadata, and CSS import
│   ├── page.tsx                      # Home page, sample orders, and checkout UI
│   └── styles.d.ts                   # TypeScript declaration for CSS imports
├── lib/
│   └── orders.ts                     # Sample products and temporary order store
├── public/
│   └── assets/
│       └── logo.png                  # Logo shown in the navbar and this README
├── .env.example                      # Environment variable template
├── .env.local                         # Private local settings; never commit this
├── .gitignore                         # Files and folders Git should ignore
├── next.config.mjs                    # Next.js configuration
├── package.json                       # Project scripts and dependency list
├── package-lock.json                  # Locked npm dependency versions
├── postcss.config.mjs                 # PostCSS and Tailwind CSS configuration
└── tsconfig.json                      # TypeScript settings and @/* path alias
```

`.next/` and `node_modules/` are generated on your computer. They are ignored by Git and should not be committed.

## Technology and packages

| Package | Version in this project | Purpose |
|---|---:|---|
| `next` | `14.2.31` | App framework, pages, and API routes |
| `react` / `react-dom` | `18.3.1` | User interface |
| `typescript` | `^5.7.2` | Type checking and typed application code |
| `tailwindcss` | `^4.3.5` | Styling toolchain dependency |
| `@tailwindcss/postcss` | `^4.3.5` | Tailwind's PostCSS plugin |
| `postcss` | `^8.5.33` | CSS processing |
| `lucide-react` | `^0.468.0` | UI icons, including the GitHub brand icon used here |

The exact installed dependency versions are recorded in `package-lock.json`. Run `npm install` to install the packages from that lockfile.

## Getting started

### Requirements

- Node.js 20 or newer
- npm (included with Node.js)
- A Khalti test secret key from the [Khalti test portal](https://test-admin.khalti.com/)

### 1. Install dependencies

From the project folder, run:

```bash
npm install
```

### 2. Configure local environment variables

Copy `.env.example` to `.env.local`. For PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Open `.env.local` and set your sandbox key and the local address:

```dotenv
KHALTI_SECRET_KEY=your_test_secret_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3100
```

Keep the real secret key in `.env.local`. Never commit that file, share the key, or rename it with a `NEXT_PUBLIC_` prefix. Use the [Khalti getting started guide](https://docs.khalti.com/getting-started/) for current test account instructions.

### 3. Start the development server

```bash
npm run dev -- --port 3100
```

Open [http://localhost:3100](http://localhost:3100). If you use a different port, update `NEXT_PUBLIC_SITE_URL` and restart the app.

## Available commands

| Command | What it does |
|---|---|
| `npm run dev -- --port 3100` | Starts the local development server on port 3100 |
| `npm run build` | Creates a production build |
| `npm run start` | Serves the production build locally |

## Payment flow

| Step | What happens | Where to read the code |
|---|---|---|
| 1. Choose | The browser sends a product ID; it does not send a price. | `app/page.tsx` |
| 2. Initiate | The server reads the trusted price and requests a Khalti checkout URL. | `app/api/checkout/route.ts` and `lib/orders.ts` |
| 3. Pay | The customer continues to Khalti's hosted test checkout. | Khalti checkout page |
| 4. Return | Khalti redirects back to the app with payment details. | `app/payment/result/page.tsx` |
| 5. Verify | The server checks the payment reference, amount, and status with Khalti. | `app/api/verify/route.ts` |

The return URL alone is not proof of payment. The server-side lookup is what confirms the payment status.

## Learning limitations

- Orders are stored temporarily in server memory. They are cleared when the server restarts and are not shared across multiple instances.
- This demo is intended for sandbox learning. Do not use it to collect real customer payments.
- A production service needs persistent order storage, duplicate-request protection, secure deployment settings, and careful payment state handling.

## Links

- [Live preview](https://khalti-integration.vercel.app/)
- [Khalti ePayment documentation](https://docs.khalti.com/khalti-epayment/)
- [Khalti getting started guide](https://docs.khalti.com/getting-started/)
- [Khalti test portal](https://test-admin.khalti.com/)
- [GitHub repository](https://github.com/bhusal1sujjal/Khalti-integration-)
- [Sujjal Bhusal's portfolio](https://sujjalbhusal.com.np)

---

<p align="center">
  Built by <a href="https://sujjalbhusal.com.np">Sujjal Bhusal</a> · </br>
  <a href="https://github.com/bhusal1sujjal">GitHub: @bhusal1sujjal</a>
</p>
