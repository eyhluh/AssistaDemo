import AxiosInstance from "./AxiosInstance"

interface RegisterData {
    first_name: string;
    middle_name?: string;
    last_name: string;
    suffix_name?: string;
    contact_number: string;
    gmail: string;
    password: string;
    password_confirmation: string;
}

interface LoginData {
    gmail: string;
    password: string;
}

const AuthService = {
    register: async (data: RegisterData) => {
        try {
            const response = await AxiosInstance.post('/auth/register', data)
            return response
        } catch (error) {
            throw error
        }
    },

    login: async (data: LoginData) => {
        try {
            const response = await AxiosInstance.post('/auth/login', data)
            return response
        } catch (error) {
            throw error
        }
    },

    logout: async () => {
        try {
            const response = await AxiosInstance.post('/auth/logout')
            return response
        } catch (error) {
            throw error
        }
    },
    
    me: async () => {
        try {
            const response = await AxiosInstance.get('auth/me')
            return response
        } catch (error) {
            throw error;
        }
    },
};

export default AuthService
                