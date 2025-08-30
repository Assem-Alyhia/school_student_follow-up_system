// src/api/Admin/Comments/updateAdminComment.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const updateAdminComment = async (commentId, payload) => {
  try {
    const res = await axiosInstance.put(
      apiEndpoints.updateAdminComment(commentId),
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
