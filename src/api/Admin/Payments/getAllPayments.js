// getAllPayments.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getAllPayments = async (page = 1, perPage = 10) => {
  const response = await axiosInstance.get(
    `${apiEndpoints.getAllPayments}?page=${page}&per_page=${perPage}`
  );
  return response.data;
};