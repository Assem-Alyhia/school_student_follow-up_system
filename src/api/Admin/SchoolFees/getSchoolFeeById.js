// src/api/Admin/SchoolFees/getSchoolFeeById.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getSchoolFeeById = async (id) => {
  if (!id) throw new Error("المعرّف مطلوب");
  try {
    const { data } = await axiosInstance.get(apiEndpoints.getSchoolFeeById(id));
    return data?.data ?? data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "فشل في جلب بيانات الرسم"
    );
  }
};
