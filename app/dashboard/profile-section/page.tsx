"use client";

import React, { useEffect, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useCurrentUser } from '@/hooks/use-current-user';
import { toast } from '@/hooks/use-toast';
import { useIsAuthenticated } from '@/hooks/use-is-authenticated';

import { createOrUpdateCompany } from '@/services/company-service';

import { ProfileFormData } from '@/types';
import { ProtectedRoute } from '@/components/protected-route';
import ProfileImageUpload from '@/components/settings/image-upload';
import { useAuth } from '@/hooks/use-auth';

const ProfileSection = () => {
    const { user } = useCurrentUser();
    const { token } = useIsAuthenticated();
    const { logout } = useAuth({
        redirectPath: '/',
    });
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
        logo: '',
    });

    if (!token) {
        logout();
    }

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
        if (!token) {
            toast({
                title: "Error",
                description: "Please login to update your profile.",
                variant: "destructive",
            });
            return;
        }

        try {
            setLoading(true);

            await createOrUpdateCompany({ ...formData, userId: user?.id || '' }, token);

            toast({
                title: "Success",
                description: "Company profile updated successfully!",
            });
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
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/company`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const companyData = await response.json();

                    setFormData({
                        first_name: user?.name?.split(' ')[0] || '',
                        last_name: user?.name?.split(' ')[1] || '',
                        business_name: companyData.business_name || '',
                        email: companyData.email || user?.email || '',
                        phone: companyData.phone_number || '',
                        address: companyData.address.split(',')[0] || '',
                        city: companyData.address.split(',')[1] || '',
                        state: companyData.address.split(',')[2] || '',
                        zip_code: companyData.address.split(',')[3] || '',
                        image: companyData.logo || user?.image || '',
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
        return (
            <div className="flex w-full justify-center items-center min-h-screen">
                <div className="w-full h-full flex justify-center items-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
                </div>
            </div>
        );
    }

    return (
        <ProtectedRoute>

            <div className="w-full p-2 md:p-8">
                <Card className="bg-white shadow-sm w-full">
                    <CardHeader className="border-b">
                        <CardTitle className="text-xl font-medium">Edit Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="flex flex-col items-center justify-center md:flex-row gap-6">
                            <div className="flex-1 max-w-5xl">
                                <div className="flex w-full mb-2 justify-center items-center space-y-3">
                                    <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center">
                                        <ProfileImageUpload
                                            currentImage={formData.logo ?? formData.image}
                                            onImageUpdate={(imageUrl) => setFormData(prev => ({ ...prev, logo: imageUrl }))}
                                            token={token as string}
                                        />
                                    </div>
                                </div>
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
        </ProtectedRoute>
    );
};

export default ProfileSection;