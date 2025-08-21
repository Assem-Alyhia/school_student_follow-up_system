import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getAdminDashboard = async () => {
  try {
    const res = await axiosInstance.get(apiEndpoints.getAdminDashboard);

    if (res.status !== 200) {
      throw new Error("فشل في جلب بيانات لوحة التحكم");
    }

    return res.data?.data ?? res.data ?? {};
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء جلب بيانات لوحة التحكم"
    );
  }
};
