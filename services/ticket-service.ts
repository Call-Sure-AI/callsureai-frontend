// services/ticket-service.ts

export interface Ticket {
    id: string;
    company_id: string;
    conversation_id: string | null;
    customer_id: string;
    title: string;
    description: string;
    status: 'new' | 'open' | 'in_progress' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high' | 'critical';
    source: 'auto_generated' | 'email' | 'phone' | 'chat' | 'web_form';
    assigned_to: string | null;
    customer_name: string | null;
    customer_email: string | null;
    customer_phone: string | null;
    tags: string[];
    meta_data: string | Record<string, any>;
    auto_resolved: boolean;
    resolution_notes: string | null;
    created_at: string;
    updated_at: string;
    resolved_at: string | null;
    closed_at: string | null;
    notes?: TicketNote[];
}

export interface TicketNote {
    id: string;
    ticket_id: string;
    content: string;
    created_by: string;
    is_internal: boolean;
    created_at: string;
}

export interface CreateTicketData {
    customer_id: string;
    title: string;
    description: string;
    priority?: 'low' | 'medium' | 'high' | 'critical';
    tags?: string[];
    meta_data?: Record<string, any>;
    customer_name?: string;
    customer_email?: string;
    customer_phone?: string;
}

export interface UpdateTicketData {
    status?: 'new' | 'open' | 'in_progress' | 'resolved' | 'closed';
    priority?: 'low' | 'medium' | 'high' | 'critical';
    assigned_to?: string;
    note?: string;
    resolution_notes?: string;
    tags?: string[];
}

export interface TicketStats {
    total_tickets: number;
    new_tickets: number;
    open_tickets: number;
    in_progress_tickets: number;
    resolved_tickets: number;
    closed_tickets: number;
    avg_resolution_time_hours: number;
    tickets_by_priority: {
        low: number;
        medium: number;
        high: number;
        critical: number;
    };
    tickets_by_source: {
        auto_generated: number;
        email: number;
        phone: number;
        chat: number;
        web_form: number;
    };
}

// Default empty stats to return when endpoint is unavailable
const DEFAULT_TICKET_STATS: TicketStats = {
    total_tickets: 0,
    new_tickets: 0,
    open_tickets: 0,
    in_progress_tickets: 0,
    resolved_tickets: 0,
    closed_tickets: 0,
    avg_resolution_time_hours: 0,
    tickets_by_priority: {
        low: 0,
        medium: 0,
        high: 0,
        critical: 0,
    },
    tickets_by_source: {
        auto_generated: 0,
        email: 0,
        phone: 0,
        chat: 0,
        web_form: 0,
    },
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3008';

/**
 * Get all tickets for a company with optional filters
 */
export const getTickets = async (
    companyId: string,
    token: string,
    filters?: {
        status?: string[];
        priority?: string[];
        limit?: number;
        offset?: number;
    }
): Promise<{ tickets: Ticket[]; total_count: number }> => {
    try {
        const params = new URLSearchParams();
        
        if (filters?.status) {
            filters.status.forEach(s => params.append('status', s));
        }
        if (filters?.priority) {
            filters.priority.forEach(p => params.append('priority', p));
        }
        if (filters?.limit) params.append('limit', filters.limit.toString());
        if (filters?.offset) params.append('offset', filters.offset.toString());

        const response = await fetch(
            `${API_BASE_URL}/tickets/companies/${companyId}?${params.toString()}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            // Handle 404 as empty result (no tickets yet)
            if (response.status === 404) {
                console.log('No tickets found (404) - returning empty list');
                return { tickets: [], total_count: 0 };
            }
            
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Failed to fetch tickets (${response.status})`);
        }

        return await response.json();
    } catch (error: any) {
        // If it's a network error, return empty instead of throwing
        if (error.message?.includes('fetch') || error.name === 'TypeError') {
            console.warn('Network error fetching tickets - returning empty list');
            return { tickets: [], total_count: 0 };
        }
        
        console.error('Error fetching tickets:', error);
        throw error;
    }
};

/**
 * Get a single ticket by ID
 */
export const getTicketById = async (
    companyId: string,
    ticketId: string,
    token: string
): Promise<Ticket> => {
    try {
        const response = await fetch(
            `${API_BASE_URL}/tickets/companies/${companyId}/${ticketId}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to fetch ticket');
        }

        return await response.json();
    } catch (error: any) {
        console.error('Error fetching ticket:', error);
        throw error;
    }
};

/**
 * Create a new ticket
 */
export const createTicket = async (
    companyId: string,
    ticketData: CreateTicketData,
    token: string
): Promise<Ticket> => {
    try {
        const response = await fetch(
            `${API_BASE_URL}/tickets/companies/${companyId}/create`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    company_id: companyId,
                    ...ticketData,
                }),
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to create ticket');
        }

        const result = await response.json();
        return result.ticket;
    } catch (error: any) {
        console.error('Error creating ticket:', error);
        throw error;
    }
};

/**
 * Update a ticket
 */
export const updateTicket = async (
    companyId: string,
    ticketId: string,
    updateData: UpdateTicketData,
    token: string
): Promise<void> => {
    try {
        const response = await fetch(
            `${API_BASE_URL}/tickets/companies/${companyId}/${ticketId}`,
            {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to update ticket');
        }
    } catch (error: any) {
        console.error('Error updating ticket:', error);
        throw error;
    }
};

/**
 * Add a note to a ticket
 */
export const addTicketNote = async (
    companyId: string,
    ticketId: string,
    content: string,
    isInternal: boolean,
    token: string
): Promise<void> => {
    try {
        const response = await fetch(
            `${API_BASE_URL}/tickets/companies/${companyId}/${ticketId}/notes`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content,
                    is_internal: isInternal,
                }),
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to add note');
        }
    } catch (error: any) {
        console.error('Error adding note:', error);
        throw error;
    }
};

/**
 * Get ticket statistics
 * Returns default empty stats if the endpoint is not available (404)
 */
export const getTicketStats = async (
    companyId: string,
    token: string,
    days: number = 7
): Promise<TicketStats> => {
    try {
        const response = await fetch(
            `${API_BASE_URL}/tickets/companies/${companyId}/stats?days=${days}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            // Handle 404 gracefully - stats endpoint may not exist yet
            if (response.status === 404) {
                console.log('Ticket stats endpoint not found (404) - returning default stats');
                return DEFAULT_TICKET_STATS;
            }
            
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to fetch ticket stats');
        }

        return await response.json();
    } catch (error: any) {
        // If it's a network error, return defaults instead of throwing
        if (error.message?.includes('fetch') || error.name === 'TypeError') {
            console.warn('Network error fetching ticket stats - returning default stats');
            return DEFAULT_TICKET_STATS;
        }
        
        console.error('Error fetching ticket stats:', error);
        // Return default stats instead of throwing to prevent UI crashes
        return DEFAULT_TICKET_STATS;
    }
};

/**
 * Calculate stats from tickets array (fallback when stats endpoint unavailable)
 */
export const calculateStatsFromTickets = (tickets: Ticket[]): TicketStats => {
    const stats: TicketStats = {
        total_tickets: tickets.length,
        new_tickets: 0,
        open_tickets: 0,
        in_progress_tickets: 0,
        resolved_tickets: 0,
        closed_tickets: 0,
        avg_resolution_time_hours: 0,
        tickets_by_priority: {
            low: 0,
            medium: 0,
            high: 0,
            critical: 0,
        },
        tickets_by_source: {
            auto_generated: 0,
            email: 0,
            phone: 0,
            chat: 0,
            web_form: 0,
        },
    };

    let totalResolutionTime = 0;
    let resolvedCount = 0;

    tickets.forEach(ticket => {
        // Count by status
        switch (ticket.status) {
            case 'new':
                stats.new_tickets++;
                break;
            case 'open':
                stats.open_tickets++;
                break;
            case 'in_progress':
                stats.in_progress_tickets++;
                break;
            case 'resolved':
                stats.resolved_tickets++;
                break;
            case 'closed':
                stats.closed_tickets++;
                break;
        }

        // Count by priority
        if (ticket.priority in stats.tickets_by_priority) {
            stats.tickets_by_priority[ticket.priority]++;
        }

        // Count by source
        if (ticket.source in stats.tickets_by_source) {
            stats.tickets_by_source[ticket.source]++;
        }

        // Calculate resolution time
        if (ticket.resolved_at && ticket.created_at) {
            const created = new Date(ticket.created_at).getTime();
            const resolved = new Date(ticket.resolved_at).getTime();
            const hours = (resolved - created) / (1000 * 60 * 60);
            totalResolutionTime += hours;
            resolvedCount++;
        }
    });

    // Calculate average resolution time
    if (resolvedCount > 0) {
        stats.avg_resolution_time_hours = Math.round((totalResolutionTime / resolvedCount) * 10) / 10;
    }

    return stats;
};

/**
 * Auto-create ticket from conversation analysis
 */
export const autoCreateTicketFromConversation = async (
    companyId: string,
    conversationId: string,
    messages: Array<{
        role: string;
        content: string;
        timestamp: string;
    }>,
    token: string
): Promise<{
    ticket_created: boolean;
    ticket?: Ticket;
    confidence_score: number;
    detected_issues: string[];
}> => {
    try {
        const response = await fetch(
            `${API_BASE_URL}/api/tickets/companies/${companyId}/auto-create-from-conversation/${conversationId}`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(messages),
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to analyze conversation');
        }

        return await response.json();
    } catch (error: any) {
        console.error('Error auto-creating ticket:', error);
        throw error;
    }
};