import "./globals.css";
import AuthProvider from "./provider/authProvider";


export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html>
      <body className="min-h-screen bg-slate-950 text-slate-50">
        <AuthProvider>{children}</AuthProvider></body>
    </html>
  );
}
