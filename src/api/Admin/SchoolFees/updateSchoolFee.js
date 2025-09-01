// src/api/Admin/SchoolFees/updateSchoolFee.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const updateSchoolFee = async (id, payload) => {
  if (!id) throw new Error("المعرّف مطلوب");
  try {
    const { data } = await axiosInstance.put(
      apiEndpoints.updateSchoolFee(id),
      payload
    );
    return data?.data ?? data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "فشل في تعديل بيانات الرسم"
    );
  }
};
