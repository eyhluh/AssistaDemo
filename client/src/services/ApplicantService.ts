import AxiosInstance from "./AxiosInstance";

const ApplicantService = {
  loadApplicants: async (page: number, search: string = '') => {
    try {
      const response = await AxiosInstance.get(search
        ? `/applicant/loadApplicants?page=${page}&search=${search}`
        : `/applicant/loadApplicants?page=${page}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  storeApplicant: async (data: any) => {
    try {
      const response = await AxiosInstance.post("/applicant/storeApplicant", data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
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
      const response = await AxiosInstance.post(
        `/applicant/updateApplicant/${applicantId}`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
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
