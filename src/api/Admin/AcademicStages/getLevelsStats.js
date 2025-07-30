import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getLevelsStats = async () => {
  const response = await axiosInstance.get(apiEndpoints.getLevelsStats);
  return response.data;
};
