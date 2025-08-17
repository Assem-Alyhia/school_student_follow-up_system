// src/api/Admin/Parents/createParent.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const createParent = async (parentData) => {
  try {
    const formData = new FormData();

    for (const key in parentData) {
      if (parentData[key] !== null && parentData[key] !== undefined) {
        formData.append(key, parentData[key]);
      }
    }

    const response = await axiosInstance.post(
      apiEndpoints.getAllParents, 
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "فشل في إنشاء وليّ الأمر"
    );
  }
};
