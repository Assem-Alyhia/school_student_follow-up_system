import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const createPermission = async (permissionName) => {
  try {
    const response = await axiosInstance.post(apiEndpoints.createPermission, {
      name: permissionName,
    });

    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "فشل في إنشاء الصلاحية");
  }
};
