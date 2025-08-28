// 📁 api/Parent/Teachers/getParentTeachers.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getParentTeachers = async (page, per_page) => {
  try {
    const params =
      typeof page === "object" && page !== null ? page : { page, per_page };

    const res = await axiosInstance.get(apiEndpoints.getParentTeachers, {
      params,
    });
    if (res.status !== 200) throw new Error("فشل في جلب قائمة المعلّمين");
    return res.data; 
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء جلب قائمة المعلّمين"
    );
  }
};
