// services/activity-service.ts

const getApiUrl = () => process.env.NEXT_PUBLIC_API_URL || 'https://api.callsure.ai';

export const getAllActivities = async (token: string) => {
    try {
        const response = await fetch(`${getApiUrl()}/api/activity`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to get activities');
        }

        return await response.json();
    } catch (error) {
        console.error('Error in getAllActivities:', error);
        throw error;
    }
};

/**
 * Note: The backend automatically creates activities when performing actions.
 * This function is a no-op placeholder for future use if the backend adds POST support.
 * Currently, just call refreshActivities() after performing actions.
 */
export const logCampaignActivity = async (
    _token: string,
    _campaignName: string,
    _campaignId: string,
    _action: 'created' | 'started' | 'paused' | 'resumed' | 'completed' | 'deleted' | 'updated'
) => {
    // Backend doesn't support POST /api/activity
    // Activities are created automatically by the backend when campaign actions are performed
    // This is a no-op - the refreshActivities() call after actions will fetch new activities
    console.log(`Campaign activity: ${_action} - ${_campaignName} (backend will create activity automatically)`);
    return null;
};

/**
 * Note: The backend automatically creates activities when performing actions.
 * This function is a no-op placeholder for future use if the backend adds POST support.
 */
export const logAgentActivity = async (
    _token: string,
    _agentName: string,
    _agentId: string,
    _action: 'created' | 'updated' | 'activated' | 'deactivated' | 'deleted'
) => {
    // Backend doesn't support POST /api/activity
    // Activities are created automatically by the backend when agent actions are performed
    console.log(`Agent activity: ${_action} - ${_agentName} (backend will create activity automatically)`);
    return null;
};