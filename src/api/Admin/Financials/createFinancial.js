// src/api/Admin/Financials/createFinancial.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const createFinancial = async (financialData) => {
  try {
    const formData = new FormData();
    for (const key in financialData) {
      const val = financialData[key];
      if (val !== null && val !== undefined) formData.append(key, val);
    }

    const response = await axiosInstance.post(
      apiEndpoints.createFinancial, // "admin/financials"
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "فشل في إنشاء السجل المالي"
    );
  }
};
