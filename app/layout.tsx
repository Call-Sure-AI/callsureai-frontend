import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Script from "next/script";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "@/components/ui/toaster";
import { AppProviders } from '@/providers/app-providers';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
  throw new Error('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not defined');
}

if (!process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS) {
  throw new Error('NEXT_PUBLIC_GOOGLE_ANALYTICS is not defined');
}

export const metadata: Metadata = {
  title: "Callsure.ai",
  description: "Callsure.ai is a platform that allows you to create and manage your own AI-powered chatbots.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string;
  const googleAnalyticsId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS as string;

  return (
    <html lang="en">
      <head>
        {/* Adding Google Sign-In client script */}
        <Script 
          src="https://accounts.google.com/gsi/client" 
          strategy="beforeInteractive"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppProviders>
          <GoogleOAuthProvider
            clientId={googleClientId}
          >
            {children}
            <Toaster />
          </GoogleOAuthProvider>
        </AppProviders>
        {/* Google Analytics scripts inside body */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${googleAnalyticsId}');
          `}
        </Script>
      </body>
    </html>
  );
}