import axiosInstance from "../../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getScheduleById = async (id) => {
  const response = await axiosInstance.get(apiEndpoints.getScheduleById(id));
  return response.data.data;
};
