// contexts/ticket-context.tsx
"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useCompany } from '@/contexts/company-context';
import {
    Ticket,
    TicketStats,
    getTickets,
    getTicketStats,
    updateTicket,
    addTicketNote,
    createTicket,
    CreateTicketData,
    UpdateTicketData,
} from '@/services/ticket-service';

interface TicketContextType {
    tickets: Ticket[];
    stats: TicketStats | null;
    loading: boolean;
    error: string | null;
    refreshTickets: () => Promise<void>;
    refreshStats: () => Promise<void>;
    createNewTicket: (data: CreateTicketData) => Promise<Ticket>;
    updateTicketStatus: (ticketId: string, data: UpdateTicketData) => Promise<void>;
    addNote: (ticketId: string, content: string, isInternal: boolean) => Promise<void>;
    filterTickets: (filters: {
        status?: string[];
        priority?: string[];
    }) => void;
    currentFilters: {
        status?: string[];
        priority?: string[];
    };
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

export function TicketProvider({ children }: { children: React.ReactNode }) {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [stats, setStats] = useState<TicketStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentFilters, setCurrentFilters] = useState<{
        status?: string[];
        priority?: string[];
    }>({});

    const { user, loading: userLoading } = useCurrentUser();
    const { company, isLoading: companyLoading } = useCompany();

    const fetchTickets = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            
            // Don't fetch if we don't have the required data
            if (!token || !company?.id) {
                console.log('⚠️ Skipping ticket fetch - missing token or company ID');
                setLoading(false);
                setTickets([]);
                return;
            }

            console.log('🎫 Fetching tickets for company:', company.id);
            setLoading(true);
            setError(null);

            const result = await getTickets(company.id, token, {
                ...currentFilters,
                limit: 100,
            });

            console.log('✅ Tickets fetched:', result.tickets.length);
            setTickets(result.tickets);
        } catch (err: any) {
            console.error('❌ Error fetching tickets:', err);
            
            // Don't show error for expected cases (404, network issues)
            if (err.message?.includes('404') || err.message?.includes('Not Found')) {
                console.log('📝 No tickets found - this is normal for new accounts');
                setTickets([]);
                setError(null); // Don't show error for 404
            } else if (err.message?.includes('fetch') || err.message?.includes('network')) {
                console.warn('🌐 Network issue - showing empty state');
                setTickets([]);
                setError('Unable to connect to server. Please check your connection.');
            } else {
                setError(err.message || 'Failed to fetch tickets');
                setTickets([]);
            }
        } finally {
            setLoading(false);
        }
    }, [company?.id, currentFilters]);

    const fetchStats = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token || !company?.id) {
                console.log('⚠️ Skipping stats fetch - missing token or company ID');
                return;
            }

            console.log('📊 Fetching ticket stats...');
            const statsData = await getTicketStats(company.id, token, 30);
            console.log('✅ Stats fetched:', statsData);
            setStats(statsData);
        } catch (err: any) {
            console.error('❌ Error fetching ticket stats:', err);
            
            // Don't fail silently - but also don't crash
            if (err.message?.includes('404')) {
                console.log('📊 No stats available - setting defaults');
                setStats({
                    total_tickets: 0,
                    new_tickets: 0,
                    open_tickets: 0,
                    in_progress_tickets: 0,
                    resolved_tickets: 0,
                    closed_tickets: 0,
                    avg_resolution_time_hours: 0,
                    tickets_by_priority: { low: 0, medium: 0, high: 0, critical: 0 },
                    tickets_by_source: { auto_generated: 0, email: 0, phone: 0, chat: 0, web_form: 0 },
                });
            }
        }
    }, [company?.id]);

    const createNewTicket = useCallback(async (data: CreateTicketData): Promise<Ticket> => {
        const token = localStorage.getItem('token');
        if (!token || !company?.id) {
            throw new Error('Not authenticated');
        }

        console.log('➕ Creating new ticket...');
        const ticket = await createTicket(company.id, data, token);
        console.log('✅ Ticket created:', ticket.id);
        
        await fetchTickets(); // Refresh list
        await fetchStats(); // Refresh stats
        return ticket;
    }, [company?.id, fetchTickets, fetchStats]);

    const updateTicketStatus = useCallback(async (
        ticketId: string,
        data: UpdateTicketData
    ): Promise<void> => {
        const token = localStorage.getItem('token');
        if (!token || !company?.id) {
            throw new Error('Not authenticated');
        }

        console.log('🔄 Updating ticket:', ticketId);
        await updateTicket(company.id, ticketId, data, token);
        console.log('✅ Ticket updated');
        
        await fetchTickets(); // Refresh list
        await fetchStats(); // Refresh stats
    }, [company?.id, fetchTickets, fetchStats]);

    const addNote = useCallback(async (
        ticketId: string,
        content: string,
        isInternal: boolean
    ): Promise<void> => {
        const token = localStorage.getItem('token');
        if (!token || !company?.id) {
            throw new Error('Not authenticated');
        }

        console.log('📝 Adding note to ticket:', ticketId);
        await addTicketNote(company.id, ticketId, content, isInternal, token);
        console.log('✅ Note added');
        
        // Optionally refresh tickets to get the updated note
        await fetchTickets();
    }, [company?.id, fetchTickets]);

    const filterTickets = useCallback((filters: {
        status?: string[];
        priority?: string[];
    }) => {
        console.log('🔍 Applying filters:', filters);
        setCurrentFilters(filters);
    }, []);

    useEffect(() => {
        // Wait for user and company to load
        if (userLoading || companyLoading) {
            console.log('⏳ Waiting for user/company to load...');
            return;
        }

        // Only fetch if we have both user and company
        if (user && company?.id) {
            console.log('✅ User and company ready - fetching tickets');
            fetchTickets();
            fetchStats();
        } else {
            console.log('⚠️ Missing user or company - not fetching tickets');
            setLoading(false);
            setTickets([]);
        }
    }, [user, company?.id, userLoading, companyLoading, fetchTickets, fetchStats]);

    return (
        <TicketContext.Provider
            value={{
                tickets,
                stats,
                loading,
                error,
                refreshTickets: fetchTickets,
                refreshStats: fetchStats,
                createNewTicket,
                updateTicketStatus,
                addNote,
                filterTickets,
                currentFilters,
            }}
        >
            {children}
        </TicketContext.Provider>
    );
}

export const useTickets = () => {
    const context = useContext(TicketContext);
    if (context === undefined) {
        throw new Error('useTickets must be used within a TicketProvider');
    }
    return context;
};