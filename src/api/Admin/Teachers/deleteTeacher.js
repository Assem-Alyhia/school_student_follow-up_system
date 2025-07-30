// src/api/Admin/Teachers/deleteTeacher.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const deleteTeacher = async (id) => {
  const response = await axiosInstance.delete(apiEndpoints.deleteTeacher(id));
  return response.data;
};
