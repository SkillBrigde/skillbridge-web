import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SkillBridge",
  description: "Nền tảng kết nối học viên và mentor phù hợp.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
