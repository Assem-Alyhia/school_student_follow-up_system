// src/api/Admin/Teachers/updateTeacher.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const updateTeacher = async (id, formData) => {
  try {
    const data = new FormData();
    data.append("_method", "PUT");

    Object.entries(formData).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") return;

      if (Array.isArray(value)) {
        value.forEach((v) => data.append(`${key}[]`, v)); 
      } else {
        data.append(key, value);
      }
    });

    const response = await axiosInstance.post(
      apiEndpoints.updateTeacher(id),
      data,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error.message ||
        "فشل في تعديل بيانات المعلم"
    );
  }
};
