import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getAllParentsNoPaginate = async () => {
  const response = await axiosInstance.get(
    apiEndpoints.getAllParentsNoPaginate
  );
  return response.data.data;
};
