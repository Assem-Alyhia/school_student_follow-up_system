import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getAllStudentsNoPaginate = async () => {
  const response = await axiosInstance.get(
    apiEndpoints.getAllStudentsNoPaginate
  );
  return response.data.data;
};
