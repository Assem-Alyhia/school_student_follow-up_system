// services/financials/index.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";


export const deleteFinancial = async (id) => {
  if (!id) throw new Error("المعرف مطلوب");
  try {
    const res = await axiosInstance.delete(apiEndpoints.deleteFinancial(id));
    if (res.status !== 200) throw new Error("فشل في حذف السجل المالي");
    return res.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.message ||
        err.message ||
        "حدث خطأ أثناء حذف السجل المالي"
    );
  }
};
