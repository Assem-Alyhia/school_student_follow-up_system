// src/api/Admin/Buses/getAllBuses.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getAllBuses = async (page = 1, perPage = 10) => {
  try {
    const response = await axiosInstance.get(
      `${apiEndpoints.getAllBuses}?page=${page}&per_page=${perPage}`
    );

    if (response.status !== 200) {
      throw new Error("فشل في جلب بيانات الباصات");
    }

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "حدث خطأ أثناء جلب الباصات"
    );
  }
};
