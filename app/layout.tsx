import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { Cinzel_Decorative, Cormorant_Garamond, DM_Sans } from "next/font/google";

const cinzel = Cinzel_Decorative({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-cinzel",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const dm = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-dm",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nepal — Land of Gods & Mountains",
  description: "An immersive 3D bas-relief experience",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${cinzel.variable} ${cormorant.variable} ${dm.variable}`}
    >
      <body className="bg-[var(--bg)] text-[var(--ink)] antialiased cursor-none">
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
