import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getAllSchoolFeesNoPaginate = async () => {
  const response = await axiosInstance.get(
    apiEndpoints.getAllSchoolFeesNoPaginate
  );
  return response.data.data;
};
