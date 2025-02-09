import ActivityFeed from "@/components/dashboard/activity-bar";
import Navbar from "@/components/dashboard/navbar";
import Sidebar from "@/components/dashboard/sidebar";

export default function AgentLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <div className="min-h-screen relative flex">
                <Sidebar />
                {children}
                <ActivityFeed />
            </div>
        </>
    );
}