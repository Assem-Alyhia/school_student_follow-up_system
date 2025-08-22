// src/api/Supervisor/Students/getSupervisorStudentById.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getSupervisorStudentById = async (id) => {
  try {
    if (!id && id !== 0) throw new Error("معرّف الطالب مفقود");
    const res = await axiosInstance.get(
      apiEndpoints.getSupervisorStudentById(id)
    );
    if (res.status !== 200) throw new Error("فشل في جلب بيانات الطالب (مشرف)");
    return res.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء جلب بيانات الطالب (مشرف)"
    );
  }
};
