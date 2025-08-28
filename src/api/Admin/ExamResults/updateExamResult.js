// api/Admin/ExamResults/updateExamResult.js
import apiEndpoints from "../../apiEndpoints";
import axiosInstance from "../../axiosInstance";

export const updateExamResult = async (id, payload) => {
  try {
    const url = apiEndpoints.updateExamResult(id);
    const res = await axiosInstance.put(url, payload);
    if (res.status !== 200) throw new Error("فشل في تحديث نتيجة الامتحان");
    return res.data; // بعد التحديث
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء تحديث نتيجة الامتحان"
    );
  }
};
