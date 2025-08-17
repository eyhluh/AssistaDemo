import AxiosInstance from "./AxiosInstance";

const StatisticsService = {
    getDashboardStats: async () => {
        try {
            const response = await AxiosInstance.get("/statistics/dashboard");
            return response;
        } catch (error) {
            throw error;
        }
    },

    getGenderStats: async () => {
        try {
            const response = await AxiosInstance.get("/statistics/gender");
            return response;
        } catch (error) {
            throw error;
        }
    },

    getUserStats: async () => {
        try {
            const response = await AxiosInstance.get("/statistics/users");
            return response;
        } catch (error) {
            throw error;
        }
    }
};

export default StatisticsService;
