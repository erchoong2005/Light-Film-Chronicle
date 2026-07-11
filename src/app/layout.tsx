import type { Metadata } from "next";
import { Noto_Sans_SC, Noto_Serif_SC } from "next/font/google";
import "./globals.css";

const notoSansSC = Noto_Sans_SC({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
});

const notoSerifSC = Noto_Serif_SC({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
});

export const metadata: Metadata = {
  title: "光影纪年·中国电影发展史研学平台",
  description: "沉浸式互动闯关项目，以中国电影7大发展时代为时间脉络，选取34部极具时代代表性的经典影片。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className="h-full">
      <body className={`h-full gold-dust film-grain ${notoSansSC.variable} ${notoSerifSC.variable}`}>
        {children}
      </body>
    </html>
  );
}
