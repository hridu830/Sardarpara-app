import './globals.css';

export const metadata = {
  title: 'সর্দারপাড়া আমলে সালেহ্ যুব সংঘ',
  description: 'সর্দারপাড়া আমলে সালেহ্ যুব সংঘের তহবিল ও সদস্য ব্যবস্থাপনা',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn">
      <body className="font-sans antialiased bg-background">
        {children}
      </body>
    </html>
  );
}
