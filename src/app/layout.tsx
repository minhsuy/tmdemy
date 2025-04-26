import type { Metadata } from "next";
import "./globals.css";
import { manrope } from "@/utils";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "TMdemy",
  description: "Nền tảng học tập trực tuyến",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={manrope.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
