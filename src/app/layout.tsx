import Footer from "@/components/footer/page";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";
import { Geist, Geist_Mono } from "next/font/google";
import { auth } from "~/auth";
import "./globals.css";
import "./custom.css";
import "./responsive.css";
import WhatsApp from "@/components/whatsApp/WhatsApp";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider session={session}>
          {children}
          <WhatsApp />
          <div>
            <Footer />
          </div>
          <Toaster richColors />
        </SessionProvider>
      </body>
    </html>
  );
}
