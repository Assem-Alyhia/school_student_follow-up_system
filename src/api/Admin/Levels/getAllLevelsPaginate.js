import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getAllLevelsPaginate = async () => {
  try {
    const res = await axiosInstance.get(apiEndpoints.getAllLevelsPaginate);
    return res.data?.data || [];
  } catch (err) {
    throw new Error(err?.response?.data?.message || "خطأ في جلب المراحل");
  }
};
