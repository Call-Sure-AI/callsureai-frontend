"use client"

import { useState, useRef, useEffect } from "react"
import {
    Upload,
    Plus,
    Calendar,
    Mail,
    Phone,
    FileText,
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

interface Lead {
    id: string
    name: string
    email: string
    phone?: string
    company?: string
    location?: string
    status: 'new' | 'contacted' | 'qualified' | 'booked' | 'completed' | 'failed'
    customFields?: Record<string, any>
}

interface Campaign {
    id: string
    name: string
    description: string
    status: 'draft' | 'active' | 'paused' | 'completed'
    leads: Lead[]
    settings: CampaignSettings
    metrics: CampaignMetrics
    createdAt: string
    updatedAt: string
}

interface CampaignSettings {
    dataFields: DataField[]
    bookingEnabled: boolean
    bookingSettings?: BookingSettings
    emailSettings?: EmailSettings
    callSettings?: CallSettings
    schedule?: ScheduleSettings
}

interface DataField {
    fieldName: string
    csvColumn: string
    required: boolean
    type: 'text' | 'email' | 'phone' | 'number' | 'date'
}

interface BookingSettings {
    calendarType: 'google' | 'outlook' | 'calendly'
    meetingDuration: number
    bufferTime: number
    availableSlots: TimeSlot[]
    sendInviteToLead: boolean
    sendInviteToTeam: boolean
    teamEmails: string[]
    bookingUrl?: string
}

interface TimeSlot {
    day: string
    startTime: string
    endTime: string
}

interface EmailSettings {
    subject: string
    template: string
    followUpEnabled: boolean
    followUpDelay: number
}

interface CallSettings {
    agentId: string
    script: string
    maxAttempts: number
    callInterval: number
}

interface ScheduleSettings {
    startDate: string
    endDate: string
    dailyLimit: number
    timezone: string
}

interface CampaignMetrics {
    totalLeads: number
    contacted: number
    qualified: number
    booked: number
    completed: number
    failed: number
    responseRate: number
    bookingRate: number
}

export default function CampaignsPage() {
    const fileInputRef = useRef<HTMLInputElement>(null)
    
    const [campaigns, setCampaigns] = useState<Campaign[]>([])
    const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
    const [showCreateDialog, setShowCreateDialog] = useState(false)
    const [showSettingsDialog, setShowSettingsDialog] = useState(false)
    const [showLeadsDialog, setShowLeadsDialog] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [csvData, setCsvData] = useState<any[]>([])
    const [csvHeaders, setCsvHeaders] = useState<string[]>([])
    
    // New campaign form state
    const [newCampaign, setNewCampaign] = useState<Partial<Campaign>>({
        name: '',
        description: '',
        status: 'draft',
        settings: {
            dataFields: [],
            bookingEnabled: false,
            emailSettings: {
                subject: '',
                template: '',
                followUpEnabled: false,
                followUpDelay: 24
            },
            callSettings: {
                agentId: '',
                script: '',
                maxAttempts: 3,
                callInterval: 24
            }
        }
    })

    // Mock data for demonstration
    useEffect(() => {
        // Load campaigns from API or local storage
        const mockCampaigns: Campaign[] = [
            {
                id: '1',
                name: 'Q1 Sales Outreach',
                description: 'Targeting enterprise clients for Q1',
                status: 'active',
                leads: [],
                settings: {
                    dataFields: [
                        { fieldName: 'Name', csvColumn: 'full_name', required: true, type: 'text' },
                        { fieldName: 'Email', csvColumn: 'email', required: true, type: 'email' },
                        { fieldName: 'Phone', csvColumn: 'phone', required: false, type: 'phone' },
                        { fieldName: 'Company', csvColumn: 'company', required: false, type: 'text' }
                    ],
                    bookingEnabled: true,
                    bookingSettings: {
                        calendarType: 'google',
                        meetingDuration: 30,
                        bufferTime: 15,
                        availableSlots: [],
                        sendInviteToLead: true,
                        sendInviteToTeam: true,
                        teamEmails: ['team@example.com']
                    }
                },
                metrics: {
                    totalLeads: 150,
                    contacted: 120,
                    qualified: 45,
                    booked: 30,
                    completed: 25,
                    failed: 5,
                    responseRate: 80,
                    bookingRate: 25
                },
                createdAt: '2025-01-10',
                updatedAt: '2025-01-15'
            }
        ]
        setCampaigns(mockCampaigns)
    }, [])

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = async (e) => {
            const text = e.target?.result as string
            const rows = text.split('\n').map(row => row.split(','))
            const headers = rows[0].map(h => h.trim())
            const data = rows.slice(1).map(row => {
                const obj: any = {}
                headers.forEach((header, index) => {
                    obj[header] = row[index]?.trim()
                })
                return obj
            }).filter(row => Object.values(row).some(v => v))

            setCsvHeaders(headers)
            setCsvData(data)
            
            toast({
                title: "CSV Uploaded",
                description: `Loaded ${data.length} leads from file`,
            })
        }
        reader.readAsText(file)
    }

    const handleCreateCampaign = async () => {
        try {
            setIsLoading(true)
            
            // Create campaign with leads
            const campaign: Campaign = {
                id: Date.now().toString(),
                name: newCampaign.name || 'New Campaign',
                description: newCampaign.description || '',
                status: 'draft',
                leads: csvData.map((row, index) => ({
                    id: `lead-${index}`,
                    name: row[newCampaign.settings?.dataFields?.find(f => f.fieldName === 'Name')?.csvColumn || ''] || '',
                    email: row[newCampaign.settings?.dataFields?.find(f => f.fieldName === 'Email')?.csvColumn || ''] || '',
                    phone: row[newCampaign.settings?.dataFields?.find(f => f.fieldName === 'Phone')?.csvColumn || ''],
                    company: row[newCampaign.settings?.dataFields?.find(f => f.fieldName === 'Company')?.csvColumn || ''],
                    location: row[newCampaign.settings?.dataFields?.find(f => f.fieldName === 'Location')?.csvColumn || ''],
                    status: 'new',
                    customFields: row
                })),
                settings: newCampaign.settings as CampaignSettings,
                metrics: {
                    totalLeads: csvData.length,
                    contacted: 0,
                    qualified: 0,
                    booked: 0,
                    completed: 0,
                    failed: 0,
                    responseRate: 0,
                    bookingRate: 0
                },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }

            setCampaigns([...campaigns, campaign])
            setShowCreateDialog(false)
            setCsvData([])
            setCsvHeaders([])
            
            toast({
                title: "Campaign Created",
                description: `${campaign.name} has been created with ${campaign.leads.length} leads`,
            })
        } catch {
            toast({
                title: "Error",
                description: "Failed to create campaign",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleStartCampaign = async (campaignId: string) => {
        const campaign = campaigns.find(c => c.id === campaignId)
        if (!campaign) return

        setCampaigns(campaigns.map(c => 
            c.id === campaignId 
                ? { ...c, status: 'active' }
                : c
        ))

        toast({
            title: "Campaign Started",
            description: `${campaign.name} is now active`,
        })
    }

    const handlePauseCampaign = async (campaignId: string) => {
        const campaign = campaigns.find(c => c.id === campaignId)
        if (!campaign) return

        setCampaigns(campaigns.map(c => 
            c.id === campaignId 
                ? { ...c, status: 'paused' }
                : c
        ))

        toast({
            title: "Campaign Paused",
            description: `${campaign.name} has been paused`,
        })
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active':
                return <CheckCircle className="w-4 h-4 text-green-500" />
            case 'paused':
                return <AlertCircle className="w-4 h-4 text-yellow-500" />
            case 'completed':
                return <CheckCircle className="w-4 h-4 text-blue-500" />
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
            case 'draft':
                return 'bg-gray-100 text-gray-800'
            default:
                return 'bg-red-100 text-red-800'
        }
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Sales Campaigns</h1>
                    <p className="text-gray-500">Automate your outreach and booking processes</p>
                </div>
                <Button 
                    onClick={() => setShowCreateDialog(true)}
                    className="bg-[#0A1E4E] hover:bg-[#0A1E4E]/90"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    New Campaign
                </Button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Campaigns</p>
                                <p className="text-2xl font-bold">{campaigns.length}</p>
                            </div>
                            <Target className="w-8 h-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Active Campaigns</p>
                                <p className="text-2xl font-bold">
                                    {campaigns.filter(c => c.status === 'active').length}
                                </p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Leads</p>
                                <p className="text-2xl font-bold">
                                    {campaigns.reduce((acc, c) => acc + c.metrics.totalLeads, 0)}
                                </p>
                            </div>
                            <Users className="w-8 h-8 text-purple-500" />
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Bookings Made</p>
                                <p className="text-2xl font-bold">
                                    {campaigns.reduce((acc, c) => acc + c.metrics.booked, 0)}
                                </p>
                            </div>
                            <CalendarCheck className="w-8 h-8 text-amber-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Campaigns List */}
            <Card>
                <CardHeader>
                    <CardTitle>Your Campaigns</CardTitle>
                    <CardDescription>Manage and monitor your sales automation campaigns</CardDescription>
                </CardHeader>
                <CardContent>
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
                                            <p className="font-medium">{campaign.name}</p>
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
                                    <TableCell>{campaign.metrics.totalLeads}</TableCell>
                                    <TableCell>{campaign.metrics.contacted}</TableCell>
                                    <TableCell>{campaign.metrics.booked}</TableCell>
                                    <TableCell>{campaign.metrics.responseRate}%</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                {campaign.status === 'draft' && (
                                                    <DropdownMenuItem 
                                                        onClick={() => handleStartCampaign(campaign.id)}
                                                    >
                                                        <Play className="w-4 h-4 mr-2" />
                                                        Start Campaign
                                                    </DropdownMenuItem>
                                                )}
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
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Create Campaign Dialog */}
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Create New Campaign</DialogTitle>
                        <DialogDescription>
                            Set up your automated sales campaign with custom data fields and booking options
                        </DialogDescription>
                    </DialogHeader>

                    <Tabs defaultValue="basics" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="basics">Basics</TabsTrigger>
                            <TabsTrigger value="data">Data Mapping</TabsTrigger>
                            <TabsTrigger value="booking">Booking</TabsTrigger>
                            <TabsTrigger value="automation">Automation</TabsTrigger>
                        </TabsList>

                        <TabsContent value="basics" className="space-y-4">
                            <div>
                                <Label>Campaign Name</Label>
                                <Input 
                                    placeholder="e.g., Q1 Sales Outreach"
                                    value={newCampaign.name}
                                    onChange={(e) => setNewCampaign({
                                        ...newCampaign,
                                        name: e.target.value
                                    })}
                                />
                            </div>

                            <div>
                                <Label>Description</Label>
                                <Textarea 
                                    placeholder="Describe your campaign goals..."
                                    value={newCampaign.description}
                                    onChange={(e) => setNewCampaign({
                                        ...newCampaign,
                                        description: e.target.value
                                    })}
                                />
                            </div>

                            <div>
                                <Label>Upload Leads CSV</Label>
                                <div className="mt-2">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".csv"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                    />
                                    <Button
                                        variant="outline"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full"
                                    >
                                        <Upload className="w-4 h-4 mr-2" />
                                        Choose CSV File
                                    </Button>
                                </div>
                                {csvData.length > 0 && (
                                    <p className="text-sm text-green-600 mt-2">
                                        ✓ Loaded {csvData.length} leads
                                    </p>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="data" className="space-y-4">
                            <div className="space-y-2">
                                <Label>Map CSV Columns to Data Fields</Label>
                                <p className="text-sm text-gray-500">
                                    Select which columns from your CSV correspond to each data field
                                </p>
                            </div>

                            {csvHeaders.length > 0 && (
                                <div className="space-y-3">
                                    {['Name', 'Email', 'Phone', 'Company', 'Location'].map((field) => (
                                        <div key={field} className="grid grid-cols-3 gap-4 items-center">
                                            <Label>{field}</Label>
                                            <Select
                                                onValueChange={(value) => {
                                                    const fields = newCampaign.settings?.dataFields || []
                                                    const existingIndex = fields.findIndex(f => f.fieldName === field)
                                                    
                                                    if (existingIndex >= 0) {
                                                        fields[existingIndex].csvColumn = value
                                                    } else {
                                                        fields.push({
                                                            fieldName: field,
                                                            csvColumn: value,
                                                            required: field === 'Name' || field === 'Email',
                                                            type: field === 'Email' ? 'email' : field === 'Phone' ? 'phone' : 'text'
                                                        })
                                                    }
                                                    
                                                    setNewCampaign({
                                                        ...newCampaign,
                                                        settings: {
                                                            ...newCampaign.settings!,
                                                            dataFields: fields
                                                        }
                                                    })
                                                }}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select column" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {csvHeaders.map((header) => (
                                                        <SelectItem key={header} value={header}>
                                                            {header}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <div className="flex items-center space-x-2">
                                                <Switch 
                                                    defaultChecked={field === 'Name' || field === 'Email'}
                                                    disabled={field === 'Name' || field === 'Email'}
                                                />
                                                <Label>Required</Label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {csvHeaders.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                    <p>Upload a CSV file first to map columns</p>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="booking" className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label>Enable Booking</Label>
                                <Switch 
                                    checked={newCampaign.settings?.bookingEnabled}
                                    onCheckedChange={(checked) => setNewCampaign({
                                        ...newCampaign,
                                        settings: {
                                            ...newCampaign.settings!,
                                            bookingEnabled: checked
                                        }
                                    })}
                                />
                            </div>

                            {newCampaign.settings?.bookingEnabled && (
                                <>
                                    <div>
                                        <Label>Calendar Integration</Label>
                                        <Select defaultValue="google">
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="google">Google Calendar</SelectItem>
                                                <SelectItem value="outlook">Outlook Calendar</SelectItem>
                                                <SelectItem value="calendly">Calendly</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label>Meeting Duration (minutes)</Label>
                                            <Input type="number" defaultValue="30" />
                                        </div>
                                        <div>
                                            <Label>Buffer Time (minutes)</Label>
                                            <Input type="number" defaultValue="15" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <Switch defaultChecked />
                                            <Label>Send calendar invite to lead</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Switch defaultChecked />
                                            <Label>Send calendar invite to team</Label>
                                        </div>
                                    </div>

                                    <div>
                                        <Label>Team Email Addresses</Label>
                                        <Textarea 
                                            placeholder="Enter email addresses (one per line)"
                                            rows={3}
                                        />
                                    </div>
                                </>
                            )}
                        </TabsContent>

                        <TabsContent value="automation" className="space-y-4">
                            <div>
                                <Label>Email Template</Label>
                                <Textarea 
                                    placeholder="Hi {name}, ..."
                                    rows={5}
                                />
                            </div>

                            <div>
                                <Label>Call Script</Label>
                                <Textarea 
                                    placeholder="Hello {name}, I'm calling from..."
                                    rows={5}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Max Call Attempts</Label>
                                    <Input type="number" defaultValue="3" />
                                </div>
                                <div>
                                    <Label>Call Interval (hours)</Label>
                                    <Input type="number" defaultValue="24" />
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch />
                                <Label>Enable follow-up emails</Label>
                            </div>
                        </TabsContent>
                    </Tabs>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleCreateCampaign}
                            disabled={isLoading}
                            className="bg-[#0A1E4E] hover:bg-[#0A1E4E]/90"
                        >
                            {isLoading ? (
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

            {/* View Leads Dialog */}
            <Dialog open={showLeadsDialog} onOpenChange={setShowLeadsDialog}>
                <DialogContent className="max-w-6xl max-h-[80vh]">
                    <DialogHeader>
                        <DialogTitle>Campaign Leads</DialogTitle>
                        <DialogDescription>
                            {selectedCampaign?.name} - {selectedCampaign?.leads?.length || 0} leads
                        </DialogDescription>
                    </DialogHeader>

                    <div className="overflow-auto">
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
                                {selectedCampaign?.leads?.map((lead) => (
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

            {/* Settings Dialog */}
            <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Campaign Settings</DialogTitle>
                        <DialogDescription>
                            Configure settings for {selectedCampaign?.name}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-gray-500">Campaign settings configuration will be implemented here.</p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowSettingsDialog(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}