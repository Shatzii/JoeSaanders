import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Joe Sanders | Professional Golfer",
  description: "Official website of professional golfer Joe Sanders. Follow his journey, tournaments, and join the fan club.",
  keywords: "Joe Sanders, professional golf, PGA tour, golf tournaments, golfer",
  authors: [{ name: "Joe Sanders" }],
  creator: "Joe Sanders",
  openGraph: {
    title: "Joe Sanders | Professional Golfer",
    description: "Official website of professional golfer Joe Sanders",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Joe Sanders | Professional Golfer",
    description: "Official website of professional golfer Joe Sanders",
  },
  robots: "index, follow",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
