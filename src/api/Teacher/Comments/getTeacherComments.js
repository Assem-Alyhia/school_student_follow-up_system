// src/api/Teacher/Comments/getTeacherComments.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getTeacherComments = async (params = {}) => {
  try {
    const res = await axiosInstance.get(apiEndpoints.teacherComments(), {
      params,
    });
    if (res.status !== 200) throw new Error("فشل في جلب التعليقات");
    return res.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء جلب التعليقات"
    );
  }
};
