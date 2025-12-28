// app\(settings)\campaigns\page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
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
    AlertCircle,
    MoreVertical,
    Target,
    Users,
    RefreshCw,
    CalendarCheck,
    Eye,
    Edit,
    Sparkles,
    Zap,
    Search,
    Bot,
    Loader2,
    ChevronLeft,
    ChevronRight,
    Database
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/hooks/use-toast"
import { useCampaigns } from "@/contexts/campaign-context"
import { useAgents } from "@/contexts/agent-context"
import { useActivities } from "@/contexts/activity-context"
import { useIsAuthenticated } from "@/hooks/use-is-authenticated"
import { CampaignFormState, defaultBookingConfig, defaultAutomationConfig, defaultDataMapping, FormValidationErrors } from "@/types/campaign"
import { FileUploadComponent, DataMappingComponent, BookingConfigComponent, AutomationConfigComponent } from "@/components/campaigns/form-components"
import { CampaignEdit } from "@/components/campaigns/campaign-edit"
import * as CampaignService from "@/services/campaign-service"
import { logCampaignActivity } from "@/services/activity-service"

// ============================================
// WIZARD STEPS CONFIGURATION
// ============================================
const WIZARD_STEPS = [
    { id: 'basics', title: 'Basics', icon: Target, description: 'Campaign name, agent & leads' },
    { id: 'data', title: 'Data Mapping', icon: Database, description: 'Map CSV columns to fields' },
    { id: 'booking', title: 'Booking', icon: Calendar, description: 'Calendar & meeting settings' },
    { id: 'automation', title: 'Automation', icon: Zap, description: 'Email & call automation' }
]

// ============================================
// HELPER COMPONENTS
// ============================================
const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-16">
        <div className="relative">
            <div className="w-12 h-12 rounded-full border-4 border-cyan-500/20 border-t-cyan-500 animate-spin" />
            <Sparkles className="absolute inset-0 m-auto w-5 h-5 text-cyan-500" />
        </div>
    </div>
)

const EmptyState = ({ onCreateClick }: { onCreateClick: () => void }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16"
    >
        <div className="relative mb-6">
            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse" />
            <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 flex items-center justify-center">
                <Target className="w-10 h-10 text-cyan-500" />
            </div>
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No campaigns yet</h3>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm mb-6">
            Create your first campaign to start automating your sales outreach
        </p>
        <Button 
            onClick={onCreateClick}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-cyan-500/25 flex items-center gap-2"
        >
            <Plus className="w-5 h-5" />
            Create Your First Campaign
        </Button>
    </motion.div>
)

const StatCard = ({ icon: Icon, label, value, color, delay = 0 }: { 
    icon: React.ElementType
    label: string
    value: string | number
    color: string
    delay?: number
}) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        whileHover={{ y: -2, scale: 1.02 }}
        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-slate-800/50 p-4 lg:p-5 shadow-lg"
    >
        <div className="flex items-center justify-between">
            <div>
                <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">{label}</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
            </div>
            <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
                <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
        </div>
    </motion.div>
)

const getStatusConfig = (status: string) => {
    switch (status) {
        case 'active':
            return { 
                color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
                dotColor: 'bg-emerald-500'
            }
        case 'paused':
        case 'inactive':
            return { 
                color: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
                dotColor: 'bg-red-500'
            }
        case 'completed':
            return { 
                color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
                dotColor: 'bg-blue-500'
            }
        case 'queued':
            return { 
                color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
                dotColor: 'bg-orange-500'
            }
        case 'draft':
            return { 
                color: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20',
                dotColor: 'bg-gray-500'
            }
        default:
            return { 
                color: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20',
                dotColor: 'bg-gray-500'
            }
    }
}

// ============================================
// MAIN CAMPAIGNS PAGE COMPONENT
// ============================================
export default function CampaignsPage() {
    const router = useRouter()
    const { token } = useIsAuthenticated()
    const { campaigns, loading, error, createNewCampaign, validateForm, refreshCampaigns } = useCampaigns()
    const { agents } = useAgents()
    const { refreshActivities } = useActivities()

    // UI State
    const [selectedCampaign, setSelectedCampaign] = useState<any>(null)
    const [showCreateDialog, setShowCreateDialog] = useState(false)
    const [showSettingsDialog, setShowSettingsDialog] = useState(false)
    const [showLeadsDialog, setShowLeadsDialog] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formErrors, setFormErrors] = useState<FormValidationErrors>({})
    const [searchQuery, setSearchQuery] = useState('')
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [actionLoading, setActionLoading] = useState<string | null>(null)
    
    // Wizard State
    const [currentStep, setCurrentStep] = useState(0)

    // Form State
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

    // Auto-refresh campaigns when component mounts
    useEffect(() => {
        if (token) {
            console.log('Campaigns page mounted, refreshing campaigns...')
            refreshCampaigns()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token])

    // Filter campaigns based on search query
    const filteredCampaigns = campaigns.filter(campaign =>
        campaign.campaign_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // ============================================
    // CSV FILE HANDLING
    // ============================================
    const parseCSVFile = (file: File) => {
        const reader = new FileReader()
        reader.onload = (e) => {
            const text = e.target?.result as string
            const rows = text.split('\n').map(row => row.split(','))
            const headers = rows[0].map(h => h.trim())
            const data = rows.slice(1).map(row => {
                const obj: Record<string, string> = {}
                headers.forEach((header, index) => {
                    obj[header] = row[index]?.trim() || ''
                })
                return obj
            }).filter(row => Object.values(row).some(v => v))

            setFormData(prev => ({
                ...prev,
                csv_headers: headers,
                csv_data: data
            }))
        }
        reader.readAsText(file)
    }

    const handleFileSelect = (file: File) => {
        setFormData(prev => ({ ...prev, csv_file: file }))
        parseCSVFile(file)
        toast({ title: "CSV Uploaded", description: `Loaded ${file.name}` })
    }

    // ============================================
    // WIZARD NAVIGATION & VALIDATION
    // ============================================
    const validateCurrentStep = (): boolean => {
        const errors: FormValidationErrors = {}

        switch (currentStep) {
            case 0: // Basics
                if (!formData.campaign_name.trim()) {
                    errors.campaign_name = 'Campaign name is required'
                }
                if (!formData.agent_id) {
                    errors.agent_id = 'Please select an agent'
                }
                if (!formData.csv_file) {
                    errors.csv_file = 'CSV file is required'
                }
                break
            case 1: // Data Mapping
                const requiredMappings = formData.data_mapping.filter(m => m.required)
                const mappedRequired = requiredMappings.filter(m => m.csv_column)
                if (mappedRequired.length !== requiredMappings.length) {
                    errors.data_mapping = 'Please map all required fields'
                }
                break
            case 2: // Booking - optional, no required validation
                if (formData.booking_enabled) {
                    if (formData.booking_config.send_invite_to_team &&
                        formData.booking_config.team_email_addresses.length === 0) {
                        errors.booking_config = 'Team email addresses are required when team invites are enabled'
                    }
                }
                break
            case 3: // Automation
                if (!formData.automation_config.email_template.trim()) {
                    errors.automation_config = 'Email template is required'
                }
                if (!formData.automation_config.call_script.trim()) {
                    errors.automation_config = 'Call script is required'
                }
                break
        }

        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleNextStep = () => {
        if (validateCurrentStep()) {
            setCurrentStep(prev => Math.min(prev + 1, WIZARD_STEPS.length - 1))
            setFormErrors({})
        } else {
            toast({ 
                title: "Please complete required fields", 
                description: "Fix the errors before proceeding", 
                variant: "destructive" 
            })
        }
    }

    const handlePrevStep = () => {
        setFormErrors({})
        setCurrentStep(prev => Math.max(prev - 1, 0))
    }

    const resetWizard = () => {
        setCurrentStep(0)
        setFormErrors({})
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
        })
    }

    // ============================================
    // CAMPAIGN ACTIONS
    // ============================================
    const handleRefresh = async () => {
        setIsRefreshing(true)
        await refreshCampaigns()
        setTimeout(() => setIsRefreshing(false), 1000)
    }

    const handleCreateCampaign = async () => {
        try {
            setIsSubmitting(true)
            setFormErrors({})

            // Final validation
            const errors = validateForm(formData)
            if (Object.keys(errors).length > 0) {
                setFormErrors(errors)
                toast({ title: "Validation Error", description: "Please fix the errors in the form", variant: "destructive" })
                return
            }

            const success = await createNewCampaign(formData)

            if (success) {
                setShowCreateDialog(false)
                resetWizard()
                toast({ title: "Success", description: "Campaign created successfully!" })
            }
        } catch (error) {
            console.error('Error creating campaign:', error)
            toast({ title: "Error", description: "Failed to create campaign", variant: "destructive" })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleStartCampaign = async (campaignId: string) => {
        if (!token) {
            toast({ title: "Error", description: "Please login first", variant: "destructive" })
            return
        }
        
        const campaign = campaigns.find(c => c.id === campaignId)
        const campaignName = campaign?.campaign_name || 'Unknown Campaign'
        
        try {
            setActionLoading(`start-${campaignId}`)
            console.log('Starting campaign:', campaignId)
            await CampaignService.startCampaign(campaignId, token)
            
            await logCampaignActivity(token, campaignName, campaignId, 'started')
                .catch(err => console.error('Failed to log activity:', err))
            
            await refreshCampaigns()
            await refreshActivities()
            toast({ title: "Success", description: "Campaign started successfully!" })
        } catch (error: any) {
            console.error('Failed to start campaign:', error)
            toast({ title: "Error", description: error.message || "Failed to start campaign", variant: "destructive" })
        } finally {
            setActionLoading(null)
        }
    }

    const handlePauseCampaign = async (campaignId: string) => {
        if (!token) {
            toast({ title: "Error", description: "Please login first", variant: "destructive" })
            return
        }
        
        const campaign = campaigns.find(c => c.id === campaignId)
        const campaignName = campaign?.campaign_name || 'Unknown Campaign'
        
        try {
            setActionLoading(`pause-${campaignId}`)
            console.log('Pausing campaign:', campaignId)
            await CampaignService.pauseCampaign(campaignId, token)
            
            await logCampaignActivity(token, campaignName, campaignId, 'paused')
                .catch(err => console.error('Failed to log activity:', err))
            
            await refreshCampaigns()
            await refreshActivities()
            toast({ title: "Success", description: "Campaign paused" })
        } catch (error: any) {
            console.error('Failed to pause campaign:', error)
            toast({ title: "Error", description: error.message || "Failed to pause campaign", variant: "destructive" })
        } finally {
            setActionLoading(null)
        }
    }

    const handleResumeCampaign = async (campaignId: string) => {
        if (!token) {
            toast({ title: "Error", description: "Please login first", variant: "destructive" })
            return
        }
        
        const campaign = campaigns.find(c => c.id === campaignId)
        const campaignName = campaign?.campaign_name || 'Unknown Campaign'
        
        try {
            setActionLoading(`resume-${campaignId}`)
            console.log('Resuming campaign:', campaignId)
            await CampaignService.resumeCampaign(campaignId, token)
            
            await logCampaignActivity(token, campaignName, campaignId, 'resumed')
                .catch(err => console.error('Failed to log activity:', err))
            
            await refreshCampaigns()
            await refreshActivities()
            toast({ title: "Success", description: "Campaign resumed" })
        } catch (error: any) {
            console.error('Failed to resume campaign:', error)
            toast({ title: "Error", description: error.message || "Failed to resume campaign", variant: "destructive" })
        } finally {
            setActionLoading(null)
        }
    }

    const handleViewCampaign = (campaignId: string) => {
        router.push(`/campaigns/${campaignId}`)
    }

    // ============================================
    // MOBILE CAMPAIGN CARD COMPONENT
    // ============================================
    const CampaignCard = ({ campaign, index }: { campaign: any; index: number }) => {
        const statusConfig = getStatusConfig(campaign.status)
        const isStartLoading = actionLoading === `start-${campaign.id}`
        const isPauseLoading = actionLoading === `pause-${campaign.id}`
        const isResumeLoading = actionLoading === `resume-${campaign.id}`
        const isLoading = isStartLoading || isPauseLoading || isResumeLoading
        
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -2 }}
                className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-slate-800/50 p-4 lg:p-5 shadow-lg hover:shadow-xl hover:border-cyan-500/30 dark:hover:border-cyan-500/30 transition-all duration-300"
            >
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base lg:text-lg text-gray-900 dark:text-white truncate">
                            {campaign.campaign_name}
                        </h3>
                        <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                            {campaign.description}
                        </p>
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium mt-3 border ${statusConfig.color}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotColor} animate-pulse`} />
                            {campaign.status?.charAt(0).toUpperCase() + campaign.status?.slice(1)}
                        </div>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="ml-2 h-8 w-8 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800">
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-gray-200/50 dark:border-slate-700/50">
                            {campaign.status === 'queued' && (
                                <DropdownMenuItem onClick={() => handleStartCampaign(campaign.id)} className="text-emerald-600 dark:text-emerald-400">
                                    <Play className="w-4 h-4 mr-2" />Start Campaign
                                </DropdownMenuItem>
                            )}
                            {campaign.status === 'active' && (
                                <DropdownMenuItem onClick={() => handlePauseCampaign(campaign.id)} className="text-amber-600 dark:text-amber-400">
                                    <Pause className="w-4 h-4 mr-2" />Pause Campaign
                                </DropdownMenuItem>
                            )}
                            {(campaign.status === 'paused' || (campaign.status as string) === 'inactive') && (
                                <DropdownMenuItem onClick={() => handleResumeCampaign(campaign.id)} className="text-cyan-600 dark:text-cyan-400">
                                    <Play className="w-4 h-4 mr-2" />Resume Campaign
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => { setSelectedCampaign(campaign); setShowLeadsDialog(true) }}>
                                <Users className="w-4 h-4 mr-2" />View Leads
                            </DropdownMenuItem>
                            <CampaignEdit
                                campaign={campaign}
                                trigger={
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                        <Edit className="w-4 h-4 mr-2" />Edit Campaign
                                    </DropdownMenuItem>
                                }
                            />
                            <DropdownMenuItem onClick={() => { setSelectedCampaign(campaign); setShowSettingsDialog(true) }}>
                                <Settings className="w-4 h-4 mr-2" />Settings
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600 dark:text-red-400">
                                <Trash2 className="w-4 h-4 mr-2" />Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-4 gap-2 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
                    <div className="text-center">
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{campaign.metrics?.total_leads || 0}</p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">Leads</p>
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{campaign.metrics?.contacted || 0}</p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">Contacted</p>
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-bold text-cyan-600 dark:text-cyan-400">{campaign.metrics?.booked || 0}</p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">Booked</p>
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{campaign.metrics?.response_rate || 0}%</p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">Response</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 rounded-lg border-gray-200 dark:border-slate-700 hover:border-cyan-500/50 hover:bg-cyan-50 dark:hover:bg-cyan-500/10"
                        onClick={() => handleViewCampaign(campaign.id)}
                    >
                        <Eye className="w-4 h-4 mr-1.5" />View
                    </Button>
                    
                    {campaign.status === 'queued' && (
                        <Button
                            size="sm"
                            className="flex-1 rounded-lg bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white shadow-lg shadow-emerald-500/25"
                            onClick={() => handleStartCampaign(campaign.id)}
                            disabled={isLoading}
                        >
                            {isStartLoading ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Play className="w-4 h-4 mr-1.5" />}
                            Start
                        </Button>
                    )}
                    
                    {campaign.status === 'active' && (
                        <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 rounded-lg border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10"
                            onClick={() => handlePauseCampaign(campaign.id)}
                            disabled={isLoading}
                        >
                            {isPauseLoading ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Pause className="w-4 h-4 mr-1.5" />}
                            Pause
                        </Button>
                    )}
                    
                    {(campaign.status === 'paused' || (campaign.status as string) === 'inactive') && (
                        <Button
                            size="sm"
                            className="flex-1 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25"
                            onClick={() => handleResumeCampaign(campaign.id)}
                            disabled={isLoading}
                        >
                            {isResumeLoading ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Play className="w-4 h-4 mr-1.5" />}
                            Resume
                        </Button>
                    )}
                </div>
            </motion.div>
        )
    }

    // ============================================
    // RENDER
    // ============================================
    return (
        <div className="p-4 lg:p-6 max-w-[1600px] mx-auto space-y-6">
            {/* ============================================ */}
            {/* PAGE HEADER */}
            {/* ============================================ */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-2xl lg:text-3xl font-bold">
                        <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">Sales</span>
                        <span className="text-gray-900 dark:text-white ml-2">Campaigns</span>
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Automate your outreach and booking processes</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-2">
                    <Button variant="outline" onClick={handleRefresh} disabled={loading || isRefreshing} className="rounded-xl border-gray-200 dark:border-slate-700">
                        <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <Button onClick={() => setShowCreateDialog(true)} className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium shadow-lg shadow-cyan-500/25">
                        <Plus className="w-4 h-4 mr-2" />
                        New Campaign
                    </Button>
                </motion.div>
            </div>

            {/* ============================================ */}
            {/* STATS CARDS */}
            {/* ============================================ */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                <StatCard icon={Target} label="Total Campaigns" value={campaigns.length} color="from-cyan-500 to-blue-600" delay={0} />
                <StatCard icon={Zap} label="Active" value={campaigns.filter(c => c.status === 'active').length} color="from-emerald-500 to-green-600" delay={0.1} />
                <StatCard icon={Users} label="Total Leads" value={campaigns.reduce((acc, c) => acc + (c.metrics?.total_leads || 0), 0)} color="from-purple-500 to-indigo-600" delay={0.2} />
                <StatCard icon={CalendarCheck} label="Bookings" value={campaigns.reduce((acc, c) => acc + (c.metrics?.booked || 0), 0)} color="from-amber-500 to-orange-600" delay={0.3} />
            </div>

            {/* ============================================ */}
            {/* CAMPAIGNS LIST */}
            {/* ============================================ */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-slate-800/50 shadow-xl overflow-hidden">
                {/* Card Header */}
                <div className="p-4 lg:p-6 border-b border-gray-200/50 dark:border-slate-800/50">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
                                <Target className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your Campaigns</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Manage and monitor your campaigns</p>
                            </div>
                        </div>
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input placeholder="Search campaigns..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-xl" />
                        </div>
                    </div>
                </div>

                {/* Card Content */}
                <div className="p-4 lg:p-6">
                    {loading ? (
                        <LoadingSpinner />
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-4">
                                <AlertCircle className="w-8 h-8 text-red-500" />
                            </div>
                            <p className="text-sm text-red-600 dark:text-red-400 mb-4">{error}</p>
                            <Button variant="outline" onClick={handleRefresh} className="rounded-xl">
                                <RefreshCw className="w-4 h-4 mr-2" />Retry
                            </Button>
                        </div>
                    ) : filteredCampaigns.length === 0 ? (
                        searchQuery ? (
                            <div className="text-center py-12">
                                <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No campaigns found</h3>
                                <p className="text-gray-500 dark:text-gray-400">Try adjusting your search</p>
                                <Button variant="ghost" onClick={() => setSearchQuery('')} className="mt-4 text-cyan-600 dark:text-cyan-400">Clear search</Button>
                            </div>
                        ) : (
                            <EmptyState onCreateClick={() => setShowCreateDialog(true)} />
                        )
                    ) : (
                        <>
                            {/* Mobile View */}
                            <div className="block xl:hidden">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {filteredCampaigns.map((campaign, index) => (
                                        <CampaignCard key={campaign.id} campaign={campaign} index={index} />
                                    ))}
                                </div>
                            </div>

                            {/* Desktop Table */}
                            <div className="hidden xl:block -mx-4 lg:-mx-6">
                                <Table className="w-full">
                                    <TableHeader>
                                        <TableRow className="border-gray-200/50 dark:border-slate-800/50 bg-gray-50/50 dark:bg-slate-800/30">
                                            <TableHead className="text-gray-600 dark:text-gray-400 font-semibold pl-6 w-[22%]">Campaign</TableHead>
                                            <TableHead className="text-gray-600 dark:text-gray-400 font-semibold w-[12%]">Status</TableHead>
                                            <TableHead className="text-gray-600 dark:text-gray-400 font-semibold text-center w-[10%]">Leads</TableHead>
                                            <TableHead className="text-gray-600 dark:text-gray-400 font-semibold text-center w-[12%]">Contacted</TableHead>
                                            <TableHead className="text-gray-600 dark:text-gray-400 font-semibold text-center w-[10%]">Booked</TableHead>
                                            <TableHead className="text-gray-600 dark:text-gray-400 font-semibold text-center w-[12%]">Response</TableHead>
                                            <TableHead className="text-gray-600 dark:text-gray-400 font-semibold text-right pr-6 w-[22%]">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredCampaigns.map((campaign) => {
                                            const statusConfig = getStatusConfig(campaign.status)
                                            const isStartLoading = actionLoading === `start-${campaign.id}`
                                            const isPauseLoading = actionLoading === `pause-${campaign.id}`
                                            const isResumeLoading = actionLoading === `resume-${campaign.id}`
                                            const isLoading = isStartLoading || isPauseLoading || isResumeLoading
                                            
                                            return (
                                                <TableRow
                                                    key={campaign.id}
                                                    className="border-gray-200/50 dark:border-slate-800/50 hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                                                    onClick={() => handleViewCampaign(campaign.id)}
                                                >
                                                    <TableCell className="py-5 pl-6">
                                                        <div>
                                                            <p className="font-semibold text-gray-900 dark:text-white">{campaign.campaign_name}</p>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[250px]">{campaign.description}</p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-5">
                                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${statusConfig.color}`}>
                                                            <span className={`w-2 h-2 rounded-full ${statusConfig.dotColor} animate-pulse`} />
                                                            {campaign.status?.charAt(0).toUpperCase() + campaign.status?.slice(1)}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-gray-900 dark:text-white font-semibold text-center py-5">{campaign.metrics?.total_leads || 0}</TableCell>
                                                    <TableCell className="text-gray-900 dark:text-white text-center py-5">{campaign.metrics?.contacted || 0}</TableCell>
                                                    <TableCell className="text-cyan-600 dark:text-cyan-400 font-semibold text-center py-5">{campaign.metrics?.booked || 0}</TableCell>
                                                    <TableCell className="text-emerald-600 dark:text-emerald-400 font-semibold text-center py-5">{campaign.metrics?.response_rate || 0}%</TableCell>
                                                    <TableCell onClick={(e) => e.stopPropagation()} className="py-5 pr-6">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); handleViewCampaign(campaign.id) }} className="rounded-lg border-cyan-500/30 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-500/10">
                                                                <Eye className="w-4 h-4 mr-1.5" />View
                                                            </Button>
                                                            
                                                            {campaign.status === 'queued' && (
                                                                <Button 
                                                                    size="sm" 
                                                                    onClick={(e) => { e.stopPropagation(); handleStartCampaign(campaign.id) }} 
                                                                    disabled={isLoading}
                                                                    className="rounded-lg bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white shadow-lg shadow-emerald-500/25"
                                                                >
                                                                    {isStartLoading ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Play className="w-4 h-4 mr-1.5" />}
                                                                    Start
                                                                </Button>
                                                            )}
                                                            
                                                            {campaign.status === 'active' && (
                                                                <Button 
                                                                    size="sm" 
                                                                    variant="outline" 
                                                                    onClick={(e) => { e.stopPropagation(); handlePauseCampaign(campaign.id) }} 
                                                                    disabled={isLoading}
                                                                    className="rounded-lg border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10"
                                                                >
                                                                    {isPauseLoading ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Pause className="w-4 h-4 mr-1" />}
                                                                    Pause
                                                                </Button>
                                                            )}
                                                            
                                                            {(campaign.status === 'paused' || (campaign.status as string) === 'inactive') && (
                                                                <Button 
                                                                    size="sm" 
                                                                    onClick={(e) => { e.stopPropagation(); handleResumeCampaign(campaign.id) }} 
                                                                    disabled={isLoading}
                                                                    className="rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25"
                                                                >
                                                                    {isResumeLoading ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Play className="w-4 h-4 mr-1.5" />}
                                                                    Resume
                                                                </Button>
                                                            )}
                                                            
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={(e) => e.stopPropagation()}><MoreVertical className="w-4 h-4" /></Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end" className="w-48 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
                                                                    <DropdownMenuItem onClick={() => { setSelectedCampaign(campaign); setShowLeadsDialog(true) }}><Users className="w-4 h-4 mr-2" />View Leads</DropdownMenuItem>
                                                                    <CampaignEdit campaign={campaign} trigger={<DropdownMenuItem onSelect={(e) => e.preventDefault()}><Edit className="w-4 h-4 mr-2" />Edit</DropdownMenuItem>} />
                                                                    <DropdownMenuItem onClick={() => { setSelectedCampaign(campaign); setShowSettingsDialog(true) }}><Settings className="w-4 h-4 mr-2" />Settings</DropdownMenuItem>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem className="text-red-600 dark:text-red-400"><Trash2 className="w-4 h-4 mr-2" />Delete</DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        </>
                    )}
                </div>
            </motion.div>

            {/* ============================================ */}
            {/* CREATE CAMPAIGN WIZARD DIALOG */}
            {/* ============================================ */}
            <Dialog open={showCreateDialog} onOpenChange={(open) => {
                if (!open) {
                    resetWizard()
                }
                setShowCreateDialog(open)
            }}>
                <DialogContent className="max-w-[95vw] sm:max-w-lg lg:max-w-4xl max-h-[90vh] overflow-hidden p-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-gray-200/50 dark:border-slate-700/50 rounded-2xl">
                    {/* Gradient Top Bar */}
                    <div className="h-1.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />
                    
                    {/* Header Section */}
                    <div className="p-6 pb-0">
                        <DialogHeader className="mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
                                    <Target className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">Create New Campaign</DialogTitle>
                                    <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
                                        Step {currentStep + 1} of {WIZARD_STEPS.length} — {WIZARD_STEPS[currentStep].title}
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        {/* Step Progress Indicator */}
                        <div className="relative mb-6">
                            {/* Step Indicators Container */}
                            <div className="relative flex justify-between">
                                {/* Progress Bar Background - positioned between icon centers */}
                                <div 
                                    className="absolute top-4 h-1 bg-gray-200 dark:bg-slate-700 rounded-full"
                                    style={{ left: '16px', right: '16px' }}
                                />
                                
                                {/* Progress Bar Fill - animated width based on current step */}
                                <motion.div 
                                    className="absolute top-4 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
                                    style={{ left: '16px' }}
                                    initial={{ width: 0 }}
                                    animate={{ 
                                        width: currentStep === 0 
                                            ? 0 
                                            : `calc((100% - 32px) * ${currentStep / (WIZARD_STEPS.length - 1)})` 
                                    }}
                                    transition={{ duration: 0.3 }}
                                />
                                {WIZARD_STEPS.map((step, index) => {
                                    const StepIcon = step.icon
                                    const isCompleted = index < currentStep
                                    const isCurrent = index === currentStep
                                    
                                    return (
                                        <div key={step.id} className="flex flex-col items-center">
                                            <motion.div
                                                initial={false}
                                                animate={{ scale: isCurrent ? 1.1 : 1 }}
                                                className={`
                                                    w-8 h-8 rounded-lg flex items-center justify-center z-10 transition-all duration-300
                                                    ${isCompleted ? 'bg-cyan-500 shadow-lg shadow-cyan-500/30' : ''}
                                                    ${isCurrent ? 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30 ring-4 ring-cyan-500/20' : ''}
                                                    ${!isCompleted && !isCurrent ? 'bg-gray-200 dark:bg-slate-700' : ''}
                                                `}
                                            >
                                                {isCompleted ? (
                                                    <CheckCircle className="w-4 h-4 text-white" />
                                                ) : (
                                                    <StepIcon className={`w-4 h-4 ${isCurrent ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`} />
                                                )}
                                            </motion.div>
                                            <p className={`text-[10px] mt-2 font-medium hidden sm:block ${isCurrent ? 'text-cyan-600 dark:text-cyan-400' : 'text-gray-400 dark:text-gray-500'}`}>
                                                {step.title}
                                            </p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Step Content */}
                    <div className="px-6 overflow-y-auto max-h-[45vh]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                {/* Step 1: Basics */}
                                {currentStep === 0 && (
                                    <div className="space-y-5">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                                <Target className="w-4 h-4 text-cyan-500" />Campaign Name <span className="text-red-500">*</span>
                                            </Label>
                                            <Input 
                                                placeholder="e.g., Q1 Sales Outreach" 
                                                value={formData.campaign_name} 
                                                onChange={(e) => setFormData({ ...formData, campaign_name: e.target.value })} 
                                                className={`h-11 bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 rounded-xl ${formErrors.campaign_name ? 'border-red-500 focus:ring-red-500' : ''}`} 
                                            />
                                            {formErrors.campaign_name && (
                                                <p className="text-sm text-red-600 flex items-center gap-1">
                                                    <AlertCircle className="w-3.5 h-3.5" />{formErrors.campaign_name}
                                                </p>
                                            )}
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                                <Sparkles className="w-4 h-4 text-purple-500" />Description
                                            </Label>
                                            <Textarea 
                                                placeholder="Describe your campaign goals..." 
                                                value={formData.description} 
                                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })} 
                                                rows={3} 
                                                className="bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 rounded-xl resize-none" 
                                            />
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                                <Bot className="w-4 h-4 text-blue-500" />Select Agent <span className="text-red-500">*</span>
                                            </Label>
                                            <Select value={formData.agent_id} onValueChange={(value) => setFormData({ ...formData, agent_id: value })}>
                                                <SelectTrigger className={`h-11 bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 rounded-xl ${formErrors.agent_id ? 'border-red-500' : ''}`}>
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
                                                <p className="text-sm text-red-600 flex items-center gap-1">
                                                    <AlertCircle className="w-3.5 h-3.5" />{formErrors.agent_id}
                                                </p>
                                            )}
                                        </div>
                                        
                                        <FileUploadComponent 
                                            onFileSelect={handleFileSelect} 
                                            selectedFile={formData.csv_file} 
                                            error={formErrors.csv_file} 
                                        />
                                    </div>
                                )}

                                {/* Step 2: Data Mapping */}
                                {currentStep === 1 && (
                                    <DataMappingComponent 
                                        csvHeaders={formData.csv_headers} 
                                        dataMapping={formData.data_mapping} 
                                        onMappingChange={(mapping) => setFormData({ ...formData, data_mapping: mapping })} 
                                        error={formErrors.data_mapping} 
                                    />
                                )}

                                {/* Step 3: Booking */}
                                {currentStep === 2 && (
                                    <div className="space-y-5">
                                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 dark:from-cyan-500/10 dark:to-blue-500/10 border border-cyan-500/20 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                                                    <Calendar className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <Label className="text-sm font-medium text-gray-900 dark:text-white">Enable Booking</Label>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Allow leads to book appointments</p>
                                                </div>
                                            </div>
                                            <Switch 
                                                checked={formData.booking_enabled} 
                                                onCheckedChange={(checked: boolean) => setFormData({ ...formData, booking_enabled: checked })} 
                                                className="data-[state=checked]:bg-cyan-500" 
                                            />
                                        </div>
                                        
                                        <AnimatePresence>
                                            {formData.booking_enabled && (
                                                <motion.div 
                                                    initial={{ opacity: 0, height: 0 }} 
                                                    animate={{ opacity: 1, height: 'auto' }} 
                                                    exit={{ opacity: 0, height: 0 }}
                                                >
                                                    <BookingConfigComponent 
                                                        bookingConfig={formData.booking_config} 
                                                        onConfigChange={(config) => setFormData({ ...formData, booking_config: config })} 
                                                        error={formErrors.booking_config} 
                                                    />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                        
                                        {!formData.booking_enabled && (
                                            <div className="text-center py-8 px-6 bg-gray-50 dark:bg-slate-800/30 rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-700">
                                                <Calendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Booking is disabled. Enable it above to configure calendar settings.</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Step 4: Automation */}
                                {currentStep === 3 && (
                                    <AutomationConfigComponent 
                                        automationConfig={formData.automation_config} 
                                        onConfigChange={(config) => setFormData({ ...formData, automation_config: config })} 
                                        error={formErrors.automation_config} 
                                    />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Footer with Navigation */}
                    <div className="p-6 pt-6 border-t border-gray-200/50 dark:border-slate-700/50 mt-4">
                        <div className="flex items-center justify-between">
                            {/* Back / Cancel Button */}
                            <Button
                                variant="outline"
                                onClick={currentStep === 0 ? () => setShowCreateDialog(false) : handlePrevStep}
                                className="rounded-xl px-5"
                            >
                                {currentStep === 0 ? 'Cancel' : (
                                    <>
                                        <ChevronLeft className="w-4 h-4 mr-1" />
                                        Back
                                    </>
                                )}
                            </Button>

                            {/* Step Counter (mobile) */}
                            <span className="text-sm text-gray-500 dark:text-gray-400 sm:hidden">
                                {currentStep + 1} / {WIZARD_STEPS.length}
                            </span>

                            {/* Next / Create Button */}
                            {currentStep < WIZARD_STEPS.length - 1 ? (
                                <Button
                                    onClick={handleNextStep}
                                    className="rounded-xl px-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25"
                                >
                                    Next
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                            ) : (
                                <Button 
                                    onClick={handleCreateCampaign} 
                                    disabled={isSubmitting} 
                                    className="rounded-xl px-6 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white shadow-lg shadow-emerald-500/25"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Create Campaign
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* ============================================ */}
            {/* VIEW LEADS DIALOG */}
            {/* ============================================ */}
            <Dialog open={showLeadsDialog} onOpenChange={setShowLeadsDialog}>
                <DialogContent className="max-w-[95vw] sm:max-w-2xl lg:max-w-5xl max-h-[85vh] p-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-gray-200/50 dark:border-slate-700/50 rounded-2xl overflow-hidden">
                    <div className="h-1.5 bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500" />
                    <div className="p-6">
                        <DialogHeader className="mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
                                    <Users className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">Campaign Leads</DialogTitle>
                                    <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
                                        {selectedCampaign?.campaign_name} • {selectedCampaign?.metrics?.total_leads || 0} leads
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>
                        <div className="max-h-[55vh] overflow-y-auto">
                            {selectedCampaign?.leads?.length > 0 ? (
                                <div className="space-y-3">
                                    {selectedCampaign?.leads?.map((lead: any, index: number) => {
                                        const statusConfig = getStatusConfig(lead.status)
                                        return (
                                            <motion.div 
                                                key={lead.id} 
                                                initial={{ opacity: 0, y: 10 }} 
                                                animate={{ opacity: 1, y: 0 }} 
                                                transition={{ delay: index * 0.03 }} 
                                                className="p-4 bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl hover:border-cyan-500/30 transition-all"
                                            >
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <p className="font-semibold text-gray-900 dark:text-white">{lead.name}</p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">{lead.email}</p>
                                                    </div>
                                                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${statusConfig.color}`}>
                                                        {lead.status}
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                                                    <div>
                                                        <p className="text-gray-500 dark:text-gray-400 text-xs">Phone</p>
                                                        <p className="text-gray-900 dark:text-white">{lead.phone || '-'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-500 dark:text-gray-400 text-xs">Company</p>
                                                        <p className="text-gray-900 dark:text-white">{lead.company || '-'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button size="sm" variant="outline" className="flex-1 rounded-lg text-xs">
                                                        <Phone className="w-3 h-3 mr-1" />Call
                                                    </Button>
                                                    <Button size="sm" variant="outline" className="flex-1 rounded-lg text-xs">
                                                        <Mail className="w-3 h-3 mr-1" />Email
                                                    </Button>
                                                    <Button size="sm" variant="outline" className="flex-1 rounded-lg text-xs">
                                                        <Calendar className="w-3 h-3 mr-1" />Schedule
                                                    </Button>
                                                </div>
                                            </motion.div>
                                        )
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                                        <Users className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No leads yet</h3>
                                    <p className="text-gray-500 dark:text-gray-400">Leads will appear here once the campaign starts</p>
                                </div>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* ============================================ */}
            {/* SETTINGS DIALOG */}
            {/* ============================================ */}
            <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
                <DialogContent className="max-w-[95vw] sm:max-w-md p-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-gray-200/50 dark:border-slate-700/50 rounded-2xl overflow-hidden">
                    <div className="h-1.5 bg-gradient-to-r from-gray-500 via-slate-500 to-gray-600" />
                    <div className="p-6">
                        <DialogHeader className="mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-gray-500 to-slate-600 flex items-center justify-center shadow-lg">
                                    <Settings className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">Campaign Settings</DialogTitle>
                                    <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
                                        {selectedCampaign?.campaign_name}
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>
                        <div className="py-8 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                                <Settings className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 dark:text-gray-400">Campaign settings coming soon</p>
                        </div>
                    </div>
                    <div className="p-6 pt-0">
                        <Button variant="outline" onClick={() => setShowSettingsDialog(false)} className="w-full rounded-xl">
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}