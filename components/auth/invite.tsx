"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Loader2, Building2, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

function InviteContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');

    const [isLoading, setIsLoading] = useState(true);
    const [invitation, setInvitation] = useState(null);
    const [error, setError] = useState(null);
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (!token) return;

        const validateToken = async () => {
            try {
                const { data } = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/invitations/validate/${token}`,
                    {
                        withCredentials: true,
                    }
                );
                setInvitation(data.invitation);
            } catch (err) {
                console.error('Error validating invitation:', err);
                setError((err as any).response?.data?.error || 'Invalid invitation');
            } finally {
                setIsLoading(false);
            }
        };

        validateToken();
    }, [token]);

    const handleAcceptInvitation = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { data } = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/invitations/accept/${token}`,
                { name, password }
            );

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            toast({
                title: "Success!",
                description: "You've joined the company successfully.",
            });

            router.push('/dashboard');
        } catch (err) {
            console.error('Error accepting invitation:', err);
            toast({
                title: "Error",
                description: (err as any).response?.data?.error || "Failed to accept invitation",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-black dark:via-slate-950 dark:to-black">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                    <Loader2 className="h-8 w-8 text-cyan-600" />
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-black dark:via-slate-950 dark:to-black p-4 pt-24 pb-16 overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative w-full max-w-md"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-3xl blur-xl" />
                    
                    <Card className="relative bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200/50 dark:border-slate-800/50">
                        <CardHeader>
                            <CardTitle className="text-red-500 text-center">Invalid Invitation</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-center text-gray-600 dark:text-gray-400 mb-4">{error}</p>
                            <Button
                                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90"
                                onClick={() => router.push('/')}
                            >
                                Return to Home
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-black dark:via-slate-950 dark:to-black p-4 pt-24 pb-16 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 dark:bg-cyan-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/5 rounded-full blur-3xl" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative w-full max-w-md"
            >
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-cyan-500/20 rounded-3xl blur-xl" />
                
                <Card className="relative bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200/50 dark:border-slate-800/50">
                    <CardHeader className="text-center pb-4">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", duration: 0.6 }}
                            className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-4"
                        >
                            <UserPlus className="w-8 h-8 text-white" />
                        </motion.div>
                        <CardTitle className="text-2xl bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
                            Accept Invitation
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {invitation && (
                            <>
                                <div className="bg-cyan-50 dark:bg-cyan-900/20 border-l-4 border-cyan-500 p-4 rounded-r mb-6">
                                    <div className="flex items-start gap-3">
                                        <Building2 className="w-5 h-5 text-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-gray-900 dark:text-white font-medium mb-1">
                                                You&apos;ve been invited to join
                                            </p>
                                            <p className="text-cyan-600 dark:text-cyan-400 font-bold text-lg">
                                                {(invitation as any).company.name}
                                            </p>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                                                Role: <span className="font-semibold">{(invitation as any).role}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <form onSubmit={handleAcceptInvitation} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                            Your Name
                                        </label>
                                        <Input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            className="bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 focus:border-cyan-500 focus:ring-cyan-200 dark:focus:ring-cyan-900"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                                            Create Password
                                        </label>
                                        <Input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 focus:border-cyan-500 focus:ring-cyan-200 dark:focus:ring-cyan-900"
                                        />
                                    </div>

                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="relative group"
                                    >
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg blur opacity-30 group-hover:opacity-70 transition-opacity" />
                                        <Button
                                            type="submit"
                                            className="relative w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 text-white font-semibold"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Processing...
                                                </>
                                            ) : (
                                                'Accept Invitation'
                                            )}
                                        </Button>
                                    </motion.div>
                                </form>
                            </>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}

export default InviteContent;