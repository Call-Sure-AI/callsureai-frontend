import Navbar from "@/components/navbar";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen text-black">
            <Navbar />
            <div className="flex-1">
                {children}
            </div>
        </div>
    );
}