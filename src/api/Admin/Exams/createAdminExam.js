// api/Admin/Exams/createAdminExam.js
import apiEndpoints from "../../apiEndpoints";
import axiosInstance from "../../axiosInstance";

export const createAdminExam = async (payload) => {
  try {
    const res = await axiosInstance.post(apiEndpoints.createAdminExam, payload);
    if (![200, 201].includes(res.status))
      throw new Error("فشل في إنشاء الامتحان");
    return res.data; 
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء إنشاء الامتحان"
    );
  }
};
