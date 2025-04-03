// services/company-service.ts

/**
 * Create or update a company
 * @param formData The form data for the company
 * @param token Authentication token
 */
const createOrUpdateCompany = async (formData: any, token: string) => {
    try {
        // Format address
        const address = formData.address ? `${formData.address}, ${formData.city}, ${formData.state}, ${formData.zip_code}` : '';

        // Log attempt (with sensitive data redacted)
        console.log('Attempting to create/update company with data:', {
            name: `${formData.first_name} ${formData.last_name}`,
            business_name: formData.business_name,
            email: formData.email ? `${formData.email.substring(0, 3)}...` : undefined,
            phone_number: formData.phone_number ? `${formData.phone_number.substring(0, 3)}...` : undefined,
            has_address: !!address,
            has_logo: !!formData.logo
        });

        // Set up timeout for the request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.callsure.ai';
        const response = await fetch(`${apiUrl}/api/company/create-or-update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name: `${formData.first_name} ${formData.last_name}`,
                business_name: formData.business_name,
                email: formData.email,
                phone_number: formData.phone_number,
                address: address,
                user_id: formData.userId,
                logo: formData.logo,
                // Add required settings object with default values to match schema
                settings: {
                    notification_preferences: {
                        email: true,
                        sms: true
                    },
                    working_hours: {
                        start: "09:00",
                        end: "17:00",
                        timezone: "UTC"
                    }
                },
                // Include these optional fields if they need default values
                website: formData.website || "", // Optional field as per schema
            }),
            signal: controller.signal,
        });

        // Clear the timeout
        clearTimeout(timeoutId);

        if (!response.ok) {
            // Try to get detailed error message
            const errorData = await response.json().catch(() => ({ 
                error: `Server returned ${response.status}: ${response.statusText}` 
            }));
            
            // Log detailed error for debugging
            console.error('Server error details:', errorData);
            
            throw new Error(errorData.error || errorData.message || 'Failed to create/update company');
        }

        return await response.json();
    } catch (error: any) {
        // Enhanced error handling
        if (error.name === 'AbortError') {
            console.error('Request timed out when creating/updating company');
            throw new Error('Request timed out. The server may be unavailable.');
        }
        
        if (error.message.includes('fetch') || error.message.includes('network')) {
            console.error('Network error when creating/updating company:', error);
            throw new Error('Network error. Please check your internet connection.');
        }
        
        console.error('Error in createOrUpdateCompany:', error);
        throw error;
    }
};

/**
 * Get all companies
 * @param token Authentication token
 */
const getAllCompanies = async (token: string) => {
    try {
        // Set up timeout for the request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.callsure.ai';
        const response = await fetch(`${apiUrl}/api/company`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            signal: controller.signal,
        });

        // Clear the timeout
        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ 
                error: `Server returned ${response.status}: ${response.statusText}` 
            }));
            throw new Error(errorData.error || 'Failed to get companies');
        }

        return await response.json();
    } catch (error: any) {
        // Enhanced error handling
        if (error.name === 'AbortError') {
            console.error('Request timed out when fetching companies');
            throw new Error('Request timed out. The server may be unavailable.');
        }
        
        if (error.message.includes('fetch') || error.message.includes('network')) {
            console.error('Network error when fetching companies:', error);
            throw new Error('Network error. Please check your internet connection.');
        }
        
        console.error('Error in getAllCompanies:', error);
        throw error;
    }
};

/**
 * Get a company by ID
 * @param id Company ID
 * @param token Authentication token
 */
const getCompanyById = async (id: string, token: string) => {
    try {
        if (!id) {
            throw new Error('Company ID is required');
        }

        // Set up timeout for the request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.callsure.ai';
        const response = await fetch(`${apiUrl}/api/company/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            signal: controller.signal,
        });

        // Clear the timeout
        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ 
                error: `Server returned ${response.status}: ${response.statusText}` 
            }));
            throw new Error(errorData.error || 'Failed to get company');
        }

        return await response.json();
    } catch (error: any) {
        // Enhanced error handling
        if (error.name === 'AbortError') {
            console.error('Request timed out when fetching company');
            throw new Error('Request timed out. The server may be unavailable.');
        }
        
        if (error.message.includes('fetch') || error.message.includes('network')) {
            console.error('Network error when fetching company:', error);
            throw new Error('Network error. Please check your internet connection.');
        }
        
        console.error('Error in getCompanyById:', error);
        throw error;
    }
};

/**
 * Get companies by user ID
 * @param userId User ID
 * @param token Authentication token
 */
const getCompanyByUserId = async (userId: string, token: string) => {
    try {
        if (!userId) {
            throw new Error('User ID is required');
        }

        // Set up timeout for the request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.callsure.ai';
        const response = await fetch(`${apiUrl}/api/company/user?user_id=${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            signal: controller.signal,
        });

        // Clear the timeout
        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ 
                error: `Server returned ${response.status}: ${response.statusText}` 
            }));
            throw new Error(errorData.error || 'Failed to get companies');
        }

        return await response.json();
    } catch (error: any) {
        // Enhanced error handling
        if (error.name === 'AbortError') {
            console.error('Request timed out when fetching companies by user ID');
            throw new Error('Request timed out. The server may be unavailable.');
        }
        
        if (error.message.includes('fetch') || error.message.includes('network')) {
            console.error('Network error when fetching companies by user ID:', error);
            throw new Error('Network error. Please check your internet connection.');
        }
        
        console.error('Error in getCompanyByUserId:', error);
        throw error;
    }
};

/**
 * Update a company
 * @param id Company ID
 * @param formData Form data
 * @param token Authentication token
 */
const updateCompany = async (id: string, formData: any, token: string) => {
    try {
        if (!id) {
            throw new Error('Company ID is required');
        }

        // Set up timeout for the request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

        // Make sure we have the required settings object
        if (!formData.settings) {
            formData.settings = {
                notification_preferences: {
                    email: true,
                    sms: true
                },
                working_hours: {
                    start: "09:00",
                    end: "17:00",
                    timezone: "UTC"
                }
            };
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.callsure.ai';
        const response = await fetch(`${apiUrl}/api/company/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData),
            signal: controller.signal,
        });

        // Clear the timeout
        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ 
                error: `Server returned ${response.status}: ${response.statusText}` 
            }));
            throw new Error(errorData.error || 'Failed to update company');
        }

        return await response.json();
    } catch (error: any) {
        // Enhanced error handling
        if (error.name === 'AbortError') {
            console.error('Request timed out when updating company');
            throw new Error('Request timed out. The server may be unavailable.');
        }
        
        if (error.message.includes('fetch') || error.message.includes('network')) {
            console.error('Network error when updating company:', error);
            throw new Error('Network error. Please check your internet connection.');
        }
        
        console.error('Error in updateCompany:', error);
        throw error;
    }
};

/**
 * Delete a company
 * @param id Company ID
 * @param token Authentication token
 */
const deleteCompany = async (id: string, token: string) => {
    try {
        if (!id) {
            throw new Error('Company ID is required');
        }

        // Set up timeout for the request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.callsure.ai';
        const response = await fetch(`${apiUrl}/api/company/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            signal: controller.signal,
        });

        // Clear the timeout
        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ 
                error: `Server returned ${response.status}: ${response.statusText}` 
            }));
            throw new Error(errorData.error || 'Failed to delete company');
        }

        return await response.json();
    } catch (error: any) {
        // Enhanced error handling
        if (error.name === 'AbortError') {
            console.error('Request timed out when deleting company');
            throw new Error('Request timed out. The server may be unavailable.');
        }
        
        if (error.message.includes('fetch') || error.message.includes('network')) {
            console.error('Network error when deleting company:', error);
            throw new Error('Network error. Please check your internet connection.');
        }
        
        console.error('Error in deleteCompany:', error);
        throw error;
    }
};

/**
 * Upload a company logo
 * @param file Logo file
 * @param token Authentication token
 */
const uploadCompanyLogo = async (file: File, token: string) => {
    try {
        if (!file) {
            throw new Error('Logo file is required');
        }

        // Set up timeout for the request (longer for file uploads)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout for uploads

        const formData = new FormData();
        formData.append('logo', file);

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.callsure.ai';
        const response = await fetch(`${apiUrl}/api/company/upload-logo`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData,
            signal: controller.signal,
        });

        // Clear the timeout
        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ 
                error: `Server returned ${response.status}: ${response.statusText}` 
            }));
            throw new Error(errorData.error || 'Failed to upload company logo');
        }

        return await response.json();
    } catch (error: any) {
        // Enhanced error handling
        if (error.name === 'AbortError') {
            console.error('Request timed out when uploading company logo');
            throw new Error('Request timed out. The server may be unavailable.');
        }
        
        if (error.message.includes('fetch') || error.message.includes('network')) {
            console.error('Network error when uploading company logo:', error);
            throw new Error('Network error. Please check your internet connection.');
        }
        
        console.error('Error in uploadCompanyLogo:', error);
        throw error;
    }
};

export {
    createOrUpdateCompany,
    getAllCompanies,
    getCompanyById,
    getCompanyByUserId,
    updateCompany,
    deleteCompany,
    uploadCompanyLogo,
};