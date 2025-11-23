// app\auth\layout.tsx
import { ModernNavbar } from "@/components/modern/modern-navbar";
import { ModernFooter } from "@/components/modern/modern-footer";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen">
            <ModernNavbar />
            <main className="flex-1">
                {children}
            </main>
            <ModernFooter />
        </div>
    );
}