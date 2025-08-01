// api/Admin/Roles/getRoleById.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getRoleById = async (id) => {
  const response = await axiosInstance.get(apiEndpoints.getRoleById(id));
  return response.data; 
};
