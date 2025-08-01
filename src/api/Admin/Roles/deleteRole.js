// api/Admin/Roles/deleteRole.js
import axiosInstance from '../../axiosInstance';
import apiEndpoints from "../../apiEndpoints";

export const deleteRole = async (id) => {
  const response = await axiosInstance.delete(apiEndpoints.deleteRole(id));
  return response.data;
};
