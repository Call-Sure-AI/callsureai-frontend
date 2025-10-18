"use client"

import { useState } from "react"
import {
    Plus,
    Calendar,
    Mail,
    Phone,
    Settings,
    Play,
    Pause,
    Trash2,
    CheckCircle,
    XCircle,
    AlertCircle,
    MoreVertical,
    Clock,
    Target,
    Users,
    TrendingUp,
    RefreshCw,
    CalendarCheck,
    Eye,
    Edit,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/hooks/use-toast"
import { useCampaigns } from "@/contexts/campaign-context"
import { useAgents } from "@/contexts/agent-context"
import { CampaignFormState, defaultBookingConfig, defaultAutomationConfig, defaultDataMapping, FormValidationErrors } from "@/types/campaign"
import { triggerCampaign, createCampaignTriggerPayload } from '@/services/webhook-service'
import { FileUploadComponent, DataMappingComponent, BookingConfigComponent, AutomationConfigComponent } from "@/components/campaigns/form-components"
import { CampaignEdit } from "@/components/campaigns/campaign-edit"

// Using types from campaign.ts

export default function CampaignsPage() {
    const { campaigns, loading, error, createNewCampaign, updateCampaign, validateForm, refreshCampaigns } = useCampaigns();
    const { agents } = useAgents();

    const [selectedCampaign, setSelectedCampaign] = useState<any>(null)
    const [showCreateDialog, setShowCreateDialog] = useState(false)
    const [showSettingsDialog, setShowSettingsDialog] = useState(false)
    const [showLeadsDialog, setShowLeadsDialog] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formErrors, setFormErrors] = useState<FormValidationErrors>({})

    // New campaign form state
    const [formData, setFormData] = useState<CampaignFormState>({
        campaign_name: '',
        description: '',
        agent_id: '',
        data_mapping: defaultDataMapping,
        booking_enabled: false,
        booking_config: defaultBookingConfig,
        automation_config: defaultAutomationConfig,
        csv_file: null,
        csv_headers: [],
        csv_data: []
    })

    // Parse CSV file and extract headers
    const parseCSVFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            const rows = text.split('\n').map(row => row.split(','));
            const headers = rows[0].map(h => h.trim());
            const data = rows.slice(1).map(row => {
                const obj: any = {};
                headers.forEach((header, index) => {
                    obj[header] = row[index]?.trim();
                });
                return obj;
            }).filter(row => Object.values(row).some(v => v));

            setFormData(prev => ({
                ...prev,
                csv_headers: headers,
                csv_data: data
            }));
        };
        reader.readAsText(file);
    };

    const handleFileSelect = (file: File) => {
        setFormData(prev => ({ ...prev, csv_file: file }));
        parseCSVFile(file);
        toast({
            title: "CSV Uploaded",
            description: `Loaded ${file.name}`,
        });
    };

    const handleCreateCampaign = async () => {
        try {
            setIsSubmitting(true);
            setFormErrors({});

            // Validate form
            const errors = validateForm(formData);
            if (Object.keys(errors).length > 0) {
                setFormErrors(errors);
                toast({
                    title: "Validation Error",
                    description: "Please fix the errors in the form",
                    variant: "destructive"
                });
                return;
            }

            // Create campaign
            const success = await createNewCampaign(formData);

            if (success) {
                setShowCreateDialog(false);
                // Reset form
                setFormData({
                    campaign_name: '',
                    description: '',
                    agent_id: '',
                    data_mapping: defaultDataMapping,
                    booking_enabled: false,
                    booking_config: defaultBookingConfig,
                    automation_config: defaultAutomationConfig,
                    csv_file: null,
                    csv_headers: [],
                    csv_data: []
                });
            }
        } catch (error) {
            console.error('Error creating campaign:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleStartCampaign = async (campaignId: string) => {
        try {
            // Find the campaign to get its details
            const campaign = campaigns.find(c => c.id === campaignId);
            console.log('Campaign details found:', campaign);
            if (!campaign) {
                toast({
                    title: "Error",
                    description: "Campaign not found",
                    variant: "destructive"
                });
                return;
            }

            console.log('Campaign details:', campaign);

            // Check if campaign has file URL before attempting to start
            if (!campaign.leads_file_url) {
                toast({
                    title: "Error",
                    description: "Campaign file URL not available. Cannot start campaign without a CSV file.",
                    variant: "destructive"
                });
                return;
            }

            // Trigger campaign webhook first
            try {
                const payload = createCampaignTriggerPayload(
                    campaign.id,
                    campaign.agent_id,
                    campaign.automation_config,
                    campaign.leads_file_url,
                    campaign.data_mapping
                );

                console.log('Payload:', payload);

                await triggerCampaign(payload);
                console.log('Campaign webhook triggered successfully');

                // Only update status to active if webhook trigger is successful
                await updateCampaign(campaignId, 'active');

                toast({
                    title: "Success",
                    description: "Campaign started successfully!",
                });
            } catch (webhookError: any) {
                console.error('Failed to trigger campaign webhook:', webhookError);
                toast({
                    title: "Error",
                    description: "Failed to start campaign. Please check your configuration and try again.",
                    variant: "destructive"
                });
            }
        } catch (error: any) {
            console.error('Failed to start campaign:', error);
            toast({
                title: "Error",
                description: error.message || "Failed to start campaign. Please try again.",
                variant: "destructive"
            });
        }
    };

    const handlePauseCampaign = async (campaignId: string) => {
        await updateCampaign(campaignId, 'paused');
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active':
                return <CheckCircle className="w-4 h-4 text-green-500" />
            case 'paused':
                return <AlertCircle className="w-4 h-4 text-yellow-500" />
            case 'completed':
                return <CheckCircle className="w-4 h-4 text-blue-500" />
            case 'queued':
                return <Clock className="w-4 h-4 text-orange-500" />
            case 'draft':
                return <Clock className="w-4 h-4 text-gray-500" />
            default:
                return <XCircle className="w-4 h-4 text-red-500" />
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800'
            case 'paused':
                return 'bg-yellow-100 text-yellow-800'
            case 'completed':
                return 'bg-blue-100 text-blue-800'
            case 'queued':
                return 'bg-orange-100 text-orange-800'
            case 'draft':
                return 'bg-gray-100 text-gray-800'
            default:
                return 'bg-red-100 text-red-800'
        }
    }

    // Mobile Campaign Card Component
    const CampaignCard = ({ campaign }: { campaign: any }) => (
        <Card className="w-full">
            <CardContent className="p-4 sm:p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                        <h3 className="font-semibold text-base sm:text-lg line-clamp-1">
                            {campaign.campaign_name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 mt-1">
                            {campaign.description}
                        </p>
                        <Badge className={`${getStatusColor(campaign.status)} mt-2`}>
                            <span className="flex items-center gap-1">
                                {getStatusIcon(campaign.status)}
                                {campaign.status}
                            </span>
                        </Badge>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="ml-2">
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {campaign.status === 'queued' && (
                                <DropdownMenuItem onClick={() => handleStartCampaign(campaign.id)}>
                                    <Play className="w-4 h-4 mr-2" />
                                    Start Campaign
                                </DropdownMenuItem>
                            )}
                            {campaign.status === 'active' && (
                                <DropdownMenuItem onClick={() => handlePauseCampaign(campaign.id)}>
                                    <Pause className="w-4 h-4 mr-2" />
                                    Pause Campaign
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => {
                                setSelectedCampaign(campaign)
                                setShowLeadsDialog(true)
                            }}>
                                <Users className="w-4 h-4 mr-2" />
                                View Leads
                            </DropdownMenuItem>
                            <CampaignEdit
                                campaign={campaign}
                                trigger={
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit Campaign
                                    </DropdownMenuItem>
                                }
                            />
                            <DropdownMenuItem onClick={() => {
                                setSelectedCampaign(campaign)
                                setShowSettingsDialog(true)
                            }}>
                                <Settings className="w-4 h-4 mr-2" />
                                Settings
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Mobile Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                    <div>
                        <p className="text-xs text-gray-500">Leads</p>
                        <p className="text-lg font-semibold">{campaign.metrics?.total_leads || 0}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Contacted</p>
                        <p className="text-lg font-semibold">{campaign.metrics?.contacted || 0}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Booked</p>
                        <p className="text-lg font-semibold">{campaign.metrics?.booked || 0}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Response Rate</p>
                        <p className="text-lg font-semibold">{campaign.metrics?.response_rate || 0}%</p>
                    </div>
                </div>

                {/* Mobile Action Buttons */}
                <div className="flex gap-2 mt-4">
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                            setSelectedCampaign(campaign)
                            setShowLeadsDialog(true)
                        }}
                    >
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                    </Button>
                    {campaign.status === 'queued' && (
                        <Button
                            size="sm"
                            className="flex-1 bg-[#0A1E4E] hover:bg-[#0A1E4E]/90"
                            onClick={() => handleStartCampaign(campaign.id)}
                        >
                            <Play className="w-4 h-4 mr-1" />
                            Start
                        </Button>
                    )}
                    {campaign.status === 'active' && (
                        <Button
                            size="sm"
                            variant="secondary"
                            className="flex-1"
                            onClick={() => handlePauseCampaign(campaign.id)}
                        >
                            <Pause className="w-4 h-4 mr-1" />
                            Pause
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    )

    return (
        <div className="p-4 sm:p-6 max-w-[100vw] xl:max-w-7xl mx-auto space-y-4 sm:space-y-6">
            {/* Header - Responsive */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                        Sales Campaigns
                    </h1>
                    <p className="text-sm sm:text-base text-gray-500">
                        Automate your outreach and booking processes
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={refreshCampaigns}
                        disabled={loading}
                        className="w-full sm:w-auto"
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <Button
                        onClick={() => setShowCreateDialog(true)}
                        className="w-full sm:w-auto bg-[#0A1E4E] hover:bg-[#0A1E4E]/90"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        New Campaign
                    </Button>
                </div>
            </div>

            {/* Stats Overview - Responsive Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <Card>
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs sm:text-sm text-gray-500">Total Campaigns</p>
                                <p className="text-xl sm:text-2xl font-bold">{campaigns.length}</p>
                            </div>
                            <Target className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs sm:text-sm text-gray-500">Active</p>
                                <p className="text-xl sm:text-2xl font-bold">
                                    {campaigns.filter(c => c.status === 'active').length}
                                </p>
                            </div>
                            <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs sm:text-sm text-gray-500">Total Leads</p>
                                <p className="text-xl sm:text-2xl font-bold">
                                    {campaigns.reduce((acc, c) => acc + (c.metrics?.total_leads || 0), 0)}
                                </p>
                            </div>
                            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs sm:text-sm text-gray-500">Bookings</p>
                                <p className="text-xl sm:text-2xl font-bold">
                                    {campaigns.reduce((acc, c) => acc + (c.metrics?.booked || 0), 0)}
                                </p>
                            </div>
                            <CalendarCheck className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Campaigns List - Mobile Cards / Desktop Table */}
            <Card>
                <CardHeader className="px-4 sm:px-6">
                    <CardTitle className="text-lg sm:text-xl">Your Campaigns</CardTitle>
                    <CardDescription className="text-sm">
                        Manage and monitor your sales automation campaigns
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-0 sm:px-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="flex flex-col items-center space-y-4">
                                <RefreshCw className="w-8 h-8 animate-spin text-[#0A1E4E]" />
                                <p className="text-sm text-gray-500">Loading campaigns...</p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="flex flex-col items-center space-y-4">
                                <AlertCircle className="w-8 h-8 text-red-500" />
                                <p className="text-sm text-red-600">{error}</p>
                                <Button
                                    variant="outline"
                                    onClick={refreshCampaigns}
                                    className="mt-2"
                                >
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Retry
                                </Button>
                            </div>
                        </div>
                    ) : campaigns.length === 0 ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="flex flex-col items-center space-y-4">
                                <Target className="w-12 h-12 text-gray-300" />
                                <div className="text-center">
                                    <h3 className="text-lg font-medium text-gray-900">No campaigns yet</h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Create your first campaign to start automating your sales outreach
                                    </p>
                                </div>
                                <Button
                                    onClick={() => setShowCreateDialog(true)}
                                    className="mt-4 bg-[#0A1E4E] hover:bg-[#0A1E4E]/90"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Campaign
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Mobile View - Cards */}
                            <div className="block lg:hidden space-y-4 px-4">
                                {campaigns.map((campaign) => (
                                    <CampaignCard key={campaign.id} campaign={campaign} />
                                ))}
                            </div>

                            {/* Desktop View - Table */}
                            <div className="hidden lg:block overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Campaign</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Leads</TableHead>
                                            <TableHead>Contacted</TableHead>
                                            <TableHead>Booked</TableHead>
                                            <TableHead>Response Rate</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {campaigns.map((campaign) => (
                                            <TableRow key={campaign.id}>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium">{campaign.campaign_name}</p>
                                                        <p className="text-sm text-gray-500">{campaign.description}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={getStatusColor(campaign.status)}>
                                                        <span className="flex items-center gap-1">
                                                            {getStatusIcon(campaign.status)}
                                                            {campaign.status}
                                                        </span>
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{campaign.metrics?.total_leads || 0}</TableCell>
                                                <TableCell>{campaign.metrics?.contacted || 0}</TableCell>
                                                <TableCell>{campaign.metrics?.booked || 0}</TableCell>
                                                <TableCell>{campaign.metrics?.response_rate || 0}%</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        {campaign.status === 'queued' && (
                                                            <Button
                                                                size="sm"
                                                                onClick={() => handleStartCampaign(campaign.id)}
                                                                className="bg-green-600 hover:bg-green-700"
                                                            >
                                                                <Play className="w-4 h-4 mr-1" />
                                                                Start
                                                            </Button>
                                                        )}
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon">
                                                                    <MoreVertical className="w-4 h-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                {campaign.status === 'active' && (
                                                                    <DropdownMenuItem
                                                                        onClick={() => handlePauseCampaign(campaign.id)}
                                                                    >
                                                                        <Pause className="w-4 h-4 mr-2" />
                                                                        Pause Campaign
                                                                    </DropdownMenuItem>
                                                                )}
                                                                <DropdownMenuItem
                                                                    onClick={() => {
                                                                        setSelectedCampaign(campaign)
                                                                        setShowLeadsDialog(true)
                                                                    }}
                                                                >
                                                                    <Users className="w-4 h-4 mr-2" />
                                                                    View Leads
                                                                </DropdownMenuItem>
                                                                <CampaignEdit
                                                                    campaign={campaign}
                                                                    trigger={
                                                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                                            <Edit className="w-4 h-4 mr-2" />
                                                                            Edit Campaign
                                                                        </DropdownMenuItem>
                                                                    }
                                                                />
                                                                <DropdownMenuItem
                                                                    onClick={() => {
                                                                        setSelectedCampaign(campaign)
                                                                        setShowSettingsDialog(true)
                                                                    }}
                                                                >
                                                                    <Settings className="w-4 h-4 mr-2" />
                                                                    Settings
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem className="text-red-600">
                                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                                    Delete
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Create Campaign Dialog - Responsive */}
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogContent className="max-w-[95vw] sm:max-w-lg lg:max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-lg sm:text-xl">Create New Campaign</DialogTitle>
                        <DialogDescription className="text-sm">
                            Set up your automated sales campaign with custom data fields and booking options
                        </DialogDescription>
                    </DialogHeader>

                    <Tabs defaultValue="basics" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
                            <TabsTrigger value="basics" className="text-xs sm:text-sm">Basics</TabsTrigger>
                            <TabsTrigger value="data" className="text-xs sm:text-sm">Data</TabsTrigger>
                            <TabsTrigger value="booking" className="text-xs sm:text-sm">Booking</TabsTrigger>
                            <TabsTrigger value="automation" className="text-xs sm:text-sm">Auto</TabsTrigger>
                        </TabsList>

                        <TabsContent value="basics" className="space-y-4 mt-4">
                            <div>
                                <Label className="text-sm">Campaign Name</Label>
                                <Input
                                    placeholder="e.g., Q1 Sales Outreach"
                                    value={formData.campaign_name}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        campaign_name: e.target.value
                                    })}
                                    className="mt-1"
                                />
                                {formErrors.campaign_name && (
                                    <p className="text-sm text-red-600 mt-1">{formErrors.campaign_name}</p>
                                )}
                            </div>

                            <div>
                                <Label className="text-sm">Description</Label>
                                <Textarea
                                    placeholder="Describe your campaign goals..."
                                    value={formData.description}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({
                                        ...formData,
                                        description: e.target.value
                                    })}
                                    className="mt-1"
                                    rows={3}
                                />
                                {formErrors.description && (
                                    <p className="text-sm text-red-600 mt-1">{formErrors.description}</p>
                                )}
                            </div>

                            <div>
                                <Label className="text-sm">Select Agent</Label>
                                <Select
                                    value={formData.agent_id}
                                    onValueChange={(value) => setFormData({
                                        ...formData,
                                        agent_id: value
                                    })}
                                >
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Select an agent" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {agents.map((agent) => (
                                            <SelectItem key={agent.id} value={agent.id || ''}>
                                                {agent.name || 'Unnamed Agent'}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {formErrors.agent_id && (
                                    <p className="text-sm text-red-600 mt-1">{formErrors.agent_id}</p>
                                )}
                            </div>

                            <FileUploadComponent
                                onFileSelect={handleFileSelect}
                                selectedFile={formData.csv_file}
                                error={formErrors.csv_file}
                            />
                        </TabsContent>

                        <TabsContent value="data" className="space-y-4 mt-4">
                            <DataMappingComponent
                                csvHeaders={formData.csv_headers}
                                dataMapping={formData.data_mapping}
                                onMappingChange={(mapping) => setFormData({
                                    ...formData,
                                    data_mapping: mapping
                                })}
                                error={formErrors.data_mapping}
                            />
                        </TabsContent>

                        <TabsContent value="booking" className="space-y-4 mt-4">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm">Enable Booking</Label>
                                <Switch
                                    checked={formData.booking_enabled}
                                    onCheckedChange={(checked: boolean) => setFormData({
                                        ...formData,
                                        booking_enabled: checked
                                    })}
                                />
                            </div>

                            {formData.booking_enabled && (
                                <BookingConfigComponent
                                    bookingConfig={formData.booking_config}
                                    onConfigChange={(config) => setFormData({
                                        ...formData,
                                        booking_config: config
                                    })}
                                    error={formErrors.booking_config}
                                />
                            )}
                        </TabsContent>

                        <TabsContent value="automation" className="space-y-4 mt-4">
                            <AutomationConfigComponent
                                automationConfig={formData.automation_config}
                                onConfigChange={(config) => setFormData({
                                    ...formData,
                                    automation_config: config
                                })}
                                error={formErrors.automation_config}
                            />
                        </TabsContent>
                    </Tabs>

                    <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={() => setShowCreateDialog(false)}
                            className="w-full sm:w-auto"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCreateCampaign}
                            disabled={isSubmitting}
                            className="w-full sm:w-auto bg-[#0A1E4E] hover:bg-[#0A1E4E]/90"
                        >
                            {isSubmitting ? (
                                <>
                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Create Campaign
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* View Leads Dialog - Responsive */}
            <Dialog open={showLeadsDialog} onOpenChange={setShowLeadsDialog}>
                <DialogContent className="max-w-[95vw] sm:max-w-2xl lg:max-w-6xl max-h-[80vh]">
                    <DialogHeader>
                        <DialogTitle className="text-lg sm:text-xl">Campaign Leads</DialogTitle>
                        <DialogDescription className="text-sm">
                            {selectedCampaign?.campaign_name} - {selectedCampaign?.metrics?.total_leads || 0} leads
                        </DialogDescription>
                    </DialogHeader>

                    {/* Mobile View - Lead Cards */}
                    <div className="block lg:hidden overflow-auto max-h-[60vh] space-y-3">
                        {selectedCampaign?.leads?.map((lead: any) => (
                            <Card key={lead.id}>
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="font-semibold">{lead.name}</p>
                                            <p className="text-sm text-gray-500">{lead.email}</p>
                                        </div>
                                        <Badge className={getStatusColor(lead.status)}>
                                            {lead.status}
                                        </Badge>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-sm mt-3">
                                        <div>
                                            <p className="text-gray-500">Phone</p>
                                            <p>{lead.phone || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Company</p>
                                            <p>{lead.company || '-'}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-3">
                                        <Button size="sm" variant="outline" className="flex-1">
                                            <Phone className="w-3 h-3 mr-1" />
                                            Call
                                        </Button>
                                        <Button size="sm" variant="outline" className="flex-1">
                                            <Mail className="w-3 h-3 mr-1" />
                                            Email
                                        </Button>
                                        <Button size="sm" variant="outline" className="flex-1">
                                            <Calendar className="w-3 h-3 mr-1" />
                                            Schedule
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Desktop View - Table */}
                    <div className="hidden lg:block overflow-auto max-h-[60vh]">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Company</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {selectedCampaign?.leads?.map((lead: any) => (
                                    <TableRow key={lead.id}>
                                        <TableCell>{lead.name}</TableCell>
                                        <TableCell>{lead.email}</TableCell>
                                        <TableCell>{lead.phone || '-'}</TableCell>
                                        <TableCell>{lead.company || '-'}</TableCell>
                                        <TableCell>
                                            <Badge className={getStatusColor(lead.status)}>
                                                {lead.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem>
                                                        <Phone className="w-4 h-4 mr-2" />
                                                        Call
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Mail className="w-4 h-4 mr-2" />
                                                        Email
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Calendar className="w-4 h-4 mr-2" />
                                                        Schedule
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Settings Dialog - Responsive */}
            <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
                <DialogContent className="max-w-[95vw] sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-lg sm:text-xl">Campaign Settings</DialogTitle>
                        <DialogDescription className="text-sm">
                            Configure settings for {selectedCampaign?.campaign_name}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-gray-500 text-sm">
                            Campaign settings configuration will be implemented here.
                        </p>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowSettingsDialog(false)}
                            className="w-full sm:w-auto"
                        >
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}