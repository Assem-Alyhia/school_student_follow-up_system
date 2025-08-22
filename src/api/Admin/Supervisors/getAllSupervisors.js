import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getAllSupervisors = async (page = 1, perPage = 10) => {
  try {
    const response = await axiosInstance.get(apiEndpoints.getAllSupervisors, {
      params: {
        page,
        per_page: perPage, 
      },
    });
    return {
      data: response.data.data,
      meta: response.data.meta || {}, 
      links: response.data.links || {},
    };
  } catch (error) {
    throw new Error(error?.response?.data?.message || "فشل في جلب المشرفين");
  }
};
