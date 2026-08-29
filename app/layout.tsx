import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "সর্দারপাড়া আমলে সালেহ যুব সংঘ",
  description: "চাঁদা, ব্যয়, নামাজ ও ইবাদতের স্বচ্ছ হিসাব",
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
      <body>{children}</body>
    </html>
  );
}
