import AxiosInstance from "./AxiosInstance"

const ApplicationService = {
    loadApplications: async (search?: string) => {
        try {
            const params = search ? { search } : {};
            const response = await AxiosInstance.get('/application/loadApplications', { params })
            return response
        } catch (error) {
            throw error
        }
    },

    storeApplication: async (data: FormData) => {
        try {
            const response = await AxiosInstance.post('/application/storeApplication', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            return response
        } catch (error) {
            throw error
        }
    },

    updateApplication: async (applicationId: number, data: FormData) => {
        try {
            const response = await AxiosInstance.post(`/application/updateApplication/${applicationId}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            return response
        } catch (error) {
            throw error
        }
    },

    destroyApplication: async (applicationId: number) => {
        try {
            const response = await AxiosInstance.put(`/application/destroyApplication/${applicationId}`)
            return response
        } catch (error) {
            throw error
        }
    },
};

export default ApplicationService
