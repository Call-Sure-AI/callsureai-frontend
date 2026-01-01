// hooks/use-realtime-ws.ts
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';

const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://beta.callsure.ai';

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error' | 'reconnecting';

export interface WebSocketConfig {
    /** WebSocket endpoint path (without base URL) */
    endpoint: string;
    /** Whether to auto-connect on mount */
    autoConnect?: boolean;
    /** Enable auto-reconnection */
    autoReconnect?: boolean;
    /** Max reconnection attempts */
    maxReconnectAttempts?: number;
    /** Reconnection delay in ms (will be multiplied for backoff) */
    reconnectDelay?: number;
    /** Heartbeat interval in ms (0 to disable) */
    heartbeatInterval?: number;
    /** Custom message handler */
    onMessage?: (data: any) => void;
    /** Connection opened handler */
    onOpen?: () => void;
    /** Connection closed handler */
    onClose?: (event: CloseEvent) => void;
    /** Error handler */
    onError?: (error: Event) => void;
    /** Status change handler */
    onStatusChange?: (status: ConnectionStatus) => void;
}

export interface UseRealtimeWSReturn<T> {
    /** Current data from WebSocket */
    data: T | null;
    /** Connection status */
    status: ConnectionStatus;
    /** Whether currently connected */
    isConnected: boolean;
    /** Connect to WebSocket */
    connect: () => void;
    /** Disconnect from WebSocket */
    disconnect: () => void;
    /** Send message to WebSocket */
    send: (message: any) => boolean;
    /** Reconnect (disconnect + connect) */
    reconnect: () => void;
    /** Error message if any */
    error: string | null;
    /** Last update timestamp */
    lastUpdate: Date | null;
}

export function useRealtimeWS<T = any>(config: WebSocketConfig): UseRealtimeWSReturn<T> {
    const {
        endpoint,
        autoConnect = true,
        autoReconnect = true,
        maxReconnectAttempts = 5,
        reconnectDelay = 2000,
        heartbeatInterval = 30000,
        onMessage,
        onOpen,
        onClose,
        onError,
        onStatusChange,
    } = config;

    const [data, setData] = useState<T | null>(null);
    const [status, setStatus] = useState<ConnectionStatus>('disconnected');
    const [error, setError] = useState<string | null>(null);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

    const wsRef = useRef<WebSocket | null>(null);
    const reconnectAttemptsRef = useRef(0);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const manualDisconnectRef = useRef(false);

    // Update status and notify
    const updateStatus = useCallback((newStatus: ConnectionStatus) => {
        setStatus(newStatus);
        onStatusChange?.(newStatus);
    }, [onStatusChange]);

    // Start heartbeat
    const startHeartbeat = useCallback((ws: WebSocket) => {
        if (heartbeatInterval <= 0) return;

        stopHeartbeat();
        heartbeatIntervalRef.current = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
                try {
                    ws.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
                } catch (err) {
                    console.error('[WS] Heartbeat error:', err);
                }
            }
        }, heartbeatInterval);
    }, [heartbeatInterval]);

    // Stop heartbeat
    const stopHeartbeat = useCallback(() => {
        if (heartbeatIntervalRef.current) {
            clearInterval(heartbeatIntervalRef.current);
            heartbeatIntervalRef.current = null;
        }
    }, []);

    // Clear reconnect timeout
    const clearReconnectTimeout = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }
    }, []);

    // Connect to WebSocket
    const connect = useCallback(() => {
        // Don't connect if already connected or connecting
        if (wsRef.current?.readyState === WebSocket.OPEN || 
            wsRef.current?.readyState === WebSocket.CONNECTING) {
            console.log('[WS] Already connected or connecting');
            return;
        }

        // Build full URL
        const fullUrl = endpoint.startsWith('ws') 
            ? endpoint 
            : `${WS_BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;

        console.log('[WS] Connecting to:', fullUrl);
        updateStatus('connecting');
        setError(null);
        manualDisconnectRef.current = false;

        try {
            const ws = new WebSocket(fullUrl);
            wsRef.current = ws;

            ws.onopen = () => {
                console.log('[WS] Connected:', fullUrl);
                updateStatus('connected');
                reconnectAttemptsRef.current = 0;
                startHeartbeat(ws);
                onOpen?.();
            };

            ws.onmessage = (event) => {
                try {
                    const parsedData = JSON.parse(event.data);
                    
                    // Ignore pong messages
                    if (parsedData.type === 'pong') return;
                    
                    // Update data state
                    setData(parsedData);
                    setLastUpdate(new Date());
                    
                    // Call custom handler
                    onMessage?.(parsedData);
                } catch (err) {
                    // If not JSON, pass raw data
                    setData(event.data as T);
                    setLastUpdate(new Date());
                    onMessage?.(event.data);
                }
            };

            ws.onclose = (event) => {
                console.log('[WS] Closed:', event.code, event.reason);
                stopHeartbeat();
                wsRef.current = null;
                
                onClose?.(event);

                // Handle reconnection
                if (!manualDisconnectRef.current && autoReconnect) {
                    if (reconnectAttemptsRef.current < maxReconnectAttempts) {
                        const delay = reconnectDelay * Math.pow(2, reconnectAttemptsRef.current);
                        console.log(`[WS] Reconnecting in ${delay}ms (attempt ${reconnectAttemptsRef.current + 1}/${maxReconnectAttempts})`);
                        
                        updateStatus('reconnecting');
                        reconnectAttemptsRef.current++;
                        
                        reconnectTimeoutRef.current = setTimeout(() => {
                            connect();
                        }, delay);
                    } else {
                        console.log('[WS] Max reconnect attempts reached');
                        updateStatus('error');
                        setError('Connection failed after maximum retry attempts');
                    }
                } else {
                    updateStatus('disconnected');
                }
            };

            ws.onerror = (event) => {
                console.error('[WS] Error:', event);
                setError('WebSocket connection error');
                onError?.(event);
            };

        } catch (err) {
            console.error('[WS] Connection error:', err);
            updateStatus('error');
            setError(err instanceof Error ? err.message : 'Failed to connect');
        }
    }, [endpoint, autoReconnect, maxReconnectAttempts, reconnectDelay, startHeartbeat, stopHeartbeat, updateStatus, onOpen, onMessage, onClose, onError]);

    // Disconnect from WebSocket
    const disconnect = useCallback(() => {
        console.log('[WS] Disconnecting...');
        manualDisconnectRef.current = true;
        clearReconnectTimeout();
        stopHeartbeat();

        if (wsRef.current) {
            wsRef.current.close(1000, 'Manual disconnect');
            wsRef.current = null;
        }

        updateStatus('disconnected');
    }, [clearReconnectTimeout, stopHeartbeat, updateStatus]);

    // Send message
    const send = useCallback((message: any): boolean => {
        if (wsRef.current?.readyState !== WebSocket.OPEN) {
            console.warn('[WS] Cannot send - not connected');
            return false;
        }

        try {
            const messageStr = typeof message === 'string' ? message : JSON.stringify(message);
            wsRef.current.send(messageStr);
            return true;
        } catch (err) {
            console.error('[WS] Send error:', err);
            return false;
        }
    }, []);

    // Reconnect
    const reconnect = useCallback(() => {
        disconnect();
        reconnectAttemptsRef.current = 0;
        setTimeout(connect, 100);
    }, [disconnect, connect]);

    // Auto-connect on mount
    useEffect(() => {
        if (autoConnect && endpoint) {
            connect();
        }

        return () => {
            disconnect();
        };
    }, [endpoint]); // Only reconnect if endpoint changes

    return {
        data,
        status,
        isConnected: status === 'connected',
        connect,
        disconnect,
        send,
        reconnect,
        error,
        lastUpdate,
    };
}

// ============== Specialized Hooks for Each Endpoint ==============

/**
 * Hook for company metrics WebSocket
 * Endpoint: /api/company-metrics/ws/{company_id}/{period}
 */
export function useCompanyMetrics(companyId: string | null, period: string = 'week') {
    return useRealtimeWS({
        endpoint: companyId ? `/api/company-metrics/ws/${companyId}/${period}` : '',
        autoConnect: !!companyId,
    });
}

/**
 * Hook for analytics WebSocket
 * Endpoint: /api/analytics/ws/{company_id}
 */
export function useAnalyticsWS(companyId: string | null) {
    return useRealtimeWS({
        endpoint: companyId ? `/api/analytics/ws/${companyId}` : '',
        autoConnect: !!companyId,
    });
}

/**
 * Hook for agent stats WebSocket
 * Endpoint: /api/agent-stats/ws/{company_id}
 */
export function useAgentStatsWS(companyId: string | null) {
    return useRealtimeWS({
        endpoint: companyId ? `/api/agent-stats/ws/${companyId}` : '',
        autoConnect: !!companyId,
    });
}

/**
 * Hook for campaign metrics WebSocket
 * Endpoint: /campaigns/ws/{campaign_id}/metrics
 */
export function useCampaignMetricsWS(campaignId: string | null) {
    return useRealtimeWS({
        endpoint: campaignId ? `/api/campaigns/ws/${campaignId}/metrics` : '',  // ← ADD /api
        autoConnect: !!campaignId,
    });
}

/**
 * Hook for call reports WebSocket
 * Endpoint: /api/call_reports/ws/{company_id}/{period}
 */
export function useCallReportsWS(companyId: string | null, period: string = 'week') {
    return useRealtimeWS({
        endpoint: companyId ? `/api/call_reports/ws/${companyId}/${period}` : '',
        autoConnect: !!companyId,
    });
}

/**
 * Hook for sentiment analysis WebSocket
 * Endpoint: /api/sentiment-analysis/ws/{company_id}/{period}
 */
export function useSentimentWS(companyId: string | null, period: string = 'week') {
    return useRealtimeWS({
        endpoint: companyId ? `/api/sentiment-analysis/ws/${companyId}/${period}` : '',
        autoConnect: !!companyId,
    });
}

/**
 * Hook for urgency detection WebSocket
 * Endpoint: /api/urgency-detection/ws/{company_id}/{period}
 */
export function useUrgencyWS(companyId: string | null, period: string = 'week') {
    return useRealtimeWS({
        endpoint: companyId ? `/api/urgency-detection/ws/${companyId}/${period}` : '',
        autoConnect: !!companyId,
    });
}

/**
 * Hook for activity log WebSocket
 * Endpoint: /api/activity-log/ws/{company_id}?range={range}
 */
export function useActivityLogWS(companyId: string | null, range: string = '7d') {
    return useRealtimeWS({
        endpoint: companyId ? `/api/activity-log/ws/${companyId}?range=${range}` : '',
        autoConnect: !!companyId,
    });
}

export default useRealtimeWS;