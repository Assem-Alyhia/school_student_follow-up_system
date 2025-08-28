import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const createGrade = async (payload) => {
  try {
    const res = await axiosInstance.post(apiEndpoints.createGrade, payload);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};
