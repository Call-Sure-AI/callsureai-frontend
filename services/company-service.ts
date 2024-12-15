const createOrUpdateCompany = async (formData: any) => {
    try {
        if (!formData.userId) {
            throw new Error('Login required');
        }

        const address = formData.address ? `${formData.address}, ${formData.city}, ${formData.state}, ${formData.zip_code}` : '';

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/company/create-or-update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: `${formData.first_name} ${formData.last_name}`,
                business_name: formData.business_name,
                email: formData.email,
                phone_number: formData.phone,
                address: address,
                user_id: formData.userId,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to create/update company');
        }

        return await response.json();
    } catch (error) {
        console.error('Error in createOrUpdateCompany:', error);
        throw error;
    }
};

const getAllCompanies = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/company`, {
            method: 'GET',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to get companies');
        }

        return await response.json();
    } catch (error) {
        console.error('Error in getAllCompanies:', error);
        throw error;
    }
};

const getCompanyById = async (id: string) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/company/${id}`, {
            method: 'GET',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to get company');
        }

        return await response.json();
    } catch (error) {
        console.error('Error in getCompanyById:', error);
        throw error;
    }
};

const getCompanyByUserId = async (userId: string) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/company?user_id=${userId}`, {
            method: 'GET',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to get companies');
        }

        return await response.json();
    } catch (error) {
        console.error('Error in getCompanyByUserId:', error);
        throw error;
    }
};

const updateCompany = async (id: string, formData: any) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/company/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update company');
        }

        return await response.json();
    } catch (error) {
        console.error('Error in updateCompany:', error);
        throw error;
    }
};

const deleteCompany = async (id: string) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/company/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to delete company');
        }

        return await response.json();
    } catch (error) {
        console.error('Error in deleteCompany:', error);
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
};