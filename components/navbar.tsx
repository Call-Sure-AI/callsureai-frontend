"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCurrentUser } from "@/hooks/use-current-user";
import { UserProfileIcon } from "./auth/user-profile-icon";

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user } = useCurrentUser();

    const scrollToSection = (sectionId: string) => {
        const section = document.getElementById(sectionId);
        if (section) {
            setIsMobileMenuOpen(false); // Close mobile menu if open
            window.scrollTo({
                top: section.offsetTop - 80, // Adjust offset to account for navbar height
                behavior: "smooth"
            });
        }
    };

    const navItems = [
        { label: "Features", action: () => scrollToSection("analytics-section") },
        { label: "Pricing", href: "/pricing" },
        { label: "Resources", href: "/resources" },
        { label: "Integrations", href: "/integrations" },
    ];

    const navAnimation = {
        hidden: { y: -20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    const mobileMenuAnimation = {
        hidden: { opacity: 0, height: 0, marginTop: 0 },
        visible: {
            opacity: 1,
            height: "auto",
            marginTop: 16,
            transition: {
                duration: 0.3,
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        },
        exit: {
            opacity: 0,
            height: 0,
            marginTop: 0,
            transition: {
                duration: 0.3,
                when: "afterChildren",
            }
        }
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
            className="w-full py-1 sm:py-1 px-4 sm:px-6 bg-white/80 backdrop-blur-md fixed top-0 z-50"
        >
            <div className="max-w-7xl mx-auto">
                {/* Three-column layout: Logo | Nav | Actions */}
                <div className="flex items-center justify-between">
                    {/* Left column - Logo */}
                    <div className="flex-1">
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
                    </div>

                    {/* Middle column - Nav Items */}
                    <div className="hidden md:flex items-center justify-center flex-1">
                        {navItems.map((item, index) => (
                            <motion.div
                                key={item.label}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 + 0.2 }}
                                className="mx-3"
                            >
                                {item.action ? (
                                    <button
                                        onClick={item.action}
                                        className="text-slate-600 hover:text-[#0A1E4E] transition-colors cursor-pointer"
                                    >
                                        {item.label}
                                    </button>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className="text-slate-600 hover:text-[#0A1E4E] transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {/* Right column - User controls */}
                    <div className="flex items-center gap-4 flex-1 justify-end">
                        {user && user?.email ? (
                            <UserProfileIcon />
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
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="md:hidden"
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="text-slate-700"
                            >
                                <AnimatePresence mode="wait">
                                    {isMobileMenuOpen ? (
                                        <motion.div
                                            key="close"
                                            initial={{ rotate: -90, opacity: 0 }}
                                            animate={{ rotate: 0, opacity: 1 }}
                                            exit={{ rotate: 90, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <X className="h-6 w-6" />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="menu"
                                            initial={{ rotate: 90, opacity: 0 }}
                                            animate={{ rotate: 0, opacity: 1 }}
                                            exit={{ rotate: -90, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Menu className="h-6 w-6" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </Button>
                        </motion.div>
                    </div>
                </div>

                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            variants={mobileMenuAnimation}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="md:hidden overflow-hidden"
                        >
                            <div className="flex flex-col gap-2">
                                {navItems.map((item) => (
                                    <motion.div
                                        key={item.label}
                                        variants={itemAnimation}
                                    >
                                        {item.action ? (
                                            <button
                                                onClick={item.action}
                                                className="block w-full text-left px-4 py-2 text-slate-600 hover:text-[#0A1E4E] hover:bg-slate-100/80"
                                            >
                                                {item.label}
                                            </button>
                                        ) : (
                                            <Link
                                                href={item.href}
                                                className="block w-full px-4 py-2 text-slate-600 hover:text-[#0A1E4E] hover:bg-slate-100/80"
                                            >
                                                {item.label}
                                            </Link>
                                        )}
                                    </motion.div>
                                ))}
                                {user && user?.email ? (
                                    <UserProfileIcon />
                                ) : (
                                    <motion.div variants={itemAnimation}>
                                        <Link href="/auth">
                                            <Button
                                                variant="animated"
                                                size="animated"
                                                className="w-[90%] sm:hidden ml-4"
                                                showArrow
                                            >
                                                Sign up
                                            </Button>
                                        </Link>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.nav>
    );
};

export default Navbar;