import type { Metadata } from "next";
import { Inter, Tomorrow, Bruno_Ace_SC } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../contexts/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const tomorrow = Tomorrow({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-tomorrow',
});

const brunoAceSC = Bruno_Ace_SC({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-bruno-ace',
});

export const metadata: Metadata = {
  title: "Voxa - Real-time Messaging for Professionals",
  description: "A real-time messaging web application for businesses, digital marketers, and content creators.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${tomorrow.variable} ${brunoAceSC.variable} antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
