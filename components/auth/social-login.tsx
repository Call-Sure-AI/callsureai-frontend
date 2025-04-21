import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export const SocialLogin = ({ isSignup = false }) => {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

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
                router.push('/dashboard/profile-section');
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
            <p className="mb-4 text-sm lg:text-base">
                or {isSignup ? 'Sign Up' : 'login'} with Google
            </p>

            <div className="w-full flex justify-center">
                <div className="w-full">
                    <GoogleLogin
                        onSuccess={handleGoogleLogin}
                        onError={() => setError('Google login failed')}
                        useOneTap
                        width="100%"
                        shape="rectangular"
                        theme="outline"
                        size="large"
                        text={isSignup ? "signup_with" : "signin_with"}
                    />
                </div>
            </div>

            {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
        </div>
    );
};