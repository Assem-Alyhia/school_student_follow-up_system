// services/financials/index.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getAllFinancials = async (
  page = 1,
  perPage = 10,
  searchTerm = ""
) => {
  try {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("per_page", String(perPage));
    if (searchTerm && String(searchTerm).trim()) {
      params.set("search", String(searchTerm).trim());
    }

    const url = `${apiEndpoints.getAllFinancials}?${params.toString()}`;
    const res = await axiosInstance.get(url);

    if (res.status !== 200) throw new Error("فشل في جلب السجلات المالية");
    return res.data; 
  } catch (err) {
    throw new Error(
      err.response?.data?.message ||
        err.message ||
        "حدث خطأ أثناء جلب السجلات المالية"
    );
  }
};
