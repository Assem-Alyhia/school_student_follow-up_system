// src/api/Supervisor/Buses/getSupervisorBuses.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getSupervisorBuses = async (
  page = 1,
  per_page = 10,
  extraParams = {}
) => {
  try {
    const params =
      typeof page === "object" ? page : { page, per_page, ...extraParams };

    const res = await axiosInstance.get(apiEndpoints.getSupervisorBuses, {
      params,
    });

    if (res.status !== 200) throw new Error("فشل في جلب الحافلات (مشرف)");
    return res.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء جلب قائمة الحافلات (مشرف)"
    );
  }
};
