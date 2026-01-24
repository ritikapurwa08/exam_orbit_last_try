import type { Metadata, Viewport } from "next";
import { Lexend, Kalam } from "next/font/google";
import "./globals.css";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { Navbar } from "@/components/ui/navbar";

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
const kalam = Kalam({
  subsets: ["latin"],
  variable: "--font-kalam",
  weight: ["300", "400", "700"],
});

export const metadata: Metadata = {
  title: "Exam Orbit",
  description: "Exam Oriented Pyqs and history to rote them ",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${lexend.variable}  font-lexend  antialiased`}>
          <ConvexClientProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <Navbar />
              {children}
              <Toaster />
            </ThemeProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
