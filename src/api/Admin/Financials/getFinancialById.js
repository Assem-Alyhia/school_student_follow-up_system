// services/financials/index.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getFinancialById = async (id) => {
  if (!id) throw new Error("المعرف مطلوب");
  const res = await axiosInstance.get(apiEndpoints.getFinancialById(id));
  return res.data?.data ?? res.data;
};
