// src/api/Admin/Permissions/getPermissionById.js

import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getPermissionById = async (id) => {
  try {
    const response = await axiosInstance.get(
      apiEndpoints.getPermissionById(id)
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "فشل في جلب تفاصيل الصلاحية"
    );
  }
};
