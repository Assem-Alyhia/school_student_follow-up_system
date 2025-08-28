// api/Admin/ExamResults/deleteExamResult.js
import apiEndpoints from "../../apiEndpoints";
import axiosInstance from "../../axiosInstance";

export const deleteExamResult = async (id) => {
  try {
    const url = apiEndpoints.deleteExamResult(id);
    const res = await axiosInstance.delete(url);
    if (![200, 204].includes(res.status))
      throw new Error("فشل في حذف نتيجة الامتحان");
    return res.data ?? { success: true }; // في حال 204 بدون جسم
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء حذف نتيجة الامتحان"
    );
  }
};
