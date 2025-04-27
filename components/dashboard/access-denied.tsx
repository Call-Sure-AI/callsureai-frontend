"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AccessDenied({ redirectPath = "/dashboard" }) {
    const router = useRouter();

    useEffect(() => {
        const redirectTimer = setTimeout(() => {
            router.push(redirectPath);
        }, 5000);

        return () => clearTimeout(redirectTimer);
    }, [redirectPath, router]);

    return (
        <div className="flex items-center justify-center min-h-screen w-full bg-gray-50 p-4">
            <Card className="max-w-md w-full shadow-lg">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-red-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                        <Lock className="h-8 w-8 text-red-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-red-600">Access Denied</CardTitle>
                    <CardDescription className="text-gray-500">
                        You don&apos;t have permission to access this page
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center text-gray-600">
                    <p>You&apos;ll be automatically redirected to the dashboard in 5 seconds.</p>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button
                        onClick={() => router.push(redirectPath)}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Return to Dashboard
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}