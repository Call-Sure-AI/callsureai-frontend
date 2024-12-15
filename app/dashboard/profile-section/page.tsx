"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserIcon } from "lucide-react";
import { useCurrentUser } from '@/hooks/use-current-user';
import Image from 'next/image';

const ProfileSection = () => {

    const { user } = useCurrentUser();

    return (
        <div className="ml-16 p-2 md:p-8">
            <Card className="bg-white shadow-sm w-full">
                <CardHeader className="border-b">
                    <CardTitle className="text-xl font-medium">Edit Profile</CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="flex flex-col justify-between md:flex-row gap-12">
                        {/* Avatar Section */}
                        <div className="flex flex-col w-full justify-center items-center space-y-3 md:w-1/3">
                            <div className="ml-2 w-32 h-32 md:w-64 md:h-64 rounded-full bg-gray-100 flex items-center justify-center">
                                {user?.image && <Image src={user.image} alt="user-image" className='w-full h-full rounded-full' width={64} height={64} />}
                                {!user?.image && <UserIcon className="w-16 h-16 md:w-32 md:h-32 text-gray-400" />}
                            </div>
                            <span className="text-sm text-gray-600 break-all text-center">
                                {user?.email || ''}
                            </span>
                        </div>

                        {/* Form Section */}
                        <div className="flex-1 max-w-5xl">
                            <form className="space-y-8">
                                {/* Name Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-600">
                                            First Name <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            placeholder="First Name"
                                            className="w-full p-2 border rounded-md"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-600">
                                            Last Name <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            placeholder="Last Name"
                                            className="w-full p-2 border rounded-md"
                                        />
                                    </div>
                                </div>

                                {/* Contact Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-600">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            type="email"
                                            placeholder="Email"
                                            className="w-full p-2 border rounded-md"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-600">
                                            Phone
                                        </label>
                                        <Input
                                            type="tel"
                                            placeholder="Phone"
                                            className="w-full p-2 border rounded-md"
                                        />
                                    </div>
                                </div>

                                {/* Address Fields */}
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-600">
                                        Home Address
                                    </label>
                                    <Input
                                        placeholder="Home Address"
                                        className="w-full p-2 border rounded-md"
                                    />
                                </div>

                                {/* City and ZIP */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-600">
                                            City <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            placeholder="City"
                                            className="w-full p-2 border rounded-md"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-600">
                                            ZIP Code <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            placeholder="ZIP Code"
                                            className="w-full p-2 border rounded-md"
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div>
                                    <Button
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