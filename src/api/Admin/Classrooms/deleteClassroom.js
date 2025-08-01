// src/api/Admin/Classrooms/deleteClassroom.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const deleteClassroom = async (id) => {
  try {
    const response = await axiosInstance.delete(
      apiEndpoints.deleteClassroom(id)
    );
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "فشل في حذف الصف");
  }
};
