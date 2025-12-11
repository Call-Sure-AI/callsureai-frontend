// components\settings\image-upload.tsx
import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { UserIcon, Camera, Sparkles } from "lucide-react";
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
            className="relative w-32 h-32 group cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => fileInputRef.current?.click()}
        >
            {/* Outer ring with gradient */}
            <div className={`absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full transition-opacity duration-300 ${isHovered || uploading ? 'opacity-100' : 'opacity-50'}`} />
            
            {/* Inner container */}
            <div className="relative w-32 h-32 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border-4 border-white dark:border-slate-900">
                {currentImage ? (
                    <Image
                        src={currentImage}
                        alt="profile"
                        className="w-full h-full object-cover"
                        width={128}
                        height={128}
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center">
                        <UserIcon className="w-16 h-16 text-gray-400 dark:text-gray-500" />
                    </div>
                )}

                {/* Hover overlay */}
                <div 
                    className={`absolute inset-0 bg-gradient-to-br from-cyan-500/80 to-blue-600/80 flex flex-col items-center justify-center transition-opacity duration-300 ${
                        isHovered || uploading ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    {uploading ? (
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                            <span className="text-white text-xs font-medium">Uploading...</span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-1">
                            <Camera className="w-6 h-6 text-white" />
                            <span className="text-white text-xs font-medium">Change Photo</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Sparkle decoration */}
            <div className={`absolute -top-1 -right-1 transition-all duration-300 ${isHovered ? 'scale-110 opacity-100' : 'scale-100 opacity-70'}`}>
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg">
                    <Sparkles className="w-3 h-3 text-white" />
                </div>
            </div>

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