// src/api/Admin/Teachers/getAllTeachersNoPaginate.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getAllTeachersNoPaginate = async () => {
  const res = await axiosInstance.get(apiEndpoints.getAllTeachersNoPaginate);
  return res.data?.data || [];
};
