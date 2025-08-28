import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getAllSchoolFees = async () => {
  try {
    const response = await axiosInstance.get(apiEndpoints.getAllSchoolFees);
    return response.data.data;
  } catch (error) {
  throw new Error(error?.response?.data?.message || "فشل في جلب الرسوم الدراسية ");
}

};
