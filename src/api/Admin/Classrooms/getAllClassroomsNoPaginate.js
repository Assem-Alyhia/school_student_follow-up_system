import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getAllClassroomsNoPaginate = async () => {
  const response = await axiosInstance.get(
    apiEndpoints.getAllClassroomsNoPaginate
  );
  return response.data.data;
};
