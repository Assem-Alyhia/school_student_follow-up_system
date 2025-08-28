// api/Admin/Buses/createBus.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

// تأكد من وجود apiEndpoints.createBus = "/admin/buses"
export const createBus = async (data) => {
  try {
    const res = await axiosInstance.post(apiEndpoints.createBus, data);
    return res.data?.data;
  } catch (error) {
    console.error("فشل في إنشاء الباص:", error);
    throw new Error(error.response?.data?.message || "فشل في إضافة باص جديد");
  }
};
