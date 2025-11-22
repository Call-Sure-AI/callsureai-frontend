// components\auth\social-login.tsx
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { toast } from "@/hooks/use-toast";

export const SocialLogin = ({ isSignup = false }) => {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [buttonWidth, setButtonWidth] = useState(320);
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Calculate button width based on container size
    const calculateButtonWidth = (containerWidth: number) => {
        if (containerWidth === 0) return 320;
        const availableWidth = containerWidth - 32;
        
        let calculatedWidth;
        if (availableWidth < 200) {
            calculatedWidth = Math.max(180, availableWidth);
        } else if (availableWidth < 250) {
            calculatedWidth = 200;
        } else if (availableWidth < 300) {
            calculatedWidth = 240;
        } else if (availableWidth < 350) {
            calculatedWidth = 280;
        } else if (availableWidth < 400) {
            calculatedWidth = 320;
        } else {
            calculatedWidth = Math.min(350, availableWidth * 0.85);
        }
        
        return Math.round(calculatedWidth);
    };

    // Observe container size changes
    useEffect(() => {
        const updateButtonWidth = () => {
            if (containerRef.current) {
                const width = containerRef.current.offsetWidth;
                const newButtonWidth = calculateButtonWidth(width);
                setButtonWidth(newButtonWidth);
            }
        };

        updateButtonWidth();

        const resizeObserver = new ResizeObserver(() => {
            updateButtonWidth();
        });

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    const handleGoogleLogin = async (response: CredentialResponse) => {
        if (!response.credential) {
            setError('No credential received from Google');
            toast({
                title: "Error",
                description: "No credential received from Google",
                variant: "destructive"
            });
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const { data } = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`, 
                {
                    idToken: response.credential,
                }
            );

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // ✅ Verify it was written
            console.log('🟡 Saved to localStorage (Google):', {
                token: localStorage.getItem('token'),
                user: localStorage.getItem('user')
            });

            console.log('🟡 Dispatching auth-change event (Google)');
            window.dispatchEvent(new Event('auth-change'));

            toast({
                title: "Success",
                description: "Successfully logged in with Google",
            });

            // Wait for React to process state updates
            setTimeout(() => {
                if (data.newUser) {
                    router.push('/profile-section');
                } else {
                    router.push('/dashboard');
                }
            }, 100);
        } catch (error: any) {
            console.error('Google login error:', error);
            
            let errorMessage = 'Failed to login with Google';
            if (error.code === 'ERR_NETWORK') {
                errorMessage = 'Network error. Please check your connection.';
            } else if (error.response?.status === 401) {
                errorMessage = 'Authentication failed. Please try again.';
            } else if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            }
            
            setError(errorMessage);
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleError = () => {
        setError('Google authentication failed. Please try again.');
        toast({
            title: "Authentication Error",
            description: "Google sign-in failed. Please try again.",
            variant: "destructive"
        });
    };

    return (
        <div 
            ref={containerRef}
            className="flex flex-col items-center justify-center text-center text-gray-500 mt-6 w-full"
        >
            <p className="mb-3 sm:mb-4 text-xs sm:text-sm md:text-base lg:text-base px-2">
                or {isSignup ? 'Sign Up' : 'login'} with Google
            </p>

            <div className="w-full flex justify-center px-4">
                {isLoading ? (
                    <div className="flex items-center justify-center py-3 px-4 border border-gray-300 rounded-md bg-gray-50">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
                        <span className="text-sm text-gray-600">Signing in...</span>
                    </div>
                ) : (
                    <GoogleLogin
                        onSuccess={handleGoogleLogin}
                        onError={handleGoogleError}
                        useOneTap={true} // ✅ Enable One Tap (works despite 403 errors)
                        width={buttonWidth}
                        shape="rectangular"
                        theme="outline"
                        size="large"
                        text={isSignup ? "signup_with" : "signin_with"}
                        auto_select={false}
                        cancel_on_tap_outside={true}
                        itp_support={true}
                        use_fedcm_for_prompt={true} // ✅ Enable FedCM (works despite 403 errors)
                    />
                )}
            </div>

            {error && (
                <p className="text-red-500 text-xs sm:text-sm mt-2 px-2">{error}</p>
            )}
        </div>
    );
};