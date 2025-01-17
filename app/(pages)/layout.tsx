import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            <Navbar />
            {children}
            <Footer />
        </div>
    );
}