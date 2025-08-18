import apiEndpoints from "../../apiEndpoints";
import axiosInstance from "../../axiosInstance";

export const getTeacherParentById = async (parentId) => {
  try {
    const url = apiEndpoints.getTeacherParentById(parentId);
    const response = await axiosInstance.get(url);

    if (response.status !== 200) {
      throw new Error("فشل في جلب بيانات وليّ الأمر");
    }

    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء جلب بيانات وليّ الأمر"
    );
  }
};
