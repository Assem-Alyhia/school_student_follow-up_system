// src/api/Teacher/Comments/updateTeacherComment.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const updateTeacherComment = async (commentId, payload) => {
  try {
    const res = await axiosInstance.put(
      apiEndpoints.updateTeacherComment(commentId),
      payload
    );
    if (res.status !== 200) throw new Error("فشل في تحديث التعليق");
    return res.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء تحديث التعليق"
    );
  }
};
