// src/api/Admin/Supervisors/createSupervisor.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const createSupervisor = async (supervisorData = {}) => {
  try {
    const formData = new FormData();

    Object.entries(supervisorData || {}).forEach(([key, val]) => {
      if (val === null || val === undefined) return;

      if (Array.isArray(val)) {
        val.forEach((v) => formData.append(`${key}[]`, v));
      } else {
        formData.append(key, val); 
      }
    });

    const response = await axiosInstance.post(
      apiEndpoints.createSupervisor,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error.message || "فشل في إنشاء المشرف"
    );
  }
};
