// api/Admin/ExamResults/getExamResultById.js
import apiEndpoints from "../../apiEndpoints";
import axiosInstance from "../../axiosInstance";

export const getExamResultById = async (id) => {
  try {
    const url = apiEndpoints.getExamResultById(id);
    const res = await axiosInstance.get(url);
    if (res.status !== 200) throw new Error("فشل في جلب نتيجة الامتحان");
    return res.data; // { data: {...} }
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء جلب نتيجة الامتحان"
    );
  }
};
