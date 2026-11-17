import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Khalti Lab — Payment Practice", description: "A friendly sandbox for learning Khalti ePayment integration." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
