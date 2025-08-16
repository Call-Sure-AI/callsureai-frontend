"use client"

import { useState, useEffect } from "react"
import {
    Calendar,
    Clock,
    Phone,
    Bot,
    Sparkles,
    CheckCircle,
    XCircle,
    MoreVertical,
    Plus,
    Search,
    Download,
    Volume2,
    User,
    CalendarCheck,
    BarChart3,
    Zap,
    PhoneCall,
    Brain,
    Headphones,
    Activity,
    ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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

interface AutoBooking {
    id: string
    leadName: string
    leadEmail: string
    leadPhone: string
    leadCompany?: string
    agentName: string
    agentId: string
    callDuration: number
    callRecordingUrl?: string
    scheduledDate: string
    scheduledTime: string
    meetingDuration: number
    bookingConfidence: number // AI confidence score 0-100
    callTranscriptHighlight?: string
    status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show'
    source: 'ai-call' | 'manual' | 'web-form'
    campaignId: string
    campaignName: string
    createdAt: string
    updatedAt: string
}

interface CallMetrics {
    totalCalls: number
    connectedCalls: number
    bookingRate: number
    avgCallDuration: number
    avgConfidence: number
}

export default function AutoBookingsPage() {
    const [bookings, setBookings] = useState<AutoBooking[]>([])
    const [selectedBooking, setSelectedBooking] = useState<AutoBooking | null>(null)
    const [showManualBookingDialog, setShowManualBookingDialog] = useState(false)
    const [showCallDetailsDialog, setShowCallDetailsDialog] = useState(false)
    const [showTranscriptDialog, setShowTranscriptDialog] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [filterSource, setFilterSource] = useState<string>("all")
    const [filterStatus, setFilterStatus] = useState<string>("all")
    const [activeTab, setActiveTab] = useState("overview")

    // Mock data for AI-generated bookings
    useEffect(() => {
        const mockBookings: AutoBooking[] = [
            {
                id: '1',
                leadName: 'John Smith',
                leadEmail: 'john.smith@techcorp.com',
                leadPhone: '+1 (555) 123-4567',
                leadCompany: 'Tech Corp',
                agentName: 'Sarah AI Agent',
                agentId: 'agent-001',
                callDuration: 245, // seconds
                callRecordingUrl: '/recordings/call-001.mp3',
                scheduledDate: '2025-01-22',
                scheduledTime: '14:00',
                meetingDuration: 30,
                bookingConfidence: 92,
                callTranscriptHighlight: "Yes, Tuesday at 2 PM works perfectly for me. I'm very interested in seeing how your solution can help with our Q1 goals.",
                status: 'confirmed',
                source: 'ai-call',
                campaignId: 'camp-001',
                campaignName: 'Q1 Enterprise Outreach',
                createdAt: '2025-01-16T10:30:00Z',
                updatedAt: '2025-01-16T10:35:00Z'
            },
            {
                id: '2',
                leadName: 'Emily Johnson',
                leadEmail: 'emily.j@marketinginc.com',
                leadPhone: '+1 (555) 987-6543',
                leadCompany: 'Marketing Inc',
                agentName: 'Mike AI Agent',
                agentId: 'agent-002',
                callDuration: 180,
                callRecordingUrl: '/recordings/call-002.mp3',
                scheduledDate: '2025-01-23',
                scheduledTime: '10:00',
                meetingDuration: 45,
                bookingConfidence: 88,
                callTranscriptHighlight: "I'd like to schedule a demo to see the platform in action. Wednesday morning would be ideal.",
                status: 'scheduled',
                source: 'ai-call',
                campaignId: 'camp-001',
                campaignName: 'Q1 Enterprise Outreach',
                createdAt: '2025-01-16T09:15:00Z',
                updatedAt: '2025-01-16T09:20:00Z'
            },
            {
                id: '3',
                leadName: 'Michael Chen',
                leadEmail: 'mchen@startup.io',
                leadPhone: '+1 (555) 246-8135',
                leadCompany: 'Startup.io',
                agentName: 'Sarah AI Agent',
                agentId: 'agent-001',
                callDuration: 320,
                callRecordingUrl: '/recordings/call-003.mp3',
                scheduledDate: '2025-01-21',
                scheduledTime: '15:30',
                meetingDuration: 30,
                bookingConfidence: 95,
                callTranscriptHighlight: "This sounds exactly like what we need. Let's definitely set up that meeting for Monday afternoon.",
                status: 'confirmed',
                source: 'ai-call',
                campaignId: 'camp-002',
                campaignName: 'Startup Acceleration Program',
                createdAt: '2025-01-15T14:20:00Z',
                updatedAt: '2025-01-15T14:25:00Z'
            },
            {
                id: '4',
                leadName: 'David Wilson',
                leadEmail: 'david.w@example.com',
                leadPhone: '+1 (555) 369-2580',
                status: 'scheduled',
                source: 'manual',
                agentName: 'Manual Entry',
                agentId: 'manual',
                callDuration: 0,
                scheduledDate: '2025-01-24',
                scheduledTime: '11:00',
                meetingDuration: 30,
                bookingConfidence: 100,
                campaignId: 'manual',
                campaignName: 'Direct Booking',
                createdAt: '2025-01-16T08:00:00Z',
                updatedAt: '2025-01-16T08:00:00Z'
            }
        ]
        setBookings(mockBookings)
    }, [])

    // Calculate AI metrics
    const calculateMetrics = (): CallMetrics => {
        const aiBookings = bookings.filter(b => b.source === 'ai-call')
        const totalCalls = aiBookings.length * 3 // Assuming 3 calls per booking on average
        const connectedCalls = aiBookings.length * 2 // Assuming 66% connection rate
        const bookingRate = connectedCalls > 0 ? Math.round((aiBookings.length / connectedCalls) * 100) : 0
        const avgCallDuration = aiBookings.length > 0 
            ? Math.round(aiBookings.reduce((acc, b) => acc + b.callDuration, 0) / aiBookings.length)
            : 0
        const avgConfidence = aiBookings.length > 0
            ? Math.round(aiBookings.reduce((acc, b) => acc + b.bookingConfidence, 0) / aiBookings.length)
            : 0

        return {
            totalCalls,
            connectedCalls,
            bookingRate,
            avgCallDuration,
            avgConfidence
        }
    }

    const metrics = calculateMetrics()

    // Filter bookings
    const filteredBookings = bookings.filter(booking => {
        const matchesSearch = 
            booking.leadName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            booking.leadEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
            booking.leadCompany?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            booking.campaignName.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesSource = filterSource === 'all' || booking.source === filterSource
        const matchesStatus = filterStatus === 'all' || booking.status === filterStatus

        return matchesSearch && matchesSource && matchesStatus
    })

    const handlePlayRecording = () => {
        // Implement audio playback
        toast({
            title: "Playing Recording",
            description: "Audio playback started",
        })
    }

    const getSourceIcon = (source: string) => {
        switch (source) {
            case 'ai-call':
                return <Bot className="w-4 h-4 text-blue-500" />
            case 'manual':
                return <User className="w-4 h-4 text-gray-500" />
            case 'web-form':
                return <Calendar className="w-4 h-4 text-green-500" />
            default:
                return <Calendar className="w-4 h-4" />
        }
    }

    const getSourceColor = (source: string) => {
        switch (source) {
            case 'ai-call':
                return 'bg-blue-100 text-blue-800'
            case 'manual':
                return 'bg-gray-100 text-gray-800'
            case 'web-form':
                return 'bg-green-100 text-green-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-100 text-green-800'
            case 'scheduled':
                return 'bg-blue-100 text-blue-800'
            case 'completed':
                return 'bg-gray-100 text-gray-800'
            case 'cancelled':
                return 'bg-red-100 text-red-800'
            case 'no-show':
                return 'bg-yellow-100 text-yellow-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const getConfidenceColor = (confidence: number) => {
        if (confidence >= 90) return 'text-green-600 bg-green-50'
        if (confidence >= 75) return 'text-blue-600 bg-blue-50'
        if (confidence >= 60) return 'text-yellow-600 bg-yellow-50'
        return 'text-red-600 bg-red-50'
    }

    const formatCallDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Header with AI emphasis */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-blue-500" />
                        AI-Powered Bookings
                    </h1>
                    <p className="text-gray-500">
                        Automated booking system powered by AI voice agents
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button 
                        variant="outline"
                        onClick={() => setShowManualBookingDialog(true)}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Manual Booking
                    </Button>
                    <Button 
                        className="bg-[#0A1E4E] hover:bg-[#0A1E4E]/90"
                    >
                        <Bot className="w-4 h-4 mr-2" />
                        View AI Agents
                    </Button>
                </div>
            </div>

            {/* AI Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Card className="border-blue-200 bg-blue-50/50">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">AI Calls Made</p>
                                <p className="text-2xl font-bold">{metrics.totalCalls}</p>
                                <p className="text-xs text-gray-500 mt-1">Last 7 days</p>
                            </div>
                            <PhoneCall className="w-8 h-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-green-200 bg-green-50/50">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">AI Bookings</p>
                                <p className="text-2xl font-bold">
                                    {bookings.filter(b => b.source === 'ai-call').length}
                                </p>
                                <p className="text-xs text-green-600 mt-1">
                                    {metrics.bookingRate}% conversion
                                </p>
                            </div>
                            <Bot className="w-8 h-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Avg Call Time</p>
                                <p className="text-2xl font-bold">
                                    {formatCallDuration(metrics.avgCallDuration)}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">Per booking</p>
                            </div>
                            <Clock className="w-8 h-8 text-purple-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">AI Confidence</p>
                                <p className="text-2xl font-bold">{metrics.avgConfidence}%</p>
                                <p className="text-xs text-gray-500 mt-1">Avg score</p>
                            </div>
                            <Brain className="w-8 h-8 text-amber-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Bookings</p>
                                <p className="text-2xl font-bold">{bookings.length}</p>
                                <p className="text-xs text-gray-500 mt-1">All sources</p>
                            </div>
                            <CalendarCheck className="w-8 h-8 text-indigo-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs for different views */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
                    <TabsTrigger value="all-bookings">All Bookings</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-4">
                    {/* Recent AI Bookings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Zap className="w-5 h-5 text-yellow-500" />
                                Recent AI-Generated Bookings
                            </CardTitle>
                            <CardDescription>
                                Latest bookings created by your AI voice agents
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {bookings
                                    .filter(b => b.source === 'ai-call')
                                    .slice(0, 5)
                                    .map((booking) => (
                                        <div
                                            key={booking.id}
                                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                                            onClick={() => {
                                                setSelectedBooking(booking)
                                                setShowCallDetailsDialog(true)
                                            }}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                    <Bot className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">{booking.leadName}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {booking.leadCompany} • {booking.scheduledDate} at {booking.scheduledTime}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        Agent: {booking.agentName} • Call: {formatCallDuration(booking.callDuration)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(booking.bookingConfidence)}`}>
                                                    {booking.bookingConfidence}% confidence
                                                </div>
                                                <Badge className={getStatusColor(booking.status)}>
                                                    {booking.status}
                                                </Badge>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handlePlayRecording()
                                                    }}
                                                >
                                                    <Headphones className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* AI Performance Chart Placeholder */}
                    <Card>
                        <CardHeader>
                            <CardTitle>AI Booking Trends</CardTitle>
                            <CardDescription>Daily AI-generated bookings over the last week</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
                                <div className="text-center">
                                    <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                    <p className="text-gray-500">Chart visualization would go here</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* AI Insights Tab */}
                <TabsContent value="ai-insights" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Top Performing Agents */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Top AI Agents</CardTitle>
                                <CardDescription>Best performing voice agents by booking rate</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {['Sarah AI Agent', 'Mike AI Agent', 'Alex AI Agent'].map((agent, index) => (
                                        <div key={agent} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                    <span className="text-sm font-medium">{index + 1}</span>
                                                </div>
                                                <div>
                                                    <p className="font-medium">{agent}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {15 - index * 3} bookings • {95 - index * 5}% success
                                                    </p>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="sm">
                                                <ChevronRight className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Call Insights */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Call Intelligence</CardTitle>
                                <CardDescription>Common booking triggers from AI calls</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {[
                                        'Mentioned Q1 goals or planning',
                                        'Interest in cost savings',
                                        'Looking for automation solutions',
                                        'Team expansion mentioned'
                                    ].map((insight) => (
                                        <div key={insight} className="flex items-start gap-2">
                                            <Activity className="w-4 h-4 text-green-500 mt-0.5" />
                                            <p className="text-sm text-gray-600">{insight}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Best Call Times */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Optimal Call Windows</CardTitle>
                            <CardDescription>Best times for AI agents to reach leads</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-5 gap-2">
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => (
                                    <div key={day} className="text-center">
                                        <p className="text-xs font-medium text-gray-600 mb-2">{day}</p>
                                        <div className="space-y-1">
                                            {['9-11am', '2-4pm'].map((time) => (
                                                <div
                                                    key={time}
                                                    className="bg-green-100 text-green-700 text-xs py-1 px-2 rounded"
                                                >
                                                    {time}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* All Bookings Tab */}
                <TabsContent value="all-bookings" className="space-y-4">
                    {/* Filters */}
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <Input
                                            placeholder="Search bookings..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                                <Select value={filterSource} onValueChange={setFilterSource}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="All Sources" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Sources</SelectItem>
                                        <SelectItem value="ai-call">AI Call</SelectItem>
                                        <SelectItem value="manual">Manual</SelectItem>
                                        <SelectItem value="web-form">Web Form</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={filterStatus} onValueChange={setFilterStatus}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="All Statuses" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Statuses</SelectItem>
                                        <SelectItem value="scheduled">Scheduled</SelectItem>
                                        <SelectItem value="confirmed">Confirmed</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button variant="outline">
                                    <Download className="w-4 h-4 mr-2" />
                                    Export
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Bookings Table */}
                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Source</TableHead>
                                        <TableHead>Lead</TableHead>
                                        <TableHead>Meeting</TableHead>
                                        <TableHead>Agent/Creator</TableHead>
                                        <TableHead>Campaign</TableHead>
                                        <TableHead>Confidence</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredBookings.map((booking) => (
                                        <TableRow key={booking.id}>
                                            <TableCell>
                                                <Badge className={getSourceColor(booking.source)}>
                                                    <span className="flex items-center gap-1">
                                                        {getSourceIcon(booking.source)}
                                                        {booking.source === 'ai-call' ? 'AI' : booking.source}
                                                    </span>
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{booking.leadName}</p>
                                                    <p className="text-sm text-gray-500">{booking.leadEmail}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{booking.scheduledDate}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {booking.scheduledTime} • {booking.meetingDuration}min
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell>{booking.agentName}</TableCell>
                                            <TableCell>{booking.campaignName}</TableCell>
                                            <TableCell>
                                                {booking.source === 'ai-call' ? (
                                                    <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(booking.bookingConfidence)}`}>
                                                        {booking.bookingConfidence}%
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={getStatusColor(booking.status)}>
                                                    {booking.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreVertical className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        {booking.source === 'ai-call' && (
                                                            <>
                                                                <DropdownMenuItem
                                                                    onClick={() => {
                                                                        setSelectedBooking(booking)
                                                                        setShowCallDetailsDialog(true)
                                                                    }}
                                                                >
                                                                    <Phone className="w-4 h-4 mr-2" />
                                                                    View Call Details
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() => handlePlayRecording()}
                                                                >
                                                                    <Headphones className="w-4 h-4 mr-2" />
                                                                    Play Recording
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() => {
                                                                        setSelectedBooking(booking)
                                                                        setShowTranscriptDialog(true)
                                                                    }}
                                                                >
                                                                    <Volume2 className="w-4 h-4 mr-2" />
                                                                    View Transcript
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                            </>
                                                        )}
                                                        <DropdownMenuItem>
                                                            <CheckCircle className="w-4 h-4 mr-2" />
                                                            Confirm Booking
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <Calendar className="w-4 h-4 mr-2" />
                                                            Reschedule
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-red-600">
                                                            <XCircle className="w-4 h-4 mr-2" />
                                                            Cancel
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
                </TabsContent>
            </Tabs>

            {/* Call Details Dialog */}
            <Dialog open={showCallDetailsDialog} onOpenChange={setShowCallDetailsDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>AI Call Details</DialogTitle>
                        <DialogDescription>
                            Review the AI agent&apos;s performance and booking details
                        </DialogDescription>
                    </DialogHeader>

                    {selectedBooking && selectedBooking.source === 'ai-call' && (
                        <div className="space-y-4">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-sm font-medium text-blue-900 mb-2">Key Booking Moment</p>
                                <p className="text-sm text-blue-700 italic">
                                    &ldquo;{selectedBooking.callTranscriptHighlight}&rdquo;
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-gray-500">Lead Information</Label>
                                    <p className="font-medium">{selectedBooking.leadName}</p>
                                    <p className="text-sm text-gray-600">{selectedBooking.leadCompany}</p>
                                </div>
                                <div>
                                    <Label className="text-gray-500">AI Agent</Label>
                                    <p className="font-medium">{selectedBooking.agentName}</p>
                                    <p className="text-sm text-gray-600">ID: {selectedBooking.agentId}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <Label className="text-gray-500">Call Duration</Label>
                                    <p className="font-medium">{formatCallDuration(selectedBooking.callDuration)}</p>
                                </div>
                                <div>
                                    <Label className="text-gray-500">Confidence Score</Label>
                                    <p className={`font-medium ${selectedBooking.bookingConfidence >= 90 ? 'text-green-600' : 'text-blue-600'}`}>
                                        {selectedBooking.bookingConfidence}%
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-gray-500">Campaign</Label>
                                    <p className="font-medium text-sm">{selectedBooking.campaignName}</p>
                                </div>
                            </div>

                            <div>
                                <Label className="text-gray-500">Scheduled Meeting</Label>
                                <p className="font-medium">
                                    {selectedBooking.scheduledDate} at {selectedBooking.scheduledTime}
                                </p>
                                <p className="text-sm text-gray-600">Duration: {selectedBooking.meetingDuration} minutes</p>
                            </div>

                            <div className="flex gap-2"> 
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => handlePlayRecording()}
                                >
                                    <Headphones className="w-4 h-4 mr-2" />
                                    Play Full Recording
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => {
                                        setShowCallDetailsDialog(false)
                                        setShowTranscriptDialog(true)
                                    }}
                                >
                                    <Volume2 className="w-4 h-4 mr-2" />
                                    View Transcript
                                </Button>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowCallDetailsDialog(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Transcript Dialog */}
            <Dialog open={showTranscriptDialog} onOpenChange={setShowTranscriptDialog}>
                <DialogContent className="max-w-3xl max-h-[80vh]">
                    <DialogHeader>
                        <DialogTitle>Call Transcript</DialogTitle>
                        <DialogDescription>
                            Full conversation between AI agent and lead
                        </DialogDescription>
                    </DialogHeader>

                    <div className="overflow-y-auto space-y-4 max-h-[50vh]">
                        <div className="space-y-3">
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                    <Bot className="w-4 h-4 text-blue-600" />
                                </div>
                                <div className="flex-1 bg-gray-50 rounded-lg p-3">
                                    <p className="text-sm font-medium text-gray-700">AI Agent</p>
                                    <p className="text-sm mt-1">
                                        Hi! This is Sarah from CallSure AI. I&apos;m reaching out because you recently expressed interest in our sales automation platform. Do you have a moment to discuss how we might help your team?
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                    <User className="w-4 h-4 text-gray-600" />
                                </div>
                                <div className="flex-1 bg-blue-50 rounded-lg p-3">
                                    <p className="text-sm font-medium text-gray-700">Lead</p>
                                    <p className="text-sm mt-1">
                                        Oh yes, I remember filling out that form. We&apos;re actually looking at ways to improve our outbound sales process for Q1.
                                    </p>
                                </div>
                            </div>

                            {/* More transcript messages... */}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowTranscriptDialog(false)}>
                            Close
                        </Button>
                        <Button className="bg-[#0A1E4E] hover:bg-[#0A1E4E]/90">
                            <Download className="w-4 h-4 mr-2" />
                            Export Transcript
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Manual Booking Dialog (simplified) */}
            <Dialog open={showManualBookingDialog} onOpenChange={setShowManualBookingDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Manual Booking</DialogTitle>
                        <DialogDescription>
                            Create a booking manually (not from AI call)
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <Label>Lead Name</Label>
                            <Input placeholder="Enter lead name" />
                        </div>
                        <div>
                            <Label>Email</Label>
                            <Input type="email" placeholder="lead@example.com" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Date</Label>
                                <Input type="date" />
                            </div>
                            <div>
                                <Label>Time</Label>
                                <Input type="time" />
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowManualBookingDialog(false)}>
                            Cancel
                        </Button>
                        <Button className="bg-[#0A1E4E] hover:bg-[#0A1E4E]/90">
                            Create Booking
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}