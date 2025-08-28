// src/api/Admin/Permissions/deletePermission.js

import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const deletePermission = async (id) => {
  try {
    const response = await axiosInstance.delete(
      apiEndpoints.deletePermission(id)
    );
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "فشل في حذف الصلاحية");
  }
};
