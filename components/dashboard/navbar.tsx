"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { BellDotIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useCurrentUser } from "@/hooks/use-current-user";
import { UserProfileIcon } from "../auth/user-profile-icon";
const Navbar = () => {
    const { user } = useCurrentUser();

    const navAnimation = {
        hidden: { y: -20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    const itemAnimation = {
        hidden: { x: -20, opacity: 0 },
        visible: { x: 0, opacity: 1 },
        exit: { x: -20, opacity: 0 }
    };

    const reverseItemAnimation = {
        hidden: { x: 20, opacity: 0 },
        visible: { x: 0, opacity: 1 },
        exit: { x: 20, opacity: 0 }
    };

    return (
        <motion.nav
            initial="hidden"
            animate="visible"
            variants={navAnimation}
            transition={{ duration: 0.5 }}
            className="w-full py-1 bg-white/80 backdrop-blur-md border-b-2 border-gray-100"
        >
            <div className="mx-12">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group my-3">
                        <motion.div
                            variants={itemAnimation}
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 400 }}
                            className="w-10 h-10 sm:w-12 sm:h-12 relative"
                        >
                            <Image
                                src="/images/csai_logos/logo_without_text/fulllogo_transparent_nobuffer.png"
                                alt="Callsure AI Logo"
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-contain"
                                priority
                            />
                        </motion.div>
                        <motion.span
                            variants={itemAnimation}
                            transition={{ type: "spring", stiffness: 400 }}
                            className="text-2xl hidden md:block sm:text-3xl font-bold bg-gradient-to-b from-[#162a47] via-[#3362A6] to-[#162a47] bg-clip-text text-transparent">
                            Callsure
                        </motion.span>
                    </Link>

                    <div className="relative w-full md:w-[50%] max-w-xl mx-auto px-4 md:px-0">
                    <div className="absolute inset-y-0 start-8 sm:start-4 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                    </div>
                        <input 
                            type="search" 
                            id="default-search" 
                            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-full bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            placeholder="Search Mockups, Logos..." 
                            required 
                        />
<Button
    className="absolute end-2.5 bottom-2 font-semibold hidden md:block rounded-full w-full sm:w-auto text-lg px-6 py-1.5 text-base"
    variant="animated"
    size="sm"
    showSearchIcon
>
    Search
</Button>
                    </div>


                    <div className="flex items-center gap-4">
                        {user && user?.email ? (
                            <>
                                <BellDotIcon className="w-4 h-4 md:w-6 md:h-6 text-[#0A1E4E] cursor-pointer" />
                                <UserProfileIcon />
                            </>
                        ) : (
                            <motion.div
                                variants={reverseItemAnimation}
                                transition={{ delay: 0.6 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link href="/auth">
                                    <Button
                                        variant="animated"
                                        size="animated"
                                        className="hidden sm:flex"
                                        showArrow
                                    >
                                        Sign In
                                    </Button>
                                </Link>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;