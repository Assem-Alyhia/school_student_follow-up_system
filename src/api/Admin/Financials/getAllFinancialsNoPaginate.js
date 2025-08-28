// services/financials/index.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

// بدون pagination (GET /admin/financials/get-all)
export const getAllFinancialsNoPaginate = async () => {
  const res = await axiosInstance.get(apiEndpoints.getAllFinancialsNoPaginate);
  return res.data?.data ?? res.data;
};


