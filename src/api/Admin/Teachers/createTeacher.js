// src/api/Admin/Teachers/createTeacher.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const createTeacher = async (teacherData) => {
  try {
    const formData = new FormData();

    Object.entries(teacherData || {}).forEach(([key, val]) => {
      if (val === null || val === undefined) return;

      if (Array.isArray(val)) {
        val.forEach((v) => formData.append(`${key}[]`, v));
      } else {
        formData.append(key, val);
      }
    });

    const response = await axiosInstance.post(
      apiEndpoints.createTeacher,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error.message || "فشل في إنشاء المعلم"
    );
  }
};
