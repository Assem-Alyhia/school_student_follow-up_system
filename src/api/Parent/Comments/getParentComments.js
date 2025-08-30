// src/api/Parent/Comments/getParentComments.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";


export const getParentComments = async (params = {}) => {
  try {
    const res = await axiosInstance.get(apiEndpoints.parentComments(), {
      params: params?.student_id
        ? { student_id: Number(params.student_id) }
        : undefined,
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
