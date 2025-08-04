import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getAllGrades = async (page = 1, perPage = 10) => {
  try {
    const response = await axiosInstance.get(
      `${apiEndpoints.getAllGrades}?page=${page}&per_page=${perPage}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};
