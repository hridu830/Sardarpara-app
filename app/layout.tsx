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
        <header className="bg-[#006a4e] text-white p-4 shadow-md flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#006a4e] font-bold text-xl">
              S
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">সর্দারপাড়া আমলে সালেহ্ যুব সংঘ</h1>
              <p className="text-xs text-emerald-100">"একতার আলো জ্বলুক সর্বদা"</p>
            </div>
          </div>
          <nav className="flex gap-4 text-sm font-medium">
            <a href="#" className="hover:underline">হোম</a>
            <a href="#" className="hover:underline">সদস্য</a>
            <a href="#" className="hover:underline">হিসাব</a>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
