// api/Admin/ExamResults/createExamResult.js
import apiEndpoints from "../../apiEndpoints";
import axiosInstance from "../../axiosInstance";

export const createExamResult = async (payload) => {
  try {
    const res = await axiosInstance.post(
      apiEndpoints.createExamResult,
      payload
    );
    if (![200, 201].includes(res.status))
      throw new Error("فشل في إنشاء نتيجة الامتحان");
    return res.data; // رسالة نجاح/الكائن المُنشأ
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء إنشاء نتيجة الامتحان"
    );
  }
};
