import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getTeacherById = async (id) => {
  try {
    const response = await axiosInstance.get(apiEndpoints.getTeacherById(id));

    if (response.status !== 200) {
      throw new Error("فشل في جلب بيانات المعلم");
    }

    return response.data; 
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "حدث خطأ أثناء جلب بيانات المعلم"
    );
  }
};
