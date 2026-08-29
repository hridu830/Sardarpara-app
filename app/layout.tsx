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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased bg-background">
        {children}
      </body>
    </html>
  );
}
