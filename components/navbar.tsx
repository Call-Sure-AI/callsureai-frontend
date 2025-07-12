"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, PhoneIncoming } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCurrentUser } from "@/hooks/use-current-user";
import { UserProfileIcon } from "./auth/user-profile-icon";
import ContactModal from "./contact-us-modal";

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const { user } = useCurrentUser();

    const navItems = [
        { label: "Features", href: "/features" },
        { label: "Pricing", href: "/pricing" },
        { label: "Resources", href: "/resources" },
        { label: "Integrations", href: "/integrations" },
        { label: "FAQ", href: "/faq" },
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
        <>
            <motion.nav
                initial="hidden"
                animate="visible"
                variants={navAnimation}
                transition={{ duration: 0.5 }}
                className="w-full py-1 sm:py-1 px-4 sm:px-6 bg-white/80 backdrop-blur-md fixed top-0 z-50"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between">
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
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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

                        <div className="hidden md:flex items-center justify-center flex-1">
                            {navItems.map((item, index) => (
                                <motion.div
                                    key={item.label}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 + 0.2 }}
                                    className="mx-3"
                                >
                                    <Link
                                        href={item.href}
                                        className="text-slate-600 hover:text-[#0A1E4E] transition-colors"
                                        // @ts-ignore
                                        whilehover={{ scale: 1.05 }}
                                        whiletap={{ scale: 0.95 }}
                                    >
                                        {item.label}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        <div className="flex items-center gap-4 flex-1 justify-end">
                            <motion.div
                                variants={reverseItemAnimation}
                                transition={{ delay: 0.5 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsContactModalOpen(true)}
                                    className="rounded-full from-[#162a47] via-[#3362A6] to-[#162a47] transition-all duration-300 text-black"
                                    title="Contact Us"
                                >
                                    <PhoneIncoming className="h-5 w-5 text-black" />
                                </Button>
                            </motion.div>

                            {/* User Profile or Sign Up */}
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
                                            Sign In
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
                                            <Link
                                                href={item.href}
                                                className="w-full justify-start text-slate-600 hover:text-[#0A1E4E] hover:bg-slate-100/80"
                                            >
                                                {item.label}
                                            </Link>
                                        </motion.div>
                                    ))}

                                    <motion.div variants={itemAnimation}>
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start text-slate-600 hover:text-[#0A1E4E] hover:bg-slate-100/80"
                                            onClick={() => {
                                                setIsMobileMenuOpen(false);
                                                setIsContactModalOpen(true);
                                            }}
                                        >
                                            <PhoneIncoming className="h-5 w-5 mr-2" />
                                            Contact Us
                                        </Button>
                                    </motion.div>

                                    {user && user?.email ? (
                                        <UserProfileIcon />
                                    ) : (
                                        <motion.div variants={itemAnimation}>
                                            <Button
                                                variant="animated"
                                                size="animated"
                                                className="w-[90%] sm:hidden ml-4"
                                                showArrow
                                            >
                                                Sign In
                                            </Button>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.nav>

            <ContactModal
                isOpen={isContactModalOpen}
                onClose={() => setIsContactModalOpen(false)}
            />
        </>
    );
};

export default Navbar;