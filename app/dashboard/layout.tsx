import Sidebar from "@/components/sidebar";

export default function DashboardLayout({
    children,
}: { children: React.ReactNode }) {

    return (
        <div className="min-h-screen">
            <Sidebar />
            {children}
        </div>
    );
}