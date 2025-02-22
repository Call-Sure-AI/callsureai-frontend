export const getAllActivities = async (token: string) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/activity`, {
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