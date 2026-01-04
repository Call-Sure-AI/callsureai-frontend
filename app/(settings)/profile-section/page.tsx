// app\(settings)\profile-section\page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
    User, 
    Building2, 
    Mail, 
    Phone, 
    MapPin, 
    Building, 
    Hash,
    Save,
    Sparkles,
    ArrowLeft
} from "lucide-react";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useCurrentUser } from "@/hooks/use-current-user";
import { toast } from "@/hooks/use-toast";

import { ProfileFormData } from "@/types";
import { ProtectedRoute } from "@/components/protected-route";
import ProfileImageUpload from "@/components/settings/image-upload";

import { useActivities } from "@/contexts/activity-context";
import { useCompany } from "@/contexts/company-context";
import { useRouter } from "next/navigation";

// Loading Spinner Component
const LoadingSpinner = () => (
    <div className="flex items-center justify-center min-h-[60vh]">
        <div className="relative">
            <div className="w-12 h-12 rounded-full border-4 border-cyan-500/20 border-t-cyan-500 animate-spin" />
            <Sparkles className="absolute inset-0 m-auto w-5 h-5 text-cyan-500" />
        </div>
    </div>
);

// Form Field Component
const FormField = ({ 
    label, 
    name, 
    value, 
    onChange, 
    placeholder, 
    type = "text", 
    required = false,
    icon: Icon,
    delay = 0
}: {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    type?: string;
    required?: boolean;
    icon: React.ElementType;
    delay?: number;
}) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
    >
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon className="h-5 w-5 text-gray-400 group-focus-within:text-cyan-500 transition-colors" />
            </div>
            <Input
                name={name}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="pl-10 bg-white/50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 focus:border-cyan-500 dark:focus:border-cyan-500 focus:ring-cyan-500/20 rounded-lg transition-all duration-200 hover:border-gray-300 dark:hover:border-slate-600"
            />
        </div>
    </motion.div>
);

const ProfileSection = () => {
    const router = useRouter();
    const { user } = useCurrentUser();
    const { refreshActivities } = useActivities();
    const { company, isLoading, updateCompanyData, refreshCompanyData } = useCompany();
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState<ProfileFormData>({
        first_name: "",
        last_name: "",
        business_name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zip_code: "",
        image: "",
        logo: "",
    });

    useEffect(() => {
        if (company) {
            setFormData({
                first_name: user?.name?.split(" ")[0] || "",
                last_name: user?.name?.split(" ")[1] || "",
                business_name: company.business_name || "",
                email: company.email || user?.email || "",
                phone: company.phone || "",
                address: company.address || "",
                city: company.city || "",
                state: company.state || "",
                zip_code: company.zip_code || "",
                image: user?.image || "",
                logo: company.logo || "",
            });
        }
    }, [company, user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const validateForm = () => {
        const requiredFields = [
            "business_name",
            "email",
            "phone",
            "address",
            "city",
            "state",
            "zip_code",
        ];

        for (const field of requiredFields) {
            if (!formData[field as keyof ProfileFormData]) {
                toast({
                    title: "Error",
                    description: `Please provide a ${field.replace("_", " ")}.`,
                    variant: "destructive",
                });
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (!validateForm()) return;

        const token = localStorage.getItem('token');
        if (!token) {
            toast({
                title: "Error",
                description: "Please login to update your profile.",
                variant: "destructive",
            });
            return;
        }

        setIsSaving(true);

        try {
            const success = await updateCompanyData({
                first_name: formData.first_name,
                last_name: formData.last_name,
                business_name: formData.business_name,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                zip_code: formData.zip_code,
                logo: formData.logo,
                user_id: user?.id,
            });

            if (success) {
                Promise.all([refreshActivities(), refreshCompanyData()]);
                toast({
                    title: "Success",
                    description: "Profile updated successfully.",
                });
                router.push("/dashboard");
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.message || "Failed to update profile. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <ProtectedRoute>
                <LoadingSpinner />
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <div className="w-full max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                >
                    <Link href="/dashboard">
                        <Button 
                            variant="ghost" 
                            className="mb-4 text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 -ml-2"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Dashboard
                        </Button>
                    </Link>
                    <h1 className="text-2xl lg:text-3xl font-bold">
                        <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                            Edit
                        </span>
                        <span className="text-gray-900 dark:text-white ml-2">Profile</span>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Manage your account and business information
                    </p>
                </motion.div>

                {/* Main Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-slate-800/50 shadow-xl overflow-hidden"
                >
                    {/* Gradient accent */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />
                    
                    {/* Glow effect */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl" />
                    <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl" />

                    <div className="relative p-6 lg:p-8">
                        {/* Profile Image Section */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-col items-center mb-8"
                        >
                            <div className="relative">
                                <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full opacity-20 blur-lg" />
                                <ProfileImageUpload
                                    currentImage={formData.logo ?? formData.image}
                                    onImageUpdate={(imageUrl) =>
                                        setFormData((prev) => ({ ...prev, logo: imageUrl }))
                                    }
                                    token={localStorage.getItem('token') || ''}
                                />
                            </div>
                            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                                Click to upload a new profile picture
                            </p>
                        </motion.div>

                        <form className="space-y-6">
                            {/* Personal Info Section */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <User className="w-4 h-4 text-cyan-500" />
                                    Personal Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        label="First Name"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        placeholder="Enter first name"
                                        icon={User}
                                        required
                                        delay={0.35}
                                    />
                                    <FormField
                                        label="Last Name"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        placeholder="Enter last name"
                                        icon={User}
                                        delay={0.4}
                                    />
                                </div>
                            </motion.div>

                            {/* Business Info Section */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.45 }}
                            >
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-blue-500" />
                                    Business Information
                                </h3>
                                <FormField
                                    label="Business Name"
                                    name="business_name"
                                    value={formData.business_name}
                                    onChange={handleChange}
                                    placeholder="Enter business name"
                                    icon={Building2}
                                    required
                                    delay={0.5}
                                />
                            </motion.div>

                            {/* Contact Info Section */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.55 }}
                            >
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-purple-500" />
                                    Contact Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        label="Email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter email address"
                                        icon={Mail}
                                        required
                                        delay={0.6}
                                    />
                                    <FormField
                                        label="Phone"
                                        name="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="Enter phone number"
                                        icon={Phone}
                                        required
                                        delay={0.65}
                                    />
                                </div>
                            </motion.div>

                            {/* Address Section */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7 }}
                            >
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-emerald-500" />
                                    Address Information
                                </h3>
                                <div className="space-y-4">
                                    <FormField
                                        label="Business Address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Enter street address"
                                        icon={MapPin}
                                        required
                                        delay={0.75}
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <FormField
                                            label="City"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            placeholder="Enter city"
                                            icon={Building}
                                            required
                                            delay={0.8}
                                        />
                                        <FormField
                                            label="State"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            placeholder="Enter state"
                                            icon={Building}
                                            required
                                            delay={0.85}
                                        />
                                        <FormField
                                            label="ZIP Code"
                                            name="zip_code"
                                            value={formData.zip_code}
                                            onChange={handleChange}
                                            placeholder="Enter ZIP"
                                            icon={Hash}
                                            required
                                            delay={0.9}
                                        />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Submit Button */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.95 }}
                                className="pt-4"
                            >
                                <Button
                                    onClick={handleSubmit}
                                    disabled={isSaving}
                                    className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-8 py-3 rounded-lg shadow-lg shadow-cyan-500/25 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSaving ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            Save Changes
                                        </>
                                    )}
                                </Button>
                            </motion.div>
                        </form>
                    </div>
                </motion.div>

                {/* Footer Note */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6"
                >
                    Fields marked with <span className="text-red-500">*</span> are required
                </motion.p>
            </div>
        </ProtectedRoute>
    );
};

export default ProfileSection;
