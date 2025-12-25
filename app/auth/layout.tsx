// app\auth\layout.tsx
"use client";

import { GoogleOAuthProvider } from '@react-oauth/google';
import { ModernNavbar } from "@/components/modern/modern-navbar";
import { ModernFooter } from "@/components/modern/modern-footer";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

    return (
        <GoogleOAuthProvider clientId={googleClientId}>
            <div className="flex flex-col min-h-screen">
                <ModernNavbar />
                <main className="flex-1">
                    {children}
                </main>
                <ModernFooter />
            </div>
        </GoogleOAuthProvider>
    );
}