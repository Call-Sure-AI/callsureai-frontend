'use client';

import Image from "next/image"
import Link from "next/link";
import { CircleUser } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useCurrentUser } from "@/hooks/use-current-user";
import { useRouter } from "next/navigation";

export const UserProfileIcon = () => {
    const router = useRouter();
    const { user } = useCurrentUser();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/');
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="p-0 overflow-hidden border-[1px] border-gray-200 rounded-full"
                >
                    {user?.image ? (
                        <Image
                            src={user.image}
                            alt="User profile"
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    ) : (
                        <CircleUser className="w-10 h-10 text-gray-500" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="ml-4">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                    {user?.email || 'Email'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                    <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                    <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}