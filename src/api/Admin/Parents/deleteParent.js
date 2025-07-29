// src/api/Admin/Parents/deleteParent.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const deleteParent = async (id) => {
  try {
    const response = await axiosInstance.delete(apiEndpoints.deleteParent(id));
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "فشل في حذف ولي الأمر");
  }
};
