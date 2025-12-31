import type { Metadata } from "next";
import { Zen_Maru_Gothic } from "next/font/google";
import "./globals.css";

const zenMaru = Zen_Maru_Gothic({
  weight: ['400', '500', '700'],
  subsets: ["latin"],
  variable: "--font-zen-maru",
});

export const metadata: Metadata = {
  title: "森の日々 診断",
  description: "あなたの疲れタイプを診断して、最適なスパメニューをご提案します。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${zenMaru.variable}`}>
        {children}
      </body>
    </html>
  );
}
