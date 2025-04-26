"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function InvitePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
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

    const handleAcceptInvitation = async (e: React.FormEvent<HTMLFormElement>) => {
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
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen p-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-red-500">Invalid Invitation</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{error}</p>
                        <Button
                            className="w-full mt-4"
                            onClick={() => router.push('/')}
                        >
                            Return to Home
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Accept Invitation</CardTitle>
                </CardHeader>
                <CardContent>
                    {invitation && (
                        <>
                            <p className="mb-4">
                                You&apos;ve been invited to join <strong>{(invitation as any).company.name}</strong> as a <strong>{(invitation as any).role}</strong>.
                            </p>

                            <form onSubmit={handleAcceptInvitation} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Your Name
                                    </label>
                                    <Input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Create Password
                                    </label>
                                    <Input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
                                    ) : (
                                        'Accept Invitation'
                                    )}
                                </Button>
                            </form>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}