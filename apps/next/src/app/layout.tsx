import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "かるた道場",
  description: "百人一首を、決まり字から覚える学習アプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
