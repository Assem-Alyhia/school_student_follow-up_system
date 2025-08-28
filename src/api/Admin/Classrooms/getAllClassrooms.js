// src/api/Admin/Classrooms/getAllClassrooms.js

import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getAllClassrooms = async (page = 1, rowsPerPage = 10) => {
  try {
    const response = await axiosInstance.get(apiEndpoints.getAllClassrooms, {
      params: {
        page,
        per_page: rowsPerPage,
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "فشل في جلب الصفوف");
  }
};
