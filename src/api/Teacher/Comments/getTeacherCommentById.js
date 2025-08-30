// src/api/Teacher/Comments/getTeacherCommentById.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getTeacherCommentById = async (commentId) => {
  try {
    const res = await axiosInstance.get(
      apiEndpoints.getTeacherCommentById(commentId)
    );
    if (res.status !== 200) throw new Error("فشل في جلب التعليق");
    return res.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء جلب التعليق"
    );
  }
};
