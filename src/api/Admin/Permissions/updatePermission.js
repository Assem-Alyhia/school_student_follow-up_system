// src/api/Admin/Permissions/updatePermission.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const updatePermission = async (id, name) => {
  if (!id) throw new Error("المعرف غير متوفر");

  const response = await axiosInstance.put(apiEndpoints.updatePermission(id), {
    name,
  });

  return response.data;
};
