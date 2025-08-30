// src/api/Teacher/Comments/deleteTeacherComment.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const deleteTeacherComment = async (commentId) => {
  try {
    const res = await axiosInstance.delete(
      apiEndpoints.deleteTeacherComment(commentId)
    );
    if (res.status !== 200) throw new Error("فشل في حذف التعليق");
    return res.data; 
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء حذف التعليق"
    );
  }
};
