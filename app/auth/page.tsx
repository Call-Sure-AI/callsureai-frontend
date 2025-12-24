// app/auth/page.tsx
export const dynamic = 'force-dynamic';

import AuthForm from "@/components/auth/form";

const AuthPage = () => {
    return (
        <AuthForm />
    )
};

export default AuthPage;