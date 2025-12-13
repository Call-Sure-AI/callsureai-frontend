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
    history?: TicketHistory[];
}

export interface TicketNote {
    id: string;
    ticket_id: string;
    content: string;
    created_by: string;
    is_internal: boolean;
    created_at: string;
}

export interface TicketHistory {
    id: string;
    ticket_id: string;
    action: string;
    field_name: string | null;
    old_value: string | null;
    new_value: string | null;
    changed_by: string;
    created_at: string;
}

export interface TeamMember {
    id: string;
    email: string;
    name: string;
    role: string;
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

const getAuthToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
};

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
            `${API_BASE_URL}/api/tickets/companies/${companyId}?${params.toString()}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            if (response.status === 404) {
                console.log('No tickets found (404) - returning empty list');
                return { tickets: [], total_count: 0 };
            }
            
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Failed to fetch tickets (${response.status})`);
        }

        return await response.json();
    } catch (error: any) {
        if (error.message?.includes('fetch') || error.name === 'TypeError') {
            console.warn('Network error fetching tickets - returning empty list');
            return { tickets: [], total_count: 0 };
        }
        
        console.error('Error fetching tickets:', error);
        throw error;
    }
};

export const getTicketById = async (
    companyId: string,
    ticketId: string,
    token: string
): Promise<Ticket> => {
    try {
        const response = await fetch(
            `${API_BASE_URL}/api/tickets/companies/${companyId}/${ticketId}`,
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

export const getTicketDetails = async (
    companyId: string,
    ticketId: string
): Promise<Ticket | null> => {
    try {
        const token = getAuthToken();
        if (!token) {
            console.error('No auth token available');
            return null;
        }

        const response = await fetch(
            `${API_BASE_URL}/api/tickets/companies/${companyId}/${ticketId}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            if (response.status === 404) {
                console.log('Ticket not found (404)');
                return null;
            }
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to fetch ticket details');
        }

        return await response.json();
    } catch (error: any) {
        console.error('Error fetching ticket details:', error);
        return null;
    }
};

export const createTicket = async (
    companyId: string,
    ticketData: CreateTicketData,
    token: string
): Promise<Ticket> => {
    try {
        const response = await fetch(
            `${API_BASE_URL}/api/tickets/companies/${companyId}/create`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...ticketData,
                }),
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || errorData.detail || 'Failed to create ticket');
        }

        const result = await response.json();
        return result.ticket;
    } catch (error: any) {
        console.error('Error creating ticket:', error);
        throw error;
    }
};

export const updateTicket = async (
    companyId: string,
    ticketId: string,
    updateData: UpdateTicketData,
    token: string
): Promise<void> => {
    try {
        const response = await fetch(
            `${API_BASE_URL}/api/tickets/companies/${companyId}/${ticketId}`,
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

export const addTicketNote = async (
    companyId: string,
    ticketId: string,
    content: string,
    isInternal: boolean,
    token: string
): Promise<void> => {
    try {
        const response = await fetch(
            `${API_BASE_URL}/api/tickets/companies/${companyId}/${ticketId}/notes`,
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

export const getTicketStats = async (
    companyId: string,
    token: string,
    days: number = 7
): Promise<TicketStats> => {
    try {
        const response = await fetch(
            `${API_BASE_URL}/api/tickets/companies/${companyId}/stats?days=${days}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            if (response.status === 404) {
                console.log('Ticket stats endpoint not found (404) - returning default stats');
                return DEFAULT_TICKET_STATS;
            }
            
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to fetch ticket stats');
        }

        return await response.json();
    } catch (error: any) {
        if (error.message?.includes('fetch') || error.name === 'TypeError') {
            console.warn('Network error fetching ticket stats - returning default stats');
            return DEFAULT_TICKET_STATS;
        }
        
        console.error('Error fetching ticket stats:', error);
        return DEFAULT_TICKET_STATS;
    }
};

// Team members fetch with extensive debugging
export const getTeamMembers = async (
    companyId: string
): Promise<TeamMember[]> => {
    console.log('========================================');
    console.log('[getTeamMembers] STARTING');
    console.log('[getTeamMembers] Company ID:', companyId);
    console.log('[getTeamMembers] API_BASE_URL:', API_BASE_URL);
    
    if (!companyId) {
        console.error('[getTeamMembers] ERROR: No companyId provided!');
        return [];
    }

    try {
        const token = getAuthToken();
        console.log('[getTeamMembers] Token exists:', !!token);
        console.log('[getTeamMembers] Token preview:', token ? token.substring(0, 20) + '...' : 'null');
        
        if (!token) {
            console.error('[getTeamMembers] ERROR: No auth token available');
            return [];
        }

        const url = `${API_BASE_URL}/api/tickets/companies/${companyId}/team-members`;
        console.log('[getTeamMembers] Full URL:', url);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        console.log('[getTeamMembers] Response status:', response.status);
        console.log('[getTeamMembers] Response ok:', response.ok);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[getTeamMembers] ERROR Response:', errorText);
            console.error('[getTeamMembers] Status:', response.status, response.statusText);
            return [];
        }

        const data = await response.json();
        console.log('[getTeamMembers] Raw response:', JSON.stringify(data, null, 2));
        console.log('[getTeamMembers] Response type:', typeof data);
        console.log('[getTeamMembers] Is Array:', Array.isArray(data));
        
        // Handle different response formats
        let result: TeamMember[] = [];
        
        if (Array.isArray(data)) {
            // Backend returns array directly
            result = data;
            console.log('[getTeamMembers] Using array directly');
        } else if (data && typeof data === 'object') {
            // Check for wrapped response
            if (data.team_members && Array.isArray(data.team_members)) {
                result = data.team_members;
                console.log('[getTeamMembers] Using data.team_members');
            } else if (data.data && Array.isArray(data.data)) {
                result = data.data;
                console.log('[getTeamMembers] Using data.data');
            } else if (data.members && Array.isArray(data.members)) {
                result = data.members;
                console.log('[getTeamMembers] Using data.members');
            }
        }
        
        console.log('[getTeamMembers] Final result count:', result.length);
        console.log('[getTeamMembers] Final result:', JSON.stringify(result, null, 2));
        console.log('========================================');
        
        return result;
    } catch (error: any) {
        console.error('[getTeamMembers] EXCEPTION:', error.message);
        console.error('[getTeamMembers] Stack:', error.stack);
        console.log('========================================');
        return [];
    }
};

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

        if (ticket.priority in stats.tickets_by_priority) {
            stats.tickets_by_priority[ticket.priority]++;
        }

        if (ticket.source in stats.tickets_by_source) {
            stats.tickets_by_source[ticket.source]++;
        }

        if (ticket.resolved_at && ticket.created_at) {
            const created = new Date(ticket.created_at).getTime();
            const resolved = new Date(ticket.resolved_at).getTime();
            const hours = (resolved - created) / (1000 * 60 * 60);
            totalResolutionTime += hours;
            resolvedCount++;
        }
    });

    if (resolvedCount > 0) {
        stats.avg_resolution_time_hours = Math.round((totalResolutionTime / resolvedCount) * 10) / 10;
    }

    return stats;
};

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