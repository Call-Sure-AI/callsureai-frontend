// components/auth/social-login.tsx
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

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

            // ✅ ADD: Debug logging
            console.log('🟢 Google Login Response:', data);
            console.log('🟢 User object:', data.user);
            console.log('🟢 Company ID:', data.user?.company_id || data.user?.companyId);

            // ✅ ADD: Validate company_id exists
            if (!data.user?.company_id && !data.user?.companyId) {
                console.error('❌ No company_id in user object!', data.user);
                toast({
                    title: 'Setup Required',
                    description: 'Please complete your profile setup',
                });
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

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
            className="flex flex-col items-center justify-center text-center w-full"
        >
            <div className="w-full flex justify-center px-4">
                {isLoading ? (
                    <div className="flex items-center justify-center py-3 px-4 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800/50">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cyan-600 mr-2"></div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Signing in...</span>
                    </div>
                ) : (
                    <div className="w-full max-w-sm">
                        {/* Custom Google Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                // Trigger the hidden Google button
                                const googleBtn = document.querySelector('[aria-labelledby]') as HTMLElement;
                                if (googleBtn) {
                                    googleBtn.click();
                                }
                            }}
                            className="relative w-full group"
                        >
                            {/* Button glow */}
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
                            
                            <div className="relative w-full bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-500 rounded-xl py-3 px-4 flex items-center justify-center gap-3 transition-all shadow-sm hover:shadow-md">
                                {/* Google Icon */}
                                <svg width="20" height="20" viewBox="0 0 48 48">
                                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                                    <path fill="none" d="M0 0h48v48H0z"/>
                                </svg>
                                
                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                                    {isSignup ? 'Sign up with Google' : 'Sign in with Google'}
                                </span>
                            </div>
                        </motion.button>

                        {/* Hidden Google Login (for functionality) */}
                        <div className="hidden">
                            <GoogleLogin
                                onSuccess={handleGoogleLogin}
                                onError={handleGoogleError}
                                useOneTap={true}
                                width={buttonWidth}
                                shape="rectangular"
                                theme="outline"
                                size="large"
                                text={isSignup ? "signup_with" : "signin_with"}
                                auto_select={false}
                                cancel_on_tap_outside={true}
                                itp_support={true}
                                use_fedcm_for_prompt={true}
                            />
                        </div>
                    </div>
                )}
            </div>

            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-xs sm:text-sm mt-2 px-2"
                >
                    {error}
                </motion.p>
            )}
        </div>
    );
};