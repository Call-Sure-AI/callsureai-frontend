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
import { Filter, MoreVertical } from "lucide-react"

const tickets = [
    {
        id: "TKT-001",
        raisedTime: "2025-04-05T09:30:00",
        description: "Login issue with customer portal",
        assignedTo: "Sarah Johnson",
        customerDetails: "Acme Corp, John Smith",
        status: "Open",
        source: "Email"
    },
    {
        id: "TKT-002",
        raisedTime: "2025-04-06T10:15:00",
        description: "Payment gateway integration error",
        assignedTo: "Mike Chen",
        customerDetails: "TechSolutions Inc., Lisa Wong",
        status: "In Progress",
        source: "Phone"
    },
    {
        id: "TKT-003",
        raisedTime: "2025-04-06T14:45:00",
        description: "Data export functionality not working",
        assignedTo: "Alex Thompson",
        customerDetails: "Global Services, Robert Garcia",
        status: "Resolved",
        source: "Web Form"
    },
    {
        id: "TKT-004",
        raisedTime: "2025-04-07T08:20:00",
        description: "Account access request for new team member",
        assignedTo: "Unassigned",
        customerDetails: "Northern Manufacturing, Emily Taylor",
        status: "New",
        source: "Chat"
    },
]

export default function TicketsPage() {
    const [selectedTicket, setSelectedTicket] = useState<string | null>(null)

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

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Ticket Queries</h1>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                    </Button>
                    <Button variant="primary">New Ticket</Button>
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
        </div>
    )
}