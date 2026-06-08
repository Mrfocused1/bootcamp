import type { Metadata } from "next";
import { Baloo_2, DM_Sans, Epilogue, Lora } from "next/font/google";
import "./globals.css";

// Chunky, rounded "chewy" display face for the brand wordmark.
const baloo = Baloo_2({
  variable: "--font-chewy",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const epilogue = Epilogue({
  variable: "--font-epilogue",
  subsets: ["latin"],
  display: "swap",
});

// Serif used (italic) for emphasis lines, matching the original's "from … to …".
const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bridgeway AI Bootcamp — Learn to build websites with AI in 5 days",
  description:
    "A 5-day live course teaching founders, entrepreneurs, teams and organisations (including charities) to build, refresh and launch real websites with AI — databases, payments, hosting and more. Train yourself or your tech team to ship in-house. No coding experience needed.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${epilogue.variable} ${lora.variable} ${baloo.variable} h-full`}
      style={{ fontFamily: "var(--font-dm-sans), DM Sans, sans-serif" }}
    >
      <body className="ua-body flex flex-col min-h-full">
        <noscript>
          <style>{`.ua-reveal{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
