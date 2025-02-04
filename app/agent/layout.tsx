import Sidebar from "@/components/dashboard/sidebar";

export default function AgentLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen text-black">
            <Sidebar />
            <div className="ml-16 flex-1 p-8">
                {children}
            </div>
        </div>
    );
}