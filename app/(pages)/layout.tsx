// app\(pages)\layout.tsx
import { ModernNavbar } from "@/components/modern/modern-navbar";
import { ModernFooter } from "@/components/modern/modern-footer";

export default function PagesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <ModernNavbar />
            <main className="pt-20">
                {children}
            </main>
            <ModernFooter />
        </>
    );
}