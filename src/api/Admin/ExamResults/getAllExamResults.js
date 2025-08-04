// 📁 المسار المقترح: api/Exams/getAllExamResults.js

import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getAllExamResults = async () => {
  try {
    const response = await axiosInstance.get(apiEndpoints.getAllExamResults);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};
