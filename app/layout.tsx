import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google"; // Commented out Geist fonts
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

/* // Commented out Geist font variables
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
*/

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: "Social Garden AI Efficiency Scorecard",
  description: "Assess your organization's AI maturity and get personalized recommendations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Removed Geist variables from html className
    <html lang="en" className={`${plusJakartaSans.variable}`}>
      <head>
        <link rel="icon" href="/favicon.svg" />
      </head>
      <body className="font-plus-jakarta bg-sg-light-mint min-h-screen">
        {children}
      </body>
    </html>
  );
}
