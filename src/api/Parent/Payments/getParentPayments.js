// api/Parent/Payments/getParentPayments.js
import apiEndpoints from "../../apiEndpoints";
import axiosInstance from "../../axiosInstance";

export const getParentPayments = async (page = 1, per_page = 10) => {
  try {
    const params = typeof page === "object" ? page : { page, per_page };

    const res = await axiosInstance.get(apiEndpoints.getParentPayments, {
      params,
    });
    if (res.status !== 200) throw new Error("فشل في جلب مدفوعات وليّ الأمر");

    return res.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء جلب مدفوعات وليّ الأمر"
    );
  }
};
