//classrooms/getAvailableClassrooms.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getAvailableClassrooms = async () => {
  try {
    const { data } = await axiosInstance.get(
      apiEndpoints.getAvailableClassrooms
    );
    return data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "فشل في جلب الشُّعب المتاحة"
    );
  }
};
