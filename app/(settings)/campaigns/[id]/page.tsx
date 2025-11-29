// app\(settings)\campaigns\[id]\page.tsx
"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
    ArrowLeft,
    Play,
    Pause,
    Copy,
    Settings,
    Users,
    Phone,
    Calendar,
    Clock,
    Target,
    CheckCircle,
    AlertCircle,
    Download,
    Plus,
    Trash2,
    MoreVertical,
    Sparkles,
    Zap,
    BarChart3,
    Mic,
    MessageSquare,
    CalendarCheck,
    Bot,
    Loader2,
    ExternalLink,
    RefreshCw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/hooks/use-toast"
import { useIsAuthenticated } from "@/hooks/use-is-authenticated"
import { useCampaigns } from "@/contexts/campaign-context"
import * as CampaignService from "@/services/campaign-service"

const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-16">
        <div className="relative">
            <div className="w-12 h-12 rounded-full border-4 border-cyan-500/20 border-t-cyan-500 animate-spin" />
            <Sparkles className="absolute inset-0 m-auto w-5 h-5 text-cyan-500" />
        </div>
    </div>
)

const StatCard = ({ icon: Icon, label, value, subValue, color }: { 
    icon: React.ElementType
    label: string
    value: string | number
    subValue?: string
    color: string
}) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-slate-800/50 p-4 shadow-lg"
    >
        <div className="flex items-start justify-between">
            <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
                {subValue && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subValue}</p>}
            </div>
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
                <Icon className="w-5 h-5 text-white" />
            </div>
        </div>
    </motion.div>
)

const StatusBadge = ({ status }: { status: string }) => {
    const config: Record<string, { color: string; dotColor: string }> = {
        active: { color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20', dotColor: 'bg-emerald-500' },
        paused: { color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20', dotColor: 'bg-amber-500' },
        completed: { color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20', dotColor: 'bg-blue-500' },
        queued: { color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20', dotColor: 'bg-orange-500' },
        draft: { color: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20', dotColor: 'bg-gray-500' },
    }
    const { color, dotColor } = config[status] || config.draft
    return (
        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border ${color}`}>
            <span className={`w-2 h-2 rounded-full ${dotColor} animate-pulse`} />
            {status?.charAt(0).toUpperCase() + status?.slice(1)}
        </div>
    )
}

const getStatusBadgeConfig = (status: string) => {
    const config: Record<string, { color: string; dotColor: string }> = {
        pending: { color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20', dotColor: 'bg-orange-500' },
        contacted: { color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20', dotColor: 'bg-emerald-500' },
        converted: { color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20', dotColor: 'bg-blue-500' },
        failed: { color: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20', dotColor: 'bg-red-500' },
    }
    return config[status] || config.pending
}

export default function CampaignDetailPage() {
    const params = useParams()
    const router = useRouter()
    const { token } = useIsAuthenticated()
    const { refreshCampaigns } = useCampaigns()
    const campaignId = params.id as string

    const [campaign, setCampaign] = useState<CampaignService.Campaign | null>(null)
    const [metrics, setMetrics] = useState<CampaignService.CampaignMetrics | null>(null)
    const [leads, setLeads] = useState<CampaignService.Lead[]>([])
    const [callLogs, setCallLogs] = useState<CampaignService.CallLog[]>([])
    const [bookings, setBookings] = useState<CampaignService.Booking[]>([])
    const [settings, setSettings] = useState<CampaignService.CampaignSettings | null>(null)
    const [loading, setLoading] = useState(true)
    const [leadsLoading, setLeadsLoading] = useState(false)
    const [actionLoading, setActionLoading] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState('overview')
    const [showAddLeadDialog, setShowAddLeadDialog] = useState(false)
    const [newLead, setNewLead] = useState({ first_name: '', last_name: '', email: '', phone: '', company: '' })

    const fetchCampaignData = useCallback(async () => {
        if (!token || !campaignId) return
        try {
            setLoading(true)
            const [campaignData, metricsData] = await Promise.all([
                CampaignService.getCampaignById(campaignId, token),
                CampaignService.getCampaignMetrics(campaignId, token).catch(() => null)
            ])
            setCampaign(campaignData)
            setMetrics(metricsData)
        } catch (error) {
            console.error('Error fetching campaign:', error)
            toast({ title: "Error", description: "Failed to load campaign", variant: "destructive" })
        } finally {
            setLoading(false)
        }
    }, [token, campaignId])

    const fetchLeads = useCallback(async () => {
        if (!token || !campaignId) return
        try {
            setLeadsLoading(true)
            console.log('Fetching leads for campaign:', campaignId)
            const response = await CampaignService.getCampaignLeads(campaignId, token)
            console.log('Leads response:', response)
            const leadsData = Array.isArray(response) ? response : (response.leads || [])
            setLeads(leadsData)
            console.log('Set leads:', leadsData.length)
        } catch (error) {
            console.error('Error fetching leads:', error)
            toast({ title: "Error", description: "Failed to load leads", variant: "destructive" })
        } finally {
            setLeadsLoading(false)
        }
    }, [token, campaignId])

    const fetchCallLogs = useCallback(async () => {
        if (!token || !campaignId) return
        try {
            const logs = await CampaignService.getCampaignCallLogs(campaignId, token, 100)
            setCallLogs(Array.isArray(logs) ? logs : [])
        } catch (error) { 
            console.error('Error fetching call logs:', error) 
        }
    }, [token, campaignId])

    const fetchBookings = useCallback(async () => {
        if (!token || !campaignId) return
        try {
            const data = await CampaignService.getCampaignBookings(campaignId, token)
            setBookings(Array.isArray(data) ? data : [])
        } catch (error) { 
            console.error('Error fetching bookings:', error) 
        }
    }, [token, campaignId])

    const fetchSettings = useCallback(async () => {
        if (!token || !campaignId) return
        try {
            const data = await CampaignService.getCampaignSettings(campaignId, token)
            setSettings(data)
        } catch (error) { 
            console.error('Error fetching settings:', error) 
        }
    }, [token, campaignId])

    useEffect(() => {
        if (token && campaignId) fetchCampaignData()
    }, [token, campaignId, fetchCampaignData])

    useEffect(() => {
        if (!token || !campaignId) return
        
        if (activeTab === 'leads') {
            fetchLeads()
        } else if (activeTab === 'calls') {
            fetchCallLogs()
        } else if (activeTab === 'bookings') {
            fetchBookings()
        } else if (activeTab === 'settings') {
            fetchSettings()
        }
    }, [activeTab, token, campaignId, fetchLeads, fetchCallLogs, fetchBookings, fetchSettings])

    const handleStartCampaign = async () => {
        if (!token) {
            toast({ title: "Error", description: "Not authenticated", variant: "destructive" })
            return
        }
        try {
            setActionLoading('start')
            console.log('Starting campaign:', campaignId)
            await CampaignService.startCampaign(campaignId, token)
            setCampaign((prev) => prev ? { ...prev, status: 'active' } : null)
            refreshCampaigns()
            toast({ title: "Success", description: "Campaign started successfully!" })
        } catch (error) {
            console.error('Error starting campaign:', error)
            const errorMessage = error instanceof Error ? error.message : "Failed to start campaign"
            toast({ title: "Error", description: errorMessage, variant: "destructive" })
        } finally {
            setActionLoading(null)
        }
    }

    const handlePauseCampaign = async () => {
        if (!token) {
            toast({ title: "Error", description: "Not authenticated", variant: "destructive" })
            return
        }
        try {
            setActionLoading('pause')
            console.log('Pausing campaign:', campaignId)
            await CampaignService.pauseCampaign(campaignId, token)
            setCampaign((prev) => prev ? { ...prev, status: 'paused' } : null)
            refreshCampaigns()
            toast({ title: "Success", description: "Campaign paused" })
        } catch (error) {
            console.error('Error pausing campaign:', error)
            const errorMessage = error instanceof Error ? error.message : "Failed to pause campaign"
            toast({ title: "Error", description: errorMessage, variant: "destructive" })
        } finally {
            setActionLoading(null)
        }
    }

    const handleResumeCampaign = async () => {
        if (!token) {
            toast({ title: "Error", description: "Not authenticated", variant: "destructive" })
            return
        }
        try {
            setActionLoading('resume')
            console.log('Resuming campaign:', campaignId)
            await CampaignService.resumeCampaign(campaignId, token)
            setCampaign((prev) => prev ? { ...prev, status: 'active' } : null)
            refreshCampaigns()
            toast({ title: "Success", description: "Campaign resumed" })
        } catch (error) {
            console.error('Error resuming campaign:', error)
            const errorMessage = error instanceof Error ? error.message : "Failed to resume campaign"
            toast({ title: "Error", description: errorMessage, variant: "destructive" })
        } finally {
            setActionLoading(null)
        }
    }

    const handleCompleteCampaign = async () => {
        if (!token) return
        try {
            setActionLoading('complete')
            await CampaignService.completeCampaign(campaignId, token)
            setCampaign((prev) => prev ? { ...prev, status: 'completed' } : null)
            refreshCampaigns()
            toast({ title: "Success", description: "Campaign completed" })
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to complete campaign"
            toast({ title: "Error", description: errorMessage, variant: "destructive" })
        } finally {
            setActionLoading(null)
        }
    }

    const handleDuplicateCampaign = async () => {
        if (!token) return
        try {
            setActionLoading('duplicate')
            const newCampaign = await CampaignService.duplicateCampaign(campaignId, token)
            refreshCampaigns()
            toast({ title: "Success", description: "Campaign duplicated" })
            router.push(`/campaigns/${newCampaign.id}`)
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to duplicate campaign"
            toast({ title: "Error", description: errorMessage, variant: "destructive" })
        } finally {
            setActionLoading(null)
        }
    }

    const handleAddLead = async () => {
        if (!token) return
        try {
            setActionLoading('addLead')
            await CampaignService.addLeadToCampaign(campaignId, newLead, token)
            setShowAddLeadDialog(false)
            setNewLead({ first_name: '', last_name: '', email: '', phone: '', company: '' })
            fetchLeads()
            toast({ title: "Success", description: "Lead added successfully" })
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to add lead"
            toast({ title: "Error", description: errorMessage, variant: "destructive" })
        } finally {
            setActionLoading(null)
        }
    }

    const handleExportLeads = async () => {
        if (!token) return
        try {
            setActionLoading('export')
            const blob = await CampaignService.exportCampaignLeads(campaignId, token)
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${campaign?.campaign_name || 'campaign'}_leads.csv`
            a.click()
            toast({ title: "Success", description: "Leads exported successfully" })
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to export leads"
            toast({ title: "Error", description: errorMessage, variant: "destructive" })
        } finally {
            setActionLoading(null)
        }
    }

    if (loading) return <div className="p-6 max-w-[1600px] mx-auto"><LoadingSpinner /></div>

    if (!campaign) {
        return (
            <div className="p-6 max-w-[1600px] mx-auto text-center py-20">
                <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Campaign not found</h2>
                <Button onClick={() => router.push('/campaigns')} className="mt-4"><ArrowLeft className="w-4 h-4 mr-2" />Back to Campaigns</Button>
            </div>
        )
    }

    return (
        <div className="p-4 lg:p-6 max-w-[1600px] mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-start gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.push('/campaigns')} className="rounded-xl"><ArrowLeft className="w-5 h-5" /></Button>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">{campaign.campaign_name}</h1>
                            <StatusBadge status={campaign.status} />
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{campaign.description}</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-2 flex-wrap">
                    {campaign.status === 'queued' && (
                        <Button 
                            onClick={handleStartCampaign} 
                            disabled={actionLoading === 'start'} 
                            className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white shadow-lg shadow-emerald-500/25"
                        >
                            {actionLoading === 'start' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
                            Start Campaign
                        </Button>
                    )}
                    
                    {campaign.status === 'active' && (
                        <Button 
                            onClick={handlePauseCampaign} 
                            disabled={actionLoading === 'pause'} 
                            variant="outline" 
                            className="rounded-xl border-amber-500/30 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10"
                        >
                            {actionLoading === 'pause' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Pause className="w-4 h-4 mr-2" />}
                            Pause Campaign
                        </Button>
                    )}
                    
                    {campaign.status === 'paused' && (
                        <Button 
                            onClick={handleResumeCampaign} 
                            disabled={actionLoading === 'resume'} 
                            className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25"
                        >
                            {actionLoading === 'resume' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
                            Resume Campaign
                        </Button>
                    )}
                    
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="rounded-xl"><MoreVertical className="w-4 h-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
                            <DropdownMenuItem onClick={handleDuplicateCampaign} disabled={actionLoading === 'duplicate'}>
                                <Copy className="w-4 h-4 mr-2" />Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setActiveTab('settings')}>
                                <Settings className="w-4 h-4 mr-2" />Settings
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {campaign.status !== 'completed' && (
                                <DropdownMenuItem onClick={handleCompleteCampaign} className="text-blue-600">
                                    <CheckCircle className="w-4 h-4 mr-2" />Mark Complete
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="text-red-600"><Trash2 className="w-4 h-4 mr-2" />Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 lg:gap-4">
                <StatCard icon={Users} label="Total Leads" value={metrics?.total_leads || campaign.metrics?.total_leads || leads.length || 0} color="from-cyan-500 to-blue-600" />
                <StatCard icon={Phone} label="Contacted" value={metrics?.contacted || campaign.metrics?.contacted || 0} subValue={`${metrics?.response_rate || 0}% response`} color="from-purple-500 to-indigo-600" />
                <StatCard icon={MessageSquare} label="Responded" value={metrics?.responded || 0} color="from-emerald-500 to-green-600" />
                <StatCard icon={CalendarCheck} label="Booked" value={metrics?.booked || campaign.metrics?.booked || 0} color="from-amber-500 to-orange-600" />
                <StatCard icon={CheckCircle} label="Converted" value={metrics?.converted || 0} subValue={`${metrics?.conversion_rate || 0}% rate`} color="from-pink-500 to-rose-600" />
                <StatCard icon={Clock} label="Avg Call Duration" value={`${Math.round(metrics?.avg_call_duration || 0)}s`} color="from-gray-500 to-slate-600" />
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="w-full">
                    <TabsList className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-slate-800/50 rounded-xl p-1.5 h-auto w-full flex">
                        <TabsTrigger value="overview" className="flex-1 rounded-lg py-3 px-2 text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/10 data-[state=active]:to-blue-500/10 data-[state=active]:text-cyan-600 dark:data-[state=active]:text-cyan-400 data-[state=active]:shadow-sm transition-all flex items-center justify-center gap-2">
                            <BarChart3 className="w-4 h-4" /><span className="hidden sm:inline">Overview</span>
                        </TabsTrigger>
                        <TabsTrigger value="leads" className="flex-1 rounded-lg py-3 px-2 text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/10 data-[state=active]:to-blue-500/10 data-[state=active]:text-cyan-600 dark:data-[state=active]:text-cyan-400 data-[state=active]:shadow-sm transition-all flex items-center justify-center gap-2">
                            <Users className="w-4 h-4" /><span className="hidden sm:inline">Leads</span>
                        </TabsTrigger>
                        <TabsTrigger value="calls" className="flex-1 rounded-lg py-3 px-2 text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/10 data-[state=active]:to-blue-500/10 data-[state=active]:text-cyan-600 dark:data-[state=active]:text-cyan-400 data-[state=active]:shadow-sm transition-all flex items-center justify-center gap-2">
                            <Phone className="w-4 h-4" /><span className="hidden sm:inline">Call Logs</span>
                        </TabsTrigger>
                        <TabsTrigger value="bookings" className="flex-1 rounded-lg py-3 px-2 text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/10 data-[state=active]:to-blue-500/10 data-[state=active]:text-cyan-600 dark:data-[state=active]:text-cyan-400 data-[state=active]:shadow-sm transition-all flex items-center justify-center gap-2">
                            <Calendar className="w-4 h-4" /><span className="hidden sm:inline">Bookings</span>
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="flex-1 rounded-lg py-3 px-2 text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/10 data-[state=active]:to-blue-500/10 data-[state=active]:text-cyan-600 dark:data-[state=active]:text-cyan-400 data-[state=active]:shadow-sm transition-all flex items-center justify-center gap-2">
                            <Settings className="w-4 h-4" /><span className="hidden sm:inline">Settings</span>
                        </TabsTrigger>
                    </TabsList>
                </div>

                {/* Overview Tab */}
                <TabsContent value="overview" className="mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-slate-800/50 p-6 shadow-lg">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Target className="w-5 h-5 text-cyan-500" />Campaign Details</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-slate-800"><span className="text-sm text-gray-500">Status</span><StatusBadge status={campaign.status} /></div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-slate-800"><span className="text-sm text-gray-500">Agent</span><span className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2"><Bot className="w-4 h-4 text-cyan-500" />{campaign.agent_name || 'AI Agent'}</span></div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-slate-800"><span className="text-sm text-gray-500">Created</span><span className="text-sm font-medium text-gray-900 dark:text-white">{new Date(campaign.created_at).toLocaleDateString()}</span></div>
                                <div className="flex justify-between items-center py-2"><span className="text-sm text-gray-500">Last Updated</span><span className="text-sm font-medium text-gray-900 dark:text-white">{new Date(campaign.updated_at).toLocaleDateString()}</span></div>
                            </div>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-slate-800/50 p-6 shadow-lg">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Zap className="w-5 h-5 text-amber-500" />Quick Actions</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <Button variant="outline" className="rounded-xl h-auto py-4 flex-col gap-2" onClick={() => setShowAddLeadDialog(true)}><Plus className="w-5 h-5 text-cyan-500" /><span className="text-xs">Add Lead</span></Button>
                                <Button variant="outline" className="rounded-xl h-auto py-4 flex-col gap-2" onClick={handleExportLeads} disabled={actionLoading === 'export'}><Download className="w-5 h-5 text-purple-500" /><span className="text-xs">Export Leads</span></Button>
                                <Button variant="outline" className="rounded-xl h-auto py-4 flex-col gap-2" onClick={() => setActiveTab('calls')}><Phone className="w-5 h-5 text-emerald-500" /><span className="text-xs">View Calls</span></Button>
                                <Button variant="outline" className="rounded-xl h-auto py-4 flex-col gap-2" onClick={() => setActiveTab('bookings')}><Calendar className="w-5 h-5 text-amber-500" /><span className="text-xs">View Bookings</span></Button>
                            </div>
                        </motion.div>
                    </div>
                </TabsContent>

                {/* Leads Tab */}
                <TabsContent value="leads" className="mt-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-slate-800/50 shadow-lg">
                        <div className="p-4 lg:p-6 border-b border-gray-200/50 dark:border-slate-800/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <h3 className="font-semibold text-gray-900 dark:text-white text-lg">Campaign Leads</h3>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="rounded-lg" onClick={fetchLeads} disabled={leadsLoading}>
                                    <RefreshCw className={`w-4 h-4 mr-1 ${leadsLoading ? 'animate-spin' : ''}`} />Refresh
                                </Button>
                                <Button variant="outline" size="sm" className="rounded-lg" onClick={handleExportLeads} disabled={actionLoading === 'export'}>
                                    <Download className="w-4 h-4 mr-1" />Export
                                </Button>
                                <Button size="sm" className="rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white" onClick={() => setShowAddLeadDialog(true)}>
                                    <Plus className="w-4 h-4 mr-1" />Add Lead
                                </Button>
                            </div>
                        </div>
                        <div className="p-4 lg:p-6">
                            {leadsLoading ? (
                                <LoadingSpinner />
                            ) : leads.length === 0 ? (
                                <div className="text-center py-12">
                                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No leads yet</h3>
                                    <p className="text-gray-500 dark:text-gray-400 mb-4">Add leads to start your campaign</p>
                                    <Button onClick={() => setShowAddLeadDialog(true)} className="rounded-xl"><Plus className="w-4 h-4 mr-2" />Add First Lead</Button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {leads.map((lead, idx) => {
                                        const statusConfig = getStatusBadgeConfig(lead.status)
                                        const displayName = lead.first_name || lead.last_name 
                                            ? `${lead.first_name || ''} ${lead.last_name || ''}`.trim()
                                            : 'Unknown Lead'
                                        const initial = displayName.charAt(0).toUpperCase() || '?'
                                        
                                        return (
                                            <motion.div 
                                                key={lead.id} 
                                                initial={{ opacity: 0, y: 10 }} 
                                                animate={{ opacity: 1, y: 0 }} 
                                                transition={{ delay: idx * 0.03 }} 
                                                className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-medium flex-shrink-0">
                                                        {initial}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-medium text-gray-900 dark:text-white truncate">{displayName}</p>
                                                        <p className="text-sm text-gray-500 truncate">{lead.email || 'No email'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4 sm:flex-shrink-0">
                                                    <div className="text-right hidden sm:block">
                                                        <p className="text-sm text-gray-500">{lead.phone || 'No phone'}</p>
                                                        <p className="text-xs text-gray-400">{lead.call_attempts || 0} calls</p>
                                                    </div>
                                                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${statusConfig.color}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotColor}`} />
                                                        {lead.status?.charAt(0).toUpperCase() + lead.status?.slice(1) || 'Pending'}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </TabsContent>

                {/* Call Logs Tab */}
                <TabsContent value="calls" className="mt-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-slate-800/50 shadow-lg">
                        <div className="p-4 lg:p-6 border-b border-gray-200/50 dark:border-slate-800/50">
                            <h3 className="font-semibold text-gray-900 dark:text-white text-lg">Call History</h3>
                        </div>
                        <div className="p-4 lg:p-6">
                            {callLogs.length === 0 ? (
                                <div className="text-center py-12">
                                    <Phone className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No calls yet</h3>
                                    <p className="text-gray-500 dark:text-gray-400">Calls will appear here once the campaign starts</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {callLogs.map((log, idx) => (
                                        <motion.div key={log.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }} className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${log.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : log.status === 'failed' ? 'bg-red-500/10 text-red-500' : 'bg-gray-500/10 text-gray-500'}`}><Phone className="w-4 h-4" /></div>
                                                    <div><p className="font-medium text-gray-900 dark:text-white">{log.lead_name}</p><p className="text-sm text-gray-500">{log.phone}</p></div>
                                                </div>
                                                <div className="text-right"><p className="text-sm font-medium text-gray-900 dark:text-white">{log.duration}s</p><p className="text-xs text-gray-500">{new Date(log.started_at).toLocaleTimeString()}</p></div>
                                            </div>
                                            {log.recording_url && <Button variant="ghost" size="sm" className="mt-2 text-cyan-600"><Mic className="w-4 h-4 mr-1" />Play Recording</Button>}
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </TabsContent>

                {/* Bookings Tab */}
                <TabsContent value="bookings" className="mt-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-slate-800/50 shadow-lg">
                        <div className="p-4 lg:p-6 border-b border-gray-200/50 dark:border-slate-800/50">
                            <h3 className="font-semibold text-gray-900 dark:text-white text-lg">Scheduled Meetings</h3>
                        </div>
                        <div className="p-4 lg:p-6">
                            {bookings.length === 0 ? (
                                <div className="text-center py-12">
                                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No bookings yet</h3>
                                    <p className="text-gray-500 dark:text-gray-400">Bookings will appear here when leads schedule meetings</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {bookings.map((booking, idx) => (
                                        <motion.div key={booking.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }} className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white"><Calendar className="w-5 h-5" /></div>
                                                    <div><p className="font-medium text-gray-900 dark:text-white">{booking.lead_name}</p><p className="text-sm text-gray-500">{booking.email}</p></div>
                                                </div>
                                                <div className="text-right"><p className="font-medium text-gray-900 dark:text-white">{new Date(booking.scheduled_at).toLocaleDateString()}</p><p className="text-sm text-gray-500">{new Date(booking.scheduled_at).toLocaleTimeString()} • {booking.duration_minutes}min</p></div>
                                            </div>
                                            {booking.meeting_link && <Button variant="ghost" size="sm" className="mt-3 text-cyan-600" asChild><a href={booking.meeting_link} target="_blank" rel="noopener noreferrer"><ExternalLink className="w-4 h-4 mr-1" />Join Meeting</a></Button>}
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </TabsContent>

                {/* Settings Tab */}
                <TabsContent value="settings" className="mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-slate-800/50 p-6 shadow-lg">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Phone className="w-5 h-5 text-purple-500" />Call Settings</h3>
                            <div className="space-y-4">
                                <div><Label className="text-sm">Max Call Attempts</Label><Input type="number" value={settings?.call?.max_call_attempts || 3} className="mt-1 rounded-lg" readOnly /></div>
                                <div><Label className="text-sm">Call Interval (hours)</Label><Input type="number" value={settings?.call?.call_interval_hours || 24} className="mt-1 rounded-lg" readOnly /></div>
                                <div className="flex items-center justify-between"><Label className="text-sm">Call Recording</Label><Switch checked={settings?.call?.call_recording_enabled || false} disabled /></div>
                            </div>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-slate-800/50 p-6 shadow-lg">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-cyan-500" />Schedule Settings</h3>
                            <div className="space-y-4">
                                <div><Label className="text-sm">Working Hours</Label><p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{settings?.schedule?.working_hours_start || '09:00'} - {settings?.schedule?.working_hours_end || '18:00'}</p></div>
                                <div><Label className="text-sm">Timezone</Label><p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{settings?.schedule?.timezone || 'UTC'}</p></div>
                                <div><Label className="text-sm">Max Concurrent Calls</Label><p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{settings?.schedule?.max_concurrent_calls || 5}</p></div>
                            </div>
                        </motion.div>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Add Lead Dialog */}
            <Dialog open={showAddLeadDialog} onOpenChange={setShowAddLeadDialog}>
                <DialogContent className="sm:max-w-md p-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl overflow-hidden">
                    <div className="h-1.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />
                    <div className="p-6">
                        <DialogHeader className="mb-4">
                            <DialogTitle className="text-xl font-bold">Add New Lead</DialogTitle>
                            <DialogDescription>Add a lead to this campaign</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div><Label>First Name</Label><Input value={newLead.first_name} onChange={(e) => setNewLead({ ...newLead, first_name: e.target.value })} className="mt-1 rounded-lg" placeholder="John" /></div>
                                <div><Label>Last Name</Label><Input value={newLead.last_name} onChange={(e) => setNewLead({ ...newLead, last_name: e.target.value })} className="mt-1 rounded-lg" placeholder="Doe" /></div>
                            </div>
                            <div><Label>Email</Label><Input type="email" value={newLead.email} onChange={(e) => setNewLead({ ...newLead, email: e.target.value })} className="mt-1 rounded-lg" placeholder="john@example.com" /></div>
                            <div><Label>Phone</Label><Input value={newLead.phone} onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })} className="mt-1 rounded-lg" placeholder="+1234567890" /></div>
                            <div><Label>Company</Label><Input value={newLead.company} onChange={(e) => setNewLead({ ...newLead, company: e.target.value })} className="mt-1 rounded-lg" placeholder="Acme Inc" /></div>
                        </div>
                        <DialogFooter className="mt-6">
                            <Button variant="outline" onClick={() => setShowAddLeadDialog(false)} className="rounded-xl">Cancel</Button>
                            <Button onClick={handleAddLead} disabled={actionLoading === 'addLead'} className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
                                {actionLoading === 'addLead' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}Add Lead
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}