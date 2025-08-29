import type { Metadata } from "next";
import WalletProvider from "@/wallet/provider";
import { Inter, Playfair_Display } from 'next/font/google';

import "./globals.css";
import ReduxProvider from "@/store";
import { headers } from "next/headers";

// Initialize Inter font for body text (similar to GT America)
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700'],
});

// Initialize Playfair Display font for headings
const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: "dApp Wallet - Secure Blockchain Authentication",
  description: "Connect your wallet securely and explore the future of decentralized applications with our elegant dApp platform.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
  
}>) {
  const headersList = await headers();
  const cookieHeader = headersList.get("cookie");
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className={`${inter.className} antialiased`}>
        <ReduxProvider>
          <WalletProvider cookies={cookieHeader}>
            {children}
          </WalletProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
