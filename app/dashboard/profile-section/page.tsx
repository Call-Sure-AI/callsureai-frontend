"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { UserIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useCurrentUser } from '@/hooks/use-current-user';
import { ProfileFormData } from '@/types';
import { toast } from '@/hooks/use-toast';
import { createOrUpdateCompany } from '@/services/company-service';
import { useRouter } from 'next/navigation';

const ProfileSection = () => {
    const { user } = useCurrentUser();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState<ProfileFormData>({
        first_name: '',
        last_name: '',
        business_name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip_code: '',
        image: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const validateForm = () => {
        const requiredFields = [
            'business_name',
            'email',
            'phone',
            'address',
            'city',
            'state',
            'zip_code'
        ];

        for (const field of requiredFields) {
            if (!formData[field as keyof ProfileFormData]) {
                toast({
                    title: "Error",
                    description: `Please provide a ${field.replace('_', ' ')}.`,
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

        try {
            setLoading(true);
            const response = await createOrUpdateCompany({ ...formData, userId: user?.id || '' });
            console.log(response);
            toast({
                title: "Success",
                description: "Company profile updated successfully!",
            });
            router.push('/dashboard');
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.message || "Failed to update profile. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchCompanyData = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/company?user_id=${user?.id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const companyData = await response.json();
                    setFormData({
                        first_name: user?.name?.split(' ')[0] || '',
                        last_name: user?.name?.split(' ')[1] || '',
                        business_name: companyData[0].business_name || '',
                        email: companyData[0].email || user?.email || '',
                        phone: companyData[0].phone_number || '',
                        address: companyData[0].address.split(',')[0] || '',
                        city: companyData[0].address.split(',')[1] || '',
                        state: companyData[0].address.split(',')[2] || '',
                        zip_code: companyData[0].address.split(',')[3] || '',
                        image: companyData[0].logo || user?.image || '',
                    });
                } else {
                    setFormData({
                        first_name: user?.name?.split(' ')[0] || '',
                        last_name: user?.name?.split(' ')[1] || '',
                        business_name: '',
                        email: user?.email || '',
                        phone: '',
                        address: '',
                        city: '',
                        state: '',
                        zip_code: '',
                        image: user?.image || '',
                    });
                }
            } catch (error) {
                console.error('Error fetching company data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchCompanyData();
        }
    }, [user]);

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    return (
        <div className="ml-16 p-2 md:p-8">
            <Card className="bg-white shadow-sm w-full">
                <CardHeader className="border-b">
                    <CardTitle className="text-xl font-medium">Edit Profile</CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="flex flex-col justify-between md:flex-row gap-6">
                        {/* Avatar Section */}
                        <div className="flex flex-col w-full justify-center items-center space-y-3 md:w-1/3">
                            <div className="ml-2 w-32 h-32 md:w-64 md:h-64 rounded-full bg-gray-100 flex items-center justify-center">
                                {formData.image && <Image src={formData.image} alt="user-image" className='w-full h-full rounded-full' width={64} height={64} />}
                                {!formData?.image && <UserIcon className="w-16 h-16 md:w-32 md:h-32 text-gray-400" />}
                            </div>
                            <span className="text-sm text-gray-600 break-all text-center">
                                {formData?.email || ''}
                            </span>
                        </div>

                        {/* Form Section */}
                        <div className="flex-1 max-w-5xl">
                            <form className="space-y-8">
                                {/* Name Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-sm text-gray-600">
                                            First Name <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            name="first_name"
                                            placeholder="First Name"
                                            className="w-full p-2 border rounded-md"
                                            value={formData.first_name}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600">
                                            Last Name
                                        </label>
                                        <Input
                                            name="last_name"
                                            placeholder="Last Name"
                                            className="w-full p-2 border rounded-md"
                                            value={formData.last_name}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-600">
                                        Business Name <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        name="business_name"
                                        placeholder="Business Name"
                                        className="w-full p-2 border rounded-md"
                                        value={formData.business_name}
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* Contact Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-sm text-gray-600">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            name="email"
                                            type="email"
                                            placeholder="Email"
                                            className="w-full p-2 border rounded-md"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600">
                                            Phone <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            name="phone"
                                            type="tel"
                                            placeholder="Phone"
                                            className="w-full p-2 border rounded-md"
                                            value={formData.phone}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                {/* Address Fields */}
                                <div>
                                    <label className="text-sm text-gray-600">
                                        Business Address <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        name="address"
                                        placeholder="Business Address"
                                        className="w-full p-2 border rounded-md"
                                        value={formData.address}
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* City and ZIP */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-sm text-gray-600">
                                            City <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            name="city"
                                            placeholder="City"
                                            className="w-full p-2 border rounded-md"
                                            value={formData.city}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600">
                                            ZIP Code <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            name="zip_code"
                                            placeholder="ZIP Code"
                                            className="w-full p-2 border rounded-md"
                                            value={formData.zip_code}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm text-gray-600">
                                        State <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        name="state"
                                        placeholder="State"
                                        className="w-full p-2 border rounded-md"
                                        value={formData.state}
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* Submit Button */}
                                <div>
                                    <Button
                                        onClick={handleSubmit}
                                        className="bg-[#0A1E4E] text-white px-6 py-2 rounded-md hover:bg-blue-900 transition-colors"
                                    >
                                        Save
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProfileSection;