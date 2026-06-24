import type { Metadata } from "next";
import { Outfit, JetBrains_Mono, Noto_Sans_Thai } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-thai",
  subsets: ["thai"],
});

export const metadata: Metadata = {
  title: "Smart Signage Line-LIFF — Portfolio Demo",
  description:
    "แพลตฟอร์มสถิติ Smart Signage (Line-LIFF) — Portfolio demo ใช้ข้อมูลจำลองทั้งหมด",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${outfit.variable} ${jetbrainsMono.variable} ${notoSansThai.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
