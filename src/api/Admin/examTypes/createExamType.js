// api/Admin/ExamTypes/createExamType.js
import apiEndpoints from "../../apiEndpoints";
import axiosInstance from "../../axiosInstance";

export const createExamType = async (payload) => {
  try {
    const res = await axiosInstance.post(apiEndpoints.createExamType, payload);
    if (![200, 201].includes(res.status))
      throw new Error("فشل في إنشاء نوع الامتحان");
    return res.data; // الكائن المُنشأ / رسالة نجاح
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء إنشاء نوع الامتحان"
    );
  }
};
