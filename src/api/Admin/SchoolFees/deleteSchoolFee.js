// src/api/Admin/SchoolFees/deleteSchoolFee.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const deleteSchoolFee = async (id) => {
  if (!id) throw new Error("المعرّف مطلوب");
  try {
    const { data } = await axiosInstance.delete(
      apiEndpoints.deleteSchoolFee(id)
    );
    return data?.data ?? data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "فشل في حذف الرسم الدراسي"
    );
  }
};
