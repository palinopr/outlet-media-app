import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://outlet-media-app-production.up.railway.app"),
  title: {
    default: "Outlet Media",
    template: "%s | Outlet Media",
  },
  description: "Autonomous ad agency platform for music promoters",
  openGraph: {
    type: "website",
    siteName: "Outlet Media",
    title: "Outlet Media",
    description: "Autonomous ad agency platform for music promoters",
    images: [{ url: "/icon.png", width: 512, height: 512 }],
  },
  twitter: {
    card: "summary",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  const content = (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Toaster theme="dark" richColors />
        {children}
      </body>
    </html>
  );

  // Skip ClerkProvider at build time if no key is configured
  if (!publishableKey) {
    return content;
  }

  return <ClerkProvider publishableKey={publishableKey}>{content}</ClerkProvider>;
}
