import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getAllLevels = async () => {
  try {
    const res = await axiosInstance.get(apiEndpoints.getAllLevels);
    return res.data?.data || [];
  } catch (err) {
    throw new Error(err?.response?.data?.message || "خطأ في جلب المراحل");
  }
};
