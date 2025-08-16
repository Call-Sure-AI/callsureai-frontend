// app\(settings)\tickets\page.tsx
"use client"

import { useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { 
    Filter, 
    MoreVertical, 
    Settings, 
    AlertTriangle, 
    User, 
    Building,
    MessageSquare,
    Phone,
    Mail,
    Globe,
    Calendar
} from "lucide-react"

const tickets = [
    {
        id: "TKT-001",
        raisedTime: "2025-04-05T09:30:00",
        description: "Login issue with customer portal",
        assignedTo: "Sarah Johnson",
        customerDetails: "Acme Corp, John Smith",
        status: "Open",
        source: "Email",
        priority: "Medium"
    },
    {
        id: "TKT-002",
        raisedTime: "2025-04-06T10:15:00",
        description: "Payment gateway integration error",
        assignedTo: "Mike Chen",
        customerDetails: "TechSolutions Inc., Lisa Wong",
        status: "In Progress",
        source: "Phone",
        priority: "High"
    },
    {
        id: "TKT-003",
        raisedTime: "2025-04-06T14:45:00",
        description: "Data export functionality not working",
        assignedTo: "Alex Thompson",
        customerDetails: "Global Services, Robert Garcia",
        status: "Resolved",
        source: "Web Form",
        priority: "Low"
    },
    {
        id: "TKT-004",
        raisedTime: "2025-04-07T08:20:00",
        description: "Account access request for new team member",
        assignedTo: "Unassigned",
        customerDetails: "Northern Manufacturing, Emily Taylor",
        status: "New",
        source: "Chat",
        priority: "Critical"
    },
]

export default function TicketsPage() {
    const [selectedTicket, setSelectedTicket] = useState<string | null>(null)
    const [settingsDialogOpen, setSettingsDialogOpen] = useState(false)

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        })
    }

    const formatDateShort = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        })
    }

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'new': return 'bg-blue-500'
            case 'open': return 'bg-yellow-500'
            case 'in progress': return 'bg-purple-500'
            case 'resolved': return 'bg-green-500'
            case 'closed': return 'bg-gray-500'
            default: return 'bg-gray-400'
        }
    }

    const getPriorityColor = (priority: string) => {
        switch (priority.toLowerCase()) {
            case 'critical': return 'bg-red-600 text-white'
            case 'high': return 'bg-orange-500 text-white'
            case 'medium': return 'bg-yellow-400'
            case 'low': return 'bg-blue-400'
            default: return 'bg-gray-400'
        }
    }

    const getSourceIcon = (source: string) => {
        switch (source.toLowerCase()) {
            case 'email': return <Mail className="w-3 h-3" />
            case 'phone': return <Phone className="w-3 h-3" />
            case 'chat': return <MessageSquare className="w-3 h-3" />
            case 'web form': return <Globe className="w-3 h-3" />
            default: return <MessageSquare className="w-3 h-3" />
        }
    }

    // Mobile Ticket Card Component
    const TicketCard = ({ ticket }: { ticket: typeof tickets[0] }) => {
        const isSelected = selectedTicket === ticket.id
        
        return (
            <Card 
                className={`w-full cursor-pointer transition-colors ${
                    isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => setSelectedTicket(ticket.id)}
            >
                <CardContent className="p-4">
                    {/* Header Row */}
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-sm">{ticket.id}</span>
                                <Badge className={`${getPriorityColor(ticket.priority)} text-xs`}>
                                    {ticket.priority}
                                </Badge>
                                <Badge className={`${getStatusColor(ticket.status)} text-white text-xs`}>
                                    {ticket.status}
                                </Badge>
                            </div>
                            <p className="text-sm text-gray-900 line-clamp-2">
                                {ticket.description}
                            </p>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>See Transcript</DropdownMenuItem>
                                <DropdownMenuItem>Conversation Summary</DropdownMenuItem>
                                <DropdownMenuItem>Close Ticket</DropdownMenuItem>
                                <DropdownMenuItem>Escalate to Manager</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="flex items-center gap-1 text-gray-600">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDateShort(ticket.raisedTime)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                            <User className="w-3 h-3" />
                            <span className="truncate">{ticket.assignedTo}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                            <Building className="w-3 h-3" />
                            <span className="truncate">{ticket.customerDetails.split(',')[0]}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                            {getSourceIcon(ticket.source)}
                            <span>{ticket.source}</span>
                        </div>
                    </div>

                    {/* Mobile Actions */}
                    <div className="flex gap-2 mt-3 pt-3 border-t">
                        <Button size="sm" variant="outline" className="flex-1 text-xs">
                            View Details
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 text-xs">
                            Assign
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 text-xs">
                            Update
                        </Button>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="p-4 sm:p-6 max-w-[100vw] xl:max-w-7xl mx-auto">
            {/* Header - Responsive */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <h1 className="text-xl sm:text-2xl font-bold">Ticket Queries</h1>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 sm:flex-initial">
                        <Filter className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Filter</span>
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        className="flex-1 sm:flex-initial bg-[#0A1E4E] hover:bg-[#0A1E4E]/90 text-white"
                        onClick={() => setSettingsDialogOpen(true)}
                    >
                        <Settings className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Ticket</span> Settings
                    </Button>
                </div>
            </div>

            {/* Stats Cards - Responsive Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                <Card>
                    <CardContent className="p-3 sm:p-4">
                        <div className="text-xs sm:text-sm text-gray-500">Total Tickets</div>
                        <div className="text-xl sm:text-2xl font-bold">42</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-3 sm:p-4">
                        <div className="text-xs sm:text-sm text-gray-500">Open Tickets</div>
                        <div className="text-xl sm:text-2xl font-bold">16</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-3 sm:p-4">
                        <div className="text-xs sm:text-sm text-gray-500">Resolved Today</div>
                        <div className="text-xl sm:text-2xl font-bold">8</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-3 sm:p-4">
                        <div className="text-xs sm:text-sm text-gray-500">Avg. Response</div>
                        <div className="text-xl sm:text-2xl font-bold">2.5h</div>
                    </CardContent>
                </Card>
            </div>

            {/* Tickets List - Mobile Cards / Desktop Table */}
            <Card>
                <CardContent className="p-0">
                    {/* Mobile View - Cards */}
                    <div className="block lg:hidden p-4 space-y-3">
                        {tickets.map((ticket) => (
                            <TicketCard key={ticket.id} ticket={ticket} />
                        ))}
                    </div>

                    {/* Desktop View - Table */}
                    <div className="hidden lg:block overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Ticket ID</TableHead>
                                    <TableHead>Raised Time</TableHead>
                                    <TableHead className="w-[250px]">Ticket Description</TableHead>
                                    <TableHead>Assigned To</TableHead>
                                    <TableHead>Customer Details</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Priority</TableHead>
                                    <TableHead>Source</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tickets.map((ticket) => (
                                    <TableRow
                                        key={ticket.id}
                                        className={`cursor-pointer ${
                                            selectedTicket === ticket.id ? "bg-blue-50" : ""
                                        }`}
                                        onClick={() => setSelectedTicket(ticket.id)}
                                    >
                                        <TableCell className="font-medium">{ticket.id}</TableCell>
                                        <TableCell>{formatDate(ticket.raisedTime)}</TableCell>
                                        <TableCell>{ticket.description}</TableCell>
                                        <TableCell>{ticket.assignedTo}</TableCell>
                                        <TableCell>{ticket.customerDetails}</TableCell>
                                        <TableCell>
                                            <Badge className={`${getStatusColor(ticket.status)} text-white`}>
                                                {ticket.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={getPriorityColor(ticket.priority)}>
                                                {ticket.priority}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{ticket.source}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>View Details</DropdownMenuItem>
                                                    <DropdownMenuItem>See Transcript</DropdownMenuItem>
                                                    <DropdownMenuItem>Conversation Summary</DropdownMenuItem>
                                                    <DropdownMenuItem>Close Ticket</DropdownMenuItem>
                                                    <DropdownMenuItem>Escalate to Manager</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Ticket Details - Responsive */}
            {selectedTicket && (
                <Card className="mt-4 sm:mt-6">
                    <CardHeader className="p-4 sm:p-6">
                        <CardTitle className="text-lg sm:text-xl">
                            Ticket Details: {selectedTicket}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 pt-0">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div>
                                <h3 className="font-medium text-gray-500 text-sm sm:text-base mb-2">
                                    Conversation History
                                </h3>
                                <div className="border rounded-lg p-3 sm:p-4 h-36 sm:h-48 overflow-y-auto bg-gray-50">
                                    <p className="text-xs sm:text-sm mb-2">
                                        <span className="font-bold">Agent (09:32):</span> Hello, how can I help you today?
                                    </p>
                                    <p className="text-xs sm:text-sm mb-2">
                                        <span className="font-bold">Customer (09:33):</span> I&apos;m having trouble logging into my account.
                                    </p>
                                    <p className="text-xs sm:text-sm mb-2">
                                        <span className="font-bold">Agent (09:34):</span> I&apos;m sorry to hear that. Could you please confirm your username?
                                    </p>
                                    <p className="text-xs sm:text-sm">
                                        <span className="font-bold">Customer (09:35):</span> My username is johnsmith22.
                                    </p>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-500 text-sm sm:text-base mb-2">
                                    Actions
                                </h3>
                                <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                                    <Button className="justify-start text-xs sm:text-sm" variant="outline">
                                        Assign Ticket
                                    </Button>
                                    <Button className="justify-start text-xs sm:text-sm" variant="outline">
                                        Update Status
                                    </Button>
                                    <Button className="justify-start text-xs sm:text-sm" variant="outline">
                                        Add Note
                                    </Button>
                                    <Button className="justify-start text-xs sm:text-sm" variant="outline">
                                        Merge Tickets
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Ticket Settings Dialog - Responsive */}
            <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
                <DialogContent className="max-w-[95vw] sm:max-w-xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-lg sm:text-xl">Ticket Settings</DialogTitle>
                        <DialogDescription className="text-sm">
                            Configure rules for ticket prioritization and automatic assignment
                        </DialogDescription>
                    </DialogHeader>

                    <Tabs defaultValue="urgency" className="mt-4">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="urgency" className="text-xs sm:text-sm">
                                Urgency Rules
                            </TabsTrigger>
                            <TabsTrigger value="hni" className="text-xs sm:text-sm">
                                HNI Priority
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="urgency" className="space-y-4 mt-4">
                            <div className="space-y-4">
                                {/* Response Time Based Priority */}
                                <Card>
                                    <CardContent className="p-3 sm:p-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                            <div className="flex-1">
                                                <h3 className="font-medium text-sm sm:text-base">
                                                    Response Time Based Priority
                                                </h3>
                                                <p className="text-xs sm:text-sm text-gray-500">
                                                    Automatically escalate priority based on waiting time
                                                </p>
                                            </div>
                                            <Switch />
                                        </div>
                                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                            <div>
                                                <Label className="text-xs sm:text-sm">
                                                    Upgrade to Medium after
                                                </Label>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Input 
                                                        type="number" 
                                                        placeholder="30" 
                                                        className="text-sm"
                                                    />
                                                    <span className="text-xs sm:text-sm">mins</span>
                                                </div>
                                            </div>
                                            <div>
                                                <Label className="text-xs sm:text-sm">
                                                    Upgrade to High after
                                                </Label>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Input 
                                                        type="number" 
                                                        placeholder="120" 
                                                        className="text-sm"
                                                    />
                                                    <span className="text-xs sm:text-sm">mins</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Keyword Based Priority */}
                                <Card>
                                    <CardContent className="p-3 sm:p-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                            <div className="flex-1">
                                                <h3 className="font-medium text-sm sm:text-base">
                                                    Keyword Based Priority
                                                </h3>
                                                <p className="text-xs sm:text-sm text-gray-500">
                                                    Set priority based on specific keywords in ticket
                                                </p>
                                            </div>
                                            <Switch />
                                        </div>
                                        <div className="mt-4 space-y-3">
                                            <div>
                                                <Label className="text-xs sm:text-sm">
                                                    Critical Priority Keywords
                                                </Label>
                                                <Input 
                                                    className="mt-1 text-sm" 
                                                    placeholder="urgent, critical, emergency" 
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-xs sm:text-sm">
                                                    High Priority Keywords
                                                </Label>
                                                <Input 
                                                    className="mt-1 text-sm" 
                                                    placeholder="important, error, broken" 
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Source Based Priority */}
                                <Card>
                                    <CardContent className="p-3 sm:p-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                            <div className="flex-1">
                                                <h3 className="font-medium text-sm sm:text-base">
                                                    Source Based Priority
                                                </h3>
                                                <p className="text-xs sm:text-sm text-gray-500">
                                                    Set default priority by ticket source
                                                </p>
                                            </div>
                                            <Switch />
                                        </div>
                                        <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4">
                                            <div>
                                                <Label className="text-xs sm:text-sm">Phone</Label>
                                                <select className="w-full mt-1 border rounded p-2 text-sm">
                                                    <option>High</option>
                                                    <option>Medium</option>
                                                    <option>Low</option>
                                                </select>
                                            </div>
                                            <div>
                                                <Label className="text-xs sm:text-sm">Email</Label>
                                                <select className="w-full mt-1 border rounded p-2 text-sm">
                                                    <option>Medium</option>
                                                    <option>High</option>
                                                    <option>Low</option>
                                                </select>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        <TabsContent value="hni" className="space-y-4 mt-4">
                            {/* HNI Alert */}
                            <div className="flex items-center justify-between p-3 sm:p-4 border rounded-lg bg-amber-50">
                                <div className="flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />
                                    <h3 className="font-medium text-sm sm:text-base">
                                        HNI Automatic Priority
                                    </h3>
                                </div>
                                <Switch defaultChecked />
                            </div>

                            {/* HNI Customer Detection */}
                            <Card>
                                <CardContent className="p-3 sm:p-4">
                                    <h3 className="font-medium text-sm sm:text-base mb-3">
                                        HNI Customer Detection
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <Label className="text-xs sm:text-sm">
                                                Account Types Considered HNI
                                            </Label>
                                            <div className="flex flex-wrap gap-3 mt-2">
                                                <div className="flex items-center gap-2">
                                                    <input type="checkbox" id="premium" defaultChecked />
                                                    <label htmlFor="premium" className="text-xs sm:text-sm">
                                                        Premium
                                                    </label>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <input type="checkbox" id="enterprise" defaultChecked />
                                                    <label htmlFor="enterprise" className="text-xs sm:text-sm">
                                                        Enterprise
                                                    </label>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <input type="checkbox" id="vip" defaultChecked />
                                                    <label htmlFor="vip" className="text-xs sm:text-sm">
                                                        VIP
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <Label className="text-xs sm:text-sm">
                                                Annual Spend Threshold ($)
                                            </Label>
                                            <Input 
                                                type="number" 
                                                placeholder="100000" 
                                                className="mt-1 text-sm" 
                                            />
                                        </div>

                                        <div>
                                            <Label className="text-xs sm:text-sm">
                                                Default HNI Priority Level
                                            </Label>
                                            <select className="w-full mt-1 border rounded p-2 text-sm">
                                                <option>Critical</option>
                                                <option>High</option>
                                                <option>Medium</option>
                                            </select>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* HNI Routing Rules */}
                            <Card>
                                <CardContent className="p-3 sm:p-4">
                                    <h3 className="font-medium text-sm sm:text-base mb-3">
                                        HNI Routing Rules
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-xs sm:text-sm">
                                                Automatic Assignment to Senior Agents
                                            </Label>
                                            <Switch defaultChecked />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <Label className="text-xs sm:text-sm">
                                                Notify Management on HNI Tickets
                                            </Label>
                                            <Switch defaultChecked />
                                        </div>

                                        <div>
                                            <Label className="text-xs sm:text-sm">
                                                HNI Response SLA (minutes)
                                            </Label>
                                            <Input 
                                                type="number" 
                                                placeholder="15" 
                                                className="mt-1 text-sm" 
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 mt-4">
                        <Button 
                            variant="outline" 
                            onClick={() => setSettingsDialogOpen(false)}
                            className="w-full sm:w-auto"
                        >
                            Cancel
                        </Button>
                        <Button 
                            className="w-full sm:w-auto bg-[#0A1E4E] hover:bg-[#0A1E4E]/90 text-white"
                        >
                            Save Settings
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}