// services/campaign-service.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

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

class CampaignService {
    private getHeaders(token: string) {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }

    async getCampaigns(companyId: string, token: string): Promise<Campaign[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/campaigns?companyId=${companyId}`, {
                method: 'GET',
                headers: this.getHeaders(token)
            })

            if (!response.ok) {
                throw new Error(`Failed to fetch campaigns: ${response.statusText}`)
            }

            return await response.json()
        } catch (error) {
            console.error('Error fetching campaigns:', error)
            throw error
        }
    }

    async getCampaign(id: string, token: string): Promise<Campaign> {
        try {
            const response = await fetch(`${API_BASE_URL}/campaigns/${id}`, {
                method: 'GET',
                headers: this.getHeaders(token)
            })

            if (!response.ok) {
                throw new Error(`Failed to fetch campaign: ${response.statusText}`)
            }

            return await response.json()
        } catch (error) {
            console.error('Error fetching campaign:', error)
            throw error
        }
    }

    async createCampaign(data: Partial<Campaign>, token: string): Promise<Campaign> {
        try {
            const response = await fetch(`${API_BASE_URL}/campaigns`, {
                method: 'POST',
                headers: this.getHeaders(token),
                body: JSON.stringify(data)
            })

            if (!response.ok) {
                throw new Error(`Failed to create campaign: ${response.statusText}`)
            }

            return await response.json()
        } catch (error) {
            console.error('Error creating campaign:', error)
            throw error
        }
    }

    async updateCampaign(id: string, data: Partial<Campaign>, token: string): Promise<Campaign> {
        try {
            const response = await fetch(`${API_BASE_URL}/campaigns/${id}`, {
                method: 'PUT',
                headers: this.getHeaders(token),
                body: JSON.stringify(data)
            })

            if (!response.ok) {
                throw new Error(`Failed to update campaign: ${response.statusText}`)
            }

            return await response.json()
        } catch (error) {
            console.error('Error updating campaign:', error)
            throw error
        }
    }

    async deleteCampaign(id: string, token: string): Promise<void> {
        try {
            const response = await fetch(`${API_BASE_URL}/campaigns/${id}`, {
                method: 'DELETE',
                headers: this.getHeaders(token)
            })

            if (!response.ok) {
                throw new Error(`Failed to delete campaign: ${response.statusText}`)
            }
        } catch (error) {
            console.error('Error deleting campaign:', error)
            throw error
        }
    }

    async startCampaign(id: string, token: string): Promise<Campaign> {
        try {
            const response = await fetch(`${API_BASE_URL}/campaigns/${id}/start`, {
                method: 'POST',
                headers: this.getHeaders(token)
            })

            if (!response.ok) {
                throw new Error(`Failed to start campaign: ${response.statusText}`)
            }

            return await response.json()
        } catch (error) {
            console.error('Error starting campaign:', error)
            throw error
        }
    }

    async pauseCampaign(id: string, token: string): Promise<Campaign> {
        try {
            const response = await fetch(`${API_BASE_URL}/campaigns/${id}/pause`, {
                method: 'POST',
                headers: this.getHeaders(token)
            })

            if (!response.ok) {
                throw new Error(`Failed to pause campaign: ${response.statusText}`)
            }

            return await response.json()
        } catch (error) {
            console.error('Error pausing campaign:', error)
            throw error
        }
    }

    async uploadLeads(campaignId: string, file: File, token: string): Promise<any> {
        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('campaignId', campaignId)

            const response = await fetch(`${API_BASE_URL}/campaigns/${campaignId}/leads/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            })

            if (!response.ok) {
                throw new Error(`Failed to upload leads: ${response.statusText}`)
            }

            return await response.json()
        } catch (error) {
            console.error('Error uploading leads:', error)
            throw error
        }
    }

    async getLeads(campaignId: string, token: string): Promise<any[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/campaigns/${campaignId}/leads`, {
                method: 'GET',
                headers: this.getHeaders(token)
            })

            if (!response.ok) {
                throw new Error(`Failed to fetch leads: ${response.statusText}`)
            }

            return await response.json()
        } catch (error) {
            console.error('Error fetching leads:', error)
            throw error
        }
    }

    async updateLead(campaignId: string, leadId: string, data: any, token: string): Promise<any> {
        try {
            const response = await fetch(`${API_BASE_URL}/campaigns/${campaignId}/leads/${leadId}`, {
                method: 'PUT',
                headers: this.getHeaders(token),
                body: JSON.stringify(data)
            })

            if (!response.ok) {
                throw new Error(`Failed to update lead: ${response.statusText}`)
            }

            return await response.json()
        } catch (error) {
            console.error('Error updating lead:', error)
            throw error
        }
    }

    async deleteLead(campaignId: string, leadId: string, token: string): Promise<void> {
        try {
            const response = await fetch(`${API_BASE_URL}/campaigns/${campaignId}/leads/${leadId}`, {
                method: 'DELETE',
                headers: this.getHeaders(token)
            })

            if (!response.ok) {
                throw new Error(`Failed to delete lead: ${response.statusText}`)
            }
        } catch (error) {
            console.error('Error deleting lead:', error)
            throw error
        }
    }

    async getCampaignMetrics(campaignId: string, token: string): Promise<any> {
        try {
            const response = await fetch(`${API_BASE_URL}/campaigns/${campaignId}/metrics`, {
                method: 'GET',
                headers: this.getHeaders(token)
            })

            if (!response.ok) {
                throw new Error(`Failed to fetch campaign metrics: ${response.statusText}`)
            }

            return await response.json()
        } catch (error) {
            console.error('Error fetching campaign metrics:', error)
            throw error
        }
    }
}

// Export a singleton instance
const campaignService = new CampaignService()
export default campaignService