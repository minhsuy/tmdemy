import type { Metadata } from "next";
import "./globals.css";
import { manrope } from "@/utils";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/common/ThemeProvider";
import { ToastContainer, toast } from "react-toastify";
import { SpeedInsights } from "@vercel/speed-insights/next";
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
        <body className={manrope.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <SpeedInsights />
            <ToastContainer />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
