// api/Admin/Roles/updateRole.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const updateRole = async (id, payload) => {
  const response = await axiosInstance.put(apiEndpoints.updateRole(id), payload);
  return response.data;
};
