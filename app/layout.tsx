import "./globals.css";


export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html>
      <body className="min-h-screen bg-slate-950 text-slate-50">{children}</body>
    </html>
  );
}
