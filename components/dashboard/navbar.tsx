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
            className="w-full py-1 sm:py-1 px-4 sm:px-6 bg-white/80 backdrop-blur-md border-b-2 border-gray-100"
        >
            <div className="max-w-7xl mx-auto">
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
                                className="object-contain"
                                priority
                            />
                        </motion.div>
                        <motion.span
                            variants={itemAnimation}
                            transition={{ type: "spring", stiffness: 400 }}
                            className="text-2xl sm:text-3xl font-bold bg-gradient-to-b from-[#162a47] via-[#3362A6] to-[#162a47] bg-clip-text text-transparent">
                            Callsure
                        </motion.span>
                    </Link>

                    <div className="flex items-center gap-4">
                        {user && user?.email ? (
                            <>
                                <UserProfileIcon />
                                <BellDotIcon className="ml-0 w-4 h-4 md:ml-4 md:w-6 md:h-6 text-[#0A1E4E] cursor-pointer" />
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
                                        Sign up
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