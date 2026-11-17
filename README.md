# Khalti Lab

A small Next.js 14 project for learning Khalti's ePayment checkout flow. It uses Khalti's sandbox, two server-priced practice items, and server-side payment lookup after the browser returns.

## Run it locally

1. Install Node.js 20 or newer.
2. In this folder, install dependencies with `npm install`.
3. Copy `.env.example` to `.env.local` and add your sandbox **secret key** from [Khalti Sandbox](https://test-admin.khalti.com/).
4. Run `npm run dev` and open [http://localhost:3000](http://localhost:3000).
5. Choose an item. Use a Khalti sandbox account/credentials from the [official getting started guide](https://docs.khalti.com/getting-started/).

The practice items cost NPR 150 and NPR 250. Khalti expects amounts in paisa, so the server sends 15,000 and 25,000. The browser only sends a product ID; the server chooses the price.

## Follow the payment flow

1. `app/page.tsx` posts a product ID to `/api/checkout`.
2. `app/api/checkout/route.ts` validates the product, creates an order, and calls Khalti's sandbox `epayment/initiate` API using the private key.
3. Khalti returns a `payment_url` and `pidx`; the browser is redirected to the payment page.
4. Khalti redirects back to `/payment/result` with a `pidx`.
5. `app/payment/result/page.tsx` sends that value and the order ID to `/api/verify`.
6. `app/api/verify/route.ts` calls Khalti's `epayment/lookup` API and confirms the pidx, order ID, amount, status, and refund state before showing success.

The callback query string is not proof of payment. The server verifies with Khalti before displaying a successful result.

## Important learning limitation

To keep the project easy to run without a database, pending orders live in server memory (`lib/orders.ts`). Restarting the server clears them, and this is not safe for a real shop or multi-instance deployment. A production app should save orders in a database before redirecting, store unique pidx values, and mark a payment completed atomically after lookup. Keep the Khalti secret key server-only; never prefix it with `NEXT_PUBLIC_`.

## References

- [Khalti Web Checkout documentation](https://docs.khalti.com/khalti-epayment/)
- [Khalti Getting Started and sandbox credentials](https://docs.khalti.com/getting-started/)
- [Tutorial: eSewa and Khalti integration in Next.js](https://medium.com/@paudelronish/integrating-esewa-and-khalti-payment-gateways-in-next-js-14-with-server-actions-f15729ffae3e)

This project follows the tutorial's server-side initiation and verification pattern and uses Khalti's current Web Checkout API details. It intentionally leaves out eSewa.
