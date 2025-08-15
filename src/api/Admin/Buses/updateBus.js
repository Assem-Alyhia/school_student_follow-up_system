// api/Admin/Buses/updateBus.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

// تأكد من وجود apiEndpoints.updateBus = (id) => `/admin/buses/${id}`
export const updateBus = async (id, data) => {
  try {
    const res = await axiosInstance.put(apiEndpoints.updateBus(id), data);
    return res.data?.data;
  } catch (error) {
    console.error("فشل في تعديل بيانات الباص:", error);
    throw new Error(error.response?.data?.message || "فشل في تعديل الباص");
  }
};
