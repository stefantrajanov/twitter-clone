import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import {Toaster} from "sonner";

export const metadata: Metadata = {
  title: "Twitter Clone",
  description: "Twitter clone app made by Stefan Trajanov",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
    <head />
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
        </ThemeProvider>
        <Toaster
          theme="system"
          className="border-primary-foreground rounded-md p-4 shadow-lg"
          position="top-right"
        />
      </body>
    </html>
  );
}
