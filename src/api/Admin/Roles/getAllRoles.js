// src/api/Admin/Roles/getAllRoles.js

import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getAllRoles = async () => {
  try {
    const response = await axiosInstance.get(apiEndpoints.getAllRoles);
    return response.data.data; // assuming roles are under data key
  } catch (error) {
    throw new Error(error?.response?.data?.message || "فشل في جلب الأدوار");
  }
};
