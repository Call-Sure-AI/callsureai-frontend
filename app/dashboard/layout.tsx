import { ProtectedRoute } from "@/components/protected-route";
import Sidebar from "@/components/sidebar";

export default function DashboardLayout({
    children,
}: { children: React.ReactNode }) {

    return (
        <ProtectedRoute>
            <div className="min-h-screen">
                <Sidebar />
                {children}
            </div>
        </ProtectedRoute>
    );
}