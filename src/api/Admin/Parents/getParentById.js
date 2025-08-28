// src/api/Admin/Parents/getParentById.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getParentById = async (id) => {
  const response = await axiosInstance.get(apiEndpoints.getParentById(id));
  return response.data.data;
};
