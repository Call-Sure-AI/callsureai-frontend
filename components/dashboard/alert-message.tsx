"use client";

import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export const AlertMessage = () => {
    const router = useRouter();

    return (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md px-4">
            <div className="bg-white rounded-lg shadow-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="flex-shrink-0">
                        <AlertCircle className="h-8 w-8 text-red-500" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            Company Details Required
                        </h3>
                        <p className="text-sm text-gray-500">
                            Please complete your company profile to access the dashboard
                        </p>
                    </div>
                </div>

                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <AlertCircle className="h-5 w-5 text-red-400" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">
                                Your company details are missing. Please update your profile to continue using the dashboard features.
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => router.push('/profile-section')}
                    className="w-full bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
                >
                    Update Company Details
                </button>

                <p className="mt-4 text-xs text-center text-gray-500">
                    This information is required to ensure proper access to all dashboard features
                </p>
            </div>
        </div>
    );
};