import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export const SocialLogin = ({ isSignup = false }) => {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

        // Get responsive width based on current screen size
    const getResponsiveWidth = () => {
        if (typeof window === 'undefined') return 320; // SSR fallback
        
        const width = window.innerWidth;
        
        // More granular breakpoints
        if (width < 360) return 240;      // Very small phones
        if (width < 400) return 260;      // Small phones  
        if (width < 480) return 280;      // Medium phones
        if (width < 640) return 300;      // Large phones (sm)
        if (width < 768) return 320;      // Small tablets (md)
        if (width < 1024) return 340;     // Tablets (lg)
        if (width < 1280) return 360;     // Small desktop (xl)
        return 400;                       // Large desktop (2xl+)
    };

    const handleGoogleLogin = async (response: CredentialResponse) => {
        try {
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`, {
                idToken: response.credential,
            },
                {
                    withCredentials: true
                });

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            window.dispatchEvent(new Event('storage'));

            if (data.newUser) {
                router.push('/profile-section');
                return;
            }
            router.push('/dashboard');
        } catch (error) {
            console.error('Google login error:', error);
            toast({
                title: "Error",
                description: "Failed to login with Google",
                variant: "destructive"
            });
        }
    };

    return (
        <div className="flex flex-col items-center justify-center text-center text-gray-500 mt-6 w-full">
            {/* Responsive text sizing */}
            <p className="mb-3 sm:mb-4 text-xs sm:text-sm md:text-base lg:text-base px-2">
                or {isSignup ? 'Sign Up' : 'login'} with Google
            </p>

            {/* Responsive padding and container */}
            <div className="w-full flex justify-center px-2 sm:px-4 md:px-6 lg:px-8">
                <div className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[380px] xl:max-w-[400px]">
                    <GoogleLogin
                        onSuccess={handleGoogleLogin}
                        onError={() => setError('Google login failed')}
                        useOneTap
                        width={getResponsiveWidth()}
                        shape="rectangular"
                        theme="outline"
                        size="large"
                        text={isSignup ? "signup_with" : "signin_with"}
                    />
                </div>
            </div>
            {/* Responsive error text */}
            {error && (
                <p className="text-red-500 text-xs sm:text-sm mt-2 px-2">{error}</p>
            )}
        </div>
    );
};