// components\campaigns\campaign-edit.tsx
"use client";

import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Save, X, Loader2, Sparkles, FileText, Target } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { useIsAuthenticated } from '@/hooks/use-is-authenticated';
import { useCampaigns } from '@/contexts/campaign-context';
import { CampaignResponse } from '@/types/campaign';

interface CampaignEditProps {
    campaign: CampaignResponse;
    trigger?: React.ReactNode;
}

export const CampaignEdit = React.memo(({ campaign, trigger }: CampaignEditProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        campaign_name: campaign.campaign_name || '',
        description: campaign.description || ''
    });

    const { token } = useIsAuthenticated();
    const { updateCampaignDetails } = useCampaigns();

    // Reset form data when campaign changes
    useEffect(() => {
        setFormData({
            campaign_name: campaign.campaign_name || '',
            description: campaign.description || ''
        });
    }, [campaign]);

    const handleInputChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        try {
            if (!token) {
                toast({
                    title: "Error",
                    description: "Please login to edit the campaign.",
                    variant: "destructive",
                });
                return;
            }

            if (!formData.campaign_name.trim()) {
                toast({
                    title: "Error",
                    description: "Campaign name is required.",
                    variant: "destructive",
                });
                return;
            }

            setIsLoading(true);

            const success = await updateCampaignDetails(campaign.id, formData);

            if (success) {
                setIsOpen(false);
            }

        } catch (error: any) {
            console.error('Error updating campaign:', error);
            toast({
                title: "Error",
                description: error?.message || "Failed to update campaign. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            campaign_name: campaign.campaign_name || '',
            description: campaign.description || ''
        });
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-9 px-3 text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 rounded-lg transition-all"
                    >
                        <Edit className="h-4 w-4 mr-1.5" />
                        <span className="text-sm">Edit</span>
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px] p-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-gray-200/50 dark:border-slate-700/50 shadow-2xl rounded-2xl overflow-hidden">
                {/* Gradient Header */}
                <div className="h-1.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />
                
                <div className="p-6">
                    <DialogHeader className="mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
                                <Target className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                                    Edit Campaign
                                </DialogTitle>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                    Update your campaign details
                                </p>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="space-y-5">
                        {/* Campaign Name */}
                        <div className="space-y-2">
                            <Label 
                                htmlFor="campaign_name" 
                                className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"
                            >
                                <FileText className="w-4 h-4 text-cyan-500" />
                                Campaign Name
                            </Label>
                            <Input
                                id="campaign_name"
                                value={formData.campaign_name}
                                onChange={(e) => handleInputChange('campaign_name', e.target.value)}
                                placeholder="Enter campaign name"
                                className="h-11 bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label 
                                htmlFor="description" 
                                className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"
                            >
                                <Sparkles className="w-4 h-4 text-purple-500" />
                                Description
                            </Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                placeholder="Enter campaign description"
                                rows={4}
                                className="bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all resize-none"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-gray-200/50 dark:border-slate-700/50">
                        <Button
                            variant="outline"
                            onClick={handleCancel}
                            disabled={isLoading}
                            className="px-4 py-2.5 rounded-xl border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all"
                        >
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium shadow-lg shadow-cyan-500/25 transition-all"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
});

CampaignEdit.displayName = 'CampaignEdit';