import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getStudentById = async (id) => {
  try {
    const response = await axiosInstance.get(
      `${apiEndpoints.getStudentById}/${id}`
    );
    if (response.status !== 200) {
      throw new Error("فشل في جلب تفاصيل الطالب");
    }
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};
