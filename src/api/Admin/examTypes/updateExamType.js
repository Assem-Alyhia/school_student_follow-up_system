// api/Admin/ExamTypes/updateExamType.js
import apiEndpoints from "../../apiEndpoints";
import axiosInstance from "../../axiosInstance";

export const updateExamType = async (id, payload) => {
  try {
    const url = apiEndpoints.updateExamType(id);
    const res = await axiosInstance.put(url, payload);
    if (res.status !== 200) throw new Error("فشل في تحديث نوع الامتحان");
    return res.data; // بعد التحديث
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء تحديث نوع الامتحان"
    );
  }
};
