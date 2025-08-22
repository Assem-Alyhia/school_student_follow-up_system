// src/api/Supervisor/Students/updateSupervisorStudent.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const updateSupervisorStudent = async (id, payload) => {
  try {
    if (!id && id !== 0) throw new Error("معرّف الطالب مفقود");
    const res = await axiosInstance.put(
      apiEndpoints.updateSupervisorStudent(id),
      payload
    );
    if (res.status !== 200)
      throw new Error("فشل في تحديث بيانات الطالب (مشرف)");
    return res.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء تحديث بيانات الطالب (مشرف)"
    );
  }
};
