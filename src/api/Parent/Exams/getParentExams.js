// api/Parent/Exams/getParentExams.js
import apiEndpoints from "../../apiEndpoints";
import axiosInstance from "../../axiosInstance";

export const getParentExams = async (params = {}) => {
  try {
    const res = await axiosInstance.get(apiEndpoints.getParentExams, {
      params,
    });

    if (res.status !== 200) {
      throw new Error("فشل في جلب الامتحانات");
    }

    return res.data; 
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء جلب الامتحانات"
    );
  }
};
