// app\(settings)\tickets\page.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Plus,
    Search,
    Calendar,
    User,
    Building,
    Phone,
    Mail,
    MessageSquare,
    Globe,
    MoreVertical,
    Clock,
    AlertCircle,
    CheckCircle2,
    Loader2,
    Settings,
    RefreshCw,
    FileText,
    Send,
    X,
    AlertTriangle,
    Edit,
} from "lucide-react";
import { useTickets } from "@/contexts/ticket-context";
import { Ticket, CreateTicketData, UpdateTicketData } from "@/services/ticket-service";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

export default function TicketsPage() {
    const {
        tickets,
        stats,
        loading,
        refreshTickets,
        createNewTicket,
        updateTicketStatus,
        addNote,
    } = useTickets();

    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [createOpen, setCreateOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [priorityFilter, setPriorityFilter] = useState<string>("all");

    // Create ticket form state
    const [createForm, setCreateForm] = useState<CreateTicketData>({
        customer_id: "",
        title: "",
        description: "",
        priority: "medium",
        tags: [],
        customer_name: "",
        customer_email: "",
        customer_phone: "",
    });

    // Note form state
    const [noteContent, setNoteContent] = useState("");
    const [isInternalNote, setIsInternalNote] = useState(false);
    const [isAddingNote, setIsAddingNote] = useState(false);

    // Update ticket state
    const [isUpdating, setIsUpdating] = useState(false);

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), "MMM dd, yyyy HH:mm");
        } catch {
            return dateString;
        }
    };

    const formatDateShort = (dateString: string) => {
        try {
            return format(new Date(dateString), "MMM dd, HH:mm");
        } catch {
            return dateString;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'new': return 'bg-blue-500 dark:bg-blue-600';
            case 'open': return 'bg-yellow-500 dark:bg-yellow-600';
            case 'in_progress': return 'bg-purple-500 dark:bg-purple-600';
            case 'resolved': return 'bg-green-500 dark:bg-green-600';
            case 'closed': return 'bg-gray-500 dark:bg-gray-600';
            default: return 'bg-gray-400';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'new': return <AlertCircle className="w-3 h-3" />;
            case 'open': return <Clock className="w-3 h-3" />;
            case 'in_progress': return <Loader2 className="w-3 h-3 animate-spin" />;
            case 'resolved': return <CheckCircle2 className="w-3 h-3" />;
            case 'closed': return <CheckCircle2 className="w-3 h-3" />;
            default: return <AlertCircle className="w-3 h-3" />;
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority.toLowerCase()) {
            case 'critical': return 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/30';
            case 'high': return 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-500/30';
            case 'medium': return 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/30';
            case 'low': return 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/30';
            default: return 'bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-400';
        }
    };

    const getSourceIcon = (source: string) => {
        switch (source.toLowerCase()) {
            case 'email': return <Mail className="w-3 h-3" />;
            case 'phone': return <Phone className="w-3 h-3" />;
            case 'chat': return <MessageSquare className="w-3 h-3" />;
            case 'web_form': return <Globe className="w-3 h-3" />;
            case 'auto_generated': return <Settings className="w-3 h-3" />;
            default: return <MessageSquare className="w-3 h-3" />;
        }
    };

    // Apply filters
    const filteredTickets = tickets.filter(ticket => {
        const matchesSearch = !searchQuery ||
            ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ticket.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
        const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter;

        return matchesSearch && matchesStatus && matchesPriority;
    });

    const handleCreateTicket = async () => {
        try {
            if (!createForm.title || !createForm.description || !createForm.customer_id) {
                toast({
                    title: "Validation Error",
                    description: "Please fill in all required fields",
                    variant: "destructive",
                });
                return;
            }

            await createNewTicket(createForm);

            toast({
                title: "Success",
                description: "Ticket created successfully",
            });

            setCreateOpen(false);
            setCreateForm({
                customer_id: "",
                title: "",
                description: "",
                priority: "medium",
                tags: [],
                customer_name: "",
                customer_email: "",
                customer_phone: "",
            });
        } catch (err: any) {
            toast({
                title: "Error",
                description: err.message || "Failed to create ticket",
                variant: "destructive",
            });
        }
    };

    const handleUpdateStatus = async (ticketId: string, status: string) => {
        try {
            setIsUpdating(true);
            await updateTicketStatus(ticketId, { status } as UpdateTicketData);

            toast({
                title: "Success",
                description: "Ticket status updated",
            });

            // Refresh the selected ticket
            const updated = tickets.find(t => t.id === ticketId);
            if (updated) setSelectedTicket(updated);
        } catch (err: any) {
            toast({
                title: "Error",
                description: err.message || "Failed to update ticket",
                variant: "destructive",
            });
        } finally {
            setIsUpdating(false);
        }
    };

    const handleUpdatePriority = async (ticketId: string, priority: string) => {
        try {
            setIsUpdating(true);
            await updateTicketStatus(ticketId, { priority } as UpdateTicketData);

            toast({
                title: "Success",
                description: "Priority updated",
            });

            const updated = tickets.find(t => t.id === ticketId);
            if (updated) setSelectedTicket(updated);
        } catch (err: any) {
            toast({
                title: "Error",
                description: err.message || "Failed to update priority",
                variant: "destructive",
            });
        } finally {
            setIsUpdating(false);
        }
    };

    const handleAddNote = async () => {
        if (!selectedTicket || !noteContent.trim()) return;

        try {
            setIsAddingNote(true);
            await addNote(selectedTicket.id, noteContent, isInternalNote);

            toast({
                title: "Success",
                description: "Note added successfully",
            });

            setNoteContent("");
            setIsInternalNote(false);
        } catch (err: any) {
            toast({
                title: "Error",
                description: err.message || "Failed to add note",
                variant: "destructive",
            });
        } finally {
            setIsAddingNote(false);
        }
    };

    const handleViewDetails = (ticket: Ticket) => {
        setSelectedTicket(ticket);
        setDetailsOpen(true);
    };

    // Mobile Ticket Card
    const TicketCard = ({ ticket }: { ticket: Ticket }) => {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onClick={() => handleViewDetails(ticket)}
                className="relative bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 hover:border-cyan-300 dark:hover:border-cyan-600 transition-all cursor-pointer hover:shadow-lg"
            >
                <div className="p-4">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="font-semibold text-sm text-gray-900 dark:text-white font-mono">
                                    {ticket.id}
                                </span>
                                <Badge className={`${getPriorityColor(ticket.priority)} text-[10px] border`}>
                                    {ticket.priority.toUpperCase()}
                                </Badge>
                                <Badge className={`${getStatusColor(ticket.status)} text-white text-[10px] flex items-center gap-1`}>
                                    {getStatusIcon(ticket.status)}
                                    {ticket.status.replace('_', ' ').toUpperCase()}
                                </Badge>
                            </div>
                            <p className="text-sm text-gray-900 dark:text-gray-100 line-clamp-2 font-medium">
                                {ticket.title}
                            </p>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDateShort(ticket.created_at)}</span>
                        </div>
                        {ticket.assigned_to && (
                            <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                                <User className="w-3 h-3" />
                                <span className="truncate">{ticket.assigned_to}</span>
                            </div>
                        )}
                        {ticket.customer_name && (
                            <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                                <Building className="w-3 h-3" />
                                <span className="truncate">{ticket.customer_name}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                            {getSourceIcon(ticket.source)}
                            <span className="capitalize">{ticket.source.replace('_', ' ')}</span>
                        </div>
                    </div>

                    {/* Tags */}
                    {ticket.tags && ticket.tags.length > 0 && (
                        <div className="flex gap-1 mt-3 flex-wrap">
                            {ticket.tags.slice(0, 3).map((tag, idx) => (
                                <span
                                    key={idx}
                                    className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300"
                                >
                                    {tag}
                                </span>
                            ))}
                            {ticket.tags.length > 3 && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300">
                                    +{ticket.tags.length - 3}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </motion.div>
        );
    };

    if (loading && tickets.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-3 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
                    <p className="text-gray-500 dark:text-gray-400">Loading tickets...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                                <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">Support</span> Tickets
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">
                                Manage and track customer support requests
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                className="rounded-xl h-10"
                                onClick={() => refreshTickets()}
                                disabled={loading}
                            >
                                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                                Refresh
                            </Button>
                            <Button
                                variant="outline"
                                className="rounded-xl h-10"
                                onClick={() => setSettingsOpen(true)}
                            >
                                <Settings className="w-4 h-4 mr-2" />
                                Settings
                            </Button>
                            <Button
                                className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium shadow-lg shadow-cyan-500/25"
                                onClick={() => setCreateOpen(true)}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                New Ticket
                            </Button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    {stats && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-4"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <MessageSquare className="w-5 h-5 text-cyan-500" />
                                    <span className="text-xs text-gray-500 dark:text-gray-400">Total Tickets</span>
                                </div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total_tickets}</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.05 }}
                                className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-4"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                                    <span className="text-xs text-gray-500 dark:text-gray-400">Open</span>
                                </div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.open_tickets}</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-4"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    <span className="text-xs text-gray-500 dark:text-gray-400">Resolved</span>
                                </div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.resolved_tickets}</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                                className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-4"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <Clock className="w-5 h-5 text-purple-500" />
                                    <span className="text-xs text-gray-500 dark:text-gray-400">Avg Response</span>
                                </div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {stats.avg_resolution_time_hours.toFixed(1)}h
                                </p>
                            </motion.div>
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-6">
                {/* Filters */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-5 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Search tickets by ID, title, or description..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-10 rounded-xl bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-40 h-10 rounded-xl">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="new">New</SelectItem>
                                <SelectItem value="open">Open</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="resolved">Resolved</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                            <SelectTrigger className="w-full sm:w-40 h-10 rounded-xl">
                                <SelectValue placeholder="Priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Priority</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="critical">Critical</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Tickets List */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden">
                    {/* Mobile View - Cards */}
                    <div className="block lg:hidden p-4 space-y-3">
                        <AnimatePresence>
                            {filteredTickets.map((ticket) => (
                                <TicketCard key={ticket.id} ticket={ticket} />
                            ))}
                        </AnimatePresence>

                        {filteredTickets.length === 0 && (
                            <div className="text-center py-12">
                                <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    No tickets found
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400">
                                    {searchQuery || statusFilter !== "all" || priorityFilter !== "all"
                                        ? "Try adjusting your filters"
                                        : "Create your first support ticket"}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Desktop View - Table */}
                    <div className="hidden lg:block overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[120px]">Ticket ID</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead className="w-[140px]">Created</TableHead>
                                    <TableHead className="w-[120px]">Priority</TableHead>
                                    <TableHead className="w-[120px]">Status</TableHead>
                                    <TableHead className="w-[150px]">Assigned To</TableHead>
                                    <TableHead className="w-[100px]">Source</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredTickets.map((ticket) => (
                                    <TableRow
                                        key={ticket.id}
                                        className="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-slate-800"
                                        onClick={() => handleViewDetails(ticket)}
                                    >
                                        <TableCell className="font-medium font-mono text-xs">
                                            {ticket.id}
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white line-clamp-1">
                                                    {ticket.title}
                                                </p>
                                                {ticket.customer_name && (
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {ticket.customer_name}
                                                    </p>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {formatDate(ticket.created_at)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={`${getPriorityColor(ticket.priority)} border text-xs`}>
                                                {ticket.priority.toUpperCase()}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={`${getStatusColor(ticket.status)} text-white text-xs flex items-center gap-1 w-fit`}>
                                                {getStatusIcon(ticket.status)}
                                                {ticket.status.replace('_', ' ').toUpperCase()}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {ticket.assigned_to || (
                                                <span className="text-gray-400 dark:text-gray-600">Unassigned</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                                {getSourceIcon(ticket.source)}
                                                <span className="capitalize">{ticket.source.replace('_', ' ')}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleViewDetails(ticket)}>
                                                        <FileText className="w-4 h-4 mr-2" />
                                                        View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleUpdateStatus(ticket.id, 'in_progress')}>
                                                        <Edit className="w-4 h-4 mr-2" />
                                                        Mark In Progress
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleUpdateStatus(ticket.id, 'resolved')}>
                                                        <CheckCircle2 className="w-4 h-4 mr-2" />
                                                        Mark Resolved
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleUpdateStatus(ticket.id, 'closed')}>
                                                        <X className="w-4 h-4 mr-2" />
                                                        Close Ticket
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}

                                {filteredTickets.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={8} className="h-32 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <MessageSquare className="w-10 h-10 text-gray-300 dark:text-gray-600" />
                                                <p className="text-gray-500 dark:text-gray-400">
                                                    {searchQuery || statusFilter !== "all" || priorityFilter !== "all"
                                                        ? "No tickets match your filters"
                                                        : "No tickets yet"}
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>

            {/* Ticket Details Modal */}
            <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0 bg-white dark:bg-slate-900">
                    {selectedTicket && (
                        <>
                            <DialogHeader className="p-6 border-b border-gray-200 dark:border-slate-800">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {selectedTicket.id}
                                        </DialogTitle>
                                        <p className="text-gray-600 dark:text-gray-400 mt-1">{selectedTicket.title}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Badge className={`${getPriorityColor(selectedTicket.priority)} border`}>
                                            {selectedTicket.priority.toUpperCase()}
                                        </Badge>
                                        <Badge className={`${getStatusColor(selectedTicket.status)} text-white flex items-center gap-1`}>
                                            {getStatusIcon(selectedTicket.status)}
                                            {selectedTicket.status.replace('_', ' ').toUpperCase()}
                                        </Badge>
                                    </div>
                                </div>
                            </DialogHeader>

                            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                                <Tabs defaultValue="details" className="w-full">
                                    <TabsList className="grid w-full grid-cols-3 mb-6">
                                        <TabsTrigger value="details">Details</TabsTrigger>
                                        <TabsTrigger value="notes">Notes</TabsTrigger>
                                        <TabsTrigger value="history">History</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="details" className="space-y-6">
                                        {/* Description */}
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
                                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap bg-gray-50 dark:bg-slate-800 p-4 rounded-xl">
                                                {selectedTicket.description}
                                            </p>
                                        </div>

                                        {/* Customer Info */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl">
                                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Customer Information</h4>
                                                <div className="space-y-2">
                                                    {selectedTicket.customer_name && (
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <User className="w-4 h-4 text-gray-400" />
                                                            <span className="text-gray-900 dark:text-white">{selectedTicket.customer_name}</span>
                                                        </div>
                                                    )}
                                                    {selectedTicket.customer_email && (
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Mail className="w-4 h-4 text-gray-400" />
                                                            <span className="text-gray-900 dark:text-white">{selectedTicket.customer_email}</span>
                                                        </div>
                                                    )}
                                                    {selectedTicket.customer_phone && (
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Phone className="w-4 h-4 text-gray-400" />
                                                            <span className="text-gray-900 dark:text-white">{selectedTicket.customer_phone}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <span className="text-gray-500 dark:text-gray-400">ID:</span>
                                                        <span className="text-gray-900 dark:text-white font-mono text-xs">{selectedTicket.customer_id}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl">
                                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Ticket Information</h4>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500 dark:text-gray-400">Created:</span>
                                                        <span className="text-gray-900 dark:text-white">{formatDate(selectedTicket.created_at)}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500 dark:text-gray-400">Updated:</span>
                                                        <span className="text-gray-900 dark:text-white">{formatDate(selectedTicket.updated_at)}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500 dark:text-gray-400">Source:</span>
                                                        <span className="text-gray-900 dark:text-white capitalize">{selectedTicket.source.replace('_', ' ')}</span>
                                                    </div>
                                                    {selectedTicket.assigned_to && (
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-500 dark:text-gray-400">Assigned:</span>
                                                            <span className="text-gray-900 dark:text-white">{selectedTicket.assigned_to}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Tags */}
                                        {selectedTicket.tags && selectedTicket.tags.length > 0 && (
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Tags</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedTicket.tags.map((tag, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-slate-700">
                                            <Select
                                                value={selectedTicket.status}
                                                onValueChange={(value) => handleUpdateStatus(selectedTicket.id, value)}
                                                disabled={isUpdating}
                                            >
                                                <SelectTrigger className="w-40 rounded-xl">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="new">New</SelectItem>
                                                    <SelectItem value="open">Open</SelectItem>
                                                    <SelectItem value="in_progress">In Progress</SelectItem>
                                                    <SelectItem value="resolved">Resolved</SelectItem>
                                                    <SelectItem value="closed">Closed</SelectItem>
                                                </SelectContent>
                                            </Select>

                                            <Select
                                                value={selectedTicket.priority}
                                                onValueChange={(value) => handleUpdatePriority(selectedTicket.id, value)}
                                                disabled={isUpdating}
                                            >
                                                <SelectTrigger className="w-40 rounded-xl">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="low">Low</SelectItem>
                                                    <SelectItem value="medium">Medium</SelectItem>
                                                    <SelectItem value="high">High</SelectItem>
                                                    <SelectItem value="critical">Critical</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="notes" className="space-y-4">
                                        {/* Add Note Form */}
                                        <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl">
                                            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                                                Add Note
                                            </Label>
                                            <Textarea
                                                value={noteContent}
                                                onChange={(e) => setNoteContent(e.target.value)}
                                                placeholder="Type your note here..."
                                                className="mb-3 min-h-[100px] rounded-xl"
                                            />
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Switch
                                                        checked={isInternalNote}
                                                        onCheckedChange={setIsInternalNote}
                                                    />
                                                    <Label className="text-sm text-gray-600 dark:text-gray-400">
                                                        Internal note (not visible to customer)
                                                    </Label>
                                                </div>
                                                <Button
                                                    onClick={handleAddNote}
                                                    disabled={!noteContent.trim() || isAddingNote}
                                                    className="rounded-xl bg-cyan-600 hover:bg-cyan-500"
                                                >
                                                    {isAddingNote ? (
                                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    ) : (
                                                        <Send className="w-4 h-4 mr-2" />
                                                    )}
                                                    Add Note
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Notes List */}
                                        {selectedTicket.notes && selectedTicket.notes.length > 0 ? (
                                            <div className="space-y-3">
                                                {selectedTicket.notes.map((note) => (
                                                    <div
                                                        key={note.id}
                                                        className={`p-4 rounded-xl border ${
                                                            note.is_internal
                                                                ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20'
                                                                : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700'
                                                        }`}
                                                    >
                                                        <div className="flex items-start justify-between mb-2">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                                    {note.created_by}
                                                                </span>
                                                                {note.is_internal && (
                                                                    <Badge className="bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-[10px]">
                                                                        Internal
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                                {formatDate(note.created_at)}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                                            {note.content}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                                No notes yet. Add the first note above.
                                            </div>
                                        )}
                                    </TabsContent>

                                    <TabsContent value="history">
                                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                            Ticket history will be displayed here
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Create Ticket Modal */}
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                            Create New Ticket
                        </DialogTitle>
                        <DialogDescription>
                            Fill in the details to create a new support ticket
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {/* Customer ID */}
                        <div>
                            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Customer ID <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                value={createForm.customer_id}
                                onChange={(e) => setCreateForm({ ...createForm, customer_id: e.target.value })}
                                placeholder="CUST-001"
                                className="mt-1 rounded-xl"
                            />
                        </div>

                        {/* Title */}
                        <div>
                            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Title <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                value={createForm.title}
                                onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                                placeholder="Brief description of the issue"
                                className="mt-1 rounded-xl"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Description <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                value={createForm.description}
                                onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                                placeholder="Detailed description of the issue..."
                                className="mt-1 min-h-[120px] rounded-xl"
                            />
                        </div>

                        {/* Priority */}
                        <div>
                            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Priority
                            </Label>
                            <Select
                                value={createForm.priority}
                                onValueChange={(value) => setCreateForm({ ...createForm, priority: value as any })}
                            >
                                <SelectTrigger className="mt-1 rounded-xl">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="critical">Critical</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Customer Details */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Customer Name
                                </Label>
                                <Input
                                    value={createForm.customer_name}
                                    onChange={(e) => setCreateForm({ ...createForm, customer_name: e.target.value })}
                                    placeholder="John Doe"
                                    className="mt-1 rounded-xl"
                                />
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Email
                                </Label>
                                <Input
                                    type="email"
                                    value={createForm.customer_email}
                                    onChange={(e) => setCreateForm({ ...createForm, customer_email: e.target.value })}
                                    placeholder="john@example.com"
                                    className="mt-1 rounded-xl"
                                />
                            </div>
                        </div>

                        <div>
                            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Phone
                            </Label>
                            <Input
                                value={createForm.customer_phone}
                                onChange={(e) => setCreateForm({ ...createForm, customer_phone: e.target.value })}
                                placeholder="+1234567890"
                                className="mt-1 rounded-xl"
                            />
                        </div>

                        {/* Tags */}
                        <div>
                            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Tags (comma-separated)
                            </Label>
                            <Input
                                value={createForm.tags?.join(', ')}
                                onChange={(e) => setCreateForm({
                                    ...createForm,
                                    tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                                })}
                                placeholder="billing, urgent, refund"
                                className="mt-1 rounded-xl"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setCreateOpen(false)}
                            className="rounded-xl"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCreateTicket}
                            className="rounded-xl bg-cyan-600 hover:bg-cyan-500"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Create Ticket
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Settings Dialog */}
            <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                            Ticket Settings
                        </DialogTitle>
                        <DialogDescription>
                            Configure rules for ticket prioritization and automatic assignment
                        </DialogDescription>
                    </DialogHeader>

                    <Tabs defaultValue="urgency" className="mt-4">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="urgency">Urgency Rules</TabsTrigger>
                            <TabsTrigger value="hni">HNI Priority</TabsTrigger>
                        </TabsList>

                        <TabsContent value="urgency" className="space-y-4 mt-4">
                            {/* Response Time Based Priority */}
                            <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="font-medium text-gray-900 dark:text-white">
                                            Response Time Based Priority
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Automatically escalate priority based on waiting time
                                        </p>
                                    </div>
                                    <Switch />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm">Upgrade to Medium after</Label>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Input type="number" placeholder="30" className="rounded-xl" />
                                            <span className="text-sm text-gray-600 dark:text-gray-400">mins</span>
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-sm">Upgrade to High after</Label>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Input type="number" placeholder="120" className="rounded-xl" />
                                            <span className="text-sm text-gray-600 dark:text-gray-400">mins</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Keyword Based Priority */}
                            <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="font-medium text-gray-900 dark:text-white">
                                            Keyword Based Priority
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Set priority based on specific keywords in ticket
                                        </p>
                                    </div>
                                    <Switch />
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <Label className="text-sm">Critical Priority Keywords</Label>
                                        <Input
                                            className="mt-1 rounded-xl"
                                            placeholder="urgent, critical, emergency"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-sm">High Priority Keywords</Label>
                                        <Input
                                            className="mt-1 rounded-xl"
                                            placeholder="important, error, broken"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Source Based Priority */}
                            <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="font-medium text-gray-900 dark:text-white">
                                            Source Based Priority
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Set default priority by ticket source
                                        </p>
                                    </div>
                                    <Switch />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm">Phone</Label>
                                        <Select>
                                            <SelectTrigger className="mt-1 rounded-xl">
                                                <SelectValue placeholder="High" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="low">Low</SelectItem>
                                                <SelectItem value="medium">Medium</SelectItem>
                                                <SelectItem value="high">High</SelectItem>
                                                <SelectItem value="critical">Critical</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label className="text-sm">Email</Label>
                                        <Select>
                                            <SelectTrigger className="mt-1 rounded-xl">
                                                <SelectValue placeholder="Medium" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="low">Low</SelectItem>
                                                <SelectItem value="medium">Medium</SelectItem>
                                                <SelectItem value="high">High</SelectItem>
                                                <SelectItem value="critical">Critical</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="hni" className="space-y-4 mt-4">
                            {/* HNI Alert */}
                            <div className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl">
                                <div className="flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                                    <h3 className="font-medium text-gray-900 dark:text-white">
                                        HNI Automatic Priority
                                    </h3>
                                </div>
                                <Switch defaultChecked />
                            </div>

                            {/* HNI Customer Detection */}
                            <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl">
                                <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                                    HNI Customer Detection
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <Label className="text-sm">Account Types Considered HNI</Label>
                                        <div className="flex flex-wrap gap-3 mt-2">
                                            <div className="flex items-center gap-2">
                                                <input type="checkbox" id="premium" defaultChecked />
                                                <label htmlFor="premium" className="text-sm">Premium</label>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <input type="checkbox" id="enterprise" defaultChecked />
                                                <label htmlFor="enterprise" className="text-sm">Enterprise</label>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <input type="checkbox" id="vip" defaultChecked />
                                                <label htmlFor="vip" className="text-sm">VIP</label>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="text-sm">Annual Spend Threshold ($)</Label>
                                        <Input
                                            type="number"
                                            placeholder="100000"
                                            className="mt-1 rounded-xl"
                                        />
                                    </div>

                                    <div>
                                        <Label className="text-sm">Default HNI Priority Level</Label>
                                        <Select>
                                            <SelectTrigger className="mt-1 rounded-xl">
                                                <SelectValue placeholder="Critical" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="medium">Medium</SelectItem>
                                                <SelectItem value="high">High</SelectItem>
                                                <SelectItem value="critical">Critical</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            {/* HNI Routing Rules */}
                            <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl">
                                <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                                    HNI Routing Rules
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-sm">Automatic Assignment to Senior Agents</Label>
                                        <Switch defaultChecked />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <Label className="text-sm">Notify Management on HNI Tickets</Label>
                                        <Switch defaultChecked />
                                    </div>

                                    <div>
                                        <Label className="text-sm">HNI Response SLA (minutes)</Label>
                                        <Input
                                            type="number"
                                            placeholder="15"
                                            className="mt-1 rounded-xl"
                                        />
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>

                    <DialogFooter className="mt-6">
                        <Button
                            variant="outline"
                            onClick={() => setSettingsOpen(false)}
                            className="rounded-xl"
                        >
                            Cancel
                        </Button>
                        <Button className="rounded-xl bg-cyan-600 hover:bg-cyan-500">
                            Save Settings
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}