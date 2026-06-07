import type { Metadata } from "next";
import { DM_Sans, Epilogue } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Urban AI — Build, launch & grow with AI",
  description:
    "A 5-day intensive that teaches you to build and ship real products with AI tools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${epilogue.variable} h-full`}
      style={{ fontFamily: "var(--font-dm-sans), DM Sans, sans-serif" }}
    >
      <body className="ua-body flex flex-col min-h-full">
        {children}
      </body>
    </html>
  );
}
