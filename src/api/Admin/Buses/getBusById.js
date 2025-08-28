// api/Admin/Buses/getBusById.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

// تأكد من وجود apiEndpoints.getBusById = (id) => `/admin/buses/${id}`
export const getBusById = async (id) => {
  try {
    const res = await axiosInstance.get(apiEndpoints.getBusById(id));
    return res.data?.data;
  } catch (error) {
    console.error("تعذر جلب بيانات الباص:", error);
    throw new Error(error.response?.data?.message || "تعذر جلب بيانات الباص");
  }
};
