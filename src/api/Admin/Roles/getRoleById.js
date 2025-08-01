// api/Admin/Roles/getRoleById.js
import api from "../../api";
import apiEndpoints from "../../apiEndpoints";

export const getRoleById = async (id) => {
  const response = await api.get(apiEndpoints.getRoleById(id));
  return response.data;
};
