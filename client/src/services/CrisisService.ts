import AxiosInstance from "./AxiosInstance";

const crisisService = {
  loadCrisiss: async () => {
    try {
      const response = await AxiosInstance.get("/crisis/loadCrisiss");
      return response;
    } catch (error) {
      throw error;
    }
  },
  storeCrisis: async (data: any) => {
    try {
      const response = await AxiosInstance.post("/crisis/storeCrisis", data);
      return response;
    } catch (error) {
      throw error;
    }
  },
  getCrisis: async (crisisId: string | number) => {
    try {
      const response = await AxiosInstance.get(`/crisis/getCrisis/${crisisId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  updateCrisis: async (crisisId: string | number, data: any) => {
    try {
      const response = await AxiosInstance.put(
        `/crisis/updateCrisis/${crisisId}`,
        data
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
  destroyCrisis: async (crisisId: string | number) => {
    try {
      const response = await AxiosInstance.put(
        `/crisis/destroyCrisis/${crisisId}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default crisisService;
