import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getAllSupervisorsNoPaginate = async () => {
  const response = await axiosInstance.get(
    apiEndpoints.getAllSupervisorsNoPaginate
  );
  return response.data.data;
};
