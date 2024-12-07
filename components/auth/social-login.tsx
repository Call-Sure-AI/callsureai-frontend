import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const SocialLogin = ({ isSignup = false }) => {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleGoogleLogin = async (response: CredentialResponse) => {
        try {
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`, {
                idToken: response.credential,
            });
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            router.push('/dashboard')

        } catch (error) {
            console.error('Google login error:', error);
            alert('Failed to login with Google');
        }
    };

    return (
        <div className="text-center text-gray-500 mt-6">
            <p className="mb-4 text-sm lg:text-base">
                or {isSignup ? 'Sign Up' : 'login'} with Google
            </p>

            <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => setError('Google login failed')}
                useOneTap
            />

            {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
        </div>
    );
};