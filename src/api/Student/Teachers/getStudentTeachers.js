import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getStudentTeachers = async (params = {}) => {
  try {
    const res = await axiosInstance.get(apiEndpoints.getStudentTeachers, {
      params,
    });
    if (res.status !== 200) {
      throw new Error("فشل في جلب قائمة المعلمين");
    }
    return res.data; 
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء جلب قائمة المعلمين"
    );
  }
};
