// api/Admin/Exams/getAdminExamsList.js
import apiEndpoints from "../../apiEndpoints";
import axiosInstance from "../../axiosInstance";

// نسخة تدعم page/per_page مباشرة
export const getAdminExamsList = async (page, per_page) => {
  try {
    const params = typeof page === "object" ? page : { page, per_page }; // مرونة: تدعم الكائن أو القيمتين
    const res = await axiosInstance.get(apiEndpoints.getAdminExams, { params });
    if (res.status !== 200) throw new Error("فشل في جلب قائمة الامتحانات");
    return res.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء جلب قائمة الامتحانات"
    );
  }
};
