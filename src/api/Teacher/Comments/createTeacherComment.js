// src/api/Teacher/Comments/createTeacherComment.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const createTeacherComment = async (payload) => {
  try {
    const res = await axiosInstance.post(
      apiEndpoints.createTeacherComment(),
      payload
    );
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
