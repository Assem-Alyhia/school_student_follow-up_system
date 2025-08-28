// api/Admin/ExamTypes/getAllExamTypes.js
import apiEndpoints from "../../apiEndpoints";
import axiosInstance from "../../axiosInstance";

export const getAllExamTypes = async (params = {}) => {
  try {
    const res = await axiosInstance.get(apiEndpoints.getAllExamTypes, {
      params,
    });
    if (res.status !== 200) throw new Error("فشل في جلب أنواع الامتحانات");
    return res.data; 
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء جلب أنواع الامتحانات"
    );
  }
};
