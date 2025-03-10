'use client';

import Image from "next/image"
import { CircleUser } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useCurrentUser } from "@/hooks/use-current-user";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

export const UserProfileIcon = () => {
    const { user } = useCurrentUser();
    const { logout, isLoggingOut } = useAuth({
        redirectPath: '/'
    });
    const router = useRouter();

    const handleNavigation = (path: any) => {
        // Use immediate router navigation instead of Link
        router.push(path);
    };

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
                <div className="px-2 mt-[-3%] text-xs text-gray-500">
                    {user?.email || 'Email'}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={() => handleNavigation('/dashboard')}
                >
                    Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={() => handleNavigation('/settings')}
                >
                    Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={logout}
                    className="cursor-pointer"
                    disabled={isLoggingOut}
                >
                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}