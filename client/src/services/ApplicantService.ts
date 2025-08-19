import AxiosInstance from "./AxiosInstance";

const ApplicantService = {
  loadApplicants: async () => {
    try {
      const response = await AxiosInstance.get("/applicant/loadApplicants");
      return response;
    } catch (error) {
      throw error;
    }
  },
  storeApplicant: async (data: any) => {
    try {
      const response = await AxiosInstance.post("/applicant/storeApplicant", data);
      return response;
    } catch (error) {
      throw error;
    }
  },
  getApplicant: async (applicantId: string | number) => {
    try {
      const response = await AxiosInstance.get(`/applicant/getApplicant/${applicantId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  updateApplicant: async (applicantId: string | number, data: any) => {
    try {
      const response = await AxiosInstance.put(
        `/applicant/updateApplicant/${applicantId}`,
        data
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
  destroyApplicant: async (applicantId: string | number) => {
    try {
      const response = await AxiosInstance.put(
        `/applicant/destroyApplicant/${applicantId}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
};



export default ApplicantService;
