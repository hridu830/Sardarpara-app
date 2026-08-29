import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "সর্দারপাড়া আমলে সালেহ যুব সংঘ",
  description: "চাঁদা, ব্যয় ও কল্যাণমূলক কাজের স্বচ্ছ হিসাব",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Tiro+Bangla:ital@0;1&family=Hind+Siliguri:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Navbar />
        <main className="app">{children}</main>
      </body>
    </html>
  );
}
