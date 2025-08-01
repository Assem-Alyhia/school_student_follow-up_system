// api/Admin/Roles/deleteRole.js
import api from "../../api";
import apiEndpoints from "../../apiEndpoints";

export const deleteRole = async (id) => {
  const response = await api.delete(apiEndpoints.deleteRole(id));
  return response.data;
};
