import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col text-black">
            <Navbar />
            <div>
                {children}
            </div>
            <Footer />
        </div>
    );
}