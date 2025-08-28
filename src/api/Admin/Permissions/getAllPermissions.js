// src/api/Admin/Permissions/getAllPermissions.js

import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getAllPermissions = async (page = 1, perPage = 10) => {
  try {
    const response = await axiosInstance.get(
      `${apiEndpoints.getAllPermissions}?page=${page}&per_page=${perPage}`
    );

    if (response.status !== 200) {
      throw new Error("فشل في جلب الصلاحيات");
    }

    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error.message ||
        "حدث خطأ أثناء جلب الصلاحيات"
    );
  }
};
