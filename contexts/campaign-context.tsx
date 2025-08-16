// contexts\campaign-context.tsx
"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import campaignService from '@/services/campaign-service'
import { useIsAuthenticated } from '@/hooks/use-is-authenticated'
import { useCompany } from './company-context'

interface Campaign {
    id: string
    companyId: string
    name: string
    description: string
    status: 'draft' | 'active' | 'paused' | 'completed'
    leads: any[]
    settings: any
    metrics: any
    createdAt: string
    updatedAt: string
}

interface CampaignContextType {
    campaigns: Campaign[]
    loading: boolean
    createCampaign: (data: any) => Promise<Campaign>
    updateCampaign: (id: string, data: any) => Promise<void>
    deleteCampaign: (id: string) => Promise<void>
    startCampaign: (id: string) => Promise<void>
    pauseCampaign: (id: string) => Promise<void>
    refreshCampaigns: () => Promise<void>
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined)

export function CampaignProvider({ children }: { children: ReactNode }) {
    const [campaigns, setCampaigns] = useState<Campaign[]>([])
    const [loading, setLoading] = useState(true)
    const { token } = useIsAuthenticated()
    const { company } = useCompany()

    const fetchCampaigns = async () => {
        if (!token || !company?.id) return
        
        try {
            setLoading(true)
            const data = await campaignService.getCampaigns(company.id, token)
            setCampaigns(data)
        } catch (error) {
            console.error('Error fetching campaigns:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCampaigns()
    }, [token, company])

    const createCampaign = async (data: any): Promise<Campaign> => {
        if (!token) throw new Error('No authentication token')
        
        const campaign = await campaignService.createCampaign(data, token)
        setCampaigns([...campaigns, campaign])
        return campaign
    }

    const updateCampaign = async (id: string, data: any): Promise<void> => {
        if (!token) throw new Error('No authentication token')
        
        const updated = await campaignService.updateCampaign(id, data, token)
        setCampaigns(campaigns.map(c => c.id === id ? updated : c))
    }

    const deleteCampaign = async (id: string): Promise<void> => {
        if (!token) throw new Error('No authentication token')
        
        await campaignService.deleteCampaign(id, token)
        setCampaigns(campaigns.filter(c => c.id !== id))
    }

    const startCampaign = async (id: string): Promise<void> => {
        if (!token) throw new Error('No authentication token')
        
        await campaignService.startCampaign(id, token)
        await fetchCampaigns()
    }

    const pauseCampaign = async (id: string): Promise<void> => {
        if (!token) throw new Error('No authentication token')
        
        await campaignService.pauseCampaign(id, token)
        await fetchCampaigns()
    }

    return (
        <CampaignContext.Provider value={{
            campaigns,
            loading,
            createCampaign,
            updateCampaign,
            deleteCampaign,
            startCampaign,
            pauseCampaign,
            refreshCampaigns: fetchCampaigns
        }}>
            {children}
        </CampaignContext.Provider>
    )
}

export function useCampaigns() {
    const context = useContext(CampaignContext)
    if (!context) {
        throw new Error('useCampaigns must be used within CampaignProvider')
    }
    return context
}

// Export the Campaign type for use in other components
export type { Campaign }