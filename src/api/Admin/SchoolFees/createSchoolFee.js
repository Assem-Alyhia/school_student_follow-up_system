// src/api/Admin/SchoolFees/createSchoolFee.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const createSchoolFee = async (payload) => {
  try {
    const { data } = await axiosInstance.post(
      apiEndpoints.createSchoolFee,
      payload
    );
    return data?.data ?? data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "فشل في إنشاء الرسم الدراسي"
    );
  }
};
