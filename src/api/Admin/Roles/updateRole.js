// api/Admin/Roles/updateRole.js
import api from "../../api";
import apiEndpoints from "../../apiEndpoints";

export const updateRole = async ({ id, updatedData }) => {
  const response = await api.put(apiEndpoints.updateRole(id), updatedData);
  return response.data;
};
