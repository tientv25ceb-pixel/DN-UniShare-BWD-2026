import type { Metadata } from "next";
import { Outfit, Fraunces } from "next/font/google";
import SessionProvider from "@/components/auth/session-provider";
import SessionSync from "@/components/auth/session-sync";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin", "latin-ext"],
  variable: "--dn-font-primary",
  weight: ["300", "400", "500", "600", "700"],
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--dn-font-display",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "ĐN-UniShare | Chia sẻ đồ dùng sinh viên Đà Nẵng",
    template: "%s | ĐN-UniShare",
  },
  description: "Nền tảng chia sẻ đồ dùng, sách vở cho sinh viên tại Làng Đại học Đà Nẵng. Trao đi những gì bạn không cần, nhận lại những gì bạn cần.",
  openGraph: {
    title: "ĐN-UniShare | Chia sẻ đồ dùng sinh viên Đà Nẵng",
    description: "Nền tảng chia sẻ đồ dùng, sách vở cho sinh viên tại Làng Đại học Đà Nẵng.",
    type: "website",
    locale: "vi_VN",
    siteName: "ĐN-UniShare",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${outfit.variable} ${fraunces.variable} antialiased relative`}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-[var(--dn-accent)] focus:text-[#0a0a0b] focus:rounded-full focus:text-sm focus:font-bold focus:outline-none">
          Chuyển đến nội dung chính
        </a>
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[var(--dn-surface)]">
          {/* Drifting, pulsing mesh gradient blobs */}
          <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-[var(--dn-accent)]/8 blur-[120px] animate-blob-1" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-[var(--dn-accent-dim)]/8 blur-[100px] animate-blob-2" />
          <div className="absolute top-1/3 left-1/3 w-[800px] h-[800px] rounded-full bg-[var(--dn-accent)]/4 blur-[160px] animate-blob-3" />
          
          {/* Blueprint line grid with radial gradient fade mask */}
          <div className="absolute inset-0 dn-bg-grid-lines opacity-40" />

          {/* Micro-grain film noise overlay */}
          <div className="absolute inset-0 dn-bg-noise" />
        </div>
        <div className="relative z-10" id="main-content">
          <SessionProvider>
            <SessionSync />
            {children}
          </SessionProvider>
        </div>
      </body>
    </html>
  );
}
