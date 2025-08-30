// src/api/Admin/Comments/deleteAdminComment.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const deleteAdminComment = async (commentId) => {
  try {
    const res = await axiosInstance.delete(
      apiEndpoints.deleteAdminComment(commentId)
    );
    if (![200, 204].includes(res.status)) throw new Error("فشل في حذف التعليق");
    return res.data ?? { success: true };
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء حذف التعليق"
    );
  }
};
