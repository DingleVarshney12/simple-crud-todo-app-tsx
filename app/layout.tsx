import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientProvider from "@/components/sessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Todo App - Dingle Varshney",
  description:
    "Todo App is a simple yet powerful task management tool designed to help you stay organized and productive. Easily create, track, and manage your daily tasks with a clean and intuitive interface. Whether it’s personal errands, work projects, or long-term goals, Todo App keeps your priorities in check and your schedule on track.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
      >
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}
