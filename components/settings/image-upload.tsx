import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { UserIcon, PencilIcon } from "lucide-react";
import { toast } from '@/hooks/use-toast';

const ProfileImageUpload = ({
    currentImage,
    onImageUpdate,
    token
}: {
    currentImage: string | null,
    onImageUpdate: (url: string) => void,
    token: string
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast({
                title: "Error",
                description: "Please select an image file",
                variant: "destructive",
            });
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast({
                title: "Error",
                description: "Image size should be less than 5MB",
                variant: "destructive",
            });
            return;
        }

        try {
            setUploading(true);
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/files/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to upload image');
            }

            const userStr = localStorage.getItem('user');

            if (userStr) {
                const user = JSON.parse(userStr);
                user.image = data.url;
                localStorage.setItem('user', JSON.stringify(user));
            }

            onImageUpdate(data.url);
            toast({
                title: "Success",
                description: "Profile image updated successfully!",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to upload image",
                variant: "destructive",
            });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div
            className="relative w-32 h-32 group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                {currentImage ? (
                    <Image
                        src={currentImage}
                        alt="profile"
                        className="w-full h-full object-cover rounded-full"
                        width={128}
                        height={128}
                    />
                ) : (
                    <UserIcon className="w-16 h-16 md:w-32 md:h-32 text-gray-400" />
                )}
            </div>

            <button
                onClick={() => fileInputRef.current?.click()}
                className={`absolute inset-0 w-full h-full rounded-full flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-200 ${isHovered || uploading ? 'opacity-100' : 'opacity-0'
                    }`}
                disabled={uploading}
            >
                {uploading ? (
                    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                    <PencilIcon className="w-6 h-6 text-white" />
                )}
            </button>

            <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileSelect}
            />
        </div>
    );
};

export default ProfileImageUpload;