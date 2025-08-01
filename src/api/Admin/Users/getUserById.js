import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getUserById = async (id) => {
  const response = await axiosInstance.get(apiEndpoints.getUserById(id));
  return response.data;
};
