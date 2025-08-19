import AxiosInstance from "./AxiosInstance";

const SituationService = {
  loadSituations: async () => {
    try {
      const response = await AxiosInstance.get("/situation/loadSituations");
      return response;
    } catch (error) {
      throw error;
    }
  },
  storeSituation: async (data: any) => {
    try {
      const response = await AxiosInstance.post("/situation/storeSituation", data);
      return response;
    } catch (error) {
      throw error;
    }
  },
  getSituation: async (situationId: string | number) => {
    try {
      const response = await AxiosInstance.get(`/situation/getSituation/${situationId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  updateSituation: async (situationId: string | number, data: any) => {
    try {
      const response = await AxiosInstance.put(
        `/situation/updateSituation/${situationId}`,
        data
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
  destroySituation: async (situationId: string | number) => {
    try {
      const response = await AxiosInstance.put(
        `/situation/destroySituation/${situationId}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
};



export default SituationService;
