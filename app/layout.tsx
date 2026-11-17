import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KhaltiPayment — Learn Payment Checkout",
  description: "Practice the Khalti ePayment checkout and verification flow in a friendly sandbox shop.",
  applicationName: "KhaltiPayment",
  authors: [{ name: "Sujjal Bhusal", url: "https://sujjalbhusal.com.np" }],
  openGraph: {
    title: "KhaltiPayment — Learn Payment Checkout",
    description: "A hands-on Khalti sandbox payment practice project.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#faf9f8",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
