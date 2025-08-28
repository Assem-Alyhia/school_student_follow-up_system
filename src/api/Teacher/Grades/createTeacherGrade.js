// api/Teacher/Grades/grades.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

/** 1) إنشاء درجة */
export const createTeacherGrade = async (payload) => {
  try {
    const res = await axiosInstance.post(apiEndpoints.createTeacherGrades, payload);
    if (![200, 201].includes(res.status))
      throw new Error("فشل في إنشاء الدرجة");
    return res.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء إنشاء الدرجة"
    );
  }
};
