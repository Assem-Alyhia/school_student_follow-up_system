// src/api/Supervisor/Parents/getSupervisorParents.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getSupervisorParents = async (
  page = 1,
  per_page = 10,
  extraParams = {}
) => {
  try {
    const params =
      typeof page === "object" ? page : { page, per_page, ...extraParams };

    const res = await axiosInstance.get(apiEndpoints.getSupervisorParents, {
      params,
    });

    if (res.status !== 200) throw new Error("فشل في جلب قائمة الآباء (مشرف)");
    return res.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء جلب قائمة الآباء (مشرف)"
    );
  }
};
