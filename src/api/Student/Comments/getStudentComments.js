// src/api/Student/Comments/getStudentComments.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";


export const getStudentComments = async (extraParams = {}) => {
  try {
    const response = await axiosInstance.get(apiEndpoints.getStudentComments, {
      params: { ...extraParams },
    });

    if (response.status !== 200) {
      throw new Error("فشل في جلب تعليقات الطالب");
    }

    return Array.isArray(response.data?.data)
      ? response.data.data
      : response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء جلب تعليقات الطالب"
    );
  }
};
