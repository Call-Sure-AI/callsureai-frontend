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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Filter, MoreVertical, Settings, AlertTriangle } from "lucide-react"

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
            case 'high': return 'bg-orange-500'
            case 'medium': return 'bg-yellow-400'
            case 'low': return 'bg-blue-400'
            default: return 'bg-gray-400'
        }
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Ticket Queries</h1>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => setSettingsDialogOpen(true)}
                    >
                        <Settings className="h-4 w-4 mr-2" />
                        Ticket Settings
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 shadow">
                    <div className="text-sm text-gray-500">Total Tickets</div>
                    <div className="text-2xl font-bold">42</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow">
                    <div className="text-sm text-gray-500">Open Tickets</div>
                    <div className="text-2xl font-bold">16</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow">
                    <div className="text-sm text-gray-500">Resolved Today</div>
                    <div className="text-2xl font-bold">8</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow">
                    <div className="text-sm text-gray-500">Avg. Response Time</div>
                    <div className="text-2xl font-bold">2.5h</div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow">
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
                                className={selectedTicket === ticket.id ? "bg-blue-50" : ""}
                                onClick={() => setSelectedTicket(ticket.id)}
                            >
                                <TableCell className="font-medium">{ticket.id}</TableCell>
                                <TableCell>{formatDate(ticket.raisedTime)}</TableCell>
                                <TableCell>{ticket.description}</TableCell>
                                <TableCell>{ticket.assignedTo}</TableCell>
                                <TableCell>{ticket.customerDetails}</TableCell>
                                <TableCell>
                                    <Badge className={getStatusColor(ticket.status)}>
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

            {selectedTicket && (
                <div className="mt-6 bg-white rounded-lg p-6 shadow">
                    <h2 className="text-xl font-bold mb-4">Ticket Details: {selectedTicket}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-medium text-gray-500">Conversation History</h3>
                            <div className="mt-2 border rounded-lg p-4 h-48 overflow-y-auto">
                                <p className="text-sm mb-2"><span className="font-bold">Agent (09:32):</span> Hello, how can I help you today?</p>
                                <p className="text-sm mb-2"><span className="font-bold">Customer (09:33):</span> I&apos;m having trouble logging into my account.</p>
                                <p className="text-sm mb-2"><span className="font-bold">Agent (09:34):</span> I&apos;m sorry to hear that. Could you please confirm your username?</p>
                                <p className="text-sm"><span className="font-bold">Customer (09:35):</span> My username is johnsmith22.</p>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-500">Actions</h3>
                            <div className="mt-2 space-y-2">
                                <Button className="w-full justify-start" variant="outline">Assign Ticket</Button>
                                <Button className="w-full justify-start" variant="outline">Update Status</Button>
                                <Button className="w-full justify-start" variant="outline">Add Note</Button>
                                <Button className="w-full justify-start" variant="outline">Merge Tickets</Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Ticket Settings Dialog */}
            <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Ticket Settings</DialogTitle>
                        <DialogDescription>
                            Configure rules for ticket prioritization and automatic assignment
                        </DialogDescription>
                    </DialogHeader>

                    <Tabs defaultValue="urgency">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="urgency">Urgency Rules</TabsTrigger>
                            <TabsTrigger value="hni">HNI Priority</TabsTrigger>
                        </TabsList>

                        <TabsContent value="urgency" className="space-y-4 mt-4">
                            <div className="space-y-4">
                                <div className="border rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium">Response Time Based Priority</h3>
                                            <p className="text-sm text-gray-500">Automatically escalate priority based on waiting time</p>
                                        </div>
                                        <Switch />
                                    </div>
                                    <div className="mt-4 grid grid-cols-2 gap-4">
                                        <div>
                                            <Label>Upgrade to Medium after</Label>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Input type="number" placeholder="30" />
                                                <span>mins</span>
                                            </div>
                                        </div>
                                        <div>
                                            <Label>Upgrade to High after</Label>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Input type="number" placeholder="120" />
                                                <span>mins</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="border rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium">Keyword Based Priority</h3>
                                            <p className="text-sm text-gray-500">Set priority based on specific keywords in ticket</p>
                                        </div>
                                        <Switch />
                                    </div>
                                    <div className="mt-4 space-y-2">
                                        <div>
                                            <Label>Critical Priority Keywords</Label>
                                            <Input className="mt-1" placeholder="urgent, critical, emergency" />
                                        </div>
                                        <div>
                                            <Label>High Priority Keywords</Label>
                                            <Input className="mt-1" placeholder="important, error, broken" />
                                        </div>
                                    </div>
                                </div>

                                <div className="border rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium">Source Based Priority</h3>
                                            <p className="text-sm text-gray-500">Set default priority by ticket source</p>
                                        </div>
                                        <Switch />
                                    </div>
                                    <div className="mt-4 grid grid-cols-2 gap-4">
                                        <div>
                                            <Label>Phone</Label>
                                            <select className="w-full mt-1 border rounded p-2">
                                                <option>High</option>
                                                <option>Medium</option>
                                                <option>Low</option>
                                            </select>
                                        </div>
                                        <div>
                                            <Label>Email</Label>
                                            <select className="w-full mt-1 border rounded p-2">
                                                <option>Medium</option>
                                                <option>High</option>
                                                <option>Low</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="hni" className="space-y-4 mt-4">
                            <div className="flex items-center justify-between p-4 border rounded-lg bg-amber-50">
                                <div className="flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                                    <h3 className="font-medium">HNI Automatic Priority</h3>
                                </div>
                                <Switch defaultChecked />
                            </div>

                            <div className="border rounded-lg p-4">
                                <h3 className="font-medium mb-2">HNI Customer Detection</h3>
                                <div className="space-y-4">
                                    <div>
                                        <Label>Account Types Considered HNI</Label>
                                        <div className="flex gap-2 mt-1">
                                            <div className="flex items-center gap-2">
                                                <input type="checkbox" id="premium" defaultChecked />
                                                <label htmlFor="premium">Premium</label>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <input type="checkbox" id="enterprise" defaultChecked />
                                                <label htmlFor="enterprise">Enterprise</label>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <input type="checkbox" id="vip" defaultChecked />
                                                <label htmlFor="vip">VIP</label>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <Label>Annual Spend Threshold ($)</Label>
                                        <Input type="number" placeholder="100000" className="mt-1" />
                                    </div>

                                    <div>
                                        <Label>Default HNI Priority Level</Label>
                                        <select className="w-full mt-1 border rounded p-2">
                                            <option>Critical</option>
                                            <option>High</option>
                                            <option>Medium</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h3 className="font-medium mb-2">HNI Routing Rules</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label>Automatic Assignment to Senior Agents</Label>
                                        <Switch defaultChecked />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <Label>Notify Management on HNI Tickets</Label>
                                        <Switch defaultChecked />
                                    </div>

                                    <div>
                                        <Label>HNI Response SLA (minutes)</Label>
                                        <Input type="number" placeholder="15" className="mt-1" />
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSettingsDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button className="bg-[#0A1E4E] hover:bg-[#0A1E4E]/90 text-white">
                            Save Settings
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}