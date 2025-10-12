"use client";

import React, { useState, useEffect } from 'react';
import { Edit, Save, X } from "lucide-react";
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
        // Reset form data to original values
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
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Campaign</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="campaign_name">Campaign Name</Label>
                        <Input
                            id="campaign_name"
                            value={formData.campaign_name}
                            onChange={(e) => handleInputChange('campaign_name', e.target.value)}
                            placeholder="Enter campaign name"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            placeholder="Enter campaign description"
                            rows={3}
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isLoading}
                    >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isLoading}
                    >
                        <Save className="h-4 w-4 mr-2" />
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
});

CampaignEdit.displayName = 'CampaignEdit';
