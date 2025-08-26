// src/api/Admin/Financials/updateFinancial.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const updateFinancial = async (id, financialData) => {
  if (!id) throw new Error("المعرف مطلوب");

  try {
    const formData = new FormData();
    for (const key in financialData) {
      const val = financialData[key];
      if (val !== null && val !== undefined && val !== "") {
        formData.append(key, val);
      }
    }

    const response = await axiosInstance.put(
      apiEndpoints.updateFinancial(id), // `admin/financials/${id}`
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "حدث خطأ أثناء تحديث السجل المالي"
    );
  }
};
