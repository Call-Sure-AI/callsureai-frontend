import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { toast } from "@/hooks/use-toast";

export const SocialLogin = ({ isSignup = false }) => {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [buttonWidth, setButtonWidth] = useState(320);
    const [fedcmSupported, setFedcmSupported] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Check FedCM support on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const supported = 'IdentityCredential' in window;
            setFedcmSupported(supported);
        }
    }, []);

    // Calculate button width based on actual container size
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
                },
                {
                    withCredentials: true,
                    timeout: 30000,
                }
            );

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            window.dispatchEvent(new Event('storage'));

            toast({
                title: "Success",
                description: "Successfully logged in with Google",
            });

            if (data.newUser) {
                router.push('/profile-section');
                return;
            }
            router.push('/dashboard');
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

    const handleGoogleError = (error?: any) => {
        console.error('Google authentication error:', error);
        
        let errorMessage = 'Google authentication failed';
        
        if (error?.error === 'popup_closed_by_user') {
            errorMessage = 'Sign-in was cancelled. Please try again.';
        } else if (error?.error === 'access_denied') {
            errorMessage = 'Access denied. Please try again.';
        } else if (error?.type === 'popup_blocked') {
            errorMessage = 'Popup was blocked. Please allow popups and try again.';
        } else {
            errorMessage = 'Google authentication failed. Please check your connection and try again.';
        }
        
        setError(errorMessage);
        toast({
            title: "Authentication Error",
            description: errorMessage,
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
                        useOneTap={true} // ✅ Enable One Tap for better UX
                        width={buttonWidth}
                        shape="rectangular"
                        theme="outline"
                        size="large"
                        text={isSignup ? "signup_with" : "signin_with"}
                        auto_select={false} // Keep user control
                        cancel_on_tap_outside={true}
                        itp_support={true} // ✅ Safari Intelligent Tracking Prevention support
                        use_fedcm_for_prompt={fedcmSupported} // ✅ Use FedCM when available
                    />
                )}
            </div>

            {error && (
                <p className="text-red-500 text-xs sm:text-sm mt-2 px-2">{error}</p>
            )}

            {/* Help text for users experiencing issues */}
            {error && error.includes('authentication failed') && (
                <div className="mt-2 text-xs text-gray-500 max-w-md text-center">
                    <p>If you're having trouble, try:</p>
                    <ul className="list-disc list-inside mt-1 text-left">
                        <li>Disable popup blockers</li>
                        <li>Enable third-party cookies</li>
                        <li>Try in incognito mode</li>
                    </ul>
                </div>
            )}
        </div>
    );
};