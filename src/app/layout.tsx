import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Lora } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StoreBootstrap } from "@/components/store-bootstrap";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const editorial = Lora({
  subsets: ["latin", "vietnamese"],
  weight: "400",
  style: "italic",
  variable: "--font-editorial",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SkillBridge — Đi xa hơn, cùng người đã đi qua",
    template: "%s | SkillBridge",
  },
  description:
    "Kết nối kinh nghiệm, mở lối tiến xa. Khám phá mentoring 1:1 cho kỹ năng công nghệ, sự nghiệp và những bước tiến tiếp theo của bạn.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${editorial.variable} min-h-screen font-sans antialiased flex flex-col`}
      >
        <StoreBootstrap />
<<<<<<< HEAD
=======
        <a className="sb-skip-link" href="#main-content">
          Đến nội dung chính
        </a>
>>>>>>> 61e2e93070d5da971e2d688117daa9ff6f0b57da
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
