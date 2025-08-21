// 📁 api/Exams/getAllExamResults.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getAllExamResults = async (page, per_page) => {
  try {
    const params =
      typeof page === "object" && page !== null ? page : { page, per_page };

    const res = await axiosInstance.get(apiEndpoints.getAllExamResults, {
      params,
    });
    if (res.status !== 200) throw new Error("فشل في جلب نتائج الامتحانات");
    return res.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء جلب نتائج الامتحانات"
    );
  }
};
