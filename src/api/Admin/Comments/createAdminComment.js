// src/api/Admin/Comments/createAdminComment.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const createAdminComment = async (payload) => {
  try {
    const res = await axiosInstance.post(apiEndpoints.createAdminComment(), payload);
    if (res.status !== 201 && res.status !== 200)
      throw new Error("فشل في إنشاء التعليق");
    return res.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء إنشاء التعليق"
    );
  }
};
